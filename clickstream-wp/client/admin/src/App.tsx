import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import './App.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

declare global {
  interface Window {
    clickstreamWPAdmin: {
      apiNonce: string;
      apiUrl: string;
      currentPage: string;
    }
  }
}

function Dashboard() {
  const [count, setCount] = useState(0)

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Page Views',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgb(34, 113, 177)',
        backgroundColor: 'rgba(34, 113, 177, 0.5)',
      },
      {
        label: 'Unique Visitors',
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: 'rgb(19, 94, 150)',
        backgroundColor: 'rgba(19, 94, 150, 0.5)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Website Traffic Overview',
      },
    },
  }

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stats-card">
          <h2>Quick Stats</h2>
          <div className="stats-grid">
            <div>
              <p>Total Views</p>
              <p className="text-2xl font-semibold">1,234</p>
            </div>
            <div>
              <p>Unique Visitors</p>
              <p className="text-2xl font-semibold">567</p>
            </div>
          </div>
        </div>
        <div className="stats-card">
          <h2>Activity</h2>
          <button onClick={() => setCount((count) => count + 1)}>
            Refresh Data ({count})
          </button>
        </div>
      </div>
      <div className="chart-container">
        <Line options={options} data={chartData} />
      </div>
    </div>
  )
}

function Setup() {
  return (
    <div className="admin-page">
      <h1>Setup</h1>
      <div className="stats-card">
        <h2>Configuration</h2>
        <p>Configure your Clickstream WP settings here</p>
        <div className="form-group">
          <label>API Key</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your API key"
          />
        </div>
        <div className="form-group">
          <label>Tracking Mode</label>
          <select className="form-control">
            <option>Production</option>
            <option>Development</option>
            <option>Debug</option>
          </select>
        </div>
        <button>Save Settings</button>
      </div>
    </div>
  )
}

function Privacy() {
  return (
    <div className="admin-page">
      <h1>Privacy</h1>
      <div className="stats-card">
        <h2>Privacy Settings</h2>
        <p>Manage your privacy settings and data handling preferences</p>
        <div className="checkbox-group">
          <input type="checkbox" id="anonymize" />
          <label htmlFor="anonymize">Anonymize IP Addresses</label>
        </div>
        <div className="checkbox-group">
          <input type="checkbox" id="cookies" />
          <label htmlFor="cookies">Enable Cookie Consent</label>
        </div>
        <div className="checkbox-group">
          <input type="checkbox" id="retention" />
          <label htmlFor="retention">Limit Data Retention (30 days)</label>
        </div>
        <button>Save Privacy Settings</button>
      </div>
    </div>
  )
}

function App() {
  const currentPage = window.clickstreamWPAdmin?.currentPage || '';

  switch (currentPage) {
    case 'setup':
      return <Setup />
    case 'privacy':
      return <Privacy />
    default:
      return <Dashboard />
  }
}

export default App 