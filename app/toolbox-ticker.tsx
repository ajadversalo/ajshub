"use client";

import { useRef } from "react";
import type { PointerEvent } from "react";
import { concepts, stack } from "./data/portfolio";

export default function ToolboxTicker() {
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const startDragging = (event: PointerEvent<HTMLDivElement>) => {
    const window = event.currentTarget;
    drag.current = { active: true, startX: event.clientX, scrollLeft: window.scrollLeft };
    window.setPointerCapture(event.pointerId);
    window.classList.add("is-dragging");
  };

  const dragTicker = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    event.preventDefault();
    event.currentTarget.scrollLeft = drag.current.scrollLeft - (event.clientX - drag.current.startX);
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    drag.current.active = false;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="ticker" aria-label="Core technologies">
      <div className="ticker-label">
        <span>Toolbox</span>
        <i>Always learning</i>
      </div>
      <div
        className="ticker-window"
        onPointerDown={startDragging}
        onPointerMove={dragTicker}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
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
    </div>
  );
}
