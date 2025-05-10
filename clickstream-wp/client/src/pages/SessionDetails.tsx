import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
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


  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 rounded-full transition-all duration-300" 
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
      <div className="w-full max-w-full">
        <SessionPlayer events={sessionData.events as unknown as eventWithTime[]} />
      </div>
    );
  };

  return (
    <Layout>
      {/* <div className="p-4 md:p-6"> */}
        {renderContent()}
      {/* </div> */}
    </Layout>
  );
};

export default SessionDetails; 