import { ttsFalSubmit, ttsFalPollStatus, ttsFalFetchAudioUrl, listVoicesFal } from './murf-api';

export type DrMarcieResponse = {
  text: string;
  audioUrl?: string | null;
  contextType?: string;
};

export type DrMarciePersonality = 1 | 2 | 3 | number;

export class DrMarcieAI {
  personalityLevel: number;
  originStory: string;

  constructor(personalityLevel = 1, originStory = '') {
    this.personalityLevel = personalityLevel;
    this.originStory = originStory;
  }

  async generateResponse(
    prompt: string,
    mode: string,
    context: Record<string, any> = {}
  ): Promise<DrMarcieResponse> {
    // For now, return a simple response without voice
    // The main implementation is in the root dr-marcie-ai.ts file
    const responseText = `Dr. Marcie says: ${prompt}`;
    return {
      text: responseText,
      audioUrl: null,
    };
  }

  updatePersonality(level: number) {
    this.personalityLevel = level;
  }

  updateCoupleBackstory(story: string) {
    this.originStory = story;
  }
}
