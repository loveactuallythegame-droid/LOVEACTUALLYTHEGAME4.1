export const DrMarcieVoiceService = {
  speak: (text: string, context?: string) => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      } else {
        // Server-side or no Web Speech API available — fallback to console
        // Keeping behavior minimal for build-time correctness
        // In production, replace with a robust TTS integration
        // eslint-disable-next-line no-console
        console.log('[DrMarcieVoiceService] speak', { context, text });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('DrMarcieVoiceService.speak error:', err);
    }
  }
};
