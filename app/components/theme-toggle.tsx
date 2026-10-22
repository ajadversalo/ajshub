"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from "../constants";

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : DEFAULT_THEME;
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** Light/dark control. Reads `data-theme` so it stays in sync with the FOUC script. */
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => DEFAULT_THEME);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M20.5 15.1A8.5 8.5 0 0 1 8.9 3.5 8.5 8.5 0 1 0 20.5 15.1Z" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
