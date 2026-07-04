# مشارکت در فروشگاه اطلس

از مشارکت شما در پروژه فروشگاه اطلس خوشحالیم! لطفاً برای مشارکت موارد زیر را رعایت کنید.

## راه‌اندازی محیط توسعه

1. **کلون کردن پروژه:**
   ```bash
   git clone https://github.com/Hordekiller/Atlas-Shop.git
   cd Atlas-Shop
   ```

2. **نصب وابستگی‌ها:**
   ```bash
   npm install
   ```

3. **تنظیم متغیرهای محیطی:**
   ```bash
   cp .env.example .env
   ```
   سپس مقادیر واقعی را در `.env` وارد کنید (اطلاعات دیتابیس، JWT_SECRET، کلیدهای درگاه پرداخت و ...).

4. **تنظیم دیتابیس:**
   ```bash
   npm run db:migrate
   npm run db:generate
   npm run db:seed
   ```

5. **اجرای پروژه:**
   ```bash
   npm run dev
   ```

## استانداردهای کدنویسی

- از **TypeScript** استفاده کنید.
- کد خود را با `npm run lint` بررسی کنید.
- از命名‌گذاری camelCase برای متغیرها و توابع استفاده کنید.
- از ESLint و Prettier برای فرمت‌دهی کد استفاده می‌شود: `npm run format`

## قواعد commit messages (Conventional Commits)

| پیشوند | توضیح |
|--------|--------|
| `feat:` | ویژگی جدید |
| `fix:` | رفع باگ |
| `chore:` | تغییرات ساختی (build process، ابزارها، وابستگی‌ها) |
| `docs:` | مستندات |
| `refactor:` | بازنویسی کد بدون تغییر در عملکرد |
| `style:` | تغییرات فرمت‌دهی (فاصله، کاما، و ...) |
| `test:` | اضافه کردن یا رفع تست‌ها |

مثال:
```
feat: add product search endpoint
fix: resolve payment calculation precision
docs: update API documentation
```

## قواعد نام‌گذاری Branch

| نوع | الگو |
|--------|-------|
| ویژگی جدید | `feature/description` |
| رفع باگ | `fix/description` |
| مستندات | `docs/description` |
| بازنویسی | `refactor/description` |

مثال: `feature/user-authentication`, `fix/login-error`

## فرایند Pull Request

1. پروژه را **Fork** کنید.
2. یک **Branch** جدید ایجاد کنید (`git checkout -b feature/amazing-feature`).
3. تغییرات خود را **Commit** کنید (`git commit -m 'feat: add amazing feature'`).
4. Branch خود را **Push** کنید (`git push origin feature/amazing-feature`).
5. یک **Pull Request** ایجاد کنید و توضیح دهید چه تغییری ایجاد کرده‌اید.

## الزامات تست

- تست‌های موجود را با اجرای دستور مربوطه بررسی کنید.
- برای کد جدید، تست بنویسید.
- اطمینان حاصل کنید که همه تست‌ها پاس می‌شوند.

## گزارش مشکل

اگر باگی پیدا کردید یا پیشنهادی دارید، از GitHub Issues استفاده کنید.

## آیین‌نامه رفتاری

لطفاً [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) را مطالعه کنید.

## Persian Translation / ترجمه فارسی

This project is maintained by Persian-speaking developers. Issues, PRs, and discussions can be in either Persian or English.
