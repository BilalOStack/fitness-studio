import { requireAuth } from '../../../lib/auth';
import { query } from '../../../lib/db';
import { getStripe } from '../../../lib/stripe';

export async function POST(request) {
  try {
    // Step 3: Login check (middleware) that blocks checkout for anyone who isn't signed in
    const { user, errorResponse } = await requireAuth(request);
    if (errorResponse) {
      return errorResponse;
    }

    const body = await request.json();
    // Support both { itemType, itemId, quantity } and { items: [...] }
    const requestedItems = Array.isArray(body.items)
      ? body.items
      : [{ itemType: body.itemType || 'plan', itemId: body.itemId || body.planId || body.classId, quantity: body.quantity || body.spots || 1 }];

    if (!requestedItems.length || !requestedItems[0].itemId) {
      return Response.json({ error: 'Please specify a valid item to purchase.' }, { status: 400 });
    }

    const resolvedItems = [];
    let totalAmountCents = 0;

    // Step 4: Look up the product's REAL price from our database (NEVER trust a price sent from the browser)
    for (const reqItem of requestedItems) {
      const itemType = reqItem.itemType === 'class' ? 'class' : 'plan';
      const itemId = String(reqItem.itemId);
      const quantity = Math.max(1, parseInt(reqItem.quantity, 10) || 1);

      if (itemType === 'class') {
        const classRes = await query(
          'SELECT id, title, category, time, trainer, spots_available, price FROM classes WHERE id = $1',
          [parseInt(itemId, 10)]
        );
        if (classRes.rows.length === 0) {
          return Response.json({ error: `Class #${itemId} not found.` }, { status: 404 });
        }
        const cls = classRes.rows[0];
        if (cls.spots_available < quantity) {
          return Response.json(
            { error: `Only ${cls.spots_available} spot(s) remaining for "${cls.title}".` },
            { status: 400 }
          );
        }

        const unitPriceCents = (cls.price || 15) * 100; // Convert dollars to cents
        resolvedItems.push({
          itemType: 'class',
          itemId: String(cls.id),
          itemName: `${cls.title} (${cls.category} w/ ${cls.trainer})`,
          description: `Drop-in class pass — ${cls.time}`,
          quantity,
          unitPriceCents,
        });
        totalAmountCents += unitPriceCents * quantity;
      } else {
        const planRes = await query(
          'SELECT id, name, price, period FROM pricing_plans WHERE id = $1',
          [itemId]
        );
        if (planRes.rows.length === 0) {
          return Response.json({ error: `Membership plan "${itemId}" not found.` }, { status: 404 });
        }
        const plan = planRes.rows[0];
        const unitPriceCents = Number(plan.price) * 100; // Convert dollars to cents

        resolvedItems.push({
          itemType: 'plan',
          itemId: String(plan.id),
          itemName: `PulseFit ${plan.name} Membership`,
          description: `Membership tier (${plan.period})`,
          quantity,
          unitPriceCents,
        });
        totalAmountCents += unitPriceCents * quantity;
      }
    }

    // Create the pending order record in `orders` table tied to the authenticated user
    const orderResult = await query(
      `INSERT INTO orders (user_id, status, total_amount)
       VALUES ($1, 'pending', $2)
       RETURNING id, created_at`,
      [user.id, totalAmountCents]
    );
    const orderId = orderResult.rows[0].id;

    // Insert each purchased item into `order_items` table
    for (const item of resolvedItems) {
      await query(
        `INSERT INTO order_items (order_id, item_type, item_id, item_name, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.itemType, item.itemId, item.itemName, item.quantity, item.unitPriceCents]
      );
    }

    // Determine origin URL for Stripe redirect
    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      new URL(request.url).origin;

    const stripe = getStripe();

    // Start a real Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email,
      client_reference_id: String(orderId),
      metadata: {
        orderId: String(orderId),
        userId: String(user.id),
      },
      line_items: resolvedItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.itemName,
            description: item.description,
          },
          unit_amount: item.unitPriceCents,
        },
        quantity: item.quantity,
      })),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${origin}/#pricing`,
    });

    // Save the Stripe session ID on the order record
    await query('UPDATE orders SET stripe_session_id = $1 WHERE id = $2', [session.id, orderId]);

    return Response.json({
      orderId,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json(
      { error: error.message || 'Failed to create Stripe Checkout session.' },
      { status: 500 }
    );
  }
}
