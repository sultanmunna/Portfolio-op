'use client';
import { useState } from 'react';

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Clipboard API unavailable (http, older browsers): fall back to the old way.
      const ta = document.createElement('textarea');
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button type="button" className="copy-btn" onClick={copy} aria-live="polite">
      {copied ? 'copied' : 'copy'}
    </button>
  );
}
