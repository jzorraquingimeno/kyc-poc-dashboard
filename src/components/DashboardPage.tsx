import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

const DashboardPage: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <div className="app-container">
        <Sidebar />
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;