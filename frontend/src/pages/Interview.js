import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --cream: #F5EFE6;
    --warm-white: #FBF8F4;
    --dusty-rose: #C4917A;
    --rose-light: #E8C4B4;
    --sage: #8A9E8C;
    --brown: #3C2F2F;
    --brown-mid: #6B4F4F;
    --gold: #A8935A;
    --gold-light: #D4B896;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .interview-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #F5EFE6 0%, #EDE0D4 100%);
    font-family: 'Jost', sans-serif;
    color: var(--brown);
    display: flex;
    flex-direction: column;
  }

  /* ── SETUP SCREEN ── */
  .setup-screen {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
    animation: fadeUp 0.7s ease both;
  }

  .setup-card {
    background: white;
    max-width: 560px;
    width: 100%;
    padding: 56px 52px;
    box-shadow: 0 24px 64px rgba(60,47,47,0.1);
  }

  .setup-label {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
  }

  .setup-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem;
    font-weight: 300;
    line-height: 1.2;
    color: var(--brown);
    margin-bottom: 12px;
  }

  .setup-title em {
    font-style: italic;
    color: var(--dusty-rose);
  }

  .setup-desc {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--brown-mid);
    line-height: 1.8;
    margin-bottom: 36px;
  }

  .setup-field {
    margin-bottom: 20px;
  }

  .setup-field label {
    display: block;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--brown-mid);
    margin-bottom: 8px;
  }

  .setup-field input, .setup-field select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid rgba(107,79,79,0.2);
    background: var(--warm-white);
    font-family: 'Jost', sans-serif;
    font-size: 0.92rem;
    font-weight: 300;
    color: var(--brown);
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
  }

  .setup-field input:focus, .setup-field select:focus {
    border-color: var(--dusty-rose);
  }

  .setup-field input::placeholder {
    color: rgba(107,79,79,0.4);
  }

  .btn-start {
    width: 100%;
    padding: 16px;
    background: var(--brown);
    color: var(--cream);
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.3s, transform 0.2s;
  }

  .btn-start:hover:not(:disabled) {
    background: var(--brown-mid);
    transform: translateY(-1px);
  }

  .btn-start:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ── INTERVIEW SCREEN ── */
  .interview-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 780px;
    width: 100%;
    margin: 0 auto;
    padding: 32px 24px 24px;
    animation: fadeUp 0.6s ease both;
  }

  .interview-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .interview-header .for-label {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 4px;
  }

  .interview-header h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 300;
    color: var(--brown);
  }

  .interview-header h2 em {
    font-style: italic;
    color: var(--dusty-rose);
  }

  .progress-bar {
    width: 100%;
    height: 2px;
    background: rgba(196,145,122,0.2);
    margin-bottom: 32px;
    border-radius: 1px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--dusty-rose), var(--gold));
    border-radius: 1px;
    transition: width 0.6s ease;
  }

  /* Messages */
  .messages-area {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 24px;
    min-height: 340px;
    max-height: 460px;
    scroll-behavior: smooth;
  }

  .messages-area::-webkit-scrollbar { width: 4px; }
  .messages-area::-webkit-scrollbar-track { background: transparent; }
  .messages-area::-webkit-scrollbar-thumb { background: var(--rose-light); border-radius: 2px; }

  .msg-row {
    display: flex;
    gap: 12px;
    animation: fadeUp 0.4s ease both;
  }

  .msg-row.user {
    flex-direction: row-reverse;
  }

  .msg-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .msg-avatar.ai {
    background: var(--brown);
    color: var(--gold-light);
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    font-style: italic;
  }

  .msg-avatar.user-av {
    background: var(--sage);
    color: white;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .msg-bubble {
    max-width: 78%;
    padding: 16px 20px;
    line-height: 1.75;
    font-size: 0.92rem;
    font-weight: 300;
  }

  .msg-bubble.ai {
    background: white;
    color: var(--brown);
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
    font-style: italic;
    box-shadow: 0 2px 12px rgba(60,47,47,0.06);
    border-left: 2px solid var(--rose-light);
  }

  .msg-bubble.user {
    background: var(--brown);
    color: var(--cream);
    font-style: normal;
    font-family: 'Jost', sans-serif;
  }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 16px 20px;
    background: white;
    box-shadow: 0 2px 12px rgba(60,47,47,0.06);
    width: fit-content;
    border-left: 2px solid var(--rose-light);
  }

  .typing-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--dusty-rose);
    animation: typingBounce 1.2s infinite ease-in-out;
  }

  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  /* Input area */
  .input-area {
    border-top: 1px solid rgba(196,145,122,0.2);
    padding-top: 20px;
    margin-top: 8px;
  }

  .input-row {
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }

  .input-box {
    flex: 1;
    padding: 14px 18px;
    border: 1px solid rgba(107,79,79,0.2);
    background: white;
    font-family: 'Jost', sans-serif;
    font-size: 0.92rem;
    font-weight: 300;
    color: var(--brown);
    outline: none;
    resize: none;
    min-height: 52px;
    max-height: 120px;
    line-height: 1.6;
    transition: border-color 0.2s;
  }

  .input-box:focus {
    border-color: var(--dusty-rose);
  }

  .input-box::placeholder {
    color: rgba(107,79,79,0.35);
  }

  .send-btn {
    width: 52px;
    height: 52px;
    background: var(--brown);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s, transform 0.15s;
    color: var(--cream);
    font-size: 1.1rem;
  }

  .send-btn:hover:not(:disabled) {
    background: var(--brown-mid);
    transform: translateY(-1px);
  }

  .send-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .input-hint {
    font-size: 0.72rem;
    font-weight: 300;
    color: rgba(107,79,79,0.45);
    margin-top: 8px;
    text-align: center;
    letter-spacing: 0.04em;
  }

  /* Complete screen */
  .complete-screen {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
    animation: fadeUp 0.7s ease both;
  }

  .complete-card {
    background: white;
    max-width: 560px;
    width: 100%;
    padding: 56px 52px;
    box-shadow: 0 24px 64px rgba(60,47,47,0.1);
    text-align: center;
  }

  .complete-icon {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  .complete-card h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    font-weight: 300;
    color: var(--brown);
    margin-bottom: 16px;
    line-height: 1.2;
  }

  .complete-card h2 em {
    font-style: italic;
    color: var(--dusty-rose);
  }

  .complete-card p {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--brown-mid);
    line-height: 1.8;
    margin-bottom: 32px;
  }

  .complete-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .btn-view {
    padding: 14px 32px;
    background: var(--brown);
    color: var(--cream);
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.3s;
    text-decoration: none;
    display: block;
  }

  .btn-view:hover { background: var(--brown-mid); }

  .btn-new {
    padding: 14px 32px;
    background: transparent;
    color: var(--brown);
    border: 1.5px solid rgba(107,79,79,0.3);
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-new:hover {
    background: var(--brown);
    color: var(--cream);
  }

  /* Error */
  .error-banner {
    background: #FEE;
    border: 1px solid #F5C6CB;
    color: #721c24;
    padding: 12px 16px;
    font-size: 0.83rem;
    font-weight: 300;
    margin-bottom: 16px;
    border-radius: 2px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-6px); }
  }

  @media (max-width: 600px) {
    .setup-card, .complete-card { padding: 36px 28px; }
    .interview-screen { padding: 20px 16px 16px; }
  }
