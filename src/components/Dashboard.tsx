import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, CompanyListItem } from '../services/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setApiStatus] = useState<'online' | 'offline'>('offline');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check API health
        const health = await apiService.healthCheck();
        setApiStatus(health.status === 'healthy' ? 'online' : 'offline');

        // Load companies
        const companiesData = await apiService.getCompanies();
        setCompanies(Array.isArray(companiesData) ? companiesData : []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setApiStatus('offline');
        // Set mock data as fallback
        setCompanies([
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTicketClick = (kvkNumber: string) => {
    navigate(`/ticket/${kvkNumber}`);
  };

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <h2>Overview</h2>
      </div>
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card pending">
            <h3>Pending Tickets</h3>
            <p className="stat-number">23</p>
            <div className="stat-subtitle">
              <span className="high-priority">8 High Priority</span>
            </div>
            <div className="stat-explanation">
              <p>Total tickets awaiting investigation</p>
              <p>requiring immediate attention</p>
            </div>
          </div>
          <div className="stat-card approval">
            <h3>Monthly Approval Rate</h3>
            <div className="approval-rate">
              <div className="approval-circle">
                <span className="approval-percentage">87%</span>
              </div>
              <div className="approval-trend">
                <span className="trend-up">↗ +2.3%</span>
              </div>
            </div>
            <div className="stat-explanation">
              <p>Percentage of KYC investigations</p>
              <p>approved this month</p>
            </div>
          </div>
          <div className="stat-card investigations">
            <h3>Investigations Completed</h3>
            <p className="stat-number">156</p>
            <div className="stat-subtitle">
              <span className="this-month">This Month</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '78%'}}></div>
            </div>
            <div className="stat-explanation">
              <p>Total KYC investigations finalized</p>
              <p>across all priority levels</p>
            </div>
          </div>
          <div className="stat-card personal-kpi">
            <h3>Personal KPI Score</h3>
            <div className="kpi-display">
              <div className="kpi-score">9.2</div>
              <div className="kpi-rating">
                <div className="stars">
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star filled">★</span>
                  <span className="star half">★</span>
                </div>
                <span className="kpi-label">Excellent</span>
              </div>
            </div>
            <div className="stat-explanation">
              <p>Your individual performance rating</p>
              <p>based on quality and efficiency</p>
            </div>
          </div>
        </div>

        <div className="tickets-section">
          <div className="tickets-header">
            <h3>Open Tickets</h3>
          </div>
          <div className="tickets-list">
            <div className="tickets-header-row">
              <div className="header-ticket-info">Ticket Information</div>
              <div className="header-category">Category</div>
              <div className="header-urgency">Priority</div>
              <div className="header-status">Status</div>
              <div className="header-actions">Actions</div>
            </div>
{loading ? (
              <div className="loading-tickets">
                <div className="loading-spinner"></div>
                <p>Loading tickets...</p>
              </div>
            ) : companies.length > 0 ? (
              companies.map((company) => (
                <div key={company.kvkNumber || `company-${Math.random()}`} className="ticket-item" onClick={() => handleTicketClick(company.kvkNumber)}>
                  <div className="ticket-info">
                    <div className="kvk-number">KVK: {company.kvkNumber || 'Unknown'}</div>
                    <div className="company-name">{company.companyName || 'Unknown Company'}</div>
                    <div className="ticket-date">{company.date || 'Unknown Date'}</div>
                  </div>
                  <div className={`ticket-category ${(company.category || 'unknown').toLowerCase()}`}>{company.category || 'Unknown'}</div>
                  <div className={`ticket-urgency ${(company.urgency || 'medium').toLowerCase()}`}>{company.urgency || 'Medium'}</div>
                  <div className={`ticket-status ${(company.status || 'new').toLowerCase().replace(/\s+/g, '-')}`}>{company.status || 'New'}</div>
                  <div className="ticket-actions">{company.actions || 'No Action'}</div>
                </div>
              ))
            ) : (
              <div className="no-tickets">
                <p>No tickets available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;