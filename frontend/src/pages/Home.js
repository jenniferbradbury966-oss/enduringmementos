import { useState, useEffect, useRef } from "react";
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

  html { scroll-behavior: smooth; }

  body {
    background-color: var(--warm-white);
    font-family: 'Jost', sans-serif;
    color: var(--brown);
  }

  /* ─── HERO ─── */
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
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(196,145,122,0.18) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    animation: driftA 18s ease-in-out infinite;
  }

  .hero::after {
    content: '';
    position: absolute;
    bottom: -100px; left: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(138,158,140,0.14) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    animation: driftB 22s ease-in-out infinite;
  }

  @keyframes driftA {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-30px, 20px) scale(1.05); }
  }
  @keyframes driftB {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, -30px) scale(1.08); }
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

  /* ─── BUTTONS ─── */
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
    transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
  }

  .btn-primary:hover {
    background: var(--brown-mid);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(60,47,47,0.2);
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
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(60,47,47,0.15);
  }

  /* ─── MEMORIAL CARD (hero) ─── */
  .memorial-card {
    background: white;
    border-radius: 4px;
    box-shadow: 0 24px 64px rgba(60,47,47,0.14), 0 4px 16px rgba(60,47,47,0.06);
    overflow: hidden;
    animation: fadeUp 0.9s 0.2s ease both;
    transition: transform 0.4s, box-shadow 0.4s;
  }

  .memorial-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 32px 80px rgba(60,47,47,0.18), 0 8px 24px rgba(60,47,47,0.08);
  }

  .card-header {
    background: linear-gradient(135deg, var(--brown) 0%, var(--brown-mid) 100%);
    padding: 28px 32px;
    color: white;
    position: relative;
    overflow: hidden;
  }

  .card-header::after {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 120px; height: 120px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
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

  .card-body { padding: 28px 32px; }

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

  .card-meta { display: flex; gap: 10px; flex-wrap: wrap; }

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

  /* ─── TRUST BAR ─── */
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
    font-size: 0.73rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: 0;
    animation: fadeIn 0.6s ease forwards;
  }

  .trust-item:nth-child(1) { animation-delay: 0.1s; }
  .trust-item:nth-child(2) { animation-delay: 0.25s; }
  .trust-item:nth-child(3) { animation-delay: 0.4s; }
  .trust-item:nth-child(4) { animation-delay: 0.55s; }

  .trust-item span { opacity: 0.45; font-size: 0.9rem; }

  /* ─── SECTIONS ─── */
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

  /* ─── STEPS ─── */
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  .step {
    position: relative;
    padding: 36px 32px;
    background: var(--warm-white);
    border: 1px solid rgba(196,145,122,0.2);
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
    opacity: 0;
    transform: translateY(20px);
  }

  .step.visible {
    animation: fadeUp 0.7s ease forwards;
  }

  .step:nth-child(2).visible { animation-delay: 0.12s; }
  .step:nth-child(3).visible { animation-delay: 0.24s; }

  .step:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 48px rgba(60,47,47,0.1);
    border-color: rgba(196,145,122,0.4);
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

  /* ─── CHAT DEMO ─── */
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
    padding: 14px 20px;
    border-bottom: 1px solid rgba(196,145,122,0.2);
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--brown-mid);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .chat-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--dusty-rose);
    animation: pulse 2s ease-in-out infinite;
  }

  .chat-messages {
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-height: 260px;
  }

  .msg {
    max-width: 85%;
    padding: 12px 16px;
    font-size: 0.88rem;
    font-weight: 300;
    line-height: 1.65;
    animation: fadeUp 0.4s ease both;
  }

  .msg-ai {
    background: var(--cream);
    color: var(--brown);
    border-radius: 0 8px 8px 8px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    font-style: italic;
    align-self: flex-start;
    border-left: 2px solid var(--gold-light);
  }

  .msg-user {
    background: var(--brown);
    color: var(--cream);
    border-radius: 8px 0 8px 8px;
    align-self: flex-end;
  }

  .typing-indicator {
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 12px 16px;
    background: var(--cream);
    border-radius: 0 8px 8px 8px;
    align-self: flex-start;
    width: fit-content;
    animation: fadeUp 0.3s ease both;
  }

  .typing-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--brown-mid);
    opacity: 0.5;
    animation: typingBounce 1.2s ease-in-out infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
    30% { transform: translateY(-6px); opacity: 1; }
  }

  /* ─── ETHICS ─── */
  .ethics-section {
    background: var(--brown);
    padding: 100px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .ethics-section::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(168,147,90,0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .ethics-inner {
    max-width: 680px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .ethics-inner .section-label { color: var(--gold-light); }
  .ethics-inner .section-title { color: var(--cream); margin-bottom: 20px; }
  .ethics-inner .section-title em { color: var(--gold-light); }

  .ethics-inner p {
    color: rgba(245,239,230,0.72);
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.9;
  }

  .ethics-pillars {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-top: 48px;
    flex-wrap: wrap;
  }

  .ethics-pillar {
    text-align: center;
  }

  .ethics-pillar-icon {
    font-size: 1.4rem;
    margin-bottom: 8px;
    display: block;
  }

  .ethics-pillar-label {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold-light);
    opacity: 0.8;
  }

  /* ─── PRICING ─── */
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
    opacity: 0;
    transform: translateY(20px);
  }

  .price-card.visible {
    animation: fadeUp 0.7s ease forwards;
  }

  .price-card.featured.visible { animation-delay: 0.15s; }

  .price-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 48px rgba(60,47,47,0.1);
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
    gap: 10px;
  }

  .price-card.featured .price-features li { color: rgba(245,239,230,0.8); }

  .price-features li::before {
    content: '✦';
    color: var(--gold);
    font-size: 0.55rem;
    flex-shrink: 0;
  }

  /* ─── TESTIMONIAL ─── */
  .testimonial-band {
    background: linear-gradient(135deg, var(--cream) 0%, #EDE0D4 100%);
    padding: 80px 40px;
    text-align: center;
  }

  .testimonial-inner {
    max-width: 680px;
    margin: 0 auto;
  }

  .testimonial-quote {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.4rem, 2.5vw, 1.9rem);
    font-weight: 300;
    font-style: italic;
    color: var(--brown);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .testimonial-attr {
    font-size: 0.78rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--brown-mid);
    opacity: 0.7;
  }

  .testimonial-divider {
    width: 40px;
    height: 1px;
    background: var(--gold-light);
    margin: 0 auto 24px;
  }

  /* ─── CTA ─── */
  .cta-section {
    background: linear-gradient(160deg, var(--cream) 0%, #EDE0D4 100%);
    padding: 120px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .cta-section::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(196,145,122,0.12) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .cta-section .section-title {
    margin: 0 auto 20px;
    max-width: 600px;
    position: relative;
    z-index: 1;
  }

  .cta-section p {
    font-size: 0.95rem;
    font-weight: 300;
    color: var(--brown-mid);
    line-height: 1.8;
    max-width: 480px;
    margin: 0 auto 40px;
    position: relative;
    z-index: 1;
  }

  .cta-section .btn-primary {
    position: relative;
    z-index: 1;
  }

  /* ─── FOOTER ─── */
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
    border-bottom: 1px solid rgba(245,239,230,0.08);
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
    color: rgba(245,239,230,0.45);
    line-height: 1.8;
    max-width: 280px;
    margin-bottom: 20px;
  }

  .footer-tagline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem;
    font-style: italic;
    color: var(--gold-light);
    opacity: 0.6;
  }

  .footer-col h4 {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold-light);
    margin-bottom: 16px;
    opacity: 0.8;
  }

  .footer-col a {
    display: block;
    font-size: 0.83rem;
    font-weight: 300;
    color: rgba(245,239,230,0.45);
    text-decoration: none;
    margin-bottom: 10px;
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
    color: rgba(245,239,230,0.25);
    flex-wrap: wrap;
    gap: 8px;
  }

  /* ─── ANIMATIONS ─── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 900px) {
    .hero-inner, .chat-inner { grid-template-columns: 1fr; gap: 48px; }
    .steps-grid { grid-template-columns: 1fr; gap: 24px; }
    .pricing-grid { grid-template-columns: 1fr; }
    .footer-inner { grid-template-columns: 1fr; gap: 36px; }
  }

  @media (max-width: 600px) {
    .hero { padding: 140px 40px 80px; }
    .section { padding: 72px 24px; }
    .trust-bar { gap: 20px; padding: 16px 24px; }
    .chat-section, .ethics-section, .cta-section, .testimonial-band { padding: 72px 24px; }
    .footer { padding: 48px 24px 32px; }
    .hero-buttons { flex-direction: column; }
    .hero-buttons a, .hero-buttons button { text-align: center; }
    .trust-item { font-size: 0.65rem; }
  }
`;

const chatMessages = [
  { role: "ai",   text: "What do you most want people to remember about them?" },
  { role: "user", text: "Her laugh. It was completely contagious — you couldn't help but smile." },
  { role: "ai",   text: "That sounds like a gift she gave to everyone around her. Can you tell me about a moment when her laugh changed everything?" },
  { role: "user", text: "At my wedding. My nerves vanished the moment I heard her laughing in the front row." },
];

// Scroll-triggered visibility hook
function useIntersection(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return visible;
}

export default function Home() {
  const [visibleMsg, setVisibleMsg] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const stepsRef   = useRef(null);
  const pricingRef = useRef(null);
  const stepsVis   = useIntersection(stepsRef);
  const pricingVis = useIntersection(pricingRef);

  // Chat animation — cycles through messages then replays
  useEffect(() => {
    if (visibleMsg < chatMessages.length - 1) {
      const nextRole = chatMessages[visibleMsg + 1].role;
      // Show typing indicator before AI messages
      if (nextRole === "ai") {
        const tShow = setTimeout(() => setShowTyping(true), 900);
        const tHide = setTimeout(() => {
          setShowTyping(false);
          setVisibleMsg(v => v + 1);
        }, 2200);
        return () => { clearTimeout(tShow); clearTimeout(tHide); };
      } else {
        const t = setTimeout(() => setVisibleMsg(v => v + 1), 1400);
        return () => clearTimeout(t);
      }
    } else {
      // Replay after pause
      const t = setTimeout(() => setVisibleMsg(0), 4000);
      return () => clearTimeout(t);
    }
  }, [visibleMsg]);

  return (
    <>
      <style>{styles}</style>

      {/* ── HERO ── */}
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

      {/* ── TRUST BAR ── */}
      <div className="trust-bar">
        {["Grounded in grief research", "No AI simulation of the deceased", "Your words, your story", "Private & secure"].map(t => (
          <div className="trust-item" key={t}><span>✦</span>{t}</div>
        ))}
      </div>

      {/* ── HOW IT WORKS ── */}
      <div id="how-it-works" style={{ background: 'var(--warm-white)' }}>
        <div className="section">
          <p className="section-label">The Process</p>
          <h2 className="section-title">Three steps to a<br /><em>lasting memorial</em></h2>
          <p className="section-sub">
            Our guided interview gently draws out the stories, moments, and details that make
            your loved one irreplaceable — at whatever pace feels right for you.
          </p>
          <div className="steps-grid" ref={stepsRef}>
            {[
              { n: "01", title: "Begin the Conversation", desc: "Answer thoughtful, guided questions about your loved one — their personality, passions, quirks, and the moments that defined them." },
              { n: "02", title: "Share Your Memories",    desc: "Our AI listens carefully and asks follow-up questions that help you go deeper, uncovering stories you might not have thought to tell." },
              { n: "03", title: "Receive Your Memorial",  desc: "Your words are woven into a beautiful, shareable memorial — a lasting tribute you can revisit and share with family for generations." },
            ].map((s, i) => (
              <div className={`step${stepsVis ? ' visible' : ''}`} key={s.n}
                   style={stepsVis ? { animationDelay: `${i * 0.12}s` } : {}}>
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CHAT DEMO ── */}
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
            <div className="chat-top">
              <span className="chat-dot" />
              Memorial Interview in Progress
            </div>
            <div className="chat-messages">
              {chatMessages.slice(0, visibleMsg + 1).map((m, i) => (
                <div key={`${i}-${visibleMsg}`} className={`msg msg-${m.role}`}>
                  {m.text}
                </div>
              ))}
              {showTyping && (
                <div className="typing-indicator">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── ETHICS ── */}
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
          <div className="ethics-pillars">
            {[
              { icon: "🤍", label: "No AI resurrection" },
              { icon: "🔒", label: "Private & secure" },
              { icon: "📖", label: "Grief-informed" },
              { icon: "✦",  label: "Your words only" },
            ].map(p => (
              <div className="ethics-pillar" key={p.label}>
                <span className="ethics-pillar-icon">{p.icon}</span>
                <span className="ethics-pillar-label">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <div className="testimonial-band">
        <div className="testimonial-inner">
          <div className="testimonial-divider" />
          <p className="testimonial-quote">
            "I didn't expect to cry, but I also didn't expect to laugh. This helped me
            remember her the way she actually was — not just how I missed her."
          </p>
          <p className="testimonial-attr">— Early user, remembering her grandmother</p>
        </div>
      </div>

      {/* ── PRICING ── */}
      <div id="pricing" style={{ background: 'var(--warm-white)' }}>
        <div className="section">
          <p className="section-label">Simple Pricing</p>
          <h2 className="section-title">Start for free,<br /><em>preserve forever</em></h2>
          <div className="pricing-grid" ref={pricingRef}>
            <div className={`price-card${pricingVis ? ' visible' : ''}`}>
              <p className="price-label">Free</p>
              <div className="price-amount">$0</div>
              <p className="price-desc">Create one memorial and preserve it for life.</p>
              <ul className="price-features">
                <li>One full memorial interview</li>
                <li>Shareable memorial page</li>
                <li>Photo upload (up to 10)</li>
                <li>PDF export</li>
              </ul>
              <Link to="/interview" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                Get Started Free
              </Link>
            </div>
            <div className={`price-card featured${pricingVis ? ' visible' : ''}`}>
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
              <button className="btn-secondary"
                style={{ width: '100%', color: 'var(--cream)', borderColor: 'rgba(245,239,230,0.3)' }}>
                Join the Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="cta-section">
        <p className="section-label">Begin Today</p>
        <h2 className="section-title">Their story deserves<br /><em>to be told</em></h2>
        <p>
          Take 20 minutes to answer a few gentle questions.
          We'll help you create something that lasts forever.
        </p>
        <Link to="/interview" className="btn-primary">
          Begin a Memorial — It's Free
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>Enduring <em>Mementos</em></h3>
            <p>Helping families preserve the stories, memories, and love of those who shaped their lives.</p>
            <span className="footer-tagline">Love That Endures.</span>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#how-it-works">How It Works</a>
            <Link to="/interview"
              style={{ display:'block', fontSize:'0.83rem', fontWeight:300,
                       color:'rgba(245,239,230,0.45)', textDecoration:'none', marginBottom:'10px',
                       transition:'color 0.2s' }}
              onMouseEnter={e => e.target.style.color='var(--cream)'}
              onMouseLeave={e => e.target.style.color='rgba(245,239,230,0.45)'}>
              Begin a Memorial
            </Link>
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
