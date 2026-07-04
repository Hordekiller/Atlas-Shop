import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "قوانین و مقررات",
  description: "قوانین و مقررات فروشگاه",
  alternates: { canonical: `${SITE_URL}/rules` },
  openGraph: {
    title: `قوانین و مقررات | ${SITE_NAME}`,
    description: "قوانین و مقررات فروشگاه",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
