"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import AskChat from "./components/ask-chat";
import FitTitle from "./components/fit-title";
import SiteNav from "./components/site-nav";
import TechChips from "./components/tech-chips";
import ToolboxSection from "./components/toolbox-section";
import {
  COPY,
  GITHUB_URL,
  LINKEDIN_URL,
  PERSON_NAME,
  ROLE_LINE,
  SECTIONS,
} from "./constants";
import { experience } from "./data/experience";

export default function Home() {
  return (
    <main>
      <SiteNav current="home" />

      <section className="hero shell" id={SECTIONS.top}>
        <div className="hero-intro">
          <div className="hero-copy">
            <div className="hero-name">
              <p className="hero-kicker">{COPY.heroKicker}</p>
              <h1>{PERSON_NAME}</h1>
            </div>
            <p className="hero-role">{ROLE_LINE}</p>
            <p className="hero-bio">{COPY.heroBio}</p>
            <AskChat />
          </div>
        </div>
        <div className="hero-bottom">
          <div className="site-credit">
            <span>© {new Date().getFullYear()} {PERSON_NAME}</span>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </section>

      <ToolboxSection />

      <section className="experience shell" id={SECTIONS.experience}>
        <div className="experience-heading">
          <h2>{COPY.experienceHeading}</h2>
          <p>{COPY.experienceIntro}</p>
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
                  <TechChips tools={chapter.stack} size={13} label={`${chapter.company} tech stack`} />
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
                      <span
                        className="product-record-watermark"
                        aria-hidden="true"
                        style={{ "--watermark-image": `url(${chapter.logo})` } as CSSProperties}
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
