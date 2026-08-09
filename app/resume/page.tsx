"use client";

const roles = [
  {
    company: "GenXys Health Care Systems",
    role: "Product Engineering",
    period: "Current",
    summary: "Building reliable clinical software that helps turn complex pharmacogenomic data into useful decisions for healthcare teams.",
    projects: [
      ["Clinical software platform", "Decision-focused product experiences for clinical teams."],
      ["Shared product systems", "Reusable interface patterns and resilient services supporting the wider product."],
    ],
    stack: ["React", "TypeScript", ".NET", "Azure"],
  },
  {
    company: "Centra Windows",
    role: "Digital Platform",
    period: "Previous",
    summary: "Contributing to customer-facing experiences and internal tools for one of Western Canada’s leading window manufacturers.",
    projects: [
      ["Customer experience", "Digital touchpoints designed to make a complex buying journey easier to navigate."],
      ["Internal operations tools", "Practical software connecting internal workflows, teams, and company data."],
    ],
    stack: ["C#", "SQL", "React", "Cloud"],
  },
  {
    company: "AI Jabber",
    role: "Founder Project",
    period: "Independent",
    summary: "A focused, approachable place to think, ask, and create with modern language models.",
    projects: [["AI Jabber", "An end-to-end product spanning interface, model integration, data, and deployment."]],
    stack: ["Next.js", "OpenAI", "Supabase", "Vercel"],
  },
];

const skills = [
  ["Interface", "React, Next.js, TypeScript, UI systems, accessibility"],
  ["Backend", "C# / .NET, Node.js, PostgreSQL, SQL, API design"],
  ["Platform", "Azure, AWS, Vercel, Supabase, cloud architecture"],
  ["Practice", "Product thinking, AI tools, testing, automation, prototyping"],
];

export default function ResumePage() {
  return (
    <main className="resume-page">
      <header className="resume-toolbar">
        <a href="/" className="resume-back">← Portfolio</a>
        <span>AJ / Career document</span>
        <button type="button" onClick={() => window.print()}>Export PDF ↗</button>
      </header>

      <div className="resume-stage">
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
              <p>Product-minded developer turning complex systems into simple, useful experiences.</p>
              <a href="https://www.linkedin.com/in/ajadversalo">LinkedIn ↗</a>
              <a href="https://github.com/ajadversalo">GitHub ↗</a>
              <a href="https://aijabber.ca">AI Jabber ↗</a>
            </div>
          </header>

          <section className="resume-block resume-profile">
            <span className="resume-label">Profile / 01</span>
            <p>I build thoughtful interfaces and resilient systems, with a focus on making complicated products feel clear, trustworthy, and effortless to use.</p>
          </section>

          <section className="resume-block">
            <span className="resume-label">Experience / 02</span>
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
            <span className="resume-label">Capabilities / 03</span>
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
