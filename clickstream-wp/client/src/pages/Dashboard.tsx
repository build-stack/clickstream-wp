import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import SessionRecordings from '../components/SessionRecordings';

const Dashboard: React.FC = () => {
  return (
    <Layout title="Dashboard">
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard 
            title="Total Visitors" 
            value="1,234" 
            color="blue"
            placeholder={true}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          
          <StatCard 
            title="Page Views" 
            value="5,678" 
            color="green"
            placeholder={true}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
          
          <StatCard 
            title="Avg. Time on Site" 
            value="2:45" 
            color="purple"
            placeholder={true}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
        
        {/* TODO: Add traffic overview and top pages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 hidden">
          <Card title="Traffic Overview" className="lg:col-span-2" placeholder={true}>
            <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded">
              <p className="text-gray-500">Chart visualization will appear here</p>
            </div>
          </Card>
          
          <Card title="Top Pages" placeholder={true}>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Home Page</span>
                <span className="font-medium">456</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">About Us</span>
                <span className="font-medium">289</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Contact</span>
                <span className="font-medium">145</span>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="mt-6">
          <SessionRecordings />
        </div>
        
        <div className="mt-6">
          <Card title="Recent Visitor Activity" placeholder={true}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Page</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Views</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Avg. Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3">Home Page</td>
                    <td className="px-4 py-3">456</td>
                    <td className="px-4 py-3">1:23</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3">About Us</td>
                    <td className="px-4 py-3">289</td>
                    <td className="px-4 py-3">0:45</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Contact</td>
                    <td className="px-4 py-3">145</td>
                    <td className="px-4 py-3">0:32</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 