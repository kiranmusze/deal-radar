import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { SettingsPanel } from './components/SettingsPanel';
import { LandingPage } from './components/LandingPage';
import { TransparencyPage } from './components/TransparencyPage';
import { useKeys } from './hooks/useKeys';
import { useChat } from './hooks/useChat';
import { useSessionLog } from './hooks/useSessionLog';
import { useTheme } from './hooks/useTheme';
import { ApiCallLog } from './lib/types';

type Page = 'landing' | 'chat' | 'transparency';

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { keys, setKeys, mode } = useKeys();
  const { log, addQuery, clearLog, downloadAsJson, downloadAsCsv, buildQuery } = useSessionLog(mode);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [page, setPage] = useState<Page>('landing');

  const handleQueryComplete = useCallback(
    (userInput: string, resultsCount: number, apiCalls: ApiCallLog[], parsedFilters: unknown, clarificationAsked: boolean) => {
      addQuery(buildQuery(userInput, resultsCount, apiCalls, parsedFilters, clarificationAsked));
    },
    [buildQuery, addQuery]
  );

  const { messages, isLoading, sendMessage, clearChat } = useChat(keys, mode, handleQueryComplete);

  const handleClearSession = useCallback(() => {
    clearLog();
    clearChat();
  }, [clearLog, clearChat]);

  const goToChat = useCallback(() => setPage('chat'), []);

  if (page === 'landing') {
    return (
      <LandingPage
        onStartDemo={goToChat}
        onStartLive={() => { setPage('chat'); setSettingsOpen(true); }}
        onOpenTransparency={() => setPage('transparency')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  if (page === 'transparency') {
    return (
      <TransparencyPage
        onBack={() => setPage('landing')}
        onStartDemo={goToChat}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // Chat page
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflow: 'hidden' }}>
      <Header
        mode={mode}
        onOpenSettings={() => setSettingsOpen(true)}
        onGoHome={() => setPage('landing')}
        onGoTransparency={() => setPage('transparency')}
        sessionLog={log}
        onDownloadSessionJson={downloadAsJson}
        onDownloadSessionCsv={downloadAsCsv}
        onClearSession={handleClearSession}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <ChatWindow messages={messages} />
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
      {settingsOpen && (
        <SettingsPanel keys={keys} onSave={setKeys} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
}
