interface HeaderProps {
  currentView: string;
  isConnected: boolean;
  onNavigate: (view: string) => void;
}

export default function Header({ currentView, isConnected, onNavigate }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <img src="/wp-content/plugins/clickstream-wp/assets/admin/img/logo.svg" alt="Clickstream" className="w-8 h-8" />
        <h1 className="text-xl font-semibold text-wp-admin-text">Clickstream</h1>
      </div>

      <nav className="flex-1 mx-8">
        <ul className="flex gap-4 justify-center">
          <li>
            <button
              onClick={() => onNavigate('insights')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'insights'
                  ? 'bg-wp-admin-primary text-white hover:bg-wp-admin-hover'
                  : 'hover:bg-gray-100'
              }`}
            >
              Insights
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('sessions')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'sessions'
                  ? 'bg-wp-admin-primary text-white hover:bg-wp-admin-hover'
                  : 'hover:bg-gray-100'
              }`}
            >
              Sessions
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('settings')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'settings'
                  ? 'bg-wp-admin-primary text-white hover:bg-wp-admin-hover'
                  : 'hover:bg-gray-100'
              }`}
            >
              Settings
            </button>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
    </header>
  );
} 