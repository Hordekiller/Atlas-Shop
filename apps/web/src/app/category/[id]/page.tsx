import { Metadata } from "next";
import CategoryPageClient from "./page-client";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function getCategory(id: string) {
  try {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    return {
      title: "دسته‌بندی",
      alternates: { canonical: `${SITE_URL}/category/${id}` },
    };
  }

  return {
    title: `${category.name} | ${SITE_NAME}`,
    description:
      category.description ||
      `خرید محصولات دسته ${category.name} در ${SITE_NAME}`,
    alternates: { canonical: `${SITE_URL}/category/${category.slug || id}` },
    openGraph: {
      title: `${category.name} | ${SITE_NAME}`,
      description: category.description || `خرید محصولات دسته ${category.name}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <CategoryPageClient />;
}
