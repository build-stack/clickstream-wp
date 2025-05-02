import { useState, useEffect } from 'react'
import Header from './components/Header'
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
  const [isConnected, setIsConnected] = useState(false)

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

  return (
    <div className="app">
      <Header isConnected={isConnected} />
      <div className="app-content">
        <div className="dashboard-grid">
          <InsightsDashboard
            timeseriesData={mockTimeseriesData}
            topPages={mockTopPages}
            interactionMetrics={{
              avgSessionDuration: 245,
              bounceRate: 35,
              pagesPerSession: 3.5
            }}
          />
          <SessionsOverview
            sessions={mockSessions}
            totalSessions={156}
            onFilterChange={() => {}}
          />
        </div>
      </div>
    </div>
  )
}

export default App 