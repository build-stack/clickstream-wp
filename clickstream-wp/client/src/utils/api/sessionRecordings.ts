import { SessionRecording } from '../../types';
import { getSetupData } from './../api';

/**
 * Fetch recent session recordings
 * @param limit Number of recordings to fetch
 * @returns Promise with session recordings data
 */
export const getSessionRecordings = async (limit = 10): Promise<{ data: SessionRecording[] }> => {
  try {
    // Get the remote URL from setup data
    const setupData = await getSetupData();
    const { remote_url, environment_id } = setupData;
    
    if (!remote_url) {
      throw new Error('Remote URL is not configured. Please configure it in the setup page.');
    }
    
    // Construct endpoint URL
    const endpoint = `${remote_url}sessions?limit=${limit}&environmentId=${environment_id}`;
    
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        // 'X-Environment-Id': setupData.environment_id || ''
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
 * Get details for a specific session recording
 * @param id Session recording ID
 * @returns Promise with session recording details
 */
export const getSessionRecordingDetails = async (id: string): Promise<any> => {
  try {
    // Get the remote URL from setup data
    const setupData = await getSetupData();
    const { remote_url } = setupData;
    
    if (!remote_url) {
      throw new Error('Remote URL is not configured. Please configure it in the setup page.');
    }
    
    // Construct endpoint URL
    const endpoint = `${remote_url}events/?sessionId=${id}`;
    
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        // 'X-Environment-Id': setupData.environment_id || ''
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recording details: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.error(`Error fetching session recording details for ID ${id}:`, error);
    throw error;
  }
}; 