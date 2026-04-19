import { useState, useRef, KeyboardEvent } from 'react';
import { PresetQueries } from './PresetQueries';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
  };

  const handlePresetSelect = (query: string) => {
    setValue(query);
    textareaRef.current?.focus();
    setTimeout(handleInput, 0);
  };

  return (
    <div
      style={{
        padding: '12px 16px 20px',
        background: 'var(--bg)',
      }}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        {/* Preset queries row */}
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <PresetQueries onSelect={handlePresetSelect} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.68rem', flexShrink: 0 }}>
            Enter · Shift+Enter für neue Zeile
          </span>
        </div>

        {/* Input card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '14px 16px 10px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocusCapture={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = 'rgba(200,180,140,0.35)';
            el.style.boxShadow = '0 4px 32px rgba(0,0,0,0.35)';
          }}
          onBlurCapture={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = 'var(--border)';
            el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)';
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Beschreibe, welche Unternehmen du suchst..."
            rows={1}
            disabled={disabled || isLoading}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.925rem',
              lineHeight: '1.6',
              minHeight: '28px',
              maxHeight: '160px',
              overflowY: 'auto',
              width: '100%',
            }}
          />

          {/* Bottom row: hint + send button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '10px',
            }}
          >
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', opacity: 0.6 }}>
              {isLoading ? 'Suche läuft…' : value.trim() ? '' : 'z.B. inhabergeführte GmbHs in Bayern, Maschinenbau, Inhaber 65+'}
            </span>

            <button
              onClick={handleSend}
              disabled={!value.trim() || isLoading || disabled}
              style={{
                background: value.trim() && !isLoading ? 'var(--gold)' : 'rgba(200,180,140,0.12)',
                border: 'none',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: value.trim() && !isLoading ? 'pointer' : 'not-allowed',
                flexShrink: 0,
                transition: 'all 0.15s',
              }}
            >
              {isLoading ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(200,180,140,0.5)"
                  strokeWidth="2"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={value.trim() ? '#0a0a12' : 'rgba(200,180,140,0.35)'}
                  strokeWidth="2.5"
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
