import { useState, useCallback } from 'react';
import { ChatMessage, AppKeys, AppMode, Company, ApiCallLog } from '../lib/types';
import { MOCK_COMPANIES } from '../lib/mock-data';
import { calculateScore } from '../lib/scoring';

let idCounter = 0;
function newId() { return `msg-${Date.now()}-${idCounter++}`; }

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Willkommen bei Deal Radar — dem Unternehmensscanner für Nachfolge-Deals.

Beschreibe in natürlicher Sprache, welche Unternehmen du suchst. Ich parse deine Anfrage, suche in 4+ Millionen deutschen Unternehmen und analysiere die Ergebnisse.

Beispiele:
• "Inhabergeführte GmbHs in Bayern, Maschinenbau, Inhaber 65+"
• "IT-Dienstleister mit 5-20 Mitarbeitern, Inhaber über 55"
• "Bau-GmbHs in NRW, schuldenfrei, Inhaber 60+"

Oder wähle eine Inspiration aus dem Dropdown unten.`,
  timestamp: new Date(),
};

// ─── Demo-Mode: Smart filter for all 15 preset categories ────────────────────

type FilterSpec = {
  states?: string[]; cities?: string[]; industryCodes?: string[];
  ageMin?: number; ageMax?: number;
  employeesMin?: number; employeesMax?: number;
  revenueMinCent?: number; revenueMaxCent?: number;
  equityMinCent?: number; netIncomePositive?: boolean;
  ownerManaged?: boolean; soleOwner?: boolean;
  incorporatedYearMin?: number; incorporatedYearMax?: number;
  liabilitiesMaxCent?: number;
};

function parseQuery(query: string): FilterSpec {
  const q = query.toLowerCase();
  const spec: FilterSpec = {};

  // ── Region ──────────────────────────────────────────────────────────────
  const states: string[] = [];
  if (q.includes('bayern') || q.includes('bayer')) states.push('Bayern');
  if (q.includes('bw') || q.includes('baden-württemberg') || q.includes('wuerttemberg') || q.includes('württemberg')) states.push('BW');
  if (q.includes('nrw') || q.includes('nordrhein') || q.includes('westfalen')) states.push('NRW');
  if (q.includes('sachsen') && !q.includes('anhalt')) states.push('Sachsen');
  if (q.includes('thüringen') || q.includes('thueringen')) states.push('Thueringen');
  if (q.includes('brandenburg')) states.push('Brandenburg');
  if (q.includes('hamburg')) states.push('Hamburg');
  if (q.includes('berlin')) states.push('Berlin');
  if (q.includes('niedersachsen') || q.includes('hannover')) states.push('Niedersachsen');
  if (states.length > 0) spec.states = states;

  // Specific cities (Ruhrgebiet)
  const cities: string[] = [];
  if (q.includes('essen')) cities.push('Essen');
  if (q.includes('dortmund')) cities.push('Dortmund');
  if (q.includes('duisburg')) cities.push('Duisburg');
  if (q.includes('bochum')) cities.push('Bochum');
  if (q.includes('köln') || q.includes('koeln')) cities.push('Koeln');
  if (q.includes('münchen') || q.includes('muenchen')) cities.push('Muenchen');
  if (cities.length > 0) spec.cities = cities;

  // ── Industry ────────────────────────────────────────────────────────────
  const codes: string[] = [];
  if (q.includes('maschinenbau') || q.includes('maschinen')) codes.push('28');
  if (q.includes('metall')) { codes.push('24'); codes.push('25'); }
  if (q.includes('automotive') || q.includes('fahrzeug') || q.includes('kraftwagen')) codes.push('29');
  if (q.includes('it-dienst') || q.includes('software') || q.includes(' it ') || q.includes('informatik')) codes.push('62');
  if (q.includes('logistik') || q.includes('transport') || q.includes('spedition')) { codes.push('49'); codes.push('52'); }
  if (q.includes('bau') && !q.includes('maschinenbau')) { codes.push('41'); codes.push('42'); codes.push('43'); }
  if (q.includes('gesundheit') || q.includes('healthcare') || q.includes('pflege')) { codes.push('86'); codes.push('87'); }
  if (q.includes('elektro') || q.includes('elektrotechnik')) { codes.push('26'); codes.push('27'); }
  if (q.includes('druck')) codes.push('18');
  if (q.includes('einzelhandel')) codes.push('47');
  if (q.includes('holz')) codes.push('16');
  if (q.includes('kunststoff')) codes.push('22');
  if (q.includes('beratung') || q.includes('consulting')) codes.push('70');
  if (codes.length > 0) spec.industryCodes = [...new Set(codes)];

  // ── Owner age ────────────────────────────────────────────────────────────
  const ageMatch = q.match(/inhaber\s*(?:über|ueber|ab|>|)\s*(\d{2})\+?/);
  if (ageMatch) spec.ageMin = parseInt(ageMatch[1], 10);

  const ageRangeMatch = q.match(/inhaber\s+(?:heute\s+)?(\d{2})[–\-](\d{2})/);
  if (ageRangeMatch) {
    spec.ageMin = parseInt(ageRangeMatch[1], 10);
    spec.ageMax = parseInt(ageRangeMatch[2], 10);
  }

  // ── Employees ────────────────────────────────────────────────────────────
  const empRangeMatch = q.match(/(\d+)[–\-](\d+)\s*(?:mitarbeiter|ma\b)/);
  if (empRangeMatch) {
    spec.employeesMin = parseInt(empRangeMatch[1], 10);
    spec.employeesMax = parseInt(empRangeMatch[2], 10);
  }
  const empMaxMatch = q.match(/unter\s*(\d+)\s*(?:mitarbeiter|ma\b)/);
  if (empMaxMatch) spec.employeesMax = parseInt(empMaxMatch[1], 10);

  if (q.includes('0-2 mitarbeiter') || q.includes('einzelgesellschafter')) {
    spec.employeesMax = 2;
    spec.soleOwner = true;
  }

  // ── Revenue ──────────────────────────────────────────────────────────────
  const revMioRangeMatch = q.match(/(\d+(?:[.,]\d+)?)\s*[-–]\s*(\d+(?:[.,]\d+)?)\s*mio/);
  if (revMioRangeMatch) {
    spec.revenueMinCent = parseFloat(revMioRangeMatch[1].replace(',', '.')) * 100_000_000;
    spec.revenueMaxCent = parseFloat(revMioRangeMatch[2].replace(',', '.')) * 100_000_000;
  }
  const revKRangeMatch = q.match(/(\d+)k[–\-](\d+)\s*mio/);
  if (revKRangeMatch) {
    spec.revenueMinCent = parseInt(revKRangeMatch[1], 10) * 100_000;
    spec.revenueMaxCent = parseInt(revKRangeMatch[2], 10) * 100_000_000;
  }
  const revMaxMio = q.match(/unter\s*(\d+)\s*mio/);
  if (revMaxMio) spec.revenueMaxCent = parseInt(revMaxMio[1], 10) * 100_000_000;

  if (q.includes('umsatz unter 1 mio') || q.includes('stagnierendem umsatz unter 1 mio')) {
    spec.revenueMaxCent = 100_000_000;
  }
  if (q.includes('500.000 eur') || q.includes('500k') || q.includes('500 t€')) {
    spec.revenueMinCent = 50_000_000;
  }

  // ── Equity ───────────────────────────────────────────────────────────────
  if (q.includes('eigenkapital über 500') || q.includes('eigenkapital-riesen')) {
    spec.equityMinCent = 50_000_000;
  }

  // ── Profitability ────────────────────────────────────────────────────────
  if (q.includes('profitabl') || q.includes('positivem nettoergebnis') || q.includes('cash cow')) {
    spec.netIncomePositive = true;
  }

  // ── Debt ─────────────────────────────────────────────────────────────────
  if (q.includes('schuldenfrei') || q.includes('geringen verbindlichkeiten') || q.includes('ohne verbindlichkeiten')) {
    spec.liabilitiesMaxCent = 50_000_000;
  }

  // ── Ownership ────────────────────────────────────────────────────────────
  if (q.includes('inhabergeführt') || q.includes('inhabergefuehrt') || q.includes('inhabergef')) {
    spec.ownerManaged = true;
  }
  if (q.includes('alleingesellschafter') || q.includes('einzelgesellschafter')) {
    spec.soleOwner = true;
  }

  // ── Founded year ─────────────────────────────────────────────────────────
  const foundedMatch = q.match(/(?:gegründet|gegruendet)\s+(?:zwischen\s+)?(\d{4})[–\-\s]+(?:und\s+)?(\d{4})/);
  if (foundedMatch) {
    spec.incorporatedYearMin = parseInt(foundedMatch[1], 10);
    spec.incorporatedYearMax = parseInt(foundedMatch[2], 10);
  }

  return spec;
}

function applyFilters(companies: Company[], spec: FilterSpec): Company[] {
  return companies.filter((c) => {
    if (spec.states?.length && (!c.state || !spec.states.includes(c.state))) return false;
    if (spec.cities?.length) {
      const match = spec.cities.some((city) => c.city.toLowerCase().includes(city.toLowerCase()));
      if (!match) return false;
    }
    if (spec.industryCodes?.length) {
      const match = spec.industryCodes.some((code) =>
        c.industry_codes?.split(',').some((ic) => ic.trim().startsWith(code))
      );
      if (!match) return false;
    }
    if (spec.ageMin !== undefined && (c.youngest_owner_age ?? 0) < spec.ageMin) return false;
    if (spec.ageMax !== undefined && (c.youngest_owner_age ?? 999) > spec.ageMax) return false;
    if (spec.employeesMin !== undefined && c.employees < spec.employeesMin) return false;
    if (spec.employeesMax !== undefined && c.employees > spec.employeesMax) return false;
    if (spec.revenueMinCent !== undefined && c.revenue < spec.revenueMinCent) return false;
    if (spec.revenueMaxCent !== undefined && c.revenue > spec.revenueMaxCent) return false;
    if (spec.equityMinCent !== undefined && c.equity < spec.equityMinCent) return false;
    if (spec.netIncomePositive && c.net_income <= 0) return false;
    if (spec.ownerManaged && !c.has_representative_owner) return false;
    if (spec.soleOwner && !c.has_sole_owner) return false;
    if (spec.liabilitiesMaxCent !== undefined && c.liabilities > spec.liabilitiesMaxCent) return false;
    if (spec.incorporatedYearMin !== undefined || spec.incorporatedYearMax !== undefined) {
      const yearStr = c.incorporated_at?.split('-')[2];
      if (!yearStr) return false;
      const year = parseInt(yearStr, 10);
      if (spec.incorporatedYearMin !== undefined && year < spec.incorporatedYearMin) return false;
      if (spec.incorporatedYearMax !== undefined && year > spec.incorporatedYearMax) return false;
    }
    return true;
  });
}

function getDemoResults(query: string): Company[] {
  const spec = parseQuery(query);
  let filtered = applyFilters(MOCK_COMPANIES, spec);

  if (filtered.length === 0 && (spec.states || spec.cities)) {
    filtered = applyFilters(MOCK_COMPANIES, { ...spec, states: undefined, cities: undefined });
  }
  if (filtered.length === 0) filtered = [...MOCK_COMPANIES];

  return filtered
    .map((c) => ({ ...c, score: calculateScore(c) }))
    .sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0))
    .slice(0, 12);
}

function getDemoApiCallLog(): ApiCallLog[] {
  const now = Date.now();
  return [
    {
      id: crypto.randomUUID(), timestamp: now - 980, provider: 'claude',
      endpoint: '/v1/messages', method: 'POST',
      requestBody: { headers: { 'x-api-key': '****demo', 'anthropic-version': '2023-06-01' }, body: { model: 'claude-sonnet-4-20250514', max_tokens: 1024 } },
      responseStatus: 200,
      responseBody: { content: [{ type: 'text', text: '{"action":"search","filters":{},"summary":"Demo-Suche"}' }], _note: 'Demo-Modus: Simulierter API-Call' },
      latencyMs: 980, estimatedCostEur: 0.04,
    },
    {
      id: crypto.randomUUID(), timestamp: now - 320, provider: 'openregister',
      endpoint: '/v1/search/company', method: 'POST',
      requestBody: { headers: { Authorization: 'Bearer ****demo' }, body: { filters: [], pagination: { page: 1, per_page: 20 } } },
      responseStatus: 200,
      responseBody: { companies: [], _note: 'Demo-Modus: Simulierter API-Call. Im Live-Modus werden echte Daten abgerufen.' },
      latencyMs: 320, estimatedCostEur: 0.10, creditsUsed: 10,
    },
  ];
}

function getDemoAnalysis(companies: Company[], query: string): string {
  if (companies.length === 0) {
    return 'In den Demo-Daten gibt es für diese Anfrage keine direkten Treffer. Im Live-Modus würden 4+ Mio. echte Unternehmen durchsucht.';
  }

  const sorted = [...companies].sort((a, b) => (b.youngest_owner_age ?? 0) - (a.youngest_owner_age ?? 0));
  const top3 = sorted.slice(0, 3);
  const avgAge = Math.round(companies.reduce((s, c) => s + (c.youngest_owner_age ?? 0), 0) / companies.length);
  const inhaberCount = companies.filter((c) => c.has_representative_owner).length;
  const avgScore = Math.round(companies.reduce((s, c) => s + calculateScore(c).total, 0) / companies.length);

  const q = query.toLowerCase();
  let context = '';
  if (q.includes('maschinenbau')) context = 'Maschinenbau-Unternehmen mit hohem Nachfolgepotenzial.';
  else if (q.includes('it') || q.includes('software')) context = 'IT-Dienstleister — typischerweise hohe Marge, geringer Kapitalbedarf.';
  else if (q.includes('logistik') || q.includes('transport')) context = 'Logistikunternehmen mit stabilen B2B-Kundenbeziehungen.';
  else if (q.includes('gesundheit') || q.includes('healthcare') || q.includes('pflege')) context = 'Gesundheitssektor — defensives Profil, reguliertes Umfeld.';
  else if (q.includes('bau') || q.includes('handwerk')) context = 'Bau/Handwerk — ortsgebunden, oft lokale Monopolstellung.';
  else context = 'Mittelständler mit Nachfolgeprofil.';

  return `${companies.length} Treffer in den Demo-Daten. ${context}

