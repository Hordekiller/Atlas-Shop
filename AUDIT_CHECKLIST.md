# چک‌لیست فاز ۱۶ — رفع نواقص ممیزی

> شروع: ۲۱ خرداد ۱۴۰۵
> پایان: ۲۱ خرداد ۱۴۰۵

---

## 🔴 بحرانی (Critical)

- [x] **۱. سیستم نوتیفیکیشن (In-app + Email)**
  - [x] جدول `Notification` در Prisma + migration
  - [x] ماژول `Notifications` در API (CRUD + لیست + خواندن + حذف)
  - [x] سرویس ایمیل (Nodemailer با SMTP از env)
  - [x] یکپارچه با Orders (نوتیفیکیشن و ایمیل هنگام ثبت سفارش + تغییر وضعیت)
  - [x] Queue و Retry برای ارسال‌های ناموفق
  - [x] API `GET /notifications` (فهرست اعلان‌های کاربر)
  - [x] API `PUT /notifications/:id/read`
  - [x] API `PUT /notifications/read-all`
  - [x] API `GET /notifications/unread-count`
  - [x] Bell icon در هدر frontend با unread count
  - [x] Dropdown اعلان‌ها در هدر
  - [x] صفحه `/panel/notifications` کامل (لیست، صفحه‌بندی، خواندن، حذف، خواندن همه)
  - [x] مدیریت نوتیفیکیشن در پنل ادمین (لیست، جزئیات)
  - [x] قالب پیام (Template) قابل تنظیم
    - [x] مدل `NotificationTemplate` + ۵ قالب پیش‌فرض
    - [x] API CRUD برای مدیریت قالب‌ها
    - [x] قالب HTML ایمیل با متغیرهای `{orderNumber}`، `{amount}`، `{userName}`
    - [x] بازگشت به متن پیش‌فرض در صورت نبود قالب
    - [x] صفحه مدیریت قالب در پنل ادمین + منوی سایدبار

- [x] **۲. XSS Sanitization صفحه‌ساز**
  - [x] تعریف تابع `sanitizeHTML` با allow-list تگ‌های مجاز (کلاینت)
  - [x] اعمال sanitize روی تمام `dangerouslySetInnerHTML`
  - [x] نصب `sanitize-html` در API سمت سرور + اعمال روی contentJson

- [x] **۳. CSRF + Rate Limiting + Helmet**
  - [x] نصب و پیکربندی `@nestjs/throttler` (۶۰ ریکوئست در دقیقه)
  - [x] نصب `helmet` و اعمال در main.ts
  - [x] JWT Bearer محافظت CSRF (احراز هویت در هدر)

---

## 🟡 مهم (Important)

- [x] **۴. Dead Settings: taxPercent در سفارش**
  - [x] خواندن `taxPercent` از `ShopSettings` در `orders.service.ts`
  - [x] محاسبه مالیات و ذخیره در فیلد `taxAmount`
  - [x] اضافه شدن فیلد `taxAmount` به مدل `Order`
  - [x] نمایش ردیف مالیات در فاکتور و checkout (۴ صفحه مختلف)

- [x] **۵. Dead Settings: Shipping Methods در دیتابیس**
  - [x] مدل `ShippingMethod` در Prisma + migration
  - [x] سرویس `ShippingService` با خواندن از دیتابیس
  - [x] CRUD ادمین برای روش‌های ارسال
  - [x] جایگزینی هاردکد در `shipping.controller.ts`

- [x] **۶. OTP واقعی + فرم لاگین موبایل**
  - [x] جایگزینی کد ۱۲۳۴۵ با `crypto.randomInt(100000, 999999)`
  - [x] فرم لاگین/ثبت‌نام با شماره موبایل در frontend (ورود با OTP)
  - [x] زمان‌دار کردن OTP (انقضا ۲ دقیقه)
  - [x] Rate limit سراسری (شامل otp/request)

- [x] **۷. تزریق فونت و رنگ سراسری در فرانت**
  - [x] کامپوننت `FontLoader` که `GET /fonts/css` را لود می‌کند
  - [x] تزریق `global_colors` به CSS Variables سراسری (`:root`)
  - [x] تزریق همزمان `--dk-*` برای backward compatibility
  - [x] `FontLoader` در `layout.tsx` همه صفحات

