import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleUserIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('User icon clicked - navigating to login');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="platform-title">Agentic KYC platform</div>
        <div className="logo">
          <img src="/Logo%20NorthStar%20Bank.png" alt="NorthStar Bank" className="logo-image" />
        </div>
      </div>
      <div className="header-right">
        <nav className="nav-menu">
          <a href="#accounts" className="nav-item">Accounts</a>
          <a href="#payments" className="nav-item">Payments</a>
          <a href="#investments" className="nav-item">Investments</a>
          <button onClick={handleUserIconClick} className="nav-item user-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;