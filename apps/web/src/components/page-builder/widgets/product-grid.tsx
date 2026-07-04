"use client";

import Link from "next/link";
import {
  mediaUrl,
  srcsetFromUrl,
  productCardSizes,
} from "@/lib/media";
import { useProducts } from "./product-carousel";

export function ProductGridWidget({ s, v }: { s: any; v: number }) {
  const products = useProducts(s.data);
  const cols = s.columns || 4;
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: s.gap || 16,
        }}
      >
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            style={{ textDecoration: "none", color: "var(--dk-text)" }}
          >
            <div
              className={`dk-card overflow-hidden ${v === 2 ? "hover:shadow-lg transition-shadow" : ""}`}
            >
              <img
                src={mediaUrl(p.images?.[0])}
                alt={p.title}
                loading="lazy"
                srcSet={srcsetFromUrl(p.images?.[0])}
                sizes={productCardSizes({
                  desktop: cols,
                  tablet: 3,
                  mobile: 2,
                })}
                style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }}
              />
              <div style={{ padding: 8 }}>
                <p style={{ fontSize: 12, lineClamp: 2 }}>{p.title}</p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--dk-primary)",
                    marginTop: 4,
                  }}
                >
                  {p.salePrice?.toLocaleString() || p.price.toLocaleString()}{" "}
                  تومان
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
