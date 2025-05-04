import { eventWithTime } from '@rrweb/types';
import React, { useEffect } from 'react';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';

// Global player reference to ensure only one exists
let globalPlayer: any = null;

// Global player container ID
const PLAYER_CONTAINER_ID = 'rrweb-player-global-container';

interface SessionPlayerProps {
  events: eventWithTime[];
  width?: string | number;
  height?: string | number;
}

const SessionPlayer: React.FC<SessionPlayerProps> = ({ 
  events, 
  width = '100%', 
}) => {
  useEffect(() => {
    // First, destroy any existing player
    if (globalPlayer) {
      try {
        globalPlayer.destroy();
      } catch (e) {
        console.error('Error destroying previous player:', e);
      }
      globalPlayer = null;
    }

    // Make sure we have a container
    let container = document.getElementById(PLAYER_CONTAINER_ID);
    
    // If container doesn't exist, create and clean it
    if (!container) {
      container = document.createElement('div');
      container.id = PLAYER_CONTAINER_ID;
      document.currentScript?.parentNode?.appendChild(container);
    } else {
      // Clear the container
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }

    // Only create player if we have events
    if (events.length > 0 && container) {
      try {
        console.log(`Initializing player with ${events.length} events`);
        
        globalPlayer = new rrwebPlayer({
          target: container,
          props: {
            events: events,
            width: typeof width === 'number' ? width : undefined,
            showController: true,
            autoPlay: false,
          }
        });
      } catch (error) {
        console.error('Error initializing rrweb player:', error);
      }
    }

    // Cleanup function
    return () => {
      // We don't destroy on component unmount - we'll let the next mount handle it
      // This prevents issues with React's StrictMode double-mounting
    };
  }, [events, width]);

  if (!events.length) {
    return <div>No events available for replay</div>;
  }
  
  return (
    <div 
      id={PLAYER_CONTAINER_ID}
      style={{ 
        width
      }}
    />
  );
};

export default SessionPlayer; 