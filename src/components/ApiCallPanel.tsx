import { useState } from 'react';
import { ApiCallLog } from '../lib/types';
import { JsonViewer } from './JsonViewer';

interface ApiCallPanelProps {
  apiCalls: ApiCallLog[];
}

export function ApiCallPanel({ apiCalls }: ApiCallPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!apiCalls || apiCalls.length === 0) return null;

  const totalCost = apiCalls.reduce((s, c) => s + c.estimatedCostEur, 0);
  const totalLatency = apiCalls.reduce((s, c) => s + c.latencyMs, 0);

  return (
    <div
      style={{
        marginTop: '6px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Toggle row */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '7px 12px',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth="3"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
          {apiCalls.length} API-Call{apiCalls.length > 1 ? 's' : ''} anzeigen
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', margin: '0 2px' }}>·</span>
        <span style={{ color: 'var(--gold)', fontSize: '0.72rem', fontFamily: 'monospace' }}>
          ~{totalCost.toFixed(2).replace('.', ',')} EUR
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', margin: '0 2px' }}>·</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'monospace' }}>
          {totalLatency}ms
        </span>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {apiCalls.map((call, i) => (
            <CallCard key={call.id} call={call} index={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function CallCard({ call, index }: { call: ApiCallLog; index: number }) {
  const [bodyOpen, setBodyOpen] = useState(false);

  const providerColor = call.provider === 'claude' ? '#60a5fa' : '#22c55e';
  const providerLabel = call.provider === 'claude' ? 'Claude' : 'OpenRegister';
  const statusOk = call.responseStatus >= 200 && call.responseStatus < 300;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '6px',
        overflow: 'hidden',
      }}
    >
      {/* Call header */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontFamily: 'monospace' }}>
            CALL {index}
          </span>
          <span
            style={{
              background: `rgba(${call.provider === 'claude' ? '96,165,250' : '34,197,94'},0.1)`,
              border: `1px solid rgba(${call.provider === 'claude' ? '96,165,250' : '34,197,94'},0.3)`,
              color: providerColor,
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              padding: '1px 6px',
              borderRadius: '3px',
            }}
          >
            {providerLabel}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'monospace' }}>
            {call.method}
          </span>
          <span style={{ color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {call.endpoint}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <Metric label="Latenz" value={`${call.latencyMs}ms`} />
          <Metric label="Kosten" value={`~${call.estimatedCostEur.toFixed(2).replace('.', ',')} EUR`} gold />
          {call.creditsUsed !== undefined && (
            <Metric label="Credits" value={`${call.creditsUsed}`} />
          )}
          <Metric
            label="Status"
            value={String(call.responseStatus)}
            color={statusOk ? '#22c55e' : '#ef4444'}
          />
        </div>
      </div>

      {/* Body toggle */}
      <button
        onClick={() => setBodyOpen(!bodyOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '7px 12px',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          fontSize: '0.7rem',
          textAlign: 'left',
          borderBottom: bodyOpen ? '1px solid rgba(255,255,255,0.04)' : 'none',
        }}
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          style={{ transform: bodyOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
        Request & Response anzeigen
      </button>

      {bodyOpen && (
        <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <JsonViewer data={call.requestBody} label="Request" />
          <JsonViewer data={call.responseBody} label="Response" />
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, gold, color }: { label: string; value: string; gold?: boolean; color?: string }) {
  return (
    <span style={{ fontSize: '0.7rem' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}: </span>
      <span
        style={{
          color: color ?? (gold ? 'var(--gold)' : 'var(--text-primary)'),
          fontFamily: 'monospace',
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </span>
  );
}
