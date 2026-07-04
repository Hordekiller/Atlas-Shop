"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  mediaUrl,
  srcsetFromUrl,
} from "@/lib/media";

export function BannerSliderWidget({ s, v }: { s: any; v: number }) {
  const [idx, setIdx] = useState(0);
  const slides = s.slides || [];
  useEffect(() => {
    if (!s.autoplay || slides.length <= 1) return;
    const t = setInterval(
      () => setIdx((prev) => (prev + 1) % slides.length),
      4000,
    );
    return () => clearInterval(t);
  }, [s.autoplay, slides.length]);
  if (!slides.length) return null;
  const slide = slides[idx];
  const height =
    typeof window !== "undefined" && window.innerWidth < 768
      ? s.height_mobile || 250
      : s.height_desktop || 400;
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 12,
        height,
      }}
    >
      <img
        src={mediaUrl(slide.image?.media_id)}
        alt={slide.image?.alt || ""}
        loading="lazy"
        srcSet={srcsetFromUrl(slide.image?.media_id)}
        sizes="100vw"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          inset: 0,
        }}
      />
      {(slide.title || slide.subtitle || slide.button_text) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.3)",
            color: "#fff",
            padding: 24,
            textAlign: "center",
          }}
        >
          {slide.title && (
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
              {slide.title}
            </h2>
          )}
          {slide.subtitle && (
            <p style={{ fontSize: 16, marginBottom: 16 }}>{slide.subtitle}</p>
          )}
          {slide.button_text && slide.link?.url && (
            <Link
              href={slide.link.url}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                background: "var(--pb-primary)",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              {slide.button_text}
            </Link>
          )}
        </div>
      )}
      {(s.navigation === "dots" || s.navigation === "both") && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 6,
          }}
        >
          {slides.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: "2px solid #fff",
                background: i === idx ? "#fff" : "transparent",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
