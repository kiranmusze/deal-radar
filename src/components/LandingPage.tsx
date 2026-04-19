import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Theme } from '../hooks/useTheme';

const BUTTONDOWN_SLUG = 'valorem-capital';
const GITHUB_URL = 'https://github.com/kiranmusze/deal-radar';
const NOTION_URL = 'https://valorem.notion.site/deal-radar-anleitung';
const LINKEDIN_URL = 'https://www.linkedin.com/in/kiran-banakar/';

interface LandingPageProps {
  onStartDemo: () => void;
  onStartLive: () => void;
  onOpenTransparency: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function LandingPage({ onStartDemo, onStartLive, onOpenTransparency, theme, onToggleTheme }: LandingPageProps) {
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)' }}>

      {/* ── Navigation ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '56px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RadarIcon />
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gold)' }}>Deal Radar</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginLeft: '2px' }}>by Valorem Capital</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <NavLink href={GITHUB_URL} label="GitHub" icon={<GithubIcon />} />
          <button onClick={onOpenTransparency} style={navBtnStyle}>Transparenz</button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button onClick={onStartDemo} style={{
            background: 'var(--gold)', border: 'none', borderRadius: '7px',
            padding: '7px 16px', color: theme === 'dark' ? '#0a0a12' : '#fff',
            fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
          }}>
            Jetzt starten
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
          borderRadius: '100px', padding: '4px 14px', marginBottom: '28px',
          fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 500,
        }}>
          <span>Open Source · BYOK · Kein Backend</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
          Finde deutsche Unternehmen<br />
          <span className="gradient-text">mit Nachfolgepotenzial.</span>
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 36px', lineHeight: 1.65 }}>
          Beschreibe in natürlicher Sprache, was du suchst. Deal Radar durchsucht
          4+ Millionen deutsche Unternehmen, analysiert die Ergebnisse mit KI
          und präsentiert dir strukturierte Daten — direkt im Chat.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onStartDemo} style={heroPrimaryBtn(theme)}>
            Demo starten (kostenlos)
            <ArrowRight />
          </button>
          <button onClick={onStartLive} style={heroSecondaryBtn}>
            Mit eigenen API-Keys
          </button>
        </div>

        <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
          Demo ohne Keys · Live-Modus mit OpenRegister + Anthropic Key (~0,15 EUR/Suche)
        </p>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '20px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {[
            { value: '4+ Mio.', label: 'deutsche Unternehmen' },
            { value: '~0,15 €', label: 'pro Suche' },
            { value: 'BYOK', label: 'Bring Your Own Key' },
            { value: '100 %', label: 'Open Source' },
          ].map((s) => (
            <div key={s.value} style={{ textAlign: 'center' }}>
              <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--gold)' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px' }}>
        <SectionLabel>Wie es funktioniert</SectionLabel>
        <h2 style={sectionH2}>In drei Schritten zur Dealflow-Pipeline</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '32px' }}>
          <StepCard n="1" title="Beschreibe dein Ziel" body="Schreib in natürlicher Sprache, welche Unternehmen du suchst — Branche, Region, Inhaberalter, Umsatz, Mitarbeiter." />
          <StepCard n="2" title="KI parst & sucht" body="Claude versteht deine Anfrage, wandelt sie in strukturierte Filter um und durchsucht 4+ Mio. Unternehmen via OpenRegister." />
          <StepCard n="3" title="Analysiere & exportiere" body="Ergebnisse mit Nachfolge-Score, Finanzkennzahlen und KI-Analyse. CSV-Export mit einem Klick." />
        </div>
      </section>

      {/* ── Security / BYOK ── */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '64px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SectionLabel>Sicherheit & Datenschutz</SectionLabel>
          <h2 style={sectionH2}>Deine Daten gehören dir — und nur dir.</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px', marginBottom: '36px', lineHeight: 1.65 }}>
            Deal Radar wurde von Grund auf ohne Backend gebaut. Es gibt keinen Server,
            keine Datenbank, kein Tracking. Du behältst die vollständige Kontrolle.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <SecurityCard icon="🔑" title="BYOK — Bring Your Own Key" body="Deine API-Keys für OpenRegister und Anthropic werden ausschließlich in deinem Browser-Speicher (localStorage) gehalten. Kein Server sieht sie." />
            <SecurityCard icon="🚫" title="Kein Backend" body="Alle API-Calls laufen direkt von deinem Browser. Kein Proxy, kein Middleware, kein Logging auf unserer Seite." />
            <SecurityCard icon="👁" title="Gläsernes Tool" body="Jeder API-Call wird dir im Chat angezeigt — mit Request, Response, Latenz und Kosten. Du siehst alles, was passiert." />
            <SecurityCard icon="📖" title="Open Source" body="Der vollständige Quellcode liegt auf GitHub. Prüf selbst, was das Tool tut. Fork es, host es selbst — MIT Lizenz." />
          </div>
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={onOpenTransparency} style={heroSecondaryBtn}>
              Transparenz-Seite ansehen →
            </button>
            <NavLink href={GITHUB_URL} label="Quellcode auf GitHub" icon={<GithubIcon />} styled />
          </div>
        </div>
      </section>

      {/* ── Preset examples ── */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px' }}>
        <SectionLabel>Beispiel-Anfragen</SectionLabel>
        <h2 style={sectionH2}>Was du mit Deal Radar findest</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '28px' }}>
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              onClick={onStartDemo}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '8px 14px',
                color: 'var(--text-secondary)', fontSize: '0.82rem',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = 'var(--border-gold)';
                el.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = 'var(--border)';
                el.style.color = 'var(--text-secondary)';
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* ── Links / Resources ── */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <ResourceCard href={GITHUB_URL} icon={<GithubIcon size={18} />} title="GitHub Repository" body="Vollständiger Quellcode, Issues, PRs. MIT-Lizenz — fork und selbst hosten." />
          <ResourceCard href={NOTION_URL} icon={<NotionIcon />} title="Setup-Anleitung" body="Schritt-für-Schritt: OpenRegister Key holen, Anthropic Key einrichten, erste Suche starten." />
          <ResourceCard href={LINKEDIN_URL} icon={<LinkedinIcon />} title="Kiran auf LinkedIn" body="Ich baue kostenlose Tools für Micro-PE. Folge mir für Updates zu neuen Tools." />
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section style={{ maxWidth: '560px', margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
        <SectionLabel>Newsletter</SectionLabel>
        <h2 style={{ ...sectionH2, fontSize: '1.5rem' }}>Neue Tools als Erster erfahren</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6, marginTop: '10px', fontSize: '0.9rem' }}>
          Ich baue regelmäßig kostenlose Tools für den Micro-PE-Bereich.
          Kein Spam, jederzeit abmeldbar.
        </p>

