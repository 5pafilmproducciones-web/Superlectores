import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy, ArrowLeft, ArrowRight, Zap, X } from 'lucide-react';

interface RaceGameProps {
  onClose: () => void;
  onRewardCoins?: (coins: number) => void;
}

interface Obstacle {
  id: number;
  x: number; // 0, 1, or 2 (lanes)
  y: number; // percentage from top 0 to 100
  type: 'cone' | 'oil' | 'star';
}

export const RaceGame: React.FC<RaceGameProps> = ({ onClose, onRewardCoins }) => {
  const [lane, setLane] = useState<number>(1); // 0: Left, 1: Center, 2: Right
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [coinsCollected, setCoinsCollected] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const nextObstacleDistanceRef = useRef<number>(0);

  const startGame = () => {
    setLane(1);
    setScore(0);
    setCoinsCollected(0);
    setSpeed(1);
    setGameOver(false);
    setObstacles([]);
    setIsPlaying(true);
    lastTimeRef.current = performance.now();
  };

  const moveLeft = useCallback(() => {
    setLane((prev) => Math.max(0, prev - 1));
  }, []);

  const moveRight = useCallback(() => {
    setLane((prev) => Math.min(2, prev + 1));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, moveLeft, moveRight]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setScore((s) => s + Math.round(delta * 10 * speed));

      // Move obstacles down
      setObstacles((prev) => {
        const updated: Obstacle[] = [];
        for (const obs of prev) {
          const newY = obs.y + delta * (35 * speed);
          
          // Collision detection: player car is roughly at y = 80-92%
          if (newY >= 75 && newY <= 90 && obs.x === lane) {
            if (obs.type === 'star') {
              setCoinsCollected((c) => c + 1);
              setScore((s) => s + 50);
              continue; // Collect star, don't keep it
            } else {
              // Hit hazard!
              setGameOver(true);
              setIsPlaying(false);
              return prev;
            }
          }

          if (newY < 105) {
            updated.push({ ...obs, y: newY });
          }
        }
        return updated;
      });

      // Spawn obstacles
      nextObstacleDistanceRef.current += delta;
      if (nextObstacleDistanceRef.current > 1.3 / speed) {
        nextObstacleDistanceRef.current = 0;
        const randomLane = Math.floor(Math.random() * 3);
        const isStar = Math.random() > 0.55;
        setObstacles((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: randomLane,
            y: -10,
            type: isStar ? 'star' : Math.random() > 0.5 ? 'cone' : 'oil',
          },
        ]);

        // Gradual speedup
        setSpeed((sp) => Math.min(2.5, sp + 0.02));
      }

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, gameOver, lane, speed]);

  return (
    <div id="game-modal-race" className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏎️</span>
            <div>
              <h3 className="font-bold text-base text-white">Carreras Turbo Nitro</h3>
              <p className="text-xs text-indigo-400">Esquiva los conos y recoge estrellas</p>
            </div>
          </div>
          <button
            id="btn-close-race-game"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* HUD Info */}
        <div className="grid grid-cols-3 gap-2 px-5 py-2.5 bg-slate-950/40 text-center text-xs border-b border-slate-800">
          <div className="bg-slate-800/80 rounded-lg py-1 px-2">
            <span className="text-slate-400 block text-[10px]">PUNTAJE</span>
            <span className="font-mono font-bold text-sm text-indigo-300">{score}</span>
          </div>
          <div className="bg-slate-800/80 rounded-lg py-1 px-2">
            <span className="text-slate-400 block text-[10px]">ESTRELLAS</span>
            <span className="font-mono font-bold text-sm text-amber-400">⭐ {coinsCollected}</span>
          </div>
          <div className="bg-slate-800/80 rounded-lg py-1 px-2">
            <span className="text-slate-400 block text-[10px]">VELOCIDAD</span>
            <span className="font-mono font-bold text-sm text-emerald-400">{(speed * 50).toFixed(0)} km/h</span>
          </div>
        </div>

        {/* Track Canvas / Area */}
        <div className="relative h-96 bg-slate-950 overflow-hidden select-none border-x-4 border-slate-700 mx-auto w-full max-w-sm">
          {/* Animated road lanes */}
          <div className="absolute inset-0 flex justify-evenly pointer-events-none">
            <div className="w-1 border-r-2 border-dashed border-slate-600/60 h-full animate-pulse"></div>
            <div className="w-1 border-r-2 border-dashed border-slate-600/60 h-full animate-pulse"></div>
          </div>

          {/* Road markings */}
          <div className="absolute inset-0 flex">
            <div className="w-1/3 h-full border-r border-slate-800/40"></div>
            <div className="w-1/3 h-full border-r border-slate-800/40"></div>
            <div className="w-1/3 h-full"></div>
          </div>

          {/* Obstacles & Stars */}
          {obstacles.map((obs) => {
            const lanePercentage = obs.x === 0 ? '16.66%' : obs.x === 1 ? '50%' : '83.33%';
            return (
              <div
                key={obs.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 text-2xl"
                style={{
                  left: lanePercentage,
                  top: `${obs.y}%`,
                }}
              >
                {obs.type === 'star' && <span className="animate-spin inline-block drop-shadow-md">⭐</span>}
                {obs.type === 'cone' && <span className="drop-shadow-md">🚧</span>}
                {obs.type === 'oil' && <span className="drop-shadow-md">🛢️</span>}
              </div>
            );
          })}

          {/* Player Car */}
          {isPlaying && !gameOver && (
            <div
              className="absolute bottom-6 transform -translate-x-1/2 transition-all duration-150 text-4xl filter drop-shadow-[0_4px_8px_rgba(79,70,229,0.7)]"
              style={{
                left: lane === 0 ? '16.66%' : lane === 1 ? '50%' : '83.33%',
              }}
            >
              🏎️
            </div>
          )}

          {/* Start Screen Overlay */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
              <span className="text-5xl mb-3">🏁</span>
              <h4 className="text-lg font-bold text-white mb-1">¡Listo para la Carrera!</h4>
              <p className="text-xs text-slate-300 max-w-xs mb-4">
                Usa las teclas de flecha ← → o los botones táctiles para cambiar de carril y recolectar estrellas.
              </p>
              <button
                id="btn-start-race"
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>¡ACELERAR!</span>
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
              <span className="text-5xl mb-2">💥</span>
              <h4 className="text-xl font-bold text-rose-400 mb-1">¡Fin del Recorrido!</h4>
              <p className="text-xs text-slate-300 mb-3">Chocaste contra un obstáculo en la pista.</p>
              <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-3 mb-4 w-full max-w-xs text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Puntaje final:</span>
                  <span className="font-bold text-indigo-300">{score} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estrellas atrapadas:</span>
                  <span className="font-bold text-amber-400">{coinsCollected} ⭐</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  id="btn-retry-race"
                  onClick={startGame}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Jugar otra vez</span>
                </button>
                <button
                  id="btn-quit-race"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
                >
                  Volver al Salón
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile / Screen Controls */}
        <div className="flex items-center justify-between p-3.5 bg-slate-950 border-t border-slate-800">
          <button
            id="btn-steer-left"
            onClick={moveLeft}
            disabled={!isPlaying || gameOver}
            className="flex-1 max-w-[120px] flex items-center justify-center gap-1 py-3 bg-slate-800 active:bg-indigo-600 disabled:opacity-40 text-white font-bold rounded-xl text-sm border border-slate-700 shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>IZQ</span>
          </button>
          <div className="text-center text-[11px] text-slate-400 px-2">
            <span>Usa flechas o botones</span>
          </div>
          <button
            id="btn-steer-right"
            onClick={moveRight}
            disabled={!isPlaying || gameOver}
            className="flex-1 max-w-[120px] flex items-center justify-center gap-1 py-3 bg-slate-800 active:bg-indigo-600 disabled:opacity-40 text-white font-bold rounded-xl text-sm border border-slate-700 shadow-md"
          >
            <span>DER</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
