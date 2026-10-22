"use client";

import PropTypes from "prop-types";
import { useState, type MouseEvent } from "react";
import { HASH, NAV, PERSON_SHORT, ROUTES, SECTIONS } from "../constants";
import { scrollToSection } from "./scroll-to-section";
import ThemeToggle from "./theme-toggle";

/** Page the header is rendered on. Controls hashes vs full paths. */
export type NavArea = "home" | "beyond-work" | "resume";

export type SiteNavProps = {
  current: NavArea;
};

/**
 * Sticky header used on home, resume, and Beyond Work.
 * Hash links only smooth-scroll when `current` is `"home"`.
 */
export default function SiteNav({ current }: SiteNavProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const atHome = current === "home";

  const onHashNav = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!atHome) return;
    const targetId = scrollToSection(event);
    if (targetId) setActiveSection(targetId);
  };

  return (
    <header className={`nav shell${current === "resume" ? " resume-nav" : ""}`}>
      <div className="brand-actions">
        <a
          className="monogram"
          href={atHome ? HASH.top : ROUTES.home}
          onClick={onHashNav}
          aria-label={NAV.homeLabel}
        >
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <rect className="monogram-plate" width="32" height="32" rx="8" />
            <text className="monogram-letters" x="16" y="22.2" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="800" letterSpacing="-0.6">{PERSON_SHORT}</text>
          </svg>
        </a>
        <ThemeToggle />
      </div>
      <nav aria-label="Primary navigation">
        <a
          href={atHome ? HASH.toolbox : `${ROUTES.home}${HASH.toolbox}`}
          onClick={onHashNav}
          aria-current={atHome && activeSection === SECTIONS.toolbox ? "page" : undefined}
        >
          {NAV.tools}
        </a>
        <a
          href={atHome ? HASH.experience : `${ROUTES.home}${HASH.experience}`}
          onClick={onHashNav}
          aria-current={atHome && activeSection === SECTIONS.experience ? "page" : undefined}
        >
          {NAV.experience}
        </a>
        <a href={ROUTES.beyondWork} aria-current={current === "beyond-work" ? "page" : undefined}>
          {NAV.beyondWork}
        </a>
      </nav>
    </header>
  );
}

SiteNav.propTypes = {
  current: PropTypes.oneOf(["home", "beyond-work", "resume"] as const).isRequired,
};
