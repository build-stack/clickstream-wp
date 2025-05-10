import React, { ReactNode } from 'react';
import Toolbar from './Toolbar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="flex flex-col">
      <Toolbar />
      <main className="flex-1">
        {title && (
          <h1 className="mx-6 mt-4 text-2xl font-semibold text-gray-800 mb-6">{title}</h1>
        )}
        <div className="rounded-lg shadow-xs">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 