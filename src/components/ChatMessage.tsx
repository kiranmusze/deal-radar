import { ChatMessage as ChatMessageType } from '../lib/types';
import { ResultsTable } from './ResultsTable';
import { ApiCallPanel } from './ApiCallPanel';
import { NewsletterBanner } from './NewsletterBanner';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  // Newsletter banner
  if (message.role === 'banner') {
    return <NewsletterBanner />;
  }

  if (message.isLoading) {
    return (
      <div className="animate-fade-up flex items-start gap-3 mb-4">
        <AssistantAvatar />
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '0 10px 10px 10px',
            padding: '12px 16px',
          }}
        >
          {message.apiCalls && message.apiCalls.length > 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '8px' }}>
              {message.apiCalls.length === 1 ? 'Anfrage wird analysiert…' : 'Unternehmen werden gesucht…'}
            </div>
          ) : null}
          <div className="flex gap-1.5 items-center">
            <div className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)' }} />
            <div className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)' }} />
            <div className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="animate-fade-up flex justify-end mb-4">
        <div
          style={{
            background: 'rgba(200,180,140,0.1)',
            border: '1px solid rgba(200,180,140,0.2)',
            borderRadius: '10px 0 10px 10px',
            padding: '10px 14px',
            maxWidth: '80%',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up flex items-start gap-3 mb-4">
      <AssistantAvatar />
      <div style={{ flex: 1, minWidth: 0 }}>
        {message.content && (
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '0 10px 10px 10px',
              padding: '12px 16px',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              color: 'var(--text-primary)',
              marginBottom: message.results ? '10px' : 0,
              whiteSpace: 'pre-wrap',
            }}
          >
            {message.content}
          </div>
        )}

        {message.results && message.results.length > 0 && (
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '6px',
            }}
          >
            {message.searchSummary && (
              <div
                style={{
                  color: 'var(--gold)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  marginBottom: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {message.searchSummary}
              </div>
            )}
            <ResultsTable companies={message.results} isDemo={message.isDemo} />
          </div>
        )}

        {/* API Transparency Panel */}
        {message.apiCalls && message.apiCalls.length > 0 && (
          <ApiCallPanel apiCalls={message.apiCalls} />
        )}
      </div>
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: 'rgba(200,180,140,0.1)',
        border: '1px solid rgba(200,180,140,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 2,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="var(--gold)" strokeWidth="2" />
        <circle cx="16" cy="16" r="5" stroke="var(--gold)" strokeWidth="1.5" opacity="0.6" />
        <circle cx="16" cy="16" r="2" fill="var(--gold)" />
      </svg>
    </div>
  );
}
