"use client";

import { useLayoutEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import Image from "next/image";
import { experience } from "./data/experience";
import TechIcon from "./tech-icon";
import SiteNav from "./site-nav";
import ToolboxSection from "./toolbox-section";

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
      <SiteNav current="home" />

      <section className="hero shell" id="top">
        <p className="eyebrow">Full-stack developer · Vancouver, BC</p>
        <div className="hero-copy">
          <h1>
            Hey, I’m AJ, a product-minded full-stack developer in Vancouver, BC. I bring useful products from idea to production, with <strong>AI integrated into a careful process of iterating, building, and shipping</strong>.
          </h1>
          <p className="hero-bio-career">
            Starting my IT career in systems administration helped me develop a strong operational mindset around reliability, troubleshooting, and owning production systems. That foundation carried into software development, first at GenXys building pharmacogenetic decision support tools, and now at Centra, where I continue building useful, well-built products.
          </p>
          <p>
            This is where I share work I’m proud of. If something resonates, feel free to <a href="mailto:ajadvers@gmail.com">say hello</a>.
          </p>
        </div>
        <div className="hero-bottom">
          <div className="site-credit">
            <span>© {new Date().getFullYear()} AJ Adversalo</span>
            <a href="https://github.com/ajadversalo" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/ajadversalo" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
          <a
            className="round-link"
            href="#experience-archive"
            onClick={scrollToSection}
            aria-label="Explore experience"
          >
            <span>Explore</span>
            <b aria-hidden="true">↓</b>
          </a>
        </div>
      </section>

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
                        <TechIcon tool={tool} size={13} />
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
    </main>
  );
}
