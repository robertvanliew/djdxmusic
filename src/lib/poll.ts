// Shared constants + client for the Office Party Music Poll.
// The option lists are duplicated in api/poll.ts (api/ can't import from src/);
// change them in both places.

export const GENRES = ['R&B/Soul', 'Hip-Hop', 'Pop', 'House/Dance', 'Afrobeats/Amapiano', 'Latin/Reggaeton', 'Old School/Classic', 'Disco/Funk', 'Rock', 'Country', 'Jersey Club'] as const;
export const ERAS = ['70s', '80s', '90s', '2000s', '2010s', 'Today'] as const;
export const EVENT_TYPES = ['Holiday party', 'Office party', 'Company celebration', 'Team offsite', 'Other'] as const;
export const HEADCOUNTS = ['Under 50', '50-100', '100-250', '250+'] as const;
export const LOCATIONS = ['NYC', 'NJ', 'Long Island/Westchester', 'CT', 'Other'] as const;
export const ENERGY_LABELS = ['Background vibes', 'Easygoing', 'Mixed', 'Up on my feet', 'Keep me dancing all night'] as const;

export interface PublicPoll {
  id: string; company: string; eventType: string; genres: string[];
  allowSongs: boolean; allowDnp: boolean; cleanOnly: boolean; open: boolean; publicResults: boolean;
}
export interface Ranked { label: string; count: number; art?: string }
export interface PollResults {
  id: string; admin: boolean; open: boolean; closesAt: number; publicResults: boolean;
  settings: { genres: string[]; allowSongs: boolean; allowDnp: boolean; cleanOnly: boolean };
  planner: { name?: string; email?: string; company: string; eventType: string; eventDate?: string; headcount?: string; location?: string };
  total: number; lastVoteAt: number | null;
  genres: Ranked[]; eras: Ranked[]; energyAvg: number | null; songs: Ranked[]; doNotPlay: Ranked[];
}

export async function pollApi<T>(action: string, opts: { method?: 'GET' | 'POST'; query?: Record<string, string>; body?: unknown } = {}): Promise<T> {
  const q = new URLSearchParams({ a: action, ...(opts.query || {}) });
  const r = await fetch(`/api/poll?${q}`, {
    method: opts.method || 'GET',
    headers: opts.body ? { 'Content-Type': 'application/json' } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((data as { error?: string }).error || 'Something went wrong. Please try again.');
  return data as T;
}

// Plain-language crowd summary from simple rules. It names the actual top
// genres/eras and energy rather than reaching for generic hype, and it says
// less when there are too few votes to say much.
export function crowdProfile(r: PollResults): string {
  if (r.total === 0) return 'No votes yet. Share the voting link and the crowd profile will build as people vote.';
  const pct = (c: number) => Math.round((c / r.total) * 100);
  const g = r.genres.filter(x => x.count > 0);
  const e = r.eras.filter(x => x.count > 0);
  const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
  const topG = g.slice(0, g[1] && g[1].count >= g[0].count * 0.7 ? 2 : 1).map(x => x.label);
  const topE = e.slice(0, e[1] && e[1].count >= e[0].count * 0.7 ? 2 : 1).map(x => x.label);
  const en = r.energyAvg ?? 3;

  const parts: string[] = [];
  const eraTxt = topE.length ? `${list(topE)} ` : '';
  parts.push(`Your team leans ${eraTxt}${list(topG)}`.trim() + (g[0] ? `, with ${g[0].label} picked by ${pct(g[0].count)}% of voters.` : '.'));

  if (en >= 4) parts.push('Energy is high: most people want to dance, so plan for an open floor early rather than a long background set.');
  else if (en >= 3) parts.push('Energy sits in the middle: start with conversation-friendly music over drinks and dinner, then build to a floor once the room warms up.');
  else parts.push('Energy is low-key: this crowd wants music they can talk over, so think polished background with a short dance window rather than a full club set.');

  const oldest = e.find(x => ['70s', '80s'].includes(x.label));
  const newest = e.find(x => ['2010s', 'Today'].includes(x.label));
  if (oldest && newest && oldest.count >= r.total * 0.25 && newest.count >= r.total * 0.25) {
    parts.push('The eras are split between older classics and current music, so the set should move between the two rather than committing to one.');
  }
  if (r.songs[0] && r.songs[0].count >= 2) parts.push(`"${r.songs[0].label}" is the most-requested song.`);
  if (r.total < 5) parts.push(`With ${r.total} vote${r.total === 1 ? '' : 's'} so far, treat this as an early read.`);
  return parts.join(' ');
}

// Per-device "already voted" flag. Storage can be blocked (private mode,
// cleared site data), so every access is guarded and failure means "not voted".
export const votedKey = (id: string) => `djdx_poll_voted_${id}`;
export function hasVoted(id: string): boolean {
  try { return localStorage.getItem(votedKey(id)) === '1'; } catch { return false; }
}
export function markVoted(id: string) {
  try { localStorage.setItem(votedKey(id), '1'); } catch { /* ignore */ }
}
