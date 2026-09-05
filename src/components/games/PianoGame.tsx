import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, CheckCircle2, Sparkles, Volume2, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PianoGameProps {
  onClose: () => void;
}

interface NotePad {
  id: number;
  note: string;
  label: string;
  color: string;
  activeColor: string;
  freq: number;
}

const NOTES: NotePad[] = [
  { id: 0, note: 'DO', label: '🔴 Do', color: 'bg-rose-500 hover:bg-rose-400 border-rose-700', activeColor: 'bg-rose-300 scale-95 shadow-[0_0_20px_rgba(244,63,94,0.9)]', freq: 261.63 },
  { id: 1, note: 'MI', label: '🟡 Mi', color: 'bg-amber-500 hover:bg-amber-400 border-amber-700', activeColor: 'bg-amber-200 scale-95 shadow-[0_0_20px_rgba(245,158,11,0.9)]', freq: 329.63 },
  { id: 2, note: 'SOL', label: '🔵 Sol', color: 'bg-sky-500 hover:bg-sky-400 border-sky-700', activeColor: 'bg-sky-200 scale-95 shadow-[0_0_20px_rgba(14,165,233,0.9)]', freq: 392.0 },
  { id: 3, note: 'SI', label: '🟣 Si', color: 'bg-purple-500 hover:bg-purple-400 border-purple-700', activeColor: 'bg-purple-200 scale-95 shadow-[0_0_20px_rgba(168,85,247,0.9)]', freq: 493.88 },
];

export const PianoGame: React.FC<PianoGameProps> = ({ onClose }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState<number>(0);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound generator
  const playSound = (freq: number) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio not permitted in preview, visual cues will suffice
    }
  };

  // Start new round
  const startNewSequence = (targetRound = 1) => {
    setIsPlayingSequence(true);
    setUserStep(0);
    setIsFailed(false);

    // Generate sequence of length targetRound
    const newSeq: number[] = [];
    for (let i = 0; i < targetRound; i++) {
      newSeq.push(Math.floor(Math.random() * 4));
    }
    setSequence(newSeq);
    setRound(targetRound);

    // Playback sequence with delay
    newSeq.forEach((noteId, idx) => {
      setTimeout(() => {
        setActivePad(noteId);
        playSound(NOTES[noteId].freq);
        setTimeout(() => setActivePad(null), 350);

        if (idx === newSeq.length - 1) {
          setTimeout(() => setIsPlayingSequence(false), 450);
        }
      }, (idx + 1) * 600);
    });
  };

  // Mount initialization
  useEffect(() => {
    startNewSequence(1);
  }, []);

  const handlePadClick = (id: number) => {
    if (isPlayingSequence || isFailed || hasWon) return;

    setActivePad(id);
    playSound(NOTES[id].freq);
    setTimeout(() => setActivePad(null), 250);

    // Check against sequence
    if (id === sequence[userStep]) {
      const nextStep = userStep + 1;
      setUserStep(nextStep);

      // Finished current round?
      if (nextStep === sequence.length) {
        if (round >= 6) {
          // Completed game!
          setHasWon(true);
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } else {
          // Next round
          setTimeout(() => {
            startNewSequence(round + 1);
          }, 800);
        }
      }
    } else {
      // Wrong note
      setIsFailed(true);
    }
  };

  const handleRestart = () => {
    setHasWon(false);
    setIsFailed(false);
    startNewSequence(1);
  };

  return (
    <div id="game-modal-piano" className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-indigo-100 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1 bg-white rounded-xl shadow-2xs">🎹</span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Melodía Musical Mágica</h3>
              <p className="text-xs text-slate-500">Escucha y repite la secuencia de notas sonoras</p>
            </div>
          </div>
          <button
            id="btn-close-piano-game"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* HUD */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold">
          <div className="flex items-center gap-2.5">
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs text-slate-700">
              Ronda: <strong className="text-purple-600 font-bold">{round}</strong> / 6
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs text-slate-700">
              Progreso: <strong className="text-indigo-600">{userStep} / {sequence.length}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              isPlayingSequence ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isPlayingSequence ? '👂 Escuchando...' : '👉 ¡Tu turno!'}
            </span>
            <button
              onClick={handleRestart}
              className="p-1 text-slate-400 hover:text-purple-600 rounded-lg"
              title="Reiniciar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Musical Pads 2x2 */}
        <div className="p-6 bg-slate-950 flex flex-col items-center justify-center relative">
          <div className="grid grid-cols-2 gap-4 w-64 h-64 sm:w-72 sm:h-72">
            {NOTES.map((note) => {
              const isActive = activePad === note.id;
              return (
                <button
                  key={note.id}
                  onClick={() => handlePadClick(note.id)}
                  disabled={isPlayingSequence || isFailed || hasWon}
                  className={`rounded-3xl border-4 text-white font-black text-lg sm:text-xl transition-all flex flex-col items-center justify-center shadow-lg active:scale-90 ${
                    isActive ? note.activeColor : note.color
                  }`}
                >
                  <span className="drop-shadow-md">{note.label}</span>
                  <Volume2 className="w-4 h-4 mt-1 opacity-70" />
                </button>
              );
            })}
          </div>

          {/* Victory Overlay */}
          {hasWon && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-20">
              <div className="bg-white p-5 rounded-2xl max-w-xs w-full text-center shadow-2xl border border-purple-200">
                <span className="text-3xl">🎼</span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">¡Oído Musical Perfecto!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Completaste las 6 melodías sin equivocarte ninguna nota.
                </p>
                <button
                  onClick={handleRestart}
                  className="w-full mt-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Jugar otra melodía</span>
                </button>
              </div>
            </div>
          )}

          {/* Fail Overlay */}
          {isFailed && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-20">
              <div className="bg-white p-5 rounded-2xl max-w-xs w-full text-center shadow-2xl border border-rose-200">
                <span className="text-3xl">🎵</span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">¡Nota equivocada!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Llegaste hasta la ronda {round}. Escucha atentamente la melodía e inténtalo otra vez.
                </p>
                <button
                  onClick={handleRestart}
                  className="w-full mt-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
                >
                  Repetir desde el inicio
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-slate-100 flex items-center justify-between px-5 text-xs text-slate-500 font-medium">
          <span>Estimula la memoria auditiva</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
