import { ApiCallLog } from './types';

export function maskApiKey(key: string): string {
  if (!key || key.length <= 8) return '****';
  return '****' + key.slice(-4);
}

export async function loggedFetch(
  provider: 'claude' | 'openregister',
  url: string,
  options: RequestInit,
  meta?: { creditsUsed?: number; estimatedCostEur?: number }
): Promise<{ response: Response; log: ApiCallLog }> {
  const startTime = Date.now();
  const id = crypto.randomUUID();

  // Parse and sanitize request body
  let requestBody: unknown = null;
  if (options.body) {
    try {
      requestBody = JSON.parse(options.body as string);
    } catch {
      requestBody = '[binary]';
    }
  }

  // Sanitize headers (mask keys)
  const sanitizedHeaders: Record<string, string> = {};
  const headers = options.headers as Record<string, string> | undefined;
  if (headers) {
    Object.entries(headers).forEach(([k, v]) => {
      const lower = k.toLowerCase();
      if (lower === 'authorization') {
        sanitizedHeaders[k] = 'Bearer ' + maskApiKey(v.replace('Bearer ', ''));
      } else if (lower === 'x-api-key') {
        sanitizedHeaders[k] = maskApiKey(v);
      } else {
        sanitizedHeaders[k] = v;
      }
    });
  }

  const response = await fetch(url, options);
  const latencyMs = Date.now() - startTime;

  // Clone response to read body for log without consuming original
  const cloned = response.clone();
  let responseBody: unknown = null;
  try {
    const json = await cloned.json();
    // Truncate large company arrays
    if (json && Array.isArray(json.companies) && json.companies.length > 5) {
      responseBody = {
        ...json,
        companies: json.companies.slice(0, 3),
        _truncated: true,
        _totalCount: json.companies.length,
      };
    } else {
      responseBody = json;
    }
  } catch {
    responseBody = { _text: '[non-JSON response]' };
  }

  const estimatedCostEur =
    meta?.estimatedCostEur ??
    (provider === 'claude' ? 0.04 : (meta?.creditsUsed ?? 10) * 0.01);

  const log: ApiCallLog = {
    id,
    timestamp: startTime,
    provider,
    endpoint: url.replace(/^https?:\/\/[^/]+/, ''),
    method: (options.method ?? 'GET') as 'GET' | 'POST',
    requestBody: { headers: sanitizedHeaders, body: requestBody },
    responseStatus: response.status,
    responseBody,
    latencyMs,
    estimatedCostEur,
    creditsUsed: meta?.creditsUsed,
  };

  return { response, log };
}
