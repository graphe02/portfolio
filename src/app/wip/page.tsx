import type { Metadata } from "next";
import { wipItems } from "@/lib/data";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "WIP",
};

export default function WipPage() {
  return (
    <main className="page">
      <PageHeader title="WIP" lead="In no particular order." />

      <section>
        {wipItems.map((item) => (
          <article key={item.id} className="wip-item">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <p className="meta">Status: {item.status}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
