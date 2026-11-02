import { requireAuth } from '../../../lib/auth';
import { query } from '../../../lib/db';

/**
 * Step 7: Order lookup endpoint
 * Supports looking up a specific order via ?order_id=... or ?session_id=...
 * or listing all orders for the signed-in user.
 */
export async function GET(request) {
  try {
    const { user, errorResponse } = await requireAuth(request);
    if (errorResponse) {
      return errorResponse;
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id') || searchParams.get('orderId');
    const sessionId = searchParams.get('session_id') || searchParams.get('sessionId');

    // If looking up a specific order by order_id or session_id
    if (orderId || sessionId) {
      let orderRes;
      if (orderId) {
        orderRes = await query(
          `SELECT id, user_id, status, total_amount, stripe_session_id, stripe_payment_intent_id, paid_at, created_at
           FROM orders
           WHERE id = $1 AND user_id = $2`,
          [parseInt(orderId, 10), user.id]
        );
      } else {
        orderRes = await query(
          `SELECT id, user_id, status, total_amount, stripe_session_id, stripe_payment_intent_id, paid_at, created_at
           FROM orders
           WHERE stripe_session_id = $1 AND user_id = $2`,
          [sessionId, user.id]
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
    }

    // Otherwise, list all orders for the current user
    const ordersRes = await query(
      `SELECT id, user_id, status, total_amount, stripe_session_id, paid_at, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [user.id]
    );

    const orders = [];
    for (const order of ordersRes.rows) {
      const itemsRes = await query(
        `SELECT id, item_type, item_id, item_name, quantity, unit_price
         FROM order_items
         WHERE order_id = $1
         ORDER BY id ASC`,
        [order.id]
      );
      orders.push({
        id: order.id,
        status: order.status,
        totalAmount: order.total_amount,
        stripeSessionId: order.stripe_session_id,
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
    }

    return Response.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
