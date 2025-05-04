// Session Recording Interface
// "_id": "vz7o8f5qkrma9jx5ud",
//       "sessionId": "vz7o8f5qkrma9jx5ud",
//       "environmentId": "52206b20-c8fb-4999-a2b2-fb892afb3aee",
//       "timestamp": 1746357088987,
//       "firstEventAt": 1746357088987
export interface SessionRecording {
  id: string;
  sessionId: string;
  environmentId: string;
  timestamp: number;
  firstEventAt: number;
} 