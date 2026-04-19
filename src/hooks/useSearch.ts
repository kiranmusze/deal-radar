import { AppKeys, ChatMessage, ApiCallLog } from '../lib/types';

interface LiveSearchParams {
  userText: string;
  keys: AppKeys;
  loadingId: string;
  messages: ChatMessage[];
  updateMessage: (id: string, update: Partial<ChatMessage>) => void;
  onQueryComplete?: (
    userInput: string,
    resultsCount: number,
    apiCalls: ApiCallLog[],
    parsedFilters: unknown,
    clarificationAsked: boolean
  ) => void;
}

export async function runLiveSearch({
  userText,
  keys,
  loadingId,
  messages,
  updateMessage,
  onQueryComplete,
}: LiveSearchParams): Promise<void> {
  const { callClaude } = await import('../lib/claude');
  const { searchCompanies } = await import('../lib/openregister');
  const { SYSTEM_PROMPT } = await import('../lib/prompts');
  const { calculateScore } = await import('../lib/scoring');

  const apiCalls: ApiCallLog[] = [];

  // Build conversation history for Claude
  const history = messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.content && !m.isLoading)
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
  history.push({ role: 'user', content: userText });

  // [1] Claude: parse natural language → filters or follow-up question
  const { text: parseResponse, log: claudeLog1 } = await callClaude(keys.claudeKey, history, SYSTEM_PROMPT);
  apiCalls.push(claudeLog1);

  // Try to extract search JSON
  let searchAction: { action: string; filters: Record<string, unknown>; summary: string } | null = null;
  const jsonMatch = parseResponse.match(/\{[\s\S]*?"action"\s*:\s*"search"[\s\S]*?\}/);
  if (jsonMatch) {
    try {
      searchAction = JSON.parse(jsonMatch[0]);
    } catch {
      // not valid JSON
    }
  }

  // Update message with current state (API calls so far)
  updateMessage(loadingId, { apiCalls: [...apiCalls] });

  if (!searchAction) {
    // Claude asked a follow-up question
    updateMessage(loadingId, {
      isLoading: false,
      content: parseResponse,
      apiCalls,
    });
    onQueryComplete?.(userText, 0, apiCalls, null, true);
    return;
  }

  // [2] OpenRegister: search companies
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { result, log: orLog } = await searchCompanies(keys.openregisterKey, searchAction.filters as any);
  apiCalls.push(orLog);

  updateMessage(loadingId, { apiCalls: [...apiCalls] });

  const companies = (result.companies ?? []).map((c) => ({ ...c, score: calculateScore(c) }));

  // [3] Claude: analyze results
  const analysisPrompt = `Ich habe nach "${searchAction.summary}" gesucht und ${companies.length} Unternehmen gefunden.

Top-Ergebnisse (nach Nachfolge-Score):
${companies
  .slice(0, 10)
  .map(
    (c, i) =>
      `${i + 1}. ${c.name} (${c.city}, ${c.legal_form?.toUpperCase()}) — ${c.employees} MA, Inhaber ${c.youngest_owner_age}J., Score: ${c.score?.total ?? '—'}/100`
  )
  .join('\n')}

Analysiere diese Ergebnisse kurz.`;

  const analysisHistory = [
    ...history,
    { role: 'assistant' as const, content: parseResponse },
    { role: 'user' as const, content: analysisPrompt },
  ];
  const { text: analysis, log: claudeLog2 } = await callClaude(keys.claudeKey, analysisHistory, SYSTEM_PROMPT);
  apiCalls.push(claudeLog2);

  updateMessage(loadingId, {
    isLoading: false,
    content: analysis,
    results: companies,
    searchSummary: searchAction.summary,
    isDemo: false,
    apiCalls,
  });

  onQueryComplete?.(userText, companies.length, apiCalls, searchAction.filters, false);
}
