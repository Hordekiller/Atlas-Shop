'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('categoryId') || '');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [hasDiscount, setHasDiscount] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const perPage = 24;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCat) params.set('categoryId', selectedCat);
      if (hasDiscount) params.set('hasDiscount', 'true');
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('sort', sort);
      params.set('page', String(page));
      params.set('take', String(perPage));
      const data = await api.get<{ data: Product[]; total: number }>(`/products?${params}`);
      setProducts(data.data);
      setTotal(data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, sort, selectedCat, search, hasDiscount, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { api.get<Category[]>('/categories').then(setCategories).catch(() => {}); }, []);

  useEffect(() => {
    const s = searchParams.get('search');
    if (s) { setSearch(s); }
  }, [searchParams]);

  const totalPages = Math.ceil(total / perPage);

  const FiltersPanel = () => (
    <div className="space-y-5">
      {/* Category */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 mb-2">دسته‌بندی</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
          {categories.map((c) => (
            <button key={c.id} onClick={() => { setSelectedCat(String(c.id)); setPage(1); }}
              className={`block w-full text-right px-3 py-1.5 text-sm rounded-lg transition ${
                selectedCat === String(c.id) ? 'bg-[var(--dk-primary)] text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}>
              {c.name}
            </button>
          ))}
        </div>
        {selectedCat && (
          <button onClick={() => { setSelectedCat(''); setPage(1); }}
            className="text-xs text-[var(--dk-primary)] mt-1 hover:underline">
            حذف فیلتر
          </button>
        )}
      </div>

      {/* Price range */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 mb-2">محدوده قیمت</h4>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="از" value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-lg border px-3 py-1.5 text-sm" />
          <span className="text-gray-400">-</span>
          <input type="number" placeholder="تا" value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-lg border px-3 py-1.5 text-sm" />
        </div>
        <button onClick={() => { setPage(1); fetchProducts(); }}
          className="text-xs text-[var(--dk-primary)] mt-1 hover:underline">
          اعمال فیلتر قیمت
        </button>
      </div>

      {/* Has discount */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={hasDiscount}
          onChange={(e) => { setHasDiscount(e.target.checked); setPage(1); }}
          className="w-4 h-4 rounded border-gray-300 text-[var(--dk-primary)]" />
        <span className="text-sm">فقط کالاهای تخفیف‌دار</span>
      </label>
    </div>
  );

  return (
    <div className="dk-container py-6">
      <nav className="text-xs text-[var(--dk-text-light)] mb-4">
        <a href="/" className="hover:text-[var(--dk-primary)]">خانه</a>
        <span className="mx-1.5">/</span>
        <span className="text-[var(--dk-text)]">محصولات</span>
      </nav>

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">محصولات</h1>
        <button onClick={() => setShowFilters(!showFilters)}
          className="md:hidden text-sm text-[var(--dk-primary)] flex items-center gap-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          فیلترها
        </button>
      </div>

      {/* Search + Sort Bar */}
      <div className="dk-card p-3 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <input type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setPage(1)}
              placeholder="جستجوی محصول..."
              className="w-full rounded-lg bg-[var(--dk-bg)] border border-transparent px-4 py-2 pr-10 text-sm focus:border-[var(--dk-primary)] focus:bg-white outline-none" />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dk-text-light)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select value={selectedCat}
            onChange={(e) => { setSelectedCat(e.target.value); setPage(1); }}
            className="rounded-lg bg-[var(--dk-bg)] border-0 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--dk-primary)]">
            <option value="">همه دسته‌بندی‌ها</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="rounded-lg bg-[var(--dk-bg)] border-0 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--dk-primary)]">
            <option value="newest">جدیدترین</option>
            <option value="cheapest">ارزان‌ترین</option>
            <option value="expensive">گران‌ترین</option>
            <option value="popular">محبوب‌ترین</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block w-56 shrink-0">
          <div className="dk-card p-4 sticky top-24">
            <FiltersPanel />
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setShowFilters(false)}>
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">فیلترها</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 text-xl">&times;</button>
              </div>
              <FiltersPanel />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                className="px-3 py-2 rounded-lg border text-sm hover:bg-[var(--dk-bg)] disabled:opacity-30">
                قبلی
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let p: number;
                if (totalPages <= 7) p = i + 1;
                else if (page <= 4) p = i + 1;
                else if (page >= totalPages - 3) p = totalPages - 6 + i;
                else p = page - 3 + i;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium ${
                      page === p ? 'text-white' : 'border hover:bg-[var(--dk-bg)]'
                    }`}
                    style={page === p ? { background: 'var(--dk-primary)' } : {}}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                className="px-3 py-2 rounded-lg border text-sm hover:bg-[var(--dk-bg)] disabled:opacity-30">
                بعدی
              </button>
            </div>
          )}
        </div>
      </div>
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
