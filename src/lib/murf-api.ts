/**
 * Murf AI API Service - Voice synthesis for Dr. Marcie
 * Replaces ElevenLabs with Murf AI for text-to-speech
 */

export interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  gender?: string;
  age?: string;
  accent?: string;
}

export interface TTSOptions {
  text: string;
  voice?: string;
  speed?: number;
  pitch?: number;
  format?: 'mp3' | 'wav' | 'ogg';
  sample_rate?: number;
}

interface MurfAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface MurfVoice {
  id: string;
  name: string;
  gender: string;
  language: string;
  language_code: string;
  style: string;
  preview_url?: string;
}

interface MurfTTSCreateResponse {
  id: string;
  status: string;
  audio_file?: string;
  error?: string;
}

// Murf AI API configuration
const MURF_API_BASE = 'https://api.murf.ai';
const MURF_CLIENT_ID = process.env.MURF_CLIENT_ID || 'your-client-id';
const MURF_CLIENT_SECRET = process.env.MURF_CLIENT_SECRET || 'your-client-secret';

class MurfAIService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private async authenticate(): Promise<string> {
    try {
      const response = await fetch(`${MURF_API_BASE}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: MURF_CLIENT_ID,
          client_secret: MURF_CLIENT_SECRET,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const data: MurfAuthResponse = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute early
      
      return this.accessToken;
    } catch (error) {
      console.error('Murf authentication error:', error);
      throw error;
    }
  }

  private async getAccessToken(): Promise<string> {
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      return await this.authenticate();
    }
    return this.accessToken;
  }

  async listVoices(): Promise<Voice[]> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${MURF_API_BASE}/voices`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`);
      }

      const data = await response.json();
      
      return data.voices.map((voice: MurfVoice) => ({
        voice_id: voice.id,
        name: voice.name,
        category: voice.style || 'standard',
        gender: voice.gender,
        description: `${voice.name} - ${voice.language} (${voice.gender})`,
      }));
    } catch (error) {
      console.error('Murf list voices error:', error);
      
      // Fallback to default voices
      return [
        {
          voice_id: 'en-US-cooper',
          name: 'Cooper',
          category: 'narration',
          gender: 'male',
          description: 'Cooper - Professional male voice for narration',
        },
        {
          voice_id: 'en-US-emma',
          name: 'Emma',
          category: 'conversational',
          gender: 'female',
          description: 'Emma - Warm female voice for conversations',
        },
        {
          voice_id: 'en-US-miles',
          name: 'Miles',
          category: 'promo',
          gender: 'male',
          description: 'Miles - Energetic male voice for promotions',
        },
        {
          voice_id: 'en-US-olivia',
          name: 'Olivia',
          category: 'meditation',
          gender: 'female',
          description: 'Olivia - Calm female voice for meditation and therapy',
        },
      ];
    }
  }

  async createTTS(opts: TTSOptions): Promise<string> {
    try {
      const token = await this.getAccessToken();
      
      // Select appropriate voice for Dr. Marcie (therapist persona)
      const voiceId = opts.voice || 'en-US-olivia'; // Default to therapeutic voice
      
      const response = await fetch(`${MURF_API_BASE}/speech/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voice_id: voiceId,
          text: opts.text,
          speed: opts.speed || 1.0,
          pitch: opts.pitch || 1.0,
          format: opts.format || 'mp3',
          sample_rate: opts.sample_rate || 24000,
          quality: 'high',
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS generation failed: ${response.status}`);
      }

      const data: MurfTTSCreateResponse = await response.json();
      
      if (data.error) {
        throw new Error(`TTS error: ${data.error}`);
      }

      return data.id;
    } catch (error) {
      console.error('Murf TTS creation error:', error);
      throw error;
    }
  }

  async pollTTSStatus(requestId: string): Promise<{ status: string; audioUrl?: string }> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${MURF_API_BASE}/speech/${requestId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        status: data.status,
        audioUrl: data.audio_file || undefined,
      };
    } catch (error) {
      console.error('Murf TTS status check error:', error);
      return { status: 'failed' };
    }
  }

  async generateSpeech(text: string, voiceId: string = 'en-US-olivia'): Promise<ArrayBuffer> {
    try {
      const requestId = await this.createTTS({
        text,
        voice: voiceId,
        format: 'mp3',
      });

      // Poll for completion
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds max
      
      while (attempts < maxAttempts) {
        const status = await this.pollTTSStatus(requestId);
        
        if (status.status === 'completed' && status.audioUrl) {
          // Fetch the audio file
          const audioResponse = await fetch(status.audioUrl);
          if (!audioResponse.ok) {
            throw new Error(`Failed to fetch audio: ${audioResponse.status}`);
          }
          return await audioResponse.arrayBuffer();
        }
        
        if (status.status === 'failed') {
          throw new Error('TTS generation failed');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        attempts++;
      }
      
      throw new Error('TTS generation timed out');
    } catch (error) {
      console.error('Murf speech generation error:', error);
      throw error;
    }
  }
}

// Create singleton instance
const murfService = new MurfAIService();

// Export functions for compatibility with existing code
export async function listVoicesFal(): Promise<Voice[]> {
  try {
    return await murfService.listVoices();
  } catch (error) {
    console.error('Failed to list Murf voices, using fallback:', error);
    return [
      { voice_id: 'en-US-olivia', name: 'Olivia', category: 'therapeutic', gender: 'female' },
      { voice_id: 'en-US-cooper', name: 'Cooper', category: 'professional', gender: 'male' },
    ];
  }
}

export async function ttsFalSubmit(opts: TTSOptions): Promise<string> {
  try {
    return await murfService.createTTS(opts);
  } catch (error) {
    console.error('Murf TTS submit error:', error);
    // Return a mock request ID for fallback
    return `murf_req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}

export async function ttsFalPollStatus(requestId: string): Promise<{ status: string }> {
  try {
    const result = await murfService.pollTTSStatus(requestId);
    return { status: result.status };
  } catch (error) {
    console.error('Murf TTS poll error:', error);
    return { status: 'failed' };
  }
}

export async function ttsFalFetchAudioUrl(requestId: string): Promise<string | null> {
  try {
    const result = await murfService.pollTTSStatus(requestId);
    return result.audioUrl || null;
  } catch (error) {
    console.error('Murf audio fetch error:', error);
    return null;
  }
}

// Alternative implementation for direct usage
export async function generateSpeech(text: string, voiceId: string = 'en-US-olivia'): Promise<ArrayBuffer> {
  return await murfService.generateSpeech(text, voiceId);
}

export default murfService;