- [x] **۸. اعتبارسنجی `content_json` سمت سرور**
  - [x] validation کامل در `pages.service.ts` هنگام create/update
  - [x] بررسی schema_version (باید ۱ باشد)
  - [x] بررسی تعداد sections (max 50), columns (max 6), widgets (max 30)
  - [x] بررسی نوع ویجت (در لیست ۱۷ نوع مجاز)
  - [x] بررسی variant (باید ۱-۳ باشد)
  - [x] بررسی ساختار id/type/columns/widgets
  - [x] sanitize-html روی فیلدهای HTML در contentJson

- [x] **۹. JSON-LD + Sitemap کامل**
  - [x] JSON-LD Product (`@type: Product` + `@type: Offer`) در صفحه محصول
  - [x] JSON-LD Article (`@type: Article`) در صفحه بلاگ
  - [x] Sitemap پویا شامل محصولات + دسته‌بندی‌ها + صفحات + بلاگ

- [x] **10. srcset و responsive images**
  - [x] تولید thumbnail در زمان آپلود (۵ سایز با sharp)
  - [x] خروجی srcset در رندر کننده صفحه‌ساز (۱۰ ویجت)
  - [x] srcset در گالری محصول

---

## 🟢 جزئی (Low)

- [x] **۱۱. Undo/Redo در Page Builder**
  - [x] تاریخچه undo/redo با ظرفیت ۵۰
  - [x] دکمه‌های واگردانی/بازگردانی در تولبار
  - [x] میانبرهای صفحه کلید Ctrl+Z / Ctrl+Y

- [x] **۱۲. Revisions (تاریخچه نسخه‌ها)**
  - [x] مدل `PageRevision` در Prisma + migration
  - [x] ذخیره خودکار نسخه قبل از ویرایش
  - [x] پنل تاریخچه در صفحه‌ساز ادمین با قابلیت بازگردانی
  - [x] API `GET /pages/:id/revisions` و `POST /pages/:id/revisions/:revId/restore`

- [x] **۱۳. Save for Later در سبد خرید**
  - [x] مدل `SavedItem` در Prisma + migration
  - [x] API `POST /cart/save-for-later`, `GET /cart/saved-items`, `POST /cart/move-to-cart`
  - [x] `saveForLater()` / `moveToCart()` در CartContext (localStorage برای مهمان)

- [x] **۱۴. دکمه «خبرم کن» برای محصول ناموجود**
  - [x] مدل `StockAlert` در Prisma + migration
  - [x] API `POST /stock-alerts`, `GET /stock-alerts/my`, `DELETE /stock-alerts/:id`
  - [x] دکمه "خبرم کن" در صفحه محصول (جایگزین "افزودن به سبد" در محصولات ناموجود)

- [x] **۱۵. فاکتور PDF**
  - [x] سرویس تولید PDF با pdfkit (فونت فارسی)
  - [x] API `GET /invoices/:orderId/download` و `GET /admin/invoices/:orderId/download`
  - [x] دکمه دانلود فاکتور در صفحه سفارش کاربر و پنل

- [x] **۱۶. مرجوعی کالا از سمت مشتری**
  - [x] مدل `ReturnRequest` در Prisma + migration
  - [x] API `POST /returns`, `GET /returns` (کاربر)، `GET /admin/returns`, `PUT /admin/returns/:id/status` (ادمین)
  - [x] صفحه مدیریت بازگشت کالا در پنل ادمین
  - [x] منوی "بازگشت کالا" در سایدبار ادمین

- [x] **۱۷. محدودیت عمق درخت content_json** (در validation گنجانده شد)

- [x] **۱۸. Schedule انتشار صفحه**
  - [x] فیلدهای `publishAt` / `unpublishAt` در مدل Page
  - [x] سرویس زمانبند (بررسی هر ۵ دقیقه)
  - [x] فیلتر در کوئری‌های `findActive` / `findBySlug`

---

## وضعیت کلی

| اولویت  | تعداد کل | انجام‌شده | باقی‌مانده |
| ------- | -------- | --------- | ---------- |
| بحرانی  | ۳        | ۳         | ۰          |
| مهم     | ۷        | ۷         | ۰          |
| جزئی    | ۸        | ۸         | ۰          |
| **جمع** | **۱۸**   | **۱۸**    | **۰**      |

> ✅ **تمامی آیتم‌های فاز ۱۶ با موفقیت به اتمام رسید.**
