import { experience, techIcons } from "./data/experience";
import { projects } from "./data/portfolio";
import ThemeToggle from "./theme-toggle";
import ToolboxSection from "./toolbox-section";
import HeroSpotlight from "./hero-spotlight";

const visibleProjects = projects.filter((project) => !project.hidden);
const hasPublishedProjects = visibleProjects.some((project) => Boolean(project.href));

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function FitTitle({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      el.style.fontSize = "";
      const width = el.clientWidth;
      if (!width) return;
      if (el.scrollWidth > width + 1) {
        const size = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = `${Math.max(12, size * (width / el.scrollWidth))}px`;
      }
    };

    const observer = new ResizeObserver(fit);
    observer.observe(el);
    void document.fonts?.ready?.then(fit);
    return () => observer.disconnect();
  }, [children]);

  return (
    <h4 ref={ref} style={{ "--title-chars": children.length } as CSSProperties}>
      {children}
    </h4>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("href")?.replace("#", "");
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    setActiveSection(targetId);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${targetId}`);
  };

  return (
    <main>
      <header className="nav shell">
        <div className="brand-actions">
          <a className="monogram" href="#top" onClick={scrollToSection} aria-label="AJ Adversalo, home">
            AJ<span>®</span>
          </a>
          <ThemeToggle />
        </div>
        <nav aria-label="Primary navigation">
          {hasPublishedProjects && <a href="#work" onClick={scrollToSection} aria-current={activeSection === "work" ? "page" : undefined}>Work</a>}
          <a href="#toolbox" onClick={scrollToSection} aria-current={activeSection === "toolbox" ? "page" : undefined}>Tools</a>
          <a href="#experience-archive" onClick={scrollToSection} aria-current={activeSection === "experience-archive" ? "page" : undefined}>Experience</a>
          <a href="#about" onClick={scrollToSection} aria-current={activeSection === "about" ? "page" : undefined}>About</a>
          <a href="#contact" onClick={scrollToSection} aria-current={activeSection === "contact" ? "page" : undefined}>Contact</a>
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

      <section className="hero shell" id="top">
        <HeroSpotlight />
        <Image
          className="hero-skyline"
          src="/vancouver-skyline.svg"
          alt=""
          width={1600}
          height={360}
          priority
        />
        <div className="rain" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </div>
        <p className="eyebrow">Full-stack developer · Vancouver, BC</p>
        <h1>
          Full-stack developer.
          <br />
          <em className="speed-word" data-text="Plan-first, AI-assisted, production-ready.">Plan-first, AI-assisted, production-ready.</em>
        </h1>
        <div className="hero-bottom">
          <p>
            Hey, I'm AJ—a product-minded full-stack developer bringing useful products from idea to production, with <strong>AI woven into how I rapidly iterate, build, and ship</strong>.
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

      <ToolboxSection />

      <section className="experience shell" id="experience-archive">
        <div className="experience-heading">
          <h2>What I helped bring to life</h2>
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
                {chapter.logo && chapter.website && (
                  <a
                    className="company-logo-link"
                    href={chapter.website}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit ${chapter.company} website`}
                  >
                    <Image
                      className="company-logo"
                      src={chapter.logo}
                      alt={`${chapter.company} logo`}
                      width={96}
                      height={96}
                      unoptimized
                    />
                    <span className="company-logo-label" aria-hidden="true">Visit site ↗</span>
                  </a>
                )}
                <p className="eyebrow">{chapter.marker}</p>
                <h3>{chapter.company}</h3>
                <strong>{chapter.discipline}</strong>
                <p className="company-intro">{chapter.intro}</p>
                <div className="company-stack">
                  <span>Tech stack</span>
                  <ul aria-label={`${chapter.company} tech stack`}>
                    {chapter.stack.map((tool) => (
                      <li key={tool}>
                        {techIcons[tool] && (
                          <img
                            src={`https://cdn.simpleicons.org/${techIcons[tool]}`}
                            className={tool === "Next.js" || tool === "OpenAI API" ? "tech-icon-light" : undefined}
                            alt=""
                            width="13"
                            height="13"
                            loading="lazy"
                          />
                        )}
                        {tool}
                      </li>
                    ))}
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
                    {chapter.logo && (
                      <Image
                        className="product-record-watermark"
                        src={chapter.logo}
                        alt=""
                        width={180}
                        height={180}
                        unoptimized
                      />
                    )}
                    <div className="record-meta">
                      <span>0{productIndex + 1}</span>
                      <span>{product.type}</span>
                    </div>
                    <FitTitle>{product.name}</FitTitle>
                    <p>{product.note}</p>
                    <ul aria-label="Areas and technologies">
                      {product.tags.map((tag) => <li key={tag}>{tag}</li>)}
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
            I build best when <span>technical challenges</span>, product decisions,
            and real human needs overlap.
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
            <div><span>01</span><strong>Solve the right problem.</strong></div>
            <div><span>02</span><strong>Make complexity feel simple.</strong></div>
            <div><span>03</span><strong>Build with care.</strong></div>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="shell contact-inner">
          <p className="eyebrow">Open to the right opportunity.</p>
          <h2>Let’s make<br /><em>something good.</em></h2>
          <div className="contact-links">
            <a href="https://www.linkedin.com/in/ajadversalo" target="_blank" rel="noreferrer">
              Start a conversation <Arrow />
            </a>
            <div>
              <a href="https://github.com/ajadversalo" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
              <a href="https://www.linkedin.com/in/ajadversalo" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
              <a href="/resume">Résumé <Arrow /></a>
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

import { useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Image from "next/image";
