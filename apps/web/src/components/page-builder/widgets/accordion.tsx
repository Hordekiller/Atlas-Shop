"use client";

import { useState } from "react";
import { sanitizeHTML } from "../sanitize";

export function AccordionWidget({ s, v }: { s: any; v: number }) {
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) =>
    setOpen((prev) =>
      s.allow_multiple
        ? prev.includes(i)
          ? prev.filter((x) => x !== i)
          : [...prev, i]
        : prev.includes(i)
          ? []
          : [i],
    );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {(s.items || []).map((item: any, i: number) => (
        <div
          key={i}
          className="rounded-xl"
          style={{
            border: "1px solid var(--pb-border, #e0e0e6)",
            overflow: "hidden",
            ...(v === 2 ? { boxShadow: "0 2px 8px rgba(0,0,0,0.06)" } : {}),
          }}
        >
          <button
            onClick={() => toggle(i)}
            style={{
              width: "100%",
              textAlign: "right",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            <span>
              {v === 3 ? `${i + 1}. ` : ""}
              {item.title}
            </span>
            <span
              style={{
                transform: open.includes(i) ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            >
              {s.style === "plus" ? (open.includes(i) ? "−" : "+") : "▼"}
            </span>
          </button>
          {open.includes(i) && (
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid var(--pb-border, #e0e0e6)",
                fontSize: 14,
                lineHeight: 1.8,
              }}
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(item.content_html),
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
