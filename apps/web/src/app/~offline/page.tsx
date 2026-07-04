"use client";

import { useEffect } from "react";

export default function OfflinePage() {
  useEffect(() => {
    document.title = `قطع اتصال | ${process.env.NEXT_PUBLIC_SITE_NAME || "فروشگاه"}`;
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: "24px",
        textAlign: "center",
        fontFamily: "Tahoma, sans-serif",
        background: "#f9fafb",
      }}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ef4056"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18.36 6.64A9 9 0 0 1 20.77 15" />
        <path d="M6.16 6.16a9 9 0 0 0 2.68 13.79" />
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M11 4.71a9 9 0 0 1 10.29 6.29" />
      </svg>

      <h1
        style={{
          marginTop: "16px",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#374151",
        }}
      >
        قطع اتصال
      </h1>

      <p
        style={{
          marginTop: "8px",
          fontSize: "14px",
          color: "#6b7280",
          maxWidth: "320px",
        }}
      >
        اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.
      </p>

      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: "24px",
          padding: "10px 24px",
          background: "#ef4056",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        تلاش مجدد
      </button>
    </div>
  );
}
