import { useState, useCallback, useRef } from 'react';
import { SessionLog, SessionQuery, ApiCallLog, AppMode } from '../lib/types';
import { estimateSessionCost } from '../lib/costs';

function newSessionLog(mode: AppMode): SessionLog {
  return {
    sessionId: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
    mode,
    queries: [],
    totalApiCalls: 0,
    totalEstimatedCostEur: 0,
    totalOpenRegisterCredits: 0,
  };
}

export function useSessionLog(mode: AppMode) {
  const [log, setLog] = useState<SessionLog>(() => newSessionLog(mode));
  const logRef = useRef(log);
  logRef.current = log;

  const addQuery = useCallback((query: SessionQuery) => {
    setLog((prev) => {
      const queries = [...prev.queries, query];
      const allCalls = queries.flatMap((q) => q.apiCalls);
      const costs = estimateSessionCost(allCalls);
      return {
        ...prev,
        queries,
        totalApiCalls: allCalls.length,
        totalEstimatedCostEur: costs.totalEur,
        totalOpenRegisterCredits: costs.totalCredits,
      };
    });
  }, []);

  const clearLog = useCallback(() => {
    setLog(newSessionLog(mode));
  }, [mode]);

  const downloadAsJson = useCallback(() => {
    const current = logRef.current;
    const json = JSON.stringify(current, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const date = new Date(current.startedAt).toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deal-radar-session-${date}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const downloadAsCsv = useCallback(() => {
    const current = logRef.current;
    const rows = current.queries.map((q) => {
      const time = new Date(q.timestamp).toLocaleString('de-DE');
      return [
        `"${time}"`,
        `"${q.userInput.replace(/"/g, '""')}"`,
        `"${q.resultsCount}"`,
        `"${q.clarificationAsked ? 'Ja' : 'Nein'}"`,
        `"${q.apiCalls.length}"`,
        `"${q.estimatedCostEur.toFixed(3)}"`,
        `"${JSON.stringify(q.parsedFilters ?? {}).replace(/"/g, '""')}"`,
      ].join(';');
    });
    const header = ['"Zeitpunkt"', '"Suchanfrage"', '"Treffer"', '"Rueckfrage"', '"API-Calls"', '"Kosten EUR"', '"Filter JSON"'].join(';');
    const csv = '\uFEFF' + [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const date = new Date(current.startedAt).toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deal-radar-session-${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  // Build a SessionQuery from completed interaction
  const buildQuery = useCallback((
    userInput: string,
    resultsCount: number,
    apiCalls: ApiCallLog[],
    parsedFilters: unknown | null,
    clarificationAsked: boolean,
  ): SessionQuery => {
    const costs = estimateSessionCost(apiCalls);
    return {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userInput,
      parsedFilters,
      clarificationAsked,
      resultsCount,
      apiCalls,
      estimatedCostEur: costs.totalEur,
    };
  }, []);

  return { log, addQuery, clearLog, downloadAsJson, downloadAsCsv, buildQuery };
}
