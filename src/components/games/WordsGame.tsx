import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, CheckCircle2, Sparkles, Trophy, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WordsGameProps {
  onClose: () => void;
}

interface BubbleWord {
  id: number;
  text: string;
  isMagic: boolean; // target word
  x: number; // percentage
  y: number; // percentage
  speed: number;
  size: number;
  color: string;
}

const MAGIC_WORDS = [
  'VALENTÍA',
  'ESTRELLA',
  'DRAGÓN',
  'PATINES',
  'ROBOT',
  'MÚSICA',
  'BRÚJULA',
  'CRISTAL',
  'MARTE',
  'TIEMPO',
  'AMISTAD',
  'ARRECIFE',
  'COLIBRÍ',
  'BURBUJA',
  'LIBRO',
  'FLOR',
];

const DECOY_WORDS = ['GRIS', 'RUIDO', 'ENOJO', 'BASURA', 'TRISTE', 'OSCURIDAD'];

export const WordsGame: React.FC<WordsGameProps> = ({ onClose }) => {
  const [bubbles, setBubbles] = useState<BubbleWord[]>([]);
  const [score, setScore] = useState<number>(0);
  const [magicPopped, setMagicPopped] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(75);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const nextId = useRef<number>(1);

  // Bubble spawner and physics loop
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      // Spawn new bubble if less than 7 on screen
      setBubbles((prev) => {
        let current = [...prev];
        if (current.length < 6 && Math.random() < 0.45) {
          const isMagic = Math.random() < 0.75;
          const wordList = isMagic ? MAGIC_WORDS : DECOY_WORDS;
          const text = wordList[Math.floor(Math.random() * wordList.length)];
          const colors = [
            'from-cyan-400 to-blue-500 border-cyan-200 text-white',
            'from-fuchsia-400 to-pink-500 border-pink-200 text-white',
            'from-amber-400 to-orange-500 border-amber-200 text-white',
            'from-emerald-400 to-teal-500 border-emerald-200 text-white',
            'from-purple-400 to-indigo-500 border-purple-200 text-white',
          ];

          current.push({
            id: nextId.current++,
            text,
            isMagic,
            x: 8 + Math.random() * 74,
            y: 105, // start from bottom
            speed: 1.2 + Math.random() * 1.4,
            size: 68 + Math.floor(Math.random() * 20),
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }

        // Float up
        return current
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > -20); // remove when past top
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isGameOver]);

  // Timer countdown
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  const handlePopBubble = (bubble: BubbleWord) => {
    if (isGameOver) return;
    setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));

    if (bubble.isMagic) {
      setScore((s) => s + 15);
      setMagicPopped((m) => {
        const nextM = m + 1;
        if (nextM >= 15) {
          setIsGameOver(true);
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        }
        return nextM;
      });
    } else {
      setScore((s) => Math.max(0, s - 10));
    }
  };

  const handleReset = () => {
    setBubbles([]);
    setScore(0);
    setMagicPopped(0);
    setTimeLeft(75);
    setIsGameOver(false);
  };

  return (
    <div id="game-modal-words" className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-100 bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1 bg-white rounded-xl shadow-2xs">🫧</span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Caza-Palabras Mágicas</h3>
              <p className="text-xs text-slate-500">Explota las palabras mágicas de los cuentos leídos</p>
            </div>
          </div>
          <button
            id="btn-close-words-game"
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
              Palabras: <strong className="text-cyan-600">{magicPopped}</strong> / 15
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs text-slate-700">
              Puntos: <strong className="text-indigo-600">{score}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
              timeLeft < 15 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-200 text-slate-700'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </span>
            <button
              onClick={handleReset}
              className="p-1 text-slate-500 hover:text-cyan-600 rounded-lg"
              title="Reiniciar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Floating Bubble Stage */}
        <div className="relative h-80 sm:h-96 bg-gradient-to-b from-sky-100 via-indigo-50 to-purple-100 overflow-hidden select-none">
          {bubbles.map((bubble) => (
            <button
              key={bubble.id}
              onClick={() => handlePopBubble(bubble)}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center p-2 text-center text-[10px] sm:text-xs font-black shadow-lg hover:scale-110 active:scale-90 transition-transform bg-gradient-to-br ${bubble.color} border-2 backdrop-blur-xs cursor-pointer animate-pulse`}
            >
              <span className="drop-shadow-sm leading-none">{bubble.text}</span>
            </button>
          ))}

          {/* End of game banner */}
          {isGameOver && (
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-20">
              <div className="bg-white p-5 rounded-2xl max-w-xs w-full text-center shadow-2xl border border-cyan-200">
                <span className="text-3xl">🎉</span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">¡Ronda Completada!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Atrapaste <strong>{magicPopped}</strong> palabras mágicas y acumulaste:
                </p>
                <div className="my-2 text-2xl font-black text-cyan-600">{score} Pts</div>
                <button
                  onClick={handleReset}
                  className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Jugar otra ronda</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Guidance Footer */}
        <div className="p-3.5 bg-white border-t border-slate-100 flex items-center justify-between px-5 text-xs text-slate-500">
          <span>Toca las burbujas antes de que suban al cielo</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
