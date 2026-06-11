'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <>
      <Header />
      <div className="dk-container py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--dk-text-light)] mb-5">
          <Link href="/" className="hover:text-[var(--dk-primary)]">خانه</Link>
          <span className="mx-1.5">/</span>
          <span className="text-[var(--dk-text)]">سبد خرید</span>
        </nav>

        <h1 className="text-xl font-bold mb-6">سبد خرید</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🛒</span>
            <p className="text-[var(--dk-text-light)] mb-6">سبد خرید شما خالی است!</p>
            <Link
              href="/products"
              className="dk-btn-primary inline-block"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Items */}
            <div className="md:col-span-2 space-y-3">
              {items.map((item) => {
                const itemTotal = item.price * item.quantity;
                return (
                  <div key={item.productId} className="dk-card p-4 flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl bg-[var(--dk-bg)] shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={`http://localhost:8000${item.image}`} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--dk-text-light)] text-xs">No img</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.productId}`} className="text-sm font-medium line-clamp-1 hover:text-[var(--dk-primary)]">
                        {item.title}
                      </Link>
                      <p className="text-xs text-[var(--dk-text-light)] mt-1">{item.price.toLocaleString()} تومان</p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center rounded-xl bg-[var(--dk-bg)]">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-sm hover:shadow-sm"
                      >
                        −
                      </button>
                      <span className="w-9 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-sm hover:shadow-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Total */}
                    <div className="text-left min-w-[90px]">
                      <p className="text-sm font-bold">{itemTotal.toLocaleString()}</p>
                      <p className="text-[10px] text-[var(--dk-text-light)]">تومان</p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-2 text-[var(--dk-text-light)] hover:text-red-500 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div>
              <div className="dk-card p-5 space-y-4 sticky top-24">
                <h3 className="font-bold text-sm">خلاصه سبد خرید</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--dk-text-light)]">تعداد کالا</span>
                  <span className="font-medium">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--dk-text-light)]">مبلغ کل</span>
                  <span className="font-bold text-lg">{subtotal.toLocaleString()}</span>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full text-center dk-btn-primary text-sm"
                >
                  ادامه فرایند خرید
                </Link>
                <Link
                  href="/products"
                  className="block w-full text-center rounded-xl border py-3 text-sm text-[var(--dk-text-light)] hover:bg-[var(--dk-bg)]"
                >
                  ادامه خرید
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
