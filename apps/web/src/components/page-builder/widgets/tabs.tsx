"use client";

import { useState } from "react";
import { sanitizeHTML } from "../sanitize";

export function TabsWidget({ s, v }: { s: any; v: number }) {
  const [active, setActive] = useState(0);
  const isVertical = s.orientation === "vertical";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isVertical ? "row" : "column",
        gap: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          gap: 2,
          borderBottom: isVertical
            ? "none"
            : "2px solid var(--pb-border, #e0e0e6)",
          ...(isVertical
            ? { borderLeft: "2px solid var(--pb-border, #e0e0e6)" }
            : {}),
        }}
      >
        {(s.tabs || []).map((tab: any, i: number) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: active === i ? 600 : 400,
              color: active === i ? "var(--pb-primary)" : "var(--pb-muted)",
              border: "none",
              background: "none",
              cursor: "pointer",
              borderBottom:
                !isVertical && active === i
                  ? "2px solid var(--pb-primary)"
                  : "2px solid transparent",
              marginBottom: !isVertical ? -2 : 0,
              borderLeft:
                isVertical && active === i
                  ? "2px solid var(--pb-primary)"
                  : "2px solid transparent",
              marginLeft: isVertical ? -2 : 0,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {v === 3 && <span>{tab.icon || "📄"}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div
        style={{ padding: 16, fontSize: 14, lineHeight: 1.8 }}
        dangerouslySetInnerHTML={{
          __html: sanitizeHTML(s.tabs?.[active]?.content_html || ""),
        }}
      />
    </div>
  );
}
