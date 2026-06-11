'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Link from 'next/link';

interface ShippingMethod {
  id: string; name: string; description: string;
  estimatedDays: string; basePrice: number; freeThreshold: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<{ id: number; orderNumber: string; total: number } | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    api.get<ShippingMethod[]>('/shipping/methods').then(setShippingMethods).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedShipping) {
      api.post<{ totalCost: number }>('/shipping/calculate', { method: selectedShipping, subtotal })
        .then((r) => setShippingCost(r.totalCost))
        .catch(() => setShippingCost(0));
    }
  }, [selectedShipping, subtotal]);

  if (mounted && items.length === 0 && !orderResult) {
    router.push('/cart');
    return null;
  }

  const handleCoupon = async () => {
    if (!couponCode) return;
    try {
      const result = await api.get<{ valid: boolean; discount: number; message?: string }>(
        `/coupons/validate?code=${couponCode}&subtotal=${subtotal}`
      );
      if (result.valid) {
        setDiscount(result.discount);
        setCouponMsg(`تخفیف: ${result.discount.toLocaleString()} تومان`);
      } else {
        setDiscount(0);
        setCouponMsg('کد تخفیف معتبر نیست');
      }
    } catch { setCouponMsg('خطا در اعمال کد تخفیف'); }
  };

  const total = subtotal + shippingCost - discount;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    try {
      const order = await api.post<{ id: number; orderNumber: string; total: number }>('/orders', {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingMethod: selectedShipping || undefined,
        couponCode: couponCode || undefined,
        notes,
      });
      setOrderResult(order);
      clearCart();
    } catch (err: any) { alert(err.message || 'خطا در ثبت سفارش'); }
    finally { setLoading(false); }
  };

  if (orderResult) {
    return (
      <>
        <Header />
        <div className="dk-container py-16">
          <div className="max-w-md mx-auto text-center dk-card p-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">سفارش با موفقیت ثبت شد</h2>
            <p className="text-sm text-[var(--dk-text-light)] mb-2">شماره سفارش: {orderResult.orderNumber}</p>
            <p className="text-2xl font-bold text-[var(--dk-primary)] mb-6">{orderResult.total.toLocaleString()} تومان</p>
            <Link href="/products" className="dk-btn-primary inline-block text-sm">
              بازگشت به فروشگاه
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <>
      <Header />
      <div className="dk-container py-6">
        <nav className="text-xs text-[var(--dk-text-light)] mb-5">
          <Link href="/" className="hover:text-[var(--dk-primary)]">خانه</Link>
          <span className="mx-1.5">/</span>
          <Link href="/cart" className="hover:text-[var(--dk-primary)]">سبد خرید</Link>
          <span className="mx-1.5">/</span>
          <span className="text-[var(--dk-text)]">تسویه حساب</span>
        </nav>

        <h1 className="text-xl font-bold mb-6">تسویه حساب</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {/* Shipping */}
              <div className="dk-card p-5">
                <h3 className="font-bold text-sm mb-4">روش ارسال</h3>
                <div className="space-y-3">
                  {shippingMethods.map((method) => {
                    const cost = subtotal >= method.freeThreshold ? 0 : method.basePrice;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition ${
                          selectedShipping === method.id
                            ? 'border-[var(--dk-primary)] bg-[var(--dk-bg)]'
                            : 'border-[var(--dk-border)] hover:bg-[var(--dk-bg)]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={selectedShipping === method.id}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="accent-[var(--dk-primary)]"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium">{method.name}</span>
                          <p className="text-xs text-[var(--dk-text-light)] mt-0.5">{method.description}</p>
                          {method.estimatedDays && (
                            <p className="text-xs text-[var(--dk-text-light)] mt-0.5">تحویل: {method.estimatedDays}</p>
                          )}
                        </div>
                        <span className="text-sm font-bold">
                          {cost === 0 ? 'رایگان' : `${cost.toLocaleString()} تومان`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Coupon */}
              <div className="dk-card p-5">
                <h3 className="font-bold text-sm mb-3">کد تخفیف</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="کد تخفیف را وارد کنید"
                    className="flex-1 rounded-xl bg-[var(--dk-bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--dk-primary)]"
                  />
                  <button
                    type="button"
                    onClick={handleCoupon}
                    className="px-5 py-2.5 rounded-xl border text-sm font-medium hover:bg-[var(--dk-bg)]"
                  >
                    اعمال
                  </button>
                </div>
                {couponMsg && (
                  <p className={`text-sm mt-2 ${discount > 0 ? 'text-green-600' : 'text-red-500'}`}>{couponMsg}</p>
                )}
              </div>

              {/* Notes */}
              <div className="dk-card p-5">
                <h3 className="font-bold text-sm mb-3">توضیحات (اختیاری)</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="توضیحات خود را وارد کنید..."
                  className="w-full rounded-xl bg-[var(--dk-bg)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--dk-primary)]"
                  rows={3}
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="dk-card p-5 space-y-4 sticky top-24">
                <h3 className="font-bold text-sm">خلاصه سفارش</h3>

                <div className="space-y-2 text-sm">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between">
                      <span className="text-[var(--dk-text-light)] line-clamp-1">{item.title} × {item.quantity}</span>
                      <span className="font-medium">{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[var(--dk-border)] pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--dk-text-light)]">زیرمجموع</span>
                    <span>{subtotal.toLocaleString()} تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--dk-text-light)]">حمل و نقل</span>
                    <span>{shippingCost === 0 ? 'رایگان' : `${shippingCost.toLocaleString()} تومان`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>تخفیف</span>
                      <span>−{discount.toLocaleString()} تومان</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-[var(--dk-border)] pt-3 flex items-center justify-between">
                  <span className="font-bold">مجموع</span>
                  <span className="text-xl font-bold" style={{ color: 'var(--dk-primary)' }}>
                    {total.toLocaleString()} تومان
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full dk-btn-primary text-center text-sm disabled:opacity-50"
                >
                  {loading ? 'در حال ثبت سفارش...' : 'ثبت سفارش'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
