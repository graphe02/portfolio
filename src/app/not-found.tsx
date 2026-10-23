import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <main className="page">
      <PageHeader title="Not found" lead="That page doesn't exist." />
      <p>
        <Link href="/">← Back home</Link>
      </p>
    </main>
  );
}
