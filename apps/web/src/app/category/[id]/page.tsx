'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: number; title: string; slug: string; price: number;
  salePrice: number | null; images: string[];
}

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [catName, setCatName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ data: Product[] }>(`/products?categoryId=${id}`),
      api.get<any>(`/categories/${id}`).catch(() => ({})),
    ])
      .then(([prodRes, cat]) => {
        setProducts(prodRes.data);
        if (cat.name) setCatName(cat.name);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Header />
      <div className="dk-container py-6">
        <h1 className="text-xl font-bold mb-5">{catName || 'دسته‌بندی'}</h1>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[1,2,3,4,5,6,7,8].map((n) => (
              <div key={n} className="dk-card p-3 animate-pulse">
                <div className="aspect-square rounded-lg bg-[var(--dk-bg)] mb-3" />
                <div className="h-3 bg-[var(--dk-bg)] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[var(--dk-bg)] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">📭</span>
            <p className="text-[var(--dk-text-light)]">هیچ محصولی در این دسته وجود ندارد.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-[var(--dk-text-light)] mb-3">{products.length} محصول</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
