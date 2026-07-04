"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  mediaUrl,
  srcsetFromUrl,
  productCardSizes,
} from "@/lib/media";
import { HeadingWidget } from "./heading";
import { CountdownWidget } from "./countdown";

interface ProductItem {
  id: number;
  title: string;
  slug: string;
  price: number;
  salePrice?: number;
  images: string[];
  averageRating?: number;
}

function useProducts(data: any): ProductItem[] {
  const [products, setProducts] = useState<ProductItem[]>([]);
  useEffect(() => {
    if (!data) return;
    if (data.mode === "manual" && data.ids?.length) {
      api
        .get<ProductItem[]>(`/products?ids=${data.ids.join(",")}`)
        .then(setProducts)
        .catch(() => {});
    } else {
      const params = new URLSearchParams();
      if (data.filter?.by) params.set("sort", data.filter.by);
      if (data.filter?.category_ids?.length)
        params.set("categoryIds", data.filter.category_ids.join(","));
      if (data.filter?.brand_ids?.length)
        params.set("brandIds", data.filter.brand_ids.join(","));
      if (data.limit) params.set("limit", String(data.limit));
      api
        .get<ProductItem[]>(`/products?${params}`)
        .then(setProducts)
        .catch(() => {});
    }
  }, [data]);
  return products;
}

export { useProducts, type ProductItem };

export function ProductCarouselWidget({ s, v }: { s: any; v: number }) {
  const products = useProducts(s.data);

  if (v === 2) {
    return (
      <div
        className="dk-card overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #e53e3e, #c53030)",
          color: "#fff",
          borderRadius: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: 20,
          }}
        >
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700 }}>
              {s.title || "پیشنهاد شگفت‌انگیز"}
            </h3>
            <CountdownWidget
              s={{
                target_date: new Date(Date.now() + 86400000 * 2).toISOString(),
                title: "",
                style: "blocks",
              }}
              v={1}
            />
          </div>
          <div
            style={{ flex: 2, display: "flex", gap: 12, overflow: "hidden" }}
          >
            {products.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                style={{
                  minWidth: 140,
                  background: "#fff",
                  borderRadius: 12,
                  padding: 8,
                  textDecoration: "none",
                  color: "var(--dk-text)",
                }}
              >
                <img
                  src={mediaUrl(p.images?.[0])}
                  alt={p.title}
                  loading="lazy"
                  srcSet={srcsetFromUrl(p.images?.[0])}
                  sizes={productCardSizes({ desktop: 6, tablet: 4, mobile: 2 })}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    objectFit: "contain",
                  }}
                />
                <p style={{ fontSize: 11, lineClamp: 2, marginTop: 4 }}>
                  {p.title}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#e53e3e",
                    marginTop: 4,
                  }}
                >
                  {p.salePrice?.toLocaleString() || p.price.toLocaleString()}{" "}
                  تومان
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {s.title && (
        <HeadingWidget
          s={{
            text: s.title,
            typography: { size: 18, weight: 700 },
            link: s.link,
          }}
          v={3}
        />
      )}
      <div
        style={{ display: "flex", gap: 12, overflow: "auto", paddingBottom: 8 }}
      >
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            style={{
              minWidth: v === 3 ? 130 : 170,
              textDecoration: "none",
              color: "var(--dk-text)",
            }}
          >
            <div className="dk-card overflow-hidden">
              <img
                src={mediaUrl(p.images?.[0])}
                alt={p.title}
                loading="lazy"
                srcSet={srcsetFromUrl(p.images?.[0])}
                sizes={productCardSizes({ desktop: 6, tablet: 4, mobile: 2 })}
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
