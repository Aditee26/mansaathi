import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page text-center" style={{ paddingTop: '5rem' }}>
      <div className="breathing-dot" style={{ margin: '0 auto var(--sp-4)' }} aria-hidden="true" />
      <h1>Page not found</h1>
      <p className="muted" style={{ maxWidth: '40ch', margin: '0 auto var(--sp-5)' }}>
        The page you're looking for doesn't exist, or may have moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}
