import { ElevenLabsClient } from 'elevenlabs';

// Initialize ElevenLabs client
const elevenLabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

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
    const voices = await elevenLabs.voices.getAll();
    return voices.voices.map(voice => ({
      voice_id: voice.voice_id,
      name: voice.name,
      category: voice.category || 'standard',
      description: voice.description
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
    // Generate audio using ElevenLabs
    const audioBuffer = await elevenLabs.generate({
      voice: opts.voice || 'Rachel',
      text: opts.text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: opts.stability || 0.7,
        similarity_boost: opts.similarity_boost || 0.8
      }
    });

    // Create a unique request ID
    const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    
    // Store the audio buffer temporarily (in a real app, you'd upload to cloud storage)
    // For now, we'll create a data URL
    const audioBase64 = Buffer.from(audioBuffer as any).toString('base64');
    const audioDataUrl = `data:audio/mpeg;base64,${audioBase64}`;
    
    // Store in a simple in-memory cache (in production, use proper storage)
    if (typeof global !== 'undefined') {
      if (!global.audioCache) global.audioCache = new Map();
      global.audioCache.set(requestId, audioDataUrl);
    }
    
    return requestId;
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
