import React, { useState, useEffect, useCallback } from 'react';
import { X, RotateCcw, CheckCircle2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles, Shuffle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MazeGameProps {
  onClose: () => void;
}

interface Pos {
  r: number;
  c: number;
}

interface MazeState {
  grid: number[][]; // 0: path, 1: wall, 2: key, 3: exit
  keyPos: Pos;
  exitPos: Pos;
}

// Procedural DFS Maze Generator with guaranteed reachability and loops
function generateRandomMaze(rows = 11, cols = 11): MazeState {
  // Initialize full wall grid
  const grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(1));

  // Carve paths using randomized Depth-First Search
  function carve(r: number, c: number) {
    grid[r][c] = 0;
    const dirs = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ].sort(() => Math.random() - 0.5);

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && grid[nr][nc] === 1) {
        grid[r + dr / 2][c + dc / 2] = 0; // Break wall between
        carve(nr, nc);
      }
    }
  }

  // Start carving from player spawn (1, 1)
  carve(1, 1);

  // Add 3-4 extra random connections to create playful loops and prevent frustrating dead ends
  for (let i = 0; i < 4; i++) {
    const r = 1 + Math.floor(Math.random() * (rows - 2));
    const c = 1 + Math.floor(Math.random() * (cols - 2));
    grid[r][c] = 0;
  }

  // Ensure player spawn is open
  grid[1][1] = 0;

  // Find all reachable path cells except start
  const openCells: Pos[] = [];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (grid[r][c] === 0 && !(r === 1 && c === 1)) {
        openCells.push({ r, c });
      }
    }
  }

  // Sort by Manhattan distance from (1, 1)
  openCells.sort((a, b) => {
    const distA = Math.abs(a.r - 1) + Math.abs(a.c - 1);
    const distB = Math.abs(b.r - 1) + Math.abs(b.c - 1);
    return distB - distA;
  });

  // Pick Exit Chest from the furthest 30% of reachable paths
  const farCandidates = openCells.slice(0, Math.max(3, Math.floor(openCells.length * 0.35)));
  const exitPos = farCandidates[Math.floor(Math.random() * farCandidates.length)] || { r: rows - 2, c: cols - 2 };

  // Pick Key from path cells at least 4 steps away from start and distinct from exit
  const keyCandidates = openCells.filter(
    (p) =>
      (p.r !== exitPos.r || p.c !== exitPos.c) &&
      Math.abs(p.r - 1) + Math.abs(p.c - 1) >= 4 &&
      Math.abs(p.r - exitPos.r) + Math.abs(p.c - exitPos.c) >= 3
  );
  const keyPos =
    keyCandidates[Math.floor(Math.random() * keyCandidates.length)] ||
    openCells.find((p) => p.r !== exitPos.r || p.c !== exitPos.c) || { r: 1, c: cols - 2 };

  grid[keyPos.r][keyPos.c] = 2; // Key
  grid[exitPos.r][exitPos.c] = 3; // Exit Chest

  return { grid, keyPos, exitPos };
}

