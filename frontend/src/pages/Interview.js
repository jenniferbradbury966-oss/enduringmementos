import { useState, useEffect, useRef } from "react";
import {
  detectEmotionalOpenness,
  buildSystemPrompt,
} from "./questions";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ANSWERS_NEEDED  = 9;
const MAX_MEMORIALS   = 3;
const STORAGE_INDEX   = "em_memorial_index";
const FLASK_URL       = process.env.REACT_APP_API_URL || "";

const getUserId = () => {
  let uid = localStorage.getItem("em_user_id");
  if (!uid) {
    uid = `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    localStorage.setItem("em_user_id", uid);
  }
  return uid;
};

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
const storageKey       = (id) => `em_memorial_${id}`;
const generateId       = () => `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const loadAllMemorials = () => {
  try {
    const index = JSON.parse(localStorage.getItem(STORAGE_INDEX) || "[]");
    return index
      .map(id => { try { return JSON.parse(localStorage.getItem(storageKey(id))); } catch { return null; } })
      .filter(Boolean);
  } catch { return []; }
};

const saveMemorial = (m) => {
  try {
    const index = JSON.parse(localStorage.getItem(STORAGE_INDEX) || "[]");
    if (!index.includes(m.id))
      localStorage.setItem(STORAGE_INDEX, JSON.stringify([...index, m.id]));
    localStorage.setItem(storageKey(m.id), JSON.stringify(m));
  } catch (e) { console.warn("Save failed:", e); }
};

const deleteMemorial = (id) => {
  try {
    const index = JSON.parse(localStorage.getItem(STORAGE_INDEX) || "[]");
    localStorage.setItem(STORAGE_INDEX, JSON.stringify(index.filter(i => i !== id)));
    localStorage.removeItem(storageKey(id));
  } catch (e) { console.warn("Delete failed:", e); }
};

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return "recently"; }
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
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

  .interview-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #F5EFE6 0%, #EDE0D4 100%);
    font-family: 'Jost', sans-serif;
    color: var(--brown);
    display: flex;
    flex-direction: column;
  }

  /* ── DASHBOARD ── */
  .dashboard-screen {
    flex: 1; display: flex; align-items: flex-start;
    justify-content: center; padding: 80px 24px 60px;
    animation: fadeUp 0.7s ease both;
  }

  .dashboard-inner { max-width: 600px; width: 100%; }

  .dashboard-label {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 10px;
  }

  .dashboard-title {
    font-family: 'Cormorant Garamond', serif; font-size: 2.1rem;
    font-weight: 300; color: var(--brown); margin-bottom: 8px; line-height: 1.2;
  }

  .dashboard-title em { font-style: italic; color: var(--dusty-rose); }

  .dashboard-sub {
    font-size: 0.88rem; color: #555; line-height: 1.75;
    margin-bottom: 36px; font-weight: 400;
  }

  .memorial-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }

  .memorial-card-dash {
    background: white; border: 1px solid rgba(196,145,122,0.22);
    padding: 20px 22px; display: flex; align-items: center; gap: 16px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s; cursor: pointer;
  }

  .memorial-card-dash:hover {
    border-color: var(--dusty-rose); box-shadow: 0 6px 24px rgba(60,47,47,0.09);
    transform: translateY(-2px);
  }

  .memorial-card-dash-info { flex: 1; min-width: 0; }

  .mcd-name {
    font-family: 'Cormorant Garamond', serif; font-size: 1.18rem;
    font-weight: 400; font-style: italic; color: var(--brown);
    margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .mcd-meta { font-size: 0.72rem; color: rgba(26,26,26,0.42); letter-spacing: 0.04em; }

  .mcd-right { display: flex; flex-direction: column; align-items: flex-end; gap: 7px; flex-shrink: 0; }

  .mcd-count { font-size: 0.7rem; font-weight: 500; letter-spacing: 0.08em; color: var(--dusty-rose); }

  .mcd-bar { width: 72px; height: 2px; background: rgba(196,145,122,0.2); border-radius: 1px; overflow: hidden; }

  .mcd-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--dusty-rose), var(--gold));
    border-radius: 1px; transition: width 0.5s ease;
  }

  .mcd-delete {
    background: none; border: none; cursor: pointer;
    color: rgba(26,26,26,0.25); font-size: 1.1rem;
    padding: 4px; transition: color 0.2s; flex-shrink: 0; line-height: 1;
  }

  .mcd-delete:hover { color: #c0392b; }

  .limit-notice {
    background: rgba(196,145,122,0.1); border: 1px solid rgba(196,145,122,0.25);
    padding: 14px 18px; font-size: 0.83rem; color: var(--brown-mid);
    line-height: 1.6; margin-bottom: 20px; font-style: italic;
  }

  .btn-new-memorial {
    width: 100%; padding: 15px; background: var(--brown); color: var(--cream);
    border: none; font-family: 'Jost', sans-serif; font-size: 0.78rem;
    font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer; transition: background 0.3s, transform 0.2s;
  }

  .btn-new-memorial:hover:not(:disabled) { background: var(--brown-mid); transform: translateY(-1px); }
  .btn-new-memorial:disabled { opacity: 0.45; cursor: not-allowed; }

  /* ── CONSENT ── */
  .consent-screen {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 60px 24px; animation: fadeUp 0.7s ease both;
  }

  .consent-card {
    background: white; max-width: 520px; width: 100%;
    padding: 52px 48px; box-shadow: 0 24px 64px rgba(60,47,47,0.1);
  }

  .consent-label {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 12px;
  }

  .consent-title {
    font-family: 'Cormorant Garamond', serif; font-size: 2rem;
    font-weight: 300; line-height: 1.2; color: var(--brown); margin-bottom: 20px;
  }

  .consent-title em { font-style: italic; color: var(--dusty-rose); }

  .consent-body {
    font-size: 0.88rem; color: #2c2c2c; line-height: 1.85;
    margin-bottom: 28px; font-weight: 400;
  }

  .consent-points {
    list-style: none; display: flex; flex-direction: column;
    gap: 10px; margin-bottom: 28px;
    padding: 20px 20px; background: rgba(245,239,230,0.6);
    border-left: 2px solid var(--rose-light);
  }

  .consent-points li {
    font-size: 0.85rem; color: var(--brown-mid); line-height: 1.6;
    display: flex; align-items: flex-start; gap: 10px;
  }

  .consent-points li::before {
    content: '✦'; color: var(--gold); font-size: 0.5rem;
    flex-shrink: 0; margin-top: 5px;
  }

  .consent-check-row {
    display: flex; align-items: flex-start; gap: 12px;
    margin-bottom: 24px; cursor: pointer;
  }

  .consent-check-row input[type="checkbox"] {
    width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;
    accent-color: var(--brown); cursor: pointer;
  }

  .consent-check-label {
    font-size: 0.85rem; color: var(--brown-mid); line-height: 1.65; cursor: pointer;
  }

  .consent-check-label strong { color: var(--brown); font-weight: 500; }

  .consent-actions { display: flex; flex-direction: column; gap: 10px; }

  .btn-consent-proceed {
    width: 100%; padding: 15px; background: var(--brown); color: var(--cream);
    border: none; font-family: 'Jost', sans-serif; font-size: 0.78rem;
    font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer; transition: background 0.3s, transform 0.2s;
  }

  .btn-consent-proceed:hover:not(:disabled) { background: var(--brown-mid); transform: translateY(-1px); }
  .btn-consent-proceed:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── SETUP ── */
  .setup-screen {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 60px 24px; animation: fadeUp 0.7s ease both;
  }

  .setup-card {
    background: white; max-width: 520px; width: 100%;
    padding: 52px 48px; box-shadow: 0 24px 64px rgba(60,47,47,0.1);
  }

  .setup-label { font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }

  .setup-title { font-family: 'Cormorant Garamond', serif; font-size: 2.1rem; font-weight: 300; line-height: 1.2; color: var(--brown); margin-bottom: 12px; }
  .setup-title em { font-style: italic; color: var(--dusty-rose); }

  .setup-desc { font-size: 0.88rem; color: #2c2c2c; line-height: 1.8; margin-bottom: 32px; font-weight: 400; }

  .setup-field { margin-bottom: 18px; }

  .setup-field label { display: block; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #1a1a1a; margin-bottom: 7px; }

  .setup-field input, .setup-field select {
    width: 100%; padding: 12px 14px; border: 1px solid rgba(107,79,79,0.28);
    background: var(--warm-white); font-family: 'Jost', sans-serif;
    font-size: 0.92rem; color: #1a1a1a; outline: none;
    transition: border-color 0.2s; appearance: none;
  }

  .setup-field input:focus, .setup-field select:focus { border-color: var(--dusty-rose); }
  .setup-field input::placeholder { color: rgba(60,47,47,0.4); }

  .setup-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }

  .btn-start {
    width: 100%; padding: 15px; background: var(--brown); color: var(--cream);
    border: none; font-family: 'Jost', sans-serif; font-size: 0.78rem;
    font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer; transition: background 0.3s, transform 0.2s;
  }

  .btn-start:hover:not(:disabled) { background: var(--brown-mid); transform: translateY(-1px); }
  .btn-start:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-back-link {
    background: none; border: none; font-family: 'Jost', sans-serif;
    font-size: 0.78rem; color: rgba(26,26,26,0.45); cursor: pointer;
    text-align: center; letter-spacing: 0.06em; padding: 6px;
    transition: color 0.2s;
  }

  .btn-back-link:hover { color: var(--dusty-rose); }

  /* ── INTERVIEW ── */
  .interview-screen {
    flex: 1; display: flex; flex-direction: column;
    max-width: 780px; width: 100%; margin: 0 auto;
    padding: 96px 24px 24px; animation: fadeUp 0.6s ease both;
  }

  .interview-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px; gap: 12px;
  }

  .interview-header-center { text-align: center; flex: 1; }

  .for-label { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 3px; }

  .interview-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.7rem; font-weight: 500;
    color: #2A1F1F; font-style: italic;
    letter-spacing: 0.01em;
    text-shadow: 0 1px 0 rgba(255,255,255,0.6);
  }

  .interview-header-wrap {
    background: rgba(245,239,230,0.85);
    backdrop-filter: blur(8px);
    padding: 14px 24px 10px;
    margin: -96px -24px 20px;
    border-bottom: 1px solid rgba(196,145,122,0.15);
  }

  .btn-switch {
    background: none; border: 1px solid rgba(107,79,79,0.22);
    font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; color: rgba(26,26,26,0.5);
    cursor: pointer; padding: 7px 12px; transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
  }

  .btn-switch:hover { border-color: var(--dusty-rose); color: var(--dusty-rose); }

  .depth-pill {
    font-size: 0.66rem; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 3px 10px; border-radius: 20px;
    border: 1px solid; white-space: nowrap; flex-shrink: 0;
  }

  .depth-pill.easy   { color: var(--sage);       border-color: rgba(138,158,140,0.35); background: rgba(138,158,140,0.08); }
  .depth-pill.medium { color: var(--dusty-rose);  border-color: rgba(196,145,122,0.35); background: rgba(196,145,122,0.08); }
  .depth-pill.deep   { color: var(--gold);        border-color: rgba(139,105,20,0.3);   background: rgba(139,105,20,0.06); }

  .progress-wrapper { margin-bottom: 24px; }

  .progress-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px; }

  .progress-label { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(26,26,26,0.4); }

  .progress-count { font-size: 0.7rem; font-weight: 500; letter-spacing: 0.08em; color: var(--dusty-rose); }

  .progress-bar { width: 100%; height: 2px; background: rgba(196,145,122,0.2); border-radius: 1px; overflow: hidden; }

  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--dusty-rose), var(--gold)); border-radius: 1px; transition: width 0.6s ease; }

  .messages-area {
    flex: 1; overflow-y: auto; display: flex; flex-direction: column;
    gap: 18px; padding-bottom: 20px; min-height: 300px; max-height: 420px; scroll-behavior: smooth;
  }

  .messages-area::-webkit-scrollbar { width: 4px; }
  .messages-area::-webkit-scrollbar-track { background: transparent; }
  .messages-area::-webkit-scrollbar-thumb { background: var(--rose-light); border-radius: 2px; }

  .msg-row { display: flex; gap: 11px; animation: fadeUp 0.4s ease both; }
  .msg-row.user { flex-direction: row-reverse; }
  .msg-row.skipped-row { justify-content: center; }

  .msg-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; font-weight: 500; letter-spacing: 0.05em; flex-shrink: 0; margin-top: 2px;
  }

  .msg-avatar.ai { background: var(--brown); color: var(--gold-light); font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; font-style: italic; }
  .msg-avatar.user-av { background: var(--sage); color: white; font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.08em; }

  .msg-bubble { max-width: 78%; padding: 15px 18px; line-height: 1.75; font-size: 0.93rem; font-weight: 400; }

  .msg-bubble.ai {
    background: white; color: #1a1a1a;
    font-family: 'Cormorant Garamond', serif; font-size: 1.06rem;
    font-style: italic; font-weight: 400;
    box-shadow: 0 2px 12px rgba(60,47,47,0.06); border-left: 2px solid var(--rose-light);
  }

  .msg-bubble.user {
    background: white; color: #1a1a1a;
    font-family: 'Jost', sans-serif; font-weight: 400;
    box-shadow: 0 2px 12px rgba(60,47,47,0.06); border-right: 2px solid var(--rose-light);
  }

  .skipped-pill {
    font-size: 0.7rem; font-weight: 400; font-style: italic;
    color: rgba(26,26,26,0.32); letter-spacing: 0.06em;
    padding: 4px 14px; border: 1px solid rgba(196,145,122,0.18);
    border-radius: 20px; background: rgba(245,239,230,0.5);
  }

  .typing-indicator {
    display: flex; align-items: center; gap: 5px; padding: 15px 18px;
    background: white; box-shadow: 0 2px 12px rgba(60,47,47,0.06);
    width: fit-content; border-left: 2px solid var(--rose-light);
  }

  .typing-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--dusty-rose); animation: typingBounce 1.2s infinite ease-in-out; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  .input-area { border-top: 1px solid rgba(196,145,122,0.2); padding-top: 18px; margin-top: 8px; }
  .input-row { display: flex; gap: 10px; align-items: flex-end; }

  .input-box {
    flex: 1; padding: 13px 16px; border: 1px solid rgba(107,79,79,0.2);
    background: white; font-family: 'Jost', sans-serif; font-size: 0.91rem;
    color: #1a1a1a; outline: none; resize: none;
    min-height: 50px; max-height: 120px; line-height: 1.6; transition: border-color 0.2s;
  }

  .input-box:focus { border-color: var(--dusty-rose); }
  .input-box::placeholder { color: rgba(60,47,47,0.38); }
  .input-box:disabled { opacity: 0.6; }

  .send-btn {
    width: 50px; height: 50px; background: var(--brown); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: var(--cream); font-size: 1.05rem;
    transition: background 0.2s, transform 0.15s;
  }

  .send-btn:hover:not(:disabled) { background: var(--brown-mid); transform: translateY(-1px); }
  .send-btn:disabled { opacity: 0.38; cursor: not-allowed; }

  .input-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 9px; flex-wrap: wrap; gap: 6px; }

  .input-hint { font-size: 0.71rem; color: rgba(26,26,26,0.38); letter-spacing: 0.03em; }

  .btn-skip {
    background: none; border: none; border-bottom: 1px solid transparent;
    font-family: 'Jost', sans-serif; font-size: 0.71rem; color: rgba(26,26,26,0.42);
    cursor: pointer; letter-spacing: 0.04em; padding: 3px 0;
    transition: color 0.2s, border-color 0.2s; white-space: nowrap;
  }

  .btn-skip:hover:not(:disabled) { color: var(--dusty-rose); border-bottom-color: var(--dusty-rose); }
  .btn-skip:disabled { opacity: 0.28; cursor: not-allowed; }

  .complete-screen { flex: 1; display: flex; align-items: center; justify-content: center; padding: 60px 24px; animation: fadeUp 0.7s ease both; }

  .complete-card { background: white; max-width: 520px; width: 100%; padding: 52px 48px; box-shadow: 0 24px 64px rgba(60,47,47,0.1); text-align: center; }

  .complete-icon { font-size: 2.4rem; margin-bottom: 18px; }

  .complete-card h2 { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 300; color: var(--brown); margin-bottom: 14px; line-height: 1.2; }
  .complete-card h2 em { font-style: italic; color: var(--dusty-rose); }

  .complete-card p { font-size: 0.9rem; color: #2c2c2c; line-height: 1.8; margin-bottom: 28px; }

  .complete-actions { display: flex; flex-direction: column; gap: 10px; }

  .btn-view { padding: 14px 32px; background: var(--brown); color: var(--cream); border: none; font-family: 'Jost', sans-serif; font-size: 0.77rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: background 0.3s; text-decoration: none; display: block; }
  .btn-view:hover { background: var(--brown-mid); }

  .btn-outline { padding: 14px 32px; background: transparent; color: var(--brown); border: 1.5px solid rgba(107,79,79,0.3); font-family: 'Jost', sans-serif; font-size: 0.77rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.3s; }
  .btn-outline:hover { background: var(--brown); color: var(--cream); }

  .error-banner { background: #FEE; border: 1px solid #F5C6CB; color: #721c24; padding: 11px 14px; font-size: 0.82rem; margin-bottom: 14px; border-radius: 2px; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(26,26,26,0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 24px; animation: fadeIn 0.2s ease both; }

  .modal-card { background: white; max-width: 400px; width: 100%; padding: 36px 32px; box-shadow: 0 24px 64px rgba(60,47,47,0.2); animation: fadeUp 0.25s ease both; }

  .modal-card h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 400; color: var(--brown); margin-bottom: 10px; }
  .modal-card p { font-size: 0.86rem; color: #555; line-height: 1.7; margin-bottom: 24px; }

  .modal-actions { display: flex; gap: 10px; }

  .btn-confirm-delete { flex: 1; padding: 12px; background: #c0392b; color: white; border: none; font-family: 'Jost', sans-serif; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.2s; }
  .btn-confirm-delete:hover { background: #a93226; }

  .btn-cancel { flex: 1; padding: 12px; background: transparent; color: var(--brown); border: 1px solid rgba(107,79,79,0.3); font-family: 'Jost', sans-serif; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .btn-cancel:hover { background: var(--brown); color: var(--cream); }

  /* ── GRIEF SUPPORT FOOTER ── */
  .grief-support-bar {
    background: rgba(138,158,140,0.12);
    border-top: 1px solid rgba(138,158,140,0.25);
    padding: 14px 24px;
    text-align: center;
    margin-top: auto;
  }

  .grief-support-bar p {
    font-size: 0.78rem; font-weight: 400; color: rgba(26,26,26,0.55);
    line-height: 1.7; font-family: 'Cormorant Garamond', serif; font-style: italic;
  }

  .grief-support-bar a {
    color: var(--sage); text-decoration: none; font-weight: 500;
    border-bottom: 1px solid rgba(138,158,140,0.4); transition: color 0.2s, border-color 0.2s;
    font-style: normal;
  }

  .grief-support-bar a:hover { color: #5a7d5c; border-bottom-color: #5a7d5c; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes typingBounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

  @media (max-width: 600px) {
    .setup-card, .complete-card, .consent-card { padding: 32px 24px; }
    .interview-screen { padding: 80px 14px 14px; }
    .input-footer { flex-direction: column; align-items: flex-start; }
    .dashboard-screen { padding: 60px 16px 40px; }
  }
`;

// ─── GRIEF SUPPORT FOOTER ─────────────────────────────────────────────────────
function GriefSupportBar() {
  return (
    <div className="grief-support-bar">
      <p>
        If you're finding this difficult, you're not alone.{" "}
        Professional grief support is available.{" "}
        <a href="https://www.camh.ca/en/health-info/crisis-resources" target="_blank" rel="noopener noreferrer">
          Crisis Services Canada
        </a>
        : 1‑833‑456‑4566 &nbsp;·&nbsp;{" "}
        <a href="https://www.counsellingbc.com/grief-counselling/" target="_blank" rel="noopener noreferrer">
          Find a grief counsellor
        </a>
      </p>
    </div>
  );
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function Interview() {
  const [screen, setScreen]             = useState("dashboard");
  const [memorials, setMemorials]       = useState([]);
  const [activeId, setActiveId]         = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [consentChecked, setConsentChecked] = useState(false);

  const [setupName, setSetupName]               = useState("");
  const [setupRelationship, setSetupRelationship] = useState("");

  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [currentDepth, setCurrentDepth]   = useState("easy");

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);

  useEffect(() => { setMemorials(loadAllMemorials()); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  // Persist on every state change
  useEffect(() => {
    if (!activeId || messages.length === 0) return;
    const m = memorials.find(m => m.id === activeId);
    if (!m) return;
    const updated = {
      ...m,
      messages,
      answeredCount,
      savedAt: new Date().toISOString(),
    };
    saveMemorial(updated);
    saveToBackend(updated, "in_progress");
    setMemorials(loadAllMemorials());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, answeredCount]);

  const autoResize = (e) => {
    e.target.style.height = "50px";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const saveToBackend = async (memorial, status = "in_progress", tributeText = null) => {
    try {
      await fetch(`${FLASK_URL}/api/memorials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id:             memorial.id,
          user_id:        getUserId(),
          name:           memorial.name,
          relationship:   memorial.relationship,
          messages:       memorial.messages,
          answered_count: memorial.answeredCount || 0,
          tribute_text:   tributeText,
          status,
        }),
      });
    } catch (e) {
      console.warn("Backend save failed (localStorage still has it):", e);
    }
  };

  const activeMemorial = memorials.find(m => m.id === activeId);
  const activeName     = activeMemorial?.name || setupName;
  const activeRel      = activeMemorial?.relationship || setupRelationship || "loved one";

  const openMemorial = (memorial) => {
    setActiveId(memorial.id);
    setMessages(memorial.messages || []);
    setAnsweredCount(memorial.answeredCount || 0);
    setError(null);
    setScreen("interview");
  };

  const goToDashboard = () => {
    setActiveId(null);
    setMessages([]); setInput("");
    setAnsweredCount(0); setError(null); setCurrentDepth("easy");
    setMemorials(loadAllMemorials());
    setScreen("dashboard");
  };

  const confirmDelete = (e, id) => { e.stopPropagation(); setDeleteTarget(id); };
  const executeDelete = () => { deleteMemorial(deleteTarget); setMemorials(loadAllMemorials()); setDeleteTarget(null); };

  // ── Build system prompt dynamically based on conversation progress ──
  const getSystemPrompt = (currentAnsweredCount, currentMessages) => {
    const emotionallyOpen = detectEmotionalOpenness(currentMessages);
    return buildSystemPrompt(activeName || setupName, activeRel, currentAnsweredCount, emotionallyOpen);
  };

  // ── Claude API ──
  const callClaude = async (apiMessages, systemPrompt) => {
    const res = await fetch(`${FLASK_URL}/api/interview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages, system: systemPrompt }),
    });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `API error ${res.status}`); }
    return (await res.json()).reply;
  };

  // ── Start new interview ──
  const startInterview = async () => {
    if (!setupName.trim()) return;
    setLoading(true);
    setError(null);

    const newId = generateId();
    const name  = setupName.trim();
    const rel   = setupRelationship || "loved one";

    const systemPrompt = buildSystemPrompt(name, rel, 0, false);

    const seedMsg = {
      role: "user",
      content: `I'd like to create a memorial for ${name}. My relationship to them: ${rel}. Please warmly welcome me and ask your first gentle question to begin.`,
    };

    try {
      const reply = await callClaude([seedMsg], systemPrompt);
      const initMessages = [
        { role: "user", content: seedMsg.content, hidden: true },
        { role: "assistant", content: reply },
      ];

      const newMemorial = {
        id: newId, name, relationship: rel,
        messages: initMessages,
        answeredCount: 0,
        savedAt: new Date().toISOString(),
      };

      saveMemorial(newMemorial);
      setMemorials(loadAllMemorials());
      setActiveId(newId);
      setMessages(initMessages);
      setAnsweredCount(0);
      setCurrentDepth("easy");
      setSetupName(""); setSetupRelationship("");
      setScreen("interview");
    } catch (e) {
      setError("Couldn't connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Send answer ──
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText    = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "50px";

    const newAnswered = answeredCount + 1;
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setAnsweredCount(newAnswered);
    setLoading(true);
    setError(null);

    const isFinal = newAnswered >= ANSWERS_NEEDED - 1;

    if (newAnswered >= 6) setCurrentDepth("deep");
    else if (newAnswered >= 3) setCurrentDepth("medium");
    else setCurrentDepth("easy");

    const systemPrompt = getSystemPrompt(newAnswered, newMessages);

    try {
      const apiMsgs = newMessages
        .filter(m => !m.hidden)
        .map(m => ({ role: m.role, content: m.content }));

      if (isFinal) {
        apiMsgs.push({
          role: "user",
          content: "This is the last question. Please give a warm, heartfelt closing message that honours everything shared in this conversation.",
        });
      }

      const reply = await callClaude(apiMsgs, systemPrompt);
      const updatedMessages = [...newMessages, { role: "assistant", content: reply }];
      setMessages(updatedMessages);

      if (isFinal) {
        const completedMemorial = memorials.find(m => m.id === activeId);
        if (completedMemorial) {
          const finalMemorial = { ...completedMemorial, messages: updatedMessages };
          localStorage.setItem("enduring_mementos_progress", JSON.stringify(finalMemorial));
          await saveToBackend(finalMemorial, "complete");
        }
        deleteMemorial(activeId);
        setMemorials(loadAllMemorials());
        setTimeout(() => setScreen("complete"), 2200);
      }

    } catch (e) {
      setError("Something went wrong. Please try again.");
      setMessages(newMessages.slice(0, -1));
      setAnsweredCount(newAnswered - 1);
    } finally {
      setLoading(false);
    }
  };

  // ── Skip ──
  const skipQuestion = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    const skippedMessages = [
      ...messages,
      { role: "user", content: "I'd like to skip this one.", skipped: true },
    ];
    setMessages(skippedMessages);

    const systemPrompt = getSystemPrompt(answeredCount, messages);

    try {
      const apiMsgs = [
        ...messages.filter(m => !m.hidden && !m.skipped).map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: "I'd like to skip that question. Please gently acknowledge that and move on to a different topic." },
      ];

      const reply = await callClaude(apiMsgs, systemPrompt);
      setMessages([...skippedMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setError("Something went wrong. Please try again.");
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const progress        = Math.min((answeredCount / ANSWERS_NEEDED) * 100, 100);
  const visibleMessages = messages.filter(m => !m.hidden);
  const atLimit         = memorials.length >= MAX_MEMORIALS;

  return (
    <>
      <style>{styles}</style>
      <div className="interview-page">

        {/* ── DASHBOARD ── */}
        {screen === "dashboard" && (
          <div className="dashboard-screen">
            <div className="dashboard-inner">
              <p className="dashboard-label">Your Memorials</p>
              <h1 className="dashboard-title">
                {memorials.length === 0 ? <>Begin a <em>memorial</em></> : <>Continue <em>a memorial</em></>}
              </h1>
              <p className="dashboard-sub">
                {memorials.length === 0
                  ? "Take 10–15 minutes to answer a few gentle questions. Your progress is always saved."
                  : `You have ${memorials.length} memorial${memorials.length > 1 ? "s" : ""} in progress. You can have up to ${MAX_MEMORIALS} open at once.`}
              </p>

              {memorials.length > 0 && (
                <div className="memorial-list">
                  {memorials.map(m => {
                    const pct = Math.min(((m.answeredCount || 0) / ANSWERS_NEEDED) * 100, 100);
                    return (
                      <div key={m.id} className="memorial-card-dash"
                        onClick={() => openMemorial(m)} role="button" tabIndex={0}
                        onKeyDown={e => e.key === "Enter" && openMemorial(m)}>
                        <div className="memorial-card-dash-info">
                          <p className="mcd-name">{m.name}</p>
                          <p className="mcd-meta">{m.relationship} · saved {formatDate(m.savedAt)}</p>
                        </div>
                        <div className="mcd-right">
                          <span className="mcd-count">{m.answeredCount || 0} / {ANSWERS_NEEDED} answered</span>
                          <div className="mcd-bar"><div className="mcd-bar-fill" style={{ width: `${pct}%` }} /></div>
                        </div>
                        <button className="mcd-delete" onClick={e => confirmDelete(e, m.id)}
                          aria-label={`Delete memorial for ${m.name}`} title="Delete">×</button>
                      </div>
                    );
                  })}
                </div>
              )}

              {atLimit && (
                <div className="limit-notice">
                  You have {MAX_MEMORIALS} memorials in progress — the maximum. Please complete or remove one before starting another.
                </div>
              )}

              <button className="btn-new-memorial" onClick={() => setScreen("consent")} disabled={atLimit}>
                {memorials.length === 0 ? "Begin a Memorial →" : "+ Start Another Memorial"}
              </button>
            </div>
          </div>
        )}

        {/* ── CONSENT ── */}
        {screen === "consent" && (
          <div className="consent-screen">
            <div className="consent-card">
              <p className="consent-label">Before You Begin</p>
              <h1 className="consent-title">A few things<br /><em>to know</em></h1>
              <p className="consent-body">
                Enduring Mementos is a memorial creation tool grounded in grief counselling
                principles. It is not a clinical service or therapy, and it does not simulate
                or recreate your loved one. Everything in your memorial will be written in your
                own words — we simply help you find them.
              </p>
              <ul className="consent-points">
                <li>Your memories and photos are private and will never be used to train AI models or shared with third parties.</li>
                <li>Your content is retained for 90 days on the free tier. You can export or delete it at any time.</li>
                <li>You can skip any question, pause, and return whenever you're ready — there is no pressure.</li>
                <li>If you are experiencing significant distress, we encourage you to speak with a qualified grief counsellor alongside using this platform.</li>
              </ul>
              <label className="consent-check-row">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={e => setConsentChecked(e.target.checked)}
                />
                <span className="consent-check-label">
                  I understand that Enduring Mementos is a <strong>memorial creation tool</strong>, not a clinical service, and I agree to the use of my data as described above.
                </span>
              </label>
              <div className="consent-actions">
                <button
                  className="btn-consent-proceed"
                  onClick={() => { setConsentChecked(false); setScreen("setup"); }}
                  disabled={!consentChecked}
                >
                  I Understand — Continue →
                </button>
                <button className="btn-back-link" onClick={() => setScreen("dashboard")}>← Back to my memorials</button>
              </div>
            </div>
          </div>
        )}

        {/* ── SETUP ── */}
        {screen === "setup" && (
          <div className="setup-screen">
            <div className="setup-card">
              <p className="setup-label">New Memorial</p>
              <h1 className="setup-title">Tell us about<br /><em>who you loved</em></h1>
              <p className="setup-desc">
                We'll guide you through a gentle conversation to capture their story.
                You can skip anything that feels too hard — and we'll come back to it.
              </p>

              {error && <div className="error-banner">{error}</div>}

              <div className="setup-field">
                <label>Their Name</label>
                <input type="text" placeholder="e.g. Margaret Rose Ellison"
                  value={setupName} onChange={e => setSetupName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && setupName.trim() && startInterview()} />
              </div>

              <div className="setup-field">
                <label>Your Relationship to Them</label>
                <select value={setupRelationship} onChange={e => setSetupRelationship(e.target.value)}>
                  <option value="">Select a relationship…</option>
                  <option value="daughter">Daughter</option>
                  <option value="son">Son</option>
                  <option value="spouse or partner">Spouse or Partner</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="grandchild">Grandchild</option>
                  <option value="grandparent">Grandparent</option>
                  <option value="close friend">Close Friend</option>
                  <option value="aunt">Aunt</option>
                  <option value="uncle">Uncle</option>
                  <option value="other loved one">Other Loved One</option>
                </select>
              </div>

              <div className="setup-actions">
                <button className="btn-start" onClick={startInterview} disabled={!setupName.trim() || loading}>
                  {loading ? "Starting…" : "Begin the Conversation →"}
                </button>
                <button className="btn-back-link" onClick={() => setScreen("consent")}>← Back</button>
              </div>
            </div>
          </div>
        )}

        {/* ── INTERVIEW ── */}
        {screen === "interview" && (
          <div className="interview-screen">
            <div className="interview-header-wrap">
              <div className="interview-header">
                <button className="btn-switch" onClick={goToDashboard}>← My Memorials</button>
                <div className="interview-header-center">
                  <p className="for-label">A Memorial for</p>
                  <p className="interview-name">{activeName}</p>
                </div>
                <span className={`depth-pill ${currentDepth}`}>
                  {currentDepth === "easy" ? "Gentle" : currentDepth === "medium" ? "Reflective" : "Deeper"}
                </span>
              </div>
            </div>

            <div className="progress-wrapper">
              <div className="progress-meta">
                <span className="progress-label">Your story</span>
                <span className="progress-count">{answeredCount} / {ANSWERS_NEEDED} answered</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <div className="messages-area">
              {visibleMessages.map((m, i) =>
                m.skipped ? (
                  <div key={i} className="msg-row skipped-row">
                    <span className="skipped-pill">— moving on, we can come back to this —</span>
                  </div>
                ) : (
                  <div key={i} className={`msg-row ${m.role === "user" ? "user" : ""}`}>
                    <div className={`msg-avatar ${m.role === "user" ? "user-av" : "ai"}`}>
                      {m.role === "user" ? "You" : "✦"}
                    </div>
                    <div className={`msg-bubble ${m.role === "user" ? "user" : "ai"}`}>{m.content}</div>
                  </div>
                )
              )}

              {loading && (
                <div className="msg-row">
                  <div className="msg-avatar ai">✦</div>
                  <div className="typing-indicator">
                    <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {answeredCount >= ANSWERS_NEEDED - 1 && (
              <div style={{ textAlign: 'center', padding: '12px 0 4px' }}>
                <button className="btn-view" onClick={() => {
                  const completedMemorial = memorials.find(m => m.id === activeId);
                  if (completedMemorial) {
                    const finalMemorial = { ...completedMemorial, messages, answeredCount };
                    localStorage.setItem("enduring_mementos_progress", JSON.stringify(finalMemorial));
                    saveToBackend(finalMemorial, "complete");
                  }
                  deleteMemorial(activeId);
                  setMemorials(loadAllMemorials());
                  setScreen("complete");
                }}>
                  View Your Memorial →
                </button>
              </div>
            )}

            <div className="input-area">
              <div className="input-row">
                <textarea ref={textareaRef} className="input-box"
                  placeholder="Share a memory, a feeling, a story…"
                  value={input} onChange={e => { setInput(e.target.value); autoResize(e); }}
                  onKeyDown={handleKeyDown} rows={1} disabled={loading} />
                <button className="send-btn" onClick={sendMessage}
                  disabled={!input.trim() || loading} aria-label="Send">➤</button>
              </div>
              <div className="input-footer">
                <span className="input-hint">Enter to send · Shift+Enter for new line · Auto-saved</span>
                <button className="btn-skip" onClick={skipQuestion} disabled={loading}>
                  Skip this question →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── COMPLETE ── */}
        {screen === "complete" && (
          <div className="complete-screen">
            <div className="complete-card">
              <div className="complete-icon">🕊️</div>
              <h2>Your memorial for<br /><em>{activeName}</em> is ready</h2>
              <p>Thank you for sharing these precious memories. We've captured a beautiful portrait of {activeName} — a tribute that honours who they truly were.</p>
              <div className="complete-actions">
                <button className="btn-view" onClick={() => window.location.href = "/#/memorial"}>View Your Memorial</button>
                <button className="btn-outline" onClick={goToDashboard}>Back to My Memorials</button>
              </div>
            </div>
          </div>
        )}

        {/* ── DELETE MODAL ── */}
        {deleteTarget && (
          <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <h3>Delete this memorial?</h3>
              <p>This will permanently delete the memorial for <strong>{memorials.find(m => m.id === deleteTarget)?.name}</strong>. This cannot be undone.</p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button className="btn-confirm-delete" onClick={executeDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* ── GRIEF SUPPORT FOOTER — visible on all screens ── */}
        <GriefSupportBar />

      </div>
    </>
  );
}
