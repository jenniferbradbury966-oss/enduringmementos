import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        Enduring <span style={styles.logoAccent}>Mementos</span>
      </Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/interview" style={styles.link}>Begin a Memorial</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
    padding: '1.2rem 3rem', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    background: 'rgba(250,246,240,0.92)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(196,163,90,0.15)',
    boxSizing: 'border-box',
  },
  logo: {
    fontFamily: 'Georgia, serif', fontSize: '1.4rem',
    color: '#5c4a3a', textDecoration: 'none',
  },
  logoAccent: { color: '#c4a35a', fontStyle: 'italic' },
  links: { display: 'flex', gap: '2rem', alignItems: 'center' },
  link: {
    fontSize: '0.85rem', letterSpacing: '0.08em',
    color: '#8a7d72', textDecoration: 'none',
    textTransform: 'uppercase',
  },
};

export default Navbar;