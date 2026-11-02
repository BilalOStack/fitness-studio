import { requireAuth } from '../../../../lib/auth';
import { query } from '../../../../lib/db';

/**
 * Step 7: Order lookup endpoint by ID: GET /api/orders/[id]
 */
export async function GET(request, context) {
  try {
    const { user, errorResponse } = await requireAuth(request);
    if (errorResponse) {
      return errorResponse;
    }

    const params = await context.params;
    const rawId = params.id;

    let orderRes;
    if (/^\d+$/.test(String(rawId))) {
      orderRes = await query(
        `SELECT id, user_id, status, total_amount, stripe_session_id, stripe_payment_intent_id, paid_at, created_at
         FROM orders
         WHERE id = $1 AND user_id = $2`,
        [parseInt(rawId, 10), user.id]
      );
    } else {
      // Allow lookup by Stripe session ID (cs_test_...)
      orderRes = await query(
        `SELECT id, user_id, status, total_amount, stripe_session_id, stripe_payment_intent_id, paid_at, created_at
         FROM orders
         WHERE stripe_session_id = $1 AND user_id = $2`,
        [String(rawId), user.id]
      );
    }

    if (orderRes.rows.length === 0) {
      return Response.json({ error: 'Order not found.' }, { status: 404 });
    }

    const order = orderRes.rows[0];
    const itemsRes = await query(
      `SELECT id, item_type, item_id, item_name, quantity, unit_price
       FROM order_items
       WHERE order_id = $1
       ORDER BY id ASC`,
      [order.id]
    );

    return Response.json({
      id: order.id,
      userId: order.user_id,
      status: order.status,
      totalAmount: order.total_amount,
      stripeSessionId: order.stripe_session_id,
      stripePaymentIntentId: order.stripe_payment_intent_id,
      paidAt: order.paid_at,
      createdAt: order.created_at,
      items: itemsRes.rows.map((item) => ({
        id: item.id,
        itemType: item.item_type,
        itemId: item.item_id,
        itemName: item.item_name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
      })),
    });
  } catch (error) {
    console.error('Error looking up order:', error);
    return Response.json({ error: 'Failed to look up order' }, { status: 500 });
  }
}
