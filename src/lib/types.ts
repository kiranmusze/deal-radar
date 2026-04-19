// Core company types from OpenRegister API
export interface Company {
  company_id: string;
  name: string;
  city: string;
  zip: string;
  state?: string; // Bundesland, fuer Demo-Filterung
  legal_form: string;
  industry: string;
  industry_codes?: string;
  employees: number;
  revenue: number; // in Cent
  youngest_owner_age: number;
  has_representative_owner: boolean;
  is_family_owned: boolean;
  has_sole_owner: boolean;
  incorporated_at: string; // DD-MM-YYYY
  balance_sheet_total: number; // in Cent
  equity: number; // in Cent
  net_income: number; // in Cent
  liabilities: number; // in Cent
  score?: ScoreBreakdown;
}

export interface CompanyDetail extends Company {
  address?: string;
  register_number?: string;
  register_court?: string;
  owners?: Owner[];
  financials?: FinancialYear[];
}

export interface Owner {
  name: string;
  age?: number;
  share_percent?: number;
  is_representative: boolean;
}

export interface FinancialYear {
  year: number;
  revenue: number;
  net_income: number;
  equity: number;
  balance_sheet_total: number;
  employees: number;
}

export interface ScoreBreakdown {
  total: number;
  ownerAge: number;
  ownerManaged: number;
  noFamilySuccessor: number;
  revenueSweetSpot: number;
  employeeSweetSpot: number;
  companyAge: number;
  soleOwner: number;
}

export interface FinancialRatios {
  eigenkapitalquote: string;
  verschuldungsgrad: string;
  umsatzRendite: string;
  umsatzProMitarbeiter: number;
  bilanzsummeEur: number;
  eigenkapitalEur: number;
  umsatzEur: number;
  netIncomeEur: number;
}

// Search filter structure (internal, pre-API)
export interface SearchFilters {
  legal_form?: string;
  youngest_owner_age_min?: number;
  youngest_owner_age_max?: number;
  has_representative_owner?: boolean;
  is_family_owned?: boolean;
  has_sole_owner?: boolean;
  revenue_min?: number; // Cent
  revenue_max?: number; // Cent
  employees_min?: number;
  employees_max?: number;
  city?: string;
  zip?: string;
  industry_codes?: string;
  incorporated_at_min?: string; // DD-MM-YYYY
  incorporated_at_max?: string; // DD-MM-YYYY
  balance_sheet_total_min?: number;
  balance_sheet_total_max?: number;
  equity_min?: number;
  equity_max?: number;
  net_income_min?: number;
  net_income_max?: number;
}

// Claude parse response
export interface ClaudeSearchAction {
  action: 'search';
  filters: SearchFilters;
  summary: string;
}

export type ClaudeResponse = ClaudeSearchAction | string;

// API Call Logging
export interface ApiCallLog {
  id: string;
  timestamp: number;
  provider: 'claude' | 'openregister';
  endpoint: string;
  method: 'GET' | 'POST';
  requestBody: unknown;
  responseStatus: number;
  responseBody: unknown;
  latencyMs: number;
  estimatedCostEur: number;
  creditsUsed?: number;
}

// Session Log
export interface SessionLog {
  sessionId: string;
  startedAt: string;
  mode: 'demo' | 'live';
  queries: SessionQuery[];
  totalApiCalls: number;
  totalEstimatedCostEur: number;
  totalOpenRegisterCredits: number;
}

export interface SessionQuery {
  id: string;
  timestamp: string;
  userInput: string;
  parsedFilters: unknown | null;
  clarificationAsked: boolean;
  resultsCount: number;
  apiCalls: ApiCallLog[];
  estimatedCostEur: number;
}

// Chat message
export type MessageRole = 'user' | 'assistant' | 'system' | 'banner';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  results?: Company[];
  searchSummary?: string;
  isLoading?: boolean;
  isDemo?: boolean;
  apiCalls?: ApiCallLog[]; // logged API calls for this message
}

// App state
export interface AppKeys {
  openregisterKey: string;
  claudeKey: string;
}

export type AppMode = 'demo' | 'live';

// Preset query
export interface PresetQuery {
  label: string;
  query: string;
  category: 'Nachfolge' | 'Financial' | 'Sektor' | 'Kontraintuitiv' | 'Geo';
}

// API errors
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Search result from OpenRegister
export interface SearchResult {
  companies: Company[];
  total: number;
  page: number;
  per_page: number;
}
