import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}>
      {title && (
        <h2 className="text-lg font-medium text-gray-800 mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
};

export default Card; 