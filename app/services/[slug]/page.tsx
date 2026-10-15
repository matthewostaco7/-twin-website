import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceView from "@/components/ServiceView";
import { SERVICES, SERVICE_SLUGS } from "@/lib/services";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = SERVICES[(await params).slug];
  return s ? { title: `${s.name} services for founders and SMEs`, description: s.overview } : {};
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  if (!SERVICES[slug]) notFound();
  return <ServiceView key={slug} slug={slug} />;
}
