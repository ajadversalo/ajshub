"use client";

import { beyondProjects } from "../data/portfolio";
import SiteNav from "../site-nav";

export default function BeyondWorkPage() {
  return (
    <main>
      <SiteNav current="beyond-work" />
      <section className="beyond shell">
        <header className="beyond-intro">
          <h1>Beyond Work</h1>
          <p>Things I tinker with outside the day job.</p>
        </header>

        <div className="beyond-board">
          {beyondProjects.map((project) => (
            <a
              className="beyond-card"
              href={project.href}
              target="_blank"
              rel="noreferrer"
              key={project.title}
            >
              <span className="beyond-card-kind">{project.kind}</span>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
              <span className="beyond-card-link">{project.host} ↗</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
