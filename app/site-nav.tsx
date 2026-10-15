"use client";

import { useState, type MouseEvent } from "react";
import ThemeToggle from "./theme-toggle";

type Area = "home" | "beyond-work" | "resume";

export default function SiteNav({ current }: { current: Area }) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const atHome = current === "home";

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!atHome) return;
    const href = event.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;
    event.preventDefault();
    const targetId = href.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    setActiveSection(targetId);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${targetId}`);
  };

  return (
    <header className={`nav shell${current === "resume" ? " resume-nav" : ""}`}>
      <div className="brand-actions">
        <a
          className="monogram"
          href={atHome ? "#top" : "/"}
          onClick={scrollToSection}
          aria-label="AJ Adversalo, home"
        >
          AJ<span>®</span>
        </a>
        <ThemeToggle />
      </div>
      <nav aria-label="Primary navigation">
        <a
          href={atHome ? "#toolbox" : "/#toolbox"}
          onClick={scrollToSection}
          aria-current={atHome && activeSection === "toolbox" ? "page" : undefined}
        >
          Tools
        </a>
        <a
          href={atHome ? "#experience-archive" : "/#experience-archive"}
          onClick={scrollToSection}
          aria-current={atHome && activeSection === "experience-archive" ? "page" : undefined}
        >
          Experience
        </a>
        <a href="/beyond-work" aria-current={current === "beyond-work" ? "page" : undefined}>
          Beyond Work
        </a>
      </nav>
    </header>
  );
}
