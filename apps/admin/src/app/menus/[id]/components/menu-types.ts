export interface Menu {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
  items: MenuItem[];
}

export interface MenuItem {
  id: number;
  parentId: number | null;
  title: string;
  linkType: string;
  linkValue: string;
  icon: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  children?: MenuItem[];
}

export const linkTypeLabels: Record<string, string> = {
  category: "دسته‌بندی",
  product: "محصول",
  brand: "برند",
  page: "صفحه",
  custom_url: "لینک دلخواه",
};

export function buildTree(items: MenuItem[]): MenuItem[] {
  const map = new Map<number, MenuItem>();
  const roots: MenuItem[] = [];
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  sorted.forEach((i) => map.set(i.id, { ...i, children: [] }));
  sorted.forEach((i) => {
    if (i.parentId && map.has(i.parentId))
      map.get(i.parentId)!.children!.push(map.get(i.id)!);
    else if (!i.parentId) roots.push(map.get(i.id)!);
  });
  return roots;
}
