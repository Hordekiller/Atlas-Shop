import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "فروشگاه اطلس",
  description: "فروشگاه اینترنتی اطلس شاپ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
