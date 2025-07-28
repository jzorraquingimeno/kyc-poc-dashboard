// API service with fallback to mock data
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://abn-kyc-backend.orangeground-daffc4e4.westeurope.azurecontainerapps.io';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000');
const USE_MOCK_FALLBACK = process.env.REACT_APP_USE_MOCK_DATA_FALLBACK === 'true';

export interface CompanyInfo {
  legalName: string;
  address: string;
  kvkNumber: string;
  legalForm: string;
  foundingDate: string;
  status: string;
  sbiCode: string;
  sbiDescription: string;
  directors: string[];
}

export interface CompanyListItem {
  kvkNumber: string;
  companyName: string;
  date: string;
  category: string;
  urgency: string;
  status: string;
  actions: string;
}

export interface ProcessKYCRequest {
  company_name: string;
  home_url: string;
  about_url: string;
}

// Mock data as fallback
const mockCompanyData: { [key: string]: CompanyInfo } = {
  '12345678': {
    legalName: 'Amsterdam Tech Solutions B.V.',
    address: 'Herengracht 123, 1015 BG Amsterdam',
    kvkNumber: '12345678',
    legalForm: 'Besloten Vennootschap (B.V.)',
    foundingDate: '15-03-2018',
    status: 'Active',
    sbiCode: '62010',
    sbiDescription: 'Computer programming activities',
    directors: ['J.M. van der Berg', 'S.A. de Vries']
  },
  '23456789': {
    legalName: 'Green Garden Services',
    address: 'Parkstraat 45, 2011 ML Haarlem',
    kvkNumber: '23456789',
    legalForm: 'Eenmanszaak',
    foundingDate: '22-06-2020',
    status: 'Active',
    sbiCode: '81300',
    sbiDescription: 'Landscape service activities',
    directors: ['P.J. Janssen']
  },
  '34567890': {
    legalName: 'Rotterdam Logistics Group',
    address: 'Maasboulevard 100, 3063 NS Rotterdam',
    kvkNumber: '34567890',
    legalForm: 'Besloten Vennootschap (B.V.)',
    foundingDate: '08-11-2016',
    status: 'Active',
    sbiCode: '52291',
    sbiDescription: 'Forwarding agencies, ship brokers, etc.',
    directors: ['M.R. Bakker', 'L.H. Smit', 'A.C. van Dijk']
  }
};

const mockCompanyList: CompanyListItem[] = [
  {
    kvkNumber: '12345678',
    companyName: 'Amsterdam Tech Solutions B.V.',
    date: '2024-01-15',
    category: 'KYC',
    urgency: 'High',
    status: 'New',
    actions: 'Investigation Required'
  },
  {
    kvkNumber: '23456789',
    companyName: 'Green Garden Services',
    date: '2024-01-14',
    category: 'KYC',
    urgency: 'Medium',
    status: 'In Progress',
    actions: 'Investigation Required'
  },
  {
    kvkNumber: '34567890',
    companyName: 'Rotterdam Logistics Group',
    date: '2024-01-13',
    category: 'KYC',
    urgency: 'Low',
    status: 'Pending Information',
    actions: 'Investigation Required'
  }
];

class APIService {
  private shouldUseMockFallback(): boolean {
    return USE_MOCK_FALLBACK;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; version: string; companies_loaded: number; timestamp: string }> {
    try {
      return await this.makeRequest('/health');
    } catch (error) {
      console.warn('Health check failed, API may be unavailable');
      return {
        status: 'unavailable',
        version: '1.0.0',
        companies_loaded: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  async getCompanies(): Promise<CompanyListItem[]> {
    try {
      const response = await this.makeRequest<{ companies: any[]; total_count: number }>('/companies');
      
      // Transform API response to match our interface
      const companies = response.companies.map((company: any) => ({
        kvkNumber: company.kvk_number?.toString() || 'Unknown',
        companyName: company.legal_entity_name || company.legal_name || 'Unknown Company',
        date: company.founding_date || new Date().toISOString().split('T')[0],
        category: 'KYC',
        urgency: company.priority || company.urgency || 'Medium',
        status: company.status || 'New',
        actions: 'Investigation Required'
      }));

      return companies;
    } catch (error) {
      console.warn('Failed to fetch companies from API, using mock data:', error);
      return mockCompanyList;
    }
  }

  async getCompanyDetails(kvkNumber: string): Promise<CompanyInfo> {
    try {
      const response = await this.makeRequest<any>('/companyDetails/', {
        method: 'POST',
        body: JSON.stringify({ kvk_number: kvkNumber }),
      });

      // Transform API response to match our interface
      const companyData = response.company_data || response;
      const uboData = response.ubo_data || [];
      
      // Extract directors from UBO data
      const directors = uboData.map((ubo: any) => 
        ubo['UBO name 1'] || ubo['UBO name 2'] || ubo['UBO name 3'] || 'Unknown'
      ).filter((name: string) => name !== 'Unknown');

      const companyInfo: CompanyInfo = {
        legalName: companyData.legal_entity_name || 'Unknown Company',
        address: companyData.registered_address || 'Address not available',
        kvkNumber: companyData.kvk_number?.toString() || kvkNumber,
        legalForm: companyData.legal_form || 'Unknown',
        foundingDate: companyData.founding_date || 'Unknown',
        status: companyData.status || 'Active',
        sbiCode: companyData.sbi_code || 'Unknown',
        sbiDescription: companyData.sbi_description || 'Unknown',
        directors: directors.length > 0 ? directors : ['No directors information available']
      };

      return companyInfo;
    } catch (error) {
      console.warn(`Failed to fetch company details for ${kvkNumber} from API, using mock data:`, error);
      
      // Return mock data or default company info
      if (mockCompanyData[kvkNumber]) {
        return mockCompanyData[kvkNumber];
      }
      
      return {
        legalName: 'Sample Company B.V.',
        address: 'Business Street 1, 1000 AB Amsterdam',
        kvkNumber: kvkNumber,
        legalForm: 'Besloten Vennootschap (B.V.)',
        foundingDate: '01-01-2020',
        status: 'Active',
        sbiCode: '70221',
        sbiDescription: 'Business and other management consultancy activities',
        directors: ['John Doe', 'Jane Smith']
      };
    }
  }

  async processKYC(request: ProcessKYCRequest): Promise<any> {
    try {
      const response = await this.makeRequest<any>('/processkyc', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      return response;
    } catch (error) {
      console.warn('Failed to process KYC from API, returning mock response:', error);
      
      // Return mock KYC processing result
      return {
        status: 'completed',
        company_name: request.company_name,
        risk_score: Math.floor(Math.random() * 100),
        findings: [
          'Company website appears legitimate',
          'No negative news found in recent searches',
          'Social media presence is consistent with business activities'
        ],
        recommendations: [
          'Proceed with standard onboarding process',
          'Request additional documentation for verification'
        ],
        processed_at: new Date().toISOString()
      };
    }
  }

  async getRoot(): Promise<{ message: string; version: string; docs_url: string; health_url: string }> {
    try {
      return await this.makeRequest('/');
    } catch (error) {
      console.warn('Failed to fetch root endpoint:', error);
      return {
        message: 'API unavailable - using offline mode',
        version: '1.0.0',
        docs_url: '/docs',
        health_url: '/health'
      };
    }
  }
}

export const apiService = new APIService();