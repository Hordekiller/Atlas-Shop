"use client";

import Link from "next/link";

export function ButtonWidget({ s, v }: { s: any; v: number }) {
  const sizeMap: Record<string, string> = {
    sm: "8px 16px",
    md: "12px 24px",
    lg: "16px 32px",
  };
  const btnStyle: React.CSSProperties = {
    padding: sizeMap[s.size || "md"] || "12px 24px",
    borderRadius: 8,
    fontSize: s.size === "sm" ? 13 : s.size === "lg" ? 16 : 14,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.2s",
  };
  if (v === 1 || v === 3) {
    btnStyle.background = "var(--pb-primary)";
    btnStyle.color = "#fff";
    btnStyle.border = "none";
  }
  if (v === 2) {
    btnStyle.background = "transparent";
    btnStyle.color = "var(--pb-primary)";
    btnStyle.border = "2px solid var(--pb-primary)";
  }
  if (s.full_width) btnStyle.width = "100%";
  btnStyle.justifyContent = "center";
  const content = (
    <>
      {s.icon && <span>{s.icon}</span>}
      {s.text}
    </>
  );
  return s.link?.url ? (
    <Link href={s.link.url} style={btnStyle}>
      {content}
    </Link>
  ) : (
    <button style={btnStyle}>{content}</button>
  );
}
