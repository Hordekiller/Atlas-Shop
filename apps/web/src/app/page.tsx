export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">اطلس شاپ</h1>
          <nav className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-indigo-600">محصولات</a>
            <a href="#" className="hover:text-indigo-600">دسته بندی‌ها</a>
            <a href="#" className="hover:text-indigo-600">سبد خرید</a>
            <a href="#" className="hover:text-indigo-600">ورود</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          به اطلس شاپ خوش آمدید
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          فروشگاه اینترنتی چند فروشندگی با پشتیبانی از درگاه‌های پرداخت ایرانی
        </p>
        <a
          href="#"
          className="inline-block rounded-lg bg-indigo-600 px-8 py-3 text-white font-medium hover:bg-indigo-700"
        >
          مشاهده محصولات
        </a>
      </section>
    </main>
  );
}
