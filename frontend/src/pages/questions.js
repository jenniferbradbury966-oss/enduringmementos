// ─────────────────────────────────────────────────────────────────────────────
// ENDURING MEMENTOS — Conversation Guidance
// ─────────────────────────────────────────────────────────────────────────────
// The question bank is now used ONLY to guide Claude's system prompt with
// topic coverage goals. Claude decides the actual questions based on what
// the user has shared — no more preset question injection.
// ─────────────────────────────────────────────────────────────────────────────

// Coverage categories — Claude is guided to touch on all of these naturally
export const COVERAGE_CATEGORIES = [
  {
    id: "opening",
    label: "Who they were",
    prompt: "Start with a warm opening that invites them to describe their loved one broadly.",
  },
  {
    id: "sensory",
    label: "Sensory memories",
    prompt: "Explore sensory details — their laugh, a smell, a favourite place, what their hands looked like.",
  },
  {
    id: "story",
    label: "Stories & moments",
    prompt: "Draw out a specific story or memory — a time they laughed, a typical day, a moment that was perfectly them.",
  },
  {
    id: "values",
    label: "Character & values",
    prompt: "Explore what they cared about, how they showed love, what they stood for.",
  },
  {
    id: "relationship",
    label: "Your relationship",
    prompt: "Explore the unique bond — inside jokes, what they learned from them, what only they shared.",
  },
  {
    id: "details",
    label: "Small details",
    prompt: "Capture small vivid details — their quirks, phrases, food, music, style.",
  },
  {
    id: "legacy",
    label: "Legacy & impact",
    prompt: "Reflect on how this person changed them, what they carry forward, what their loved one would be proud of.",
  },
  {
    id: "closing",
    label: "Closing reflection",
    prompt: "End with a reflective question — what stands out, what they want remembered, anything left unsaid.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Replace [name] placeholder (kept for backward compatibility)
// ─────────────────────────────────────────────────────────────────────────────
export const personalize = (text, name) =>
  text.replace(/\[name\]/g, name);

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Detect emotional openness from user responses
// ─────────────────────────────────────────────────────────────────────────────
const EMOTIONAL_KEYWORDS = [
  "miss", "love", "cry", "tears", "heart", "hurt", "grief", "grieve",
  "loss", "lost", "hard", "difficult", "wish", "regret", "sorry",
  "afraid", "scared", "alone", "empty", "remember", "forget",
  "thank", "grateful", "blessing",
];

export const detectEmotionalOpenness = (messages) => {
  const userMessages = messages.filter(m => m.role === "user" && !m.hidden && !m.skipped);
  if (userMessages.length < 2) return false;
  const longAnswers = userMessages.filter(m => m.content.length > 120).length;
  const hasEmotionalWords = userMessages.some(m =>
    EMOTIONAL_KEYWORDS.some(kw => m.content.toLowerCase().includes(kw))
  );
  return longAnswers >= 2 || hasEmotionalWords;
};

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM PROMPT — Claude decides questions organically from the conversation
// ─────────────────────────────────────────────────────────────────────────────
export const buildSystemPrompt = (name, relationship, answeredCount = 0, emotionallyOpen = false) => {

  const totalQuestions = 9;
  const remaining = totalQuestions - answeredCount;
  const isFinal = remaining <= 1;
  const isNearingEnd = remaining <= 2;

  // Build coverage guidance based on progress
  const depthGuidance = answeredCount < 3
    ? "Stay gentle and light — this person is just opening up. Stick to easy, warm topics."
    : answeredCount < 6
    ? "You can gently explore a little deeper now. Follow threads the user opens naturally."
    : emotionallyOpen
    ? "This person has opened up emotionally. You may gently explore deeper feelings if it feels right."
    : "Continue warmly. Follow the user's lead on depth.";

  const closingGuidance = isFinal
    ? `This is the FINAL question. Ask a warm closing reflection — something like what stands out most, what they want people to remember about ${name}, or anything left they'd like to add.`
    : isNearingEnd
    ? `You are nearing the end of the interview (${remaining} questions left). Begin steering toward legacy and reflection themes.`
    : "";

  return `
You are a compassionate, unhurried guide helping someone create a lasting memorial for ${name}, their ${relationship}.

YOUR ROLE:
- Help them tell ${name}'s story entirely in their own words
- Ask ONE thoughtful question at a time — never stack questions
- Base your next question on what they just shared — follow the thread of their answer
- Acknowledge what they share warmly before asking the next question (1–2 sentences only)
- Reference earlier things they mentioned naturally ("You mentioned ${name}'s laugh earlier...")
- Always offer permission to skip anything that feels too hard
- Never invent or assume details about ${name}

QUESTION GUIDANCE:
Over the course of this interview (${totalQuestions} questions total, ${answeredCount} answered so far),
naturally weave in questions that cover these areas — but only when they feel organic to the conversation:
- Who ${name} was as a person (personality, character)
- Sensory memories (their laugh, a smell, a favourite place, their hands)
- A specific story or moment that captures them perfectly
- What they valued and how they showed love
- The unique bond between the user and ${name}
- Small vivid details (quirks, phrases, music, food)
- How ${name} has shaped or changed the user
${closingGuidance}

${depthGuidance}

EMOTIONAL GUIDANCE:
- Move at their pace — grief has no timeline
- If they express pain, acknowledge it before continuing
- Never imply they should feel differently than they do
- Never ask about how ${name} died or final moments unless the user brings it up themselves
- If answers are short, stay gentle — don't push deeper
- If answers are long and emotional, you may gently follow that thread

TONE:
- Warm, gentle, unhurried, and celebratory of who ${name} was
- Conversational — not clinical, not like a checklist
- Keep acknowledgements brief (1–2 sentences) so the user's voice stays central

FORMAT:
- Acknowledge (1–2 sentences) + one question
- Never ask more than one question per message
- Do not summarize or editorialize what they've shared — just reflect it warmly
`.trim();
};

// ─────────────────────────────────────────────────────────────────────────────
// Legacy export — kept so Interview.js doesn't break during transition
// These are no longer injected as questions, but exported for compatibility
// ─────────────────────────────────────────────────────────────────────────────
export const QUESTION_BANK = [];
export const getNextQuestion = () => null;