export interface Menu {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
}

export interface MegaMenuConfig {
  id: number;
  menuId: number | null;
  showCategories: boolean;
  showBrands: boolean;
  tabs: string;
  sidebarTitle: string | null;
  sidebarLinks: string;
  sidebarBanner: string | null;
  sidebarBannerLink: string | null;
}

export interface CategoryConfig {
  id: number;
  categoryId: number;
  icon: string | null;
  iconType: string;
  sidebarBanner: string | null;
  sidebarBannerLink: string | null;
  sidebarLinks: string;
  category?: {
    id: number;
    name: string;
    parentId?: number | null;
    slug?: string;
  };
}

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  slug: string;
  children?: Category[];
}

export interface SidebarLink {
  label: string;
  icon: string;
  href: string;
}

export function parseSidebarLinks(raw: string): SidebarLink[] {
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

export function sidebarLinksToText(links: SidebarLink[]): string {
  return links.map((l) => `${l.label}|${l.icon}|${l.href}`).join("\n");
}

export function textToSidebarLinks(text: string): SidebarLink[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|");
      return {
        label: parts[0] || "",
        icon: parts[1] || "",
        href: parts[2] || "",
      };
    });
}

export function flattenCategories(cats: Category[]): Category[] {
  const result: Category[] = [];
  const walk = (list: Category[]) => {
    for (const c of list) {
      result.push(c);
      if (c.children?.length) walk(c.children);
    }
  };
  walk(cats);
  return result;
}
