import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --cream: #F5EFE6;
    --warm-white: #FBF8F4;
    --dusty-rose: #C4917A;
    --rose-light: #E8C4B4;
    --sage: #8A9E8C;
    --brown: #1a1a1a;
    --brown-mid: #2c2c2c;
    --gold: #8B6914;
    --gold-light: #D4B896;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .memorial-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #F5EFE6 0%, #EDE0D4 100%);
    font-family: 'Jost', sans-serif;
    color: var(--brown);
  }

  /* ── LOADING ── */
  .memorial-loading {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    animation: fadeUp 0.6s ease both;
  }

  .loading-icon {
    font-size: 2.5rem;
    animation: pulse 2s infinite ease-in-out;
  }

  .loading-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 300;
    color: var(--brown);
    text-align: center;
  }

  .loading-title em {
    font-style: italic;
    color: var(--dusty-rose);
  }

  .loading-desc {
    font-size: 0.88rem;
    font-weight: 400;
    color: #555;
    text-align: center;
  }

  .loading-dots {
    display: flex;
    gap: 6px;
  }

  .loading-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--dusty-rose);
    animation: typingBounce 1.2s infinite ease-in-out;
  }

  .loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .loading-dot:nth-child(3) { animation-delay: 0.4s; }

  /* ── EMPTY STATE ── */
  .memorial-empty {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 40px 24px;
    text-align: center;
  }

  .memorial-empty h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem;
    font-weight: 300;
    color: var(--brown);
  }

  .memorial-empty p {
    font-size: 0.92rem;
    font-weight: 400;
    color: #555;
    max-width: 400px;
    line-height: 1.8;
  }

  .btn-begin {
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
  }

  .btn-begin:hover { background: var(--brown-mid); }

  /* ── MEMORIAL CONTENT ── */
  .memorial-content {
    max-width: 780px;
    margin: 0 auto;
    padding: 60px 24px 80px;
    animation: fadeUp 0.8s ease both;
  }

  /* Header */
  .memorial-header {
    text-align: center;
    margin-bottom: 56px;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba(196,145,122,0.25);
  }

  .memorial-eyebrow {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }

  .memorial-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.4rem, 6vw, 3.8rem);
    font-weight: 300;
    color: var(--brown);
    line-height: 1.1;
    margin-bottom: 16px;
  }

  .memorial-relationship {
    font-size: 0.88rem;
    font-weight: 400;
    color: #555;
    letter-spacing: 0.08em;
    margin-bottom: 24px;
  }

  .memorial-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--rose-light);
    font-size: 1.2rem;
  }

  .memorial-divider::before,
  .memorial-divider::after {
    content: '';
    display: block;
    width: 60px;
    height: 1px;
    background: var(--rose-light);
  }

  /* Tribute section */
  .tribute-section {
    margin-bottom: 56px;
  }

  .section-label {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
  }

  .tribute-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.18rem;
    font-weight: 400;
    color: #1a1a1a;
    line-height: 2;
    font-style: italic;
  }

  .tribute-text p {
    margin-bottom: 20px;
  }

  .tribute-text p:last-child {
    margin-bottom: 0;
  }

  /* Memories section */
  .memories-section {
    margin-bottom: 56px;
    padding-top: 40px;
    border-top: 1px solid rgba(196,145,122,0.2);
  }

  .memory-card {
    background: white;
    padding: 28px 32px;
    margin-bottom: 16px;
    box-shadow: 0 2px 16px rgba(60,47,47,0.06);
    border-left: 3px solid var(--rose-light);
    animation: fadeUp 0.5s ease both;
  }

  .memory-question {
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--dusty-rose);
    margin-bottom: 10px;
  }

  .memory-answer {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.08rem;
    font-weight: 400;
    color: #1a1a1a;
    line-height: 1.8;
  }

  /* Actions */
  .memorial-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding-top: 40px;
    border-top: 1px solid rgba(196,145,122,0.2);
  }

  .actions-label {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 4px;
  }

  .actions-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn-action {
    padding: 13px 28px;
    background: var(--brown);
    color: var(--cream);
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;
  }

  .btn-action:hover {
    background: var(--brown-mid);
    transform: translateY(-1px);
  }

  .btn-action.outline {
    background: transparent;
    color: var(--brown);
    border: 1.5px solid rgba(26,26,26,0.25);
  }

  .btn-action.outline:hover {
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
    font-weight: 400;
    margin-bottom: 24px;
    border-radius: 2px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.7; }
  }

  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-8px); }
  }

  @media (max-width: 600px) {
    .memorial-content { padding: 40px 20px 60px; }
    .memorial-name { font-size: 2.2rem; }
    .memory-card { padding: 20px 20px; }
    .actions-row { flex-direction: column; align-items: stretch; }
  }
`;

const FLASK_URL = process.env.REACT_APP_API_URL || "";
const MEMORIAL_SAVE_KEY = "enduring_mementos_progress";

const TRIBUTE_SYSTEM_PROMPT = `You are a compassionate writer creating a memorial tribute for a family who has lost a loved one.

Based on the interview conversation provided, write a beautiful, warm, flowing tribute in third person (e.g. "Margaret was..."). 

