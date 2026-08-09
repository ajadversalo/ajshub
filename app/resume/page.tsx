"use client";

const roles = [
  {
    company: "Centra Construction Group",
    role: "Senior Software Developer · Langley, BC",
    period: "Jun 2023 — Present",
    summary: "Modernizing enterprise applications, digitizing operational workflows, and prototyping AI-driven planning tools across five Western Canadian branches.",
    projects: [
      ["CentraCalendar", "Modular Next.js architecture that improved load performance by 50%."],
      ["CentraManufacture", "Mobile-first operations tracking that reduced manual logging by 40%."],
    ],
    stack: ["Next.js", "TypeScript", "C#", ".NET", "Redux", "Ant Design", "Playwright", "OpenAI API"],
  },
  {
    company: "GenXys Healthcare Systems",
    role: "Full-Stack Developer · Vancouver, BC",
    period: "Jul 2019 — Jun 2023",
    summary: "Modernized clinical SaaS products, created shared UI foundations, and automated fulfillment and communication workflows across the GenXys suite.",
    projects: [
      ["TreatGx", "Helped transition the flagship prescribing platform into modular React applications."],
      ["Product suite foundations", "Reusable components, user management, reporting, notifications, and shipping automation."],
    ],
    stack: ["React", "Redux", "C#", ".NET", "Azure DevOps", "Material UI", "SendGrid", "Selenium"],
  },
  {
    company: "Earlier Technical Career",
    role: "Application & Systems Administration",
    period: "2010 — 2017",
    summary: "Supported systems, networks, applications, and multi-site environments while developing internal tools, automation scripts, and front-end components.",
    projects: [["Internal tools & automation", "Technical operations combined with practical software development and application support."]],
    stack: ["HTML", "CSS", "JavaScript", "Systems", "Networks", "Automation"],
  },
];

const skills = [
  ["Interface", "HTML, CSS, JavaScript, TypeScript, React, Next.js, Redux, Material UI, Ant Design, Tailwind CSS"],
  ["Backend", "C# / .NET, Node.js, Python, Django, Entity Framework, Express, Dapper"],
  ["Platform", "SQL Server, PostgreSQL, Azure DevOps, AWS, IIS, Apache, Netlify"],
  ["Practice", "Selenium, Playwright, localization, SendGrid, Google Maps API, OpenAI API"],
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
