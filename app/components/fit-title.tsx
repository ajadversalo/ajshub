"use client";

import PropTypes from "prop-types";
import { useLayoutEffect, useRef, type CSSProperties } from "react";

export type FitTitleProps = {
  /** Product name shown in the card heading. */
  children: string;
};

/**
 * Shrinks an `h4` so a long product name stays on one line inside its card.
 */
export default function FitTitle({ children }: FitTitleProps) {
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

FitTitle.propTypes = {
  children: PropTypes.string.isRequired,
};