Durchschnittsalter jüngster Inhaber: ${avgAge} Jahre. ${inhaberCount} von ${companies.length} Unternehmen inhabergeführt. Ø Nachfolge-Score: ${avgScore}/100.

Top 3 nach Nachfolge-Dringlichkeit:
${top3.map((c, i) => `${i + 1}. ${c.name} (${c.city}) — Inhaber ${c.youngest_owner_age} J., ${c.employees} MA, Score ${calculateScore(c).total}/100`).join('\n')}

Hinweis: Dies sind Beispieldaten. Trage deine API Keys ein, um 4+ Mio. echte Unternehmen zu durchsuchen.`;
}

// ─── Main Hook ───────────────────────────────────────────────────────────────

export type SessionQueryCallback = (
  userInput: string, resultsCount: number, apiCalls: ApiCallLog[], parsedFilters: unknown, clarificationAsked: boolean
) => void;

export function useChat(keys: AppKeys, mode: AppMode, onQueryComplete?: SessionQueryCallback) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownBanner, setHasShownBanner] = useState(false);

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const full: ChatMessage = { ...msg, id: newId(), timestamp: new Date() };
    setMessages((prev) => [...prev, full]);
    return full.id;
  }, []);

  const updateMessage = useCallback((id: string, update: Partial<ChatMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...update } : m)));
  }, []);

  const sendMessage = useCallback(
    async (userText: string) => {
      if (isLoading) return;

      addMessage({ role: 'user', content: userText });
      const loadingId = addMessage({ role: 'assistant', content: '', isLoading: true });
      setIsLoading(true);

      try {
        if (mode === 'demo') {
          await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
          const results = getDemoResults(userText);
          const apiCalls = getDemoApiCallLog();
          await new Promise((r) => setTimeout(r, 200));

          updateMessage(loadingId, {
            isLoading: false,
            content: getDemoAnalysis(results, userText),
            results,
            searchSummary: `Demo: "${userText.slice(0, 55)}${userText.length > 55 ? '…' : ''}"`,
            isDemo: true,
            apiCalls,
          });

          onQueryComplete?.(userText, results.length, apiCalls, null, false);

          if (!hasShownBanner && results.length > 0) {
            setHasShownBanner(true);
            setTimeout(() => addMessage({ role: 'banner', content: '' }), 300);
          }
        } else {
          const { runLiveSearch } = await import('./useSearch');
          await runLiveSearch({ userText, keys, loadingId, messages, updateMessage, onQueryComplete });

          if (!hasShownBanner) {
            setHasShownBanner(true);
            setTimeout(() => addMessage({ role: 'banner', content: '' }), 300);
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
        updateMessage(loadingId, { isLoading: false, content: `Fehler: ${msg}\n\nBitte prüfe deine API Keys und versuche es erneut.` });
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, mode, keys, messages, addMessage, updateMessage, hasShownBanner, onQueryComplete]
  );

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setHasShownBanner(false);
  }, []);

  return { messages, isLoading, sendMessage, clearChat };
}
