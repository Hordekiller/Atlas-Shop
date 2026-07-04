"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  mediaUrl,
  srcsetFromUrl,
} from "@/lib/media";

export function BrandSliderWidget({ s, v }: { s: any; v: number }) {
  const [brands, setBrands] = useState<any[]>([]);
  useEffect(() => {
    const ids = s.brand_ids || [];
    if (ids.length)
      api
        .get<any[]>(`/brands?ids=${ids.join(",")}`)
        .then(setBrands)
        .catch(() => {});
    else
      api
        .get<any[]>("/brands")
        .then(setBrands)
        .catch(() => {});
  }, [s.brand_ids]);
  return (
    <div
      style={{ display: "flex", gap: 16, overflow: "auto", padding: "12px 0" }}
    >
      {brands.map((b) => (
        <Link
          key={b.id}
          href={`/brands/${b.slug || b.id}`}
          style={{
            textDecoration: "none",
            textAlign: "center",
            minWidth: 100,
            ...(v === 3
              ? {
                  border: "1px solid var(--dk-border)",
                  borderRadius: 12,
                  padding: 12,
                }
              : {}),
          }}
        >
          {b.logo ? (
            <img
              src={mediaUrl(b.logo)}
              alt={b.name}
              loading="lazy"
              srcSet={srcsetFromUrl(b.logo)}
              sizes="64px"
              style={{
                width: 64,
                height: 64,
                objectFit: "contain",
                ...(s.grayscale ? { filter: "grayscale(1)" } : {}),
                ...(s.grayscale && v !== 2
                  ? { transition: "filter 0.3s" }
                  : {}),
              }}
              className={s.grayscale && v !== 2 ? "hover:filter-none" : ""}
            />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--dk-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              {b.name}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
