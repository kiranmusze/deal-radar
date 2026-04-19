import { ApiError, ApiCallLog } from './types';
import { loggedFetch } from './api-logger';

export async function callClaude(
  apiKey: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  systemPrompt: string
): Promise<{ text: string; log: ApiCallLog }> {
  const { response, log } = await loggedFetch(
    'claude',
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    },
    { estimatedCostEur: 0.04 }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(response.status, `Claude API Fehler (${response.status}): ${text}`);
  }

  const data = await response.json();
  const text = (data.content as { type: string; text?: string }[])
    .map((b) => b.text ?? '')
    .join('');

  return { text, log };
}
