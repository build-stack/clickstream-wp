import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { getSessionRecordingDetails } from '../utils/api/sessionRecordings';

const SessionDetails: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) return;
      
      try {
        setLoading(true);
        const data = await getSessionRecordingDetails(sessionId);
        setSessionData(data);
        setError(null);
      } catch (err: any) {
        setError(`Failed to load session details: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  // Format timestamp to readable date
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-800">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      );
    }
    
    if (!sessionData) {
      return (
        <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50 text-yellow-800">
          <p className="font-medium">Session not found</p>
          <p className="text-sm mt-1">The requested session could not be found or has expired.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Session Details</h2>
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Sessions
          </Link>
        </div>
        
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Session ID</h3>
              <p className="mt-1">{sessionData.sessionId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Environment ID</h3>
              <p className="mt-1">{sessionData.environmentId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created At</h3>
              <p className="mt-1">{sessionData.timestamp ? formatDate(sessionData.timestamp) : 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">First Event At</h3>
              <p className="mt-1">{sessionData.firstEventAt ? formatDate(sessionData.firstEventAt) : 'N/A'}</p>
            </div>
          </div>
        </Card>
        
        <Card title="Session Timeline">
          {sessionData.events && sessionData.events.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Time</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Event Type</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionData.events.map((event: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="px-4 py-3">{formatDate(event.timestamp)}</td>
                      <td className="px-4 py-3">{event.type || 'Unknown'}</td>
                      <td className="px-4 py-3">
                        {event.data ? (
                          <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                            {JSON.stringify(event.data, null, 2)}
                          </pre>
                        ) : (
                          'No details'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No events recorded for this session</p>
          )}
        </Card>
      </div>
    );
  };

  return (
    <Layout title={`Session: ${sessionId?.substring(0, 8)}...`}>
      <div className="p-4 md:p-6">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default SessionDetails; 