'use client';

import { useEffect, useState, FormEvent } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

interface Slide {
  id?: number; title: string; description: string;
  bgColor: string; image: string; link: string;
  sortOrder: number; isActive: boolean;
}

interface Category { id: number; name: string }
interface Section { type: string; title: string; sort: string; count: number; categoryId?: number }

const gradients = [
  'from-[#ef4056] to-[#d8364a]', 'from-[#19bfd3] to-[#1599a8]',
  'from-[#f9a825] to-[#e8960c]', 'from-[#6b21a8] to-[#581c87]',
  'from-[#059669] to-[#047857]', 'from-[#2563eb] to-[#1d4ed8]',
  'from-[#dc2626] to-[#b91c1c]', 'from-[#0891b2] to-[#0e7490]',
];

export default function SettingsPage() {
  const { addToast } = useToast();
  const [tab, setTab] = useState<'general' | 'slides' | 'sections'>('general');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // General settings
  const [form, setForm] = useState({
    site_name: 'اطلس شاپ', site_description: '', support_email: '',
    support_phone: '', default_shipping: 'post_pishtaz', currency: 'تومان',
  });

  // Slides
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editSlide, setEditSlide] = useState<Slide | null>(null);
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Sections
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get<Record<string, string>>('/settings'),
      api.get<Slide[]>('/slides'),
      api.get<Category[]>('/categories'),
    ]).then(([settings, slidesData, cats]) => {
      setForm({
        site_name: settings.site_name || 'اطلس شاپ',
        site_description: settings.site_description || '',
        support_email: settings.support_email || '',
        support_phone: settings.support_phone || '',
        default_shipping: settings.default_shipping || 'post_pishtaz',
        currency: settings.currency || 'تومان',
      });
      setSlides(slidesData);
      setCategories(cats);
      if (settings.sections) {
        try { setSections(JSON.parse(settings.sections)); } catch {}
      }
    }).catch((err) => addToast('خطا در بارگذاری تنظیمات', 'error'))
    .finally(() => setLoading(false));
  }, []);

  const handleSaveGeneral = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', form);
      addToast('تنظیمات ذخیره شد', 'success');
    } catch { addToast('خطا در ذخیره', 'error'); }
    finally { setSaving(false); }
  };

  const handleUploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('atlas_token');
    const res = await fetch('http://localhost:8000/api/v1/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    setUploading(false);
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const resetSlideForm = () => setEditSlide({
    title: '', description: '', bgColor: gradients[0], image: '', link: '', sortOrder: slides.length, isActive: true,
  });

  const openNewSlide = () => { resetSlideForm(); setShowSlideForm(true); };
  const openEditSlide = (s: Slide) => { setEditSlide({ ...s }); setShowSlideForm(true); };

  const handleSaveSlide = async () => {
    if (!editSlide || !editSlide.title.trim()) return addToast('عنوان اسلاید الزامی است', 'error');
    setSaving(true);
    try {
      if (editSlide.id) {
        const updated = await api.put<Slide>(`/slides/${editSlide.id}`, editSlide);
        setSlides(slides.map((s) => s.id === editSlide.id ? updated : s));
        addToast('اسلاید بروزرسانی شد', 'success');
      } else {
        const created = await api.post<Slide>('/slides', editSlide);
        setSlides([...slides, created]);
        addToast('اسلاید ایجاد شد', 'success');
      }
      setShowSlideForm(false);
    } catch { addToast('خطا در ذخیره اسلاید', 'error'); }
    finally { setSaving(false); }
  };

  const handleDeleteSlide = async (id: number) => {
    if (!confirm('حذف شود؟')) return;
    try {
      await api.delete(`/slides/${id}`);
      setSlides(slides.filter((s) => s.id !== id));
      addToast('اسلاید حذف شد', 'success');
    } catch { addToast('خطا در حذف', 'error'); }
  };

  const addSection = () => setSections([...sections, { type: 'products', title: '', sort: 'newest', count: 12 }]);
  const removeSection = (i: number) => setSections(sections.filter((_, idx) => idx !== i));
  const updateSection = (i: number, field: string, value: any) => {
    const copy = [...sections]; (copy[i] as any)[field] = value; setSections(copy);
  };

  const handleSaveSections = async () => {
    setSaving(true);
    try {
      await api.put('/settings', { sections: JSON.stringify(sections) });
      addToast('سکشن‌ها ذخیره شدند', 'success');
    } catch { addToast('خطا در ذخیره', 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-[var(--dk-primary)] border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6" dir="rtl">
      <h2 className="text-xl font-semibold">تنظیمات فروشگاه</h2>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'general', label: 'عمومی' },
          { id: 'slides', label: 'اسلایدرها' },
          { id: 'sections', label: 'سکشن‌ها' },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              tab === t.id ? 'bg-[var(--dk-primary)] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white rounded-xl p-6 shadow-sm border space-y-4 max-w-2xl">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نام فروشگاه</label>
              <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm" value={form.site_name}
                onChange={(e) => setForm({ ...form, site_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل پشتیبانی</label>
              <input type="email" className="w-full rounded-lg border px-3 py-2 text-sm" value={form.support_email}
                onChange={(e) => setForm({ ...form, support_email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تلفن پشتیبانی</label>
              <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm" value={form.support_phone}
                onChange={(e) => setForm({ ...form, support_phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">واحد پول</label>
              <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm" value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات فروشگاه</label>
              <textarea className="w-full rounded-lg border px-3 py-2 text-sm" rows={2} value={form.site_description}
                onChange={(e) => setForm({ ...form, site_description: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">روش پیش‌فرض ارسال</label>
              <select className="w-full rounded-lg border px-3 py-2 text-sm" value={form.default_shipping}
                onChange={(e) => setForm({ ...form, default_shipping: e.target.value })}>
                <option value="post_pishtaz">پست پیشتاز</option>
                <option value="post_sefareshi">پست سفارشی</option>
                <option value="tipax">تیپاکس</option>
                <option value="mahax">ماهکس</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="rounded-lg bg-indigo-600 px-8 py-2.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-50">
            {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
          </button>
        </form>
      )}

      {tab === 'slides' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{slides.length} اسلاید</p>
            <button onClick={openNewSlide}
              className="rounded-lg bg-[var(--dk-primary)] text-white px-4 py-2 text-sm hover:brightness-110 transition">
              + اسلاید جدید
            </button>
          </div>

          {/* Slide Form Modal */}
          {showSlideForm && editSlide && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowSlideForm(false)}>
              <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{editSlide.id ? 'ویرایش اسلاید' : 'اسلاید جدید'}</h3>
                  <button onClick={() => setShowSlideForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">عنوان</label>
                  <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm" value={editSlide.title}
                    onChange={(e) => setEditSlide({ ...editSlide, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">توضیحات</label>
                  <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm" value={editSlide.description}
                    onChange={(e) => setEditSlide({ ...editSlide, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">لینک</label>
                  <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm" value={editSlide.link}
                    onChange={(e) => setEditSlide({ ...editSlide, link: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">ترتیب</label>
                    <input type="number" className="w-full rounded-lg border px-3 py-2 text-sm" value={editSlide.sortOrder}
                      onChange={(e) => setEditSlide({ ...editSlide, sortOrder: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">وضعیت</label>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input type="checkbox" checked={editSlide.isActive}
                        onChange={(e) => setEditSlide({ ...editSlide, isActive: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                      <span className="text-sm">فعال</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">رنگ پس‌زمینه</label>
                  <div className="flex flex-wrap gap-2">
                    {gradients.map((g) => (
                      <button key={g} type="button" onClick={() => setEditSlide({ ...editSlide, bgColor: g })}
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${g} ${editSlide.bgColor === g ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">تصویر اسلاید</label>
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await handleUploadImage(file);
                      setEditSlide({ ...editSlide, image: url });
                    } catch { addToast('خطا در آپلود تصویر', 'error'); }
                  }} className="w-full text-sm" />
                  {uploading && <p className="text-xs text-indigo-500 mt-1">در حال آپلود...</p>}
                  {editSlide.image && (
                    <img src={`http://localhost:8000${editSlide.image}`} alt="preview"
                      className="mt-2 h-24 rounded-lg object-cover" />
                  )}
                </div>
                <div className={`h-16 rounded-lg bg-gradient-to-br ${editSlide.bgColor} flex items-center px-4`}>
                  <div className="text-white">
                    <p className="text-sm font-bold">{editSlide.title || 'عنوان'}</p>
                    <p className="text-xs text-white/70">{editSlide.description || 'توضیحات'}</p>
                  </div>
                </div>
                <button onClick={handleSaveSlide} disabled={saving}
                  className="w-full rounded-lg bg-indigo-600 text-white py-2.5 text-sm hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? 'در حال ذخیره...' : 'ذخیره'}
                </button>
              </div>
            </div>
          )}

          {/* Slides List */}
          <div className="space-y-3">
            {slides.map((slide) => (
              <div key={slide.id} className="bg-white rounded-xl p-4 border shadow-sm flex items-center gap-4">
                <div className={`w-24 h-16 rounded-lg bg-gradient-to-br ${slide.bgColor} flex items-center justify-center shrink-0`}>
                  {slide.image ? (
                    <img src={`http://localhost:8000${slide.image}`} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-white text-lg font-bold">{slide.title?.[0] || 'S'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{slide.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{slide.description || 'بدون توضیحات'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${slide.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {slide.isActive ? 'فعال' : 'غیرفعال'}
                    </span>
                    <span className="text-[10px] text-gray-400">ترتیب: {slide.sortOrder}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEditSlide(slide)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    ویرایش
                  </button>
                  <button onClick={() => slide.id && handleDeleteSlide(slide.id)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition">
                    حذف
                  </button>
                </div>
              </div>
            ))}
            {slides.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>هیچ اسلایدی وجود ندارد. اولین اسلاید را ایجاد کنید.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'sections' && (
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{sections.length} سکشن</p>
            <button onClick={addSection}
              className="rounded-lg bg-[var(--dk-primary)] text-white px-4 py-2 text-sm hover:brightness-110 transition">
              + سکشن جدید
            </button>
          </div>
          <div className="space-y-3">
            {sections.map((sec, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">سکشن {i + 1}</span>
                  <button onClick={() => removeSection(i)} className="text-xs text-red-500 hover:underline">حذف</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500">عنوان</label>
                    <input type="text" className="w-full rounded-lg border px-3 py-1.5 text-sm mt-1" value={sec.title}
                      onChange={(e) => updateSection(i, 'title', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">نوع</label>
                    <select className="w-full rounded-lg border px-3 py-1.5 text-sm mt-1" value={sec.type}
                      onChange={(e) => updateSection(i, 'type', e.target.value)}>
                      <option value="products">محصولات</option>
                      <option value="category">دسته‌بندی خاص</option>
                    </select>
                  </div>
                  {sec.type === 'category' && (
                    <div>
                      <label className="text-xs text-gray-500">دسته‌بندی</label>
                      <select className="w-full rounded-lg border px-3 py-1.5 text-sm mt-1" value={sec.categoryId || ''}
                        onChange={(e) => updateSection(i, 'categoryId', Number(e.target.value))}>
                        <option value="">انتخاب کنید</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-gray-500">مرتب‌سازی</label>
                    <select className="w-full rounded-lg border px-3 py-1.5 text-sm mt-1" value={sec.sort}
                      onChange={(e) => updateSection(i, 'sort', e.target.value)}>
                      <option value="newest">جدیدترین</option>
                      <option value="cheapest">ارزان‌ترین</option>
                      <option value="expensive">گران‌ترین</option>
                      <option value="popular">محبوب‌ترین</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">تعداد</label>
                    <input type="number" className="w-full rounded-lg border px-3 py-1.5 text-sm mt-1" value={sec.count}
                      onChange={(e) => updateSection(i, 'count', Number(e.target.value))} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {sections.length > 0 && (
            <button onClick={handleSaveSections} disabled={saving}
              className="rounded-lg bg-indigo-600 px-8 py-2.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-50">
              {saving ? 'در حال ذخیره...' : 'ذخیره سکشن‌ها'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
