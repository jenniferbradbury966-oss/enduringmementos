import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --cream: #F5EFE6;
    --warm-white: #FBF8F4;
    --dusty-rose: #C4917A;
    --rose-light: #E8C4B4;
    --sage: #8A9E8C;
    --sage-light: #C2CEC3;
    --brown: #3C2F2F;
    --brown-mid: #6B4F4F;
    --gold: #A8935A;
    --gold-light: #D4B896;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background-color: var(--warm-white);
    font-family: 'Jost', sans-serif;
    color: var(--brown);
  }

  .hero {
    min-height: 100vh;
    background: linear-gradient(160deg, var(--cream) 0%, #EDE0D4 50%, #E8D8CC 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120px 40px 80px;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -200px; right: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(196,145,122,0.15) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .hero::after {
    content: '';
    position: absolute;
    bottom: -100px; left: -100px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(138,158,140,0.12) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .hero-inner {
    max-width: 1100px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .hero-text h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.8rem, 5vw, 4.2rem);
    font-weight: 300;
    line-height: 1.15;
    color: var(--brown);
    margin-bottom: 24px;
    animation: fadeUp 0.9s ease both;
  }

  .hero-text h1 em {
    font-style: italic;
    color: var(--gold);
  }

  .hero-text p {
    font-size: 1.05rem;
    font-weight: 300;
    line-height: 1.8;
    color: var(--brown-mid);
    margin-bottom: 40px;
    max-width: 460px;
    animation: fadeUp 0.9s 0.15s ease both;
  }

  .hero-buttons {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    animation: fadeUp 0.9s 0.3s ease both;
  }

  .btn-primary {
    background: var(--brown);
    color: var(--cream);
    padding: 14px 32px;
    font-family: 'Jost', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: background 0.3s, transform 0.2s;
  }

  .btn-primary:hover {
    background: var(--brown-mid);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: transparent;
    color: var(--brown);
    padding: 14px 32px;
    font-family: 'Jost', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border: 1.5px solid var(--brown-mid);
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s;
  }

  .btn-secondary:hover {
    background: var(--brown);
    color: var(--cream);
  }

  .memorial-card {
    background: white;
    border-radius: 4px;
    box-shadow: 0 20px 60px rgba(60,47,47,0.12), 0 4px 16px rgba(60,47,47,0.06);
    overflow: hidden;
    animation: fadeUp 0.9s 0.2s ease both;
  }

  .card-header {
    background: linear-gradient(135deg, var(--brown) 0%, var(--brown-mid) 100%);
    padding: 28px 32px;
    color: white;
  }

  .card-header h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 300;
    margin-bottom: 4px;
  }

  .card-header p {
    font-size: 0.78rem;
    font-weight: 300;
    letter-spacing: 0.08em;
    opacity: 0.75;
    text-transform: uppercase;
  }

  .card-body {
    padding: 28px 32px;
  }

  .card-quote {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem;
    font-style: italic;
    font-weight: 300;
    color: var(--brown-mid);
    line-height: 1.7;
    padding-left: 16px;
    border-left: 2px solid var(--gold-light);
    margin-bottom: 20px;
  }

  .card-meta {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .card-tag {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--sage);
    background: rgba(138,158,140,0.1);
    padding: 4px 10px;
    border-radius: 2px;
  }

  /* Trust bar */
  .trust-bar {
    background: var(--brown);
    padding: 20px 40px;
    display: flex;
    justify-content: center;
    gap: 60px;
    flex-wrap: wrap;
  }

  .trust-item {
    color: var(--gold-light);
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .trust-item span {
    opacity: 0.5;
    font-size: 1rem;
  }

  /* How it works */
  .section {
    padding: 100px 40px;
    max-width: 1100px;
    margin: 0 auto;
  }

  .section-label {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
  }

  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 3.5vw, 2.8rem);
    font-weight: 300;
    color: var(--brown);
    line-height: 1.2;
    margin-bottom: 16px;
  }

  .section-title em {
    font-style: italic;
    color: var(--dusty-rose);
  }

  .section-sub {
    font-size: 0.95rem;
    font-weight: 300;
    color: var(--brown-mid);
    line-height: 1.8;
    max-width: 560px;
    margin-bottom: 60px;
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
  }

  .step {
    position: relative;
    padding: 36px 32px;
    background: var(--warm-white);
    border: 1px solid rgba(196,145,122,0.2);
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .step:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(60,47,47,0.08);
  }

  .step-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3.5rem;
    font-weight: 300;
    color: var(--rose-light);
    line-height: 1;
    margin-bottom: 16px;
  }

  .step h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    font-weight: 500;
    color: var(--brown);
    margin-bottom: 12px;
  }

  .step p {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--brown-mid);
    line-height: 1.8;
  }

  /* Chat demo */
  .chat-section {
    background: linear-gradient(160deg, #EDE0D4 0%, var(--cream) 100%);
    padding: 100px 40px;
  }

  .chat-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .chat-window {
    background: white;
    border-radius: 4px;
    box-shadow: 0 20px 60px rgba(60,47,47,0.1);
    overflow: hidden;
  }

  .chat-top {
    background: var(--cream);
    padding: 16px 20px;
    border-bottom: 1px solid rgba(196,145,122,0.2);
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--brown-mid);
  }

  .chat-messages {
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 280px;
  }

  .msg {
    max-width: 85%;
    padding: 12px 16px;
    font-size: 0.88rem;
    font-weight: 300;
    line-height: 1.65;
  }

  .msg-ai {
    background: var(--cream);
    color: var(--brown);
    border-radius: 0 8px 8px 8px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    font-style: italic;
    align-self: flex-start;
  }

  .msg-user {
    background: var(--brown);
    color: var(--cream);
    border-radius: 8px 0 8px 8px;
    align-self: flex-end;
  }

  /* Ethics */
  .ethics-section {
    background: var(--brown);
    padding: 80px 40px;
    text-align: center;
  }

  .ethics-inner {
    max-width: 680px;
    margin: 0 auto;
  }

  .ethics-inner .section-label {
    color: var(--gold-light);
  }

  .ethics-inner .section-title {
    color: var(--cream);
    margin-bottom: 20px;
  }

  .ethics-inner p {
    color: rgba(245,239,230,0.7);
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.9;
  }

  /* Pricing */
  .pricing-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    margin-top: 20px;
  }

  .price-card {
    padding: 40px 36px;
    border: 1px solid rgba(196,145,122,0.25);
    background: var(--warm-white);
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .price-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(60,47,47,0.08);
  }

  .price-card.featured {
    background: var(--brown);
    border-color: var(--brown);
  }

  .price-label {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
  }

  .price-card.featured .price-label { color: var(--gold-light); }

  .price-amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.8rem;
    font-weight: 300;
    color: var(--brown);
    line-height: 1;
    margin-bottom: 8px;
  }

  .price-card.featured .price-amount { color: var(--cream); }

  .price-desc {
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--brown-mid);
    margin-bottom: 28px;
    line-height: 1.6;
  }

  .price-card.featured .price-desc { color: rgba(245,239,230,0.65); }

  .price-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 32px;
  }

  .price-features li {
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--brown-mid);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .price-card.featured .price-features li { color: rgba(245,239,230,0.8); }

  .price-features li::before {
    content: '✦';
    color: var(--gold);
    font-size: 0.6rem;
    flex-shrink: 0;
  }

  /* CTA */
  .cta-section {
    background: linear-gradient(160deg, var(--cream) 0%, #EDE0D4 100%);
    padding: 120px 40px;
    text-align: center;
  }

  .cta-section .section-title {
    margin: 0 auto 20px;
    max-width: 600px;
  }

  .cta-section p {
    font-size: 0.95rem;
    font-weight: 300;
    color: var(--brown-mid);
    line-height: 1.8;
    max-width: 480px;
    margin: 0 auto 40px;
  }

  /* Footer */
  .footer {
    background: #2A1F1F;
    padding: 60px 40px 40px;
  }

  .footer-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 60px;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba(245,239,230,0.1);
    margin-bottom: 32px;
  }

  .footer-brand h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    font-weight: 300;
    color: var(--cream);
    margin-bottom: 12px;
  }

  .footer-brand h3 em {
    font-style: italic;
    color: var(--gold);
  }

  .footer-brand p {
    font-size: 0.83rem;
    font-weight: 300;
    color: rgba(245,239,230,0.5);
    line-height: 1.8;
    max-width: 280px;
  }

  .footer-col h4 {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold-light);
    margin-bottom: 16px;
  }

  .footer-col a {
    display: block;
    font-size: 0.83rem;
    font-weight: 300;
    color: rgba(245,239,230,0.5);
    text-decoration: none;
    margin-bottom: 8px;
    transition: color 0.2s;
  }

  .footer-col a:hover { color: var(--cream); }

  .footer-bottom {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.78rem;
    font-weight: 300;
    color: rgba(245,239,230,0.3);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .hero-inner, .chat-inner, .footer-inner { grid-template-columns: 1fr; gap: 40px; }
    .steps-grid, .pricing-grid { grid-template-columns: 1fr; }
    .trust-bar { gap: 24px; }
  }
