/**
 * Speech synthesis utility for Super Lectores mascot and voice motivation
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Pre-load available voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function getBestSpanishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  
  // Try finding high quality friendly Spanish voices
  const preferredLocales = ['es-ES', 'es-MX', 'es-US', 'es-419', 'es-AR', 'es-CO', 'es'];
  
  for (const locale of preferredLocales) {
    const match = voices.find(
      (v) => v.lang.toLowerCase().startsWith(locale.toLowerCase()) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Paulina') || v.name.includes('Monica'))
    );
    if (match) return match;
  }

  // Fallback to any Spanish voice
  const anySpanish = voices.find((v) => v.lang.toLowerCase().startsWith('es'));
  if (anySpanish) return anySpanish;

  return voices[0] || null;
}

export function speakText(
  text: string,
  options?: {
    pitch?: number;
    rate?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  }
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser environment.');
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const spanishVoice = getBestSpanishVoice();
    if (spanishVoice) {
      utterance.voice = spanishVoice;
      utterance.lang = spanishVoice.lang;
    } else {
      utterance.lang = 'es-ES';
    }

    // Friendly, warm tone for children's mascot
    utterance.pitch = options?.pitch ?? 1.18; // slightly higher and friendlier for mascot
    utterance.rate = options?.rate ?? 0.95; // clear and welcoming
    utterance.volume = options?.volume ?? 1;

    utterance.onstart = () => {
      options?.onStart?.();
    };

    utterance.onend = () => {
      currentUtterance = null;
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance error:', e);
      currentUtterance = null;
      options?.onError?.(e);
      options?.onEnd?.();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Failed to invoke speech synthesis:', err);
    options?.onEnd?.();
    return false;
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isCurrentlySpeaking(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  return window.speechSynthesis.speaking;
}
