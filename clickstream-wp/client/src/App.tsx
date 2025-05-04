import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Setup from './pages/Setup';
import Privacy from './pages/Privacy';
import SessionDetails from './pages/SessionDetails';

const App: React.FC = () => {
  // Get WordPress admin settings
  const wpSettings = window.clickstreamWPAdmin || {
    currentPage: 'clickstream-wp',
    apiUrl: '',
    apiNonce: '',
    pluginUrl: ''
  };

  // Determine initial route based on WordPress current page
  const initialPage = () => {
    switch (wpSettings.currentPage) {
      case 'setup':
        return '/setup';
      case 'privacy':
        return '/privacy';
      default:
        return '/';
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/session/:sessionId" element={<SessionDetails />} />
        {/* Redirect to appropriate page based on WordPress current page */}
        <Route path="*" element={<Navigate to={initialPage()} replace />} />
      </Routes>
    </Router>
  );
};

export default App; 