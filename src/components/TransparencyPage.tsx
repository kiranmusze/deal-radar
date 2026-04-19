import { ThemeToggle } from './ThemeToggle';
import { Theme } from '../hooks/useTheme';

const GITHUB_URL = 'https://github.com/kiranmusze/deal-radar';

interface TransparencyPageProps {
  onBack: () => void;
  onStartDemo: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function TransparencyPage({ onBack, onStartDemo, theme, onToggleTheme }: TransparencyPageProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(8px)', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px',
      }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: '0.82rem',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Zurück
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gold)' }}>Deal Radar</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>— Transparenz</span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </nav>

      {/* ── Hero ── */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px 48px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
          borderRadius: '100px', padding: '4px 14px', marginBottom: '24px',
          fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 500,
        }}>
          Gläsernes Tool
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
          Wir verstecken nichts.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, maxWidth: '520px', margin: '0 auto' }}>
          Die meisten Tools verstecken ihre Logik. Deal Radar macht das Gegenteil:
          Jeder API-Call, jede Kostenzeile, jede Entscheidung ist für dich einsehbar.
          Das ist kein Feature — das ist Prinzip.
        </p>
      </section>

      {/* ── Section 1: API Calls ── */}
      <TransparencySection
        number="01"
        title="Jeder API-Call ist sichtbar"
        color="#60a5fa"
      >
        <p style={bodyText}>
          Unter jeder Antwort im Chat erscheint ein aufklappbares Panel, das dir genau zeigt:
          welche APIs aufgerufen wurden, mit welchen Parametern, was zurückkam — und was es gekostet hat.
        </p>
        <MockApiPanel />
        <ul style={featureList}>
          <li>Welcher Endpoint wurde angefragt (<code style={codeStyle}>POST /v1/messages</code> oder <code style={codeStyle}>POST /v1/search/company</code>)</li>
          <li>Vollständiger Request-Body (API-Keys werden auf die letzten 4 Zeichen maskiert)</li>
          <li>Vollständige Response (bei großen Ergebnissen gekürzt)</li>
          <li>Latenz in Millisekunden</li>
          <li>Geschätzte Kosten in EUR und OpenRegister-Credits</li>
        </ul>
        <InfoBox color="#60a5fa">
          Du kannst jeden JSON-Block mit einem Klick in die Zwischenablage kopieren.
        </InfoBox>
      </TransparencySection>

      {/* ── Section 2: BYOK ── */}
      <TransparencySection
        number="02"
        title="Deine Keys — deine Kontrolle"
        color="var(--gold)"
        alt
      >
        <p style={bodyText}>
          Deal Radar folgt dem BYOK-Prinzip (Bring Your Own Key). Du bringst deine eigenen
          API-Keys mit — für OpenRegister und für Anthropic. Diese Keys werden
          <strong style={{ color: 'var(--text-primary)' }}> ausschließlich in deinem Browser</strong> gespeichert.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', margin: '20px 0' }}>
          <InfoCard title="localStorage" body="Keys liegen in localStorage deines Browsers — nicht auf unserem Server, weil es keinen gibt." icon="🔑" />
          <InfoCard title="Kein Proxy" body="Alle API-Calls gehen direkt von deinem Browser an anthropic.com und openregister.de." icon="🚫" />
          <InfoCard title="Jederzeit löschbar" body='Klick auf "Loeschen" im Key-Dialog oder leere localStorage direkt in den DevTools.' icon="🗑" />
        </div>
        <InfoBox color="var(--gold)">
          Öffne <code style={codeStyle}>localStorage</code> in den Browser-DevTools unter
          Application → Local Storage → deal-radar-keys. Du siehst dort genau, was gespeichert ist.
        </InfoBox>
      </TransparencySection>

      {/* ── Section 3: Session Log ── */}
      <TransparencySection
        number="03"
        title="Vollständiges Audit-Log der Session"
        color="#22c55e"
      >
        <p style={bodyText}>
          Jede Suchanfrage wird in einem Session-Log protokolliert — clientseitig, nur in deinem Browser.
          Das Log enthält die Anfrage, die geparsten Filter, die Anzahl der Treffer, alle API-Calls und die Kosten.
        </p>
        <MockSessionLog />
        <p style={bodyText}>
          Du kannst das gesamte Log als <strong>JSON</strong> (maschinenlesbar, vollständig) oder
          als <strong>CSV</strong> (für Excel) herunterladen. Das Log verschwindet, wenn du die Session beendest.
        </p>
        <InfoBox color="#22c55e">
          Das Session-Log ist rein clientseitig. Nichts davon verlässt deinen Browser.
        </InfoBox>
      </TransparencySection>

      {/* ── Section 4: Open Source ── */}
      <TransparencySection
        number="04"
        title="Vollständig Open Source"
        color="#a78bfa"
        alt
      >
        <p style={bodyText}>
          Der komplette Quellcode liegt auf GitHub unter MIT-Lizenz. Du kannst:
        </p>
        <ul style={featureList}>
          <li>Den Code prüfen und sicherstellen, dass keine Daten gesendet werden</li>
          <li>Das Projekt forken und auf deiner eigenen Domain hosten</li>
          <li>Beiträge einreichen — Issues und PRs sind willkommen</li>
          <li>Den Stack lokal ausführen: <code style={codeStyle}>git clone → npm install → npm run dev</code></li>
        </ul>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '10px 18px',
            color: 'var(--text-primary)', textDecoration: 'none',
            fontWeight: 500, fontSize: '0.875rem', marginTop: '8px',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-gold)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'; }}
        >
          <GithubIcon />
          Quellcode auf GitHub ansehen →
        </a>
      </TransparencySection>

      {/* ── Section 5: Security Review ── */}
      <TransparencySection
        number="05"
        title="Sicherheitsüberprüfung"
        color="#f472b6"
      >
        <p style={bodyText}>
          Diese Punkte haben wir im Code explizit geprüft und adressiert:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
          <SecurityCheck ok title="XSS in JSON-Viewer" body="HTML-Entities werden vor der Syntax-Hervorhebung escaped (&amp; → &amp;amp;, &lt; → &amp;lt;). Kein ungefilteter HTML-Inject möglich." />
          <SecurityCheck ok title="API-Keys im Log maskiert" body="Alle Keys in Request-Logs werden auf die letzten 4 Zeichen gekürzt (**** + letzte 4). Original-Keys verlassen nie den API-Call." />
          <SecurityCheck ok title="Keine eval()-Aufrufe" body="Kein eval(), no new Function(), kein dynamisches Code-Ausführen. Alle JSON-Parses sind try/catch-gesichert." />
          <SecurityCheck ok title="Nur HTTPS-Endpoints" body="Alle API-Calls gehen an api.anthropic.com und api.openregister.de via HTTPS. Kein HTTP-Downgrade möglich." />
          <SecurityCheck ok title="Keine Drittanbieter-Tracker" body="Keine Analytics, keine Cookies, kein CDN mit externen Skripten. Nur das, was du siehst." />
          <SecurityCheck ok title="localStorage statt sessionStorage" body="Keys überdauern Browser-Restarts (komfortabler). Du kannst sie jederzeit manuell löschen." />
          <SecurityCheck warn title="Keys im Browser-Speicher" body="localStorage ist zugänglich für andere Skripte auf derselben Domain. Empfehlung: Selbst hosten für maximale Kontrolle." />
        </div>
      </TransparencySection>

      {/* ── CTA ── */}
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '16px' }}>Überzeug dich selbst.</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
          Starte den Demo-Modus und beobachte jeden API-Call in Echtzeit.
        </p>
        <button onClick={onStartDemo} style={{
          background: 'var(--gold)', border: 'none', borderRadius: '8px',
          padding: '12px 28px', color: theme === 'dark' ? '#0a0a12' : '#fff',
          fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
        }}>
          Demo mit API-Transparenz starten →
        </button>
      </section>

    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function TransparencySection({
  number, title, color, alt, children,
}: {
  number: string; title: string; color: string; alt?: boolean; children: React.ReactNode;
}) {
  return (
    <section style={{
      background: alt ? 'var(--surface)' : 'var(--bg)',
      borderTop: '1px solid var(--border)',
      padding: '56px 24px',
    }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{
          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em',
          color, marginBottom: '8px', textTransform: 'uppercase',
        }}>
          {number} ──
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 20px', letterSpacing: '-0.01em' }}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function InfoBox({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{
      background: `color-mix(in srgb, ${color} 8%, transparent)`,
      border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
      borderRadius: '8px', padding: '12px 16px',
      fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5,
      marginTop: '16px',
    }}>
      💡 {children}
    </div>
  );
}

