import React from 'react';
import './LoadingPage.css';

const LoadingPage: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <h2>Loading company information...</h2>
        <p>Please wait while we retrieve the ticket details</p>
      </div>
    </div>
  );
};

export default LoadingPage;