`;

const FLASK_URL = process.env.REACT_APP_API_URL || "";
const QUESTION_COUNT_TARGET = 9;

export default function Interview() {
  const [screen, setScreen] = useState("setup"); // setup | interview | complete
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const autoResize = (e) => {
    e.target.style.height = "52px";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const callClaude = async (conversationMessages) => {
    const response = await fetch(`${FLASK_URL}/api/interview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationMessages }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `API error ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  };

  const startInterview = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    setScreen("interview");

    const firstUserMsg = {
      role: "user",
      content: `I'd like to create a memorial for ${name.trim()}. My relationship to them: ${relationship || "loved one"}.`,
    };

    try {
      const reply = await callClaude([firstUserMsg]);
      setMessages([
        { role: "user", content: firstUserMsg.content, hidden: true },
        { role: "assistant", content: reply },
      ]);
      setQuestionCount(1);
    } catch (e) {
      setError("Couldn't connect to the interview service. Please try again.");
      setScreen("setup");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "52px";

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    setError(null);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const reply = await callClaude(apiMessages);
      const updatedMessages = [...newMessages, { role: "assistant", content: reply }];
      setMessages(updatedMessages);
      const newCount = questionCount + 1;
      setQuestionCount(newCount);
      if (newCount >= QUESTION_COUNT_TARGET) {
        setTimeout(() => setScreen("complete"), 1200);
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
      setMessages(newMessages.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetInterview = () => {
    setScreen("setup");
    setName("");
    setRelationship("");
    setMessages([]);
    setInput("");
    setQuestionCount(0);
    setError(null);
  };

  const progress = Math.min((questionCount / QUESTION_COUNT_TARGET) * 100, 100);
  const visibleMessages = messages.filter(m => !m.hidden);

  return (
    <>
      <style>{styles}</style>
      <div className="interview-page">

        {/* ── SETUP ── */}
        {screen === "setup" && (
          <div className="setup-screen">
            <div className="setup-card">
              <p className="setup-label">Begin Your Memorial</p>
              <h1 className="setup-title">Tell us about<br /><em>who you loved</em></h1>
              <p className="setup-desc">
                We'll guide you through a gentle conversation to capture their story.
                This takes about 10–15 minutes and you can save your progress at any time.
              </p>

              {error && <div className="error-banner">{error}</div>}

              <div className="setup-field">
                <label>Their Name</label>
                <input
                  type="text"
                  placeholder="e.g. Margaret Rose Ellison"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && name.trim() && startInterview()}
                />
              </div>

              <div className="setup-field">
                <label>Your Relationship to Them</label>
                <select value={relationship} onChange={e => setRelationship(e.target.value)}>
                  <option value="">Select a relationship…</option>
                  <option value="daughter">Daughter</option>
                  <option value="son">Son</option>
                  <option value="spouse or partner">Spouse or Partner</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="grandchild">Grandchild</option>
                  <option value="grandparent">Grandparent</option>
                  <option value="close friend">Close Friend</option>
                  <option value="other loved one">Other Loved One</option>
                </select>
              </div>

              <button
                className="btn-start"
                onClick={startInterview}
                disabled={!name.trim() || loading}
              >
                {loading ? "Starting your interview…" : "Begin the Conversation →"}
              </button>
            </div>
          </div>
        )}

        {/* ── INTERVIEW ── */}
        {screen === "interview" && (
          <div className="interview-screen">
            <div className="interview-header">
              <p className="for-label">A Memorial for</p>
              <h2><em>{name}</em></h2>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {error && <div className="error-banner">{error}</div>}

            <div className="messages-area">
              {visibleMessages.map((m, i) => (
                <div key={i} className={`msg-row ${m.role === "user" ? "user" : ""}`}>
                  <div className={`msg-avatar ${m.role === "user" ? "user-av" : "ai"}`}>
                    {m.role === "user" ? "You" : "✦"}
                  </div>
                  <div className={`msg-bubble ${m.role === "user" ? "user" : "ai"}`}>
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="msg-row">
                  <div className="msg-avatar ai">✦</div>
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
              <div className="input-row">
                <textarea
                  ref={textareaRef}
                  className="input-box"
                  placeholder="Share a memory, a feeling, a story…"
                  value={input}
                  onChange={e => { setInput(e.target.value); autoResize(e); }}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || loading}>
                  ➤
                </button>
              </div>
              <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
            </div>
          </div>
        )}

        {/* ── COMPLETE ── */}
        {screen === "complete" && (
          <div className="complete-screen">
            <div className="complete-card">
              <div className="complete-icon">🕊️</div>
              <h2>Your memorial for<br /><em>{name}</em> is ready</h2>
              <p>
                Thank you for sharing these precious memories. We've captured a beautiful
                portrait of {name} from your words — a tribute that honours who they truly were.
              </p>
              <div className="complete-actions">
                <button className="btn-view">View Your Memorial</button>
                <button className="btn-new" onClick={resetInterview}>Begin Another Memorial</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}