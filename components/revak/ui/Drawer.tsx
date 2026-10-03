"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { tr } from "@/content/revak/tr";
import { Icon } from "./Icon";

/** A side drawer on the native <dialog>: focus trap, Esc and backdrop close for free. */
export function DrawerLink({
  label,
  title,
  body,
  className = "rv-inline-link",
}: {
  label: string;
  title: string;
  body: string[];
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Portalled to the demo root: the trigger often sits inside a checkbox <label> or a
  // flow <form>, where a nested dialog would toggle the box or nest forms.
  const dialog = (
      <dialog
        ref={ref}
        className="rv-drawer"
        aria-label={title}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="rv-drawer-in">
          <div className="rv-drawer-head">
            <h2>{title}</h2>
            <button type="button" className="rv-icon-btn" onClick={() => ref.current?.close()} aria-label={tr.kvkk.close}>
              <Icon name="close" size={22} />
            </button>
          </div>
          <div className="rv-drawer-body">
            {body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="rv-drawer-foot">
            <button type="button" className="rv-btn rv-btn--ink" onClick={() => ref.current?.close()}>
              {tr.kvkk.close}
            </button>
          </div>
        </div>
      </dialog>
  );
  return (
    <>
      <button type="button" className={className} onClick={() => ref.current?.showModal()}>
        {label}
      </button>
      {mounted && createPortal(dialog, document.querySelector("[data-demo=revak]") ?? document.body)}
    </>
  );
}

export function KvkkLink({ label = tr.footer.kvkk, className }: { label?: string; className?: string }) {
  return <DrawerLink label={label} title={tr.kvkk.title} body={tr.kvkk.body} className={className} />;
}
