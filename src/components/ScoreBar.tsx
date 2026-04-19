import { ScoreBreakdown } from '../lib/types';
import { getScoreColor, getScoreLabel } from '../lib/scoring';

interface ScoreBarProps {
  score: ScoreBreakdown;
  compact?: boolean;
}

export function ScoreBar({ score, compact = false }: ScoreBarProps) {
  const color = getScoreColor(score.total);
  const label = getScoreLabel(score.total);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5" title={`Nachfolge-Score: ${score.total}/100`}>
        <div
          style={{
            width: '40px',
            height: '4px',
            background: 'var(--border)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            className="score-bar-fill"
            style={{
              height: '100%',
              width: `${score.total}%`,
              background: color,
              borderRadius: '2px',
            }}
          />
        </div>
        <span className="mono" style={{ color, fontSize: '0.75rem', fontWeight: 600 }}>
          {score.total}
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Nachfolge-Score</span>
        <span className="mono" style={{ color, fontSize: '0.85rem', fontWeight: 700 }}>
          {score.total}/100 — {label}
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: '6px',
          background: 'var(--border)',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <div
          className="score-bar-fill"
          style={{
            height: '100%',
            width: `${score.total}%`,
            background: color,
            borderRadius: '3px',
          }}
        />
      </div>
      <div className="flex gap-3 mt-2 flex-wrap">
        {score.ownerAge > 0 && (
          <ScorePill label="Inhaberalter" value={score.ownerAge} max={30} />
        )}
        {score.ownerManaged > 0 && (
          <ScorePill label="Inhabergefuehrt" value={score.ownerManaged} max={20} />
        )}
        {score.noFamilySuccessor > 0 && (
          <ScorePill label="Kein Familiennachfolger" value={score.noFamilySuccessor} max={15} />
        )}
        {score.revenueSweetSpot > 0 && (
          <ScorePill label="Umsatz-Sweetspot" value={score.revenueSweetSpot} max={10} />
        )}
        {score.employeeSweetSpot > 0 && (
          <ScorePill label="MA-Sweetspot" value={score.employeeSweetSpot} max={10} />
        )}
        {score.companyAge > 0 && (
          <ScorePill label="Unternehmensalter" value={score.companyAge} max={10} />
        )}
        {score.soleOwner > 0 && (
          <ScorePill label="Alleingesellschafter" value={score.soleOwner} max={5} />
        )}
      </div>
    </div>
  );
}

function ScorePill({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <span
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '2px 6px',
        fontSize: '0.7rem',
        color: 'var(--text-secondary)',
      }}
    >
      {label}{' '}
      <span className="mono" style={{ color: 'var(--text-primary)' }}>
        +{value}/{max}
      </span>
    </span>
  );
}
