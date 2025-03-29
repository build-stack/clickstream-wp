import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { ConfigPanel } from './components/ConfigPanel'
import { SessionsOverview } from './components/SessionsOverview'
import { InsightsDashboard } from './components/InsightsDashboard'
import './App.css'

// Mock data for development
const mockSessions = [
  {
    id: '1',
    startTime: new Date().toISOString(),
    duration: 300,
    pageCount: 5,
    device: 'desktop',
    browser: 'chrome'
  },
  // Add more mock sessions as needed
];

const mockTimeseriesData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  visitors: [150, 230, 180, 290, 200, 150, 320],
  pageviews: [300, 450, 360, 580, 400, 300, 640],
};

const mockTopPages = [
  {
    path: '/home',
    views: 1200,
    avgTimeOnPage: 180
  },
  {
    path: '/products',
    views: 800,
    avgTimeOnPage: 240
  },
  {
    path: '/about',
    views: 500,
    avgTimeOnPage: 120
  },
];

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(true);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [config, setConfig] = useState({
    apiKey: 'sample-api-key-123',
    domain: 'example.com',
    samplingRate: 100
  });

  // Check connection status periodically
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // In a real implementation, this would be an API endpoint check
        const response = await fetch('/wp-json/clickstream/v1/status');
        setIsConnected(response.ok);
      } catch (error) {
        setIsConnected(false);
      }
    };

    // Check immediately on mount
    checkConnection();

    // Then check every 30 seconds
    const intervalId = setInterval(checkConnection, 30000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleConfigSave = (newConfig: typeof config) => {
    setConfig(newConfig);
    // TODO: Save to WordPress options
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // TODO: Fetch filtered data
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  return (
    <div className="app">
      <Header
        isConnected={isConnected}
        trackingEnabled={trackingEnabled}
        onToggleTracking={() => setTrackingEnabled(!trackingEnabled)}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      <main className="app-content">
        <div className="content-grid">
          <div className="main-panel">
            {currentView === 'dashboard' && (
              <InsightsDashboard
                timeseriesData={mockTimeseriesData}
                topPages={mockTopPages}
                interactionMetrics={{
                  avgSessionDuration: 240,
                  bounceRate: 35.5,
                  pagesPerSession: 2.8
                }}
              />
            )}

            {currentView === 'sessions' && (
              <SessionsOverview
                sessions={mockSessions}
                totalSessions={1250}
                onFilterChange={handleFilterChange}
              />
            )}

            {currentView === 'settings' && (
              <ConfigPanel
                apiKey={config.apiKey}
                domain={config.domain}
                samplingRate={config.samplingRate}
                onSave={handleConfigSave}
              />
            )}
          </div>

          {currentView !== 'settings' && (
            <aside className="side-panel">
              <ConfigPanel
                apiKey={config.apiKey}
                domain={config.domain}
                samplingRate={config.samplingRate}
                onSave={handleConfigSave}
              />
            </aside>
          )}
        </div>
      </main>
    </div>
  )
}

export default App 