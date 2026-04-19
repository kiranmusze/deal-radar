import { useState } from 'react';

interface JsonViewerProps {
  data: unknown;
  label?: string;
  defaultCollapsed?: boolean;
}

export function JsonViewer({ data, label }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      {label && (
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </div>
      )}
      <div
        style={{
          background: '#0d0d18',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '6px',
          padding: '10px 36px 10px 12px',
          overflowX: 'auto',
          position: 'relative',
        }}
      >
        <button
          onClick={handleCopy}
          title="JSON kopieren"
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            background: 'transparent',
            border: 'none',
            color: copied ? '#22c55e' : 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '2px 4px',
            fontSize: '0.65rem',
            transition: 'color 0.15s',
          }}
        >
          {copied ? '✓' : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
        </button>
        <pre
          style={{
            margin: 0,
            fontSize: '11px',
            lineHeight: '1.55',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
          dangerouslySetInnerHTML={{ __html: syntaxHighlight(json) }}
        />
      </div>
    </div>
  );
}

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = 'color:#8a8a9a'; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'color:#c8b48c'; // key (gold)
          } else {
            cls = 'color:#7aa87a'; // string (green)
          }
        } else if (/true|false/.test(match)) {
          cls = 'color:#60a5fa'; // bool (blue)
        } else if (/null/.test(match)) {
          cls = 'color:#6b6b7b'; // null (grey)
        }
        return `<span style="${cls}">${match}</span>`;
      }
    );
}
