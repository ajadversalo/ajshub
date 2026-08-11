"use client";

import { roles, skills } from "../data/resume";
import ThemeToggle from "../theme-toggle";

export default function ResumePage() {
  return (
    <main className="resume-page">
      <header className="nav shell resume-nav">
        <div className="brand-actions">
          <a className="monogram" href="/" aria-label="AJ Adversalo, home">
            AJ<span>®</span>
          </a>
          <ThemeToggle />
        </div>
        <nav aria-label="Primary navigation">
          <a href="/#toolbox">Tools</a>
          <a href="/#experience-archive">Experience</a>
          <a href="/#about">About</a>
          <a href="/#contact">Contact</a>
        </nav>
        <div className="nav-actions">
          <a
            className="availability"
            href="https://www.linkedin.com/in/ajadversalo"
            target="_blank"
            rel="noreferrer"
          >
            <span /> Let’s connect
          </a>
        </div>
      </header>

      <div className="resume-stage">
        <button className="resume-export" type="button" onClick={() => window.print()}>
          Export PDF ↗
        </button>
        <aside className="resume-rail" aria-hidden="true">
          <span>01</span><i /><span>Résumé</span>
        </aside>

        <article className="resume-sheet">
          <header className="resume-hero">
            <div className="resume-name">
              <p>Full-stack developer · Vancouver, BC</p>
              <h1>AJ<br />Adversalo<span>.</span></h1>
            </div>
            <div className="resume-contact">
              <p>Full-stack developer bringing useful products from idea to production, using AI to accelerate how I explore, build, and ship.</p>
              <a href="https://www.linkedin.com/in/ajadversalo">LinkedIn ↗</a>
              <a href="https://github.com/ajadversalo">GitHub ↗</a>
              <a href="https://aijabber.ca">AI Jabber ↗</a>
            </div>
          </header>

          <section className="resume-block">
            <span className="resume-label">Experience / 01</span>
            <div className="resume-roles">
              {roles.map((item, index) => (
                <article className="resume-role" key={item.company}>
                  <div className="resume-role-head">
                    <span>0{index + 1}</span>
                    <div><h2>{item.company}</h2><p>{item.role}</p></div>
                    <strong>{item.period}</strong>
                  </div>
                  <p className="resume-summary">{item.summary}</p>
                  <div className="resume-projects">
                    {item.projects.map(([name, description]) => (
                      <div key={name}><h3>{name}</h3><p>{description}</p></div>
                    ))}
                  </div>
                  <ul>{item.stack.map((tool) => <li key={tool}>{tool}</li>)}</ul>
                </article>
              ))}
            </div>
          </section>

          <section className="resume-block">
            <span className="resume-label">Capabilities / 02</span>
            <div className="resume-skills">
              {skills.map(([category, items]) => <div key={category}><strong>{category}</strong><p>{items}</p></div>)}
            </div>
          </section>

          <footer className="resume-footer">
            <span>AJ Adversalo</span>
            <span>Built with intent.</span>
            <span>{new Date().getFullYear()}</span>
          </footer>
        </article>
      </div>
    </main>
  );
}
