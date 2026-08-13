import type { Metadata } from "next";
import { SiteShell } from "../../components/SiteShell";
import { routeMeta } from "../../data/site";

export function generateStaticParams() { return Object.keys(routeMeta).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = routeMeta[slug];
  return meta ? { title: meta.title, description: meta.description } : { title: "Page not found", robots: { index: false } };
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SiteShell path={`/${slug}`} />;
}
