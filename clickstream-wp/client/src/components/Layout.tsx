import React, { ReactNode } from 'react';
import Toolbar from './Toolbar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toolbar />
      <main className="flex-1 p-4 md:p-6">
        {title && (
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h1>
        )}
        <div className="bg-white rounded-lg shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 