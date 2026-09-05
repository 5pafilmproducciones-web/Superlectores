import React, { useState, useEffect, useCallback } from 'react';
import { X, RotateCcw, CheckCircle2, Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RiverGameProps {
  onClose: () => void;
}

interface FloatObj {
  id: number;
  x: number; // percentage across lane (0-100)
  width: number; // width in percent
  type: 'log' | 'lily';
}

export const RiverGame: React.FC<RiverGameProps> = ({ onClose }) => {
  // Beaver position: lane (0 = start bank, 1..4 = river lanes, 5 = goal bank), col (0..100%)
  const [beaverLane, setBeaverLane] = useState<number>(0);
  const [beaverX, setBeaverX] = useState<number>(50);
  const [crossings, setCrossings] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [isDrowned, setIsDrowned] = useState<boolean>(false);

  // Floating platforms on lanes 1, 2, 3, 4
  const [lane1, setLane1] = useState<FloatObj[]>([
    { id: 1, x: 10, width: 22, type: 'lily' },
    { id: 2, x: 50, width: 22, type: 'lily' },
    { id: 3, x: 85, width: 22, type: 'lily' },
  ]);
  const [lane2, setLane2] = useState<FloatObj[]>([
    { id: 4, x: 20, width: 28, type: 'log' },
    { id: 5, x: 70, width: 28, type: 'log' },
  ]);
  const [lane3, setLane3] = useState<FloatObj[]>([
    { id: 6, x: 15, width: 22, type: 'lily' },
    { id: 7, x: 60, width: 22, type: 'lily' },
  ]);
  const [lane4, setLane4] = useState<FloatObj[]>([
    { id: 8, x: 10, width: 30, type: 'log' },
    { id: 9, x: 65, width: 30, type: 'log' },
  ]);

  // River platform animation loop
  useEffect(() => {
    if (hasWon || lives <= 0) return;

    const interval = setInterval(() => {
      // Lane 1 flows left
      setLane1((prev) =>
        prev.map((o) => {
          let nx = o.x - 1.2;
          if (nx < -25) nx = 105;
          return { ...o, x: nx };
        })
      );
      // Lane 2 flows right
      setLane2((prev) =>
        prev.map((o) => {
          let nx = o.x + 1.4;
          if (nx > 105) nx = -28;
          return { ...o, x: nx };
        })
      );
      // Lane 3 flows left
      setLane3((prev) =>
        prev.map((o) => {
          let nx = o.x - 1.5;
          if (nx < -25) nx = 105;
          return { ...o, x: nx };
        })
      );
      // Lane 4 flows right
      setLane4((prev) =>
        prev.map((o) => {
          let nx = o.x + 1.2;
          if (nx > 105) nx = -30;
          return { ...o, x: nx };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [hasWon, lives]);

  // Check if beaver is safely on a platform when in lanes 1 to 4
  useEffect(() => {
    if (beaverLane === 0 || beaverLane === 5 || hasWon || lives <= 0) return;

    let safe = false;
    let currentLaneObjects: FloatObj[] = [];
    if (beaverLane === 1) currentLaneObjects = lane1;
    else if (beaverLane === 2) currentLaneObjects = lane2;
    else if (beaverLane === 3) currentLaneObjects = lane3;
    else if (beaverLane === 4) currentLaneObjects = lane4;

    for (const obj of currentLaneObjects) {
      if (beaverX >= obj.x - 4 && beaverX <= obj.x + obj.width + 4) {
        safe = true;
        break;
      }
    }

    if (!safe) {
      // Beaver fell in water!
      setIsDrowned(true);
      setTimeout(() => {
        setLives((l) => Math.max(0, l - 1));
        setBeaverLane(0);
        setBeaverX(50);
        setIsDrowned(false);
      }, 500);
    }
  }, [beaverLane, beaverX, lane1, lane2, lane3, lane4, hasWon, lives]);

  const move = useCallback(
    (dLane: number, dX: number) => {
      if (hasWon || lives <= 0 || isDrowned) return;

      setBeaverLane((prevLane) => {
        const nextLane = Math.max(0, Math.min(5, prevLane + dLane));
        if (nextLane === 5) {
          // Reached the opposite bank!
          setCrossings((c) => {
            const nextC = c + 1;
            confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
            if (nextC >= 3) {
              setHasWon(true);
            } else {
              // Next round
              setTimeout(() => {
                setBeaverLane(0);
                setBeaverX(50);
              }, 800);
            }
            return nextC;
          });
        }
        return nextLane;
      });

      setBeaverX((prevX) => Math.max(10, Math.min(90, prevX + dX)));
    },
    [hasWon, lives, isDrowned]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        move(1, 0);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        move(-1, 0);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        move(0, -10);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        move(0, 10);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const handleRestart = () => {
    setBeaverLane(0);
    setBeaverX(50);
    setCrossings(0);
    setLives(3);
    setHasWon(false);
    setIsDrowned(false);
  };

  return (
    <div id="game-modal-river" className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-teal-100 bg-gradient-to-r from-teal-50 via-emerald-50 to-sky-50">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1 bg-white rounded-xl shadow-2xs">🦫</span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Río del Castor Saltarín</h3>
              <p className="text-xs text-slate-500">Salta sobre troncos y nenúfares hasta la madriguera</p>
            </div>
          </div>
          <button
            id="btn-close-river-game"
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
              Cruces: <strong className="text-teal-600 font-bold">{crossings}</strong> / 3
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs text-rose-600 font-bold flex items-center gap-1">
              <span>❤️</span> {lives}
            </span>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1 text-slate-500 hover:text-teal-600 text-xs font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>

        {/* River Stage */}
        <div className="relative h-80 bg-sky-500 overflow-hidden flex flex-col justify-between">
          {/* Lane 5: Goal Bank */}
          <div className="h-12 bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-around px-4 border-b-2 border-emerald-800 text-white text-xs font-bold">
            <span>🏡 Madriguera</span>
            <span>🌳 Árboles</span>
            <span>🏡 Refugio</span>
          </div>

          {/* Lane 4: Logs (flows right) */}
          <div className="h-12 bg-sky-600/90 relative border-b border-sky-400/30">
            {lane4.map((obj) => (
              <div
                key={obj.id}
                style={{ left: `${obj.x}%`, width: `${obj.width}%` }}
                className="absolute top-1 bottom-1 bg-amber-800 rounded-full flex items-center justify-center text-xs font-bold text-amber-200 border-2 border-amber-950 shadow-sm"
              >
                🪵
              </div>
            ))}
          </div>

          {/* Lane 3: Water Lilies (flows left) */}
          <div className="h-12 bg-sky-600 relative border-b border-sky-400/30">
            {lane3.map((obj) => (
              <div
                key={obj.id}
                style={{ left: `${obj.x}%`, width: `${obj.width}%` }}
                className="absolute top-1.5 bottom-1.5 bg-emerald-500 rounded-full flex items-center justify-center text-sm shadow-sm border border-emerald-300"
              >
                🪷
              </div>
            ))}
          </div>

          {/* Lane 2: Logs (flows right) */}
          <div className="h-12 bg-sky-600/90 relative border-b border-sky-400/30">
            {lane2.map((obj) => (
              <div
                key={obj.id}
                style={{ left: `${obj.x}%`, width: `${obj.width}%` }}
                className="absolute top-1 bottom-1 bg-amber-800 rounded-full flex items-center justify-center text-xs font-bold text-amber-200 border-2 border-amber-950 shadow-sm"
              >
                🪵
              </div>
            ))}
          </div>

          {/* Lane 1: Water Lilies (flows left) */}
          <div className="h-12 bg-sky-600 relative border-b border-sky-400/30">
            {lane1.map((obj) => (
              <div
                key={obj.id}
                style={{ left: `${obj.x}%`, width: `${obj.width}%` }}
                className="absolute top-1.5 bottom-1.5 bg-emerald-500 rounded-full flex items-center justify-center text-sm shadow-sm border border-emerald-300"
              >
                🪷
              </div>
            ))}
          </div>

          {/* Lane 0: Start Bank */}
          <div className="h-12 bg-gradient-to-r from-emerald-700 to-teal-800 flex items-center justify-between px-6 border-t-2 border-emerald-900 text-white text-xs font-bold">
            <span>🌿 Orilla de Salida</span>
            <span>🍀 Flores</span>
          </div>

          {/* Beaver Character Sprite */}
          <div
            style={{
              bottom: `${beaverLane * 53 + 6}px`,
              left: `${beaverX}%`,
            }}
            className={`absolute -translate-x-1/2 transition-all duration-150 z-20 pointer-events-none flex flex-col items-center ${
              isDrowned ? 'animate-spin scale-50 opacity-50' : ''
            }`}
          >
            <span className="text-3xl filter drop-shadow-md">🦫</span>
          </div>

          {/* Victory Overlay */}
          {hasWon && (
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-30">
              <div className="bg-white p-5 rounded-2xl max-w-xs w-full text-center shadow-2xl border border-teal-200">
                <span className="text-3xl">🏆</span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">¡Gran Castor Explorador!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Cruzaste el río 3 veces sano y salvo llevando ramitas a tu familia.
                </p>
                <button
                  onClick={handleRestart}
                  className="w-full mt-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Jugar de nuevo</span>
                </button>
              </div>
            </div>
          )}

          {/* Game Over */}
          {!hasWon && lives <= 0 && (
            <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 z-30">
              <div className="bg-white p-5 rounded-2xl max-w-xs w-full text-center shadow-2xl border border-rose-200">
                <span className="text-3xl">💦</span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">¡Te caíste al agua!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  El río estaba muy rápido. ¡Vuelve a intentarlo calculando cada salto!
                </p>
                <button
                  onClick={handleRestart}
                  className="w-full mt-3 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
                >
                  Intentar otra vez
                </button>
              </div>
            </div>
          )}
        </div>

        {/* D-Pad Controls */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between px-6">
          <span className="text-xs text-slate-400">Usa flechas o botones</span>
          <div className="grid grid-cols-3 gap-1.5 w-36">
            <div></div>
            <button
              onClick={() => move(1, 0)}
              className="p-2.5 bg-slate-100 active:bg-teal-600 active:text-white rounded-xl flex items-center justify-center border border-slate-200"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div></div>
            <button
              onClick={() => move(0, -12)}
              className="p-2.5 bg-slate-100 active:bg-teal-600 active:text-white rounded-xl flex items-center justify-center border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => move(-1, 0)}
              className="p-2.5 bg-slate-100 active:bg-teal-600 active:text-white rounded-xl flex items-center justify-center border border-slate-200"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => move(0, 12)}
              className="p-2.5 bg-slate-100 active:bg-teal-600 active:text-white rounded-xl flex items-center justify-center border border-slate-200"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
