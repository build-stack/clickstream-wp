import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import SessionPlayer from '../components/SessionPlayer';
import { getSessionRecordingDetails } from '../utils/api/sessionRecordings';
import { SessionDetails as SessionDetailsType } from '../types';
import { eventWithTime } from '@rrweb/types';

const SessionDetails: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionDetailsType | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) return;
      
      try {
        setLoading(true);
        
        // Show progress based on estimated time
        const progressInterval = setInterval(() => {
          setLoadingProgress((prev) => {
            // Don't go to 100% as that would indicate completion
            return prev < 90 ? prev + 10 : prev;
          });
        }, 500);
        
        const data = await getSessionRecordingDetails(sessionId);
        
        clearInterval(progressInterval);
        setLoadingProgress(100);
        
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
    return date.toLocaleString() + '.' + date.getMilliseconds().toString().padStart(3, '0');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-gray-600">
            {loadingProgress < 100 
              ? `Loading session data (${loadingProgress}%)...` 
              : 'Processing events...'}
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mt-4"></div>
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
          <h2 className="text-lg font-medium">&nbsp;</h2>
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
              <h3 className="text-sm font-medium text-gray-500">Session End</h3>
              <p className="mt-1">{formatDate(sessionData.timestamp)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Session Start</h3>
              <p className="mt-1">{formatDate(sessionData.firstEventAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Duration</h3>
              <p className="mt-1">
                {((sessionData.timestamp - sessionData.firstEventAt) / 1000).toFixed(1)} seconds
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
              <p className="mt-1">{sessionData.events.length}</p>
            </div>
          </div>
        </Card>
        
        <SessionPlayer events={sessionData.events as unknown as eventWithTime[]} />
        
        {/* <Card title="Event Summary">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(eventCounts).map(([type, count]) => (
              <div key={type} className="bg-gray-50 p-3 rounded border border-gray-100">
                <h3 className="text-sm font-medium text-gray-600">{type}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
              </div>
            ))}
          </div>
        </Card>
        
        <Card title="Session Timeline">
          {sessionData.events.length > 0 ? (
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
                  {sessionData.events.map((event: SessionEvent, index: number) => (
                    <tr key={event.id || index} className="border-b border-gray-100">
                      <td className="px-4 py-3">{formatDate(event.timestamp)}</td>
                      <td className="px-4 py-3">
                        {(() => {
                          const formatEventType = (type: string) => {
                            const EventType = {
                              "0": "DomContentLoaded",
                              "1": "Load",
                              "2": "FullSnapshot",
                              "3": "IncrementalSnapshot",
                              "4": "Meta",
                              "5": "Custom",
                              "6": "Plugin"
                            };
                            return EventType[type as keyof typeof EventType] || type;
                          };
                          return formatEventType(event.type);
                        })()}
                      </td>
                      <td className="px-4 py-3">
                        {event.data ? (
                          <div>
                            <button 
                              className="text-blue-600 hover:text-blue-800 text-sm mb-1 focus:outline-none"
                              onClick={() => {
                                const elem = document.getElementById(`event-data-${event.id || index}`);
                                if (elem) {
                                  elem.classList.toggle('hidden');
                                }
                              }}
                            >
                              {document.getElementById(`event-data-${event.id || index}`)?.classList.contains('hidden') 
                                ? 'Show details' 
                                : 'Hide details'}
                            </button>
                            <pre 
                              id={`event-data-${event.id || index}`}
                              className="text-xs bg-gray-50 p-2 rounded overflow-x-auto hidden"
                            >
                              {JSON.stringify(event.data, null, 2)}
                            </pre>
                          </div>
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
        </Card> */}
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