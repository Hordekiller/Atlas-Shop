"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CountdownWidget({ s, v }: { s: any; v: number }) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const target = new Date(s.target_date).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [s.target_date]);
  const box = (label: string, val: number) => (
    <div style={{ textAlign: "center", minWidth: 56 }}>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "var(--pb-text)",
          background: "var(--pb-bg)",
          borderRadius: 8,
          padding: "8px 12px",
          ...(v === 1 ? {} : {}),
        }}
      >
        {String(val).padStart(2, "0")}
      </div>
      <div style={{ fontSize: 11, color: "var(--pb-muted)", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
  const boxContent = (
    <div
      style={{
        textAlign: "center",
        padding: 24,
        borderRadius: 12,
        ...(v === 2
          ? { background: "var(--pb-bg)" }
          : v === 3
            ? { background: "var(--pb-primary)", color: "#fff" }
            : {}),
      }}
    >
      {s.title && (
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
          {s.title}
        </h3>
      )}
      {v === 2 ? (
        <p style={{ fontSize: 24, fontWeight: 700 }}>
          {String(time.days).padStart(2, "0")}:
          {String(time.hours).padStart(2, "0")}:
          {String(time.minutes).padStart(2, "0")}:
          {String(time.seconds).padStart(2, "0")}
        </p>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {box("روز", time.days)}
          {box("ساعت", time.hours)}
          {box("دقیقه", time.minutes)}
          {box("ثانیه", time.seconds)}
        </div>
      )}
    </div>
  );
  return s.link?.url ? (
    <Link
      href={s.link.url}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {boxContent}
    </Link>
  ) : (
    boxContent
  );
}
