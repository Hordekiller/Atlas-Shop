import type { Metadata, Viewport } from "next";
import { Providers } from "@/lib/providers";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_SHORT_NAME } from "@/lib/site-config";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import { WalletProvider } from "@/context/WalletContext";
import CompareBar from "@/components/CompareBar";
import MobileBottomNav from "@/components/MobileBottomNav";
import FontLoader from "@/components/FontLoader";
import "@/lib/fontawesome";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#ef4056",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/pwa-icons/icon-192.png",
    apple: "/pwa-icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "fa_IR",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  alternates: { canonical: SITE_URL },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: SITE_SHORT_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/pwa-icons/icon-512.png`,
  description: SITE_DESCRIPTION,
  address: { "@type": "PostalAddress", addressCountry: "IR" },
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body
        className="pb-14 md:pb-0"
        style={{ background: "var(--dk-bg)", color: "var(--dk-text)" }}
      >
        <Providers>
          <CartProvider>
            <WalletProvider>
              <WishlistProvider>
                <CompareProvider>
                  <ToastProvider>
                    <FontLoader />
                    {children}
                    <MobileBottomNav />
                    <CompareBar />
                  </ToastProvider>
                </CompareProvider>
              </WishlistProvider>
            </WalletProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
