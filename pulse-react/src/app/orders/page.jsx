'use client';

import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';

export default function OrdersPage() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('pulsefit_token') : null;
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders', { headers, cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load orders.');
      }
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Could not load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !user) return;
    fetchOrders();
  }, [user, authLoading]);

  return (
    <div className="min-h-screen flex flex-col bg-[#121220] text-[#eaeaf0]">
      <Header />
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#e63946]">
              PostgreSQL Database (`orders` &amp; `order_items`)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              My Orders &amp; Payment History
            </h1>
            <p className="text-sm text-[#9a9ab0] mt-1">
              Live rows from the <code className="text-[#f4a261]">orders</code> and <code className="text-[#f4a261]">order_items</code> tables tied to your account.
            </p>
          </div>
          {user && (
            <button
              type="button"
              onClick={fetchOrders}
              className="self-start sm:self-auto bg-[#27273a] hover:bg-[#3a3a50] border border-[#3a3a50] text-xs font-semibold text-white px-4 py-2 rounded-lg transition"
            >
              ↻ Refresh Table
            </button>
          )}
        </div>

        {!user && !authLoading ? (
          <div className="bg-[#27273a] border border-[#3a3a50] rounded-xl p-8 text-center space-y-4">
            <p className="text-base text-white font-semibold">
              Please sign in to view your orders.
            </p>
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="bg-[#e63946] hover:bg-[#b52d38] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition"
            >
              Sign In
            </button>
          </div>
        ) : loading ? (
          <div className="bg-[#27273a] border border-[#3a3a50] rounded-xl p-10 text-center text-[#9a9ab0]">
            Loading orders from database...
          </div>
        ) : error ? (
          <div className="bg-[#27273a] border border-red-500/40 rounded-xl p-6 text-red-300 text-sm">
            ⚠️ {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#27273a] border border-[#3a3a50] rounded-xl p-10 text-center space-y-3">
            <p className="text-white font-semibold">No orders yet</p>
            <p className="text-xs text-[#9a9ab0]">
              Click &ldquo;Buy Now&rdquo; on any Membership Plan or Class to create an order with Stripe Checkout.
            </p>
            <a
              href="/#pricing"
              className="inline-block bg-[#e63946] hover:bg-[#b52d38] text-white font-semibold px-5 py-2 rounded-lg text-xs transition"
            >
              Browse Plans
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto bg-[#27273a] border border-[#3a3a50] rounded-xl shadow-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#3a3a50] bg-[#1d1d2c] text-[#9a9ab0] uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Items (`order_items`)</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Stripe Session ID</th>
                  <th className="py-3.5 px-4">Created / Paid At</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a3a50]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1d1d2c]/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      #{order.id}
                    </td>
                    <td className="py-3.5 px-4">
                      {order.items && order.items.map((item) => (
                        <div key={item.id} className="text-white">
                          <span className="font-medium">{item.itemName}</span>
                          <span className="text-[#9a9ab0] ml-1.5">
                            ({item.quantity} × ${(item.unitPrice / 100).toFixed(2)})
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#f4a261]">
                      ${(order.totalAmount / 100).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block font-bold uppercase px-2.5 py-0.5 rounded text-[11px] ${
                          order.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#9a9ab0] max-w-[160px] truncate" title={order.stripeSessionId || ''}>
                      {order.stripeSessionId || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#9a9ab0]">
                      <div>Created: {new Date(order.createdAt).toLocaleTimeString()}</div>
                      {order.paidAt && (
                        <div className="text-emerald-400">
                          Paid: {new Date(order.paidAt).toLocaleTimeString()}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`/checkout/success?order_id=${order.id}`}
                        className="text-xs font-semibold text-[#f4a261] hover:underline"
                      >
                        View →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
