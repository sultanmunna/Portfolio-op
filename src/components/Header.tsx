'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/data/site';

const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'Stack', href: '/#stack' },
  { label: 'Contact', href: '/#contact' },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="header">
      <Link href="/" className="header__id">
        <span className="dot" aria-hidden="true" />
        {site.shortName}
        <span className="muted nd">/ portfolio</span>
      </Link>
      <nav className="nav" aria-label="Main">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={n.href === '/#work' && pathname.startsWith('/work') ? 'page' : undefined}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
