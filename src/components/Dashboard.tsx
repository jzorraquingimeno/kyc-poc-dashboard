import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

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
            <div className="ticket-item" onClick={() => handleTicketClick('12345678')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 12345678</div>
                <div className="company-name">Amsterdam Tech Solutions B.V.</div>
                <div className="ticket-date">2024-01-15</div>
              </div>
              <div className="ticket-category compliance">KYC</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-status new">New</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('23456789')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 23456789</div>
                <div className="company-name">Green Garden Services</div>
                <div className="ticket-date">2024-01-14</div>
              </div>
              <div className="ticket-category onboarding">KYC</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-status in-progress">In Progress</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('34567890')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 34567890</div>
                <div className="company-name">Rotterdam Logistics Group</div>
                <div className="ticket-date">2024-01-13</div>
              </div>
              <div className="ticket-category support">KYC</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-status pending-info">Pending Information</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('45678901')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 45678901</div>
                <div className="company-name">Utrecht Creative Studio</div>
                <div className="ticket-date">2024-01-12</div>
              </div>
              <div className="ticket-category compliance">KYC</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-status escalated">Escalated</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('56789012')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 56789012</div>
                <div className="company-name">Eindhoven Engineering Works</div>
                <div className="ticket-date">2024-01-11</div>
              </div>
              <div className="ticket-category payments">KYC</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-status new">New</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>

            <div className="ticket-item" onClick={() => handleTicketClick('67890123')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 67890123</div>
                <div className="company-name">The Hague Consulting Partners</div>
                <div className="ticket-date">2024-01-10</div>
              </div>
              <div className="ticket-category onboarding">KYC</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-status in-progress">In Progress</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('78901234')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 78901234</div>
                <div className="company-name">Groningen Farm Fresh Ltd.</div>
                <div className="ticket-date">2024-01-09</div>
              </div>
              <div className="ticket-category support">KYC</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-status pending-info">Pending Information</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('89012345')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 89012345</div>
                <div className="company-name">Maastricht Import Export</div>
                <div className="ticket-date">2024-01-08</div>
              </div>
              <div className="ticket-category payments">KYC</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-status escalated">Escalated</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('90123456')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 90123456</div>
                <div className="company-name">Breda Building Supplies</div>
                <div className="ticket-date">2024-01-07</div>
              </div>
              <div className="ticket-category compliance">KYC</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-status new">New</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('01234567')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 01234567</div>
                <div className="company-name">Leiden Medical Devices</div>
                <div className="ticket-date">2024-01-06</div>
              </div>
              <div className="ticket-category onboarding">KYC</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('11223344')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 11223344</div>
                <div className="company-name">Haarlem Bakery & Café</div>
                <div className="ticket-date">2024-01-05</div>
              </div>
              <div className="ticket-category support">KYC</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('22334455')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 22334455</div>
                <div className="company-name">Nijmegen Software Solutions</div>
                <div className="ticket-date">2024-01-04</div>
              </div>
              <div className="ticket-category payments">KYC</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('33445566')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 33445566</div>
                <div className="company-name">Tilburg Transport Services</div>
                <div className="ticket-date">2024-01-03</div>
              </div>
              <div className="ticket-category compliance">KYC</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('44556677')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 44556677</div>
                <div className="company-name">Alkmaar Digital Marketing</div>
                <div className="ticket-date">2024-01-02</div>
              </div>
              <div className="ticket-category onboarding">KYC</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('55667788')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 55667788</div>
                <div className="company-name">Zwolle Manufacturing Co.</div>
                <div className="ticket-date">2024-01-01</div>
              </div>
              <div className="ticket-category support">KYC</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('66778899')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 66778899</div>
                <div className="company-name">Arnhem Property Management</div>
                <div className="ticket-date">2023-12-31</div>
              </div>
              <div className="ticket-category payments">KYC</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('77889900')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 77889900</div>
                <div className="company-name">Apeldoorn Event Planning</div>
                <div className="ticket-date">2023-12-30</div>
              </div>
              <div className="ticket-category compliance">KYC</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('88990011')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 88990011</div>
                <div className="company-name">Enschede Auto Repair</div>
                <div className="ticket-date">2023-12-29</div>
              </div>
              <div className="ticket-category onboarding">KYC</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('99001122')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 99001122</div>
                <div className="company-name">Dordrecht Web Design</div>
                <div className="ticket-date">2023-12-28</div>
              </div>
              <div className="ticket-category support">KYC</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('10111213')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 10111213</div>
                <div className="company-name">Delft Innovation Labs</div>
                <div className="ticket-date">2023-12-27</div>
              </div>
              <div className="ticket-category payments">KYC</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('20212223')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 20212223</div>
                <div className="company-name">Amersfoort Legal Services</div>
                <div className="ticket-date">2023-12-26</div>
              </div>
              <div className="ticket-category compliance">KYC</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('30313233')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 30313233</div>
                <div className="company-name">Venlo Trading Company</div>
                <div className="ticket-date">2023-12-25</div>
              </div>
              <div className="ticket-category onboarding">KYC</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('40414243')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 40414243</div>
                <div className="company-name">Hilversum Media Production</div>
                <div className="ticket-date">2023-12-24</div>
              </div>
              <div className="ticket-category support">KYC</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('50515253')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 50515253</div>
                <div className="company-name">Zaandam Food Processing</div>
                <div className="ticket-date">2023-12-23</div>
              </div>
              <div className="ticket-category payments">KYC</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('60616263')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 60616263</div>
                <div className="company-name">Emmen Energy Solutions</div>
                <div className="ticket-date">2023-12-22</div>
              </div>
              <div className="ticket-category compliance">KYC</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('70717273')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 70717273</div>
                <div className="company-name">Deventer Print & Design</div>
                <div className="ticket-date">2023-12-21</div>
              </div>
              <div className="ticket-category onboarding">KYC</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('80818283')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 80818283</div>
                <div className="company-name">Leeuwarden Maritime</div>
                <div className="ticket-date">2023-12-20</div>
              </div>
              <div className="ticket-category support">KYC</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('90919293')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 90919293</div>
                <div className="company-name">Gouda Cheese & Dairy</div>
                <div className="ticket-date">2023-12-19</div>
              </div>
              <div className="ticket-category payments">KYC</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('10203040')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 10203040</div>
                <div className="company-name">Alphen IT Services</div>
                <div className="ticket-date">2023-12-18</div>
              </div>
              <div className="ticket-category compliance">KYC</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('50607080')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 50607080</div>
                <div className="company-name">Purmerend Construction</div>
                <div className="ticket-date">2023-12-17</div>
              </div>
              <div className="ticket-category onboarding">KYC</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('90100110')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 90100110</div>
                <div className="company-name">Vlaardingen Logistics</div>
                <div className="ticket-date">2023-12-16</div>
              </div>
              <div className="ticket-category support">KYC</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Investigation Required</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;