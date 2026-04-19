import { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '../lib/types';
import { ChatMessage } from './ChatMessage';

interface ChatWindowProps {
  messages: ChatMessageType[];
}

export function ChatWindow({ messages }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 16px 8px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ maxWidth: '760px', width: '100%', margin: '0 auto', flex: 1 }}>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
