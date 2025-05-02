import logo from '../assets/img/logo.svg';

// Declare the global WordPress admin object
declare global {
  interface Window {
    clickstreamWPAdmin?: {
      apiNonce: string;
      apiUrl: string;
      currentPage: string;
      pluginUrl: string;
    };
  }
}

interface HeaderProps {
  isConnected: boolean;
}

export default function Header({ isConnected }: HeaderProps) {
  // Use WordPress plugin path in production, local path in development
  const logoPath = import.meta.env.PROD && window.clickstreamWPAdmin
    ? `${window.clickstreamWPAdmin.pluginUrl}assets/img/logo.svg`
    : logo;

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <img src={logoPath} alt="Clickstream" className="w-8 h-8" />
        <h1 className="text-xl font-semibold text-wp-admin-text">Clickstream Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
    </header>
  );
} 