"use client";

import { Icon } from "@iconify/react";
import type { Category } from "./mega-menu-types";

interface CategoryConfigCardProps {
  category: Category;
  icon: string;
  iconType: string;
  sidebarBanner: string;
  sidebarBannerLink: string;
  sidebarLinksText: string;
  saving: boolean;
  onIconChange: (v: string) => void;
  onIconTypeChange: (v: string) => void;
  onSidebarBannerChange: (v: string) => void;
  onSidebarBannerLinkChange: (v: string) => void;
  onSidebarLinksTextChange: (v: string) => void;
  onSave: () => void;
}

export default function CategoryConfigCard({
  category,
  icon,
  iconType,
  sidebarBanner,
  sidebarBannerLink,
  sidebarLinksText,
  saving,
  onIconChange,
  onIconTypeChange,
  onSidebarBannerChange,
  onSidebarBannerLinkChange,
  onSidebarLinksTextChange,
  onSave,
}: CategoryConfigCardProps) {
  return (
    <div className="v-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && iconType === "iconify" ? (
            <Icon
              icon={icon}
              className="w-5 h-5"
              style={{ color: "var(--v-primary)" }}
            />
          ) : icon ? (
            <img src={icon} alt="" className="w-5 h-5 rounded" />
          ) : null}
          <h3
            className="font-bold text-base"
            style={{ color: "var(--v-text)" }}
          >
            {category.name}
          </h3>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="v-btn v-btn-primary v-btn-sm"
        >
          <Icon
            icon={saving ? "tabler:loader-2" : "tabler:device-floppy"}
            className={`w-3.5 h-3.5 ${saving ? "animate-spin" : ""}`}
          />
          {saving ? "..." : "ذخیره"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--v-text)" }}
          >
            آیکون (Iconify)
          </label>
          <div className="flex gap-2">
            <input
              className="v-input flex-1"
              value={icon}
              onChange={(e) => onIconChange(e.target.value)}
              placeholder="tabler:box"
            />
          </div>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--v-text-secondary)" }}
          >
            نام آیکون از Iconify
          </p>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--v-text)" }}
          >
            نوع آیکون
          </label>
          <select
            className="v-select"
            value={iconType}
            onChange={(e) => onIconTypeChange(e.target.value)}
          >
            <option value="iconify">Iconify</option>
            <option value="image">تصویر</option>
          </select>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--v-text)" }}
          >
            بنر پنل کناری دسته
          </label>
          <input
            className="v-input"
            value={sidebarBanner}
            onChange={(e) => onSidebarBannerChange(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--v-text)" }}
          >
            لینک بنر دسته
          </label>
          <input
            className="v-input"
            value={sidebarBannerLink}
            onChange={(e) => onSidebarBannerLinkChange(e.target.value)}
            placeholder="/category/..."
          />
        </div>
      </div>
      <div className="mt-4">
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--v-text)" }}
        >
          لینک‌های پنل کناری (هر خط: عنوان|آیکون|لینک)
        </label>
        <textarea
          className="v-input min-h-[100px]"
          value={sidebarLinksText}
          onChange={(e) => onSidebarLinksTextChange(e.target.value)}
          placeholder="جعبه جادویی|tabler:gift|/magic-box"
        />
      </div>
    </div>
  );
}
