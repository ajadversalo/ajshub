"use client";

import SiteNav from "../components/site-nav";
import {
  AI_JABBER_URL,
  COPY,
  GITHUB_URL,
  LINKEDIN_URL,
  PERSON_NAME,
  ROLE_LINE,
} from "../constants";
import { roles, skillGroups } from "../data/resume";

export default function ResumePage() {
  const [firstName, lastName] = PERSON_NAME.split(" ");

  return (
    <main className="resume-page">
      <SiteNav current="resume" />

      <div className="resume-stage">
        <button className="resume-export" type="button" onClick={() => window.print()}>
          {COPY.resumeExport}
        </button>
        <aside className="resume-rail" aria-hidden="true">
          <span>01</span><i /><span>Résumé</span>
        </aside>

        <article className="resume-sheet">
          <header className="resume-hero">
            <div className="resume-name">
              <p>{ROLE_LINE}</p>
              <h1>{firstName}<br />{lastName}<span>.</span></h1>
            </div>
            <div className="resume-contact">
              <p>{COPY.resumeSummary}</p>
              <a href={LINKEDIN_URL}>LinkedIn ↗</a>
              <a href={GITHUB_URL}>GitHub ↗</a>
              <a href={AI_JABBER_URL}>AI Jabber ↗</a>
            </div>
          </header>

          <section className="resume-block">
            <span className="resume-label">{COPY.resumeExperienceLabel}</span>
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
            <span className="resume-label">{COPY.resumeCapabilitiesLabel}</span>
            <div className="resume-skills">
              {skillGroups().map(([category, items]) => <div key={category}><strong>{category}</strong><p>{items}</p></div>)}
            </div>
          </section>

          <footer className="resume-footer">
            <span>{PERSON_NAME}</span>
            <span>{COPY.resumeFooterNote}</span>
            <span>{new Date().getFullYear()}</span>
          </footer>
        </article>
      </div>
    </main>
  );
}
