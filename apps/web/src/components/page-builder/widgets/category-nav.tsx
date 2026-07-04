"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  mediaUrl,
  srcsetFromUrl,
} from "@/lib/media";

export function CategoryNavWidget({ s, v }: { s: any; v: number }) {
  const [cats, setCats] = useState<any[]>([]);
  useEffect(() => {
    const ids = (s.categories || []).map((c: any) => c.id).filter(Boolean);
    if (ids.length)
      api
        .get<any[]>(`/categories?ids=${ids.join(",")}`)
        .then(setCats)
        .catch(() => {});
    else
      api
        .get<any[]>("/categories")
        .then(setCats)
        .catch(() => {});
  }, [s.categories]);
  const isCircle = s.type !== "square";
  return (
    <div
      style={{ display: "flex", gap: 12, overflow: "auto", padding: "8px 0" }}
    >
      {cats.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.id}`}
          style={{
            textDecoration: "none",
            color: "var(--dk-text)",
            textAlign: "center",
            minWidth: isCircle ? 80 : 100,
          }}
        >
          <div
            style={{
              width: isCircle ? 64 : 80,
              height: isCircle ? 64 : 80,
              borderRadius: isCircle ? "50%" : 16,
              background: "var(--dk-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 6px",
              ...(v === 3
                ? { background: "none", border: "1px solid var(--dk-border)" }
                : {}),
            }}
          >
            {cat.image ? (
              <img
                src={mediaUrl(cat.image)}
                alt={cat.name}
                loading="lazy"
                srcSet={srcsetFromUrl(cat.image)}
                sizes="80px"
                style={{ width: "60%", height: "60%", objectFit: "contain" }}
              />
            ) : (
              <span style={{ fontSize: 20 }}>📁</span>
            )}
          </div>
          <span style={{ fontSize: 11, display: "block", lineHeight: 1.3 }}>
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
