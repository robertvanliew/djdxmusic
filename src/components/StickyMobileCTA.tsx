import { useEffect } from 'react';
import { textHref, trackTextClick } from '../lib/textLink';
import { openBooking } from './BookingHost';

interface Props {
  label?: string;
  formName: string;
  title?: string;
}

// Persistent bottom bar (mobile only, see .sticky-cta-bar's @media rule).
// "Check My Date" opens the site-wide booking dialog (BookingHost /
// BookingDialog) as a bottom sheet, so phone visitors book from anywhere on
// the page instead of scrolling to the in-page form.
export default function StickyMobileCTA({ label = 'Check My Date', formName }: Props) {
  // Reserve space at the bottom of the page so the fixed bar never covers
  // footer content; scoped to a body class since SiteFooter is shared.
  useEffect(() => {
    document.body.classList.add('has-sticky-cta');
    return () => { document.body.classList.remove('has-sticky-cta'); };
  }, []);

  return (
    <div className="sticky-cta-bar">
      <div className="sticky-cta-bar__row">
        <button type="button" className="sticky-cta-bar__btn" onClick={() => openBooking({ source: `sticky_${formName}` })}>
          {label}
        </button>
        <a className="sticky-cta-bar__text" href={textHref()} onClick={() => trackTextClick(`sticky_${formName}`)} aria-label="Text DJ DX">
          Text
        </a>
      </div>
    </div>
  );
}
