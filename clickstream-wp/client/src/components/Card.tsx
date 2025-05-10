import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  placeholder?: boolean;
}

const Card: React.FC<CardProps> = ({ children, title, className = '', placeholder = false }) => {
  return (
    <div className={`bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 ${placeholder ? 'opacity-50' : ''} ${className}`}>
      {title && (
        <h2 className="text-lg font-medium text-gray-800 mb-4">{title}</h2>
      )}
      {children}
      {placeholder && (
        <div className="mt-4 text-xs text-gray-500 italic">Not connected to data</div>
      )}
    </div>
  );
};

export default Card; 