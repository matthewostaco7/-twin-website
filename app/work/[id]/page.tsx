import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectView from "@/components/ProjectView";
import { PROJECTS, getProject } from "@/lib/projects";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).id);
  return p ? { title: p.name, description: `${p.name} · ${p.type} by TWIN` } : {};
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  if (!getProject(id)) notFound();
  return <ProjectView key={id} id={id} />;
}
