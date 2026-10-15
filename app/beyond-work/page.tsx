"use client";

import { projects } from "../data/portfolio";
import SiteNav from "../site-nav";

const visibleProjects = projects.filter((project) => !project.hidden);

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function BeyondWorkPage() {
  return (
    <main>
      <SiteNav current="beyond-work" />
      <section className="work shell beyond-work-page">
        <div className="section-heading">
          <p className="eyebrow">Personal projects · After hours</p>
          <h1>Beyond Work.</h1>
          <p className="section-note">
            Some of my ideas, deployed. Built from curiosity and shaped into
            something real.
          </p>
        </div>

        {visibleProjects.length > 0 ? (
          <div className="project-list">
            {visibleProjects.map((project) => (
              <a
                className={`project ${project.accent} ${!project.href ? "project-template" : ""}`}
                href={project.href || undefined}
                target={project.href ? "_blank" : undefined}
                rel={project.href ? "noreferrer" : undefined}
                aria-disabled={!project.href}
                key={project.title}
              >
                <div className="project-top">
                  <span>{project.number}</span>
                  <span>{project.type}</span>
                  <Arrow />
                </div>
                <div className="project-visual" aria-hidden="true">
                  <div className="window-bar"><i /><i /><i /></div>
                  <strong>{project.title.split(" ")[0]}</strong>
                  <span className="visual-orbit" />
                </div>
                <div className="project-copy">
                  <h2>{project.title}</h2>
                  <p>{project.summary}</p>
                  <ul aria-label="Technologies used">
                    {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                  <span className="project-cta">{project.label} <Arrow /></span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="beyond-empty">Personal projects will land here as they ship.</p>
        )}
      </section>
    </main>
  );
}
