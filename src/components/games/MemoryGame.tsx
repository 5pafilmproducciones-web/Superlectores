import React, { useState, useEffect } from 'react';
import { X, RotateCcw, CheckCircle2, Sparkles, Trophy, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemoryGameProps {
  onClose: () => void;
}

interface CardItem {
  id: number;
  pairId: string;
  name: string;
  emoji: string;
  color: string;
  flipped: boolean;
  matched: boolean;
}

const MEMORY_CHARACTERS = [
  { pairId: 'draco', name: 'Draco Dragón', emoji: '🐉', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  { pairId: 'tula', name: 'Tula Tortuga', emoji: '🐢', color: 'bg-teal-50 text-teal-700 border-teal-300' },
  { pairId: 'robot', name: 'Byte-7 Robot', emoji: '🤖', color: 'bg-indigo-50 text-indigo-700 border-indigo-300' },
  { pairId: 'bear', name: 'Barnaby Oso', emoji: '🐻', color: 'bg-amber-50 text-amber-700 border-amber-300' },
  { pairId: 'hummingbird', name: 'Pipo Colibrí', emoji: '🐦', color: 'bg-lime-50 text-lime-700 border-lime-300' },
  { pairId: 'dolphin', name: 'Coralito Delfín', emoji: '🐬', color: 'bg-sky-50 text-sky-700 border-sky-300' },
  { pairId: 'fox', name: 'Flix Zorro', emoji: '🦊', color: 'bg-orange-50 text-orange-700 border-orange-300' },
  { pairId: 'crystal', name: 'Gema Mágica', emoji: '💎', color: 'bg-purple-50 text-purple-700 border-purple-300' },
];

function generateCards(): CardItem[] {
  const deck: CardItem[] = [];
  let id = 1;
  MEMORY_CHARACTERS.forEach((char) => {
    // Card 1
    deck.push({
      id: id++,
      pairId: char.pairId,
      name: char.name,
      emoji: char.emoji,
      color: char.color,
      flipped: false,
      matched: false,
    });
    // Card 2
    deck.push({
      id: id++,
      pairId: char.pairId,
      name: char.name,
      emoji: char.emoji,
      color: char.color,
      flipped: false,
      matched: false,
    });
  });
  // Shuffle cards
  return deck.sort(() => Math.random() - 0.5);
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onClose }) => {
  const [cards, setCards] = useState<CardItem[]>(generateCards);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(90);

  // Timer countdown
  useEffect(() => {
    if (hasWon) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasWon]);

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    if (cards[index].flipped || cards[index].matched) return;
    if (flippedIndices.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setTurns((t) => t + 1);
      setIsLocked(true);
      const [firstIdx, secondIdx] = newFlipped;
      const card1 = newCards[firstIdx];
      const card2 = newCards[secondIdx];

      if (card1.pairId === card2.pairId) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, matched: true, flipped: true } : c
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);

          // Check win condition
          const allMatched = newCards.filter((c) => c.matched).length + 2 >= newCards.length;
          if (allMatched) {
            setHasWon(true);
            confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
          }
        }, 400);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, flipped: false } : c
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  const handleReset = () => {
    setCards(generateCards());
    setFlippedIndices([]);
    setTurns(0);
    setIsLocked(false);
    setHasWon(false);
    setTimeLeft(90);
  };

  const matchedPairsCount = cards.filter((c) => c.matched).length / 2;

  return (
    <div id="game-modal-memory" className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-fuchsia-100 bg-gradient-to-r from-fuchsia-50 via-rose-50 to-amber-50">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1 bg-white rounded-xl shadow-2xs">🃏</span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Memoria Galáctica de Cuentos</h3>
              <p className="text-xs text-slate-500">Encuentra las parejas de los personajes de los cuentos</p>
            </div>
          </div>
          <button
            id="btn-close-memory-game"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* HUD Info */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold">
          <div className="flex items-center gap-3">
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs text-slate-700">
              Parejas: <strong className="text-fuchsia-600">{matchedPairsCount}</strong> / 8
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs text-slate-700">
              Intentos: <strong className="text-indigo-600">{turns}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
              timeLeft < 20 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-200 text-slate-700'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-fuchsia-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Barajar</span>
            </button>
          </div>
        </div>

        {/* 4x4 Grid of Cards */}
        <div className="p-4 sm:p-6 bg-slate-100 flex flex-col items-center justify-center select-none">
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-sm">
            {cards.map((card, idx) => {
              const isRevealed = card.flipped || card.matched;
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  disabled={card.matched || isLocked}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all transform duration-300 font-bold ${
                    isRevealed
                      ? `${card.color} border-2 shadow-sm scale-100 rotate-0`
                      : 'bg-gradient-to-br from-fuchsia-600 to-indigo-700 text-white shadow-md hover:scale-105 hover:from-fuchsia-500 hover:to-indigo-600 border border-fuchsia-400/40'
                  }`}
                >
                  {isRevealed ? (
                    <div className="flex flex-col items-center animate-fade-in">
                      <span className="text-2xl sm:text-3xl">{card.emoji}</span>
                      <span className="text-[10px] font-bold leading-tight mt-1 line-clamp-1">
                        {card.name.split(' ')[0]}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl opacity-75">✨</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Victory Toast */}
          {hasWon && (
            <div className="mt-4 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl text-center w-full max-w-xs shadow-lg animate-bounce">
              <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>¡Memoria Increíble!</span>
              </div>
              <p className="text-xs text-emerald-700 mt-1 font-medium">
                Encontraste las 8 parejas en {turns} intentos y te sobraron {timeLeft} segundos.
              </p>
              <button
                onClick={handleReset}
                className="mt-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Jugar otra partida</span>
              </button>
            </div>
          )}

          {/* Time over message */}
          {!hasWon && timeLeft === 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-center w-full max-w-xs">
              <p className="text-xs font-bold text-amber-800">¡Tiempo agotado! Casi lo logras.</p>
              <button
                onClick={handleReset}
                className="mt-1.5 px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold"
              >
                Intentar de nuevo
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Entrena la memoria fotográfica</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