        {newsletterSubmitted ? (
          <div style={{
            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '10px', padding: '20px',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>✓</div>
            <div style={{ fontWeight: 500 }}>Danke! Bitte bestätige deine Email.</div>
          </div>
        ) : (
          <form
            action={`https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_SLUG}`}
            method="post"
            target="popupwindow"
            onSubmit={() => setNewsletterSubmitted(true)}
            style={{ display: 'flex', gap: '8px', maxWidth: '440px', margin: '0 auto' }}
          >
            <input type="hidden" name="tag" value="deal-radar-landing" />
            <input
              type="email"
              name="email"
              placeholder="deine@email.de"
              required
              style={{
                flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '10px 14px',
                color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
              }}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--border-gold)'; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; }}
            />
            <button type="submit" style={heroPrimaryBtn(theme)}>
              Eintragen
            </button>
          </form>
        )}
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginTop: '12px' }}>
          <a href="https://valorem.capital/datenschutz" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Datenschutz</a>
          {' '}· Double-Opt-in via Buttondown
        </p>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap',
      }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
          © {new Date().getFullYear()} Valorem Capital · MIT License
        </span>
        <FooterLink href={GITHUB_URL} label="GitHub" />
        <FooterLink href={NOTION_URL} label="Setup-Anleitung" />
        <FooterLink href={LINKEDIN_URL} label="LinkedIn" />
        <button onClick={onOpenTransparency} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: '0.78rem', textDecoration: 'underline',
        }}>
          Transparenz
        </button>
      </footer>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function RadarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" stroke="var(--gold)" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="7" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
      <circle cx="16" cy="16" r="2.5" fill="var(--gold)" />
      <line x1="16" y1="2" x2="16" y2="7" stroke="var(--gold)" strokeWidth="1.5" />
      <line x1="16" y1="25" x2="16" y2="30" stroke="var(--gold)" strokeWidth="1.5" />
      <line x1="2" y1="16" x2="7" y2="16" stroke="var(--gold)" strokeWidth="1.5" />
      <line x1="25" y1="16" x2="30" y2="16" stroke="var(--gold)" strokeWidth="1.5" />
    </svg>
  );
}

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function NotionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.934zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933l3.222-.187z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '4px' }}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 600,
      letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px',
    }}>
      {children}
    </div>
  );
}

