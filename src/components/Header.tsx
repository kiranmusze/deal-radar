import { useState } from 'react';
import { AppMode, SessionLog } from '../lib/types';
import { SessionLogPanel } from './SessionLogPanel';
import { ThemeToggle } from './ThemeToggle';
import { Theme } from '../hooks/useTheme';

interface HeaderProps {
  mode: AppMode;
  onOpenSettings: () => void;
  onGoHome: () => void;
  onGoTransparency: () => void;
  sessionLog: SessionLog;
  onDownloadSessionJson: () => void;
  onDownloadSessionCsv: () => void;
  onClearSession: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ mode, onOpenSettings, onGoHome, onGoTransparency, sessionLog, onDownloadSessionJson, onDownloadSessionCsv, onClearSession, theme, onToggleTheme }: HeaderProps) {
  const [logOpen, setLogOpen] = useState(false);
  const queryCount = sessionLog.queries.length;

  return (
    <header
      style={{ background: 'rgba(var(--bg-rgb, 10,10,18), 0.95)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}
      className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
    >
      {/* Logo — klickbar zurück zur Landing */}
      <button
        onClick={onGoHome}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" stroke="var(--gold)" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="7" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
          <circle cx="16" cy="16" r="2.5" fill="var(--gold)" />
          <line x1="16" y1="2" x2="16" y2="7" stroke="var(--gold)" strokeWidth="1.5" />
          <line x1="16" y1="25" x2="16" y2="30" stroke="var(--gold)" strokeWidth="1.5" />
          <line x1="2" y1="16" x2="7" y2="16" stroke="var(--gold)" strokeWidth="1.5" />
          <line x1="25" y1="16" x2="30" y2="16" stroke="var(--gold)" strokeWidth="1.5" />
        </svg>
        <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '-0.01em' }}>Deal Radar</span>
      </button>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Mode badge */}
        {mode === 'demo' ? (
          <span style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: '#eab308', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em', padding: '2px 7px', borderRadius: '4px', textTransform: 'uppercase' }}>Demo</span>
        ) : (
          <span style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em', padding: '2px 7px', borderRadius: '4px', textTransform: 'uppercase' }}>Live</span>
        )}

        {/* Transparenz link */}
        <button onClick={onGoTransparency} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.75rem', padding: '4px 6px' }}>
          Transparenz
        </button>

        {/* Session Log */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setLogOpen(!logOpen)}
            style={{
              background: logOpen ? 'rgba(255,255,255,0.06)' : 'var(--surface)',
              border: `1px solid ${logOpen ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`,
              color: 'var(--text-secondary)', padding: '5px 9px',
              borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            {queryCount > 0 ? <><span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{queryCount}</span> {queryCount === 1 ? 'Query' : 'Queries'}</> : 'Log'}
          </button>
          {logOpen && (
            <SessionLogPanel log={sessionLog} onDownloadJson={onDownloadSessionJson} onDownloadCsv={onDownloadSessionCsv} onClear={onClearSession} onClose={() => setLogOpen(false)} />
          )}
        </div>

        {/* Theme toggle */}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
          API Keys
        </button>
      </div>
    </header>
  );
}
