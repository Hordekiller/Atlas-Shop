"use client";

import Link from "next/link";
import {
  mediaUrl,
  srcsetFromUrl,
  defaultSizes,
} from "@/lib/media";

export function ImageWidget({ s, v }: { s: any; v: number }) {
  const src = s.image?.media_id || "";
  const img = (
    <img
      src={mediaUrl(src)}
      alt={s.image?.alt || ""}
      loading="lazy"
      srcSet={srcsetFromUrl(src)}
      sizes={defaultSizes()}
      style={{
        width: "100%",
        borderRadius: 12,
        ...(v === 3 ? { transition: "transform 0.3s" } : {}),
      }}
      className={v === 3 ? "hover:scale-105" : ""}
    />
  );
  if (v === 2)
    return (
      <figure>
        {img}
        <figcaption
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "var(--pb-muted)",
            marginTop: 8,
          }}
        >
          {s.caption}
        </figcaption>
      </figure>
    );
  return s.link?.url ? <Link href={s.link.url}>{img}</Link> : img;
}
