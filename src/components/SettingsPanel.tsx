import { useState } from 'react';
import { AppKeys } from '../lib/types';

interface SettingsPanelProps {
  keys: AppKeys;
  onSave: (keys: AppKeys) => void;
  onClose: () => void;
}

export function SettingsPanel({ keys, onSave, onClose }: SettingsPanelProps) {
  const [openregisterKey, setOpenregisterKey] = useState(keys.openregisterKey);
  const [claudeKey, setClaudeKey] = useState(keys.claudeKey);
  const [showOR, setShowOR] = useState(false);
  const [showClaude, setShowClaude] = useState(false);

  const handleSave = () => {
    onSave({ openregisterKey: openregisterKey.trim(), claudeKey: claudeKey.trim() });
    onClose();
  };

  const handleClear = () => {
    setOpenregisterKey('');
    setClaudeKey('');
    onSave({ openregisterKey: '', claudeKey: '' });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '480px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#13131e',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          zIndex: 101,
          padding: '24px',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              API Keys konfigurieren
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Keys werden nur in deinem Browser gespeichert — kein Backend.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* OpenRegister Key */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
            OpenRegister API Key
            <span style={{ color: 'var(--text-secondary)', fontWeight: 400, marginLeft: '6px' }}>(Unternehmensdaten)</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showOR ? 'text' : 'password'}
              value={openregisterKey}
              onChange={(e) => setOpenregisterKey(e.target.value)}
              placeholder="or_live_..."
              style={{
                width: '100%',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px 40px 10px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(200,180,140,0.4)'; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; }}
            />
            <button
              onClick={() => setShowOR(!showOR)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {showOR ? (
                  <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><path d="M1 1l22 22"/></>
                ) : (
                  <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                )}
              </svg>
            </button>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Hole deinen Key auf{' '}
            <span style={{ color: 'var(--gold)' }}>openregister.de/keys</span>
            {' '}— Free Tier: 50 Requests/Monat
          </div>
        </div>

        {/* Claude Key */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Anthropic API Key
            <span style={{ color: 'var(--text-secondary)', fontWeight: 400, marginLeft: '6px' }}>(KI-Analyse)</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showClaude ? 'text' : 'password'}
              value={claudeKey}
              onChange={(e) => setClaudeKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{
                width: '100%',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px 40px 10px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(200,180,140,0.4)'; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; }}
            />
            <button
              onClick={() => setShowClaude(!showClaude)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {showClaude ? (
                  <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><path d="M1 1l22 22"/></>
                ) : (
                  <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                )}
              </svg>
            </button>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Hole deinen Key auf{' '}
            <span style={{ color: 'var(--gold)' }}>console.anthropic.com</span>
            {' '}— ca. 0,03–0,08 EUR pro Suche
          </div>
        </div>

        {/* Security notice */}
        <div
          style={{
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.15)',
            borderRadius: '8px',
            padding: '10px 12px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ color: '#22c55e' }}>Sicher & privat:</strong> Deine Keys werden ausschließlich im localStorage deines Browsers gespeichert.
              Es gibt kein Backend und keinen Server — alle API-Calls gehen direkt von deinem Browser aus.
              Prüfe den <span style={{ color: 'var(--gold)' }}>Quellcode</span> selbst.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              background: openregisterKey.trim() || claudeKey.trim() ? 'var(--gold)' : 'rgba(200,180,140,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              color: openregisterKey.trim() || claudeKey.trim() ? '#0a0a12' : 'rgba(200,180,140,0.4)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Keys speichern
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '10px 16px',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Abbrechen
          </button>
          {(keys.openregisterKey || keys.claudeKey) && (
            <button
              onClick={handleClear}
              style={{
                background: 'transparent',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'rgba(239,68,68,0.7)',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              Löschen
            </button>
          )}
        </div>
      </div>
    </>
  );
}
