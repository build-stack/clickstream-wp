interface HeaderProps {
  isConnected: boolean;
  trackingEnabled: boolean;
  onToggleTracking: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Header({ isConnected, trackingEnabled, onToggleTracking, currentView, onNavigate }: HeaderProps) {
  return (
    <div className="header">
      <div className="header-main">
        <div className="header-logo">
          <h1>
            <span className="logo-icon">📊</span>
            Clickstream WP
          </h1>
        </div>
        
        <div className="header-status">
          <div className="status-indicator">
            <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
            <span className="status-text">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className="tracking-toggle">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={trackingEnabled}
                onChange={onToggleTracking}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">
              {trackingEnabled ? 'Tracking Active' : 'Tracking Paused'}
            </span>
          </div>
        </div>
      </div>
      
      <nav className="header-nav">
        <ul>
          <li>
            <button
              className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => onNavigate('dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentView === 'sessions' ? 'active' : ''}`}
              onClick={() => onNavigate('sessions')}
            >
              Sessions
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentView === 'insights' ? 'active' : ''}`}
              onClick={() => onNavigate('insights')}
            >
              Insights
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentView === 'settings' ? 'active' : ''}`}
              onClick={() => onNavigate('settings')}
            >
              Settings
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
} 