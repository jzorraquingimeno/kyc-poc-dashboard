import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import DashboardPage from './components/DashboardPage';
import TicketDetail from './components/TicketDetail';
import OpenSourceInvestigation from './components/OpenSourceInvestigation';
import InvestigationReport from './components/InvestigationReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ticket/:kvkNumber" element={<TicketDetail />} />
        <Route path="/investigation/:kvkNumber" element={<OpenSourceInvestigation />} />
        <Route path="/investigation-report/:kvkNumber" element={<InvestigationReport />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
