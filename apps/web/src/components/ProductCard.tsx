'use client';

import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  salePrice: number | null;
  images: string[];
  category?: { id: number; name: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const imgSrc = product.images?.[0]
    ? `http://localhost:8000${product.images[0]}`
    : 'https://placehold.co/300x300/e2e8f0/94a3b8?text=No+Image';

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="dk-card overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square bg-[var(--dk-bg)] overflow-hidden">
          <img
            src={imgSrc}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {hasDiscount && (
            <span className="absolute top-2 right-2 dk-badge-amazing">
              %{discountPercent}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3 space-y-2">
          <h3 className="text-xs leading-5 line-clamp-2 text-[var(--dk-text)] group-hover:text-[var(--dk-primary)] transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>

          <div className="flex items-center gap-1 text-[11px] text-[var(--dk-text-light)]">
            <span className="dk-rating">★★★★★</span>
            <span>۱۵۶</span>
          </div>

          <div className="flex items-baseline gap-2 pt-1">
            {hasDiscount ? (
              <>
                <span className="dk-price text-sm">{product.salePrice!.toLocaleString()}</span>
                <span className="dk-price-old">{product.price.toLocaleString()}</span>
              </>
            ) : (
              <span className="dk-price text-sm">{product.price.toLocaleString()}</span>
            )}
            <span className="text-[10px] text-[var(--dk-text-light)]">تومان</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