export const MazeGame: React.FC<MazeGameProps> = ({ onClose }) => {
  const [maze, setMaze] = useState<MazeState>(() => generateRandomMaze());
  const [playerPos, setPlayerPos] = useState<Pos>({ r: 1, c: 1 });
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [steps, setSteps] = useState<number>(0);
  const [mazeSeed, setMazeSeed] = useState<number>(1);

  // Generates a brand new random solvable maze every time
  const handleNewRandomMaze = useCallback(() => {
    const nextMaze = generateRandomMaze();
    setMaze(nextMaze);
    setPlayerPos({ r: 1, c: 1 });
    setHasKey(false);
    setWon(false);
    setSteps(0);
    setMazeSeed((s) => s + 1);
  }, []);

  const move = useCallback(
    (dr: number, dc: number) => {
      if (won) return;
      setPlayerPos((prev) => {
        const nr = prev.r + dr;
        const nc = prev.c + dc;
        if (nr < 0 || nr >= maze.grid.length || nc < 0 || nc >= maze.grid[0].length) {
          return prev;
        }
        if (maze.grid[nr][nc] === 1) {
          return prev; // Hit wall
        }

        setSteps((s) => s + 1);

        // Check if player reaches Key
        const gotKeyNow = hasKey || (nr === maze.keyPos.r && nc === maze.keyPos.c);
        if (nr === maze.keyPos.r && nc === maze.keyPos.c && !hasKey) {
          setHasKey(true);
        }

        // Check if player reaches Exit Chest with key
        if (nr === maze.exitPos.r && nc === maze.exitPos.c) {
          if (gotKeyNow) {
            setWon(true);
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          }
        }

        return { r: nr, c: nc };
      });
    },
    [hasKey, won, maze]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        move(-1, 0);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        move(1, 0);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        move(0, -1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        move(0, 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  return (
    <div id="game-modal-maze" className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-purple-100 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1.5 bg-white rounded-xl shadow-2xs">🌀</span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                Laberinto del Explorador
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  Ruta #{mazeSeed}
                </span>
              </h3>
              <p className="text-xs text-slate-500">Recorrido nuevo cada partida • Encuentra la llave y el cofre</p>
            </div>
          </div>
          <button
            id="btn-close-maze-game"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* HUD Info & Randomize button */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              Pasos: <strong className="text-indigo-600 font-bold">{steps}</strong>
            </span>
            <span
              className={`px-2.5 py-1 rounded-lg transition-colors font-bold flex items-center gap-1 ${
                hasKey
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs animate-pulse'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {hasKey ? '🔑 ¡Llave Lista!' : '🔒 Busca la Llave'}
            </span>
          </div>
          <button
            id="btn-random-maze-layout"
            onClick={handleNewRandomMaze}
            title="Genera un laberinto completamente diferente"
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Nuevo Recorrido</span>
          </button>
        </div>

        {/* Maze Grid Display */}
        <div className="p-4 bg-slate-900/95 flex flex-col items-center justify-center relative select-none">
          <div className="bg-slate-950 p-2 sm:p-2.5 rounded-2xl shadow-2xl inline-block border-2 border-slate-800">
            {maze.grid.map((row, rIdx) => (
              <div key={rIdx} className="flex">
                {row.map((cell, cIdx) => {
                  const isPlayer = playerPos.r === rIdx && playerPos.c === cIdx;
                  const isKey = rIdx === maze.keyPos.r && cIdx === maze.keyPos.c && !hasKey;
                  const isExit = rIdx === maze.exitPos.r && cIdx === maze.exitPos.c;
                  const isWall = cell === 1;

                  return (
                    <div
                      key={cIdx}
                      className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs font-bold transition-all relative ${
                        isWall
                          ? 'bg-slate-800/90 border border-slate-700/60 rounded-xs'
                          : 'bg-slate-900/40 hover:bg-slate-800/30'
                      }`}
                    >
                      {isPlayer && (
                        <span className="text-base animate-bounce drop-shadow-md z-10" title="Tú">
                          🧒
                        </span>
                      )}
                      {!isPlayer && isKey && (
                        <span className="text-sm animate-pulse drop-shadow-md" title="Llave Dorada">
                          🔑
                        </span>
                      )}
                      {!isPlayer && isExit && (
                        <span
                          className={`text-sm ${hasKey ? 'animate-bounce drop-shadow-md' : 'opacity-80'}`}
                          title="Cofre de la Salida"
                        >
                          {hasKey ? '🏆' : '🔒'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Victory Toast Overlay */}
          {won && (
            <div className="mt-3 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl text-center w-full max-w-xs shadow-lg animate-fade-in">
              <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>¡Cofre Abierto con Éxito!</span>
              </div>
              <p className="text-xs text-emerald-700 mt-1 font-medium">
                ¡Gran orientación espacial! Descifraste este laberinto en {steps} pasos.
              </p>
              <button
                onClick={handleNewRandomMaze}
                className="mt-2.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Jugar otro laberinto diferente</span>
              </button>
            </div>
          )}
        </div>

        {/* D-Pad Controls for mobile / touch */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between px-6">
          <div className="text-[11px] text-slate-400 font-medium">
            Usa teclado <strong className="text-slate-600">W, A, S, D</strong> o flechas
          </div>

          <div className="grid grid-cols-3 gap-1.5 w-36">
            <div></div>
            <button
              onClick={() => move(-1, 0)}
              className="p-2.5 bg-slate-100 active:bg-indigo-600 active:text-white rounded-xl flex items-center justify-center border border-slate-200 shadow-2xs hover:bg-slate-200 transition-colors"
              aria-label="Arriba"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div></div>
            <button
              onClick={() => move(0, -1)}
              className="p-2.5 bg-slate-100 active:bg-indigo-600 active:text-white rounded-xl flex items-center justify-center border border-slate-200 shadow-2xs hover:bg-slate-200 transition-colors"
              aria-label="Izquierda"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => move(1, 0)}
              className="p-2.5 bg-slate-100 active:bg-indigo-600 active:text-white rounded-xl flex items-center justify-center border border-slate-200 shadow-2xs hover:bg-slate-200 transition-colors"
              aria-label="Abajo"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => move(0, 1)}
              className="p-2.5 bg-slate-100 active:bg-indigo-600 active:text-white rounded-xl flex items-center justify-center border border-slate-200 shadow-2xs hover:bg-slate-200 transition-colors"
              aria-label="Derecha"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
