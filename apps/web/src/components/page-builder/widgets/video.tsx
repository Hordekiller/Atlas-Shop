"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { mediaUrl } from "@/lib/media";

export function VideoWidget({ s, v }: { s: any; v: number }) {
  if (s.source === "youtube" && s.url) {
    const embed = s.url
      .replace("watch?v=", "embed/")
      .replace("youtu.be/", "youtube.com/embed/");
    return (
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          borderRadius: v === 3 ? 12 : 0,
          overflow: "hidden",
          boxShadow: v === 3 ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <iframe
          src={embed}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          allowFullScreen
        />
      </div>
    );
  }
  if (s.source === "upload" && s.media_id) {
    return (
      <div style={{ position: "relative" }}>
        <video
          controls
          style={{ width: "100%", borderRadius: v === 3 ? 12 : 0 }}
          poster={mediaUrl(s.poster?.media_id) || ""}
        >
          <source src={mediaUrl(s.media_id)} />
        </video>
        {v === 2 && !s.autoplay && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon icon={faPlay} className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>
    );
  }
  return <div className="text-sm text-gray-400 p-4">ویدیو یافت نشد</div>;
}
