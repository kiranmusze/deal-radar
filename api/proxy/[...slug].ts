// Vercel serverless proxy — forwards requests to OpenRegister API
// Needed because OpenRegister does not send CORS headers for browser requests.
// The user's API key is forwarded as-is and never stored.

export default async function handler(
  req: { method?: string; query: Record<string, string | string[]>; headers: Record<string, string>; body: unknown },
  res: { setHeader: (k: string, v: string) => void; status: (s: number) => { end: () => void; json: (d: unknown) => void } }
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const slugParts = Array.isArray(req.query.slug) ? req.query.slug : [req.query.slug ?? ''];
  const targetPath = '/' + slugParts.join('/');
  const targetUrl = `https://api.openregister.de${targetPath}`;

  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Authorization header required' });

  const fetchOpts: RequestInit = {
    method: req.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
  };

  if (req.method === 'POST' && req.body) {
    fetchOpts.body = JSON.stringify(req.body);
  }

  try {
    const upstream = await fetch(targetUrl, fetchOpts);
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Upstream error', message: String(err) });
  }
}
