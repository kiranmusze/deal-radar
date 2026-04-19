import { useState } from 'react';
import { PRESET_QUERIES } from '../lib/presets';

interface PresetQueriesProps {
  onSelect: (query: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Nachfolge: '#c8b48c',
  Financial: '#22c55e',
  Sektor: '#60a5fa',
  Kontraintuitiv: '#f472b6',
  Geo: '#a78bfa',
};

export function PresetQueries({ onSelect }: PresetQueriesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [...new Set(PRESET_QUERIES.map((q) => q.category))];
  const filtered = activeCategory
    ? PRESET_QUERIES.filter((q) => q.category === activeCategory)
    : PRESET_QUERIES;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '0.8rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.15s',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        Inspiration gefällig?
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown */}
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: 0,
              width: '420px',
              maxWidth: '95vw',
              background: '#13131e',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              zIndex: 50,
              overflow: 'hidden',
            }}
          >
            {/* Category tabs */}
            <div
              style={{
                display: 'flex',
                gap: '4px',
                padding: '10px 12px 8px',
                borderBottom: '1px solid var(--border)',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => setActiveCategory(null)}
                style={{
                  background: activeCategory === null ? 'rgba(255,255,255,0.08)' : 'transparent',
                  border: 'none',
                  color: activeCategory === null ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                }}
              >
                Alle
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                  style={{
                    background: activeCategory === cat ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: 'none',
                    color: activeCategory === cat ? CATEGORY_COLORS[cat] : 'var(--text-secondary)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Query list */}
            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {filtered.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelect(preset.query);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 14px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: 500 }}>
                      {preset.label}
                    </span>
                    <span
                      style={{
                        color: CATEGORY_COLORS[preset.category],
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {preset.category}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: 1.4 }}>
                    {preset.query}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
