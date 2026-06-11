'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { ToastProvider } from '@/context/ToastContext';
import "./globals.css";

const sidebarItems = [
  { label: "داشبورد", href: "/", icon: "tabler:layout-dashboard" },
  { label: "محصولات", href: "/products", icon: "tabler:package" },
  { label: "دسته‌بندی‌ها", href: "/categories", icon: "tabler:category" },
  { label: "برندها", href: "/brands", icon: "tabler:trademark" },
  { label: "سفارشات", href: "/orders", icon: "tabler:shopping-cart" },
  { label: "تخفیف‌ها", href: "/coupons", icon: "tabler:ticket" },
  { label: "کاربران", href: "/users", icon: "tabler:users" },
  { label: "فروشندگان", href: "/shops", icon: "tabler:building-store" },
  { label: "پنل فروشنده", href: "/vendor", icon: "tabler:briefcase" },
  { label: "محصولات من", href: "/vendor/products", icon: "tabler:box" },
  { label: "سفارشات من", href: "/vendor/orders", icon: "tabler:truck-delivery" },
  { label: "مدیریت انبار", href: "/inventory", icon: "tabler:warehouse" },
  { label: "صفحات", href: "/pages", icon: "tabler:file-text" },
  { label: "نظرات", href: "/reviews", icon: "tabler:message-star" },
  { label: "گزارشات", href: "/reports", icon: "tabler:chart-bar" },
  { label: "تنظیمات", href: "/settings", icon: "tabler:settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    const token = localStorage.getItem('atlas_token');
    if (!token && !isLoginPage) {
      router.push('/login');
      return;
    }
    if (token) {
      try {
        const u = JSON.parse(localStorage.getItem('atlas_user') || '{}');
        setUser(u);
      } catch {}
    }
    setLoading(false);
  }, [isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem('atlas_token');
    localStorage.removeItem('atlas_user');
    router.push('/login');
  };

  if (isLoginPage) {
    return (
      <html lang="fa" dir="rtl">
        <body style={{ background: '#F8F7FA' }}>{children}</body>
      </html>
    );
  }

  if (loading) {
    return (
      <html lang="fa" dir="rtl">
        <body>
          <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--v-bg)' }}>
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-[var(--v-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm" style={{ color: 'var(--v-text-secondary)' }}>در حال بارگذاری...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="fa" dir="rtl">
      <body>
        <div className="flex min-h-screen" style={{ background: 'var(--v-bg)' }}>
          {/* Sidebar */}
          <aside
            className="fixed top-0 right-0 h-full z-30 flex flex-col transition-all duration-300"
            style={{
              width: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed)',
              background: 'var(--v-card)',
              borderLeft: '1px solid var(--v-border)',
              boxShadow: 'var(--v-shadow-sm)',
            }}
          >
            {/* Logo */}
            <div
              className="flex items-center h-[var(--header-height)] px-4 shrink-0"
              style={{ borderBottom: '1px solid var(--v-divider)' }}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--v-primary)' }}
                >
                  <Icon icon="tabler:shopping-bag" className="text-white w-5 h-5" />
                </div>
                <span
                  className="font-bold text-base whitespace-nowrap transition-opacity duration-300"
                  style={{ color: 'var(--v-text)', opacity: sidebarOpen ? 1 : 0 }}
                >
                  اطلس شاپ
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-auto p-1.5 rounded-lg hover:bg-gray-100 transition shrink-0"
              >
                <Icon
                  icon={sidebarOpen ? "tabler:chevron-right" : "tabler:chevron-left"}
                  className="w-5 h-5"
                  style={{ color: 'var(--v-text-secondary)' }}
                />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                    style={{
                      background: isActive ? 'rgba(115, 103, 240, 0.08)' : 'transparent',
                      color: isActive ? 'var(--v-primary)' : 'var(--v-text-secondary)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(115, 103, 240, 0.04)';
                        e.currentTarget.style.color = 'var(--v-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--v-text-secondary)';
                      }
                    }}
                  >
                    <Icon icon={item.icon} className="w-5 h-5 shrink-0" />
                    <span
                      className="whitespace-nowrap transition-opacity duration-300"
                      style={{
                        opacity: sidebarOpen ? 1 : 0,
                        width: sidebarOpen ? 'auto' : 0,
                        overflow: 'hidden',
                      }}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <span
                        className="mr-auto w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: 'var(--v-primary)' }}
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div
              className="p-3 shrink-0"
              style={{ borderTop: '1px solid var(--v-divider)' }}
            >
              <div className="flex items-center gap-3 px-3 py-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: 'rgba(115, 103, 240, 0.12)', color: 'var(--v-primary)' }}
                >
                  {(user?.name || user?.email || 'A')[0].toUpperCase()}
                </div>
                <div className="min-w-0 transition-opacity duration-300" style={{ opacity: sidebarOpen ? 1 : 0 }}>
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--v-text)' }}>
                    {user?.name || 'کاربر'}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--v-text-secondary)' }}>
                    {user?.email || ''}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div
            className="flex-1 flex flex-col transition-all duration-300 min-h-screen"
            style={{ marginRight: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed)' }}
          >
            {/* Top Navbar */}
            <header
              className="sticky top-0 z-20 flex items-center h-[var(--header-height)] px-6"
              style={{
                background: 'var(--v-card)',
                borderBottom: '1px solid var(--v-border)',
              }}
            >
              {/* Mobile toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition ml-3"
              >
                <Icon icon="tabler:menu-2" className="w-5 h-5" style={{ color: 'var(--v-text-secondary)' }} />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-sm">
                <Icon icon="tabler:home" className="w-4 h-4" style={{ color: 'var(--v-text-secondary)' }} />
                <span style={{ color: 'var(--v-text-secondary)' }}>/</span>
                <span style={{ color: 'var(--v-text)' }}>
                  {sidebarItems.find((i) => i.href === pathname || (i.href !== '/' && pathname.startsWith(i.href)))?.label || 'داشبورد'}
                </span>
              </div>

              {/* Right side */}
              <div className="mr-auto flex items-center gap-2 relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(115, 103, 240, 0.12)', color: 'var(--v-primary)' }}
                  >
                    {(user?.name || user?.email || 'A')[0].toUpperCase()}
                  </div>
                  <span style={{ color: 'var(--v-text)' }} className="hidden sm:inline">
                    {user?.name || user?.email || 'کاربر'}
                  </span>
                  <Icon icon="tabler:chevron-down" className="w-4 h-4" style={{ color: 'var(--v-text-secondary)' }} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div
                      className="absolute top-full left-0 mt-1 w-48 z-20 rounded-lg py-1 shadow-lg animate-fade-in"
                      style={{ background: 'var(--v-card)', border: '1px solid var(--v-border)' }}
                    >
                      <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--v-divider)' }}>
                        <p className="text-sm font-medium" style={{ color: 'var(--v-text)' }}>{user?.name || 'کاربر'}</p>
                        <p className="text-xs" style={{ color: 'var(--v-text-secondary)' }}>{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition"
                        style={{ color: 'var(--v-error)' }}
                      >
                        <Icon icon="tabler:logout" className="w-4 h-4" />
                        خروج
                      </button>
                    </div>
                  </>
                )}
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 p-6 animate-fade-in">
              <ToastProvider>{children}</ToastProvider>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
