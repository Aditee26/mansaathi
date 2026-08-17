import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true" />
          <span>Mansaathi</span>
        </div>
        <p className="footer-note">
          A quiet space to check in with yourself. Not a substitute for professional care —
          if you're in crisis, please reach out to a mental health professional or local
          helpline.
        </p>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/login">Log in</Link>
          <Link to="/register">Get started</Link>
        </nav>
      </div>
    </footer>
  );
}
