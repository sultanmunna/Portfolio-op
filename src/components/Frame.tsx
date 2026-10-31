"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

export function Frame() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const home = pathname === "/";
  const anchor = (id: string) => (home ? `#${id}` : `/#${id}`);

  const links = [
    { label: "work", id: "work" },
    { label: "stack", id: "stack" },
    { label: "contact", id: "contact" },
  ];

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const focusables = () =>
      Array.from(overlay.querySelectorAll<HTMLElement>("a, button"));
    focusables()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
      if (event.key === "Tab") {
        const list = focusables();
        const first = list[0];
        const last = list[list.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const goTo = (id: string) => (event: React.MouseEvent) => {
    if (!home) return;
    event.preventDefault();
    setOpen(false);
    window.dispatchEvent(new CustomEvent("site:scrollto", { detail: id }));
  };

  return (
    <>
      <header className="frame frame-top" data-frame-row>
        <Link className="frame-name" href="/">
          {site.name}
        </Link>
        <nav className="frame-nav" aria-label="primary">
          {links.map((link) => (
            <a key={link.id} href={anchor(link.id)} onClick={goTo(link.id)}>
              {link.label}
            </a>
          ))}
        </nav>
        <button
          ref={btnRef}
          className="frame-menu"
          aria-expanded={open}
          aria-controls="menu-overlay"
          onClick={() => setOpen(true)}
        >
          menu
        </button>
      </header>

      <div className="frame frame-bottom" data-frame-row>
        <span className="frame-readout">station 00 / arrival</span>
        <a className="frame-action" href={`mailto:${site.email}`}>
          email me
        </a>
      </div>

      {open && (
        <div
          className="menu-overlay"
          id="menu-overlay"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="menu"
        >
          <nav className="menu-nav" aria-label="menu">
            {links.map((link) => (
              <a key={link.id} href={anchor(link.id)} onClick={goTo(link.id)}>
                {link.label}
              </a>
            ))}
            <a href={`mailto:${site.email}`} onClick={() => setOpen(false)}>
              email me
            </a>
          </nav>
          <button
            className="menu-close"
            onClick={() => {
              setOpen(false);
              btnRef.current?.focus();
            }}
          >
            close
          </button>
        </div>
      )}
    </>
  );
}
