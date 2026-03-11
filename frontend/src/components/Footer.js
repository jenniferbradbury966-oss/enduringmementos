import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        © 2025 Enduring Mementos — <em>Love That Endures</em>
      </p>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#2e261e', padding: '2rem 3rem',
    textAlign: 'center',
  },
  text: {
    color: 'rgba(250,246,240,0.5)',
    fontSize: '0.82rem', fontFamily: 'Georgia, serif',
  },
};

export default Footer;