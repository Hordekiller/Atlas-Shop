"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { MenuItem } from "./menu-types";
import { linkTypeLabels } from "./menu-types";

interface MenuItemFormProps {
  menuId: string;
  editingItem: MenuItem | null;
  menuItems: MenuItem[];
  onClose: () => void;
  onSaved: () => void;
}

interface FormState {
  title: string;
  linkType: string;
  linkValue: string;
  icon: string;
  image: string;
  parentId: string;
}

export default function MenuItemForm({
  menuId,
  editingItem,
  menuItems,
  onClose,
  onSaved,
}: MenuItemFormProps) {
  const [form, setForm] = useState<FormState>({
    title: "",
    linkType: "custom_url",
    linkValue: "",
    icon: "",
    image: "",
    parentId: "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title,
        linkType: editingItem.linkType,
        linkValue: editingItem.linkValue,
        icon: editingItem.icon || "",
        image: editingItem.image || "",
        parentId: String(editingItem.parentId || ""),
      });
    } else {
      setForm({
        title: "",
        linkType: "custom_url",
        linkValue: "",
        icon: "",
        image: "",
        parentId: "",
      });
    }
  }, [editingItem]);

  useEffect(() => {
    Promise.all([
      api.get<any[]>("/categories"),
      api.get<any[]>("/brands"),
      api.get<any[]>("/pages/active"),
    ])
      .then(([cats, brds, pgs]) => {
        setCategories(cats);
        setBrands(brds);
        setPages(pgs);
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    if (!form.title.trim()) return alert("عنوان الزامی است");
    try {
      if (editingItem) {
        await api.put(`/menus/items/${editingItem.id}`, {
          ...form,
          parentId: form.parentId ? Number(form.parentId) : null,
        });
      } else {
        await api.post(`/menus/${menuId}/items`, {
          ...form,
          parentId: form.parentId ? Number(form.parentId) : null,
        });
      }
      onSaved();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg rounded-xl p-6"
          style={{
            background: "var(--v-card)",
            border: "1px solid var(--v-border)",
          }}
        >
          <h3
            className="text-lg font-bold mb-4"
            style={{ color: "var(--v-text)" }}
          >
            {editingItem ? "ویرایش آیتم" : "آیتم جدید"}
          </h3>
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--v-text)" }}
              >
                عنوان
              </label>
              <input
                className="v-input"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--v-text)" }}
              >
                نوع لینک
              </label>
              <select
                className="v-select"
                value={form.linkType}
                onChange={(e) => {
                  setForm({
                    ...form,
                    linkType: e.target.value,
                    linkValue: "",
                  });
                }}
              >
                {Object.entries(linkTypeLabels).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--v-text)" }}
              >
                مقصد
              </label>
              {form.linkType === "category" ? (
                <select
                  className="v-select"
                  value={form.linkValue}
                  onChange={(e) =>
                    setForm({ ...form, linkValue: e.target.value })
                  }
                >
                  <option value="">انتخاب دسته</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : form.linkType === "brand" ? (
                <select
                  className="v-select"
                  value={form.linkValue}
                  onChange={(e) =>
                    setForm({ ...form, linkValue: e.target.value })
                  }
                >
                  <option value="">انتخاب برند</option>
                  {brands.map((b: any) => (
                    <option key={b.id} value={String(b.id)}>
                      {b.name}
                    </option>
                  ))}
                </select>
              ) : form.linkType === "page" ? (
                <select
                  className="v-select"
                  value={form.linkValue}
                  onChange={(e) =>
                    setForm({ ...form, linkValue: e.target.value })
                  }
                >
                  <option value="">انتخاب صفحه</option>
                  {pages.map((p: any) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.title}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="v-input"
                  value={form.linkValue}
                  onChange={(e) =>
                    setForm({ ...form, linkValue: e.target.value })
                  }
                  placeholder="URL دلخواه مانند /products یا https://..."
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--v-text)" }}
                >
                  آیکون (اختیاری)
                </label>
                <input
                  className="v-input"
                  value={form.icon}
                  onChange={(e) =>
                    setForm({ ...form, icon: e.target.value })
                  }
                  placeholder="tabler:home"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--v-text)" }}
                >
                  تصویر (اختیاری)
                </label>
                <input
                  className="v-input"
                  value={form.image}
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.value })
                  }
                  placeholder="URL تصویر"
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--v-text)" }}
              >
                والد (برای زیرمنو)
              </label>
              <select
                className="v-select"
                value={form.parentId}
                onChange={(e) =>
                  setForm({ ...form, parentId: e.target.value })
                }
              >
                <option value="">بدون والد (ریشه)</option>
                {(menuItems || [])
                  .filter((i: MenuItem) => !i.parentId)
                  .map((i: MenuItem) => (
                    <option key={i.id} value={String(i.id)}>
                      {i.title}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="v-btn v-btn-primary flex-1"
              >
                ذخیره
              </button>
              <button
                onClick={onClose}
                className="v-btn v-btn-secondary flex-1"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
