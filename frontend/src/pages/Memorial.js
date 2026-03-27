import GriefSupportBar from "../components/GriefSupportBar";
import { useState, useEffect, useRef } from "react";

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

  .memorial-loading {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    animation: fadeUp 0.6s ease both;
  }

  .loading-icon { font-size: 2.5rem; animation: pulse 2s infinite ease-in-out; }

  .loading-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 300; color: var(--brown); text-align: center;
  }

  .loading-title em { font-style: italic; color: var(--dusty-rose); }

  .loading-desc { font-size: 0.88rem; font-weight: 400; color: #555; text-align: center; }

  .loading-dots { display: flex; gap: 6px; }

  .loading-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--dusty-rose); animation: typingBounce 1.2s infinite ease-in-out;
  }
  .loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .loading-dot:nth-child(3) { animation-delay: 0.4s; }

  .memorial-empty {
    min-height: 80vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 20px; padding: 40px 24px; text-align: center;
  }

  .memorial-empty h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 300; color: var(--brown);
  }

  .memorial-empty p {
    font-size: 0.92rem; font-weight: 400; color: #555;
    max-width: 400px; line-height: 1.8;
  }

  .btn-begin {
    padding: 14px 32px; background: var(--brown); color: var(--cream);
    border: none; font-family: 'Jost', sans-serif; font-size: 0.78rem;
    font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer; transition: background 0.3s; text-decoration: none;
  }
  .btn-begin:hover { background: var(--brown-mid); }

  .memorial-content {
    max-width: 780px; margin: 0 auto;
    padding: 60px 24px 80px; animation: fadeUp 0.8s ease both;
  }

  .memorial-header {
    text-align: center; margin-bottom: 56px;
    padding-bottom: 40px; border-bottom: 1px solid rgba(196,145,122,0.25);
  }

  .memorial-eyebrow {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.25em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 16px;
  }

  .memorial-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.4rem, 6vw, 3.8rem); font-weight: 300;
    color: var(--brown); line-height: 1.1; margin-bottom: 16px;
  }

  .memorial-relationship {
    font-size: 0.88rem; font-weight: 400; color: #555;
    letter-spacing: 0.08em; margin-bottom: 24px;
  }

  .memorial-divider {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; color: var(--rose-light); font-size: 1.2rem;
  }

  .memorial-divider::before, .memorial-divider::after {
    content: ''; display: block; width: 60px; height: 1px; background: var(--rose-light);
  }

  .tribute-section { margin-bottom: 56px; }

  .section-label {
    font-size: 0.68rem; font-weight: 500; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 20px;
  }

  .tribute-text {
    font-family: 'Cormorant Garamond', serif; font-size: 1.18rem;
    font-weight: 400; color: #1a1a1a; line-height: 2; font-style: italic;
  }

  .tribute-text p { margin-bottom: 20px; }
  .tribute-text p:last-child { margin-bottom: 0; }

  .photos-section {
    margin-bottom: 56px; padding-top: 40px;
    border-top: 1px solid rgba(196,145,122,0.2);
  }

  .photos-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
  }

  .photo-upload-zone {
    border: 1.5px dashed rgba(196,145,122,0.4); background: rgba(245,239,230,0.5);
    padding: 32px 24px; text-align: center; cursor: pointer;
    transition: border-color 0.2s, background 0.2s; margin-bottom: 20px; position: relative;
  }

  .photo-upload-zone:hover, .photo-upload-zone.dragover {
    border-color: var(--dusty-rose); background: rgba(196,145,122,0.08);
  }

  .photo-upload-zone input[type="file"] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }

  .upload-icon { font-size: 1.8rem; margin-bottom: 10px; }

  .upload-label { font-size: 0.85rem; font-weight: 400; color: #555; line-height: 1.6; }
  .upload-label strong { color: var(--dusty-rose); font-weight: 500; }

  .upload-hint { font-size: 0.72rem; color: rgba(26,26,26,0.38); margin-top: 6px; letter-spacing: 0.03em; }

  .upload-progress { margin-top: 10px; font-size: 0.78rem; color: var(--dusty-rose); font-style: italic; }

  .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }

  .photo-item {
    position: relative; aspect-ratio: 1; overflow: hidden;
    background: rgba(196,145,122,0.1); animation: fadeUp 0.4s ease both;
  }

  .photo-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease; }
  .photo-item:hover img { transform: scale(1.03); }

  .photo-delete-btn {
    position: absolute; top: 7px; right: 7px; width: 26px; height: 26px;
    border-radius: 50%; background: rgba(26,26,26,0.6); color: white;
    border: none; cursor: pointer; font-size: 0.75rem;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.2s, background 0.2s; backdrop-filter: blur(4px);
  }

  .photo-item:hover .photo-delete-btn { opacity: 1; }
  .photo-delete-btn:hover { background: #c0392b; }

  .photo-upload-error {
    font-size: 0.8rem; color: #721c24; background: #FEE;
    border: 1px solid #F5C6CB; padding: 8px 12px; margin-top: 10px;
  }

  .memories-section {
    margin-bottom: 56px; padding-top: 40px;
    border-top: 1px solid rgba(196,145,122,0.2);
  }

  .memory-card {
    background: white; padding: 28px 32px; margin-bottom: 16px;
    box-shadow: 0 2px 16px rgba(60,47,47,0.06);
    border-left: 3px solid var(--rose-light); animation: fadeUp 0.5s ease both;
  }

  .memory-question {
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--dusty-rose); margin-bottom: 10px;
  }

  .memory-answer {
    font-family: 'Cormorant Garamond', serif; font-size: 1.08rem;
    font-weight: 400; color: #1a1a1a; line-height: 1.8;
  }

  /* ── SAVED NOTICE ── */
  .saved-notice {
    text-align: center; padding: 14px 20px;
    background: rgba(138,158,140,0.12); border: 1px solid rgba(138,158,140,0.3);
    color: #3C2F2F; font-size: 0.88rem; font-style: italic;
    margin-bottom: 20px; font-family: 'Cormorant Garamond', serif;
    animation: fadeUp 0.4s ease both;
  }

  .memorial-actions {
    display: flex; flex-direction: column; align-items: center;
    gap: 12px; padding-top: 40px; border-top: 1px solid rgba(196,145,122,0.2);
  }

  .actions-label {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 4px;
  }

  .actions-row { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }

  .btn-action {
    padding: 13px 28px; background: var(--brown); color: var(--cream);
    border: none; font-family: 'Jost', sans-serif; font-size: 0.75rem;
    font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
    cursor: pointer; transition: background 0.3s, transform 0.2s;
  }

  .btn-action:hover { background: var(--brown-mid); transform: translateY(-1px); }

  .btn-action.outline {
    background: transparent; color: var(--brown);
    border: 1.5px solid rgba(26,26,26,0.25);
  }

  .btn-action.outline:hover { background: var(--brown); color: var(--cream); }

  .error-banner {
    background: #FEE; border: 1px solid #F5C6CB; color: #721c24;
    padding: 12px 16px; font-size: 0.83rem; font-weight: 400;
    margin-bottom: 24px; border-radius: 2px;
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
    .photo-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  }

  @media print {
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .memorial-page { background: white !important; }
    .memorial-content { padding: 0 !important; max-width: 100% !important; }
    .memorial-header { padding-top: 40px; margin-bottom: 40px; }
    .memorial-eyebrow { font-size: 0.85rem !important; letter-spacing: 0.25em; margin-bottom: 20px !important; }
    .memorial-name { font-size: 3rem !important; }
    .memorial-actions { display: none !important; }
    .saved-notice { display: none !important; }
    .photo-upload-zone { display: none !important; }
    .photo-delete-btn { display: none !important; }
    .photo-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .memory-card { box-shadow: none !important; border: 1px solid rgba(196,145,122,0.3); break-inside: avoid; }
    .tribute-text { font-size: 1.1rem !important; line-height: 1.9 !important; }
  }
