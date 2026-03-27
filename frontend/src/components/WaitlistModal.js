import { useState } from "react";

const modalStyles = `
  .waitlist-overlay {
    position: fixed; inset: 0;
    background: rgba(26,26,26,0.55);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 500; padding: 24px;
    animation: wlFadeIn 0.2s ease both;
  }

  .waitlist-card {
    background: white; max-width: 460px; width: 100%;
    padding: 48px 44px;
    box-shadow: 0 32px 80px rgba(60,47,47,0.18);
    animation: wlFadeUp 0.25s ease both;
    position: relative;
  }

  .waitlist-close {
    position: absolute; top: 16px; right: 18px;
    background: none; border: none; cursor: pointer;
    font-size: 1.3rem; color: rgba(26,26,26,0.3);
    line-height: 1; padding: 4px; transition: color 0.2s;
  }
  .waitlist-close:hover { color: rgba(26,26,26,0.7); }

  .waitlist-label {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em;
    text-transform: uppercase; color: #8B6914; margin-bottom: 10px;
  }

  .waitlist-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem; font-weight: 300;
    color: #1a1a1a; line-height: 1.2; margin-bottom: 12px;
  }
  .waitlist-title em { font-style: italic; color: #C4917A; }

  .waitlist-desc {
    font-size: 0.87rem; color: #555; line-height: 1.8;
    margin-bottom: 24px; font-weight: 400;
  }

  .waitlist-features {
    list-style: none; display: flex; flex-direction: column;
    gap: 8px; margin-bottom: 28px;
    padding: 16px 18px;
    background: rgba(245,239,230,0.7);
    border-left: 2px solid #E8C4B4;
  }

  .waitlist-features li {
    font-size: 0.84rem; color: #2c2c2c;
    display: flex; align-items: center; gap: 10px;
  }

  .waitlist-features li::before {
    content: '✦'; color: #8B6914;
    font-size: 0.5rem; flex-shrink: 0;
  }

  .waitlist-field { margin-bottom: 14px; }

  .waitlist-field label {
    display: block; font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: #1a1a1a; margin-bottom: 6px;
  }

  .waitlist-field input {
    width: 100%; padding: 11px 14px;
    border: 1px solid rgba(107,79,79,0.25);
    background: #FBF8F4;
    font-family: 'Jost', sans-serif; font-size: 0.91rem;
    color: #1a1a1a; outline: none; transition: border-color 0.2s;
  }

  .waitlist-field input:focus { border-color: #C4917A; }
  .waitlist-field input::placeholder { color: rgba(60,47,47,0.38); }

  .waitlist-submit {
    width: 100%; padding: 14px;
    background: #1a1a1a; color: #F5EFE6;
    border: none; font-family: 'Jost', sans-serif;
    font-size: 0.78rem; font-weight: 500;
    letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer; transition: background 0.3s, transform 0.2s;
    margin-top: 4px;
  }

  .waitlist-submit:hover:not(:disabled) { background: #2c2c2c; transform: translateY(-1px); }
  .waitlist-submit:disabled { opacity: 0.45; cursor: not-allowed; }

  .waitlist-success {
    text-align: center; padding: 20px 0 8px;
    animation: wlFadeUp 0.4s ease both;
  }

  .waitlist-success-icon { font-size: 2.2rem; margin-bottom: 14px; }

  .waitlist-success h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 300;
    color: #1a1a1a; margin-bottom: 10px;
  }
  .waitlist-success h3 em { font-style: italic; color: #C4917A; }

  .waitlist-success p { font-size: 0.87rem; color: #555; line-height: 1.75; }

  .waitlist-note {
    font-size: 0.72rem; color: rgba(26,26,26,0.38);
    text-align: center; margin-top: 14px; font-style: italic;
  }

  @keyframes wlFadeIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes wlFadeUp  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 520px) {
    .waitlist-card { padding: 32px 24px; }
  }
`;

export default function WaitlistModal({ isOpen, onClose }) {
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;

    const subject = encodeURIComponent("Enduring Mementos — Premium Waitlist");
    const body    = encodeURIComponent(
      `New waitlist signup:\n\nName: ${name.trim()}\nEmail: ${email.trim()}\n\nAdded: ${new Date().toLocaleString()}`
    );

    window.open(
      `mailto:enduringmementos@gmail.com?subject=${subject}&body=${body}`,
      "_blank"
    );

    setSubmitted(true);
  };

  const handleClose = () => {
    setName(""); setEmail(""); setSubmitted(false);
    onClose();
  };

  return (
    <>
      <style>{modalStyles}</style>
      <div className="waitlist-overlay" onClick={handleClose}>
        <div className="waitlist-card" onClick={e => e.stopPropagation()}>
          <button className="waitlist-close" onClick={handleClose} aria-label="Close">×</button>

          {!submitted ? (
            <>
              <p className="waitlist-label">Coming Soon</p>
              <h2 className="waitlist-title">Join the<br /><em>Premium Waitlist</em></h2>
              <p className="waitlist-desc">
                Be the first to know when Premium launches. Early members receive a
                special founding rate.
              </p>

              <ul className="waitlist-features">
                <li>Unlimited memorials</li>
                <li>Unlimited photos &amp; media</li>
                <li>Audio memory recordings</li>
                <li>Family collaboration</li>
                <li>Priority support</li>
              </ul>

              <div className="waitlist-field">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Ellison"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="waitlist-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. sarah@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
              </div>

              <button
                className="waitlist-submit"
                onClick={handleSubmit}
                disabled={!name.trim() || !email.trim()}
              >
                Reserve My Spot →
              </button>

              <p className="waitlist-note">
                No spam, ever. We'll only reach out when Premium is ready.
              </p>
            </>
          ) : (
            <div className="waitlist-success">
              <div className="waitlist-success-icon">🕊️</div>
              <h3>You're on the<br /><em>list</em></h3>
              <p>
                Thank you, {name.split(" ")[0]}. We'll be in touch at {email} when
                Premium launches. We're grateful you're here.
              </p>
              <p className="waitlist-note" style={{ marginTop: 20 }}>
                You can close this window.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
