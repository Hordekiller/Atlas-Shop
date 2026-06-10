export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">پنل مدیریت اطلس شاپ</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>مدیر سیستم</span>
            <a href="#" className="hover:text-indigo-600">خروج</a>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white h-[calc(100vh-57px)] border-l p-4">
          <nav className="space-y-2 text-sm">
            {[
              "داشبورد",
              "محصولات",
              "دسته‌بندی‌ها",
              "سفارشات",
              "کاربران",
              "فروشندگان",
              "تخفیف‌ها",
              "گزارشات",
              "تنظیمات",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>

        <div className="flex-1 p-6">
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "کل فروش", value: "۰ ریال" },
              { label: "سفارشات امروز", value: "۰" },
              { label: "محصولات", value: "۰" },
              { label: "کاربران", value: "۰" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">آخرین سفارشات</h2>
            <p className="text-gray-500 text-sm">هنوز سفارشی ثبت نشده است.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