`;

const chatMessages = [
  { role: "ai", text: "What do you most want people to remember about them?" },
  { role: "user", text: "Her laugh. It was completely contagious — you couldn't help but smile." },
  { role: "ai", text: "That sounds like a gift she gave to everyone around her. Can you tell me about a moment when her laugh changed everything?" },
];

export default function Home() {
  const [visibleMsg, setVisibleMsg] = useState(0);

  useEffect(() => {
    if (visibleMsg < chatMessages.length - 1) {
      const t = setTimeout(() => setVisibleMsg(v => v + 1), 1800);
      return () => clearTimeout(t);
    }
  }, [visibleMsg]);

  return (
    <>
      <style>{styles}</style>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>Preserve the love.<br /><em>Keep the story alive.</em></h1>
            <p>
              Enduring Mementos uses gentle AI conversation to help you capture the memories,
              personality, and voice of someone you've lost — turning your words into a
              living memorial that honours who they truly were.
            </p>
            <div className="hero-buttons">
              <Link to="/interview" className="btn-primary">Begin a Memorial</Link>
              <a href="#how-it-works" className="btn-secondary">See How It Works</a>
            </div>
          </div>
          <div className="memorial-card">
            <div className="card-header">
              <h3>Margaret Rose Ellison</h3>
              <p>1941 – 2023 · Remembered by her daughter</p>
            </div>
            <div className="card-body">
              <p className="card-quote">
                "She had this way of making you feel like the most important person
                in the room — even in a crowd of hundreds."
              </p>
              <div className="card-meta">
                <span className="card-tag">32 Memories</span>
                <span className="card-tag">Family Stories</span>
                <span className="card-tag">Her Recipes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        {["Grounded in grief research", "No AI simulation of the deceased", "Your words, your story", "Private & secure"].map(t => (
          <div className="trust-item" key={t}><span>✦</span>{t}</div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <div id="how-it-works" style={{ background: 'var(--warm-white)' }}>
        <div className="section">
          <p className="section-label">The Process</p>
          <h2 className="section-title">Three steps to a<br /><em>lasting memorial</em></h2>
          <p className="section-sub">
            Our guided interview gently draws out the stories, moments, and details that make
            your loved one irreplaceable.
          </p>
          <div className="steps-grid">
            {[
              { n: "01", title: "Begin the Conversation", desc: "Answer thoughtful, guided questions about your loved one — their personality, passions, quirks, and the moments that defined them." },
              { n: "02", title: "Share Your Memories", desc: "Our AI listens carefully and asks follow-up questions that help you go deeper, uncovering stories you might not have thought to tell." },
              { n: "03", title: "Receive Your Memorial", desc: "Your words are woven into a beautiful, shareable memorial — a lasting tribute you can revisit and share with family for generations." },
            ].map(s => (
              <div className="step" key={s.n}>
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHAT DEMO */}
      <section className="chat-section">
        <div className="chat-inner">
          <div>
            <p className="section-label">The Experience</p>
            <h2 className="section-title">A gentle conversation,<br /><em>not a form</em></h2>
            <p className="section-sub" style={{ marginBottom: 0 }}>
              Unlike cold questionnaires, our interview feels like talking to a thoughtful friend —
              one who knows exactly what to ask to help your memories come alive.
              <br /><br />
              You are always the author. Our AI guides, never invents.
            </p>
          </div>
          <div className="chat-window">
            <div className="chat-top">✦ Memorial Interview in Progress</div>
            <div className="chat-messages">
              {chatMessages.slice(0, visibleMsg + 1).map((m, i) => (
                <div key={i} className={`msg msg-${m.role}`} style={{ animation: 'fadeUp 0.5s ease both' }}>
                  {m.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ETHICS */}
      <section className="ethics-section">
        <div className="ethics-inner">
          <p className="section-label">Our Commitment</p>
          <h2 className="section-title">Built on <em>ethical</em> ground</h2>
          <p>
            We believe technology should support grief, not exploit it. Enduring Mementos
            will never simulate your loved one's voice or generate content they didn't
            actually say. Every word in your memorial comes from you — we simply help
            you find them.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <div style={{ background: 'var(--warm-white)' }}>
        <div className="section">
          <p className="section-label">Simple Pricing</p>
          <h2 className="section-title">Start for free,<br /><em>preserve forever</em></h2>
          <div className="pricing-grid">
            <div className="price-card">
              <p className="price-label">Free</p>
              <div className="price-amount">$0</div>
              <p className="price-desc">Create one memorial and preserve it for life.</p>
              <ul className="price-features">
                <li>One full memorial interview</li>
                <li>Shareable memorial page</li>
                <li>Photo upload (up to 10)</li>
                <li>PDF export</li>
              </ul>
              <Link to="/interview" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>Get Started Free</Link>
            </div>
            <div className="price-card featured">
              <p className="price-label">Premium — Coming Soon</p>
              <div className="price-amount">$9<span style={{ fontSize: '1rem' }}>/mo</span></div>
              <p className="price-desc">For families who want to preserve more.</p>
              <ul className="price-features">
                <li>Unlimited memorials</li>
                <li>Unlimited photos & media</li>
                <li>Audio memory recordings</li>
                <li>Family collaboration</li>
                <li>Priority support</li>
              </ul>
              <button className="btn-secondary" style={{ width: '100%', color: 'var(--cream)', borderColor: 'rgba(245,239,230,0.3)' }}>
                Join the Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="cta-section">
        <p className="section-label">Begin Today</p>
        <h2 className="section-title">Their story deserves<br /><em>to be told</em></h2>
        <p>
          Take 20 minutes to answer a few gentle questions.
          We'll help you create something that lasts forever.
        </p>
        <Link to="/interview" className="btn-primary">Begin a Memorial — It's Free</Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>Enduring <em>Mementos</em></h3>
            <p>Helping families preserve the stories, memories, and love of those who shaped their lives.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#how-it-works">How It Works</a>
            <Link to="/interview" style={{ display: 'block', fontSize: '0.83rem', fontWeight: 300, color: 'rgba(245,239,230,0.5)', textDecoration: 'none', marginBottom: '8px' }}>Begin a Memorial</Link>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <a href="#">Our Ethics</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Enduring Mementos — Love That Endures</span>
          <span>Made with care in Ontario, Canada 🍁</span>
        </div>
      </footer>
    </>
  );
}