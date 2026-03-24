import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    transition: background 0.4s ease, box-shadow 0.4s ease, padding 0.4s ease;
    padding: 28px 40px;
  }

  .nav.scrolled {
    background: rgba(251,248,244,0.97);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 1px 0 rgba(60,47,47,0.08), 0 4px 24px rgba(60,47,47,0.06);
    padding: 16px 40px;
  }

  .nav-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-logo {
  min-width: 200px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.25rem;
    font-weight: 300;
    color: var(--brown, #3C2F2F);
    text-decoration: none;
    letter-spacing: 0.01em;
    transition: opacity 0.2s;
    white-space: nowrap;
  }

  .nav-logo em {
    font-style: italic;
    color: var(--gold, #A8935A);
  }

  .nav-logo:hover { opacity: 0.75; }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 36px;
    list-style: none;
  }

  .nav-links a {
    font-family: 'Jost', sans-serif;
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--brown, #3C2F2F);
    text-decoration: none;
    position: relative;
    transition: color 0.2s;
    white-space: nowrap;
  }

  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--gold, #A8935A);
    transition: width 0.3s ease;
  }

  .nav-links a:hover { color: var(--gold, #A8935A); }
  .nav-links a:hover::after { width: 100%; }

  .nav-links a.active {
    color: var(--gold, #A8935A);
  }
  .nav-links a.active::after {
    width: 100%;
  }

  .nav-cta {
    font-family: 'Jost', sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--cream, #F5EFE6) !important;
    background: var(--brown, #3C2F2F);
    padding: 10px 22px;
    text-decoration: none;
    transition: background 0.3s, transform 0.2s, box-shadow 0.3s !important;
    white-space: nowrap;
  }

  .nav-cta::after { display: none !important; }

  .nav-cta:hover {
    background: var(--brown-mid, #6B4F4F) !important;
    color: var(--cream, #F5EFE6) !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(60,47,47,0.18);
  }

  .nav-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    padding: 4px;
    background: none;
    border: none;
    z-index: 101;
  }

  .nav-hamburger span {
    display: block;
    width: 22px;
    height: 1.5px;
    background: var(--brown, #3C2F2F);
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform-origin: center;
  }

  .nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  .nav-mobile {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: var(--warm-white, #FBF8F4);
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 36px;
    transform: translateY(-100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  .nav-mobile.open {
    transform: translateY(0);
    pointer-events: all;
  }

  .nav-mobile a {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    font-weight: 300;
    color: var(--brown, #3C2F2F);
    text-decoration: none;
    letter-spacing: 0.04em;
    transition: color 0.2s;
  }

  .nav-mobile a:hover { color: var(--dusty-rose, #C4917A); }

  .nav-mobile .nav-mobile-cta {
    font-family: 'Jost', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--cream, #F5EFE6);
    background: var(--brown, #3C2F2F);
    padding: 14px 36px;
    margin-top: 8px;
  }

  .nav-mobile-divider {
    width: 32px;
    height: 1px;
    background: var(--rose-light, #E8C4B4);
  }

  @media (max-width: 768px) {
    .nav { padding: 20px 24px; }
    .nav.scrolled { padding: 14px 24px; }
    .nav-links { display: none; }
    .nav-hamburger { display: flex; }
  }
`;

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location                = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isHome      = location.pathname === "/";
  const isInterview = location.pathname === "/interview";

  return (
    <>
      <style>{styles}</style>

      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">

          <Link to="/" className="nav-logo">
            Enduring <em>Mementos</em>
          </Link>

          <ul className="nav-links">
            {isHome && (
              <>
                <li>
                  <a href="#how-it-works" onClick={(e) => {
                    e.preventDefault();
                    scrollTo("how-it-works");
                  }}>
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#pricing" onClick={(e) => {
                    e.preventDefault();
                    scrollTo("pricing");
                  }}>
                    Pricing
                  </a>
                </li>
              </>
            )}
            {!isHome && (
              <li>
                <Link to="/">Home</Link>
              </li>
            )}
            <li>
              <Link
                to="/interview"
                className={`nav-cta${isInterview ? " active" : ""}`}
              >
                Begin a Memorial
              </Link>
            </li>
          </ul>

          <button
            className={`nav-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>

        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div className={`nav-mobile${menuOpen ? " open" : ""}`}>
        <Link to="/">Home</Link>
        <div className="nav-mobile-divider" />
        {isHome && (
          <>
            <a href="#how-it-works" onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              setTimeout(() => scrollTo("how-it-works"), 300);
            }}>
              How It Works
            </a>
            <a href="#pricing" onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              setTimeout(() => scrollTo("pricing"), 300);
            }}>
              Pricing
            </a>
            <div className="nav-mobile-divider" />
          </>
        )}
        <Link to="/interview" className="nav-mobile-cta">
          Begin a Memorial
        </Link>
      </div>
    </>
  );
}