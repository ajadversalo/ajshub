const projects = [
  {
    number: "01",
    type: "Personal project template",
    title: "Project name",
    summary:
      "A concise explanation of what the project does, why it exists, and the problem or curiosity that inspired it.",
    tags: ["Status", "Your role", "Core stack"],
    href: "",
    label: "Project link coming soon",
    accent: "lime",
  },
];

const stack = [
  "TypeScript",
  "React",
  "Next.js",
  "C# / .NET",
  "Node.js",
  "PostgreSQL",
  "Azure",
  "AWS",
  "OpenAI",
  "Playwright",
];

const concepts = [
  "UI Systems",
  "AI Tools",
  "Product Thinking",
  "API Design",
  "Accessibility",
  "Cloud Architecture",
  "Performance",
  "Automation",
  "Developer Experience",
  "Prototyping",
];

const experience = [
  {
    company: "Centra Construction Group",
    discipline: "Senior Software Developer · Langley, BC",
    marker: "June 2023 — Present",
    intro: "Modernizing enterprise applications, digitizing shop-floor workflows, and exploring AI-driven planning across five Western Canadian branches.",
    products: [
      { name: "CentraCalendar", type: "Scheduling platform", note: "Rebuilt a monolithic system as a modular Next.js client-server application, improving load performance by 50% and supporting scalable deployment across five branches.", tools: ["Next.js", "TypeScript", "C#", ".NET"] },
      { name: "CentraManufacture", type: "Operations tracker", note: "Developed a mobile-first shop-floor application that digitized workflows and reduced manual logging time by 40% across Langley and Calgary facilities.", tools: ["Mobile-first UI", "Redux", "Node.js", "Playwright"] },
      { name: "AI planning prototypes", type: "Applied AI", note: "Integrated OpenAI API prototypes for predictive scheduling and automated planning, alongside a unified Ant Design interface used as the baseline for later internal apps.", tools: ["OpenAI API", "Ant Design", "Flowfinity", "IIS"] },
    ],
  },
  {
    company: "GenXys Healthcare Systems",
    discipline: "Full-Stack Developer · Vancouver, BC",
    marker: "July 2019 — June 2023",
    intro: "Modernized clinical SaaS products, built reusable UI foundations, and automated operational workflows across the GenXys product suite.",
    products: [
      { name: "TreatGx", type: "SaaS prescribing platform", note: "Helped modernize the flagship product and transition subsequent applications from a monolithic codebase into modular, maintainable React experiences.", tools: ["React", "Redux", "C#", ".NET"] },
      { name: "GenXys product suite", type: "Shared SaaS systems", note: "Developed reusable component libraries plus user management, dynamic reporting, and automated email modules used across multiple web applications.", tools: ["Material UI", "SendGrid", "i18next", "Azure DevOps"] },
      { name: "Test-kit fulfillment", type: "Workflow automation", note: "Integrated the Canada Post API to automate shipping workflows, cutting manual data entry by 80% and improving turnaround efficiency.", tools: ["Canada Post API", "Entity Framework", "Selenium", "C#"] },
    ],
  },
  {
    company: "Earlier Technical Career",
    discipline: "Application & Systems Administration",
    marker: "2010 — 2017",
    intro: "A foundation spanning systems, networks, application support, internal development, automation, and multi-site environments.",
    products: [
      { name: "Internal tools & automation", type: "Technical operations", note: "Developed internal utilities and automation scripts while maintaining front-end components and supporting multi-site infrastructure.", tools: ["HTML", "CSS", "JavaScript", "Systems"] },
    ],
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("href")?.replace("#", "");
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${targetId}`);
  };

  return (
    <main>
      <header className="nav shell">
        <a className="monogram" href="#top" onClick={scrollToSection} aria-label="AJ Adversalo, home">
          AJ<span>®</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work" onClick={scrollToSection}>Work</a>
          <a href="#experience-archive" onClick={scrollToSection}>Experience</a>
          <a href="/resume">Résumé</a>
          <a href="#about" onClick={scrollToSection}>About</a>
          <a href="#contact" onClick={scrollToSection}>Contact</a>
        </nav>
        <a
          className="availability"
          href="https://www.linkedin.com/in/ajadversalo"
          target="_blank"
          rel="noreferrer"
        >
          <span /> Let’s connect
        </a>
      </header>

      <section className="hero shell" id="top">
        <div className="rain" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </div>
        <p className="eyebrow">Full-stack developer · Vancouver, BC</p>
        <h1>
          I build digital
          <br />
          things that <em>work.</em>
        </h1>
        <div className="hero-bottom">
          <p>
            Hey, I’m AJ—a product-minded full-stack developer bringing useful
            products from idea to production, with AI woven into how I explore,
            build, and ship.
          </p>
          <a className="round-link" href="#work" onClick={scrollToSection} aria-label="Explore selected work">
            <span>Explore</span>
            <b aria-hidden="true">↓</b>
          </a>
        </div>
      </section>

      <section className="ticker" aria-label="Core technologies">
        <div className="ticker-label">
          <span>Toolbox</span>
          <i>Always learning</i>
        </div>
        <div className="ticker-window">
          <div className="ticker-track">
            {[...stack, ...stack].map((item, index) => (
              <span key={`${item}-${index}`}>
                <b>{String((index % stack.length) + 1).padStart(2, "0")}</b>
                {item}
              </span>
            ))}
          </div>
          <div className="ticker-track ticker-track-reverse" aria-hidden="true">
            {[...concepts, ...concepts].map((item, index) => (
              <span key={`reverse-${item}-${index}`}>{item}<i>↗</i></span>
            ))}
          </div>
        </div>
      </section>

      <section className="work shell" id="work">
        <div className="section-heading">
          <p className="eyebrow">Independent work · Ideas in motion</p>
          <h2>After hours.</h2>
          <p className="section-note">
            Some of my ideas, deployed. Built from curiosity and shaped into
            something real.
          </p>
        </div>

        <div className="project-list">
          {projects.map((project) => (
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
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <ul aria-label="Technologies used">
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <span className="project-cta">{project.label} <Arrow /></span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="experience shell" id="experience-archive">
        <div className="experience-heading">
          <p className="eyebrow">Experience archive · Selected chapters</p>
          <h2>Where the work<br /><em>lived.</em></h2>
          <p>Companies provide the context. The products show the contribution.</p>
        </div>

        <div className="experience-list">
          {experience.map((chapter, chapterIndex) => (
            <article className="experience-chapter" key={chapter.company}>
              <div className="company-context">
                <span className="company-index">0{chapterIndex + 1}</span>
                <p className="eyebrow">{chapter.marker}</p>
                <h3>{chapter.company}</h3>
                <strong>{chapter.discipline}</strong>
                <p>{chapter.intro}</p>
              </div>
              <div className="product-records">
                {chapter.products.map((product, productIndex) => (
                  <div className="product-record" key={product.name}>
                    <div className="record-meta">
                      <span>0{productIndex + 1}</span>
                      <span>{product.type}</span>
                      <Arrow />
                    </div>
                    <h4>{product.name}</h4>
                    <p>{product.note}</p>
                    <ul aria-label="Areas and technologies">
                      {product.tools.map((tool) => <li key={tool}>{tool}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about shell" id="about">
        <div>
          <p className="eyebrow">A little about me</p>
          <p className="about-lede">
            I’m at my best where <span>engineering</span>, product thinking,
            and human curiosity meet.
          </p>
        </div>
        <div className="about-copy">
          <p>
            I’m AJ Adversalo, a full-stack developer who enjoys making the hard
            stuff feel effortless. I care about thoughtful interfaces, resilient
            systems, and the small details that earn a user’s trust.
          </p>
          <p>
            Away from the editor, I’m usually exploring new AI tools, refining a
            side project, or looking for a better way to explain a complicated idea.
          </p>
          <div className="principles">
            <div><span>01</span><strong>Make it useful.</strong></div>
            <div><span>02</span><strong>Keep it clear.</strong></div>
            <div><span>03</span><strong>Sweat the details.</strong></div>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="shell contact-inner">
          <p className="eyebrow">Have a project in mind?</p>
          <h2>Let’s make<br /><em>something good.</em></h2>
          <div className="contact-links">
            <a href="https://www.linkedin.com/in/ajadversalo" target="_blank" rel="noreferrer">
              Start a conversation <Arrow />
            </a>
            <div>
              <a href="https://github.com/ajadversalo" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
              <a href="https://www.linkedin.com/in/ajadversalo" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
            </div>
          </div>
          <footer>
            <span>© {new Date().getFullYear()} AJ Adversalo</span>
            <a href="#top" onClick={scrollToSection}>Back to top ↑</a>
          </footer>
        </div>
      </section>
    </main>
  );
}
"use client";

import type { MouseEvent } from "react";
