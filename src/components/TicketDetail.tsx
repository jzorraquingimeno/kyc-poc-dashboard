import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { apiService, CompanyInfo } from '../services/api';
import './TicketDetail.css';


const TicketDetail: React.FC = () => {
  const { kvkNumber } = useParams<{ kvkNumber: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline'>('offline');

  useEffect(() => {
    const loadCompanyData = async () => {
      if (!kvkNumber) return;

      try {
        setLoading(true);
        
        // Check API health
        const health = await apiService.healthCheck();
        setApiStatus(health.status === 'healthy' ? 'online' : 'offline');

        // Load company details
        const companyData = await apiService.getCompanyDetails(kvkNumber);
        setCompanyInfo(companyData);
      } catch (error) {
        console.error('Failed to load company data:', error);
        setApiStatus('offline');
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to show loading animation
    const timer = setTimeout(() => {
      loadCompanyData();
    }, 1500);

    return () => clearTimeout(timer);
  }, [kvkNumber]);

  const handleOpenSourceInvestigation = () => {
    navigate(`/investigation/${kvkNumber}`);
  };

  const handleGenerateReport = () => {
    alert('Generating Company Report...');
  };

  const handleSendDocument = () => {
    alert('Opening Document Portal...');
  };

  const handleProposeDecision = () => {
    alert('Proposing Decision...');
  };

  // Remove the separate loading page - we'll show loading inline
  // No need to check for companyInfo here as we handle loading state inline

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
              {loading ? 'Loading...' : companyInfo?.legalName || 'Company Details'}
            </span>
          </div>

          {/* Company Header */}
          <div className="company-header">
            <div className="company-title-section">
              <h1>{loading ? 'Loading Company...' : companyInfo?.legalName}</h1>
              {!loading && (
                <div className={`api-status-indicator ${apiStatus}`}>
                  {apiStatus === 'online' ? 'LIVE DATA' : 'Cached Data'}
                </div>
              )}
            </div>
            <div className="company-status">
              {!loading && companyInfo && (
                <span className={`status-badge ${companyInfo.status.toLowerCase()}`}>
                  {companyInfo.status}
                </span>
              )}
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
                    <span>{companyInfo?.legalName || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Registered Address</label>
                    <span>{companyInfo?.address || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>KvK Number</label>
                    <span>{companyInfo?.kvkNumber || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Legal Form</label>
                    <span>{companyInfo?.legalForm || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Founding Date</label>
                    <span>{companyInfo?.foundingDate || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Current Status</label>
                    <span>{companyInfo?.status || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>SBI Code</label>
                    <span>{companyInfo?.sbiCode || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>SBI Description</label>
                    <span>{companyInfo?.sbiDescription || 'N/A'}</span>
                  </div>
                </div>

                {/* Directors Section */}
                <div className="directors-section">
                  <h3>Directors/Board Members</h3>
                  <ul className="directors-list">
                    {companyInfo?.directors?.map((director, index) => (
                      <li key={index}>{director}</li>
                    )) || <li>No directors information available</li>}
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
                onClick={handleSendDocument}
              >
                Send Documentation Request
              </button>
              <button 
                className="action-btn secondary"
                onClick={handleProposeDecision}
              >
                Propose Decision
              </button>
              <button 
                className="action-btn secondary"
                onClick={handleGenerateReport}
              >
                Generate Company Report
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TicketDetail;