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
        <h2>Dashboard Overview</h2>
      </div>
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card pending">
            <h3>Pending Tickets</h3>
            <p className="stat-number">23</p>
            <div className="stat-subtitle">
              <span className="high-priority">8 High Priority</span>
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
          </div>
        </div>

        <div className="tickets-section">
          <div className="tickets-header">
            <h3>Recent Tickets</h3>
          </div>
          <div className="tickets-list">
            <div className="ticket-item" onClick={() => handleTicketClick('12345678')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 12345678</div>
                <div className="company-name">Amsterdam Tech Solutions B.V.</div>
                <div className="ticket-date">2024-01-15</div>
              </div>
              <div className="ticket-category compliance">Compliance</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-actions">Account Verification Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('23456789')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 23456789</div>
                <div className="company-name">Green Garden Services</div>
                <div className="ticket-date">2024-01-14</div>
              </div>
              <div className="ticket-category onboarding">Onboarding</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Document Upload Needed</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('34567890')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 34567890</div>
                <div className="company-name">Rotterdam Logistics Group</div>
                <div className="ticket-date">2024-01-13</div>
              </div>
              <div className="ticket-category support">Support</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Profile Update Request</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('45678901')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 45678901</div>
                <div className="company-name">Utrecht Creative Studio</div>
                <div className="ticket-date">2024-01-12</div>
              </div>
              <div className="ticket-category compliance">Compliance</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-actions">Compliance Review Pending</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('56789012')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 56789012</div>
                <div className="company-name">Eindhoven Engineering Works</div>
                <div className="ticket-date">2024-01-11</div>
              </div>
              <div className="ticket-category payments">Payments</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Payment Authorization Required</div>
            </div>

            <div className="ticket-item" onClick={() => handleTicketClick('67890123')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 67890123</div>
                <div className="company-name">The Hague Consulting Partners</div>
                <div className="ticket-date">2024-01-10</div>
              </div>
              <div className="ticket-category onboarding">Onboarding</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-actions">Business Account Setup</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('78901234')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 78901234</div>
                <div className="company-name">Groningen Farm Fresh Ltd.</div>
                <div className="ticket-date">2024-01-09</div>
              </div>
              <div className="ticket-category support">Support</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">PIN Reset Request</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('89012345')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 89012345</div>
                <div className="company-name">Maastricht Import Export</div>
                <div className="ticket-date">2024-01-08</div>
              </div>
              <div className="ticket-category payments">Payments</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-actions">International Transfer Block</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('90123456')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 90123456</div>
                <div className="company-name">Breda Building Supplies</div>
                <div className="ticket-date">2024-01-07</div>
              </div>
              <div className="ticket-category compliance">Compliance</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">KYC Documentation Update</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('01234567')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 01234567</div>
                <div className="company-name">Leiden Medical Devices</div>
                <div className="ticket-date">2024-01-06</div>
              </div>
              <div className="ticket-category onboarding">Onboarding</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Welcome Package Delivery</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('11223344')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 11223344</div>
                <div className="company-name">Haarlem Bakery & Café</div>
                <div className="ticket-date">2024-01-05</div>
              </div>
              <div className="ticket-category support">Support</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Card Replacement Request</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('22334455')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 22334455</div>
                <div className="company-name">Nijmegen Software Solutions</div>
                <div className="ticket-date">2024-01-04</div>
              </div>
              <div className="ticket-category payments">Payments</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Standing Order Modification</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('33445566')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 33445566</div>
                <div className="company-name">Tilburg Transport Services</div>
                <div className="ticket-date">2024-01-03</div>
              </div>
              <div className="ticket-category compliance">Compliance</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-actions">Suspicious Activity Report</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('44556677')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 44556677</div>
                <div className="company-name">Alkmaar Digital Marketing</div>
                <div className="ticket-date">2024-01-02</div>
              </div>
              <div className="ticket-category onboarding">Onboarding</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Digital Banking Activation</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('55667788')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 55667788</div>
                <div className="company-name">Zwolle Manufacturing Co.</div>
                <div className="ticket-date">2024-01-01</div>
              </div>
              <div className="ticket-category support">Support</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Statement Request</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('66778899')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 66778899</div>
                <div className="company-name">Arnhem Property Management</div>
                <div className="ticket-date">2023-12-31</div>
              </div>
              <div className="ticket-category payments">Payments</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-actions">Failed Direct Debit Resolution</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('77889900')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 77889900</div>
                <div className="company-name">Apeldoorn Event Planning</div>
                <div className="ticket-date">2023-12-30</div>
              </div>
              <div className="ticket-category compliance">Compliance</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Annual Review Required</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('88990011')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 88990011</div>
                <div className="company-name">Enschede Auto Repair</div>
                <div className="ticket-date">2023-12-29</div>
              </div>
              <div className="ticket-category onboarding">Onboarding</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Account Closure Request</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('99001122')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 99001122</div>
                <div className="company-name">Dordrecht Web Design</div>
                <div className="ticket-date">2023-12-28</div>
              </div>
              <div className="ticket-category support">Support</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Mobile App Login Issues</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('10111213')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 10111213</div>
                <div className="company-name">Delft Innovation Labs</div>
                <div className="ticket-date">2023-12-27</div>
              </div>
              <div className="ticket-category payments">Payments</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-actions">Credit Limit Increase Request</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('20212223')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 20212223</div>
                <div className="company-name">Amersfoort Legal Services</div>
                <div className="ticket-date">2023-12-26</div>
              </div>
              <div className="ticket-category compliance">Compliance</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Data Privacy Inquiry</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('30313233')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 30313233</div>
                <div className="company-name">Venlo Trading Company</div>
                <div className="ticket-date">2023-12-25</div>
              </div>
              <div className="ticket-category onboarding">Onboarding</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Corporate Account Setup</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('40414243')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 40414243</div>
                <div className="company-name">Hilversum Media Production</div>
                <div className="ticket-date">2023-12-24</div>
              </div>
              <div className="ticket-category support">Support</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Branch Appointment Scheduling</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('50515253')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 50515253</div>
                <div className="company-name">Zaandam Food Processing</div>
                <div className="ticket-date">2023-12-23</div>
              </div>
              <div className="ticket-category payments">Payments</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-actions">Currency Exchange Rate Dispute</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('60616263')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 60616263</div>
                <div className="company-name">Emmen Energy Solutions</div>
                <div className="ticket-date">2023-12-22</div>
              </div>
              <div className="ticket-category compliance">Compliance</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Tax Document Submission</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('70717273')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 70717273</div>
                <div className="company-name">Deventer Print & Design</div>
                <div className="ticket-date">2023-12-21</div>
              </div>
              <div className="ticket-category onboarding">Onboarding</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Investment Account Opening</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('80818283')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 80818283</div>
                <div className="company-name">Leeuwarden Maritime</div>
                <div className="ticket-date">2023-12-20</div>
              </div>
              <div className="ticket-category support">Support</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Insurance Claim Processing</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('90919293')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 90919293</div>
                <div className="company-name">Gouda Cheese & Dairy</div>
                <div className="ticket-date">2023-12-19</div>
              </div>
              <div className="ticket-category payments">Payments</div>
              <div className="ticket-urgency high">High</div>
              <div className="ticket-actions">Mortgage Payment Issue</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('10203040')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 10203040</div>
                <div className="company-name">Alphen IT Services</div>
                <div className="ticket-date">2023-12-18</div>
              </div>
              <div className="ticket-category compliance">Compliance</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">Regular Monitoring Check</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('50607080')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 50607080</div>
                <div className="company-name">Purmerend Construction</div>
                <div className="ticket-date">2023-12-17</div>
              </div>
              <div className="ticket-category onboarding">Onboarding</div>
              <div className="ticket-urgency medium">Medium</div>
              <div className="ticket-actions">Multi-currency Account Setup</div>
            </div>
            
            <div className="ticket-item" onClick={() => handleTicketClick('90100110')}>
              <div className="ticket-info">
                <div className="kvk-number">KVK: 90100110</div>
                <div className="company-name">Vlaardingen Logistics</div>
                <div className="ticket-date">2023-12-16</div>
              </div>
              <div className="ticket-category support">Support</div>
              <div className="ticket-urgency low">Low</div>
              <div className="ticket-actions">General Account Inquiry</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;