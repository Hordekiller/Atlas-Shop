'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import Header from '@/components/Header';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await api.post<{ token: string; user: any }>('/auth/register', form);
      localStorage.setItem('web_token', result.token);
      localStorage.setItem('web_user', JSON.stringify(result.user));
      router.push('/');
    } catch (err: any) {
      setError(err?.response?.message || err?.message || 'خطا در ثبت‌نام');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Header />
      <div className="dk-container py-12">
        <div className="max-w-sm mx-auto dk-card p-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">ثبت‌نام</h1>
            <p className="text-sm text-[var(--dk-text-light)] mt-1">ایجاد حساب کاربری جدید</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 text-red-500 text-sm px-4 py-2.5">{error}</div>
            )}
            <div>
              <label className="text-sm font-medium mb-1 block">نام</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl bg-[var(--dk-bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--dk-primary)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">ایمیل</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl bg-[var(--dk-bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--dk-primary)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">شماره موبایل (اختیاری)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl bg-[var(--dk-bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--dk-primary)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">رمز عبور</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl bg-[var(--dk-bg)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--dk-primary)]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full dk-btn-primary text-sm disabled:opacity-50"
            >
              {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
            </button>
          </form>

          <p className="text-sm text-center text-[var(--dk-text-light)] mt-4">
            قبلاً ثبت‌نام کرده‌اید؟
            <Link href="/auth/login" className="mr-1" style={{ color: 'var(--dk-primary)' }}>ورود</Link>
          </p>
        </div>
      </div>
    </>
  );
}
