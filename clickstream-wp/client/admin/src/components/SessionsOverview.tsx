import { useState } from 'react';

interface Session {
  id: string;
  startTime: string;
  duration: number;
  pageCount: number;
  device: string;
  browser: string;
}

interface SessionsOverviewProps {
  sessions: Session[];
  totalSessions: number;
  onFilterChange: (filters: SessionFilters) => void;
}

interface SessionFilters {
  timeRange: string;
  device?: string;
  browser?: string;
}

export function SessionsOverview({ sessions, totalSessions, onFilterChange }: SessionsOverviewProps) {
  const [filters, setFilters] = useState<SessionFilters>({
    timeRange: '24h',
  });

  const handleFilterChange = (key: keyof SessionFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  return (
    <div className="sessions-overview">
      <div className="overview-header">
        <h2>Recent Sessions</h2>
        <div className="session-stats">
          <div className="stat-item">
            <span className="stat-value">{totalSessions}</span>
            <span className="stat-label">Total Sessions</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {(sessions.reduce((acc, s) => acc + s.pageCount, 0) / sessions.length || 0).toFixed(1)}
            </span>
            <span className="stat-label">Avg. Pages/Session</span>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <select
          value={filters.timeRange}
          onChange={(e) => handleFilterChange('timeRange', e.target.value)}
          className="filter-select"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>

        <select
          value={filters.device || ''}
          onChange={(e) => handleFilterChange('device', e.target.value)}
          className="filter-select"
        >
          <option value="">All Devices</option>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
          <option value="tablet">Tablet</option>
        </select>

        <select
          value={filters.browser || ''}
          onChange={(e) => handleFilterChange('browser', e.target.value)}
          className="filter-select"
        >
          <option value="">All Browsers</option>
          <option value="chrome">Chrome</option>
          <option value="firefox">Firefox</option>
          <option value="safari">Safari</option>
          <option value="edge">Edge</option>
        </select>
      </div>

      <div className="sessions-list">
        {sessions.map((session) => (
          <div key={session.id} className="session-item">
            <div className="session-info">
              <div className="session-time">
                <span className="time">{new Date(session.startTime).toLocaleTimeString()}</span>
                <span className="date">{new Date(session.startTime).toLocaleDateString()}</span>
              </div>
              <div className="session-details">
                <span className="duration">{formatDuration(session.duration)}</span>
                <span className="pages">{session.pageCount} pages</span>
              </div>
            </div>
            <div className="session-meta">
              <span className="device-info">
                <span className="device-icon">{session.device === 'mobile' ? '📱' : '💻'}</span>
                {session.device}
              </span>
              <span className="browser-info">{session.browser}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 