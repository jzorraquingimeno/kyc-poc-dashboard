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

  // Convert API response to findings format with fallback handling
  const getFindings = (): Finding[] => {
    if (!investigationData) {
      console.log('No investigation data available');
      return [];
    }

    console.log('Investigation data structure:', investigationData);

    // Helper function to convert risk score to risk level
    const getRiskLevel = (score: number): 'Low' | 'Medium' | 'High' => {
      if (score <= 30) return 'Low';
      if (score <= 70) return 'Medium';
      return 'High';
    };

    const findings: Finding[] = [];

    // Try detailed risk assessment structure first
    if (investigationData.risk_assessment) {
      const riskAssessment = investigationData.risk_assessment;
      console.log('Using detailed risk assessment data:', riskAssessment);

      // Process all risk categories
      const riskCategories = [
        { key: 'geo_risk', name: 'Geographical Risk' },
        { key: 'industry_risk', name: 'Industry Risk' },
        { key: 'structure_risk', name: 'Structure Risk' },
        { key: 'adverse_media_risk', name: 'Adverse Media Risk' },
        { key: 'sanctions_risk', name: 'Sanctions Risk' },
        { key: 'pep_risk', name: 'PEP Risk' }
      ];

      riskCategories.forEach(category => {
        const riskData = riskAssessment[category.key];
        if (riskData) {
          findings.push({
            category: riskData['Risk Category'] || category.name,
            description: riskData.Summary || `${category.name}: ${riskData['Risk Description'] || 'No information available.'}`,
            risk: getRiskLevel(riskData['Risk Score'] || 0)
          });
        }
      });
    }
    
    // Fallback to simple findings structure
    else if (investigationData.findings && Array.isArray(investigationData.findings)) {
      console.log('Using simple findings structure:', investigationData.findings);
      
      investigationData.findings.forEach((finding: string, index: number) => {
        // Determine risk level based on overall risk score and finding content
        let riskLevel: 'Low' | 'Medium' | 'High' = getRiskLevel(investigationData.risk_score || 0);
        
        // Adjust risk level based on finding content
        const findingLower = finding.toLowerCase();
        if (findingLower.includes('negative') || findingLower.includes('risk') || findingLower.includes('concern')) {
          riskLevel = 'High';
        } else if (findingLower.includes('legitimate') || findingLower.includes('consistent') || findingLower.includes('no negative')) {
          riskLevel = 'Low';
        }

        findings.push({
          category: `Investigation Finding ${index + 1}`,
          description: finding,
          risk: riskLevel
        });
      });
    }

    // If no findings found, create a summary finding from the overall data
    if (findings.length === 0 && (investigationData.risk_score !== undefined || investigationData.status)) {
      console.log('Creating summary finding from overall data');
      
      const overallRisk = getRiskLevel(investigationData.risk_score || 0);
      const status = investigationData.status || 'Unknown';
      
      findings.push({
        category: 'Overall Assessment',
        description: `Investigation completed with status: ${status}. Risk score: ${investigationData.risk_score || 'Not available'}/100.`,
        risk: overallRisk
      });
    }

    console.log('Generated findings:', findings);
    return findings;
  };

  const findings = getFindings();

  // Generate risk scores from API data with fallback
  const getRiskScores = (): RiskScore[] => {
    const scores: RiskScore[] = [];

    // Try detailed risk assessment structure first
    if (investigationData?.risk_assessment) {
      const riskAssessment = investigationData.risk_assessment;

      const riskCategories = [
        { key: 'geo_risk', name: 'Geographical Risk', weight: 20 },
        { key: 'industry_risk', name: 'Industry Risk', weight: 15 },
        { key: 'structure_risk', name: 'Structure Risk', weight: 25 },
        { key: 'adverse_media_risk', name: 'Adverse Media Risk', weight: 15 },
        { key: 'sanctions_risk', name: 'Sanctions Risk', weight: 15 },
        { key: 'pep_risk', name: 'PEP Risk', weight: 10 }
      ];

      riskCategories.forEach(category => {
        const riskData = riskAssessment[category.key];
        if (riskData) {
          scores.push({ 
            category: riskData['Risk Category'] || category.name, 
            score: riskData['Risk Score'] || 0, 
            weight: category.weight 
          });
        }
      });
    }
    
    // Fallback: create a single overall risk score
    else if (investigationData?.risk_score !== undefined) {
      scores.push({
        category: 'Overall Risk Assessment',
        score: Math.round(investigationData.risk_score / 10), // Convert from 0-100 to 0-10 scale
        weight: 100
      });
    }

    return scores;
  };

  const riskScores = getRiskScores();

  // Use final_risk_score from API with fallback to risk_score (scale conversion)
  const overallScore = investigationData?.risk_assessment?.final_risk_score || 
                      (investigationData?.risk_score ? Math.round(investigationData.risk_score / 10) : 0);

  // Generate conclusion based on overall score and available data
  const getConclusion = (): string => {
    const riskLevel = overallScore <= 3 ? 'LOW RISK' : overallScore <= 7 ? 'MEDIUM RISK' : 'HIGH RISK';
    
    // Use available description from API
    const companyDescription = investigationData?.public_web_data?.company_description;
    const recommendations = investigationData?.recommendations;
    
    let conclusion = `Based on comprehensive open-source investigation, ${companyName} presents a ${riskLevel} profile with a final risk score of ${overallScore}/10.`;
    
    if (companyDescription) {
      conclusion += ` ${companyDescription.substring(0, 300)}${companyDescription.length > 300 ? '...' : ''}`;
    } else if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
      conclusion += ` Key recommendation: ${recommendations[0]}`;
    } else {
      conclusion += ` Investigation completed successfully with detailed findings available above.`;
    }
    
    return conclusion;
  };

  const conclusion = loading ? 'Loading investigation results...' : getConclusion();

  // Extract Evidence Locker from API sources
  const getEvidenceLocker = () => {
    if (!investigationData?.risk_assessment) return [];
    
    const evidence: Array<{category: string, sources: Array<{title: string, link: string, snippet: string}>}> = [];
    const riskAssessment = investigationData.risk_assessment;

    const riskCategories = [
      { key: 'geo_risk', name: 'Geographical Risk' },
      { key: 'industry_risk', name: 'Industry Risk' },
      { key: 'structure_risk', name: 'Structure Risk' },
      { key: 'adverse_media_risk', name: 'Adverse Media Risk' },
      { key: 'sanctions_risk', name: 'Sanctions Risk' },
      { key: 'pep_risk', name: 'PEP Risk' }
    ];

    riskCategories.forEach(category => {
      const riskData = riskAssessment[category.key];
      if (riskData?.Source) {
        const categoryEvidence = {
          category: riskData['Risk Category'] || category.name,
          sources: [] as Array<{title: string, link: string, snippet: string}>
        };

        // Handle different source structures
        if (typeof riskData.Source === 'object') {
          Object.keys(riskData.Source).forEach(sourceType => {
            const sourceList = riskData.Source[sourceType];
            if (Array.isArray(sourceList)) {
              sourceList.forEach((source: any) => {
                if (source.title && source.link) {
                  categoryEvidence.sources.push({
                    title: source.title,
                    link: source.link,
                    snippet: source.snippet || 'No snippet available'
                  });
                }
              });
            }
          });
        }

        if (categoryEvidence.sources.length > 0) {
          evidence.push(categoryEvidence);
        }
      }
    });

    return evidence;
  };

  const evidenceLocker = getEvidenceLocker();

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
              {findings.length > 0 ? (
                findings.map((finding, index) => (
                  <div key={index} className="finding-item">
                    <div className="finding-header">
                      <h4>{finding.category}</h4>
                      <span className={`risk-badge ${finding.risk.toLowerCase()}`}>
                        {finding.risk}
                      </span>
                    </div>
                    <p>{finding.description}</p>
                  </div>
                ))
              ) : (
                <div className="no-findings">
                  <p>No findings available. Check browser console for API response details.</p>
                  {investigationData && (
                    <details style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
                      <summary>Debug: Raw API Response</summary>
                      <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '300px' }}>
                        {JSON.stringify(investigationData, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Conclusion Section */}
          <div className="report-section conclusion-section">
            <h3>CONCLUSION</h3>
            <div className="conclusion-content">
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-number">{overallScore}</span>
                  <span className="score-max">/10</span>
                </div>
                <div className="score-label">
                  <span className={`risk-level ${overallScore <= 3 ? 'low' : overallScore <= 7 ? 'medium' : 'high'}`}>
                    {overallScore <= 3 ? 'LOW RISK' : overallScore <= 7 ? 'MEDIUM RISK' : 'HIGH RISK'}
                  </span>
                </div>
              </div>
              <div className="conclusion-text">
                <p>{conclusion}</p>
              </div>
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
                      style={{ width: `${(item.score / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="score-value">{item.score}/10</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Locker */}
          {evidenceLocker.length > 0 && (
            <div className="report-section">
              <h3>Evidence Locker</h3>
              <div className="evidence-categories">
                {evidenceLocker.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="evidence-category">
                    <h4>{category.category}</h4>
                    <div className="evidence-sources">
                      {category.sources.map((source, sourceIndex) => (
                        <div key={sourceIndex} className="evidence-item">
                          <div className="evidence-header">
                            <a 
                              href={source.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="evidence-link"
                            >
                              {source.title}
                            </a>
                          </div>
                          <div className="evidence-snippet">
                            {source.snippet}
                          </div>
                          <div className="evidence-url">
                            <small>{source.link}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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