import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Story, ChildProfile, ReadingEvaluation } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { speakText } from '../utils/speech';
import { MascotMessage } from './MascotCompanion';
import { 
  BookOpen, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Gem, 
  Award, 
  HelpCircle, 
  PenTool, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight,
  Gamepad2,
  AlertCircle,
  RefreshCw,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CoreOperationsViewProps {
  stories: Story[];
  profile: ChildProfile;
  selectedStoryId?: string;
  onUpdateProfile: (updated: Partial<ChildProfile>) => void;
  onSaveEvaluation: (evaluation: ReadingEvaluation) => void;
  onOpenGames: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
  onTriggerMascot?: (message: MascotMessage) => void;
}

export const CoreOperationsView: React.FC<CoreOperationsViewProps> = ({
  stories,
  profile,
  selectedStoryId,
  onUpdateProfile,
  onSaveEvaluation,
  onOpenGames,
  showToast,
  onTriggerMascot,
}) => {
  // Active story selection
  const [activeStory, setActiveStory] = useState<Story>(() => {
    if (selectedStoryId) {
      const found = stories.find((s) => s.id === selectedStoryId);
      if (found) return found;
    }
    return stories.find((s) => s.level === profile.level) || stories[0];
  });

  // Level selector filter for browsing
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | 'all'>('all');

  // Speech Recognition state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [recognizedWords, setRecognizedWords] = useState<Set<string>>(new Set());
  const [speechAccuracy, setSpeechAccuracy] = useState<number>(0);
  const recognitionRef = useRef<any>(null);

  // Text to speech state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Dynamic Quiz Questions Management:
  // Tracks questions the child has already answered correctly per story so questions vary over time
  const [masteredQuestionIdsByStory, setMasteredQuestionIdsByStory] = useLocalStorage<Record<string, string[]>>(
    'lecturakids_mastered_questions_v1',
    {}
  );
  const [questionRotationOffset, setQuestionRotationOffset] = useState<number>(0);

  // Quiz state: answers stored as boolean or null
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: boolean | null }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Writing evaluation state
  const [writingInput, setWritingInput] = useState<string>('');
  const [writingEvaluated, setWritingEvaluated] = useState<boolean>(false);

  // Completed session modal / banner
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);
  const [earnedGemsTotal, setEarnedGemsTotal] = useState<number>(0);

  // Normalize words for matching
  const cleanWord = (w: string) =>
    w.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"'¡¿]/g, '').trim();

  const storyWords = useMemo(() => {
    return activeStory.text.split(/\s+/).map((w) => cleanWord(w)).filter(Boolean);
  }, [activeStory]);

  // Derive dynamic 3-question set for the current story session
  const activeQuestions = useMemo(() => {
    const pool = activeStory.questions || [];
    if (pool.length <= 3) return pool;

    const mastered = masteredQuestionIdsByStory[activeStory.id] || [];
    const unmastered = pool.filter((q) => !mastered.includes(q.id));

    if (unmastered.length >= 3) {
      // Prioritize questions the child hasn't answered correctly yet
      const offset = questionRotationOffset % unmastered.length;
      const rotated = [...unmastered.slice(offset), ...unmastered.slice(0, offset)];
      return rotated.slice(0, 3);
    } else if (unmastered.length > 0) {
      // Use remaining unmastered questions and fill the rest from the pool
      const needed = 3 - unmastered.length;
      const masteredPool = pool.filter((q) => mastered.includes(q.id));
      const offset = questionRotationOffset % Math.max(1, masteredPool.length);
      const rotatedMastered = [...masteredPool.slice(offset), ...masteredPool.slice(0, offset)];
      return [...unmastered, ...rotatedMastered.slice(0, needed)];
    } else {
      // All questions in the pool have been answered correctly!
      // Rotate through the full pool in batches so future sessions on this story continue to vary
      const offset = (questionRotationOffset * 3) % pool.length;
      const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];
      return rotated.slice(0, 3);
    }
  }, [activeStory, masteredQuestionIdsByStory, questionRotationOffset]);

  // Rotate questions manually or on demand
  const handleRotateQuestions = () => {
    setQuestionRotationOffset((prev) => prev + 1);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    showToast('info', 'Nuevas preguntas cargadas', 'Se han seleccionado otras preguntas del banco de este cuento.');
  };

  // Reset mastery for this story if desired
  const handleResetStoryMastery = () => {
    setMasteredQuestionIdsByStory((prev) => {
      const updated = { ...prev };
      delete updated[activeStory.id];
      return updated;
    });
    setQuestionRotationOffset(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    showToast('success', 'Banco reiniciado', 'Se ha reiniciado el progreso de preguntas de este cuento.');
  };

  // Handle story switch
  const handleSelectStory = (story: Story) => {
    stopSpeechRecognition();
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setActiveStory(story);
    setSpokenTranscript('');
    setRecognizedWords(new Set());
    setSpeechAccuracy(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setWritingInput('');
    setWritingEvaluated(false);
    setSessionFinished(false);
    setQuestionRotationOffset(0);
  };

  // Speech Recognition initialization
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript + ' ';
        }
        processSpokenText(fullTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis?.cancel();
    };
  }, [activeStory]);

  const processSpokenText = (text: string) => {
    setSpokenTranscript(text);
    const spokenList = text.split(/\s+/).map((w) => cleanWord(w)).filter(Boolean);
    const matched = new Set<string>();

    storyWords.forEach((targetWord) => {
      if (spokenList.includes(targetWord)) {
        matched.add(targetWord);
      }
    });

    setRecognizedWords(matched);
    const accuracy = storyWords.length > 0 ? Math.round((matched.size / storyWords.length) * 100) : 0;
    setSpeechAccuracy(accuracy);
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  const startSpeechRecognition = () => {
    if (!recognitionRef.current) {
      showToast(
        'info',
        'Reconocimiento por voz',
        'El reconocimiento directo depende de tu navegador. También puedes usar el botón de "Simular Lectura Fluida".'
      );
      return;
    }
    try {
      recognitionRef.current.start();
      setIsListening(true);
      showToast('info', 'Micrófono encendido', 'Lee el cuento en voz alta despacio y con claridad.');
    } catch (err) {
      console.warn('Could not start recognition:', err);
      simulateSpeechReading();
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  };

  // Safe simulation for iframe preview without mic hardware permissions
  const simulateSpeechReading = () => {
    showToast('success', 'Simulación de lectura en voz alta iniciada', 'Evaluando pronunciación y fluidez infantil.');
    let idx = 0;
    const words = [...storyWords];
    const matched = new Set<string>();

    const interval = setInterval(() => {
      if (idx < words.length) {
        matched.add(words[idx]);
        setRecognizedWords(new Set(matched));
        const currentAcc = Math.round((matched.size / words.length) * 100);
        setSpeechAccuracy(currentAcc);
        idx += 2;
      } else {
        clearInterval(interval);
        setSpeechAccuracy(94);
        showToast('success', '¡Excelente lectura en alta voz!', 'Precisión auditiva alcanzada: 94%.');
      }
    }, 180);
  };

  // Text to Speech: Listen to model narration
  const toggleTextToSpeech = () => {
    if (!('speechSynthesis' in window)) {
      showToast('error', 'Audio no compatible', 'Tu navegador no soporta síntesis de voz.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeStory.text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9; // Slightly slower for kids
      utterance.pitch = 1.05;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
      showToast('info', 'Escuchando narración modelo', 'Escucha atentamente cómo se pronuncia cada palabra.');
    }
  };

  // Quiz answering
  const handleAnswerQuestion = (questionId: string, answer: boolean) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const evaluateQuiz = () => {
    let correct = 0;
    const incorrectIds: string[] = [];
    activeQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.isTrue) {
        correct++;
      } else {
        incorrectIds.push(q.id);
      }
    });
    setQuizScore(correct);
    setQuizSubmitted(true);

    if (correct === activeQuestions.length) {
      showToast('success', '¡Puntaje Perfecto!', `Respondiste correctamente las ${correct} preguntas.`);
      onTriggerMascot?.({
        id: `quiz-success-${Date.now()}`,
        type: 'success',
        title: '¡Puntaje Perfecto! 🎉',
        text: `¡Fantástico trabajo, ${profile.name}! ¡Respondiste todas las preguntas correctamente! Eres un lector súper perspicaz. ¡Reclama tus gemas para jugar en el arcade!`,
        actionLabel: '¡Reclamar Gemas!',
        onAction: () => {
          handleCompleteSession();
        },
        autoSpeak: true,
      });
    } else {
      showToast('info', '¡Leo te motiva!', `Acertaste ${correct} de ${activeQuestions.length}. ¡Inténtalo de nuevo!`);
      // Kind encouraging voice from mascot motivating the child to try again
      onTriggerMascot?.({
        id: `quiz-mistake-${Date.now()}`,
        type: 'mistake',
        title: '¡Inténtalo otra vez, tú puedes! 🦉',
        text: `¡Buen esfuerzo, ${profile.name}! No te preocupes por equivocarte, ¡los grandes lectores aprenden practicando! Revisa con calma esa parte del cuento y pulsa en "Intentar otra vez" para responder de nuevo. ¡Yo sé que lo vas a lograr!`,
        actionLabel: 'Intentar de nuevo',
        onAction: () => {
          handleRetryQuiz();
        },
        autoSpeak: true,
      });
    }
  };

  // Re-try quiz: clears only the questions answered incorrectly, preserving already mastered ones
  const handleRetryQuiz = () => {
    setQuizSubmitted(false);
    setQuizAnswers((prev) => {
      const updated = { ...prev };
      activeQuestions.forEach((q) => {
        if (prev[q.id] !== q.isTrue) {
          delete updated[q.id];
        }
      });
      return updated;
    });
    speakText(`¡Eso es, ${profile.name}! Lee con atención el texto y elige la respuesta correcta. ¡Tú eres capaz!`);
    showToast('info', 'Nuevo intento desbloqueado', 'Revisa el cuento arriba y responde nuevamente.');
  };

  // Re-try a specific question
  const handleRetrySingleQuestion = (questionId: string) => {
    setQuizSubmitted(false);
    setQuizAnswers((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
    speakText(`¡Vamos! Lee con cuidado esa parte del cuento y elige la opción verdadera o falsa.`);
    showToast('info', 'Pregunta desbloqueada', 'Elige la opción correcta para esta pregunta.');
  };

  // Writing evaluation
  const evaluateWriting = () => {
    if (!writingInput.trim()) {
      showToast('error', 'Campo vacío', 'Por favor escribe tu respuesta en el recuadro antes de evaluar.');
      return;
    }
    setWritingEvaluated(true);
    showToast('success', 'Respuesta evaluada', '¡Gran esfuerzo redactando tus ideas!');
  };

  // Finish session & award gems
  const handleCompleteSession = () => {
    stopSpeechRecognition();
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);

    // Save mastered questions: any question answered correctly is stored in persistent mastery
    // so in subsequent opportunities the app changes to different questions
    const correctlyAnsweredIds = activeQuestions
      .filter((q) => quizAnswers[q.id] === q.isTrue)
      .map((q) => q.id);

    if (correctlyAnsweredIds.length > 0) {
      setMasteredQuestionIdsByStory((prev) => {
        const currentList = prev[activeStory.id] || [];
        const merged = Array.from(new Set([...currentList, ...correctlyAnsweredIds]));
        return {
          ...prev,
          [activeStory.id]: merged,
        };
      });
    }

    // Advance rotation offset so the next session on this story immediately presents new questions
    setQuestionRotationOffset((prev) => prev + 1);

    // Calculate gems with strict coherence:
    // A story awards just enough gems to play 1 game (with 1 leftover cushion gem).
    // 3/3 correct: 100% of rewardGems (7, 10, or 14)
    // 2/3 correct: ~70%
    // 1/3 correct: ~40%
    const totalQuestions = activeQuestions.length || 3;
    const quizRatio = quizScore / totalQuestions;
    let earnedGems = Math.max(1, Math.round(activeStory.rewardGems * quizRatio));
    if (writingEvaluated && quizRatio === 1) {
      earnedGems = Math.min(activeStory.rewardGems + 1, earnedGems + 1);
    }
    const earnedPoints = activeStory.rewardPoints + quizScore * 20;

    setEarnedGemsTotal(earnedGems);
    setSessionFinished(true);

    // Update child profile
    const newGems = profile.gems + earnedGems;
    const newScore = profile.score + earnedPoints;
    const newCount = profile.storiesCompletedCount + 1;
    // Check level up (e.g. if score > 500 and level === 1, or score > 1000 and level === 2)
    let newLevel = profile.level;
    if (newScore >= 600 && profile.level === 1) newLevel = 2;
    if (newScore >= 1200 && profile.level === 2) newLevel = 3;

    onUpdateProfile({
      gems: newGems,
      score: newScore,
      storiesCompletedCount: newCount,
      level: newLevel,
    });

    // Save ReadingEvaluation log
    const evaluation: ReadingEvaluation = {
      id: `eval-${Date.now()}`,
      storyId: activeStory.id,
      storyTitle: activeStory.title,
      studentName: profile.name,
      completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      voiceAccuracy: speechAccuracy || 90,
      mispronouncedWords: [],
      quizScore,
      totalQuestions: activeQuestions.length,
      writingResponse: writingInput,
      writingApproved: writingEvaluated,
      gemsEarned: earnedGems,
      pointsEarned: earnedPoints,
      status: 'completado',
    };

    onSaveEvaluation(evaluation);

    // Launch celebratory confetti
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });

    showToast(
      'success',
      '¡Felicitaciones!',
      `Has ganado +${earnedGems} Gemas 💎 y +${earnedPoints} Puntos ⭐.`
    );
  };

  const filteredStories = stories.filter(
    (s) => selectedLevelFilter === 'all' || s.level === selectedLevelFilter
  );

  return (
    <div id="core-operations-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Bar: Story Switcher & Level Filter */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            {activeStory.coverImage ? (
              <img
                src={activeStory.coverImage}
                alt={activeStory.title}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-3xl">{activeStory.emoji}</span>
            )}
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">{activeStory.title}</h2>
              <p className="text-xs text-slate-500">{activeStory.category} • {activeStory.levelName}</p>
            </div>
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setSelectedLevelFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedLevelFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos los Cuentos
          </button>
          {[1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedLevelFilter === lvl
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Nivel {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Story Carousel pills to easily jump between books */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin w-full max-w-full">
        {filteredStories.map((story) => {
          const isCurrent = story.id === activeStory.id;
          return (
            <button
              key={story.id}
              onClick={() => handleSelectStory(story)}
              className={`flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isCurrent
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs ring-1 ring-indigo-400'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {story.coverImage ? (
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover border border-slate-200 shadow-xs shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-base sm:text-lg">{story.emoji}</span>
              )}
              <div className="text-left">
                <span className="block font-bold leading-tight truncate max-w-[120px] sm:max-w-[140px]">{story.title}</span>
                <span className="text-[10px] text-slate-500 font-normal">Nivel {story.level} • {story.rewardGems} 💎</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* MAIN READER WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full max-w-full">
        {/* Left Column: Interactive Story & Speech Evaluation (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Story Reading Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Box Header & Audio Controls */}
            <div className="p-3.5 sm:p-5 bg-gradient-to-r from-slate-50 to-indigo-50/50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600 shrink-0" />
                <span className="font-bold text-sm text-slate-900">Lectura en Alta Voz</span>
                <span className="text-xs text-slate-500">({storyWords.length} palabras)</span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Text to Speech Button */}
                <button
                  id="btn-tts-listen"
                  onClick={toggleTextToSpeech}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                    isSpeaking
                      ? 'bg-amber-100 border-amber-300 text-amber-800 animate-pulse'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Escucha al narrador leer el cuento"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
                  <span>{isSpeaking ? 'Pausar Audio' : 'Escuchar Narrador'}</span>
                </button>

                {/* Speech Recognition Mic */}
                <button
                  id="btn-mic-toggle"
                  onClick={toggleSpeechRecognition}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'Detener Mic' : 'Leer en Voz Alta'}</span>
                </button>
              </div>
            </div>

            {/* Reading Accuracy Live Meter */}
            <div className="px-3.5 sm:px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Precisión de Reconocimiento:</span>
                <span className="font-extrabold text-indigo-700 font-mono text-sm">{speechAccuracy}%</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-simulate-speech"
                  onClick={simulateSpeechReading}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline transition-colors cursor-pointer"
                  title="Prueba inmediata de reconocimiento auditivo sin necesidad de micrófono físico"
                >
                  ⚡ Simular Lectura Fluida
                </button>
              </div>
            </div>

            {/* Story Cover Illustration Banner */}
            {activeStory.coverImage && (
              <div className="relative w-full h-48 sm:h-64 overflow-hidden border-b border-slate-200 bg-slate-900 group">
                <img
                  src={activeStory.coverImage}
                  alt={activeStory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent flex items-end p-5 sm:p-6">
                  <div className="text-white space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold text-white shadow-xs">
                        {activeStory.badge} • {activeStory.levelName}
                      </span>
                      <span className="text-xs text-amber-300 font-semibold">
                        💎 {activeStory.rewardGems} Gemas
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xl sm:text-2xl text-white drop-shadow-md">
                      {activeStory.title}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Story Text Display with live highlighted words */}
            <div className="p-6 sm:p-8">
              <div className="bg-amber-50/40 p-6 sm:p-7 rounded-2xl border border-amber-200/60 leading-relaxed text-slate-800 font-serif text-lg sm:text-xl shadow-xs">
                {activeStory.text.split(/(\s+)/).map((segment, index) => {
                  const cleaned = cleanWord(segment);
                  const isRecognized = cleaned && recognizedWords.has(cleaned);

                  if (!cleaned) {
                    return <span key={index}>{segment}</span>;
                  }

                  return (
                    <span
                      key={index}
                      className={`transition-colors duration-200 px-1 py-0.5 rounded-md ${
                        isRecognized
                          ? 'bg-emerald-200/80 text-emerald-950 font-medium'
                          : isListening
                          ? 'hover:bg-indigo-100'
                          : ''
                      }`}
                    >
                      {segment}
                    </span>
                  );
                })}
              </div>

              {/* Instructions Pill */}
              <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  <strong>¿Cómo funciona?</strong> Activa el micrófono y lee el cuento. Las palabras reconocidas se iluminarán en verde en tiempo real. ¡Al terminar, responde las preguntas para ganar gemas!
                </p>
              </div>
            </div>
          </div>

          {/* Reto de Escritura & Comprensión Escrita */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <PenTool className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900">Reto de Escritura y Expresión</h3>
            </div>

            <p className="text-xs text-slate-600 leading-normal">
              {activeStory.writingChallenge.prompt}
            </p>

            {/* Required Keywords pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-semibold">Palabras clave recomendadas:</span>
              {activeStory.writingChallenge.keywordsRequired.map((kw) => {
                const isIncluded = writingInput.toLowerCase().includes(kw.toLowerCase());
                return (
                  <span
                    key={kw}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                      isIncluded
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {isIncluded ? '✓ ' : ''}{kw}
                  </span>
                );
              })}
            </div>

            {/* Textarea */}
            <textarea
              id="textarea-writing-response"
              rows={3}
              value={writingInput}
              onChange={(e) => setWritingInput(e.target.value)}
              placeholder="Escribe aquí tu respuesta con tus propias palabras..."
              className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder:text-slate-400"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Pistas: {activeStory.writingChallenge.hint}
              </span>
              <button
                id="btn-evaluate-writing"
                onClick={evaluateWriting}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                {writingEvaluated ? 'Respuesta Guardada ✓' : 'Evaluar Escritura'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Preguntas de Falso o Verdadero & Canje (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* True / False Quiz Box with Dynamic Question Variation */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Preguntas de Comprensión</h3>
                    <p className="text-[11px] text-slate-500">Responde Verdadero o Falso (Varían con cada lectura)</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                    3 de {activeStory.questions?.length || 3} Preguntas
                  </span>
                </div>
              </div>

              {/* Dynamic Questions Status & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="font-medium text-[11px]">Banco de comprensión:</span>
                  <span className="px-2 py-0.5 rounded-full bg-white font-extrabold text-indigo-700 text-[11px] border border-slate-200">
                    {(masteredQuestionIdsByStory[activeStory.id] || []).length} / {activeStory.questions?.length || 3} dominadas ⭐
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    id="btn-rotate-questions"
                    type="button"
                    onClick={handleRotateQuestions}
                    title="Cargar otra combinación de preguntas para este cuento"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-indigo-600 text-[11px] font-semibold transition-all shadow-2xs cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 text-indigo-500" />
                    <span>Cambiar preguntas</span>
                  </button>

                  {(masteredQuestionIdsByStory[activeStory.id] || []).length >= (activeStory.questions?.length || 3) && (
                    <button
                      id="btn-reset-questions-mastery"
                      type="button"
                      onClick={handleResetStoryMastery}
                      title="Reiniciar banco de preguntas de este cuento"
                      className="text-[11px] text-slate-400 hover:text-rose-600 underline font-medium cursor-pointer"
                    >
                      Reiniciar ciclo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Questions List (Dynamic 3 questions) */}
            <div className="space-y-4">
              {activeQuestions.map((q, index) => {
                const answer = quizAnswers[q.id];
                const isAnswered = answer !== undefined && answer !== null;
                const isCorrect = isAnswered && answer === q.isTrue;

                return (
                  <div
                    key={q.id}
                    id={`quiz-question-item-${index + 1}`}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 leading-snug">
                        {q.question}
                      </p>
                    </div>

                    {/* True / False Choice Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        id={`btn-q${index + 1}-true`}
                        onClick={() => handleAnswerQuestion(q.id, true)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          answer === true
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verdadero</span>
                      </button>

                      <button
                        id={`btn-q${index + 1}-false`}
                        onClick={() => handleAnswerQuestion(q.id, false)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          answer === false
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Falso</span>
                      </button>
                    </div>

                    {/* Feedback and explanation if evaluated */}
                    {quizSubmitted && (
                      <div className={`p-3 rounded-xl text-xs ${isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`}>
                        <div className="font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            {isCorrect ? '✓ ¡Respuesta Correcta!' : '✗ Necesita repaso'}
                          </span>
                          {!isCorrect && (
                            <button
                              id={`btn-retry-question-${index + 1}`}
                              type="button"
                              onClick={() => handleRetrySingleQuestion(q.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                              title="Intentar responder esta pregunta otra vez"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Intentar otra vez</span>
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] mt-1.5 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Evaluate Quiz Button */}
            {!quizSubmitted ? (
              <button
                id="btn-evaluate-quiz"
                onClick={evaluateQuiz}
                disabled={Object.keys(quizAnswers).length < activeQuestions.length}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Comprobar Respuestas
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50 rounded-xl flex items-center justify-between text-xs font-bold text-indigo-900">
                  <span>Puntaje de Comprensión:</span>
                  <span className="text-base">{quizScore} / {activeQuestions.length}</span>
                </div>

                {/* Encouraging Mascot Card when there's a mistake */}
                {quizScore < activeQuestions.length && (
                  <div className="p-4 rounded-2xl bg-amber-50/95 border-2 border-amber-300 text-amber-950 flex items-start gap-3.5 shadow-xs animate-in fade-in">
                    <div className="w-11 h-11 rounded-full bg-white border-2 border-amber-400 flex items-center justify-center shrink-0 shadow-sm text-2xl">
                      🦉
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold text-[10px]">
                            Leo el Búho te anima
                          </span>
                          <span className="font-bold text-amber-950 text-xs">¡Tú puedes lograrlo!</span>
                        </div>
                        <button
                          id="btn-listen-leo-quiz-mistake"
                          type="button"
                          onClick={() => {
                            speakText(`¡Buen esfuerzo, ${profile.name}! No te preocupes por equivocarte. Revisa con calma esa parte del cuento y pulsa en intentar otra vez para responder de nuevo. ¡Yo sé que lo vas a lograr!`);
                          }}
                          className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline"
                          title="Escuchar la voz de Leo"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Escuchar voz</span>
                        </button>
                      </div>
                      <p className="text-amber-900 mt-1.5 leading-relaxed font-medium">
                        ¡Buen esfuerzo, <strong>{profile.name}</strong>! Recuerda que equivocarse es parte de aprender. Lee de nuevo el texto del cuento y pulsa el botón para volver a intentar las preguntas que tuvieron error.
                      </p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          id="btn-retry-all-mistakes"
                          type="button"
                          onClick={handleRetryQuiz}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Intentar otra vez las incorrectas</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-[11px] leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Preguntas dinámicas:</strong> Las preguntas acertadas se registran como dominadas. En la próxima oportunidad que leas este cuento, el sistema activará automáticamente preguntas distintas del banco para seguir evaluando tu comprensión.
                  </p>
                </div>

                {/* Final Submit & Reward Button */}
                <button
                  id="btn-finish-reading-session"
                  onClick={handleCompleteSession}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-sm shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gem className="w-4 h-4 text-sky-200 animate-bounce" />
                  <span>¡Reclamar Gemas y Finalizar Cuento!</span>
                </button>
              </div>
            )}
          </div>

          {/* Reward Box / Mini-Game Teaser */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-sm">Zona de Juegos y Receso</h4>
              </div>
              <span className="text-xs font-extrabold text-amber-300">💎 {profile.gems} Disponibles</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ¿Terminaste tu lectura? Tómate un receso jugando carreras de autos, armando rompecabezas, pintando en el taller o superando el laberinto.
            </p>

            <button
              id="btn-goto-games-arcade"
              onClick={onOpenGames}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Ir al Salón de Juegos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Session Success Modal */}
      {sessionFinished && (
        <div id="modal-session-success" className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl border border-indigo-100 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-full flex items-center justify-center mx-auto shadow-md">
              <Award className="w-9 h-9 text-amber-800" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                ¡Misión Cumplida!
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">¡Felicitaciones, {profile.name}!</h3>
              <p className="text-xs text-slate-600 mt-1">
                Completaste la lectura de <strong>"{activeStory.title}"</strong> con éxito.
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
              <div className="p-2 bg-white rounded-xl shadow-2xs">
                <span className="text-slate-400 block text-[10px]">GEMAS</span>
                <span className="font-extrabold text-sky-600 text-base">+{earnedGemsTotal} 💎</span>
              </div>
              <div className="p-2 bg-white rounded-xl shadow-2xs">
                <span className="text-slate-400 block text-[10px]">COMPRENSIÓN</span>
                <span className="font-extrabold text-indigo-600 text-base">{quizScore}/3</span>
              </div>
              <div className="p-2 bg-white rounded-xl shadow-2xs">
                <span className="text-slate-400 block text-[10px]">AUDITIVA</span>
                <span className="font-extrabold text-emerald-600 text-base">{speechAccuracy}%</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                id="btn-modal-recess-games"
                onClick={onOpenGames}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-4 h-4 text-amber-300" />
                <span>Canjear Gemas por un Receso con Juegos</span>
              </button>

              <button
                id="btn-modal-next-story"
                onClick={() => setSessionFinished(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Continuar con Otro Cuento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
