import type { Metadata } from "next";
import WorkGallery from "@/components/WorkGallery";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return <WorkGallery />;
}
