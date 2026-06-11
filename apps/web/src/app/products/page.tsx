'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: number; title: string; slug: string; price: number;
  salePrice: number | null; images: string[];
  category?: { id: number; name: string };
}
interface Category { id: number; name: string }

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('categoryId') || '');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 24;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCat) params.set('categoryId', selectedCat);
      params.set('sort', sort);
      params.set('page', String(page));
      params.set('take', String(perPage));
      const data = await api.get<{ data: Product[]; total: number }>(`/products?${params}`);
      setProducts(data.data);
      setTotal(data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page, sort, selectedCat]);
  useEffect(() => { api.get<Category[]>('/categories').then(setCategories).catch(() => {}); }, []);

  useEffect(() => {
    const s = searchParams.get('search');
    if (s) setSearch(s);
  }, [searchParams]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="dk-container py-6">
      <nav className="text-xs text-[var(--dk-text-light)] mb-4">
        <a href="/" className="hover:text-[var(--dk-primary)]">خانه</a>
        <span className="mx-1.5">/</span>
        <span className="text-[var(--dk-text)]">محصولات</span>
      </nav>

      <h1 className="text-xl font-bold mb-5">محصولات</h1>

      <div className="dk-card p-3 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setPage(1) && fetchProducts()}
              placeholder="جستجوی محصول..."
              className="w-full rounded-lg bg-[var(--dk-bg)] border border-transparent px-4 py-2 pr-10 text-sm focus:border-[var(--dk-primary)] focus:bg-white outline-none"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dk-text-light)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={selectedCat}
            onChange={(e) => { setSelectedCat(e.target.value); setPage(1); }}
            className="rounded-lg bg-[var(--dk-bg)] border-0 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--dk-primary)]"
          >
            <option value="">همه دسته‌بندی‌ها</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="rounded-lg bg-[var(--dk-bg)] border-0 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--dk-primary)]"
          >
            <option value="newest">جدیدترین</option>
            <option value="cheapest">ارزان‌ترین</option>
            <option value="expensive">گران‌ترین</option>
            <option value="popular">محبوب‌ترین</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, n) => (
            <div key={n} className="dk-card p-3 animate-pulse">
              <div className="aspect-square rounded-lg bg-[var(--dk-bg)] mb-3" />
              <div className="h-3 bg-[var(--dk-bg)] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[var(--dk-bg)] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">🔍</span>
          <p className="text-[var(--dk-text-light)]">محصولی یافت نشد.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-[var(--dk-text-light)] mb-3">{total} محصول یافت شد</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-lg border text-sm hover:bg-[var(--dk-bg)] disabled:opacity-30"
          >
            قبلی
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let p: number;
            if (totalPages <= 7) {
              p = i + 1;
            } else if (page <= 4) {
              p = i + 1;
            } else if (page >= totalPages - 3) {
              p = totalPages - 6 + i;
            } else {
              p = page - 3 + i;
            }
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium ${
                  page === p ? 'text-white' : 'border hover:bg-[var(--dk-bg)]'
                }`}
                style={page === p ? { background: 'var(--dk-primary)' } : {}}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-lg border text-sm hover:bg-[var(--dk-bg)] disabled:opacity-30"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="dk-container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, n) => (
              <div key={n} className="dk-card p-3 animate-pulse">
                <div className="aspect-square rounded-lg bg-[var(--dk-bg)] mb-3" />
                <div className="h-3 bg-[var(--dk-bg)] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[var(--dk-bg)] rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      }>
        <ProductsContent />
      </Suspense>
    </>
  );
}
