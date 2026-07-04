"""Generate PWA icons: SVG + PNG (192x192, 512x512 maskable)."""
import os
from PIL import Image, ImageDraw

OUT = "apps/web/public/pwa-icons"
COLOR = "#ef4056"

SVG_192 = f"""<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff5a6e"/>
      <stop offset="100%" stop-color="{COLOR}"/>
    </linearGradient>
  </defs>
  <rect width="192" height="192" rx="40" fill="url(#g)"/>
  <g transform="translate(96,96)" fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-8,-44 L-28,-44 L-36,20 L36,20 L28,-44 Z"/>
    <path d="M-36,20 L-32,40 L40,40 L36,20"/>
    <circle cx="-24" cy="56" r="8" fill="white" stroke="none"/>
    <circle cx="24" cy="56" r="8" fill="white" stroke="none"/>
  </g>
</svg>"""

SVG_512 = f"""<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff5a6e"/>
      <stop offset="100%" stop-color="{COLOR}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#g)"/>
  <g transform="translate(256,256)" fill="none" stroke="white" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-24,-120 L-76,-120 L-96,52 L96,52 L76,-120 Z"/>
    <path d="M-96,52 L-84,104 L104,104 L96,52"/>
    <circle cx="-64" cy="148" r="20" fill="white" stroke="none"/>
    <circle cx="64" cy="148" r="20" fill="white" stroke="none"/>
  </g>
</svg>"""


def make_png(size, path):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    r = size // 5
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=COLOR)
    cx, cy = size // 2, size // 2
    s = size * 0.28
    # Shopping bag body
    top_y = int(cy - s * 1.1)
    bottom_y = int(cy + s * 0.8)
    bag_left = int(cx - s * 0.6)
    bag_right = int(cx + s * 0.6)
    draw.arc(
        [bag_left + 4, top_y - int(s * 0.5), bag_right - 4, top_y + int(s * 0.3)],
        0, 180, fill="white", width=max(2, size // 32)
    )
    draw.line([bag_left, top_y, bag_left, bottom_y], fill="white", width=max(2, size // 32))
    draw.line([bag_right, top_y, bag_right, bottom_y], fill="white", width=max(2, size // 32))
    draw.line([bag_left, bottom_y, bag_right, bottom_y], fill="white", width=max(2, size // 32))
    # Handle
    handle_top = int(top_y - s * 0.45)
    draw.arc(
        [cx - int(s * 0.35), handle_top, cx + int(s * 0.35), top_y],
        0, 180, fill="white", width=max(2, size // 32)
    )
    img.save(path, "PNG")


os.makedirs(OUT, exist_ok=True)

with open(f"{OUT}/icon-192.svg", "w") as f:
    f.write(SVG_192)
with open(f"{OUT}/icon-512.svg", "w") as f:
    f.write(SVG_512)

make_png(192, f"{OUT}/icon-192.png")
make_png(512, f"{OUT}/icon-512.png")
make_png(512, f"{OUT}/icon-512-maskable.png")

print("Icons generated in", OUT)
