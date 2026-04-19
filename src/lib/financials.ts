import { CompanyDetail, FinancialRatios } from './types';

export function calculateRatios(company: CompanyDetail): FinancialRatios {
  const bs = company.balance_sheet_total || 0; // Cent
  const eq = company.equity || 0;
  const rev = company.revenue || 0;
  const ni = company.net_income || 0;
  const li = company.liabilities || 0;
  const emp = Math.max(company.employees || 1, 1);

  return {
    eigenkapitalquote: bs > 0 ? ((eq / bs) * 100).toFixed(1) + '%' : 'k.A.',
    verschuldungsgrad: eq > 0 ? ((li / eq) * 100).toFixed(1) + '%' : 'k.A.',
    umsatzRendite: rev > 0 ? ((ni / rev) * 100).toFixed(1) + '%' : 'k.A.',
    umsatzProMitarbeiter: Math.round(rev / 100 / emp),
    bilanzsummeEur: Math.round(bs / 100),
    eigenkapitalEur: Math.round(eq / 100),
    umsatzEur: Math.round(rev / 100),
    netIncomeEur: Math.round(ni / 100),
  };
}

export function formatEur(cents: number): string {
  const eur = Math.round(cents / 100);
  if (Math.abs(eur) >= 1_000_000) {
    return (eur / 1_000_000).toFixed(1).replace('.', ',') + ' Mio. €';
  }
  if (Math.abs(eur) >= 1_000) {
    return (eur / 1_000).toFixed(0) + ' T€';
  }
  return eur.toLocaleString('de-DE') + ' €';
}

export function formatEurFull(cents: number): string {
  return Math.round(cents / 100).toLocaleString('de-DE') + ' €';
}

export function formatNumber(n: number): string {
  return n.toLocaleString('de-DE');
}
