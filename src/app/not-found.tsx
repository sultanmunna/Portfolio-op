import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf">
      <p className="nf-code">404</p>
      <p className="nf-line">No service at this route.</p>
      <Link className="nf-back" href="/">
        back to arrival
      </Link>
    </main>
  );
}
