import { useState, useEffect } from 'react';

const SESSION_KEY_SUBSCRIBED = 'nr_subscribed';
const SESSION_KEY_DISMISSED = 'nr_dismissed';

// Replace with your Buttondown newsletter slug after account setup
const BUTTONDOWN_SLUG = 'valorem-capital';

export function NewsletterBanner() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(SESSION_KEY_DISMISSED);
    const subscribed = sessionStorage.getItem(SESSION_KEY_SUBSCRIBED);
    if (!dismissed && !subscribed) {
      // Slight delay so the results render first
      const t = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_KEY_DISMISSED, 'true');
    setVisible(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    sessionStorage.setItem(SESSION_KEY_SUBSCRIBED, 'true');
    setSubmitted(true);
    // Allow form to open Buttondown popup
    setTimeout(() => setVisible(false), 3000);
    // Don't prevent default — let Buttondown embed handle it
    void e;
  };

  if (!visible) return null;

  return (
    <div
      className="animate-fade-up"
      style={{
        maxWidth: '580px',
        margin: '0 auto 16px',
        background: 'rgba(200,180,140,0.06)',
        border: '1px solid rgba(200,180,140,0.15)',
        borderRadius: '12px',
        padding: '18px 20px',
        position: 'relative',
      }}
    >
      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        style={{
          position: 'absolute',
          top: '10px',
          right: '12px',
          background: 'transparent',
          border: 'none',
          color: '#4a4a5a',
          cursor: 'pointer',
          padding: '2px',
          lineHeight: 1,
          fontSize: '14px',
        }}
        title="Schliessen"
      >
        ✕
      </button>

      {submitted ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#22c55e', fontSize: '1.1rem' }}>✓</span>
          <div>
            <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500 }}>Danke!</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Check deine Inbox für die Bestätigung.</div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>
              Ich baue regelmäßig kostenlose Tools für den Micro-PE-Bereich.
            </div>
            <div style={{ color: '#a8a89a', fontSize: '0.82rem', lineHeight: 1.5 }}>
              Wenn du als Erster davon erfahren willst:
            </div>
          </div>

          <form
            action={`https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_SLUG}`}
            method="post"
            target="popupwindow"
            onSubmit={handleSubmit}
            style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
          >
            <input type="hidden" name="tag" value="deal-radar" />
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              required
              style={{
                flex: '1 1 200px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                minWidth: '0',
              }}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(200,180,140,0.4)'; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--gold)',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                color: '#0a0a12',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Eintragen
            </button>
          </form>

          <div style={{ marginTop: '8px', color: '#6b6b7b', fontSize: '0.72rem' }}>
            Kein Spam. Jederzeit abmeldbar.{' '}
            <a
              href="https://valorem.capital/datenschutz"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}
            >
              Datenschutz
            </a>
          </div>
        </>
      )}
    </div>
  );
}
