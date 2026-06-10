import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "پنل مدیریت اطلس شاپ",
  description: "پنل مدیریت فروشگاه اطلس",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
