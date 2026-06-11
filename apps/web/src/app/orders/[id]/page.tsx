'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import { toJalaliHuman } from '@/lib/date';

interface OrderItem {
  id: number; productId: number; title: string; quantity: number;
  price: number; image: string | null;
}

interface Order {
  id: number; orderNumber: string; status: string; paymentStatus: string;
  subtotal: number; shippingCost: number; discount: number; total: number;
  shippingMethod: string | null; shippingAddress: string | null;
  notes: string | null; items: OrderItem[];
  createdAt: string; paidAt: string | null;
}

const statusLabels: Record<string, string> = {
  pending: 'در انتظار', confirmed: 'تایید شده', processing: 'در حال پردازش',
  shipped: 'ارسال شده', delivered: 'تحویل شده', cancelled: 'لغو شده',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700', shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
};

const shippingLabels: Record<string, string> = {
  post_pishtaz: 'پست پیشتاز', post_sefareshi: 'پست سفارشی',
  tipax: 'تیپاکس', mahax: 'ماهکس', snapp_box: 'اسنپ باکس',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('web_token');
    if (!token) { router.push('/auth/login'); return; }
    api.get<Order>(`/orders/${id}`)
      .then(setOrder)
      .catch(() => router.push('/orders'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="dk-container py-8"><div className="animate-pulse dk-card p-6 h-64" /></div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="dk-container py-12 text-center text-[var(--dk-text-light)]">سفارش یافت نشد.</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="dk-container py-6">
        <nav className="text-xs text-[var(--dk-text-light)] mb-5">
          <Link href="/" className="hover:text-[var(--dk-primary)]">خانه</Link>
          <span className="mx-1.5">/</span>
          <Link href="/orders" className="hover:text-[var(--dk-primary)]">سفارشات</Link>
          <span className="mx-1.5">/</span>
          <span className="text-[var(--dk-text)]">{order.orderNumber}</span>
        </nav>

        <div className="dk-card overflow-hidden">
          <div className="p-5 border-b border-[var(--dk-border)] bg-[var(--dk-bg)] flex items-center justify-between">
            <div>
              <h1 className="font-bold">{order.orderNumber}</h1>
              <p className="text-xs text-[var(--dk-text-light)] mt-1">{toJalaliHuman(order.createdAt)}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs ${statusColors[order.status] || 'bg-gray-100'}`}>
              {statusLabels[order.status] || order.status}
            </span>
          </div>

          <div className="p-5 space-y-3">
            <h3 className="font-bold text-sm">اقلام سفارش</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-2 border-b border-[var(--dk-border)] last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-[var(--dk-text-light)]">تعداد: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold">{(item.price * item.quantity).toLocaleString()} تومان</p>
              </div>
            ))}
          </div>

          <div className="px-5 pb-5 space-y-2 text-sm border-t border-[var(--dk-border)] pt-4">
            <div className="flex justify-between">
              <span className="text-[var(--dk-text-light)]">زیرمجموع</span>
              <span>{order.subtotal.toLocaleString()} تومان</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--dk-text-light)]">حمل و نقل</span>
              <span>{order.shippingCost === 0 ? 'رایگان' : `${order.shippingCost.toLocaleString()} تومان`}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>تخفیف</span>
                <span>−{order.discount.toLocaleString()} تومان</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t border-[var(--dk-border)] pt-2">
              <span>مجموع</span>
              <span style={{ color: 'var(--dk-primary)' }}>{order.total.toLocaleString()} تومان</span>
            </div>
          </div>

          {(order.shippingMethod || order.notes) && (
            <div className="px-5 pb-5 space-y-1 text-xs text-[var(--dk-text-light)] border-t border-[var(--dk-border)] pt-4">
              {order.shippingMethod && <p>روش ارسال: {shippingLabels[order.shippingMethod] || order.shippingMethod}</p>}
              {order.notes && <p>توضیحات: {order.notes}</p>}
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link href="/orders" className="text-sm" style={{ color: 'var(--dk-primary)' }}>
            ← بازگشت به لیست سفارشات
          </Link>
        </div>
      </div>
    </>
  );
}