function StepCard({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '24px 20px',
    }}>
      <div className="mono" style={{
        fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 700,
        letterSpacing: '0.08em', marginBottom: '10px',
      }}>
        SCHRITT {n}
      </div>
      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px' }}>{title}</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.55 }}>{body}</div>
    </div>
  );
}

function SecurityCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '20px',
    }}>
      <div style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>{title}</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.55 }}>{body}</div>
    </div>
  );
}

function ResourceCard({ href, icon, title, body }: { href: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block', textDecoration: 'none',
        background: 'var(--bg)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '20px', transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-gold)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'; }}
    >
      <div style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px', color: 'var(--text-primary)' }}>{title}</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>{body}</div>
    </a>
  );
}

function NavLink({ href, label, icon, styled }: { href: string; label: string; icon?: React.ReactNode; styled?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        color: 'var(--text-secondary)', textDecoration: 'none',
        fontSize: '0.8rem', padding: styled ? '6px 12px' : '0',
        background: styled ? 'var(--surface)' : 'transparent',
        border: styled ? '1px solid var(--border)' : 'none',
        borderRadius: styled ? '6px' : '0',
        transition: 'color 0.15s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'; }}
    >
      {icon}
      {label}
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.78rem' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'; }}
    >
      {label}
    </a>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

function heroPrimaryBtn(theme: Theme): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center',
    background: 'var(--gold)', border: 'none', borderRadius: '8px',
    padding: '12px 22px', color: theme === 'dark' ? '#0a0a12' : '#fff',
    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
    transition: 'opacity 0.15s',
  };
}

const heroSecondaryBtn: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: '8px', padding: '12px 22px',
  color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer',
  transition: 'border-color 0.15s',
};

const navBtnStyle: React.CSSProperties = {
  background: 'transparent', border: 'none', cursor: 'pointer',
  color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '4px 8px',
};

const sectionH2: React.CSSProperties = {
  fontSize: '1.8rem', fontWeight: 700, lineHeight: 1.25,
  letterSpacing: '-0.02em', margin: 0,
};

const EXAMPLE_QUERIES = [
  'Inhabergeführte GmbHs in Bayern, Maschinenbau, Inhaber 65+',
  'IT-Dienstleister Berlin, 5-20 MA, Inhaber über 55',
  'Bau-GmbHs in NRW, schuldenfrei, Inhaber 60+',
  'Healthcare GmbHs, inhabergeführt, Inhaber 58+',
  'GmbHs mit Eigenkapital > 500k, Umsatz < 3 Mio.',
  'Logistik-Unternehmen, Inhaber 60+, 20-100 MA',
  'Ostdeutschland, gegründet 1990-2000, Inhaber 58+',
  'Süddeutscher Maschinenbau, 20-80 MA, Inhaber 62+',
];
