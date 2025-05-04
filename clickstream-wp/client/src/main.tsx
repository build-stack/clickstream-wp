import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Get WordPress admin settings (will be provided by WordPress)
declare global {
  interface Window {
    clickstreamWPAdmin?: {
      apiNonce: string;
      apiUrl: string;
      currentPage: string;
      pluginUrl: string;
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 