"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ASK_API_PATH, ASK_SAMPLES, COPY, IMAGES } from "../constants";

const WORKFLOW_ZOOM_MIN = 0.5;
const WORKFLOW_ZOOM_MAX = 4;
const WORKFLOW_ZOOM_STEP = 0.25;

function clampWorkflowZoom(value: number) {
  const snapped = Math.round(value / WORKFLOW_ZOOM_STEP) * WORKFLOW_ZOOM_STEP;
  return Math.min(WORKFLOW_ZOOM_MAX, Math.max(WORKFLOW_ZOOM_MIN, snapped));
}

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  retrieval?: string;
};

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function SendArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ZoomOutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-3.5-3.5M8 11h6" />
    </svg>
  );
}

function ZoomInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" />
    </svg>
  );
}

/**
 * Hero ask field that opens a RAG chat over the site corpus.
 */
export default function AskChat() {
  const dialogId = useId();
  const titleId = useId();
  const workflowTitleId = useId();
  const heroInputRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const workflowStageRef = useRef<HTMLDivElement>(null);
  const workflowOpenButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [workflowZoom, setWorkflowZoom] = useState(1);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const turn = useRef(0);

  const close = () => {
    setWorkflowOpen(false);
    setWorkflowZoom(1);
    setOpen(false);
    setDraft("");
    heroInputRef.current?.blur();
  };

  const openWorkflow = () => {
    setWorkflowZoom(1);
    setWorkflowOpen(true);
  };

  const closeWorkflow = () => {
    setWorkflowOpen(false);
    setWorkflowZoom(1);
    workflowOpenButtonRef.current?.focus();
  };

  const zoomWorkflowBy = (delta: number) => {
    setWorkflowZoom((current) => clampWorkflowZoom(current + delta));
  };

  const clearChat = () => {
    turn.current += 1;
    setMessages([]);
    setDraft("");
    setPending(false);
    composerRef.current?.focus();
  };

  const openPanel = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (workflowOpen) {
          closeWorkflow();
          return;
        }
        close();
        return;
      }
      if (!workflowOpen) return;
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomWorkflowBy(WORKFLOW_ZOOM_STEP);
      }
      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        zoomWorkflowBy(-WORKFLOW_ZOOM_STEP);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => {
      if (workflowOpen) return;
      composerRef.current?.focus();
    }, 20);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open, workflowOpen]);

  useEffect(() => {
    if (!workflowOpen) return;
    const stage = workflowStageRef.current;
    if (!stage) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomWorkflowBy(event.deltaY < 0 ? WORKFLOW_ZOOM_STEP : -WORKFLOW_ZOOM_STEP);
    };
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      scrollLeft = stage.scrollLeft;
      scrollTop = stage.scrollTop;
      stage.setPointerCapture(event.pointerId);
      stage.classList.add("is-panning");
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      stage.scrollLeft = scrollLeft - (event.clientX - startX);
      stage.scrollTop = scrollTop - (event.clientY - startY);
    };
    const onPointerUp = () => {
      dragging = false;
      stage.classList.remove("is-panning");
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    return () => {
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
    };
  }, [workflowOpen]);

  useEffect(() => {
    if (messages.length === 0 && !pending) return;
    listRef.current?.lastElementChild?.scrollIntoView({ block: "end" });
  }, [messages, pending, open]);

  async function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || pending) return;
    const id = ++turn.current;
    setOpen(true);
    setDraft("");
    setPending(true);
    setMessages((current) => [
      ...current,
      { id: newId(), role: "user", content: trimmed },
    ]);

    try {
      const response = await fetch(ASK_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const payload = await response.json() as {
        answer?: string;
        error?: string;
        retrieval?: string;
      };
      if (id !== turn.current) return;
      if (!response.ok) throw new Error(payload.error || "Ask failed");
      setMessages((current) => [
        ...current,
        {
          id: newId(),
          role: "assistant",
          content: payload.answer ?? COPY.askUnavailable,
          retrieval: payload.retrieval,
        },
      ]);
    } catch {
      if (id !== turn.current) return;
      setMessages((current) => [
        ...current,
        { id: newId(), role: "assistant", content: COPY.askUnavailable },
      ]);
    } finally {
      if (id === turn.current) setPending(false);
    }
  }

  const onHeroSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (draft.trim()) {
      void send(draft);
      return;
    }
    openPanel();
  };

  const onComposerSubmit = (event: FormEvent) => {
    event.preventDefault();
    void send(draft);
  };

  return (
    <>
      <form className="hero-ask" onSubmit={onHeroSubmit}>
        <input
          ref={heroInputRef}
          type="text"
          value={open ? "" : draft}
          onChange={(event) => setDraft(event.target.value)}
          onFocus={openPanel}
          placeholder={COPY.askPlaceholder}
          aria-label={COPY.askPlaceholder}
          aria-controls={dialogId}
          autoComplete="off"
        />
        <button type="submit" className="ask-send" aria-label={COPY.askSend}>
          <SendArrow />
        </button>
      </form>

      {open && (
        <div className="ask-backdrop" onClick={close}>
          <div
            className="ask-dialog"
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="ask-dialog-head">
              <h2 id={titleId}>{COPY.askTitle}</h2>
              <div className="ask-dialog-actions">
                {messages.length > 0 && (
                  <button type="button" className="ask-clear" onClick={clearChat}>
                    {COPY.askClear}
                  </button>
                )}
                <button
                  ref={workflowOpenButtonRef}
                  type="button"
                  className="ask-clear"
                  onClick={openWorkflow}
                >
                  {COPY.askWorkflow}
                </button>
                <button type="button" className="ask-close" onClick={close} aria-label={COPY.askClose}>
                  <CloseIcon />
                </button>
              </div>
            </header>

            <div className="ask-messages" ref={listRef}>
              {messages.length === 0 && (
                <div className="ask-empty">
                  <p>{COPY.askIntro}</p>
                  <ul className="ask-samples">
                    {ASK_SAMPLES.map((sample) => (
                      <li key={sample}>
                        <button type="button" onClick={() => void send(sample)}>
                          {sample}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {messages.map((message) => (
                <article className={`ask-msg ask-msg-${message.role}`} key={message.id}>
                  <p>{message.content}</p>
                  {message.role === "assistant" && message.retrieval !== "gemini" && (
                    <p className="ask-disclaimer">{COPY.askDisclaimer}</p>
                  )}
                </article>
              ))}

              {pending && <p className="ask-pending">{COPY.askPending}</p>}
            </div>

            <form className="ask-composer" onSubmit={onComposerSubmit}>
              <input
                ref={composerRef}
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={COPY.askPlaceholder}
                aria-label={COPY.askPlaceholder}
                autoComplete="off"
              />
              <button type="submit" className="ask-send" disabled={pending || !draft.trim()}>
                <SendArrow />
              </button>
            </form>
          </div>
        </div>
      )}

      {open && workflowOpen && (
        <div className="ask-workflow-backdrop" onClick={closeWorkflow}>
          <div
            className="ask-workflow-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={workflowTitleId}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="ask-workflow-head">
              <h2 id={workflowTitleId}>{COPY.askWorkflowTitle}</h2>
              <div className="ask-workflow-tools">
                <button
                  type="button"
                  className="ask-close"
                  onClick={() => zoomWorkflowBy(-WORKFLOW_ZOOM_STEP)}
                  disabled={workflowZoom <= WORKFLOW_ZOOM_MIN}
                  aria-label={COPY.askWorkflowZoomOut}
                >
                  <ZoomOutIcon />
                </button>
                <span className="ask-workflow-zoom" aria-live="polite">
                  {Math.round(workflowZoom * 100)}%
                </span>
                <button
                  type="button"
                  className="ask-close"
                  onClick={() => zoomWorkflowBy(WORKFLOW_ZOOM_STEP)}
                  disabled={workflowZoom >= WORKFLOW_ZOOM_MAX}
                  aria-label={COPY.askWorkflowZoomIn}
                >
                  <ZoomInIcon />
                </button>
                <button
                  type="button"
                  className="ask-close"
                  onClick={closeWorkflow}
                  aria-label={COPY.askClose}
                >
                  <CloseIcon />
                </button>
              </div>
            </header>
            <div className="ask-workflow-stage" ref={workflowStageRef}>
              <img
                src={IMAGES.askWorkflow}
                alt={COPY.askWorkflowAlt}
                style={{ width: `${workflowZoom * 100}%` }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
