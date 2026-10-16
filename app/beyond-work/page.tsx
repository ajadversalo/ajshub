"use client";

import { beyondProjects } from "../data/portfolio";
import SiteNav from "../site-nav";
import TechIcon from "../tech-icon";

function FactChips({ tools }: { tools: string[] }) {
  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool}>
          <TechIcon tool={tool} size={13} />
          {tool}
        </li>
      ))}
    </ul>
  );
}

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
              <h2>
                {project.logo ? <img src={project.logo} alt="" width={36} height={36} /> : null}
                {project.title}
              </h2>
              <p>{project.summary}</p>
              <dl className="beyond-facts">
                <div>
                  <dt>Stack</dt>
                  <dd>
                    <FactChips tools={project.stack} />
                  </dd>
                </div>
                <div>
                  <dt>Hosted</dt>
                  <dd>
                    <FactChips tools={[project.hosted]} />
                  </dd>
                </div>
                {project.database ? (
                  <div>
                    <dt>Database</dt>
                    <dd>
                      <FactChips tools={[project.database]} />
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
