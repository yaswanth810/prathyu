import axios from 'axios';

const DAILY_API_URL = 'https://api.daily.co/v1';
const DAILY_API_KEY = process.env.DAILY_API_KEY;

export const videoService = {
  /**
   * Create a video room
   * Uses Jitsi Meet (free, open-source, no signup needed)
   * Alternative: Daily.co with API key
   */
  async createRoom(sessionId: string, expiresInMinutes: number = 120): Promise<string> {
    try {
      if (!DAILY_API_KEY) {
        // Use Jitsi Meet - completely free, no API key needed
        // Creates instant video rooms that work immediately
        const roomName = `SkillSwap-${sessionId}-${Date.now()}`;
        return `https://meet.jit.si/${roomName}`;
      }

      // Create private room with Daily.co API (if API key provided)
      const response = await axios.post(
        `${DAILY_API_URL}/rooms`,
        {
          name: `skillswap-${sessionId}`,
          privacy: 'public',
          properties: {
            enable_screenshare: true,
            enable_chat: true,
            enable_knocking: true,
            enable_recording: 'local',
            exp: Math.floor(Date.now() / 1000) + expiresInMinutes * 60,
            max_participants: 2,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${DAILY_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.url;
    } catch (error: any) {
      console.error('Error creating video room:', error.response?.data || error.message);
      
      // Fallback to Jitsi Meet
      const roomName = `SkillSwap-${sessionId}-${Date.now()}`;
      return `https://meet.jit.si/${roomName}`;
    }
  },

  /**
   * Delete a Daily.co room
   */
  async deleteRoom(roomName: string): Promise<boolean> {
    try {
      if (!DAILY_API_KEY) {
        return true; // Can't delete public rooms
      }

      await axios.delete(`${DAILY_API_URL}/rooms/${roomName}`, {
        headers: {
          'Authorization': `Bearer ${DAILY_API_KEY}`,
        },
      });

      console.log(`Room ${roomName} deleted`);
      return true;
    } catch (error: any) {
      console.error('Error deleting Daily.co room:', error.response?.data || error.message);
      return false;
    }
  },

  /**
   * Get room information
   */
  async getRoomInfo(roomName: string) {
    try {
      if (!DAILY_API_KEY) {
        return null;
      }

      const response = await axios.get(`${DAILY_API_URL}/rooms/${roomName}`, {
        headers: {
          'Authorization': `Bearer ${DAILY_API_KEY}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error getting room info:', error.response?.data || error.message);
      return null;
    }
  },

  /**
   * Generate simple room URL without API
   * Uses Daily.co's demo infrastructure (free, no signup needed)
   */
  generatePublicRoomUrl(sessionId: string): string {
    const roomName = `skillswap-${sessionId}-${Date.now()}`;
    // Use Daily.co's public demo page instead
    // This creates a temporary room that works without any setup
    return `https://meet.jit.si/SkillSwap-${sessionId}-${Date.now()}`;
  },
};
