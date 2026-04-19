import { SessionLog } from '../lib/types';
import { formatCostEur } from '../lib/costs';

interface SessionLogPanelProps {
  log: SessionLog;
  onDownloadJson: () => void;
  onDownloadCsv: () => void;
  onClear: () => void;
  onClose: () => void;
}

export function SessionLogPanel({ log, onDownloadJson, onDownloadCsv, onClear, onClose }: SessionLogPanelProps) {
  const dateStr = new Date(log.startedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 90 }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          width: '420px',
          maxWidth: '95vw',
          maxHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          background: '#0d0d18',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          zIndex: 91,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Session Log</span>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span>{dateStr}</span>
            <span>·</span>
            <span>{log.queries.length} {log.queries.length === 1 ? 'Query' : 'Queries'}</span>
            <span>·</span>
            <span style={{ color: 'var(--gold)', fontFamily: 'monospace' }}>~{formatCostEur(log.totalEstimatedCostEur)}</span>
            {log.totalOpenRegisterCredits > 0 && (
              <>
                <span>·</span>
                <span style={{ fontFamily: 'monospace' }}>{log.totalOpenRegisterCredits} Credits</span>
              </>
            )}
          </div>
        </div>

        {/* Query list */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {log.queries.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              Noch keine Suchanfragen in dieser Session.
            </div>
          ) : (
            log.queries.map((q, i) => {
              const time = new Date(q.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
              return (
                <div
                  key={q.id}
                  style={{
                    padding: '10px 16px',
                    borderBottom: i < log.queries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', flex: 1, lineHeight: 1.4 }}>
                      {q.userInput.length > 70 ? q.userInput.slice(0, 70) + '…' : q.userInput}
                    </div>
                    <span style={{ color: '#5a5a6a', fontSize: '0.7rem', flexShrink: 0, fontFamily: 'monospace' }}>{time}</span>
                  </div>
                  <div style={{ marginTop: '4px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {q.resultsCount > 0 && (
                      <LogChip label={`${q.resultsCount} Treffer`} />
                    )}
                    {q.clarificationAsked && (
                      <LogChip label="Rückfrage" color="#eab308" />
                    )}
                    {q.apiCalls.length > 0 && (
                      <LogChip label={`${q.apiCalls.length} API-Call${q.apiCalls.length > 1 ? 's' : ''}`} />
                    )}
                    {q.estimatedCostEur > 0 && (
                      <LogChip label={`~${formatCostEur(q.estimatedCostEur)}`} color="var(--gold)" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
          <button onClick={onDownloadJson} style={btnStyle}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            JSON
          </button>
          <button onClick={onDownloadCsv} style={btnStyle}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            CSV
          </button>
          {log.queries.length > 0 && (
            <button
              onClick={onClear}
              style={{ ...btnStyle, color: 'rgba(239,68,68,0.7)', borderColor: 'rgba(239,68,68,0.2)', marginLeft: 'auto' }}
            >
              Session löschen
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function LogChip({ label, color }: { label: string; color?: string }) {
  return (
    <span
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '3px',
        padding: '1px 6px',
        fontSize: '0.68rem',
        color: color ?? 'var(--text-secondary)',
        fontFamily: 'monospace',
      }}
    >
      {label}
    </span>
  );
}

const btnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '6px',
  padding: '5px 10px',
  color: 'var(--text-secondary)',
  fontSize: '0.75rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};
