import { ApiCallLog } from './types';

export const COST_TABLE = {
  claude: {
    sonnet_input_per_1k_tokens: 0.003,
    sonnet_output_per_1k_tokens: 0.015,
    avg_call_eur: 0.04,
  },
  openregister: {
    autocomplete: { credits: 1, eur: 0.01 },
    search: { credits: 10, eur: 0.10 },
    company_details: { credits: 10, eur: 0.10 },
    financials: { credits: 10, eur: 0.10 },
    owners: { credits: 10, eur: 0.10 },
    ubo: { credits: 25, eur: 0.25 },
  },
} as const;

export function estimateSessionCost(logs: ApiCallLog[]): {
  totalEur: number;
  claudeCalls: number;
  openregisterCalls: number;
  totalCredits: number;
} {
  let totalEur = 0;
  let claudeCalls = 0;
  let openregisterCalls = 0;
  let totalCredits = 0;

  logs.forEach((log) => {
    totalEur += log.estimatedCostEur;
    if (log.provider === 'claude') claudeCalls++;
    if (log.provider === 'openregister') {
      openregisterCalls++;
      totalCredits += log.creditsUsed ?? 0;
    }
  });

  return {
    totalEur: Math.round(totalEur * 100) / 100,
    claudeCalls,
    openregisterCalls,
    totalCredits,
  };
}

export function formatCostEur(eur: number): string {
  return eur.toFixed(2).replace('.', ',') + ' EUR';
}
