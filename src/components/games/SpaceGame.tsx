import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, CheckCircle2, Sparkles, Heart, ArrowLeft, ArrowRight, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpaceGameProps {
  onClose: () => void;
}

interface FallingItem {
  id: number;
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  type: 'star' | 'gem' | 'meteor';
  speed: number;
}

export const SpaceGame: React.FC<SpaceGameProps> = ({ onClose }) => {
  const [shipX, setShipX] = useState<number>(50); // Ship horizontal percentage
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [items, setItems] = useState<FallingItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef<number>(1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setShipX((prev) => Math.max(8, prev - 8));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setShipX((prev) => Math.min(92, prev + 8));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  // Main game tick loop
  useEffect(() => {
    if (isGameOver) return;

    const gameInterval = setInterval(() => {
      // Spawn new items randomly
      if (Math.random() < 0.35) {
        const rand = Math.random();
        let type: 'star' | 'gem' | 'meteor' = 'star';
        if (rand < 0.5) type = 'star';
        else if (rand < 0.75) type = 'meteor';
        else type = 'gem';

        setItems((prev) => [
          ...prev,
          {
            id: nextId.current++,
            x: 8 + Math.random() * 84,
            y: 0,
            type,
            speed: 2.2 + Math.random() * 2.0,
          },
        ]);
      }

      // Move items down and check collisions
      setItems((prev) => {
        const updated: FallingItem[] = [];
        for (const item of prev) {
          const nextY = item.y + item.speed;

          // Check collision with ship near bottom (y between 78% and 92%)
          if (nextY >= 78 && nextY <= 92 && Math.abs(item.x - shipX) < 11) {
            if (item.type === 'star') {
              setScore((s) => s + 10);
            } else if (item.type === 'gem') {
              setScore((s) => s + 25);
            } else if (item.type === 'meteor') {
              setLives((l) => {
                const nextL = l - 1;
                if (nextL <= 0) {
                  setIsGameOver(true);
                }
                return Math.max(0, nextL);
              });
            }
            continue; // Item collected/hit
          }

          // Keep item if not off-screen
          if (nextY < 100) {
            updated.push({ ...item, y: nextY });
          }
        }
        return updated;
      });
    }, 60);

    return () => clearInterval(gameInterval);
  }, [isGameOver, shipX]);

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

  const handleReset = () => {
    setShipX(50);
    setScore(0);
    setLives(3);
    setTimeLeft(60);
    setItems([]);
    setIsGameOver(false);
  };

  // Drag / Click to move ship on touch
  const handleTouchAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isGameOver || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    setShipX(Math.min(92, Math.max(8, clickXPercent)));
  };

  return (
    <div id="game-modal-space" className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-950 text-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col border border-indigo-900/80">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-indigo-950 bg-gradient-to-r from-violet-900/40 via-indigo-900/30 to-purple-900/40">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1 bg-indigo-950 rounded-xl border border-indigo-700/40">🚀</span>
            <div>
              <h3 className="font-extrabold text-base text-white">Atrapa-Estrellas Cósmico</h3>
              <p className="text-xs text-indigo-300">Mueve tu nave, atrapa gemas y esquiva meteoritos</p>
            </div>
          </div>
          <button
            id="btn-close-space-game"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* HUD Info */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-900/90 border-b border-indigo-950 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-950/80 text-amber-300 px-2.5 py-1 rounded-lg border border-indigo-800/60 flex items-center gap-1 font-bold">
              ⭐ Puntos: <strong>{score}</strong>
            </span>
            <div className="flex items-center gap-1 bg-indigo-950/80 px-2 py-1 rounded-lg border border-indigo-800/60">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-indigo-950/80 text-cyan-300 px-2.5 py-1 rounded-lg border border-indigo-800/60 font-bold">
              ⏳ {timeLeft}s
            </span>
            <button
              onClick={handleReset}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              title="Reiniciar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game Stage (Space Sky) */}
        <div
          ref={containerRef}
          onClick={handleTouchAreaClick}
          className="relative h-72 sm:h-80 bg-radial from-indigo-950 via-slate-950 to-black overflow-hidden select-none cursor-crosshair"
        >
          {/* Background distant stars */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-800/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-4 left-10 text-[10px] text-white/30 pointer-events-none">✦</div>
          <div className="absolute top-16 right-12 text-xs text-white/20 pointer-events-none">★</div>
          <div className="absolute top-28 left-24 text-[8px] text-white/40 pointer-events-none">✧</div>
          <div className="absolute top-44 right-20 text-[10px] text-white/30 pointer-events-none">✦</div>

          {/* Falling items */}
          {items.map((item) => (
            <div
              key={item.id}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform pointer-events-none"
            >
              {item.type === 'star' && (
                <span className="text-xl sm:text-2xl filter drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
                  ⭐
                </span>
              )}
              {item.type === 'gem' && (
                <span className="text-xl sm:text-2xl filter drop-shadow-[0_0_10px_rgba(168,85,247,0.9)] animate-spin">
                  💎
                </span>
              )}
              {item.type === 'meteor' && (
                <span className="text-xl sm:text-2xl filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                  ☄️
                </span>
              )}
            </div>
          ))}

          {/* Player Spaceship */}
          <div
            style={{ left: `${shipX}%` }}
            className="absolute bottom-4 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
          >
            <span className="text-3xl sm:text-4xl filter drop-shadow-[0_0_12px_rgba(99,102,241,0.9)]">
              🚀
            </span>
            <div className="w-2 h-3 bg-amber-400 rounded-full blur-2xs animate-pulse -mt-1 opacity-80" />
          </div>

          {/* Game Over / Win Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
              <div className="p-4 bg-indigo-950/90 border border-indigo-700/60 rounded-2xl max-w-xs w-full shadow-2xl">
                {lives > 0 ? (
                  <>
                    <span className="text-3xl">🏆</span>
                    <h4 className="text-base font-extrabold text-white mt-1">¡Misión Cumplida!</h4>
                    <p className="text-xs text-indigo-300 mt-1">
                      Completaste la travesía estelar con un puntaje de:
                    </p>
                    <div className="my-2 text-2xl font-black text-amber-400">{score} Pts</div>
                  </>
                ) : (
                  <>
                    <span className="text-3xl">💥</span>
                    <h4 className="text-base font-extrabold text-white mt-1">¡Nave Averiada!</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Un meteorito alcanzó los escudos. Lograste:
                    </p>
                    <div className="my-2 text-2xl font-black text-amber-400">{score} Pts</div>
                  </>
                )}
                <button
                  onClick={handleReset}
                  className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Jugar de nuevo</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile controls & guidance */}
        <div className="p-3 bg-slate-900 border-t border-indigo-950 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShipX((prev) => Math.max(8, prev - 12))}
              className="p-3 bg-indigo-950 active:bg-indigo-700 rounded-xl border border-indigo-800 text-white font-bold"
              aria-label="Izquierda"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShipX((prev) => Math.min(92, prev + 12))}
              className="p-3 bg-indigo-950 active:bg-indigo-700 rounded-xl border border-indigo-800 text-white font-bold"
              aria-label="Derecha"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-[11px] text-indigo-300 text-right">
            Toca la pantalla o usa flechas ◄ ►
          </div>
        </div>
      </div>
    </div>
  );
};
