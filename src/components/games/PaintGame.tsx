import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Trash2, Download, Palette, Sparkles, Undo } from 'lucide-react';

interface PaintGameProps {
  onClose: () => void;
}

const COLORS = [
  '#4F46E5', // Indigo
  '#2563EB', // Blue
  '#0284C7', // Sky
  '#059669', // Green
  '#EAB308', // Yellow
  '#EA580C', // Orange
  '#E11D48', // Red
  '#9333EA', // Purple
  '#EC4899', // Pink
  '#1E293B', // Slate Dark
];

const STICKERS = ['⭐', '💎', '🐉', '🚗', '🌸', '👑', '🚀', '🐢'];

export const PaintGame: React.FC<PaintGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState<string>(COLORS[0]);
  const [lineWidth, setLineWidth] = useState<number>(6);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (selectedSticker) {
      // Stamp sticker
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedSticker, x, y);
      return;
    }

    isDrawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || selectedSticker) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = isEraser ? '#FFFFFF' : color;
    ctx.lineWidth = isEraser ? lineWidth * 2.5 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'mi-dibujo-lecturakids.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div id="game-modal-paint" className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-emerald-50/70">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <div>
              <h3 className="font-bold text-base text-slate-900">Taller de Pintura y Dibujo</h3>
              <p className="text-xs text-slate-500">Pinta tu cuento, usa sellos mágicos y guarda tu arte</p>
            </div>
          </div>
          <button
            id="btn-close-paint-game"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Colors */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setIsEraser(false);
                  setSelectedSticker(null);
                }}
                className={`w-6 h-6 rounded-full transition-all ${
                  !isEraser && !selectedSticker && color === c
                    ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
                title={`Color ${c}`}
              />
            ))}
            {/* Eraser */}
            <button
              onClick={() => {
                setIsEraser(true);
                setSelectedSticker(null);
              }}
              className={`p-1.5 rounded-lg border flex items-center gap-1 font-medium transition-colors ${
                isEraser
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Borrador"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Goma</span>
            </button>
          </div>

          {/* Stroke width */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px] font-semibold">Grosor:</span>
            {[3, 6, 12].map((size) => (
              <button
                key={size}
                onClick={() => setLineWidth(size)}
                className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                  lineWidth === size
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {size}px
              </button>
            ))}
          </div>
        </div>

        {/* Stickers bar */}
        <div className="px-3 py-2 bg-indigo-50/50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-indigo-800 font-semibold flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            Sellos:
          </span>
          {STICKERS.map((stk) => (
            <button
              key={stk}
              onClick={() => {
                setSelectedSticker(selectedSticker === stk ? null : stk);
                setIsEraser(false);
              }}
              className={`text-lg p-1 rounded-lg transition-transform ${
                selectedSticker === stk ? 'bg-white shadow-xs scale-125 ring-2 ring-indigo-400' : 'hover:scale-110'
              }`}
              title={`Sello ${stk}`}
            >
              {stk}
            </button>
          ))}
          {selectedSticker && (
            <span className="text-[11px] text-indigo-600 font-medium ml-2">
              Haz clic en el lienzo para estampar
            </span>
          )}
        </div>

        {/* Canvas Area */}
        <div className="p-4 bg-slate-100 flex items-center justify-center overflow-auto">
          <canvas
            ref={canvasRef}
            width={580}
            height={360}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="bg-white rounded-xl shadow-md cursor-crosshair touch-none border border-slate-200 max-w-full"
          />
        </div>

        {/* Footer actions */}
        <div className="p-3.5 bg-white border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar Todo</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={downloadDrawing}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Guardar Dibujo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
