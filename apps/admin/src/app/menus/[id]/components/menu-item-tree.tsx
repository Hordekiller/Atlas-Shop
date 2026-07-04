"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import type { MenuItem } from "./menu-types";
import { linkTypeLabels } from "./menu-types";
import { api } from "@/lib/api";

interface MenuItemTreeProps {
  menuId: string;
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onRefresh: () => void;
}

export default function MenuItemTree({ menuId, items, onEdit, onRefresh }: MenuItemTreeProps) {
  const [dragOver, setDragOver] = useState<number | null>(null);

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("آیا از حذف این آیتم اطمینان دارید؟")) return;
    try {
      await api.delete(`/menus/items/${itemId}`);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleItemActive = async (item: MenuItem) => {
    try {
      await api.put(`/menus/items/${item.id}`, { isActive: !item.isActive });
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDragStart = (e: React.DragEvent, itemId: number) => {
    e.dataTransfer.setData("text/plain", String(itemId));
  };

  const handleDrop = async (
    e: React.DragEvent,
    targetId: number,
    asChild: boolean = false,
  ) => {
    e.preventDefault();
    setDragOver(null);
    const draggedId = Number(e.dataTransfer.getData("text/plain"));
    if (draggedId === targetId) return;
    try {
      const flatItems = items || [];
      const dragged = flatItems.find((i) => i.id === draggedId);
      if (!dragged) return;
      const newParentId = asChild
        ? targetId
        : flatItems.find((i) => i.id === targetId)?.parentId || null;
      const newSortOrder = flatItems.filter(
        (i) => i.parentId === newParentId,
      ).length;
      await api.put(`/menus/${menuId}/reorder`, {
        items: [
          { id: draggedId, parentId: newParentId, sortOrder: newSortOrder },
        ],
      });
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const renderItem = (item: MenuItem, depth: number = 0) => (
    <div key={item.id} className="mb-1">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${dragOver === item.id ? "ring-2 ring-[var(--v-primary)]" : ""}`}
        style={{ background: "var(--v-bg)", marginRight: depth * 20 }}
        draggable
        onDragStart={(e) => handleDragStart(e, item.id)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(item.id);
        }}
        onDragLeave={() => setDragOver(null)}
        onDrop={(e) => handleDrop(e, item.id, false)}
      >
        <Icon
          icon="tabler:grip-vertical"
          className="w-4 h-4 shrink-0"
          style={{ color: "var(--v-text-disabled)", cursor: "grab" }}
        />
        {item.icon && <Icon icon={item.icon} className="w-4 h-4 shrink-0" />}
        {item.image && (
          <img
            src={item.image}
            alt=""
            className="w-6 h-6 rounded object-cover shrink-0"
          />
        )}
        <span className="flex-1 truncate font-medium">{item.title}</span>
        <span
          className="text-xs px-1.5 py-0.5 rounded"
          style={{
            background: "rgba(115,103,240,0.1)",
            color: "var(--v-primary)",
          }}
        >
          {linkTypeLabels[item.linkType] || item.linkType}
        </span>
        <span
          className={`w-2 h-2 rounded-full ${item.isActive ? "bg-green-500" : "bg-gray-300"}`}
        />
        <button
          onClick={() => onEdit(item)}
          className="p-1 rounded hover:bg-gray-200 transition"
        >
          <Icon
            icon="tabler:edit"
            className="w-3.5 h-3.5"
            style={{ color: "var(--v-text-secondary)" }}
          />
        </button>
        <button
          onClick={() => handleDeleteItem(item.id)}
          className="p-1 rounded hover:bg-gray-200 transition"
        >
          <Icon
            icon="tabler:trash"
            className="w-3.5 h-3.5"
            style={{ color: "var(--v-error)" }}
          />
        </button>
        <button
          onClick={() => handleToggleItemActive(item)}
          className="p-1 rounded hover:bg-gray-200 transition"
        >
          <Icon
            icon={item.isActive ? "tabler:eye-off" : "tabler:eye"}
            className="w-3.5 h-3.5"
            style={{ color: "var(--v-text-secondary)" }}
          />
        </button>
        <div className="relative group">
          <button className="p-1 rounded hover:bg-gray-200 transition">
            <Icon
              icon="tabler:indent-increase"
              className="w-3.5 h-3.5"
              style={{ color: "var(--v-text-secondary)" }}
            />
          </button>
          <div
            className="absolute top-full left-0 mt-1 w-32 z-20 rounded-lg py-1 shadow-lg hidden group-hover:block"
            style={{
              background: "var(--v-card)",
              border: "1px solid var(--v-border)",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDrop(e as any, item.id, true);
              }}
              className="w-full text-right px-3 py-2 text-sm hover:bg-gray-50 transition"
            >
              قرار دادن به عنوان زیرمنو
            </button>
          </div>
        </div>
      </div>
      {item.children?.map((child) => renderItem(child, depth + 1))}
    </div>
  );

  return <>{items.map((item) => renderItem(item))}</>;
}