`;

const FLASK_URL       = process.env.REACT_APP_API_URL || "";
const MEMORIAL_SAVE_KEY = "enduring_mementos_progress";
const MAX_FILE_SIZE_MB  = 10;
const ALLOWED_TYPES     = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export default function Memorial() {
  const [state, setState]               = useState("loading");
  const [memorialData, setMemorialData] = useState(null);
  const [tribute, setTribute]           = useState("");
  const [memories, setMemories]         = useState([]);
  const [error, setError]               = useState(null);
  const [savedNotice, setSavedNotice]   = useState(false);

  // Photo state
  const [photos, setPhotos]           = useState([]);
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [dragOver, setDragOver]       = useState(false);
  const fileInputRef                  = useRef(null);

  useEffect(() => { loadAndGenerate(); }, []);

  const loadAndGenerate = async () => {
    try {
      const saved = localStorage.getItem(MEMORIAL_SAVE_KEY);
      if (!saved) { setState("empty"); return; }

      const data = JSON.parse(saved);
      if (!data.name || !data.messages || data.messages.length < 2) { setState("empty"); return; }

      setMemorialData(data);
      setState("generating");

      
      // Extract memory pairs
      const visibleMessages = data.messages.filter(m => !m.hidden);
      const memoryPairs = [];
      for (let i = 0; i < visibleMessages.length - 1; i++) {
        if (visibleMessages[i].role === "assistant" && visibleMessages[i + 1]?.role === "user") {
          memoryPairs.push({
            question: visibleMessages[i].content,
            answer:   visibleMessages[i + 1].content,
          });
        }
      }
      setMemories(memoryPairs);

      // Generate tribute
      const conversationText = visibleMessages
        .map(m => `${m.role === "assistant" ? "Interviewer" : "Family member"}: ${m.content}`)
        .join("\n\n");

      const response = await fetch(`${FLASK_URL}/api/tribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:         data.name,
          relationship: data.relationship || "loved one",
          conversation: conversationText,
        }),
      });

      if (!response.ok) throw new Error("Could not generate tribute");
      const result = await response.json();
      setTribute(result.tribute);

      // Fetch existing photos from backend
      try {
        const photoRes = await fetch(`${FLASK_URL}/api/memorials/${data.id}/photos`);
        if (photoRes.ok) {
          const photoData = await photoRes.json();
          if (photoData.photos) setPhotos(photoData.photos);
        }
      } catch (e) { console.warn("Could not load photos:", e); }

      // Save tribute back to localStorage so it persists on return
      try {
        const updated = { ...data, tribute_text: result.tribute };
        localStorage.setItem(MEMORIAL_SAVE_KEY, JSON.stringify(updated));
      } catch (e) { console.warn("Could not cache tribute:", e); }

      // Save to backend
      try {
        await fetch(`${FLASK_URL}/api/memorials`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id:           data.id,
            user_id:      localStorage.getItem("em_user_id") || "default",
            name:         data.name,
            relationship: data.relationship || "loved one",
            messages:     data.messages,
            tribute_text: result.tribute,
            status:       "complete",
          }),
        });
      } catch (e) { console.warn("Backend tribute save failed:", e); }

      setState("ready");
    } catch (e) {
      setError("We had trouble generating the tribute. Your memories are still saved.");
      setState("error");
    }
  };

  // ── Photo upload ──
  const handleFiles = async (files) => {
    if (!memorialData?.id) return;
    setUploadError(null);

    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadError("Only JPG, PNG, GIF, and WEBP images are allowed.");
        continue;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setUploadError(`${file.name} is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        continue;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("photo", file);

        const res = await fetch(`${FLASK_URL}/api/memorials/${memorialData.id}/photos`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        setPhotos(prev => [...prev, { url: data.url, key: data.key }]);
      } catch (e) {
        setUploadError("Upload failed. Please check your connection and try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDeletePhoto = async (key) => {
    if (!memorialData?.id) return;
    try {
      await fetch(`${FLASK_URL}/api/memorials/${memorialData.id}/photos/${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      setPhotos(prev => prev.filter(p => p.key !== key));
    } catch (e) {
      setUploadError("Could not delete photo. Please try again.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handlePrint = () => window.print();

  // Save & Come Back Later — keeps localStorage intact, just confirms to user
  const handleSaveAndReturn = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 5000);
  };

  // Begin Another Memorial — clears localStorage and goes to interview
  const handleNewMemorial = () => {
    localStorage.removeItem(MEMORIAL_SAVE_KEY);
    window.location.href = "/#/interview";
  };

  const handleBack = () => { window.location.href = "/#/interview"; };

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
              <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
            </div>
          </div>
        )}

        {/* GENERATING */}
        {state === "generating" && (
          <div className="memorial-loading">
            <div className="loading-icon">✦</div>
            <h2 className="loading-title">Writing a tribute for<br /><em>{memorialData?.name}</em></h2>
            <p className="loading-desc">Gathering the memories you shared…</p>
            <div className="loading-dots">
              <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
            </div>
          </div>
        )}

        {/* EMPTY */}
        {state === "empty" && (
          <div className="memorial-empty">
            <div style={{ fontSize: "2.5rem" }}>🕊️</div>
            <h2>No memorial found</h2>
            <p>It looks like there's no completed interview to display. Begin a conversation to create a memorial.</p>
            <button className="btn-begin" onClick={handleBack}>Begin a Memorial →</button>
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
                <p className="memorial-relationship">Remembered by their {memorialData.relationship}</p>
              )}
              <div className="memorial-divider">🕊️</div>
            </div>

            {/* Tribute */}
            {tributeParagraphs.length > 0 && (
              <div className="tribute-section">
                <p className="section-label">A Tribute</p>
                <div className="tribute-text">
                  {tributeParagraphs.map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </div>
            )}

            {/* Photos */}
            <div className="photos-section">
              <div className="photos-header">
                <p className="section-label" style={{ marginBottom: 0 }}>Photographs</p>
                {photos.length > 0 && (
                  <span style={{ fontSize: "0.72rem", color: "rgba(26,26,26,0.4)", letterSpacing: "0.04em" }}>
                    {photos.length} photo{photos.length !== 1 ? "s" : ""} added
                  </span>
                )}
              </div>

              <div
                className={`photo-upload-zone${dragOver ? " dragover" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  multiple
                  onChange={e => handleFiles(e.target.files)}
                />
                <div className="upload-icon">📷</div>
                <p className="upload-label">
                  <strong>Click to upload</strong> or drag and drop photos here
                </p>
                <p className="upload-hint">JPG, PNG, GIF or WEBP · Max {MAX_FILE_SIZE_MB}MB each</p>
                {uploading && <p className="upload-progress">Uploading…</p>}
              </div>

              {uploadError && <div className="photo-upload-error">{uploadError}</div>}

              {photos.length > 0 && (
                <div className="photo-grid">
                  {photos.map((photo, i) => (
                    <div key={photo.key || i} className="photo-item">
                      <img src={photo.url} alt={`Memory ${i + 1}`} />
                      <button
                        className="photo-delete-btn"
                        onClick={() => handleDeletePhoto(photo.key)}
                        aria-label="Remove photo"
                        title="Remove"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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

              {/* Saved confirmation notice */}
              {savedNotice && (
                <div className="saved-notice">
                  🕊️ Your memorial is safely saved. Come back anytime — it will be right here waiting for you.
                </div>
              )}

              <div className="actions-row">
                <button className="btn-action" onClick={handlePrint}>
                  🖨️ Print Memorial
                </button>
                <button className="btn-action outline" onClick={handleSaveAndReturn}>
                  💾 Save & Come Back Later
                </button>
                <button className="btn-action outline" onClick={handleNewMemorial}>
                  Begin Another Memorial
                </button>
              </div>
            </div>

          </div>
        )}
       </div> 
      <GriefSupportBar />
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
