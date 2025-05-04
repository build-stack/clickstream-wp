import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'gray';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'blue' 
}) => {
  const colorStyles = {
    blue: 'bg-blue-50 border-blue-100 text-blue-800',
    green: 'bg-green-50 border-green-100 text-green-800',
    purple: 'bg-purple-50 border-purple-100 text-purple-800',
    gray: 'bg-gray-50 border-gray-100 text-gray-800'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorStyles[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-sm mb-1 opacity-75">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon && (
          <div className="opacity-70">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard; 