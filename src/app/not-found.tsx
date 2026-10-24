import Link from 'next/link';

export const metadata = {
  title: '404: Not Found',
  description: 'The route you asked for does not exist on this service.',
};

export default function NotFound() {
  return (
    <div className="notfound">
      <h1 className="code">404</h1>
      <p className="payload">
        <b>GET</b> <span className="muted">&lt;the path you asked for&gt;</span> &rarr; <b>404 Not Found</b>
        <br />
        {'{'}
        <br />
        &nbsp;&quot;detail&quot;: &quot;This route does not exist. The docs list everything that does.&quot;<br />
        {'}'}
      </p>
      <p>
        <Link href="/" className="case-link" style={{ fontSize: 'var(--t-s)' }}>
          GET / <span className="arr" aria-hidden="true">&rarr;</span> back to the index
        </Link>
      </p>
    </div>
  );
}
