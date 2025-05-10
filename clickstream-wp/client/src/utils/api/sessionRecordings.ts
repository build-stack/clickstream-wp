import { SessionRecording, SessionEventsResponse, SessionDetails, SessionEvent } from '../../types';
import { getSetupData } from './../api';

// Simple cache to prevent duplicate API calls
const sessionCache: Record<string, SessionDetails> = {};

/**
 * Fetch recent session recordings
 * @param limit Number of recordings to fetch
 * @returns Promise with session recordings data
 */
export const getSessionRecordings = async (limit = 10): Promise<{ data: SessionRecording[] }> => {
  try {
    // Get the remote URL from setup data
    const setupData = await getSetupData();
    const { remote_url } = setupData;
    
    if (!remote_url) {
      throw new Error('Remote URL is not configured. Please configure it in the setup page.');
    }
    
    // Construct endpoint URL
    const endpoint = `${remote_url}sessions?limit=${limit}&environmentId=${setupData.environment_id}`;
    
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch session recordings: ${response.statusText}`);
    }

    const responseData = await response.json();
    // Return the data from the API directly without wrapping it again
    return responseData;
  } catch (error) {
    console.error('Error fetching session recordings:', error);
    throw error;
  }
};

/**
 * Get all events for a specific session recording, handling pagination
 * @param sessionId Session recording ID
 * @returns Promise with session recording details and all events
 */
export const getSessionRecordingDetails = async (sessionId: string): Promise<SessionDetails> => {
  // Check if we have cached data for this session
  if (sessionCache[sessionId]) {
    console.log('Returning cached session data for', sessionId);
    return sessionCache[sessionId];
  }
  
  console.log('Fetching session data for', sessionId);
  
  try {
    // Get the remote URL from setup data
    const setupData = await getSetupData();
    const { remote_url } = setupData;
    
    if (!remote_url) {
      throw new Error('Remote URL is not configured. Please configure it in the setup page.');
    }
    
    let allEvents: SessionEvent[] = [];
    let hasMore = true;
    let offset = 0;
    const limit = 100; // Default limit per page
    let sessionIdFromResponse = '';
    
    // Fetch all pages of events
    while (hasMore) {
      // Construct endpoint URL for events with pagination parameters
      const eventsEndpoint = `${remote_url}events/?sessionId=${sessionId}&offset=${offset}&limit=${limit}`;
      
      const response = await fetch(eventsEndpoint, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch recording details: ${response.statusText}`);
      }

      const responseData = await response.json() as SessionEventsResponse;
      
      // Store sessionId from the first response
      if (!sessionIdFromResponse && responseData.sessionId) {
        sessionIdFromResponse = responseData.sessionId;
      }
      
      // Filter out the specified fields from each event
      const filteredEvents = responseData.data.map(event => {
        // Use destructuring to exclude the unwanted fields
        const { _id, __v, environmentId, sessionId, ...filteredEvent } = event as any;
        return filteredEvent as SessionEvent;
      });
      
      // Add this page's events to our collection
      allEvents = [...allEvents, ...filteredEvents];
      
      // Check if there are more pages to fetch
      hasMore = responseData.pagination.hasMore;
      
      // Update offset for the next page
      offset += limit;
    }
    
    // Sort events by timestamp (oldest first)
    // allEvents.sort((a, b) => a.timestamp - b.timestamp);

    console.log(allEvents.length);
    
    // Create the SessionDetails object from the collected events
    const sessionDetails: SessionDetails = {
      sessionId: sessionIdFromResponse || sessionId,
      environmentId: setupData.environment_id,
      timestamp: allEvents.length > 0 ? allEvents[allEvents.length - 1]?.timestamp : Date.now(), // Last event time
      firstEventAt: allEvents.length > 0 ? allEvents[0]?.timestamp : Date.now(), // First event time
      events: allEvents
    };
    
    // Cache the result
    sessionCache[sessionId] = sessionDetails;
    
    return sessionDetails;
  } catch (error) {
    console.error(`Error fetching session recording details for ID ${sessionId}:`, error);
    throw error;
  }
}; 