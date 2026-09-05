import React, { useState, useEffect, useCallback, useRef } from 'react';
import { speakText, stopSpeaking } from '../utils/speech';
import { askMascotQuestion, isCheatAttempt, MascotAnswerResult } from '../utils/mascotAI';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCcw, 
  BookOpen, 
  X, 
  HeartHandshake,
  MessageCircle,
  Mic,
  MicOff,
  Send,
  HelpCircle,
  ShieldAlert,
  Loader2,
  Lightbulb
} from 'lucide-react';

export interface MascotMessage {
  id: string;
  type: 'welcome' | 'mistake' | 'encouragement' | 'success' | 'tip';
  title: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
  autoSpeak?: boolean;
}

interface MascotCompanionProps {
  childName: string;
  incomingMessage?: MascotMessage | null;
  onDismissIncoming?: () => void;
  onStartReading?: (storyId?: string) => void;
  activeStoryTitle?: string;
  activeStoryText?: string;
  storyQuestions?: string[];
}

export const MascotCompanion: React.FC<MascotCompanionProps> = ({
  childName,
  incomingMessage,
  onDismissIncoming,
  onStartReading,
  activeStoryTitle,
  activeStoryText,
  storyQuestions,
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<MascotMessage | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [hasShownWelcome, setHasShownWelcome] = useState<boolean>(false);
  const [speechBlocked, setSpeechBlocked] = useState<boolean>(false);
  const audioUnlockedRef = useRef<boolean>(false);

  // Q&A Chat State
  const [isQAMode, setIsQAMode] = useState<boolean>(false);
  const [questionInput, setQuestionInput] = useState<string>('');
  const [isAnswering, setIsAnswering] = useState<boolean>(false);
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(true);
  const [lastQAResult, setLastQAResult] = useState<MascotAnswerResult | null>(null);
  const recognitionRef = useRef<any>(null);

  // Suggested prompt chips for kids
  const quickQuestions = [
    { label: '🔍 Pista del cuento', text: '¿Me das una pista para responder las preguntas del cuento?' },
    { label: '🌸 ¿Qué es néctar?', text: '¿Qué significa la palabra néctar?' },
    { label: '💎 ¿Cómo gano gemas?', text: '¿Cómo puedo ganar más gemas?' },
    { label: '🦉 ¿Quién eres?', text: '¿Quién eres tú, Leo, y por qué tienes anteojos?' },
    { label: '⭐ ¿Por qué leer?', text: '¿Por qué es bueno leer todos los días?' }
  ];

  // Helper to trigger speech with mouth animation
  const triggerSpeech = useCallback((text: string) => {
    if (isMuted) return;
    setIsSpeaking(true);
    const success = speakText(text, {
      pitch: 1.2,
      rate: 0.95,
      onStart: () => {
        setIsSpeaking(true);
        setSpeechBlocked(false);
      },
      onEnd: () => setIsSpeaking(false),
      onError: () => {
        setIsSpeaking(false);
        setSpeechBlocked(true);
      }
    });

    if (!success) {
      setSpeechBlocked(true);
    }
  }, [isMuted]);

  // Initial welcome greeting on application load (referencing the child's name immediately!)
  useEffect(() => {
    if (!hasShownWelcome) {
      setHasShownWelcome(true);
      const welcomeMsg: MascotMessage = {
        id: 'initial-welcome',
        type: 'welcome',
        title: `¡Hola, ${childName}!`,
        text: `¡Hola ${childName}! Soy Leo el Búho Lector. ¡Qué emoción tenerte aquí hoy! Tenemos cuentos mágicos esperando por ti. Léelos en voz alta, supera las preguntas y gana muchas gemas para jugar en el arcade. Además, ¡puedes hacerme cualquier pregunta que tengas tocando mi micrófono o escribiendo! ¿Listo para leer juntos?`,
        actionLabel: '¡Vamos a leer!',
        onAction: () => {
          onStartReading?.();
        },
        autoSpeak: true,
      };

      setCurrentMessage(welcomeMsg);
      setIsExpanded(true);

      // Attempt speech synthesis immediately
      const timer = setTimeout(() => {
        triggerSpeech(welcomeMsg.text);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [childName, hasShownWelcome, onStartReading, triggerSpeech]);

  // User gesture unlock listener for browsers with strict initial audio autoplay restrictions
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      if (!audioUnlockedRef.current) {
        audioUnlockedRef.current = true;
        setSpeechBlocked(false);
        // If current message is showing and hasn't spoken yet
        if (currentMessage && !isSpeaking && !isMuted) {
          triggerSpeech(currentMessage.text);
        }
      }
    };

    window.addEventListener('click', handleFirstUserInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });
    window.addEventListener('keydown', handleFirstUserInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
    };
  }, [currentMessage, isSpeaking, isMuted, triggerSpeech]);

  // Sync incoming dynamic messages (e.g. from CoreOperationsView on mistake/success)
  useEffect(() => {
    if (incomingMessage) {
      setCurrentMessage(incomingMessage);
      setIsExpanded(true);
      setIsQAMode(false); // Switch to message view
      if (incomingMessage.autoSpeak !== false && !isMuted) {
        triggerSpeech(incomingMessage.text);
      }
    }
  }, [incomingMessage, isMuted, triggerSpeech]);

  // Speech recognition setup for voice questions from the child
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'es-ES';

      recognition.onstart = () => {
        setIsListeningVoice(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuestionInput(transcript);
          handleAskQuestion(transcript);
        }
        setIsListeningVoice(false);
      };

      recognition.onerror = () => {
        setIsListeningVoice(false);
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      recognitionRef.current = recognition;
    } catch {
      setVoiceSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleToggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListeningVoice) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListeningVoice(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
      } catch {
        setIsListeningVoice(false);
      }
    }
  };

  // Submit question to Leo (with anti-cheating & intelligent pedagogical response)
  const handleAskQuestion = async (queryText?: string) => {
    const textToAsk = (queryText || questionInput).trim();
    if (!textToAsk || isAnswering) return;

    setIsAnswering(true);
    setQuestionInput('');
    stopSpeaking();

    try {
      const result = await askMascotQuestion({
        question: textToAsk,
        childName,
        activeStoryTitle,
        activeStoryText,
        storyQuestions,
      });

      setLastQAResult(result);

      // Create a response message card in Leo's speech bubble
      const answerMsg: MascotMessage = {
        id: `answer-${Date.now()}`,
        type: result.isPedagogicalClue ? 'tip' : 'welcome',
        title: result.isPedagogicalClue ? '🦉 Pista sin trampas' : `Respuesta para ${childName}`,
        text: result.answer,
        actionLabel: 'Hacer otra pregunta',
        onAction: () => {
          setIsQAMode(true);
        },
        autoSpeak: true,
      };

      setCurrentMessage(answerMsg);
      setIsExpanded(true);
      triggerSpeech(result.answer);
    } catch {
      const fallback = `¡Hoo-hoo, ${childName}! Lee el cuento con mucha atención y encontrarás las mejores respuestas. ¡Tú eres capaz!`;
      triggerSpeech(fallback);
    } finally {
      setIsAnswering(false);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  const handleMascotClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      if (currentMessage) {
        triggerSpeech(currentMessage.text);
      }
      return;
    }

    if (currentMessage) {
      triggerSpeech(currentMessage.text);
    } else {
      setIsQAMode(true);
      triggerSpeech(`¡Hola ${childName}! ¿En qué puedo ayudarte hoy? Hazme cualquier pregunta sobre los cuentos o palabras.`);
    }
  };

  const handleDismissMessage = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setCurrentMessage(null);
    setIsQAMode(false);
    onDismissIncoming?.();
  };

  return (
    <div id="mascot-companion-container" className="fixed bottom-3 right-2.5 sm:bottom-4 sm:right-4 z-40 flex flex-col items-end pointer-events-none max-w-[calc(100vw-20px)]">
      {/* Speech Bubble / Message & Q&A Card */}
      {isExpanded && (currentMessage || isQAMode) && (
        <div 
          id="mascot-speech-bubble"
          className="pointer-events-auto mb-2 sm:mb-3 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-5 border-2 border-indigo-200 shadow-2xl text-slate-800 relative animate-in fade-in slide-in-from-bottom-4 duration-300 w-[295px] sm:w-[360px] max-w-[calc(100vw-24px)]"
        >
          {/* Top Bar: Close & Mode Toggle */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <button
                id="btn-tab-mascot-msg"
                type="button"
                onClick={() => setIsQAMode(false)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  !isQAMode 
                    ? 'bg-indigo-600 text-white shadow-2xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Mensaje
              </button>
              <button
                id="btn-tab-mascot-qa"
                type="button"
                onClick={() => {
                  setIsQAMode(true);
                  if (currentMessage?.type === 'welcome') {
                    stopSpeaking();
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  isQAMode 
                    ? 'bg-amber-500 text-white shadow-2xs' 
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Pregúntale a Leo</span>
              </button>
            </div>

            <button
              id="btn-dismiss-mascot-msg"
              type="button"
              onClick={handleDismissMessage}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Cerrar mensaje"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Autoplay blocked alert banner */}
          {speechBlocked && !isSpeaking && (
            <button
              id="btn-unblock-speech"
              type="button"
              onClick={() => {
                setSpeechBlocked(false);
                if (currentMessage) triggerSpeech(currentMessage.text);
              }}
              className="w-full mb-2.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm animate-bounce cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>🔊 Toca aquí para escuchar la voz de Leo</span>
            </button>
          )}

          {/* MODE 1: Standard Message View */}
          {!isQAMode && currentMessage && (
            <div>
              {/* Badge & Title */}
              <div className="flex items-center gap-2 mb-2 pr-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                  currentMessage.type === 'welcome'
                    ? 'bg-amber-100 text-amber-800'
                    : currentMessage.type === 'mistake'
                    ? 'bg-rose-100 text-rose-800'
                    : currentMessage.type === 'success'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {currentMessage.type === 'welcome' && <Sparkles className="w-3.5 h-3.5 text-amber-600" />}
                  {currentMessage.type === 'mistake' && <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />}
                  {currentMessage.type === 'success' && <Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
                  {currentMessage.type === 'tip' && <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />}
                  <span>Leo el Búho</span>
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {currentMessage.title}
                </h4>
              </div>

              {/* Message Body */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium mb-3">
                {currentMessage.text}
              </p>

              {/* Audio Speaking Waves Indicator */}
              {isSpeaking && (
                <div className="flex items-center gap-1.5 mb-3 bg-indigo-50 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-indigo-700">
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s] h-2"></span>
                    <span className="w-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s] h-3"></span>
                    <span className="w-1 bg-indigo-500 rounded-full animate-bounce h-2.5"></span>
                  </span>
                  <span>Leo te está hablando en voz alta...</span>
                </div>
              )}

              {/* Anti-cheat pedagogical note badge if applicable */}
              {lastQAResult?.isPedagogicalClue && (
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] mb-3">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span><strong>¡Juego limpio!</strong> Leo te da pistas sabias sin revelar respuestas directas.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                <button
                  id="btn-mascot-replay-speech"
                  type="button"
                  onClick={() => triggerSpeech(currentMessage.text)}
                  disabled={isMuted}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-50 transition-colors disabled:opacity-40 cursor-pointer"
                  title="Escuchar de nuevo"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? 'Repetir' : 'Escuchar'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    id="btn-open-qa-mode"
                    type="button"
                    onClick={() => setIsQAMode(true)}
                    className="px-2.5 py-1.5 rounded-xl font-bold text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Pregúntale algo a Leo"
                  >
                    <MessageCircle className="w-3 h-3 text-amber-700" />
                    <span>Preguntarle</span>
                  </button>

                  {currentMessage.actionLabel && (
                    <button
                      id="btn-mascot-action"
                      type="button"
                      onClick={() => {
                        currentMessage.onAction?.();
                        handleDismissMessage();
                      }}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-xs text-white shadow-xs transition-transform transform active:scale-95 flex items-center gap-1 cursor-pointer ${
                        currentMessage.type === 'mistake'
                          ? 'bg-rose-600 hover:bg-rose-500'
                          : currentMessage.type === 'welcome'
                          ? 'bg-indigo-600 hover:bg-indigo-500'
                          : 'bg-emerald-600 hover:bg-emerald-500'
                      }`}
                    >
                      {currentMessage.type === 'mistake' && <RotateCcw className="w-3 h-3" />}
                      {currentMessage.type === 'welcome' && <BookOpen className="w-3 h-3" />}
                      <span>{currentMessage.actionLabel}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: Q&A Interaction View ("Pregúntale a Leo") */}
          {isQAMode && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1">
                  🦉 Pregúntale a Leo el Búho
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  ¡Sin trampas en el cuento!
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-tight">
                Puedes preguntarle qué significa una palabra, pedirle una pista del cuento o saber cómo ganar más gemas:
              </p>

              {/* Quick Question Chips */}
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    id={`chip-quick-question-${idx}`}
                    type="button"
                    onClick={() => handleAskQuestion(q.text)}
                    disabled={isAnswering}
                    className="px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-semibold text-[10px] border border-indigo-200 transition-colors disabled:opacity-50 cursor-pointer text-left truncate max-w-full"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Voice Listening Animation */}
              {isListeningVoice && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs font-bold animate-pulse">
                  <Mic className="w-4 h-4 text-rose-600 animate-bounce" />
                  <span>Escuchándote... ¡Habla ahora!</span>
                </div>
              )}

              {/* Thinking / Answering Loader */}
              {isAnswering && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2 text-xs font-bold">
                  <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>Leo está buscando en sus libros sabios...</span>
                </div>
              )}

              {/* Question Input Form (Text + Mic + Send) */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskQuestion();
                }}
                className="flex items-center gap-1.5 pt-1"
              >
                {/* Voice Recognition Mic Button */}
                {voiceSupported && (
                  <button
                    id="btn-mascot-mic"
                    type="button"
                    onClick={handleToggleVoiceInput}
                    disabled={isAnswering}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isListeningVoice
                        ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                    title="Hablarle a Leo con el micrófono"
                  >
                    {isListeningVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}

                {/* Text input */}
                <input
                  id="input-mascot-question"
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="Pregúntale a Leo..."
                  disabled={isAnswering || isListeningVoice}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                />

                {/* Send Button */}
                <button
                  id="btn-mascot-send-question"
                  type="submit"
                  disabled={!questionInput.trim() || isAnswering}
                  className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-white font-bold transition-all shadow-xs cursor-pointer"
                  title="Enviar pregunta a Leo"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Small Speech Bubble Pointer Arrow */}
          <div className="absolute -bottom-2.5 right-8 w-4 h-4 bg-white border-r-2 border-b-2 border-indigo-200 transform rotate-45"></div>
        </div>
      )}

      {/* Mascot Animated Avatar Button / Floating Widget */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Audio Mute/Unmute Toggle */}
        <button
          id="btn-toggle-mascot-mute"
          type="button"
          onClick={handleToggleMute}
          className="p-2 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-600 hover:text-indigo-600 shadow-md transition-all hover:scale-105 cursor-pointer"
          title={isMuted ? 'Activar voz de la mascota' : 'Silenciar voz de la mascota'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-600" />
          )}
        </button>

        {/* Mascot Interactive Character */}
        <button
          id="btn-mascot-character"
          type="button"
          onClick={handleMascotClick}
          className={`relative group p-1.5 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer ${
            isSpeaking ? 'ring-4 ring-amber-400 ring-offset-2 animate-pulse' : 'hover:shadow-xl'
          }`}
          title="Toca a Leo el Búho para hablar o hacerle preguntas"
        >
          {/* Glowing Aura */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-500 opacity-70 blur-xs group-hover:opacity-95 transition-opacity"></div>

          {/* Character Badge Container */}
          <div className="relative w-13 h-13 sm:w-17 sm:h-17 rounded-full bg-gradient-to-b from-amber-100 to-sky-100 border-2 border-white shadow-lg flex items-center justify-center overflow-hidden">
            {/* Custom Animated Owl SVG */}
            <svg 
              viewBox="0 0 100 100" 
              className={`w-11 h-11 sm:w-14 sm:h-14 transition-transform duration-300 ${isSpeaking ? 'scale-105' : ''}`}
            >
              {/* Owl Body */}
              <ellipse cx="50" cy="58" rx="32" ry="34" fill="#D97706" />
              {/* Belly */}
              <ellipse cx="50" cy="64" rx="22" ry="24" fill="#FEF3C7" />
              
              {/* Feather markings on belly */}
              <path d="M 44 56 Q 50 60 56 56" stroke="#B45309" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 40 65 Q 50 71 60 65" stroke="#B45309" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 45 74 Q 50 78 55 74" stroke="#B45309" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Wings */}
              <path 
                d="M 18 50 Q 8 65 24 82" 
                fill="#B45309" 
                className={isSpeaking || isAnswering ? 'animate-pulse' : ''} 
              />
              <path 
                d="M 82 50 Q 92 65 76 82" 
                fill="#B45309" 
                className={isSpeaking || isAnswering ? 'animate-pulse' : ''} 
              />

              {/* Ears / Feather tufts */}
              <polygon points="30,28 38,10 44,26" fill="#B45309" />
              <polygon points="70,28 62,10 56,26" fill="#B45309" />

              {/* Big Wise Round Glasses */}
              <circle cx="37" cy="42" r="14" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2.5" />
              <circle cx="63" cy="42" r="14" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2.5" />
              <line x1="49" y1="42" x2="51" y2="42" stroke="#4F46E5" strokeWidth="2.5" />

              {/* Pupils (Big shiny eyes) */}
              <circle cx="39" cy="42" r="6" fill="#1E293B">
                {isSpeaking && <animate attributeName="cy" values="42;40;42" dur="0.8s" repeatCount="indefinite" />}
              </circle>
              <circle cx="41" cy="40" r="2" fill="#FFFFFF" />

              <circle cx="61" cy="42" r="6" fill="#1E293B">
                {isSpeaking && <animate attributeName="cy" values="42;40;42" dur="0.8s" repeatCount="indefinite" />}
              </circle>
              <circle cx="63" cy="40" r="2" fill="#FFFFFF" />

              {/* Animated Beak (Mouth opens/closes when speaking!) */}
              {isSpeaking ? (
                <g>
                  {/* Upper beak */}
                  <polygon points="46,47 54,47 50,54" fill="#EA580C">
                    <animate attributeName="points" values="46,47 54,47 50,54; 46,45 54,45 50,51; 46,47 54,47 50,54" dur="0.25s" repeatCount="indefinite" />
                  </polygon>
                  {/* Open mouth interior */}
                  <ellipse cx="50" cy="55" rx="3.5" ry="2.5" fill="#991B1B">
                    <animate attributeName="ry" values="1;3;1" dur="0.25s" repeatCount="indefinite" />
                  </ellipse>
                </g>
              ) : (
                <polygon points="45,48 55,48 50,56" fill="#EA580C" />
              )}

              {/* Little Feet */}
              <ellipse cx="43" cy="91" rx="4" ry="2" fill="#EA580C" />
              <ellipse cx="57" cy="91" rx="4" ry="2" fill="#EA580C" />
            </svg>

            {/* Speaking Status Pill */}
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border border-white items-center justify-center text-[8px] text-white font-black">
                  🔊
                </span>
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
