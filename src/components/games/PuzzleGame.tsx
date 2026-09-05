import React, { useState, useEffect, useCallback } from 'react';
import { X, RotateCcw, CheckCircle2, Sparkles, Shuffle, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import dracoImg from '../../assets/images/story_draco_dragon_1788557666582.jpg';
import tulaImg from '../../assets/images/story_tula_skates_1788557679504.jpg';
import robotImg from '../../assets/images/story_robot_paint_1788557694396.jpg';
import treeImg from '../../assets/images/story_tree_crystal_1788557707803.jpg';
import coralImg from '../../assets/images/story_coral_reef_1788557722216.jpg';
import bearImg from '../../assets/images/story_bear_telescope_1788558006000.jpg';
import hummingbirdImg from '../../assets/images/story_hummingbird_1788558025828.jpg';
import dolphinImg from '../../assets/images/story_dolphin_1788558040584.jpg';
import compassImg from '../../assets/images/story_compass_1788558056747.jpg';
import foxImg from '../../assets/images/story_fox_clock_1788558073938.jpg';
import cloudCastleImg from '../../assets/images/story_cloud_castle_1788558093794.jpg';
import marsImg from '../../assets/images/story_mars_greenhouse_1788558110123.jpg';
import crystalCityImg from '../../assets/images/story_crystal_city_1788558125804.jpg';

interface PuzzleGameProps {
  onClose: () => void;
}

interface PuzzleTheme {
  id: string;
  title: string;
  emoji: string;
  image: string;
}

const PUZZLE_THEMES: PuzzleTheme[] = [
  { id: 'draco', title: 'Draco el Dragón', emoji: '🐉', image: dracoImg },
  { id: 'tula', title: 'Tula Patinadora', emoji: '🐢', image: tulaImg },
  { id: 'robot', title: 'Byte-7 Pintor', emoji: '🤖', image: robotImg },
  { id: 'tree', title: 'Árbol de Cristal', emoji: '🔮', image: treeImg },
  { id: 'coral', title: 'Templo de Coral', emoji: '🌊', image: coralImg },
  { id: 'bear', title: 'Barnaby Astrónomo', emoji: '🐻', image: bearImg },
  { id: 'hummingbird', title: 'Pipo Colibrí', emoji: '🐦', image: hummingbirdImg },
  { id: 'dolphin', title: 'Coralito Flautista', emoji: '🐬', image: dolphinImg },
  { id: 'compass', title: 'La Brújula Dorada', emoji: '🧭', image: compassImg },
  { id: 'fox', title: 'Flix el Zorro', emoji: '🦊', image: foxImg },
  { id: 'cloud', title: 'Castillo en Nubes', emoji: '🏰', image: cloudCastleImg },
  { id: 'mars', title: 'Invernadero Marciano', emoji: '🚀', image: marsImg },
  { id: 'crystal', title: 'Ciudad de Cristales', emoji: '💎', image: crystalCityImg },
];

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ onClose }) => {
  // Pick a random theme each time the game is opened
  const [selectedTheme, setSelectedTheme] = useState<PuzzleTheme>(() => {
    const randomIndex = Math.floor(Math.random() * PUZZLE_THEMES.length);
    return PUZZLE_THEMES[randomIndex];
  });

  const [tiles, setTiles] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]); // 0 is empty slot
  const [moves, setMoves] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Solvable random shuffle
  const shuffleTiles = useCallback(() => {
    let current = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    // Perform random valid moves from solved state to guarantee solvability
    for (let i = 0; i < 70; i++) {
      const emptyIndex = current.indexOf(0);
      const row = Math.floor(emptyIndex / 3);
      const col = emptyIndex % 3;
      const validNeighbors: number[] = [];
      if (row > 0) validNeighbors.push(emptyIndex - 3);
      if (row < 2) validNeighbors.push(emptyIndex + 3);
      if (col > 0) validNeighbors.push(emptyIndex - 1);
      if (col < 2) validNeighbors.push(emptyIndex + 1);

      const randomNeighbor = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
      const temp = current[emptyIndex];
      current[emptyIndex] = current[randomNeighbor];
      current[randomNeighbor] = temp;
    }
    setTiles(current);
    setMoves(0);
    setIsSolved(false);
  }, []);

  // Shuffle when theme changes or on initial mount
  useEffect(() => {
    shuffleTiles();
  }, [selectedTheme, shuffleTiles]);

  // Switch to another random theme and shuffle
  const handleRandomNewTheme = () => {
    const remaining = PUZZLE_THEMES.filter((t) => t.id !== selectedTheme.id);
    const nextTheme = remaining[Math.floor(Math.random() * remaining.length)];
    setSelectedTheme(nextTheme);
  };

  const handleTileClick = (index: number) => {
    if (isSolved) return;
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    // Check if adjacent
    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      newTiles[emptyIndex] = tiles[index];
      newTiles[index] = 0;
      setTiles(newTiles);
      setMoves((m) => m + 1);

      // Check win condition [1, 2, 3, 4, 5, 6, 7, 8, 0]
      const solved = newTiles.every((val, idx) => (idx === 8 ? val === 0 : val === idx + 1));
      if (solved) {
        setIsSolved(true);
        confetti({ particleCount: 85, spread: 75, origin: { y: 0.6 } });
      }
    }
  };

  return (
    <div id="game-modal-puzzle" className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-indigo-100 bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1 bg-white rounded-xl shadow-2xs">🧩</span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                Rompecabezas Ilustrado
              </h3>
              <p className="text-xs text-slate-500">
                Ilustración diferente cada partida • Ordena del 1 al 8
              </p>
            </div>
          </div>
          <button
            id="btn-close-puzzle-game"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme bar & Random theme button */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl">{selectedTheme.emoji}</span>
            <span className="text-xs font-bold text-slate-800 truncate">{selectedTheme.title}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                showPreview ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Ver imagen completa"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Guía</span>
            </button>

            <button
              id="btn-random-puzzle-theme"
              onClick={handleRandomNewTheme}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1 transition-colors"
              title="Cargar otra ilustración de cuento aleatoria"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Cambiar Cuento</span>
            </button>
          </div>
        </div>

        {/* HUD Info */}
        <div className="flex items-center justify-between px-6 py-2 bg-white text-xs font-medium text-slate-600 border-b border-slate-100">
          <span className="font-semibold text-slate-700">
            Movimientos: <strong className="text-indigo-600 font-bold">{moves}</strong>
          </span>
          <button
            id="btn-shuffle-puzzle"
            onClick={shuffleTiles}
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revolver</span>
          </button>
        </div>

        {/* Image Guide Preview Modal Popover */}
        {showPreview && (
          <div className="p-3 bg-indigo-900/90 text-white flex flex-col items-center justify-center animate-fade-in">
            <span className="text-[11px] font-semibold text-indigo-200 mb-1.5">Meta: Reconstruir esta escena</span>
            <img
              src={selectedTheme.image}
              alt={selectedTheme.title}
              className="w-48 h-36 object-cover rounded-xl border-2 border-white shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Puzzle Board 3x3 */}
        <div className="p-5 sm:p-6 bg-slate-100 flex flex-col items-center justify-center select-none">
          <div className="w-72 h-72 sm:w-80 sm:h-80 bg-slate-300 p-2.5 rounded-2xl grid grid-cols-3 gap-2 shadow-inner border border-slate-300">
            {tiles.map((tile, idx) => {
              const isBlank = tile === 0;

              // Calculate background slice coordinates for tile 1 to 8
              // Solved order:
              // 1: (0,0), 2: (1,0), 3: (2,0)
              // 4: (0,1), 5: (1,1), 6: (2,1)
              // 7: (0,2), 8: (1,2), 0: (2,2)
              const originalIdx = tile > 0 ? tile - 1 : 8;
              const origCol = originalIdx % 3;
              const origRow = Math.floor(originalIdx / 3);

              return (
                <div
                  key={idx}
                  onClick={() => handleTileClick(idx)}
                  style={
                    !isBlank
                      ? {
                          backgroundImage: `url(${selectedTheme.image})`,
                          backgroundPosition: `${origCol * 50}% ${origRow * 50}%`,
                          backgroundSize: '300% 300%',
                        }
                      : undefined
                  }
                  className={`relative flex flex-col items-center justify-between rounded-xl font-black transition-all cursor-pointer overflow-hidden ${
                    isBlank
                      ? 'bg-slate-800/10 border-2 border-dashed border-slate-400/40 pointer-events-none'
                      : 'border-2 border-white/80 shadow-md hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {!isBlank && (
                    <>
                      {/* Top number pill for orientation */}
                      <div className="w-full flex justify-start p-1.5">
                        <span className="bg-slate-950/75 backdrop-blur-xs text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                          {tile}
                        </span>
                      </div>
                      <div className="w-full flex justify-end p-1">
                        <span className="text-xs drop-shadow-md">{selectedTheme.emoji}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Victory banner */}
          {isSolved && (
            <div className="mt-4 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl text-center w-full max-w-xs shadow-lg animate-bounce">
              <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>¡Ilustración Armada con Éxito!</span>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                Completaste a <strong>{selectedTheme.title}</strong> en {moves} movimientos.
              </p>
              <button
                onClick={handleRandomNewTheme}
                className="mt-2 px-3.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Armar otro cuento diferente</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <button
            id="btn-quit-puzzle"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Cerrar
          </button>
          <button
            id="btn-play-again-puzzle"
            onClick={handleRandomNewTheme}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Siguiente Cuento Aleatorio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
