"use client";

export function IconBoxWidget({ s, v }: { s: any; v: number }) {
  const style: React.CSSProperties = {
    display: "flex",
    gap: 12,
    alignItems: "center",
  };
  if (v === 1) style.flexDirection = "column";
  style.textAlign = "center";
  const content = (
    <>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--pb-primary)",
          color: "#fff",
          fontSize: 24,
        }}
      >
        {s.icon}
      </div>
      <div>
        <strong style={{ display: "block", marginBottom: 4 }}>{s.title}</strong>
        {s.desc && (
          <span style={{ fontSize: 13, color: "var(--pb-muted)" }}>
            {s.desc}
          </span>
        )}
      </div>
    </>
  );
  if (v === 3)
    return (
      <div className="dk-card p-4" style={{ textAlign: "center" }}>
        {content}
      </div>
    );
  return <div style={style}>{content}</div>;
}
