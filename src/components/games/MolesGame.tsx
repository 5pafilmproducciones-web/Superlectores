import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, Sparkles, Trophy, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MolesGameProps {
  onClose: () => void;
}

type HoleContent = 'empty' | 'mole' | 'gem_mole' | 'rock';

export const MolesGame: React.FC<MolesGameProps> = ({ onClose }) => {
  const [holes, setHoles] = useState<HoleContent[]>(Array(9).fill('empty'));
  const [score, setScore] = useState<number>(0);
  const [molesHit, setMolesHit] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(50);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Mole pop-up loop
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setHoles(() => {
        const next = Array(9).fill('empty');
        // Choose 1 or 2 random holes
        const count = Math.random() < 0.35 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          const slot = Math.floor(Math.random() * 9);
          const rand = Math.random();
          if (rand < 0.6) next[slot] = 'mole';
          else if (rand < 0.8) next[slot] = 'gem_mole';
          else next[slot] = 'rock';
        }
        return next;
      });
    }, 750);

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
          confetti({ particleCount: 80, spread: 75, origin: { y: 0.6 } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  const handleHoleClick = (index: number) => {
    if (isGameOver) return;
    const content = holes[index];
    if (content === 'empty') return;

    // Clear hit hole immediately
    setHoles((prev) => {
      const copy = [...prev];
      copy[index] = 'empty';
      return copy;
    });

    if (content === 'mole') {
      setScore((s) => s + 10);
      setMolesHit((m) => m + 1);
    } else if (content === 'gem_mole') {
      setScore((s) => s + 25);
      setMolesHit((m) => m + 1);
    } else if (content === 'rock') {
      setScore((s) => Math.max(0, s - 10));
    }
  };

  const handleRestart = () => {
    setHoles(Array(9).fill('empty'));
    setScore(0);
    setMolesHit(0);
    setTimeLeft(50);
    setIsGameOver(false);
  };

  return (
    <div id="game-modal-moles" className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-100 bg-gradient-to-r from-amber-50 via-lime-50 to-emerald-50">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1 bg-white rounded-xl shadow-2xs">🥕</span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Topos Mágicos del Huerto</h3>
              <p className="text-xs text-slate-500">Toca los topos y gemas, evita las piedras</p>
            </div>
          </div>
          <button
            id="btn-close-moles-game"
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
              Puntos: <strong className="text-amber-600 font-bold">{score}</strong>
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs text-slate-700">
              Atrapados: <strong className="text-emerald-600">{molesHit}</strong>
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
              onClick={handleRestart}
              className="p-1 text-slate-400 hover:text-amber-600 rounded-lg"
              title="Reiniciar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Garden Grid 3x3 */}
        <div className="p-6 bg-gradient-to-b from-amber-100 to-amber-200 flex flex-col items-center justify-center relative">
          <div className="grid grid-cols-3 gap-3.5 w-72 h-72 sm:w-80 sm:h-80">
            {holes.map((content, idx) => (
              <button
                key={idx}
                onClick={() => handleHoleClick(idx)}
                className="relative bg-amber-900 rounded-3xl border-4 border-amber-950 shadow-inner flex items-center justify-center overflow-hidden active:scale-95 transition-transform"
              >
                {/* Hole dark depth */}
                <div className="w-16 h-16 rounded-full bg-amber-950/80 shadow-inner flex items-center justify-center">
                  {content === 'mole' && (
                    <span className="text-4xl animate-bounce filter drop-shadow-md">
                      🐹
                    </span>
                  )}
                  {content === 'gem_mole' && (
                    <div className="flex flex-col items-center animate-bounce">
                      <span className="text-3xl">🦔</span>
                      <span className="text-xs -mt-2">💎</span>
                    </div>
                  )}
                  {content === 'rock' && (
                    <span className="text-3xl filter drop-shadow-md animate-pulse">
                      🪨
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Victory Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-20">
              <div className="bg-white p-5 rounded-2xl max-w-xs w-full text-center shadow-2xl border border-amber-200">
                <span className="text-3xl">🏆</span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">¡Cosecha Terminada!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Atrapaste <strong>{molesHit} topos</strong> y lograste un puntaje de:
                </p>
                <div className="my-2 text-2xl font-black text-amber-600">{score} Pts</div>
                <button
                  onClick={handleRestart}
                  className="w-full mt-2 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Jugar de nuevo</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-slate-100 flex items-center justify-between px-5 text-xs text-slate-500 font-medium">
          <span>Rapidez y reflejos visuales</span>
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
