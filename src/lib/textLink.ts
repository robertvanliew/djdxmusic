import { trackEvent } from './analytics';

// DJ DX's text line (supplied 2026-09-30). Shown as a "Text" option next to
// the booking forms because many phone visitors will send a text but will
// not fill out a form.
export const TEXT_NUMBER = '+16464703469';
export const TEXT_NUMBER_DISPLAY = '646-470-3469';

// `?&body=` is the form that prefills the message on both iOS and Android.
export const textHref = (body = "Hi DJ DX, I'd like to check a date for my event: ") =>
  `sms:${TEXT_NUMBER}?&body=${encodeURIComponent(body)}`;

// GA4 event so text taps can be counted as leads alongside form_submit.
export const trackTextClick = (location: string) => trackEvent('text_click', { location });