function InfoCard({ title, body, icon }: { title: string; body: string; icon: string }) {
  return (
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '16px',
    }}>
      <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>{title}</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

function SecurityCheck({ ok, warn, title, body }: { ok?: boolean; warn?: boolean; title: string; body: string }) {
  const color = ok ? '#22c55e' : warn ? '#eab308' : '#ef4444';
  const icon = ok ? '✓' : warn ? '⚠' : '✗';
  return (
    <div style={{
      display: 'flex', gap: '12px', alignItems: 'flex-start',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '8px', padding: '12px 14px',
    }}>
      <span className="mono" style={{ color, fontWeight: 700, fontSize: '0.85rem', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '2px' }}>{title}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.5 }}>{body}</div>
      </div>
    </div>
  );
}

function MockApiPanel() {
  return (
    <div style={{
      background: 'var(--code-bg)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '14px', margin: '20px 0', fontSize: '0.78rem',
    }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span>2 API-Calls anzeigen</span>
        <span style={{ color: 'var(--gold)', fontFamily: 'monospace' }}>· ~0,14 EUR</span>
        <span>· 1.320ms</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <MockCallRow provider="Claude" endpoint="POST /v1/messages" latency="980ms" cost="~0,04 EUR" color="#60a5fa" />
        <MockCallRow provider="OpenRegister" endpoint="POST /v1/search/company" latency="340ms" cost="~0,10 EUR · 10 Credits" color="#22c55e" />
      </div>
    </div>
  );
}

function MockCallRow({ provider, endpoint, latency, cost, color }: { provider: string; endpoint: string; latency: string; cost: string; color: string }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '6px', padding: '8px 12px',
      display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
    }}>
      <span style={{
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
        color, fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '3px',
      }}>{provider}</span>
      <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)', fontSize: '0.78rem' }}>{endpoint}</span>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginLeft: 'auto' }}>{latency}</span>
      <span style={{ color: 'var(--gold)', fontFamily: 'monospace', fontSize: '0.72rem' }}>{cost}</span>
    </div>
  );
}

