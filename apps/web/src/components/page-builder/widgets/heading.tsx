"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export function HeadingWidget({ s, v }: { s: any; v: number }) {
  const level = s.seo?.heading_level || "h2";
  const link = s.link?.url;
  const headingStyle: React.CSSProperties = {
    margin: 0,
    fontSize: s.typography?.size || 24,
    fontWeight: s.typography?.weight || 700,
    lineHeight: s.typography?.line_height || 1.4,
    textAlign: (s.typography?.align || "right") as any,
    color: "var(--pb-text)",
  };
  const children = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        ...(v === 3 ? { justifyContent: "space-between" } : {}),
      }}
    >
      {level === "h1" ? (
        <h1 style={headingStyle}>{s.text}</h1>
      ) : level === "h2" ? (
        <h2 style={headingStyle}>{s.text}</h2>
      ) : level === "h3" ? (
        <h3 style={headingStyle}>{s.text}</h3>
      ) : level === "h4" ? (
        <h4 style={headingStyle}>{s.text}</h4>
      ) : (
        <h2 style={headingStyle}>{s.text}</h2>
      )}
      {v === 2 && (
        <div style={{ flex: 1, height: 2, background: "var(--pb-primary)" }} />
      )}
      {v === 3 && link && (
        <Link
          href={link}
          style={{
            fontSize: 13,
            color: "var(--pb-primary)",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          مشاهده همه{" "}
          <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
  return <div style={{ marginBottom: 16 }}>{children}</div>;
}
