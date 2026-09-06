import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Info, 
  Smartphone, 
  Globe, 
  ShieldAlert 
} from 'lucide-react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Determine current effective public URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0].split('?')[0] : '';
  const isDevUrl = currentUrl.includes('ais-dev-');
  const suggestedPublicUrl = isDevUrl 
    ? currentUrl.replace('ais-dev-', 'ais-pre-')
    : currentUrl;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(suggestedPublicUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = suggestedPublicUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div 
      id="share-app-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo_superlectores.png"
              alt="Super Lectores"
              className="w-10 h-10 rounded-full object-cover border border-amber-400/50 shadow-xs"
            />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">Compartir Super Lectores</h3>
              <p className="text-xs text-indigo-100">Guía para que tus amigos o alumnos abran la app</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-indigo-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {/* Link Box */}
          <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Enlace directo para compartir
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={suggestedPublicUrl}
                className="w-full bg-white px-3 py-2 text-xs font-mono text-indigo-900 rounded-xl border border-slate-300 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-xs ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Warning if user was using ais-dev link */}
          {isDevUrl && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 text-amber-900">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold">¿Por qué no abría el enlace?</p>
                <p>
                  Estabas copiando el enlace interno de desarrollo (<code className="font-mono text-[11px] bg-amber-100 px-1 py-0.5 rounded">ais-dev-...</code>), el cual es privado y solo tú puedes ver.
                  El enlace corregido arriba es el de visualización pública (<code className="font-mono text-[11px] bg-amber-100 px-1 py-0.5 rounded">ais-pre-...</code>).
                </p>
              </div>
            </div>
          )}

          {/* Step by Step Tips */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>3 Pasos para compartir sin fallos:</span>
            </h4>

            {/* Step 1 */}
            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Usa el botón "Share" en Google AI Studio:</span>
                Arriba a la derecha en la barra de Google AI Studio Build hay un botón <strong>Share / Compartir</strong>. Pulsa allí y asegúrate de que el acceso esté seleccionado en <strong>"Anyone with the link" (Cualquiera con el enlace)</strong>.
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  Si lo abren desde WhatsApp o Instagram:
                </span>
                El navegador integrado de WhatsApp o Instagram a veces bloquea las cookies de Google. Si a la otra persona se le queda en blanco o en una pantalla de cookies, dile que toque los <strong>tres puntos ⋮</strong> arriba a la derecha y elija <strong>"Abrir en Chrome"</strong> o <strong>"Abrir en Safari"</strong>.
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  Probar en ventana de incógnito:
                </span>
                Para verificar que cualquiera puede abrir tu aplicación, abre una ventana de incógnito en tu navegador y pega el enlace. ¡Cargará la aplicación completa con todos los 13 cuentos interactivos!
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <a
            href={suggestedPublicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
          >
            <span>Probar enlace en nueva pestaña</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