Guidelines:
- Write 3 paragraphs, each 3-5 sentences
- Use the person's name throughout
- Draw only from what was shared in the conversation — never invent details
- Write in a warm, literary tone — like a eulogy written by someone who truly knew them
- Focus on who they were as a person: their character, their love, their impact
- End with something that captures their enduring presence in the family's hearts
- Do NOT include headings, bullet points, or any formatting — pure flowing prose only`;

export default function Memorial() {
  const [state, setState] = useState("loading"); // loading | generating | ready | empty | error
  const [memorialData, setMemorialData] = useState(null);
  const [tribute, setTribute] = useState("");
  const [memories, setMemories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAndGenerate();
  }, []);

  const loadAndGenerate = async () => {
    try {
      const saved = localStorage.getItem(MEMORIAL_SAVE_KEY);
      if (!saved) {
        setState("empty");
        return;
      }

      const data = JSON.parse(saved);
      if (!data.name || !data.messages || data.messages.length < 2) {
        setState("empty");
        return;
      }

      setMemorialData(data);
      setState("generating");

      // Extract user responses as memories (skip hidden first message)
      const visibleMessages = data.messages.filter(m => !m.hidden);
      const memoryPairs = [];
      for (let i = 0; i < visibleMessages.length - 1; i++) {
        if (visibleMessages[i].role === "assistant" && visibleMessages[i + 1]?.role === "user") {
          memoryPairs.push({
            question: visibleMessages[i].content,
            answer: visibleMessages[i + 1].content,
          });
        }
      }
      setMemories(memoryPairs);

      // Generate AI tribute
      const conversationText = visibleMessages
        .map(m => `${m.role === "assistant" ? "Interviewer" : "Family member"}: ${m.content}`)
        .join("\n\n");

      const response = await fetch(`${FLASK_URL}/api/tribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          relationship: data.relationship || "loved one",
          conversation: conversationText,
        }),
      });

      if (!response.ok) throw new Error("Could not generate tribute");
      const result = await response.json();
      setTribute(result.tribute);
      setState("ready");

    } catch (e) {
      setError("We had trouble generating the tribute. Your memories are still saved.");
      setState("error");
    }
  };

  const handlePrint = () => window.print();

  const handleNewMemorial = () => {
    localStorage.removeItem(MEMORIAL_SAVE_KEY);
    window.location.href = "/#/interview";
  };

  const handleBack = () => {
    window.location.href = "/#/interview";
  };

  // Format tribute into paragraphs
  const tributeParagraphs = tribute
    ? tribute.split(/\n+/).filter(p => p.trim().length > 0)
    : [];

  return (
    <>
      <style>{styles}</style>
      <div className="memorial-page">

        {/* LOADING */}
        {state === "loading" && (
          <div className="memorial-loading">
            <div className="loading-icon">🕊️</div>
            <h2 className="loading-title">Preparing your memorial…</h2>
            <div className="loading-dots">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
          </div>
        )}

        {/* GENERATING */}
        {state === "generating" && (
          <div className="memorial-loading">
            <div className="loading-icon">✦</div>
            <h2 className="loading-title">
              Writing a tribute for<br />
              <em>{memorialData?.name}</em>
            </h2>
            <p className="loading-desc">Gathering the memories you shared…</p>
            <div className="loading-dots">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
          </div>
        )}

        {/* EMPTY */}
        {state === "empty" && (
          <div className="memorial-empty">
            <div style={{ fontSize: "2.5rem" }}>🕊️</div>
            <h2>No memorial found</h2>
            <p>It looks like there's no completed interview to display. Begin a conversation to create a memorial.</p>
            <button className="btn-begin" onClick={handleBack}>
              Begin a Memorial →
            </button>
          </div>
        )}

        {/* ERROR */}
        {state === "error" && (
          <div className="memorial-content">
            <div className="error-banner">{error}</div>
            {memories.length > 0 && memorialData && (
              <>
                <div className="memorial-header">
                  <p className="memorial-eyebrow">In Loving Memory</p>
                  <h1 className="memorial-name">{memorialData.name}</h1>
                  {memorialData.relationship && (
                    <p className="memorial-relationship">Remembered by their {memorialData.relationship}</p>
                  )}
                  <div className="memorial-divider">🕊️</div>
                </div>
                <MemoryCards memories={memories} />
              </>
            )}
          </div>
        )}

        {/* READY */}
        {state === "ready" && memorialData && (
          <div className="memorial-content">

            <div className="memorial-header">
              <p className="memorial-eyebrow">In Loving Memory</p>
              <h1 className="memorial-name">{memorialData.name}</h1>
              {memorialData.relationship && (
                <p className="memorial-relationship">
                  Remembered by their {memorialData.relationship}
                </p>
              )}
              <div className="memorial-divider">🕊️</div>
            </div>

            {/* AI Tribute */}
            {tributeParagraphs.length > 0 && (
              <div className="tribute-section">
                <p className="section-label">A Tribute</p>
                <div className="tribute-text">
                  {tributeParagraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Memory Cards */}
            {memories.length > 0 && (
              <div className="memories-section">
                <p className="section-label">Memories Shared</p>
                {memories.map((m, i) => (
                  <div key={i} className="memory-card" style={{ animationDelay: `${i * 0.08}s` }}>
                    <p className="memory-question">{m.question}</p>
                    <p className="memory-answer">{m.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="memorial-actions">
              <p className="actions-label">What would you like to do?</p>
              <div className="actions-row">
                <button className="btn-action" onClick={handlePrint}>
                  🖨️ Print Memorial
                </button>
                <button className="btn-action outline" onClick={handleNewMemorial}>
                  Begin Another Memorial
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </>
  );
}

function MemoryCards({ memories }) {
  return (
    <div className="memories-section">
      <p className="section-label">Memories Shared</p>
      {memories.map((m, i) => (
        <div key={i} className="memory-card">
          <p className="memory-question">{m.question}</p>
          <p className="memory-answer">{m.answer}</p>
        </div>
      ))}
    </div>
  );
}