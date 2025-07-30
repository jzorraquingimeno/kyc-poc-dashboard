import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { apiService, CompanyInfo } from '../services/api';
import './OpenSourceInvestigation.css';

interface Step {
  id: number;
  title: string;
  subActivities: string[];
}


const OpenSourceInvestigation: React.FC = () => {
  const { kvkNumber } = useParams<{ kvkNumber: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubActivity, setCurrentSubActivity] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isProcessingResults, setIsProcessingResults] = useState(false);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline'>('offline');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const steps: Step[] = useMemo(() => [
    {
      id: 1,
      title: 'Open-source Investigation',
      subActivities: [
        'Geographical Risk Investigation',
        'Industry Risk Investigation', 
        'Structure Risk Investigation',
        'Adverse Media Risk Investigation',
        'Sanctions List Check',
        'Politically Exposed Person (PEP)'
      ]
    },
    {
      id: 2,
      title: 'Disambiguation & Validation',
      subActivities: [
        'Cross-Reference Checks',
        'Adverse Media Validation',
        'PEP Validation',
        'Sanctions Hit Validation',
        'Consolidate and Deduplicate',
        'Flag Inconsistencies'
      ]
    },
    {
      id: 3,
      title: 'Regulatory Compliance & Risk Assessor',
      subActivities: [
        'Regulatory Compliance Mapping',
        'Determine Regulatory Flags',
        'Generate Compliance Notes',
        'Assign Weight',
        'Aggregate Scores',
        'Apply Risk Scoring Methodology'
      ]
    },
    {
      id: 4,
      title: 'Report Generation & Evidence Locker',
      subActivities: [
        'Summary Generation',
        'Risk Assessment',
        'Risk Findings',
        'Regulatory Compliance Summary',
        'Evidence Locker Compilation',
        'Report Visualization'
      ]
    }
  ], []);

  // Load company data from API
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
        
        // Fallback to basic company info if API fails
        setCompanyInfo({
          legalName: 'Unknown Company',
          address: 'Address not available',
          kvkNumber: kvkNumber,
          legalForm: 'Unknown',
          foundingDate: 'Unknown',
          status: 'Unknown',
          sbiCode: 'Unknown',
          sbiDescription: 'Unknown',
          directors: ['Unknown']
        });
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [kvkNumber]);

  // Handle investigation progress with minimum 10-second animation
  useEffect(() => {
    if (!companyInfo || loading) return;
    
    const minimumAnimationTime = 10000; // 10 seconds minimum
    const totalSubActivities = steps.reduce((acc, step) => acc + step.subActivities.length, 0);
    const intervalDuration = minimumAnimationTime / totalSubActivities;

    let animationStartTime = Date.now();
    let apiCallInitiated = false;

    const interval = setInterval(() => {
      setCurrentSubActivity(prev => {
        const nextSubActivity = prev + 1;
        
        // Calculate which step we're in based on sub-activities completed
        let currentStepIndex = 0;
        let activitiesCount = 0;
        
        for (let i = 0; i < steps.length; i++) {
          if (nextSubActivity <= activitiesCount + steps[i].subActivities.length) {
            currentStepIndex = i;
            break;
          }
          activitiesCount += steps[i].subActivities.length;
        }
        
        setCurrentStep(currentStepIndex);
        setProgress((nextSubActivity / totalSubActivities) * 100);
        
        // Check if we've completed animation and minimum time has passed
        if (nextSubActivity >= totalSubActivities) {
          setIsComplete(true);
          clearInterval(interval);
          
          const elapsedTime = Date.now() - animationStartTime;
          
          // Start API call if minimum time has passed
          if (elapsedTime >= minimumAnimationTime && !apiCallInitiated) {
            apiCallInitiated = true;
            processInvestigation();
          } else if (!apiCallInitiated) {
            // Wait for remaining time before starting API call
            const remainingTime = minimumAnimationTime - elapsedTime;
            setTimeout(() => {
              if (!apiCallInitiated) {
                apiCallInitiated = true;
                processInvestigation();
              }
            }, remainingTime);
          }
        }
        
        return nextSubActivity;
      });
    }, intervalDuration);

    // Function to handle API processing
    const processInvestigation = async () => {
      setIsProcessingResults(true);
      
      try {
        // Check API health
        const health = await apiService.healthCheck();
        setApiStatus(health.status === 'healthy' ? 'online' : 'offline');

        // Process KYC investigation
        const companyName = companyInfo?.legalName || 'Unknown Company';
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const investigationResult = await apiService.processKYC({
          company_name: companyName,
          home_url: `https://example.com/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
          about_url: `https://example.com/${companyName.toLowerCase().replace(/\s+/g, '-')}/about`
        });

        // Store investigation result for report page
        // The result will be retrieved again in the InvestigationReport component
        
        // Navigate to report after processing
        setTimeout(() => {
          navigate(`/investigation-report/${kvkNumber}`);
        }, 1000);
      } catch (error) {
        console.error('Failed to process KYC investigation:', error);
        setApiStatus('offline');
        
        // Still navigate to report even if API fails (will use mock data)
        setTimeout(() => {
          navigate(`/investigation-report/${kvkNumber}`);
        }, 1000);
      }
    };

    return () => clearInterval(interval);
  }, [kvkNumber, navigate, steps, companyInfo, loading]);

  const getSubActivityIndex = (globalIndex: number) => {
    let count = 0;
    for (let i = 0; i < currentStep; i++) {
      count += steps[i].subActivities.length;
    }
    return globalIndex - count;
  };

  return (
    <div className="App">
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="investigation-main">
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
              {loading ? 'Loading...' : companyInfo?.legalName || 'Unknown Company'}
            </span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">
              Open Source Investigation
            </span>
          </div>

          {/* Investigation Header */}
          <div className="investigation-header">
            <div className="investigation-title-section">
              <h1>Open Source Investigation</h1>
              {isComplete && (
                <div className={`api-status-indicator ${apiStatus}`}>
                  {apiStatus === 'online' ? 'LIVE DATA' : 'Offline Mode'}
                </div>
              )}
            </div>
            <p>
              {loading ? 'Loading company information...' : 
                `${companyInfo?.legalName || 'Unknown Company'} (KVK: ${companyInfo?.kvkNumber || kvkNumber})`
              }
            </p>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-steps">
              {steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`progress-step ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
                >
                  <div className="step-number">{step.id}</div>
                  <div className="step-title">{step.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Activities */}
          {!isComplete && (
            <div className="activities-container">
              <h2>Step {currentStep + 1}: {steps[currentStep]?.title}</h2>
              <div className="activities-grid">
                {steps[currentStep]?.subActivities.map((activity, index) => {
                  const subActivityIndex = getSubActivityIndex(currentSubActivity);
                  const isActive = index === subActivityIndex;
                  const isCompleted = index < subActivityIndex;
                  
                  return (
                    <div 
                      key={index} 
                      className={`activity-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    >
                      <div className="activity-icon">
                        {isCompleted ? '✓' : isActive ? '🤖' : '○'}
                      </div>
                      <div className="activity-text">{activity}</div>
                      {isActive && (
                        <div className="activity-spinner">
                          <div className="spinner"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Agents Animation */}
          <div className="ai-agents-container">
            <div className="agent-animation">
              <div className="agent-icon">🤖</div>
              <div className="agent-text">AI Agent Processing...</div>
            </div>
            <div className="agent-animation">
              <div className="agent-icon">🔍</div>
              <div className="agent-text">Analyzing Data Sources...</div>
            </div>
            <div className="agent-animation">
              <div className="agent-icon">📊</div>
              <div className="agent-text">Generating Insights...</div>
            </div>
          </div>

          {/* Completion Message */}
          {isComplete && !isProcessingResults && (
            <div className="completion-message">
              <h2>Investigation Complete!</h2>
              <p>Preparing to process results...</p>
            </div>
          )}
          
          {/* Processing Results Message */}
          {isProcessingResults && (
            <div className="completion-message">
              <h2>Processing Investigation Results</h2>
              <p>Generating comprehensive report from API data...</p>
              <div className="loading-spinner"></div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OpenSourceInvestigation;