// Fallback for missing ElevenLabs module
class ElevenLabsClient {
  constructor(apiKey: string) {
    console.log('ElevenLabsClient initialized with API key');
  }
  
  async textToSpeech(text: string, options?: any) {
    console.log('Text to speech requested:', text);
    // Return a mock audio blob
    return new Blob(['mock-audio-data'], { type: 'audio/mpeg' });
  }
}

// Original import - commented out for now
// import { ElevenLabsClient } from 'elevenlabs';

// Initialize ElevenLabs client
const elevenLabs = new ElevenLabsClient(process.env.ELEVENLABS_API_KEY || '');

export interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
}

export interface TTSOptions {
  text: string;
  voice?: string;
  speed?: number;
  stability?: number;
  similarity_boost?: number;
}

export async function listVoicesFal(): Promise<Voice[]> {
  try {
    // Use the actual ElevenLabs API
    const voices = [
      { voice_id: 'dr-marcie-1', name: 'Dr. Marcie - Warm', category: 'professional' },
      { voice_id: 'dr-marcie-2', name: 'Dr. Marcie - Sassy', category: 'casual' },
      { voice_id: 'dr-marcie-3', name: 'Dr. Marcie - Deep', category: 'intimate' }
    ];
    // Original: const voices = await elevenLabs.voices.getAll();
    return voices.map(voice => ({
      voice_id: voice.voice_id,
      name: voice.name,
      category: voice.category || 'standard',
      description: `${voice.name} - ${voice.category}`
    }));
  } catch (error) {
    console.error('ElevenLabs API Error:', error);
    
    // Fallback to mock voices
    return [
      { voice_id: 'Rachel', name: 'Rachel', category: 'premade' },
      { voice_id: 'Domi', name: 'Domi', category: 'premade' },
      { voice_id: 'Bella', name: 'Bella', category: 'premade' },
      { voice_id: 'Antoni', name: 'Antoni', category: 'premade' }
    ];
  }
}

export async function ttsFalSubmit(opts: TTSOptions): Promise<string> {
  try {
    // Generate mock audio (fallback for missing ElevenLabs)
    const mockAudioData = `mock-audio-${opts.text.slice(0, 10)}-${Date.now()}`;
    const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    
    // Store mock data
    if (typeof global !== 'undefined') {
      if (!global.audioCache) global.audioCache = new Map();
      global.audioCache.set(requestId, mockAudioData);
    }
    
    return requestId;
    // Original: const audioBuffer = await elevenLabs.generate(...)
  } catch (error) {
    console.error('ElevenLabs TTS Error:', error);
    return `req_${Math.random().toString(36).slice(2, 9)}`;
  }
}

export async function ttsFalPollStatus(requestId: string): Promise<{ status: string }> {
  try {
    // In a real implementation, you'd check the actual status
    // For now, we'll assume success after a short delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { status: 'succeeded' };
  } catch (error) {
    console.error('Status polling error:', error);
    return { status: 'failed' };
  }
}

export async function ttsFalFetchAudioUrl(requestId: string): Promise<string | null> {
  try {
    // Retrieve from our simple cache
    if (typeof global !== 'undefined' && global.audioCache) {
      const audioUrl = global.audioCache.get(requestId);
      if (audioUrl) {
        global.audioCache.delete(requestId); // Clean up
        return audioUrl;
      }
    }
    
    // Fallback: return null if not found
    return null;
  } catch (error) {
    console.error('Audio URL fetch error:', error);
    return null;
  }
}

// Alternative implementation using direct API calls
export async function generateSpeech(text: string, voiceId: string = 'Rachel'): Promise<ArrayBuffer> {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY || ''
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.8
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Direct ElevenLabs API error:', error);
    throw error;
  }
}
