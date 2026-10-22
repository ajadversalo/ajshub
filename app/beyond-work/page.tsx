"use client";

import SiteNav from "../components/site-nav";
import TechChips from "../components/tech-chips";
import { COPY } from "../constants";
import { beyondProjects } from "../data/portfolio";

export default function BeyondWorkPage() {
  return (
    <main>
      <SiteNav current="beyond-work" />
      <section className="beyond shell">
        <header className="beyond-intro">
          <h1>{COPY.beyondHeading}</h1>
          <p>{COPY.beyondIntro}</p>
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
              <h2>
                {project.logo ? <img src={project.logo} alt="" width={36} height={36} /> : null}
                {project.title}
              </h2>
              <p>{project.summary}</p>
              <dl className="beyond-facts">
                <div>
                  <dt>Stack</dt>
                  <dd>
                    <TechChips tools={project.stack} size={13} />
                  </dd>
                </div>
                <div>
                  <dt>Hosted</dt>
                  <dd>
                    <TechChips tools={[project.hosted]} size={13} />
                  </dd>
                </div>
                {project.database ? (
                  <div>
                    <dt>Database</dt>
                    <dd>
                      <TechChips tools={[project.database]} size={13} />
                    </dd>
                  </div>
                ) : null}
              </dl>
              <span className="beyond-card-link">{project.host} ↗</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
