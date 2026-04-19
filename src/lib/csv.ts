import { Company } from './types';
import { calculateScore } from './scoring';
import { formatEur } from './financials';

export function generateCsv(companies: Company[]): string {
  const headers = [
    'Name',
    'Stadt',
    'PLZ',
    'Rechtsform',
    'Branche',
    'Mitarbeiter',
    'Umsatz (EUR)',
    'Eigenkapital (EUR)',
    'Bilanzsumme (EUR)',
    'Jahresergebnis (EUR)',
    'Jüngster Inhaber (Alter)',
    'Inhabergeführt',
    'Familienunternehmen',
    'Alleingesellschafter',
    'Gründungsjahr',
    'Nachfolge-Score',
  ];

  const rows = companies.map((c) => {
    const score = calculateScore(c);
    const year = c.incorporated_at?.split('-')[2] || '';
    return [
      c.name,
      c.city,
      c.zip,
      c.legal_form?.toUpperCase() || '',
      c.industry,
      c.employees,
      formatEur(c.revenue),
      formatEur(c.equity),
      formatEur(c.balance_sheet_total),
      formatEur(c.net_income),
      c.youngest_owner_age || '',
      c.has_representative_owner ? 'Ja' : 'Nein',
      c.is_family_owned ? 'Ja' : 'Nein',
      c.has_sole_owner ? 'Ja' : 'Nein',
      year,
      score.total,
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`);
  });

  return [headers.map((h) => `"${h}"`).join(';'), ...rows.map((r) => r.join(';'))].join('\n');
}

export function downloadCsv(companies: Company[], filename = 'deal-radar-ergebnisse.csv'): void {
  const csv = generateCsv(companies);
  const bom = '\uFEFF'; // BOM for Excel UTF-8 compatibility
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
