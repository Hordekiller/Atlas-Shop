import { Metadata } from "next";
import BlogPostClient from "./page-client";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function getPost(slug: string) {
  try {
    const res = await fetch(`${API_URL}/blog/posts/${slug}`, {
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "مطلب مورد نظر یافت نشد",
      alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    };
  }

  const title = post.metaTitle || `${post.title} | وبلاگ ${SITE_NAME}`;
  const description =
    post.metaDesc || post.excerpt || post.title;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "fa_IR",
      publishedTime: post.publishedAt || undefined,
      authors: [post.author?.name].filter(Boolean),
      images: post.featuredImage
        ? [`${SITE_URL}${post.featuredImage}`]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage
        ? [`${SITE_URL}${post.featuredImage}`]
        : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  const jsonLdArticle = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt || post.metaDesc || "",
        image: post.featuredImage
          ? `${SITE_URL}${post.featuredImage}`
          : undefined,
        datePublished: post.publishedAt || undefined,
        dateModified: post.updatedAt || post.publishedAt || undefined,
        author: {
          "@type": "Person",
          name: post.author?.name || "نویسنده",
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/pwa-icons/icon-512.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}/blog/${post.slug}`,
        },
      }
    : null;

  const jsonLdBreadcrumb = post
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "خانه", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "وبلاگ",
            item: `${SITE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `${SITE_URL}/blog/${post.slug}`,
          },
        ],
      }
    : null;

  return (
    <>
      {jsonLdArticle && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
        />
      )}
      {jsonLdBreadcrumb && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
      )}
      <BlogPostClient slug={slug} />
    </>
  );
}
