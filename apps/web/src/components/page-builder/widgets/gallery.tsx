"use client";

import { useState } from "react";
import {
  mediaUrl,
  srcsetFromUrl,
  defaultSizes,
} from "@/lib/media";

export function GalleryWidget({ s, v }: { s: any; v: number }) {
  const images = s.images || [];
  if (v === 3) {
    const [idx, setIdx] = useState(0);
    if (!images.length)
      return <div className="text-sm text-gray-400">گالری خالی</div>;
    return (
      <div
        style={{ position: "relative", overflow: "hidden", borderRadius: 12 }}
      >
        <div
          style={{
            display: "flex",
            transition: "transform 0.3s",
            transform: `translateX(-${idx * 100}%)`,
          }}
        >
          {images.map((img: any, i: number) => (
            <img
              key={i}
              src={mediaUrl(img.media_id)}
              alt={img.alt || ""}
              loading="lazy"
              srcSet={srcsetFromUrl(img.media_id)}
              sizes={defaultSizes()}
              style={{ minWidth: "100%", height: 300, objectFit: "cover" }}
            />
          ))}
        </div>
        {images.length > 1 && (
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
            {images.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  border: "none",
                  background:
                    i === idx ? "var(--pb-primary)" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${s.columns || 3}, 1fr)`,
        gap: s.gap || 8,
      }}
    >
      {images.map((img: any, i: number) => (
        <img
          key={i}
          src={mediaUrl(img.media_id)}
          alt={img.alt || ""}
          loading="lazy"
          srcSet={srcsetFromUrl(img.media_id)}
          sizes={defaultSizes()}
          style={{
            width: "100%",
            borderRadius: 8,
            ...(v === 2 ? { objectFit: "cover" } : {}),
          }}
        />
      ))}
    </div>
  );
}