function MockSessionLog() {
  return (
    <div style={{
      background: 'var(--code-bg)', border: '1px solid var(--border)',
      borderRadius: '10px', overflow: 'hidden', margin: '20px 0',
    }}>
      {[
        { time: '14:32', query: 'GmbHs in NRW, Inhaber 60+', results: 17, cost: '0,14 EUR' },
        { time: '14:33', query: 'Welche davon im Maschinenbau?', results: 4, cost: '0,14 EUR' },
        { time: '14:35', query: 'Healthcare GmbHs, Bayern, 58+', results: 9, cost: '0,14 EUR' },
      ].map((q, i) => (
        <div key={i} style={{
          padding: '10px 14px', fontSize: '0.78rem',
          borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
          display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
        }}>
          <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{q.time}</span>
          <span style={{ color: 'var(--text-primary)', flex: 1 }}>{q.query}</span>
          <span style={{ color: 'var(--text-secondary)' }}>{q.results} Treffer</span>
          <span style={{ color: 'var(--gold)', fontFamily: 'monospace' }}>~{q.cost}</span>
        </div>
      ))}
    </div>
  );
}

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const bodyText: React.CSSProperties = {
  color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.9rem', margin: '0 0 16px',
};

const featureList: React.CSSProperties = {
  color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.875rem',
  paddingLeft: '20px', margin: '12px 0',
};

const codeStyle: React.CSSProperties = {
  fontFamily: 'ui-monospace, monospace', background: 'var(--surface)',
  border: '1px solid var(--border)', borderRadius: '3px',
  padding: '1px 5px', fontSize: '0.82em', color: 'var(--text-primary)',
};
