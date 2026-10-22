import type { MouseEvent } from "react";

/**
 * Smooth-scrolls to the hash target on the current page.
 *
 * @param event - Click from an in-page `#id` (or `/#id`) link.
 * @returns The element id when a target was found, otherwise `undefined`.
 */
export function scrollToSection(event: MouseEvent<HTMLAnchorElement>) {
  const href = event.currentTarget.getAttribute("href");
  if (!href?.includes("#")) return;
  const targetId = href.slice(href.indexOf("#") + 1);
  if (!targetId) return;
  const target = document.getElementById(targetId);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${targetId}`);
  return targetId;
}
