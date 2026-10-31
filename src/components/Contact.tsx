"use client";

import { useState } from "react";
import { site } from "@/data/site";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="contact" id="contact" data-station="04 / the reply">
      <h2 className="contact-display">
        <span className="line">Your request leaves.</span>
        <span className="line">My reply comes back.</span>
      </h2>
      <div className="contact-actions">
        <a className="btn btn-primary" href={`mailto:${site.email}`}>
          email me
        </a>
        <button className="btn" type="button" onClick={copy}>
          copy address
        </button>
        <a className="btn" href={site.github} rel="me noopener">
          github
        </a>
        <span className="copy-note" role="status" aria-live="polite">
          {copied ? "copied" : ""}
        </span>
      </div>
      <p className="colophon">
        <span>Big Shoulders, Host Grotesk, DM Mono. No trackers.</span>
        <span>2026</span>
      </p>
    </section>
  );
}
