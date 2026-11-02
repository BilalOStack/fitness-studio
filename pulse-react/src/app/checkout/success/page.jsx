'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');

  const hasLookupParams = Boolean(orderId || sessionId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(hasLookupParams);
  const [error, setError] = useState(
    hasLookupParams ? null : 'Missing order_id or session_id in the URL.'
  );
  const [pollCount, setPollCount] = useState(0);

  // Step 7: Check order status a couple of times if needed, since the webhook can arrive a moment after redirect
  useEffect(() => {
    if (!orderId && !sessionId) {
      return;
    }

    let isMounted = true;
    let timer = null;
    const maxAttempts = 12;

    async function checkOrder(attempt = 1) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('pulsefit_token') : null;
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const lookupUrl = orderId
          ? `/api/orders/${encodeURIComponent(orderId)}`
          : `/api/orders?session_id=${encodeURIComponent(sessionId)}`;

        const res = await fetch(lookupUrl, { headers, cache: 'no-store' });
        const data = await res.json();

        if (!isMounted) return;

        if (!res.ok) {
          throw new Error(data.error || 'Could not load order details.');
        }

        setOrder(data);
        setLoading(false);

        // If order is still 'pending' and we haven't exceeded max attempts, poll again in 2 seconds
        if (data.status !== 'paid' && attempt < maxAttempts) {
          setPollCount(attempt);
          timer = setTimeout(() => checkOrder(attempt + 1), 2000);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to verify payment.');
        setLoading(false);
      }
    }

    checkOrder(1);

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [orderId, sessionId]);

  const handleManualRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('pulsefit_token') : null;
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const lookupUrl = orderId
        ? `/api/orders/${encodeURIComponent(orderId)}`
        : `/api/orders?session_id=${encodeURIComponent(sessionId)}`;

      const res = await fetch(lookupUrl, { headers, cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load order.');
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl bg-[#27273a] border border-[#3a3a50] rounded-2xl p-6 sm:p-10 shadow-2xl">
        {loading && !order ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#e63946] border-t-transparent animate-spin mx-auto"></div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Verifying Your Payment...</h1>
            <p className="text-sm text-[#9a9ab0]">
              Checking order status with Stripe webhook...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-2xl mx-auto">
              ⚠️
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Unable to Load Order</h1>
            <p className="text-sm text-red-300">{error}</p>
            <div className="pt-4">
              <a
                href="/"
                className="inline-block bg-[#e63946] hover:bg-[#b52d38] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition"
              >
                Return to Studio
              </a>
            </div>
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Status Header */}
            <div className="text-center space-y-2">
              {order.status === 'paid' ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-3xl mx-auto shadow-lg">
                    ✓
                  </div>
                  <span className="inline-block text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Payment Confirmed · PAID
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white pt-1">
                    Thank You for Your Order!
                  </h1>
                  <p className="text-sm text-[#9a9ab0]">
                    Stripe webhook verified your payment and marked Order #{order.id} as <strong className="text-emerald-400">paid</strong>.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-2xl mx-auto">
                    ⏳
                  </div>
                  <span className="inline-block text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Status: {order.status.toUpperCase()}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white pt-1">
                    Waiting for Webhook Confirmation...
                  </h1>
                  <p className="text-xs sm:text-sm text-[#9a9ab0]">
                    Your checkout session completed! Waiting for the Stripe webhook (<code className="text-[#f4a261]">/api/webhook</code>) to mark Order #{order.id} as paid (check #{pollCount + 1}).
                  </p>
                  <button
                    type="button"
                    onClick={handleManualRefresh}
                    className="mt-2 text-xs font-semibold text-[#f4a261] underline hover:text-white"
                  >
                    Check status again now
                  </button>
                </>
              )}
            </div>

            {/* Order Summary Box */}
            <div className="bg-[#1d1d2c] border border-[#3a3a50] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#3a3a50] pb-3 text-xs sm:text-sm">
                <span className="text-[#9a9ab0]">Order Number</span>
                <span className="font-mono font-bold text-white">#{order.id}</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#3a3a50] pb-3 text-xs sm:text-sm">
                <span className="text-[#9a9ab0]">Order Status</span>
                <span
                  className={`font-bold uppercase px-2.5 py-0.5 rounded text-xs ${
                    order.status === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Line Items from order_items table */}
              <div className="space-y-2 border-b border-[#3a3a50] pb-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#9a9ab0]">
                  Purchased Items
                </div>
                {order.items && order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm text-white py-1">
                    <div>
                      <span className="font-semibold">{item.itemName}</span>
                      <span className="text-xs text-[#9a9ab0] ml-2">× {item.quantity}</span>
                    </div>
                    <span className="font-semibold">
                      ${((item.unitPrice * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-base sm:text-lg font-extrabold text-white pt-1">
                <span>Total Paid</span>
                <span className="text-[#f4a261]">${(order.totalAmount / 100).toFixed(2)} USD</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="/orders"
                className="flex-1 text-center bg-[#1d1d2c] hover:bg-[#3a3a50] border border-[#3a3a50] text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition"
              >
                View Orders Table
              </a>
              <a
                href="/"
                className="flex-1 text-center bg-[#e63946] hover:bg-[#b52d38] text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition"
              >
                Back to PulseFit Studio
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#121220] text-[#eaeaf0]">
      <Header />
      <Suspense
        fallback={
          <div className="flex-grow flex items-center justify-center text-white">
            Loading order confirmation...
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
