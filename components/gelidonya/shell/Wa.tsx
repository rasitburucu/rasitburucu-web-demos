"use client";

// WhatsApp, demo-safe. The phone number is fictional, and a real wa.me link
// could reach whoever owns that number, so every WhatsApp button opens this
// window instead: the prepared message, a copy button and a plain note.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { tr } from "@/content/gelidonya/tr";

type Ctx = { open: (message: string) => void };
const WaCtx = createContext<Ctx>({ open: () => {} });

export function WaProvider({ children }: { children: React.ReactNode }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const copyBtn = useRef<HTMLButtonElement>(null);
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const w = tr.wa;

  const open = useCallback((message: string) => {
    opener.current = document.activeElement as HTMLElement | null;
    setMsg(message);
    setCopied(false);
    const d = dlg.current;
    if (d && !d.open) d.showModal();
    copyBtn.current?.focus();
  }, []);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const onClose = () => opener.current?.focus({ preventScroll: true });
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const copy = async () => {
    const text = area.current?.value ?? msg;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      area.current?.select();
      document.execCommand?.("copy");
    }
    setCopied(true);
  };

  return (
    <WaCtx.Provider value={{ open }}>
      {children}
      <dialog
        ref={dlg}
        className="gd-wa"
        aria-labelledby="gd-wa-title"
        onClick={(e) => {
          // a click on the backdrop closes
          if (e.target === dlg.current) dlg.current?.close();
        }}
      >
        <div className="gd-wa-in">
          <h2 id="gd-wa-title" className="gd-h3">
            {w.title}
          </h2>
          <p className="gd-muted">{w.lead}</p>
          <label htmlFor="gd-wa-text" className="gd-wa-label">
            {w.textLabel}
          </label>
          <textarea id="gd-wa-text" ref={area} value={msg} onChange={(e) => setMsg(e.target.value)} rows={5} />
          <p className="gd-demo">{w.demo}</p>
          <div className="gd-wa-act">
            <button type="button" className="gd-btn gd-btn--dark" onClick={copy} ref={copyBtn}>
              <span aria-live="polite">{copied ? w.copied : w.copy}</span>
            </button>
            <button type="button" className="gd-btn gd-btn--line" onClick={() => dlg.current?.close()}>
              {w.close}
            </button>
          </div>
        </div>
      </dialog>
    </WaCtx.Provider>
  );
}

export const useWa = () => useContext(WaCtx);

/** Speech-bubble mark: generic, not the WhatsApp logo. */
export function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="gd-ico">
      <path d="M4 18.5 5.3 15A7.5 7.5 0 1 1 8.6 18l-4.6.5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 9.5c.3 1.9 1.7 3.6 3.8 4.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="gd-ico">
      <path
        d="M6.6 3.5h3l1.4 4.2-2 1.4a11 11 0 0 0 5.9 5.9l1.4-2 4.2 1.4v3c0 1-.8 1.8-1.8 1.8A16.6 16.6 0 0 1 4.8 5.3c0-1 .8-1.8 1.8-1.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WaButton({ message, className, children }: { message: string; className?: string; children?: React.ReactNode }) {
  const { open } = useWa();
  return (
    <button type="button" className={className ?? "gd-btn gd-btn--line"} onClick={() => open(message)} aria-haspopup="dialog">
      {children ?? (
        <>
          <WaIcon /> {tr.wa.button}
        </>
      )}
    </button>
  );
}
