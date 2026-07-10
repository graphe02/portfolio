import type { Metadata } from "next";
import { projects } from "@/lib/data";
import { asset } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <main className="page page-wide">
      <h1>Projects</h1>
      <p className="muted">Selected work across software, systems, and tools.</p>

      <section>
        {projects.map((project) => (
          <article key={project.id} className="project">
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            {project.imageUrl && (
              <img
                src={asset(project.imageUrl)}
                alt=""
                className="project-image"
              />
            )}
            {project.technologies.length > 0 && (
              <p className="meta">{project.technologies.join(" · ")}</p>
            )}
            <div className="actions">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live
                </a>
              )}
              {project.youtubeVideoId && (
                <a
                  href={`https://www.youtube.com/watch?v=${project.youtubeVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Video
                </a>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
