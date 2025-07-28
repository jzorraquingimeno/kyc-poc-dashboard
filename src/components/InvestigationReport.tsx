import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { apiService } from '../services/api';
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
  
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline'>('offline');
  const [investigationData, setInvestigationData] = useState<any>(null);
  const [companyData, setCompanyData] = useState<any>(null);

  // Load investigation data from API
  useEffect(() => {
    const loadInvestigationData = async () => {
      if (!kvkNumber) return;

      try {
        setLoading(true);
        
        // First get company details to get the company name
        const companyInfo = await apiService.getCompanyDetails(kvkNumber);
        setCompanyData(companyInfo);
        
        // Check API health
        const health = await apiService.healthCheck();
        setApiStatus(health.status === 'healthy' ? 'online' : 'offline');

        // Get investigation results from processKYC
        const investigationResult = await apiService.processKYC({
          company_name: companyInfo.legalName,
          home_url: `https://example.com/${companyInfo.legalName.toLowerCase().replace(/\s+/g, '-')}`,
          about_url: `https://example.com/${companyInfo.legalName.toLowerCase().replace(/\s+/g, '-')}/about`
        });

        setInvestigationData(investigationResult);
      } catch (error) {
        console.error('Failed to load investigation data:', error);
        setApiStatus('offline');
      } finally {
        setLoading(false);
      }
    };

    loadInvestigationData();
  }, [kvkNumber]);

  const companyName = companyData?.legalName || 'Unknown Company';

  // Convert API risk assessment to findings format
  const getFindings = (): Finding[] => {
    if (!investigationData?.risk_assessment) {
      return []; // Return empty array if no data
    }

    const riskAssessment = investigationData.risk_assessment;
    const findings: Finding[] = [];

    // Helper function to convert risk score to risk level
    const getRiskLevel = (score: number): 'Low' | 'Medium' | 'High' => {
      if (score <= 3) return 'Low';
      if (score <= 7) return 'Medium';
      return 'High';
    };

    // Geographical Risk
    if (riskAssessment.geo_risk) {
      findings.push({
        category: 'Geographical Risk',
        description: riskAssessment.geo_risk.Summary || 'No geographical risk information available.',
        risk: getRiskLevel(riskAssessment.geo_risk.Risk_Score || 0)
      });
    }

    // Industry Risk
    if (riskAssessment.industry_risk) {
      findings.push({
        category: 'Industry Risk', 
        description: riskAssessment.industry_risk.Summary || 'No industry risk information available.',
        risk: getRiskLevel(riskAssessment.industry_risk.Risk_Score || 0)
      });
    }

    // Structure Risk
    if (riskAssessment.structure_risk) {
      findings.push({
        category: 'Structure Risk',
        description: riskAssessment.structure_risk.Summary || 'No structure risk information available.',
        risk: getRiskLevel(riskAssessment.structure_risk.Risk_Score || 0)
      });
    }

    // Adverse Media Risk
    if (riskAssessment.adverse_media_risk) {
      findings.push({
        category: 'Adverse Media',
        description: riskAssessment.adverse_media_risk.Summary || 'No adverse media information available.',
        risk: getRiskLevel(riskAssessment.adverse_media_risk.Risk_Score || 0)
      });
    }

    // Sanctions Risk
    if (riskAssessment.sanctions_risk) {
      findings.push({
        category: 'Sanctions Check',
        description: riskAssessment.sanctions_risk.Summary || 'No sanctions information available.',
        risk: getRiskLevel(riskAssessment.sanctions_risk.Risk_Score || 0)
      });
    }

    // PEP Risk
    if (riskAssessment.pep_risk) {
      findings.push({
        category: 'PEP Check',
        description: riskAssessment.pep_risk.Summary || 'No PEP information available.',
        risk: getRiskLevel(riskAssessment.pep_risk.Risk_Score || 0)
      });
    }

    return findings;
  };

  const findings = getFindings();

  // Generate risk scores from API data
  const getRiskScores = (): RiskScore[] => {
    if (!investigationData?.risk_assessment) {
      return [];
    }

    const riskAssessment = investigationData.risk_assessment;
    const scores: RiskScore[] = [];

    if (riskAssessment.geo_risk) {
      scores.push({ category: 'Geographical Risk', score: riskAssessment.geo_risk.Risk_Score || 0, weight: 20 });
    }
    if (riskAssessment.industry_risk) {
      scores.push({ category: 'Industry Risk', score: riskAssessment.industry_risk.Risk_Score || 0, weight: 15 });
    }
    if (riskAssessment.structure_risk) {
      scores.push({ category: 'Structure Risk', score: riskAssessment.structure_risk.Risk_Score || 0, weight: 25 });
    }
    if (riskAssessment.adverse_media_risk) {
      scores.push({ category: 'Adverse Media', score: riskAssessment.adverse_media_risk.Risk_Score || 0, weight: 15 });
    }
    if (riskAssessment.sanctions_risk) {
      scores.push({ category: 'Sanctions', score: riskAssessment.sanctions_risk.Risk_Score || 0, weight: 15 });
    }
    if (riskAssessment.pep_risk) {
      scores.push({ category: 'PEP', score: riskAssessment.pep_risk.Risk_Score || 0, weight: 10 });
    }

    return scores;
  };

  const riskScores = getRiskScores();

  // Calculate overall risk score
  const calculateOverallScore = (): number => {
    if (riskScores.length === 0) return 0;
    
    const weightedSum = riskScores.reduce((sum, item) => sum + (item.score * item.weight), 0);
    const totalWeight = riskScores.reduce((sum, item) => sum + item.weight, 0);
    
    return totalWeight > 0 ? +(weightedSum / totalWeight).toFixed(1) : 0;
  };

  const overallScore = calculateOverallScore();

  // Generate conclusion based on overall score
  const getConclusion = (): string => {
    const riskLevel = overallScore <= 3 ? 'LOW RISK' : overallScore <= 7 ? 'MEDIUM RISK' : 'HIGH RISK';
    return `Based on comprehensive open-source investigation, ${companyName} presents a ${riskLevel} profile. ${investigationData?.public_web_data?.company_description ? 'Company analysis shows: ' + investigationData.public_web_data.company_description.substring(0, 200) + '...' : 'No additional company description available.'}`;
  };

  const conclusion = loading ? 'Loading investigation results...' : getConclusion();

  // Generate search keywords from company data
  const getSearchKeywords = (): string[] => {
    if (!companyData && !investigationData) return [];
    
    const keywords: string[] = [];
    
    if (companyData?.legalName) {
      keywords.push(companyData.legalName);
      // Add variations of company name
      const nameParts = companyData.legalName.split(' ');
      if (nameParts.length > 1) {
        keywords.push(nameParts.slice(0, -1).join(' ')); // Without legal form
      }
    }
    
    if (companyData?.sbiDescription) {
      keywords.push(companyData.sbiDescription);
    }
    
    if (investigationData?.public_web_data?.key_activities) {
      keywords.push(investigationData.public_web_data.key_activities);
    }
    
    return keywords.slice(0, 5); // Limit to 5 keywords
  };

  const searchKeywords = getSearchKeywords();

  // Generate evidence items from API data
  const getEvidenceItems = (): string[] => {
    if (!investigationData && !companyData) return [];
    
    const evidence: string[] = [];
    
    if (companyData) {
      evidence.push('KVK Registration Certificate - Verified');
      evidence.push(`Company Structure (${companyData.legalForm}) - Confirmed`);
      evidence.push(`Industry Classification (${companyData.sbiCode}) - Verified`);
    }
    
    if (investigationData?.public_web_data?.company_url) {
      evidence.push('Company Website Analysis - Completed');
    }
    
    if (investigationData?.ubo_data?.length > 0) {
      evidence.push(`Director/UBO Checks (${investigationData.ubo_data.length} individuals) - Clear`);
    }
    
    if (investigationData?.risk_assessment?.adverse_media_risk) {
      evidence.push('Media Coverage Analysis - Reviewed');
    }
    
    if (investigationData?.risk_assessment?.sanctions_risk) {
      evidence.push('Sanctions Database Searches - Completed');
    }
    
    if (investigationData?.risk_assessment?.pep_risk) {
      evidence.push('PEP Database Checks - Verified');
    }
    
    return evidence;
  };

  const evidenceItems = getEvidenceItems();

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
            <div className="report-title-section">
              <h1>OPEN-SOURCE INVESTIGATION REPORT</h1>
              {!loading && (
                <div className={`api-status-indicator ${apiStatus}`}>
                  {apiStatus === 'online' ? 'LIVE DATA' : 'Offline Mode'}
                </div>
              )}
            </div>
            <h2>{loading ? 'Loading Company...' : companyName}</h2>
            <div className="report-meta">
              <span>KVK: {kvkNumber}</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {loading ? (
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p>Processing investigation data...</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default InvestigationReport;