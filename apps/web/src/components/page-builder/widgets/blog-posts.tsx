"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  mediaUrl,
  srcsetFromUrl,
} from "@/lib/media";

export function BlogPostsWidget({ s, v }: { s: any; v: number }) {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => {
    const params = new URLSearchParams();
    if (s.data?.limit) params.set("limit", String(s.data.limit));
    api
      .get<any[]>(`/blog?${params}`)
      .then(setPosts)
      .catch(() => {});
  }, [s.data]);
  if (v === 3 && posts[0]) {
    const p = posts[0];
    return (
      <Link
        href={`/blog/${p.slug}`}
        style={{
          display: "block",
          position: "relative",
          height: 300,
          borderRadius: 12,
          overflow: "hidden",
          textDecoration: "none",
          color: "#fff",
        }}
      >
        <img
          src={mediaUrl(p.image)}
          alt={p.title}
          loading="lazy"
          srcSet={srcsetFromUrl(p.image)}
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            inset: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 24,
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
          }}
        >
          <h3 style={{ fontSize: 20, fontWeight: 700 }}>{p.title}</h3>
          {s.show_meta && (
            <p style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>
              {new Date(p.createdAt).toLocaleDateString("fa-IR")}
            </p>
          )}
        </div>
      </Link>
    );
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 16,
      }}
    >
      {posts.map((p) => (
        <Link
          key={p.id}
          href={`/blog/${p.slug}`}
          style={{ textDecoration: "none", color: "var(--dk-text)" }}
        >
          <div className="dk-card overflow-hidden">
            {p.image && (
              <img
                src={mediaUrl(p.image)}
                alt={p.title}
                loading="lazy"
                srcSet={srcsetFromUrl(p.image)}
                sizes="(max-width: 768px) 100vw, 250px"
                style={{ width: "100%", height: 160, objectFit: "cover" }}
              />
            )}
            <div style={{ padding: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, lineClamp: 2 }}>
                {p.title}
              </h3>
              {s.show_excerpt && p.excerpt && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--dk-text-light)",
                    marginTop: 4,
                    lineClamp: 2,
                  }}
                >
                  {p.excerpt}
                </p>
              )}
              {s.show_meta && (
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--dk-text-light)",
                    marginTop: 8,
                  }}
                >
                  {new Date(p.createdAt).toLocaleDateString("fa-IR")}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
