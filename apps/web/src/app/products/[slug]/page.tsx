'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import { toJalaliHuman } from '@/lib/date';
import Link from 'next/link';

interface Product {
  id: number; title: string; slug: string; description: string;
  price: number; salePrice: number | null; stock: number;
  images: string[]; category: { id: number; name: string };
  shop: { id: number; name: string };
  reviews: { id: number; rating: number; comment: string; user: { id: number; name: string }; createdAt: string }[];
  createdAt: string;
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    api.get<Product>(`/products/${slug}`)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      title: product.title,
      price: product.salePrice || product.price,
      image: product.images?.[0] || null,
      quantity,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    try {
      const newReview = await api.post<any>(`/products/${product.id}/reviews`, {
        rating: reviewForm.rating, comment: reviewForm.comment,
      });
      setProduct({ ...product, reviews: [...product.reviews, newReview] });
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) { alert(err); }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="dk-container py-8">
          <div className="animate-pulse grid md:grid-cols-2 gap-8">
            <div className="aspect-square rounded-2xl bg-[var(--dk-bg)]" />
            <div className="space-y-4">
              <div className="h-6 bg-[var(--dk-bg)] rounded w-3/4" />
              <div className="h-4 bg-[var(--dk-bg)] rounded w-1/2" />
              <div className="h-12 bg-[var(--dk-bg)] rounded" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="dk-container py-12 text-center text-[var(--dk-text-light)]">محصول یافت نشد.</div>
      </>
    );
  }

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const images = product.images?.length > 0
    ? product.images.map((i) => `http://localhost:8000${i}`)
    : ['https://placehold.co/600x600/e2e8f0/94a3b8?text=No+Image'];

  return (
    <>
      <Header />
      <div className="dk-container py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--dk-text-light)] mb-5">
          <Link href="/" className="hover:text-[var(--dk-primary)]">خانه</Link>
          <span className="mx-1.5">/</span>
          <Link href="/products" className="hover:text-[var(--dk-primary)]">محصولات</Link>
          <span className="mx-1.5">/</span>
          <Link href={`/category/${product.category?.id}`} className="hover:text-[var(--dk-primary)]">{product.category?.name}</Link>
          <span className="mx-1.5">/</span>
          <span className="text-[var(--dk-text)]">{product.title}</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-6">
          {/* Gallery */}
          <div className="md:col-span-5">
            <div className="dk-card p-3">
              <div className="aspect-square rounded-xl overflow-hidden bg-[var(--dk-bg)] mb-3">
                <img
                  src={images[activeImg] || images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                        i === activeImg ? 'border-[var(--dk-primary)]' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-4">
            <div className="dk-card p-5 space-y-4">
              {hasDiscount && (
                <span className="dk-badge-amazing">شگفت‌انگیز %{discountPercent}</span>
              )}
              <h1 className="text-lg font-bold leading-7">{product.title}</h1>

              <div className="flex items-center gap-2 text-sm text-[var(--dk-text-light)]">
                <span className="dk-rating">★★★★★</span>
                <span>۴.۵</span>
                <span className="w-px h-4 bg-[var(--dk-border)]" />
                <span>{product.reviews?.length || 0} نظر</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[var(--dk-text-light)]">
                {product.shop && (
                  <span>فروشنده: <span className="text-[var(--dk-text)]">{product.shop.name}</span></span>
                )}
                <span>دسته: <Link href={`/category/${product.category?.id}`} className="text-[var(--dk-primary)]">{product.category?.name}</Link></span>
              </div>

              {product.description && (
                <div>
                  <h4 className="text-sm font-medium mb-1">توضیحات</h4>
                  <p className="text-sm text-[var(--dk-text-light)] leading-6 whitespace-pre-line">{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Buy Box */}
          <div className="md:col-span-3">
            <div className="dk-card p-5 space-y-4 sticky top-24">
              {/* Price */}
              <div>
                {hasDiscount ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{product.salePrice!.toLocaleString()}</span>
                      <span className="text-xs text-[var(--dk-text-light)]">تومان</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="dk-price-old">{product.price.toLocaleString()} تومان</span>
                      <span className="dk-badge-amazing">%{discountPercent}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{product.price.toLocaleString()}</span>
                    <span className="text-xs text-[var(--dk-text-light)]">تومان</span>
                  </div>
                )}
              </div>

              {/* Stock status */}
              <div className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0
                  ? `موجودی: ${product.stock} عدد`
                  : 'ناموجود'}
              </div>

              {/* Quantity + Add to cart */}
              {product.stock > 0 && (
                <>
                  <div className="flex items-center justify-between rounded-xl bg-[var(--dk-bg)] p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg font-medium hover:shadow-sm"
                    >
                      −
                    </button>
                    <span className="font-bold text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg font-medium hover:shadow-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`w-full rounded-xl py-3.5 font-medium text-sm transition ${
                      added
                        ? 'bg-green-500 text-white'
                        : 'text-white'
                    }`}
                    style={added ? {} : { background: 'var(--dk-primary)' }}
                  >
                    {added ? '✓ به سبد خرید اضافه شد' : 'افزودن به سبد خرید'}
                  </button>
                </>
              )}

              <div className="text-[10px] text-[var(--dk-text-light)] space-y-1 pt-2 border-t border-[var(--dk-border)]">
                <p>شناسه محصول: {product.id}</p>
                <p>تاریخ انتشار: {toJalaliHuman(product.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-8">
          <h3 className="text-lg font-bold mb-4">نظرات ({product.reviews?.length || 0})</h3>

          <div className="dk-card p-5 mb-5">
            <form onSubmit={handleReview} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm">امتیاز شما:</span>
                <div className="flex gap-1">
                  {[5,4,3,2,1].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: r })}
                      className={`text-xl ${r <= reviewForm.rating ? 'text-[var(--dk-gold)]' : 'text-[var(--dk-border)]'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="نظر خود را بنویسید..."
                required
                className="w-full rounded-xl bg-[var(--dk-bg)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--dk-primary)]"
                rows={3}
              />
              <button
                type="submit"
                className="dk-btn-primary text-sm"
              >
                ثبت نظر
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {product.reviews?.map((review) => (
              <div key={review.id} className="dk-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--dk-bg)] flex items-center justify-center text-sm font-medium">
                      {(review.user?.name || 'ک')[0]}
                    </div>
                    <span className="text-sm font-medium">{review.user?.name || 'کاربر'}</span>
                    <span className="text-[var(--dk-gold)] text-sm">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--dk-text-light)]">{toJalaliHuman(review.createdAt)}</span>
                </div>
                <p className="text-sm text-[var(--dk-text-light)]">{review.comment}</p>
              </div>
            ))}
            {(!product.reviews || product.reviews.length === 0) && (
              <p className="text-sm text-[var(--dk-text-light)] text-center py-8">هنوز نظری ثبت نشده است. اولین نفر باشید!</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
