import { Link } from 'react-router-dom';
import { bookContent } from '../data/bookContent';

export default function Landing() {
  return (
    <div>
      <section className="hero">
        <div className="hero-content fade-in">
          <span className="hero-icon">🏛️</span>
          <h1>{bookContent.title}</h1>
          <p className="hero-tagline">{bookContent.tagline}</p>
          <p className="hero-description">{bookContent.description}</p>
          <div className="hero-buttons">
            <Link to="/guide" className="btn btn-primary">Begin Your Journey</Link>
            <Link to="/course" className="btn btn-secondary">Explore the Course</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>The Six Pillars</h2>
          <p>Inside Sacred Home, you'll learn how to build a home that is alive, magnetic, and sacred.</p>
        </div>
        <div className="card-grid">
          {bookContent.principles.map((p) => (
            <div className="card" key={p.id}>
              <span className="card-icon">{p.icon}</span>
              <h3>{p.title}</h3>
              <div className="card-subtitle">{p.subtitle}</div>
              <p>{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="closing">
        <blockquote>
          {bookContent.closing}
        </blockquote>
      </section>

      <section className="section" style={{ textAlign: 'center' }}>
        <div className="section-header">
          <h2>Start Building Your Sacred Home</h2>
          <p>Choose your path below to begin transforming your household.</p>
        </div>
        <div className="hero-buttons">
          <Link to="/guide" className="btn btn-primary">Interactive Guide</Link>
          <Link to="/practice" className="btn btn-secondary">Daily Practice</Link>
          <Link to="/course" className="btn btn-secondary">Full Course</Link>
        </div>
      </section>
    </div>
  );
}
