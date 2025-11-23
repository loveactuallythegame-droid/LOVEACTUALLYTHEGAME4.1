export const DrMarcieVoiceService = {
  speak: (message: string, context?: string) => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        // Optionally set voice/rate/pitch based on context
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } else {
        // Server-side or no TTS available — log for now
        // eslint-disable-next-line no-console
        console.log(`[DrMarcieVoiceService] (${context || 'default'}):`, message);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('DrMarcieVoiceService.speak failed', e);
    }
  }
};
