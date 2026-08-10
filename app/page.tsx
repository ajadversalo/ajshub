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

const hasPublishedProjects = projects.some((project) => Boolean(project.href));

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
    logo: "/centra-logo.png",
    discipline: "Senior Software Developer · Langley, BC",
    marker: "June 2023 – Present",
    intro: "Modernizing enterprise applications, digitizing shop-floor workflows, and exploring AI-driven planning across five Western Canadian branches.",
    stack: ["Next.js", "TypeScript", "C#", ".NET", "Redux", "Ant Design", "Playwright", "OpenAI API"],
    products: [
      { name: "CentraCalendar", type: "Scheduling platform", note: "A calendar-based system that coordinates manufacturing, installation, and shipping with real-time tracking and shared workflow visibility across departments.", tools: ["Scheduling", "Operations", "Real-time tracking"] },
      { name: "CentraManufacture", type: "Manufacturing platform", note: "A production application that surfaces live manufacturing insights, supports workflow optimization, and helps teams identify bottlenecks while maintaining quality control.", tools: ["Manufacturing", "Live insights", "Workflow optimization"] },
      { name: "CentraMetrics", type: "Performance dashboard", note: "A centralized dashboard for operational metrics across production, scheduling, and service, giving teams clearer data for day-to-day decisions.", tools: ["Analytics", "Dashboards", "Operational metrics"] },
      { name: "CentraService", type: "Service management", note: "A post-installation workflow system for logging, scheduling, and resolving repairs, warranty claims, and ongoing maintenance requests.", tools: ["Service workflows", "Warranty claims", "Scheduling"] },
      { name: "CentraRequest", type: "Internal operations", note: "A centralized platform for internal requests including share purchases, vacation forms, employee onboarding, and terminations.", tools: ["Request management", "Administration", "Workflow automation"] },
      { name: "CentraCustomers", type: "Customer management", note: "A CRM system that maintains client records and interactions, providing teams across branches with a unified view of customer data.", tools: ["CRM", "Customer data", "Multi-branch"] },
      { name: "CentraAccess", type: "Access management", note: "An internal permissions tool that manages user roles and security levels across Centra applications to support consistent authorization and data protection.", tools: ["Authorization", "User roles", "Security"] },
      { name: "CentraWindows.com", type: "Company website", note: "Centra’s primary marketing and customer engagement website, combining product information and lead generation with backend quoting and service-request integrations.", tools: ["Marketing", "Lead generation", "Systems integration"] },
    ],
  },
  {
    company: "GenXys Healthcare Systems",
    logo: "/genxys-logo-square.png",
    discipline: "Full-Stack Developer · Vancouver, BC",
    marker: "July 2019 – June 2023",
    intro: "Modernized clinical SaaS products, built reusable UI foundations, and automated operational workflows across the GenXys product suite.",
    stack: ["React", "Redux", "C#", ".NET", "Azure DevOps", "Material UI", "SendGrid", "Selenium"],
    products: [
      { name: "GenXys Portal", type: "Provider portal", note: "The Canadian and United States portal where healthcare providers purchase licenses and manage their accounts and preferences.", tools: ["Healthcare SaaS", "Licensing", "Account management"] },
      { name: "TreatGx", type: "Precision prescribing", note: "A clinical decision-support product that combines a patient’s genetics, current clinical evidence, and entered health information to generate safer, more effective medication options.", tools: ["Pharmacogenetics", "Clinical evidence", "Decision support"] },
      { name: "ReviewGx", type: "Medication review", note: "A medication therapy management tool that brings together evidence-based pharmacogenomics, deprescribing insights, and clinical laboratory data for comprehensive reviews.", tools: ["Medication therapy", "Pharmacogenomics", "Clinical data"] },
      { name: "Alogogen", type: "Algorithm authoring", note: "An internal application used by algorithm developers to create and maintain complex pharmacogenetic algorithms.", tools: ["Internal tools", "Algorithms", "Pharmacogenetics"] },
      { name: "TrackGx", type: "Patient tracking", note: "A mobile-first application that helps patients monitor and report the efficacy of their prescriptions over time.", tools: ["Mobile-first", "Patient experience", "Medication tracking"] },
      { name: "LabGx", type: "Laboratory platform", note: "A laboratory application that supports uploading and processing genetic data from lab results.", tools: ["Laboratory workflows", "Genetic data", "Data upload"] },
      { name: "Patient Dashboard", type: "Patient portal", note: "A patient-facing portal for securely viewing laboratory reports and medication reviews in one place.", tools: ["Patient portal", "Lab reports", "Medication reviews"] },
    ],
  },
  {
    company: "Earlier Technical Career",
    discipline: "Application & Systems Administration",
    marker: "2010 — 2017",
    intro: "A foundation spanning systems, networks, application support, internal development, automation, and multi-site environments.",
    stack: ["HTML", "CSS", "JavaScript", "Systems", "Networks", "Automation"],
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
          {hasPublishedProjects && <a href="#work" onClick={scrollToSection}>Work</a>}
          <a href="#experience-archive" onClick={scrollToSection}>Experience</a>
          <a className="nav-mobile-resume" href="/resume">Résumé</a>
          <a href="#about" onClick={scrollToSection}>About</a>
          <a href="#contact" onClick={scrollToSection}>Contact</a>
        </nav>
        <div className="nav-actions">
          <a className="nav-resume" href="/resume">Résumé ↗</a>
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

      <section className="hero shell" id="top">
        <div className="rain" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </div>
        <p className="eyebrow">Full-stack developer · Vancouver, BC</p>
        <h1>
          Useful by design.
          <br />
          <em>Reliable by default.</em>
        </h1>
        <div className="hero-bottom">
          <p>
            Hey, I’m AJ—a product-minded full-stack developer bringing useful
            products from idea to production, with AI woven into how I explore,
            build, and ship.
          </p>
          <a
            className="round-link"
            href={hasPublishedProjects ? "#work" : "#experience-archive"}
            onClick={scrollToSection}
            aria-label={hasPublishedProjects ? "Explore selected work" : "Explore experience"}
          >
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

      {hasPublishedProjects && <section className="work shell" id="work">
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
      </section>}

      <section className="experience shell" id="experience-archive">
        <div className="experience-heading">
          <p className="eyebrow">Experience archive · Selected chapters</p>
          <h2>What I helped<br /><em>bring to life.</em></h2>
          <p>
            Some project details are intentionally kept high-level to respect
            the confidential nature of the work.
          </p>
        </div>

        <div className="experience-list">
          {experience.map((chapter, chapterIndex) => (
            <article
              className={`experience-chapter company-${chapterIndex + 1}`}
              key={chapter.company}
            >
              <div className="company-context">
                <span className="company-index">0{chapterIndex + 1}</span>
                {chapter.logo && (
                  <Image
                    className="company-logo"
                    src={chapter.logo}
                    alt={`${chapter.company} logo`}
                    width={96}
                    height={96}
                    unoptimized
                  />
                )}
                <p className="eyebrow">{chapter.marker}</p>
                <h3>{chapter.company}</h3>
                <strong>{chapter.discipline}</strong>
                <p className="company-intro">{chapter.intro}</p>
                <div className="company-stack">
                  <span>Tech stack</span>
                  <ul aria-label={`${chapter.company} tech stack`}>
                    {chapter.stack.map((tool) => <li key={tool}>{tool}</li>)}
                  </ul>
                </div>
              </div>
              <div className="product-records">
                {chapter.products.map((product, productIndex) => (
                  <div
                    className="product-record"
                    data-index={String(productIndex + 1).padStart(2, "0")}
                    key={product.name}
                  >
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
import Image from "next/image";
