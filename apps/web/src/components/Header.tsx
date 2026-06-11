'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useCart } from '@/context/CartContext';

interface Category { id: number; name: string; slug: string }

export default function Header() {
  const { totalItems: itemCount } = useCart();
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [showCatMenu, setShowCatMenu] = useState(false);

  useEffect(() => {
    api.get<Category[]>('/categories').then(setCategories).catch(() => {});
    const token = localStorage.getItem('web_token');
    if (token) {
      try {
        const u = JSON.parse(localStorage.getItem('web_user') || '{}');
        if (u.email) setUser(u);
      } catch {}
    }
  }, []);

  return (
    <header className="bg-white border-b border-[var(--dk-border)] sticky top-0 z-50">
      {/* Top bar: Logo + Search + Auth + Cart */}
      <div className="dk-container">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="text-2xl font-bold" style={{ color: 'var(--dk-primary)' }}>
              اطلس
            </span>
            <span className="text-lg font-bold text-gray-700">شاپ</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <form action={`/products`} method="GET" className="relative">
              <input
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی محصول..."
                className="w-full rounded-lg bg-[var(--dk-bg)] px-4 py-2.5 text-sm pr-10 border border-transparent focus:border-[var(--dk-primary)] focus:bg-white outline-none transition"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--dk-text-light)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
          </div>

          {/* Auth / Profile */}
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--dk-bg)] text-sm whitespace-nowrap"
            >
              <svg className="w-5 h-5 text-[var(--dk-text-light)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline text-[var(--dk-text)]">{user.name || user.email}</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--dk-bg)] text-sm whitespace-nowrap"
            >
              <svg className="w-5 h-5 text-[var(--dk-text-light)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline text-[var(--dk-text)]">ورود | ثبت‌نام</span>
            </Link>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--dk-bg)] text-sm whitespace-nowrap"
          >
            <svg className="w-5 h-5" style={{ color: 'var(--dk-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ background: 'var(--dk-primary)' }}>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
            <span className="hidden sm:inline text-[var(--dk-text)]">سبد خرید</span>
          </Link>
        </div>
      </div>

      {/* Category Nav */}
      <div className="border-t border-[var(--dk-border)]">
        <div className="dk-container">
          <nav className="flex items-center gap-1 h-10 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setShowCatMenu(!showCatMenu)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[var(--dk-bg)] whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              دسته‌بندی
            </button>
            <span className="w-px h-5 bg-[var(--dk-border)]" />
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="px-3 py-1.5 rounded-lg text-xs text-[var(--dk-text-light)] hover:bg-[var(--dk-bg)] hover:text-[var(--dk-primary)] whitespace-nowrap transition"
              >
                {cat.name}
              </Link>
            ))}
            {categories.length > 8 && (
              <Link
                href="/products"
                className="px-3 py-1.5 rounded-lg text-xs text-[var(--dk-text-light)] hover:text-[var(--dk-primary)] whitespace-nowrap"
              >
                همه محصولات
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
