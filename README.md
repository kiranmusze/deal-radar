# Deal Radar

Find German companies with succession potential — via natural language.

Open-source BYOK tool by [Kiran Banakar / Valorem Capital](https://www.linkedin.com/in/kiran-banakar/).

---

## What is this?

Deal Radar searches 4+ million German companies via the OpenRegister API.
You describe what you're looking for in plain language, and get structured results with AI analysis.

Built for: PE professionals, M&A advisors, micro-PE investors, acquisition entrepreneurs.

**BYOK (Bring Your Own Key)** — your API keys stay in your browser. No backend, no database, no tracking.

---

## Quick start

### Use online
1. Go to [deal-radar.vercel.app](https://deal-radar.vercel.app) (or your deployed URL)
2. Click **API Keys** in the top right
3. Enter your keys (see below how to get them)
4. Start searching

### Run locally
```bash
git clone https://github.com/kiranmusze/deal-radar.git
cd deal-radar
npm install
npm run dev
```

---

## API Keys

### OpenRegister (company data)
1. Go to [openregister.de](https://openregister.de)
2. Create a free account
3. Navigate to **API Keys** in your dashboard
4. Create a new key (starts with `sk_live_`)
5. Free tier: 50 requests/month (~5 searches)

### Anthropic / Claude (AI analysis)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account
3. Go to **API Keys** → create a key (starts with `sk-ant-`)
4. Add credit (min. $5, enough for ~200 searches)

Full setup guide with screenshots: [Notion](https://valorem.notion.site/deal-radar-anleitung)

---

## Cost per search

| What | Cost |
|------|------|
| Claude (parsing + analysis) | ~€0.03–0.08 |
| OpenRegister (search) | 10 credits = €0.10 |
| OpenRegister (details, optional) | 10 credits = €0.10 |
| **Total per search** | **~€0.15–0.25** |

---

## Privacy & Security

- Your API keys are stored **only in your browser** (localStorage)
- **No backend** — all API calls go directly from your browser (Anthropic) or via a transparent CORS proxy (OpenRegister, which doesn't support browser CORS)
- No account, no registration, no cookies, no analytics
- The CORS proxy forwards your key as-is — it never logs or stores it
- Full source code is open — verify it yourself

---

## Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Claude API (Anthropic) — natural language parsing + analysis
- OpenRegister API — 4M+ German company data
- Vercel — hosting + CORS proxy for OpenRegister
- No backend, no database

---

## Features

- Natural language search → structured filters
- 40 mock companies for demo mode (no keys required)
- 15 preset queries across 5 categories
- Nachfolge scoring (0–100) based on owner age, structure, financials
- Session log with full API transparency (every call logged with cost)
- Dark / light mode (system preference + manual override)
- CSV export (Excel-compatible UTF-8)
- Full API call log — request, response, latency, cost per call

---

## Self-hosting

```bash
git clone https://github.com/kiranmusze/deal-radar.git
cd deal-radar
npm install
npm run build
# Deploy dist/ to any static host + api/ to Vercel
```

For the OpenRegister CORS proxy to work, you need to deploy the `api/` directory to Vercel (or adapt it to another serverless provider).

---

## Contributing

Issues and PRs welcome.

---

## License

MIT — use it however you want.

---

## Credits

Built by [Kiran Banakar](https://www.linkedin.com/in/kiran-banakar/) · [Valorem Capital](https://valorem.capital)  
Company data: [OpenRegister](https://openregister.de)  
AI: [Anthropic](https://anthropic.com)
