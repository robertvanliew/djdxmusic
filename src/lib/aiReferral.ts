import { trackEvent } from './analytics';

// Detects visitors who arrived from an AI assistant (ChatGPT, Perplexity,
// Claude, Gemini, Copilot...) and remembers it for the session, so every
// inquiry email says where the lead came from. ChatGPT also appends
// utm_source=chatgpt.com to links it cites.
const KEY = 'djdx_ai_ref';
const SOURCES: [RegExp, string][] = [
  [/chatgpt\.com|chat\.openai\.com|openai/i, 'ChatGPT'],
  [/perplexity/i, 'Perplexity'],
  [/claude\.ai|anthropic/i, 'Claude'],
  [/gemini\.google|bard\.google/i, 'Gemini'],
  [/copilot\.microsoft|bing\.com\/chat|copilot/i, 'Copilot'],
  [/you\.com/i, 'You.com'],
  [/meta\.ai/i, 'Meta AI'],
  [/grok|x\.ai/i, 'Grok'],
];

export interface AiReferral { source: string; landing: string; at: string }

export function captureAiReferral() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const utm = new URLSearchParams(window.location.search).get('utm_source') || '';
    const ref = document.referrer || '';
    const hit = SOURCES.find(([re]) => re.test(utm) || re.test(ref));
    if (!hit) return;
    const data: AiReferral = { source: hit[1], landing: window.location.pathname, at: new Date().toISOString() };
    sessionStorage.setItem(KEY, JSON.stringify(data));
    trackEvent('ai_referral', { ai_source: hit[1], landing_page: data.landing });
  } catch { /* storage blocked: nothing to remember */ }
}

export function getAiReferral(): AiReferral | null {
  try { const v = sessionStorage.getItem(KEY); return v ? JSON.parse(v) : null; } catch { return null; }
}
