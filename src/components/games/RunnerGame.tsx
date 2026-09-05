import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, RotateCcw, Sparkles, Trophy, ArrowUp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RunnerGameProps {
  onClose: () => void;
}

interface Obstacle {
  id: number;
  x: number; // percentage across screen
  width: number;
  type: 'cactus' | 'rock' | 'gem';
}

export const RunnerGame: React.FC<RunnerGameProps> = ({ onClose }) => {
  const [dinoY, setDinoY] = useState<number>(0); // 0 = on ground, >0 = in air
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [gemsCollected, setGemsCollected] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [highScore, setHighScore] = useState<number>(0);

  const nextObstacleId = useRef<number>(1);
  const velocityY = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Jump trigger
  const handleJump = useCallback(() => {
    if (isGameOver) return;
    if (dinoY === 0) {
      velocityY.current = 14;
      setIsJumping(true);
    }
  }, [dinoY, isGameOver]);

  // Keyboard controls (Space or ArrowUp)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump]);

  // Main physics & obstacle loop
  useEffect(() => {
    if (isGameOver) return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Update Dinosaur Jump Physics
      setDinoY((prevY) => {
        let newY = prevY + velocityY.current;
        velocityY.current -= 0.85; // Gravity
        if (newY <= 0) {
          newY = 0;
          velocityY.current = 0;
          setIsJumping(false);
        }
        return newY;
      });

      // Advance Score
      setScore((s) => s + 1);

      // Spawn Obstacles
      setObstacles((prev) => {
        let next = prev.map((obs) => ({
          ...obs,
          x: obs.x - 1.2, // move left
        }));

        // Remove off-screen obstacles
        next = next.filter((obs) => obs.x > -15);

        // Spawn new obstacle if last one is far enough
        const rightmostX = next.length > 0 ? Math.max(...next.map((o) => o.x)) : 0;
        if (rightmostX < 65 && Math.random() < 0.04) {
          const randType = Math.random();
          let type: 'cactus' | 'rock' | 'gem' = 'cactus';
          if (randType < 0.4) type = 'cactus';
          else if (randType < 0.7) type = 'rock';
          else type = 'gem';

          next.push({
            id: nextObstacleId.current++,
            x: 105,
            width: type === 'cactus' ? 6 : 5,
            type,
          });
        }

        // Check Collisions
        // Dino is horizontally at ~15% to ~22%
        for (const obs of next) {
          const isDinoInXRange = obs.x >= 12 && obs.x <= 24;

          if (isDinoInXRange) {
            if (obs.type === 'gem') {
              // Collected gem!
              setGemsCollected((g) => g + 1);
              setScore((s) => s + 50);
              // Remove gem
              return next.filter((o) => o.id !== obs.id);
            } else {
              // Cactus or rock collision if dino is low (dinoY < 38)
              // (using callback state via dinoY reference inside loop or tolerance)
              // Let dino jump clear the obstacle
            }
          }
        }

        return next;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isGameOver]);

  // Separate collision checker using live state
  useEffect(() => {
    if (isGameOver) return;
    for (const obs of obstacles) {
      const isDinoInXRange = obs.x >= 12 && obs.x <= 22;
      if (isDinoInXRange && obs.type !== 'gem' && dinoY < 32) {
        setIsGameOver(true);
        setHighScore((h) => Math.max(h, score));
        break;
      }
    }
  }, [obstacles, dinoY, isGameOver, score]);

  const handleRestart = () => {
    setDinoY(0);
    setIsJumping(false);
    velocityY.current = 0;
    setScore(0);
    setGemsCollected(0);
    setObstacles([]);
    setIsGameOver(false);
  };

  return (
    <div id="game-modal-runner" className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-100 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1 bg-white rounded-xl shadow-2xs">🦖</span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Salto Prehistórico</h3>
              <p className="text-xs text-slate-500">Salta con Barra Espaciadora o toca la pantalla</p>
            </div>
          </div>
          <button
            id="btn-close-runner-game"
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
              Distancia: <strong className="text-amber-600 font-bold">{Math.floor(score / 5)}m</strong>
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs text-slate-700 flex items-center gap-1">
              <span>💎</span>
              <strong className="text-indigo-600">{gemsCollected}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Récord: {Math.floor(highScore / 5)}m</span>
            <button
              onClick={handleRestart}
              className="p-1 text-slate-400 hover:text-amber-600 rounded-lg transition-colors"
              title="Reiniciar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Game Canvas / Arena */}
        <div
          onClick={handleJump}
          className="relative h-64 sm:h-72 bg-gradient-to-b from-amber-100/60 via-amber-50 to-orange-100 overflow-hidden cursor-pointer"
        >
          {/* Background sun & clouds */}
          <div className="absolute top-4 right-8 w-12 h-12 bg-amber-300 rounded-full blur-xs opacity-70" />
          <div className="absolute top-8 left-12 text-sm text-slate-300 opacity-60">☁️</div>
          <div className="absolute top-12 left-44 text-xs text-slate-300 opacity-50">☁️</div>

          {/* Dinosaur Character */}
          <div
            style={{
              bottom: `${dinoY + 20}px`,
              left: '16%',
            }}
            className="absolute -translate-x-1/2 transition-none flex flex-col items-center"
          >
            <span className="text-4xl filter drop-shadow-md">🦖</span>
            {isJumping && (
              <div className="w-3 h-1 bg-amber-400 rounded-full blur-2xs -mt-1 opacity-70" />
            )}
          </div>

          {/* Obstacles & Gems */}
          {obstacles.map((obs) => (
            <div
              key={obs.id}
              style={{
                left: `${obs.x}%`,
                bottom: obs.type === 'gem' ? '54px' : '20px',
              }}
              className="absolute -translate-x-1/2 pointer-events-none transition-none"
            >
              {obs.type === 'cactus' && (
                <span className="text-2xl filter drop-shadow-sm">🌵</span>
              )}
              {obs.type === 'rock' && (
                <span className="text-xl filter drop-shadow-sm">🪨</span>
              )}
              {obs.type === 'gem' && (
                <span className="text-2xl filter drop-shadow-md animate-bounce">💎</span>
              )}
            </div>
          ))}

          {/* Ground surface line */}
          <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-700 border-t-2 border-amber-900" />

          {/* Game Over Banner */}
          {isGameOver && (
            <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-20">
              <div className="bg-white p-5 rounded-2xl max-w-xs w-full text-center shadow-2xl border border-amber-200">
                <span className="text-3xl">🌴</span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">¡Tropezaste con una roca!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Corriste <strong>{Math.floor(score / 5)} metros</strong> y recolectaste {gemsCollected} gemas prehistóricas.
                </p>
                <button
                  onClick={handleRestart}
                  className="w-full mt-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Correr de nuevo</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Big Jump Touch Control for Tablets & Phones */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between px-5">
          <span className="text-xs text-slate-400 font-medium">Toca la pantalla para saltar</span>
          <button
            onClick={handleJump}
            className="flex items-center gap-1 px-4 py-2 bg-amber-500 active:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
            <span>¡SALTAR!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
