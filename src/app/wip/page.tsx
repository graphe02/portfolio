import type { Metadata } from "next";
import { wipItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "WIP",
};

export default function WipPage() {
  return (
    <main className="page page-wide">
      <h1>WIP</h1>
      <p className="muted">In no particular order.</p>

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
