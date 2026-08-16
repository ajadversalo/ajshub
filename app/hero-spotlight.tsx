"use client";

import { useEffect, useRef } from "react";

export default function HeroSpotlight() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const hero = layer?.closest<HTMLElement>(".hero");
    if (!layer || !hero) return;

    const move = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      layer.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
      layer.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
      layer.classList.add("is-active");
    };
    const leave = () => layer.classList.remove("is-active");

    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="hero-spotlight" ref={layerRef} aria-hidden="true">
      <div className="hero-blueprint">
        <span className="blueprint-note note-one">01 / DISCOVER</span>
        <span className="blueprint-note note-two">ACCESSIBLE · TESTED</span>
        <span className="blueprint-note note-three">IDEA → PRODUCTION</span>
        <i className="blueprint-cross cross-one" />
        <i className="blueprint-cross cross-two" />
      </div>
    </div>
  );
}
