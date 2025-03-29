import { useState, useEffect } from 'react'
import Header from './components/Header'
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
  const [currentView, setCurrentView] = useState('insights')
  const [isConnected, setIsConnected] = useState(false)
  const [config, setConfig] = useState({
    apiKey: '',
    domain: '',
    samplingRate: 100,
  })

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/wp-json/clickstream/v1/status')
        const data = await response.json()
        setIsConnected(data.connected)
      } catch (error) {
        setIsConnected(false)
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleNavigate = (view: string) => {
    setCurrentView(view)
  }

  const handleSaveConfig = (newConfig: typeof config) => {
    setConfig(newConfig)
    // TODO: Save to WordPress options
  }

  return (
    <div className="app">
      <Header
        currentView={currentView}
        isConnected={isConnected}
        onNavigate={handleNavigate}
      />
      
      <div className="app-content">
        <div className="content-grid">
          <main className="main-panel">
            {currentView === 'insights' && (
              <InsightsDashboard
                timeseriesData={mockTimeseriesData}
                topPages={mockTopPages}
                interactionMetrics={{
                  avgSessionDuration: 245,
                  bounceRate: 35,
                  pagesPerSession: 3.5
                }}
              />
            )}
            {currentView === 'sessions' && (
              <SessionsOverview
                sessions={mockSessions}
                totalSessions={156}
                onFilterChange={() => {}}
              />
            )}
            {currentView === 'settings' && (
              <ConfigPanel
                apiKey={config.apiKey}
                domain={config.domain}
                samplingRate={config.samplingRate}
                onSave={handleSaveConfig}
              />
            )}
          </main>

          {currentView !== 'settings' && (
            <aside className="side-panel">
              <ConfigPanel
                apiKey={config.apiKey}
                domain={config.domain}
                samplingRate={config.samplingRate}
                onSave={handleSaveConfig}
              />
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}

export default App 