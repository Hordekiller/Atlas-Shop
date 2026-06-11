'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import { toJalaliHuman } from '@/lib/date';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('web_token');
    if (!token) { router.push('/auth/login'); return; }
    api.get<any>('/auth/me')
      .then((u) => {
        setUser(u);
        setForm({ name: u.name || '', phone: u.phone || '' });
      })
      .catch(() => { localStorage.removeItem('web_token'); router.push('/auth/login'); })
      .finally(() => setLoading(false));
  }, [router]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.put<any>('/auth/profile', form);
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) { alert(err.message || 'خطا'); }
    finally { setSaving(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('web_token');
    localStorage.removeItem('web_user');
    router.push('/');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="dk-container py-8">
          <div className="animate-pulse dk-card p-6 h-64" />
        </div>
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
          <span className="text-[var(--dk-text)]">پروفایل</span>
        </nav>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="dk-card p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--dk-bg)] flex items-center justify-center text-2xl font-bold mx-auto mb-3">
              {(user?.name || 'ک')[0]}
            </div>
            <h2 className="font-bold">{user?.name || 'کاربر'}</h2>
            <p className="text-sm text-[var(--dk-text-light)]">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="mt-4 px-6 py-2 rounded-xl border text-sm text-red-500 hover:bg-red-50"
            >
              خروج از حساب
            </button>
          </div>

          <div className="md:col-span-2 dk-card p-6">
            <h3 className="font-bold text-sm mb-4">اطلاعات حساب</h3>
            <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
              <div>
                <label className="text-sm font-medium mb-1 block">نام</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl bg-[var(--dk-bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--dk-primary)]"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">شماره موبایل</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl bg-[var(--dk-bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--dk-primary)]"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="dk-btn-primary text-sm disabled:opacity-50"
              >
                {saving ? 'در حال ذخیره...' : saved ? '✓ ذخیره شد' : 'ذخیره تغییرات'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--dk-border)]">
              <h3 className="font-bold text-sm mb-3">سفارشات</h3>
              <Link href="/orders" className="dk-btn-primary text-sm inline-block">
                مشاهده سفارشات
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
