import { Link } from 'react-router-dom';
import './Landing.css';

const PILLARS = [
  {
    title: 'Check in daily',
    text: 'One tap each day to name how you feel. No essays required, just a moment of honesty.',
  },
  {
    title: 'Write privately',
    text: 'A journal that belongs to you alone — for the thoughts too long for a mood label.',
  },
  {
    title: 'Build small habits',
    text: 'Log the quiet wellness practices — sleep, movement, gratitude — and watch them add up.',
  },
  {
    title: 'See the shape of things',
    text: 'Gentle trend lines, not judgment. Understand your weeks without a wall of statistics.',
  },
];

const STEPS = [
  { label: 'Arrive', text: 'Open Mansaathi and see how the week has actually gone, not how you remember it.' },
  { label: 'Name it', text: 'Log today\u2019s mood and, if you want, a line or two about why.' },
  { label: 'Notice', text: 'Come back later to see patterns settle in — no forcing, just noticing.' },
];

export default function Landing() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="breathing-dot" aria-hidden="true" /> A calmer kind of check-in
            </span>
            <h1>
              Notice how you're <em>actually</em> doing.
            </h1>
            <p className="hero-lede">
              Mansaathi is a quiet place to track your mood, write privately, and build small
              wellness habits — without the noise of a typical productivity app.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Start your first check-in
              </Link>
              <Link to="/login" className="btn btn-secondary">
                I already have an account
              </Link>
            </div>
            <p className="hero-microcopy">Free to use. Your entries stay private to you.</p>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-card hero-card-mood">
              <span className="hero-card-label">Today</span>
              <div className="hero-mood-row">
                <span className="hero-mood-dot" style={{ background: 'var(--mood-good)' }} />
                <span>Good</span>
              </div>
              <p className="hero-card-note">"Slept well, went for a walk before class."</p>
            </div>
            <div className="hero-card hero-card-trend">
              <span className="hero-card-label">This week</span>
              <svg viewBox="0 0 220 70" width="100%" height="70">
                <polyline
                  points="0,45 30,38 60,50 90,25 120,30 150,15 180,20 210,10"
                  fill="none"
                  stroke="var(--color-teal)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="pillars">
        <div className="container">
          <h2 className="section-heading">Everything stays simple, on purpose</h2>
          <div className="pillars-grid">
            {PILLARS.map((p) => (
              <div className="pillar-card" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2 className="section-heading">A rhythm, not a routine</h2>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div className="step" key={s.label}>
                <span className="step-index">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h4>{s.label}</h4>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-inner">
          <h2>Your first check-in takes under a minute.</h2>
          <Link to="/register" className="btn btn-primary">
            Create your free account
          </Link>
        </div>
      </section>
    </div>
  );
}
