import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './InvestigationReport.css';

interface Finding {
  category: string;
  description: string;
  risk: 'Low' | 'Medium' | 'High';
}

interface RiskScore {
  category: string;
  score: number;
  weight: number;
}

const InvestigationReport: React.FC = () => {
  const { kvkNumber } = useParams<{ kvkNumber: string }>();
  const navigate = useNavigate();

  const companyName = 'Amsterdam Tech Solutions B.V.';
  const searchKeywords = ['Amsterdam Tech Solutions', 'Software Development', 'Netherlands Tech', 'B.V. Amsterdam', 'Computer Programming'];
  
  const findings: Finding[] = [
    {
      category: 'Geographical Risk',
      description: 'Company operates primarily in the Netherlands, a low-risk jurisdiction with strong regulatory framework.',
      risk: 'Low'
    },
    {
      category: 'Industry Risk',
      description: 'Technology/Software development sector with standard business practices. No high-risk industry indicators.',
      risk: 'Low'
    },
    {
      category: 'Structure Risk',
      description: 'Standard B.V. corporate structure with transparent ownership. No complex holding structures identified.',
      risk: 'Low'
    },
    {
      category: 'Adverse Media',
      description: 'No significant adverse media coverage found. Company maintains positive business reputation.',
      risk: 'Low'
    },
    {
      category: 'Sanctions Check',
      description: 'No matches found against UN, EU, or other major sanctions lists for company or directors.',
      risk: 'Low'
    },
    {
      category: 'PEP Check',
      description: 'No politically exposed persons identified among directors or beneficial owners.',
      risk: 'Low'
    }
  ];

  const riskScores: RiskScore[] = [
    { category: 'Geographical Risk', score: 1, weight: 20 },
    { category: 'Industry Risk', score: 1, weight: 15 },
    { category: 'Structure Risk', score: 1, weight: 25 },
    { category: 'Adverse Media', score: 1, weight: 15 },
    { category: 'Sanctions', score: 1, weight: 15 },
    { category: 'PEP', score: 1, weight: 10 }
  ];

  const overallScore = 1.2;
  const conclusion = "Based on comprehensive open-source investigation, Amsterdam Tech Solutions B.V. presents a LOW RISK profile. The company operates in a regulated jurisdiction, maintains standard corporate practices, and shows no indicators of high-risk activities or associations.";

  const evidenceItems = [
    'KVK Registration Certificate - Verified',
    'Company Website Analysis - Clean',
    'Director Background Checks - Clear',
    'Media Coverage Analysis - Positive',
    'Sanctions Database Searches - No Hits',
    'Corporate Structure Verification - Standard',
    'Industry Classification - Confirmed',
    'Regulatory Compliance Check - Satisfactory'
  ];

  return (
    <div className="App">
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="report-main">
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
            <span onClick={() => navigate(`/ticket/${kvkNumber}`)} className="breadcrumb-link">
              {companyName}
            </span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">
              Investigation Report
            </span>
          </div>

          {/* Report Header */}
          <div className="report-header">
            <h1>OPEN-SOURCE INVESTIGATION REPORT</h1>
            <h2>{companyName}</h2>
            <div className="report-meta">
              <span>KVK: {kvkNumber}</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Keywords Section */}
          <div className="report-section">
            <h3>Search Keywords Used</h3>
            <div className="keywords-container">
              {searchKeywords.map((keyword, index) => (
                <span key={index} className="keyword-tag">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Findings Section */}
          <div className="report-section">
            <h3>FINDINGS</h3>
            <div className="findings-grid">
              {findings.map((finding, index) => (
                <div key={index} className="finding-item">
                  <div className="finding-header">
                    <h4>{finding.category}</h4>
                    <span className={`risk-badge ${finding.risk.toLowerCase()}`}>
                      {finding.risk}
                    </span>
                  </div>
                  <p>{finding.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conclusion Section */}
          <div className="report-section conclusion-section">
            <h3>CONCLUSION</h3>
            <div className="conclusion-content">
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-number">{overallScore}</span>
                  <span className="score-max">/4</span>
                </div>
                <div className="score-label">
                  <span className="risk-level low">LOW RISK</span>
                </div>
              </div>
              <div className="conclusion-text">
                <p>{conclusion}</p>
              </div>
            </div>
          </div>

          {/* Evidence Locker Section */}
          <div className="report-section">
            <h3>Evidence Locker</h3>
            <div className="evidence-grid">
              {evidenceItems.map((item, index) => (
                <div key={index} className="evidence-item">
                  <div className="evidence-icon">📄</div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Score Breakdown */}
          <div className="report-section">
            <h3>Risk Score Breakdown</h3>
            <div className="score-breakdown">
              {riskScores.map((item, index) => (
                <div key={index} className="score-item">
                  <div className="score-info">
                    <span className="score-category">{item.category}</span>
                    <span className="score-weight">Weight: {item.weight}%</span>
                  </div>
                  <div className="score-bar">
                    <div 
                      className="score-fill"
                      style={{ width: `${(item.score / 4) * 100}%` }}
                    ></div>
                  </div>
                  <span className="score-value">{item.score}/4</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="report-actions">
            <button 
              className="action-btn primary"
              onClick={() => window.print()}
            >
              Download Report
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => navigate(`/ticket/${kvkNumber}`)}
            >
              Back to Ticket
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InvestigationReport;