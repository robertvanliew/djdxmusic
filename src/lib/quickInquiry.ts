import { trackLead, trackFormSubmit, trackFormError } from './analytics';
import { getAiReferral } from './aiReferral';

// One quick inquiry to /api/booking (quick: true). Shared by the sticky-bar
// form and the "Check your date" dialog so both send leads identically. An
// email address also places a free 72-hour hold on the date.
export type QuickFields = { name: string; contact: string; eventDate: string; eventType: string; company?: string };
export type QuickResult = { heldUntil: number | null };

export async function submitQuickInquiry(fields: QuickFields, formName: string, startedAt: number, extra: Record<string, unknown> = {}): Promise<QuickResult> {
  trackFormSubmit(formName);
  const metaEventId = crypto.randomUUID();
  const isEmail = fields.contact.includes('@');
  try {
    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(() => { const r = getAiReferral(); return r ? { aiReferral: r.source, aiLanding: r.landing } : {}; })(),
        quick: true,
        hold: isEmail,
        name: fields.name,
        email: isEmail ? fields.contact : '',
        phone: isEmail ? '' : fields.contact,
        eventType: fields.eventType,
        eventDate: fields.eventDate,
        honeypot: fields.company ?? '',
        elapsedMs: Date.now() - startedAt,
        metaEventId,
        pageUrl: window.location.href,
        ...extra,
      }),
    });
    if (!res.ok) throw new Error(`http_${res.status}`);
    const body = await res.json().catch(() => ({}));
    trackLead({ form: formName, event_type: fields.eventType }, metaEventId);
    return { heldUntil: body?.hold?.status === 'held' ? body.hold.expiresAt : null };
  } catch (err) {
    trackFormError(formName, err instanceof Error ? err.message : 'network_error');
    throw err;
  }
}
