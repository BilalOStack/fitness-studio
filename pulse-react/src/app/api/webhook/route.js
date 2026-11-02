import { query } from '../../../lib/db';
import { getStripe } from '../../../lib/stripe';

/**
 * Step 5: Webhook route that Stripe calls back on once a payment actually completes.
 * This is the ONLY route allowed to mark an order as "paid".
 */
export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature) {
      return Response.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured in .env.local');
      return Response.json(
        { error: 'Webhook secret not configured on server.' },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    let event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      return Response.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata?.orderId || session.client_reference_id;
      const stripeSessionId = session.id;
      const paymentIntentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id || null;

      // Find the order and transition from pending -> paid idempotently
      let updateResult;
      if (orderId) {
        updateResult = await query(
          `UPDATE orders
           SET status = 'paid',
               stripe_session_id = COALESCE(stripe_session_id, $1),
               stripe_payment_intent_id = $2,
               paid_at = CURRENT_TIMESTAMP
           WHERE id = $3 AND status != 'paid'
           RETURNING id, user_id`,
          [stripeSessionId, paymentIntentId, parseInt(orderId, 10)]
        );
      } else {
        updateResult = await query(
          `UPDATE orders
           SET status = 'paid',
               stripe_payment_intent_id = $1,
               paid_at = CURRENT_TIMESTAMP
           WHERE stripe_session_id = $2 AND status != 'paid'
           RETURNING id, user_id`,
          [paymentIntentId, stripeSessionId]
        );
      }

      // If this order was just marked paid, also fulfill any class pass items by decrementing spots & adding a booking
      if (updateResult.rows.length > 0) {
        const paidOrder = updateResult.rows[0];
        console.log(`✅ Order #${paidOrder.id} marked as PAID via Stripe webhook.`);

        const itemsResult = await query(
          `SELECT item_type, item_id, quantity FROM order_items WHERE order_id = $1`,
          [paidOrder.id]
        );

        for (const item of itemsResult.rows) {
          if (item.item_type === 'class') {
            const classId = parseInt(item.item_id, 10);
            const qty = item.quantity || 1;
            await query(
              `UPDATE classes SET spots_available = GREATEST(0, spots_available - $1) WHERE id = $2`,
              [qty, classId]
            );
            await query(
              `INSERT INTO bookings (user_id, class_id, spots) VALUES ($1, $2, $3)`,
              [paidOrder.user_id, classId, qty]
            );
          }
        }
      } else {
        console.log(`ℹ️ Webhook received for session ${stripeSessionId} (order already paid or not found).`);
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return Response.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
