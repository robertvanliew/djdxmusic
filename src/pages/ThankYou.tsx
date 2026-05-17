import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

export default function ThankYou() {
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
    // Try to grab the email from the URL if Stripe added it
    const params = new URLSearchParams(window.location.search);
    const sessionEmail = params.get('email');
    if (sessionEmail) setEmail(sessionEmail);
  }, []);

  return (
    <>
      <Helmet>
        <title>Thank You — Your DJ DX Music Order</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.djdxmusic.com/thank-you" />
      </Helmet>

      <SiteNav />

      <main style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 80px',
        background: 'var(--dark)',
      }}>
        <div style={{
          maxWidth: '640px',
          width: '100%',
          textAlign: 'center',
        }}>
          {/* Gold checkmark icon */}
          <div style={{
            width: '88px',
            height: '88px',
            margin: '0 auto 32px',
            borderRadius: '50%',
            background: 'rgba(201,168,76,0.12)',
            border: '2px solid var(--gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <div className="sec-overline" style={{ justifyContent: 'center', marginBottom: '12px' }}>
            <span className="sec-label">Payment Confirmed</span>
          </div>

          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: 'var(--white)',
            lineHeight: 1.1,
            marginBottom: '20px',
          }}>
            Thank you for your purchase
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(242,242,242,0.7)',
            lineHeight: 1.7,
            marginBottom: '36px',
          }}>
            Your DJ DX music download is on the way. Check{' '}
            <strong style={{ color: 'var(--gold)' }}>{email || 'your email inbox'}</strong>{' '}
            in the next 1&ndash;2 minutes for the secure download link.
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: '8px',
            padding: '28px 32px',
            marginBottom: '36px',
            textAlign: 'left',
          }}>
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '18px',
            }}>What happens next</h2>

            <ol style={{
              paddingLeft: '24px',
              margin: 0,
              fontSize: '0.98rem',
              lineHeight: 1.85,
              color: 'rgba(242,242,242,0.75)',
            }}>
              <li>An email from <strong style={{ color: 'var(--white)' }}>noreply@djdxmusic.com</strong> will arrive within 1&ndash;2 minutes.</li>
              <li>The email contains a <strong style={{ color: 'var(--white)' }}>secure download link</strong> for each track you purchased.</li>
              <li>Links are <strong style={{ color: 'var(--white)' }}>valid for 2 hours</strong> &mdash; download right away to keep a copy.</li>
              <li>Tracks are delivered as high-quality MP3 files.</li>
            </ol>
          </div>

          <div style={{
            background: 'rgba(255,193,7,0.05)',
            border: '1px solid rgba(255,193,7,0.18)',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '40px',
            fontSize: '0.92rem',
            color: 'rgba(242,242,242,0.7)',
            lineHeight: 1.7,
            textAlign: 'left',
          }}>
            <strong style={{ color: '#FFC107' }}>Don't see the email?</strong>{' '}
            Check your <strong style={{ color: 'var(--white)' }}>Spam</strong> or{' '}
            <strong style={{ color: 'var(--white)' }}>Promotions</strong> folder.{' '}
            If you still can&apos;t find it after 5 minutes, email{' '}
            <a href="mailto:support@djdxmusic.com" style={{ color: 'var(--gold)' }}>support@djdxmusic.com</a>{' '}
            with your purchase email and we&apos;ll resend the link.
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            <Link to="/music" className="btn-gold">
              Browse More Music
            </Link>
            <Link to="/" className="btn-gold" style={{
              background: 'transparent',
              border: '1px solid var(--gold)',
              color: 'var(--gold)',
            }}>
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
