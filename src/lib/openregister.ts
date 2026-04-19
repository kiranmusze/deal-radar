import { ApiError, SearchFilters, SearchResult, CompanyDetail, ApiCallLog } from './types';
import { loggedFetch } from './api-logger';

// Use Vercel proxy in production and Vite dev-proxy in development.
// OpenRegister does not send CORS headers, so direct browser calls are blocked.
const BASE_URL = '/api/proxy';

function buildFilterBody(filters: SearchFilters) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = { filters: [], pagination: { page: 1, per_page: 20 } };

  if (filters.legal_form) body.filters.push({ field: 'legal_form', value: filters.legal_form });
  if (filters.has_representative_owner) body.filters.push({ field: 'has_representative_owner', value: 'true' });
  if (filters.is_family_owned !== undefined) body.filters.push({ field: 'is_family_owned', value: String(filters.is_family_owned) });
  if (filters.has_sole_owner !== undefined) body.filters.push({ field: 'has_sole_owner', value: String(filters.has_sole_owner) });
  if (filters.youngest_owner_age_min) body.filters.push({ field: 'youngest_owner_age', min: String(filters.youngest_owner_age_min) });
  if (filters.youngest_owner_age_max) body.filters.push({ field: 'youngest_owner_age', max: String(filters.youngest_owner_age_max) });
  if (filters.revenue_min) body.filters.push({ field: 'revenue', min: String(filters.revenue_min) });
  if (filters.revenue_max) body.filters.push({ field: 'revenue', max: String(filters.revenue_max) });
  if (filters.employees_min) body.filters.push({ field: 'employees', min: String(filters.employees_min) });
  if (filters.employees_max) body.filters.push({ field: 'employees', max: String(filters.employees_max) });
  if (filters.city) body.filters.push({ field: 'city', value: filters.city });
  if (filters.zip) body.filters.push({ field: 'zip', value: filters.zip });
  if (filters.industry_codes) body.filters.push({ field: 'industry_codes', value: filters.industry_codes });
  if (filters.equity_min) body.filters.push({ field: 'equity', min: String(filters.equity_min) });
  if (filters.equity_max) body.filters.push({ field: 'equity', max: String(filters.equity_max) });
  if (filters.balance_sheet_total_min) body.filters.push({ field: 'balance_sheet_total', min: String(filters.balance_sheet_total_min) });
  if (filters.balance_sheet_total_max) body.filters.push({ field: 'balance_sheet_total', max: String(filters.balance_sheet_total_max) });
  if (filters.net_income_min) body.filters.push({ field: 'net_income', min: String(filters.net_income_min) });
  if (filters.net_income_max) body.filters.push({ field: 'net_income', max: String(filters.net_income_max) });
  if (filters.incorporated_at_min) body.filters.push({ field: 'incorporated_at', min: filters.incorporated_at_min });
  if (filters.incorporated_at_max) body.filters.push({ field: 'incorporated_at', max: filters.incorporated_at_max });

  return body;
}

export async function searchCompanies(
  apiKey: string,
  filters: SearchFilters
): Promise<{ result: SearchResult; log: ApiCallLog }> {
  const body = buildFilterBody(filters);
  const { response, log } = await loggedFetch(
    'openregister',
    `${BASE_URL}/v1/search/company`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    },
    { creditsUsed: 10, estimatedCostEur: 0.10 }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(response.status, `OpenRegister Fehler (${response.status}): ${text}`);
  }

  const result: SearchResult = await response.json();
  return { result, log };
}

export async function getCompanyDetails(
  apiKey: string,
  companyId: string
): Promise<{ detail: CompanyDetail; log: ApiCallLog }> {
  const { response, log } = await loggedFetch(
    'openregister',
    `${BASE_URL}/v1/company/${companyId}`,
    { headers: { Authorization: `Bearer ${apiKey}` } },
    { creditsUsed: 10, estimatedCostEur: 0.10 }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(response.status, `OpenRegister Fehler (${response.status}): ${text}`);
  }

  const detail: CompanyDetail = await response.json();
  return { detail, log };
}

export async function getCompanyFinancials(apiKey: string, companyId: string) {
  const { response, log } = await loggedFetch(
    'openregister',
    `${BASE_URL}/v1/company/${companyId}/financials`,
    { headers: { Authorization: `Bearer ${apiKey}` } },
    { creditsUsed: 10, estimatedCostEur: 0.10 }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(response.status, `OpenRegister Fehler (${response.status}): ${text}`);
  }

  return { data: await response.json(), log };
}

export async function getCompanyOwners(apiKey: string, companyId: string) {
  const { response, log } = await loggedFetch(
    'openregister',
    `${BASE_URL}/v1/company/${companyId}/owners`,
    { headers: { Authorization: `Bearer ${apiKey}` } },
    { creditsUsed: 10, estimatedCostEur: 0.10 }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(response.status, `OpenRegister Fehler (${response.status}): ${text}`);
  }

  return { data: await response.json(), log };
}
