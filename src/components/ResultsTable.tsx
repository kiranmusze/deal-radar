import { useState } from 'react';
import { Company } from '../lib/types';
import { calculateScore } from '../lib/scoring';
import { formatEur } from '../lib/financials';
import { ScoreBar } from './ScoreBar';
import { downloadCsv } from '../lib/csv';

interface ResultsTableProps {
  companies: Company[];
  isDemo?: boolean;
}

export function ResultsTable({ companies, isDemo }: ResultsTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<'score' | 'revenue' | 'employees' | 'age'>('score');

  const scored = companies.map((c) => ({ ...c, score: calculateScore(c) }));

  const sorted = [...scored].sort((a, b) => {
    if (sortKey === 'score') return b.score.total - a.score.total;
    if (sortKey === 'revenue') return b.revenue - a.revenue;
    if (sortKey === 'employees') return b.employees - a.employees;
    if (sortKey === 'age') return b.youngest_owner_age - a.youngest_owner_age;
    return 0;
  });

  return (
    <div>
      {isDemo && (
        <div
          style={{
            background: 'rgba(234,179,8,0.08)',
            border: '1px solid rgba(234,179,8,0.2)',
            borderRadius: '6px',
            padding: '8px 12px',
            marginBottom: '10px',
            fontSize: '0.78rem',
            color: '#eab308',
          }}
        >
          Demo-Modus: Beispieldaten. Für echte Suche: API Keys eintragen.
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between mb-2">
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
          {companies.length} Treffer
        </span>
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>Sortierung:</span>
          {(['score', 'revenue', 'employees', 'age'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setSortKey(k)}
              style={{
                background: sortKey === k ? 'var(--gold-dim)' : 'transparent',
                border: `1px solid ${sortKey === k ? 'var(--border-gold)' : 'var(--border)'}`,
                color: sortKey === k ? 'var(--gold)' : 'var(--text-secondary)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                cursor: 'pointer',
              }}
            >
              {k === 'score' ? 'Score' : k === 'revenue' ? 'Umsatz' : k === 'employees' ? 'MA' : 'Alter'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <table className="results-table">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <th>Unternehmen</th>
              <th>Stadt</th>
              <th>Branche</th>
              <th>MA</th>
              <th>Umsatz</th>
              <th>Eigenkapital</th>
              <th>Inhaber-Alter</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((company) => (
              <>
                <tr
                  key={company.company_id}
                  onClick={() => setSelectedId(selectedId === company.company_id ? null : company.company_id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)', maxWidth: '220px' }}>
                      {company.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
                      {company.legal_form?.toUpperCase()} · {company.zip}
                      {company.has_representative_owner && (
                        <span style={{ color: 'var(--gold)', marginLeft: '6px' }}>inhabergeführt</span>
                      )}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{company.city}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: '130px' }}>
                    <span style={{ fontSize: '0.78rem' }}>{company.industry}</span>
                  </td>
                  <td className="mono" style={{ color: 'var(--text-primary)' }}>
                    {company.employees}
                  </td>
                  <td className="mono" style={{ color: 'var(--text-primary)' }}>
                    {formatEur(company.revenue)}
                  </td>
                  <td className="mono" style={{ color: company.equity > 0 ? '#22c55e' : 'var(--text-secondary)' }}>
                    {formatEur(company.equity)}
                  </td>
                  <td className="mono">
                    <span
                      style={{
                        color: company.youngest_owner_age >= 65 ? '#22c55e' : company.youngest_owner_age >= 60 ? '#eab308' : 'var(--text-secondary)',
                        fontWeight: 600,
                      }}
                    >
                      {company.youngest_owner_age || '—'}
                    </span>
                  </td>
                  <td>
                    <ScoreBar score={company.score} compact />
                  </td>
                </tr>
                {selectedId === company.company_id && (
                  <tr key={`${company.company_id}-detail`}>
                    <td colSpan={8} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px' }}>
                      <CompanyInlineDetail company={company} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* CSV Export */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => downloadCsv(companies)}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.color = 'var(--gold)';
            el.style.borderColor = 'var(--border-gold)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.color = 'var(--text-secondary)';
            el.style.borderColor = 'var(--border)';
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          CSV herunterladen
        </button>
      </div>
    </div>
  );
}

function CompanyInlineDetail({ company }: { company: Company & { score: ReturnType<typeof calculateScore> } }) {
  const year = company.incorporated_at?.split('-')[2] || '—';

  return (
    <div>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{company.name}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
            {company.legal_form?.toUpperCase()} · {company.zip} {company.city} · Gegründet {year}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '12px' }}>
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Finanzkennzahlen
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <KV label="Umsatz" value={formatEur(company.revenue)} />
            <KV label="Eigenkapital" value={formatEur(company.equity)} positive={company.equity > 0} />
            <KV label="Bilanzsumme" value={formatEur(company.balance_sheet_total)} />
            <KV label="Jahresergebnis" value={formatEur(company.net_income)} positive={company.net_income > 0} />
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Unternehmensstruktur
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <KV label="Mitarbeiter" value={String(company.employees)} />
            <KV label="Inhaber (jgst.)" value={String(company.youngest_owner_age) + ' J.'} />
            <KV label="Inhabergef." value={company.has_representative_owner ? 'Ja' : 'Nein'} positive={company.has_representative_owner} />
            <KV label="Familienuntern." value={company.is_family_owned ? 'Ja' : 'Nein'} />
          </div>
        </div>
      </div>

      <ScoreBar score={company.score} />
    </div>
  );
}

function KV({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.68rem' }}>{label}</div>
      <div
        className="mono"
        style={{
          fontSize: '0.82rem',
          color: positive === true ? '#22c55e' : positive === false ? 'var(--text-secondary)' : 'var(--text-primary)',
          fontWeight: 500,
        }}
      >
        {value}
      </div>
    </div>
  );
}
