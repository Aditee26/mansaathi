import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/journal', label: 'Journal' },
  { to: '/moods', label: 'Moods' },
  { to: '/activities', label: 'Activities' },
  { to: '/insights', label: 'Insights' },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand">
          <span className="brand-mark" aria-hidden="true" />
          Mansaathi
        </Link>

        {isAuthenticated ? (
          <>
            <nav className={`navbar-links ${menuOpen ? 'is-open' : ''}`} aria-label="Main">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `navbar-link ${isActive ? 'is-active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="navbar-mobile-actions">
                <Link to="/profile" className="navbar-link" onClick={() => setMenuOpen(false)}>
                  Profile & settings
                </Link>
                <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            </nav>

            <div className="navbar-user">
              <Link to="/profile" className="avatar" title={user?.name} aria-label="Profile & settings">
                {initials || 'M'}
              </Link>
              <button type="button" className="btn btn-ghost btn-sm navbar-desktop-logout" onClick={handleLogout}>
                Log out
              </button>
            </div>

            <button
              type="button"
              className="navbar-toggle"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </>
        ) : (
          <nav className="navbar-links navbar-links-public" aria-label="Main">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
