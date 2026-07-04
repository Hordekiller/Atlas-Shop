"use client";

import { sanitizeHTML } from "../sanitize";

export function TextWidget({ s, v }: { s: any; v: number }) {
  const style: React.CSSProperties = {
    fontSize: s.typography?.size || 14,
    lineHeight: s.typography?.line_height || 1.8,
    color: "var(--pb-text)",
    textAlign: (s.typography?.align || "right") as any,
  };
  if (v === 2) style.columnCount = 2;
  if (v === 3)
    return (
      <div
        className="rounded-xl p-4"
        style={{
          background: "var(--pb-bg)",
          borderRight: "4px solid var(--pb-primary)",
          ...style,
        }}
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(s.html || "") }}
      />
    );
  return (
    <div
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizeHTML(s.html || "") }}
    />
  );
}
