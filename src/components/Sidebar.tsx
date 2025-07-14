import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <a href="#overview" className="sidebar-item active">Overview</a>
        <a href="#accounts" className="sidebar-item">Account Management</a>
        <a href="#transactions" className="sidebar-item">Transactions</a>
        <a href="#customers" className="sidebar-item">Customer Insights</a>
        <a href="#risk" className="sidebar-item">Risk Assessment</a>
      </nav>
    </aside>
  );
};

export default Sidebar;