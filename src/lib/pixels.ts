// Retargeting/remarketing pixels — Meta, TikTok, Google Ads.
// Each activates independently only if its env var is set, so the site works
// fine with zero, one, two, or all three configured. IDs live in Vercel
// Env Variables (VITE_META_PIXEL_ID, VITE_TIKTOK_PIXEL_ID, VITE_GOOGLE_ADS_ID)
// — not secrets, but kept out of source so they're swappable without a code change.
//
// None of these fire an initial PageView on their own — ScrollManager
// (src/main.tsx) is the single source of page_view/PageView events, firing on
// every route change including the first, so SPA navigation is tracked
// consistently across GA4 + Meta + TikTok without double-counting.

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string };
    _fbq?: unknown;
    ttq?: unknown[] & {
      methods: string[];
      setAndDefer: (t: unknown, e: string) => void;
      load: (id: string) => void;
      page: () => void;
      track: (event: string, params?: Record<string, unknown>, options?: Record<string, unknown>) => void;
      _i?: Record<string, unknown[]>;
      _t?: Record<string, number>;
      _o?: Record<string, unknown>;
    };
    gtag?: (...args: unknown[]) => void;
  }
}

function injectMetaPixel(pixelId: string) {
  if (window.fbq) return;

  const fbq: Window['fbq'] = function (...args: unknown[]) {
    const f = fbq as unknown as { callMethod?: (...a: unknown[]) => void; queue: unknown[] };
    if (f.callMethod) f.callMethod(...args);
    else f.queue.push(args);
  };
  (fbq as unknown as { queue: unknown[] }).queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  window.fbq('init', pixelId);

  const noscript = document.createElement('noscript');
  const img = document.createElement('img');
  img.height = 1;
  img.width = 1;
  img.style.display = 'none';
  img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.body.appendChild(noscript);
}

type Ttq = NonNullable<Window['ttq']>;

function injectTikTokPixel(pixelId: string) {
  if (window.ttq) return;

  // Mirrors TikTok's own base snippet exactly: ttq starts as a real array (so
  // .push works natively as the pre-load event queue), not a function — every
  // generated method (page/track/etc.) just pushes [name, ...args] onto it.
  const ttq = [] as unknown as Ttq;
  ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
  ttq.setAndDefer = (t: unknown, e: string) => {
    (t as Record<string, unknown>)[e] = (...args: unknown[]) => {
      (t as unknown[]).push([e, ...args]);
    };
  };
  ttq.methods.forEach(m => ttq.setAndDefer(ttq, m));
  ttq.load = (id: string) => {
    const src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
    ttq._i = ttq._i || {};
    ttq._i[id] = [];
    ttq._t = ttq._t || {};
    ttq._t[id] = Date.now();
    ttq._o = ttq._o || {};
    const script = document.createElement('script');
    script.async = true;
    script.src = `${src}?sdkid=${id}&lib=ttq`;
    document.getElementsByTagName('script')[0]?.parentNode?.insertBefore(script, document.getElementsByTagName('script')[0]);
  };
  window.ttq = ttq;
  ttq.load(pixelId);
}

function injectGoogleAdsTag(conversionId: string) {
  window.gtag?.('config', conversionId, { send_page_view: false });
}

// Loads the pixels off the critical path. Measured on a 390px iPhone
// viewport, TikTok alone pulled 7.16MB across 323 requests on the homepage
// and it was firing synchronously from main.tsx, so it competed with the page
// for bandwidth and CPU before anything rendered. 93% of sessions are mobile.
//
// Whichever comes first wins: the browser going idle, the first real user
// interaction, or a hard timeout. Attribution is unaffected - a pixel that
// fires a second or two later still records the visit, and a visitor who
// leaves before either event was never going to convert anyway.
export function initTrackingPixelsDeferred() {
  if (typeof window === 'undefined') return;
  let fired = false;
  const EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;

  const run = () => {
    if (fired) return;
    fired = true;
    EVENTS.forEach(e => window.removeEventListener(e, run));
    initTrackingPixels();
  };

  EVENTS.forEach(e => window.addEventListener(e, run, { once: true, passive: true }));

  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
  if (ric) ric(run, { timeout: 5000 });
  else setTimeout(run, 3000);
}

export function initTrackingPixels() {
  const metaId = import.meta.env.VITE_META_PIXEL_ID;
  const tiktokId = import.meta.env.VITE_TIKTOK_PIXEL_ID;
  const googleAdsId = import.meta.env.VITE_GOOGLE_ADS_ID;

  if (metaId) injectMetaPixel(metaId);
  if (tiktokId) injectTikTokPixel(tiktokId);
  if (googleAdsId) injectGoogleAdsTag(googleAdsId);
}
