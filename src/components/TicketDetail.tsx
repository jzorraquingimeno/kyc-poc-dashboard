import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './TicketDetail.css';

interface CompanyInfo {
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

const TicketDetail: React.FC = () => {
  const { kvkNumber } = useParams<{ kvkNumber: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  // Mock company data
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

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      if (kvkNumber && mockCompanyData[kvkNumber]) {
        setCompanyInfo(mockCompanyData[kvkNumber]);
      } else {
        // Default company info for KVK numbers not in mock data
        setCompanyInfo({
          legalName: 'Sample Company B.V.',
          address: 'Business Street 1, 1000 AB Amsterdam',
          kvkNumber: kvkNumber || '00000000',
          legalForm: 'Besloten Vennootschap (B.V.)',
          foundingDate: '01-01-2020',
          status: 'Active',
          sbiCode: '70221',
          sbiDescription: 'Business and other management consultancy activities',
          directors: ['John Doe', 'Jane Smith']
        });
      }
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [kvkNumber]);

  const handleOpenSourceInvestigation = () => {
    navigate(`/investigation/${kvkNumber}`);
  };

  const handleGenerateReport = () => {
    alert('Generating Company Report...');
  };

  const handleScheduleMeeting = () => {
    alert('Scheduling Meeting...');
  };

  const handleSendDocument = () => {
    alert('Opening Document Portal...');
  };

  // Remove the separate loading page - we'll show loading inline

  if (!companyInfo) {
    return <div>Company not found</div>;
  }

  return (
    <div className="App">
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="ticket-detail-main">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb">
            <span onClick={() => navigate('/dashboard')} className="breadcrumb-link">
              Dashboard
            </span>
            <span className="breadcrumb-separator">›</span>
            <span onClick={() => navigate('/dashboard')} className="breadcrumb-link">
              Recent Tickets
            </span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">
              {companyInfo.legalName}
            </span>
          </div>

          {/* Company Header */}
          <div className="company-header">
            <h1>{companyInfo.legalName}</h1>
            <div className="company-status">
              <span className={`status-badge ${companyInfo.status.toLowerCase()}`}>
                {companyInfo.status}
              </span>
            </div>
          </div>

          {/* Company Information */}
          <div className="company-details">
            <h2>Company Information</h2>
            
            {loading ? (
              <div className="loading-content">
                <div className="loading-message">
                  <div className="loading-spinner"></div>
                  <p>Loading company information...</p>
                </div>
                <div className="loading-agents">
                  <div className="agent-animation">
                    <div className="agent-icon">🤖</div>
                    <div className="agent-text">Fetching KVK Registry...</div>
                  </div>
                  <div className="agent-animation">
                    <div className="agent-icon">🔍</div>
                    <div className="agent-text">Analyzing Company Data...</div>
                  </div>
                  <div className="agent-animation">
                    <div className="agent-icon">📊</div>
                    <div className="agent-text">Compiling Information...</div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Legal Company Name</label>
                    <span>{companyInfo.legalName}</span>
                  </div>
                  <div className="info-item">
                    <label>Registered Address</label>
                    <span>{companyInfo.address}</span>
                  </div>
                  <div className="info-item">
                    <label>KvK Number</label>
                    <span>{companyInfo.kvkNumber}</span>
                  </div>
                  <div className="info-item">
                    <label>Legal Form</label>
                    <span>{companyInfo.legalForm}</span>
                  </div>
                  <div className="info-item">
                    <label>Founding Date</label>
                    <span>{companyInfo.foundingDate}</span>
                  </div>
                  <div className="info-item">
                    <label>Current Status</label>
                    <span>{companyInfo.status}</span>
                  </div>
                  <div className="info-item">
                    <label>SBI Code</label>
                    <span>{companyInfo.sbiCode}</span>
                  </div>
                  <div className="info-item">
                    <label>SBI Description</label>
                    <span>{companyInfo.sbiDescription}</span>
                  </div>
                </div>

                {/* Directors Section */}
                <div className="directors-section">
                  <h3>Directors/Board Members</h3>
                  <ul className="directors-list">
                    {companyInfo.directors.map((director, index) => (
                      <li key={index}>{director}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Call to Actions */}
          <div className="actions-section">
            <h2>Available Actions</h2>
            <div className="actions-grid">
              <button 
                className="action-btn primary"
                onClick={handleOpenSourceInvestigation}
              >
                Perform Open Source Investigation
              </button>
              <button 
                className="action-btn secondary"
                onClick={handleGenerateReport}
              >
                Generate Company Report
              </button>
              <button 
                className="action-btn secondary"
                onClick={handleScheduleMeeting}
              >
                Schedule Meeting
              </button>
              <button 
                className="action-btn secondary"
                onClick={handleSendDocument}
              >
                Send Documentation Request
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TicketDetail;