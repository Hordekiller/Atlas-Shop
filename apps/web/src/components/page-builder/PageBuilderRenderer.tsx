"use client";

import { useEffect, useState } from "react";

import {
  HeadingWidget,
  TextWidget,
  ImageWidget,
  ButtonWidget,
  IconBoxWidget,
  VideoWidget,
  AccordionWidget,
  TabsWidget,
  GalleryWidget,
  BannerSliderWidget,
  ProductCarouselWidget,
  ProductGridWidget,
  CategoryNavWidget,
  BrandSliderWidget,
  CountdownWidget,
  BlogPostsWidget,
} from "./widgets";

interface Section {
  id: string;
  settings: any;
  columns: Column[];
}
interface Column {
  id: string;
  settings: any;
  widgets: Widget[];
}
interface Widget {
  id: string;
  type: string;
  variant: number;
  settings: any;
  style: any;
  responsive: any;
  seo?: any;
}

interface PageContent {
  schema_version: number;
  sections: Section[];
}

export default function PageBuilderRenderer({
  contentJson,
  globalColors: gc,
  customCss,
}: {
  contentJson: string | PageContent;
  globalColors?: any;
  customCss?: string | null;
}) {
  const [content, setContent] = useState<PageContent | null>(null);

  useEffect(() => {
    try {
      setContent(
        typeof contentJson === "string" ? JSON.parse(contentJson) : contentJson,
      );
    } catch {
      setContent(null);
    }
  }, [contentJson]);

  if (!content) return null;

  const colors = gc || {};
  const cssVars = {
    "--pb-primary": colors.primary || "#ef4056",
    "--pb-secondary": colors.secondary || "#19bfd3",
    "--pb-text": colors.text || "#3f3f3f",
    "--pb-bg": colors.bg || "#f5f5f5",
    "--pb-muted": colors.muted || "#81858b",
    "--pb-success": colors.success || "#28C76F",
    "--pb-error": colors.error || "#FF4C51",
    "--pb-warning": colors.warning || "#FF9F43",
  } as React.CSSProperties;

  return (
    <div style={cssVars}>
      {customCss ? <style dangerouslySetInnerHTML={{ __html: customCss }} /> : null}
      {content.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}

function SectionRenderer({ section }: { section: Section }) {
  const { settings } = section;
  const style: React.CSSProperties = {};
  if (settings.background?.mode === "custom")
    style.background = settings.background.value;
  if (settings.background?.mode === "gradient")
    style.background = `linear-gradient(${settings.background.angle}deg, ${settings.background.from}, ${settings.background.to})`;
  if (settings.padding)
    style.padding = `${settings.padding.top}px ${settings.padding.right}px ${settings.padding.bottom}px ${settings.padding.left}px`;
  if (settings.margin)
    style.margin = `${settings.margin.top}px ${settings.margin.right}px ${settings.margin.bottom}px ${settings.margin.left}px`;
  if (settings.full_width) style.width = "100%";

  const innerStyle: React.CSSProperties = {};
  if (!settings.full_width && settings.max_width) {
    innerStyle.maxWidth = settings.max_width;
    innerStyle.marginLeft = "auto";
    innerStyle.marginRight = "auto";
  }

  const Wrapper = settings.full_width ? "div" : "div";

  return (
    <Wrapper style={style}>
      <div
        style={innerStyle}
        className={!settings.full_width ? "dk-container" : ""}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: section.columns?.[0]?.settings?.vertical_align || "top",
          }}
        >
          {(section.columns || []).map((col) => (
            <ColumnRenderer key={col.id} column={col} />
          ))}
        </div>
      </div>
    </Wrapper>
  );
}

function ColumnRenderer({ column }: { column: Column }) {
  const ratio = column.settings.width_ratio || 1;
  const flex = `${ratio} 1 0`;
  return (
    <div style={{ flex, minWidth: 0 }}>
      {(column.widgets || []).map((widget) => (
        <WidgetRenderer key={widget.id} widget={widget} />
      ))}
    </div>
  );
}

function WidgetRenderer({ widget }: { widget: Widget }) {
  const responsive = widget.responsive;
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1024;
      const bp = w >= 1024 ? "desktop" : w >= 768 ? "tablet" : "mobile";
      const layer = responsive?.[bp];
      setHidden(layer?.visible === false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [responsive]);

  if (hidden) return null;

  const style: React.CSSProperties = {};
  if (widget.style?.padding)
    style.padding = `${widget.style.padding.top}px ${widget.style.padding.right}px ${widget.style.padding.bottom}px ${widget.style.padding.left}px`;
  if (widget.style?.margin)
    style.margin = `${widget.style.margin.top}px ${widget.style.margin.right}px ${widget.style.margin.bottom}px ${widget.style.margin.left}px`;
  if (widget.style?.border_radius)
    style.borderRadius = widget.style.border_radius;
  if (widget.type === "spacer")
    return <div style={{ height: widget.settings.height || 32 }} />;

  const content = renderWidgetByType(widget);

  return <div style={style}>{content}</div>;
}

function renderWidgetByType(widget: Widget): React.ReactNode {
  const s = widget.settings || {};
  const v = widget.variant || 1;

  switch (widget.type) {
    case "heading":
      return <HeadingWidget s={s} v={v} />;
    case "text":
      return <TextWidget s={s} v={v} />;
    case "image":
      return <ImageWidget s={s} v={v} />;
    case "button":
      return <ButtonWidget s={s} v={v} />;
    case "icon_box":
      return <IconBoxWidget s={s} v={v} />;
    case "video":
      return <VideoWidget s={s} v={v} />;
    case "accordion":
      return <AccordionWidget s={s} v={v} />;
    case "tabs":
      return <TabsWidget s={s} v={v} />;
    case "gallery":
      return <GalleryWidget s={s} v={v} />;
    case "banner_slider":
      return <BannerSliderWidget s={s} v={v} />;
    case "product_carousel":
      return <ProductCarouselWidget s={s} v={v} />;
    case "product_grid":
      return <ProductGridWidget s={s} v={v} />;
    case "category_nav":
      return <CategoryNavWidget s={s} v={v} />;
    case "brand_slider":
      return <BrandSliderWidget s={s} v={v} />;
    case "countdown":
      return <CountdownWidget s={s} v={v} />;
    case "blog_posts":
      return <BlogPostsWidget s={s} v={v} />;
    default:
      return (
        <div className="text-sm text-gray-400 p-4">
          ویجت ناشناخته: {widget.type}
        </div>
      );
  }
}
