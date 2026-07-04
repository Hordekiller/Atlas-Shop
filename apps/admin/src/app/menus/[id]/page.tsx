"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { api } from "@/lib/api";
import type { Menu, MenuItem } from "./components/menu-types";
import { buildTree } from "./components/menu-types";
import MenuItemTree from "./components/menu-item-tree";
import MenuItemForm from "./components/menu-item-form";

export default function MenuEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    api
      .get<any>("/menus/" + id)
      .then(setMenu)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const fetchMenu = () => {
    api
      .get<any>("/menus/" + id)
      .then(setMenu)
      .catch(console.error);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/menus/${id}`, {
        name: menu?.name,
        isActive: menu?.isActive,
      });
      router.push("/menus");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const openNewItem = () => {
    setEditingItem(null);
    setShowItemForm(true);
  };

  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[var(--v-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!menu)
    return (
      <div className="v-card p-12 text-center">
        <p style={{ color: "var(--v-text-secondary)" }}>منو یافت نشد.</p>
      </div>
    );

  const tree = buildTree(menu.items || []);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/menus")}
          className="v-btn v-btn-secondary v-btn-sm"
        >
          <Icon icon="tabler:arrow-right" className="w-4 h-4" /> بازگشت
        </button>
        <div className="flex-1">
          <input
            className="v-input text-xl font-bold"
            value={menu.name}
            onChange={(e) => setMenu({ ...menu, name: e.target.value })}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              color: "var(--v-text)",
            }}
          />
          <p className="text-sm" style={{ color: "var(--v-text-secondary)" }}>
            {menu.location}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <span style={{ color: "var(--v-text-secondary)" }}>فعال</span>
          <input
            type="checkbox"
            className="v-checkbox"
            checked={menu.isActive}
            onChange={(e) => setMenu({ ...menu, isActive: e.target.checked })}
          />
        </label>
        <button
          onClick={handleSave}
          disabled={saving}
          className="v-btn v-btn-primary"
        >
          <Icon
            icon={saving ? "tabler:loader-2" : "tabler:device-floppy"}
            className={`w-4 h-4 ${saving ? "animate-spin" : ""}`}
          />
          ذخیره
        </button>
      </div>

      <div className="v-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold" style={{ color: "var(--v-text)" }}>
            آیتم‌های منو
          </h2>
          <button
            onClick={openNewItem}
            className="v-btn v-btn-primary v-btn-sm"
          >
            <Icon icon="tabler:plus" className="w-3.5 h-3.5" /> افزودن آیتم
          </button>
        </div>
        <p
          className="text-xs mb-4"
          style={{ color: "var(--v-text-secondary)" }}
        >
          آیتم‌ها را با کشیدن مرتب کنید. برای زیرمنو کردن، روی آیکون تورفتگی
          کلیک کنید.
        </p>
        {tree.length === 0 ? (
          <div className="p-8 text-center">
            <Icon
              icon="tabler:list"
              className="w-10 h-10 mx-auto mb-2"
              style={{ color: "var(--v-text-disabled)" }}
            />
            <p style={{ color: "var(--v-text-secondary)" }}>
              هنوز هیچ آیتمی اضافه نشده است.
            </p>
          </div>
        ) : (
          <MenuItemTree
            menuId={id}
            items={menu.items || []}
            onEdit={openEditItem}
            onRefresh={fetchMenu}
          />
        )}
      </div>

      {showItemForm && (
        <MenuItemForm
          menuId={id}
          editingItem={editingItem}
          menuItems={menu.items || []}
          onClose={() => setShowItemForm(false)}
          onSaved={() => {
            setShowItemForm(false);
            fetchMenu();
          }}
        />
      )}
    </div>
  );
}
