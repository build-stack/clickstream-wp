import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import { SessionRecording } from '../types';
import { getSessionRecordings } from '../utils/api/sessionRecordings';

const SessionRecordings: React.FC = () => {
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState<SessionRecording[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        setLoading(true);
        
        // For production - use the real API
        try {
          const response = await getSessionRecordings(5);
          console.log('API response:', response);
          
          // Handle the response data properly based on structure
          if (response && response.data && Array.isArray(response.data)) {
            setRecordings(response.data);
          } else {
            console.error('Unexpected API response format:', response);
            setError('Invalid data format received from the API');
          }
        } catch (err: any) {
          if (err.message && err.message.includes('Remote URL is not configured')) {
            setIsConfigured(false);
          } else {
            setError('Failed to load session recordings');
            console.error(err);
          }
        }
      } catch (err) {
        setError('Failed to load session recordings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecordings();
  }, []);

  // Format timestamp to readable date
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleWatchRecording = (sessionId: string) => {
    navigate(`/session/${sessionId}`);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!isConfigured) {
      return (
        <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50 text-yellow-800">
          <p className="font-medium">Sessions tracking not configured</p>
          <p className="text-sm mt-1">
            To start recording sessions, please configure the remote URL and enable tracking in the{' '}
            <a href="#/setup" className="underline hover:text-yellow-900">Setup page</a>.
          </p>
        </div>
      );
    }
    
    if (error) {
      return <div className="text-red-500 p-3">{error}</div>;
    }
    
    if (recordings.length === 0) {
      return <div className="text-gray-500 p-3">No session recordings available yet</div>;
    }
    
    return recordings.map((recording) => (
      <div key={recording.sessionId} className="p-3 border border-gray-100 rounded-md hover:bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Session ID: {recording.sessionId.substring(0, 8)}...</p>
              <p className="text-xs text-gray-500">
                Recorded: {formatDate(recording.timestamp)}
              </p>
            </div>
          </div>
          <div>
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              onClick={() => handleWatchRecording(recording.sessionId)}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch
            </button>
          </div>
        </div>
        <div className="flex text-xs text-gray-500 space-x-4">
          <span>Environment: {recording.environmentId.substring(0, 8)}...</span>
          <span>Date: {formatDate(recording.timestamp)}</span>
        </div>
      </div>
    ));
  };

  return (
    <Card title="Recent Session Recordings">
      <div className="space-y-3">
        {renderContent()}
      </div>
    </Card>
  );
};

export default SessionRecordings; 