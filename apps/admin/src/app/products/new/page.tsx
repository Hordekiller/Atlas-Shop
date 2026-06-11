'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { api } from '@/lib/api';
import TiptapEditor from '@/components/TiptapEditor';

interface Category { id: number; name: string; parentId: number | null }
interface Brand { id: number; name: string }

interface ImageObj { url: string; alt: string }
interface SpecRow { name: string; value: string }

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ImageObj[]>([]);

  const [form, setForm] = useState({
    title: '', slug: '', shortDescription: '', description: '',
    price: '', salePrice: '', discountPercent: '',
    discountStartAt: '', discountEndAt: '',
    stock: '0', lowStockThreshold: '10', minOrderQty: '1', maxOrderQty: '0',
    categoryId: '', sku: '', barcode: '',
    status: 'in_stock',
    brandId: '',
    weight: '', length: '', width: '', height: '',
    videoUrl: '',
    tags: '',
    metaTitle: '', metaDesc: '',
  });

  const [specifications, setSpecifications] = useState<SpecRow[]>([]);

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/categories'),
      api.get<Brand[]>('/brands'),
    ]).then(([cats, brds]) => {
      setCategories(cats);
      setBrands(brds);
    }).catch(console.error);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('atlas_token')}` },
        body: fd,
      });
      const data = await res.json();
      if (data.url) setImages((prev) => [...prev, { url: data.url, alt: '' }]);
    } catch { alert('Upload failed'); }
    setUploading(false);
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((i) => i.url !== url));

  const updateImageAlt = (url: string, alt: string) => {
    setImages((prev) => prev.map((i) => i.url === url ? { ...i, alt } : i));
  };

  const autoSlug = () => {
    if (!form.slug && form.title) {
      setForm({ ...form, slug: form.title.replace(/\s+/g, '-').replace(/[^\w\-آ-ی]/g, '').toLowerCase() });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        title: form.title,
        slug: form.slug || undefined,
        shortDescription: form.shortDescription || undefined,
        description: form.description || undefined,
        price: parseFloat(form.price) || 0,
        salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
        discountPercent: form.discountPercent ? parseFloat(form.discountPercent) : undefined,
        discountStartAt: form.discountStartAt || undefined,
        discountEndAt: form.discountEndAt || undefined,
        stock: parseInt(form.stock) || 0,
        lowStockThreshold: parseInt(form.lowStockThreshold) || 10,
        minOrderQty: parseInt(form.minOrderQty) || 1,
        maxOrderQty: parseInt(form.maxOrderQty) || 0,
        categoryId: parseInt(form.categoryId),
        sku: form.sku || undefined,
        barcode: form.barcode || undefined,
        status: form.status,
        brandId: form.brandId ? parseInt(form.brandId) : undefined,
        weight: form.weight ? parseFloat(form.weight) : undefined,
        length: form.length ? parseFloat(form.length) : undefined,
        width: form.width ? parseFloat(form.width) : undefined,
        height: form.height ? parseFloat(form.height) : undefined,
        videoUrl: form.videoUrl || undefined,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        metaTitle: form.metaTitle || undefined,
        metaDesc: form.metaDesc || undefined,
        images: images.filter((i) => i.url),
        specifications: specifications.filter((s) => s.name && s.value),
      };
      await api.post('/products', payload);
      router.push('/products');
    } catch (err) {
      alert(err);
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--v-text)' }}>محصول جدید</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--v-text-secondary)' }}>اطلاعات محصول جدید را وارد کنید</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* اطلاعات پایه */}
        <div className="v-card space-y-5">
          <div className="pb-3 border-b" style={{ borderColor: 'var(--v-border)' }}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Icon icon="tabler:info-circle" className="w-4 h-4" style={{ color: 'var(--v-primary)' }} />
              اطلاعات پایه
            </h3>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>عنوان محصول *</label>
            <input type="text" required className="v-input" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              onBlur={autoSlug} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>نامک (slug)</label>
              <input type="text" className="v-input" dir="ltr" value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>وضعیت</label>
              <select className="v-select" value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="in_stock">موجود</option>
                <option value="out_of_stock">ناموجود</option>
                <option value="coming_soon">به‌زودی</option>
                <option value="display_only">فقط نمایش</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>توضیح کوتاه</label>
            <textarea className="v-input" rows={2} value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>توضیحات کامل</label>
            <TiptapEditor
              value={form.description}
              onChange={(html) => setForm({ ...form, description: html })}
              placeholder="توضیحات محصول را وارد کنید..."
              minHeight={300}
            />
          </div>
        </div>

        {/* قیمت و تخفیف */}
        <div className="v-card space-y-5">
          <div className="pb-3 border-b" style={{ borderColor: 'var(--v-border)' }}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Icon icon="tabler:currency-dollar" className="w-4 h-4" style={{ color: 'var(--v-primary)' }} />
              قیمت و تخفیف
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>قیمت (ریال) *</label>
              <input type="number" required className="v-input" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>قیمت تخفیف‌خورده</label>
              <input type="number" className="v-input" value={form.salePrice}
                onChange={(e) => setForm({ ...form, salePrice: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>درصد تخفیف</label>
              <input type="number" className="v-input" value={form.discountPercent}
                onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>شروع تخفیف</label>
                <input type="datetime-local" className="v-input" value={form.discountStartAt}
                  onChange={(e) => setForm({ ...form, discountStartAt: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>پایان تخفیف</label>
                <input type="datetime-local" className="v-input" value={form.discountEndAt}
                  onChange={(e) => setForm({ ...form, discountEndAt: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        {/* موجودی و انبار */}
        <div className="v-card space-y-5">
          <div className="pb-3 border-b" style={{ borderColor: 'var(--v-border)' }}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Icon icon="tabler:package" className="w-4 h-4" style={{ color: 'var(--v-primary)' }} />
              موجودی و انبار
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>موجودی</label>
              <input type="number" className="v-input" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>هشدار موجودی کم</label>
              <input type="number" className="v-input" value={form.lowStockThreshold}
                onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>SKU</label>
              <input type="text" className="v-input" dir="ltr" value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>بارکد</label>
              <input type="text" className="v-input" dir="ltr" value={form.barcode}
                onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>حداقل تعداد خرید</label>
              <input type="number" className="v-input" value={form.minOrderQty}
                onChange={(e) => setForm({ ...form, minOrderQty: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>حداکثر تعداد (0 = نامحدود)</label>
              <input type="number" className="v-input" value={form.maxOrderQty}
                onChange={(e) => setForm({ ...form, maxOrderQty: e.target.value })} />
            </div>
          </div>
        </div>

        {/* تصاویر */}
        <div className="v-card space-y-5">
          <div className="pb-3 border-b" style={{ borderColor: 'var(--v-border)' }}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Icon icon="tabler:photo" className="w-4 h-4" style={{ color: 'var(--v-primary)' }} />
              تصاویر محصول
            </h3>
          </div>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((img) => (
              <div key={img.url} className="relative group">
                <img src={img.url} alt={img.alt} className="w-24 h-24 object-cover rounded-lg border" style={{ borderColor: 'var(--v-border)' }} />
                <input type="text" className="absolute -bottom-8 left-0 right-0 text-xs p-0.5 rounded text-center"
                  style={{ background: 'var(--v-bg)', borderColor: 'var(--v-border)' }}
                  placeholder="Alt text" value={img.alt}
                  onChange={(e) => updateImageAlt(img.url, e.target.value)} />
                <button type="button" onClick={() => removeImage(img.url)}
                  className="absolute -top-2 -right-2 rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  style={{ background: 'var(--v-error)', color: 'white' }}>×</button>
              </div>
            ))}
            {uploading && <div className="w-24 h-24 rounded-lg border border-dashed flex items-center justify-center text-sm" style={{ color: 'var(--v-text-disabled)', borderColor: 'var(--v-border)' }}>در حال آپلود...</div>}
          </div>
          <label className="cursor-pointer inline-flex items-center gap-2 v-btn v-btn-secondary">
            <Icon icon="tabler:upload" className="w-4 h-4" />
            انتخاب تصویر
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          <p className="text-xs mt-1" style={{ color: 'var(--v-text-disabled)' }}>می‌توانید برای هر تصویر متن جایگزین (Alt) وارد کنید</p>
        </div>

        {/* ویدیو */}
        <div className="v-card space-y-5">
          <div className="pb-3 border-b" style={{ borderColor: 'var(--v-border)' }}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Icon icon="tabler:video" className="w-4 h-4" style={{ color: 'var(--v-primary)' }} />
              ویدیو
            </h3>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>لینک ویدیو (اختیاری)</label>
            <input type="url" className="v-input" dir="ltr" placeholder="https://..." value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
          </div>
        </div>

        {/* دسته‌بندی و برند */}
        <div className="v-card space-y-5">
          <div className="pb-3 border-b" style={{ borderColor: 'var(--v-border)' }}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Icon icon="tabler:category" className="w-4 h-4" style={{ color: 'var(--v-primary)' }} />
              دسته‌بندی و برند
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>دسته‌بندی اصلی *</label>
              <select required className="v-select" value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">انتخاب کنید</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>برند</label>
              <select className="v-select" value={form.brandId}
                onChange={(e) => setForm({ ...form, brandId: e.target.value })}>
                <option value="">بدون برند</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* مشخصات فنی */}
        <div className="v-card space-y-5">
          <div className="pb-3 border-b" style={{ borderColor: 'var(--v-border)' }}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Icon icon="tabler:list-details" className="w-4 h-4" style={{ color: 'var(--v-primary)' }} />
              مشخصات فنی
            </h3>
          </div>
          {specifications.map((spec, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input className="v-input w-1/3" placeholder="نام مشخصه"
                value={spec.name} onChange={(e) => {
                  const next = [...specifications];
                  next[idx] = { ...next[idx], name: e.target.value };
                  setSpecifications(next);
                }} />
              <input className="v-input flex-1" placeholder="مقدار"
                value={spec.value} onChange={(e) => {
                  const next = [...specifications];
                  next[idx] = { ...next[idx], value: e.target.value };
                  setSpecifications(next);
                }} />
              <button type="button" onClick={() => setSpecifications(specifications.filter((_, i) => i !== idx))}
                className="v-btn v-btn-sm" style={{ color: 'var(--v-error)' }}>
                <Icon icon="tabler:trash" className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setSpecifications([...specifications, { name: '', value: '' }])}
            className="v-btn v-btn-secondary v-btn-sm">
            <Icon icon="tabler:plus" className="w-3.5 h-3.5" />
            افزودن مشخصه
          </button>
        </div>

        {/* وزن و ابعاد */}
        <div className="v-card space-y-5">
          <div className="pb-3 border-b" style={{ borderColor: 'var(--v-border)' }}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Icon icon="tabler:dimensions" className="w-4 h-4" style={{ color: 'var(--v-primary)' }} />
              وزن و ابعاد
            </h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>وزن (گرم)</label>
              <input type="number" className="v-input" value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>طول (سانتیمتر)</label>
              <input type="number" className="v-input" value={form.length}
                onChange={(e) => setForm({ ...form, length: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>عرض (سانتیمتر)</label>
              <input type="number" className="v-input" value={form.width}
                onChange={(e) => setForm({ ...form, width: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>ارتفاع (سانتیمتر)</label>
              <input type="number" className="v-input" value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })} />
            </div>
          </div>
        </div>

        {/* برچسب‌ها */}
        <div className="v-card space-y-5">
          <div className="pb-3 border-b" style={{ borderColor: 'var(--v-border)' }}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Icon icon="tabler:tags" className="w-4 h-4" style={{ color: 'var(--v-primary)' }} />
              برچسب‌ها
            </h3>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>برچسب‌ها (جداشده با کاما)</label>
            <input type="text" className="v-input" placeholder="مثال: پرفروش, جدید, پیشنهاد ویژه" value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
        </div>

        {/* سئو */}
        <div className="v-card space-y-5">
          <div className="pb-3 border-b" style={{ borderColor: 'var(--v-border)' }}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Icon icon="tabler:seo" className="w-4 h-4" style={{ color: 'var(--v-primary)' }} />
              سئو (SEO)
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>تایتل سئو</label>
              <input type="text" className="v-input" value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--v-text)' }}>توضیحات سئو</label>
              <input type="text" className="v-input" value={form.metaDesc}
                onChange={(e) => setForm({ ...form, metaDesc: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="v-btn v-btn-primary">
            {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> در حال ذخیره...</> : <><Icon icon="tabler:device-floppy" className="w-4 h-4" /> ذخیره محصول</>}
          </button>
          <a href="/products" className="v-btn v-btn-secondary">انصراف</a>
        </div>
      </form>
    </div>
  );
}
