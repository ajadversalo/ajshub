"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ASK_API_PATH, ASK_SAMPLES, COPY } from "../constants";

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

/**
 * Hero ask field that opens a RAG chat over the site corpus.
 */
export default function AskChat() {
  const dialogId = useId();
  const titleId = useId();
  const heroInputRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const turn = useRef(0);

  const close = () => {
    setOpen(false);
    setDraft("");
    heroInputRef.current?.blur();
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
      if (event.key === "Escape") close();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => composerRef.current?.focus(), 20);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  useEffect(() => {
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
    </>
  );
}
