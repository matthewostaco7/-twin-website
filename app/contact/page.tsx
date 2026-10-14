import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = { title: "Let\u2019s talk" };

export default function ContactPage() {
  return <InquiryForm />;
}
