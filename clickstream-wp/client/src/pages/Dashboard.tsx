import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4">Clickstream Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Total Visitors</h3>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-900 mb-2">Page Views</h3>
          <p className="text-3xl font-bold">5,678</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-medium text-purple-900 mb-2">Avg. Time on Site</h3>
          <p className="text-3xl font-bold">2:45</p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4">Traffic Overview</h2>
        <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded">
          <p className="text-gray-500">Chart visualization will appear here</p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Recent Visitor Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Page</th>
                <th className="px-4 py-2 text-left">Views</th>
                <th className="px-4 py-2 text-left">Avg. Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-2">Home Page</td>
                <td className="px-4 py-2">456</td>
                <td className="px-4 py-2">1:23</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-2">About Us</td>
                <td className="px-4 py-2">289</td>
                <td className="px-4 py-2">0:45</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Contact</td>
                <td className="px-4 py-2">145</td>
                <td className="px-4 py-2">0:32</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 