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
  ShieldAlert,
  Send,
  Lock
} from 'lucide-react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Dedicated public shared URL for clients and visitors
const CANONICAL_PUBLIC_URL = 'https://ais-pre-ikv4krgalns2dv6m2mht4j-367728644307.us-east1.run.app';

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Determine current effective public URL
  let effectivePublicUrl = CANONICAL_PUBLIC_URL;
  if (typeof window !== 'undefined') {
    const rawUrl = window.location.href.split('#')[0].split('?')[0];
    if (rawUrl.includes('ais-dev-')) {
      effectivePublicUrl = rawUrl.replace('ais-dev-', 'ais-pre-');
    } else if (rawUrl.startsWith('https://ais-pre-') || (rawUrl.includes('.run.app') && !rawUrl.includes('ais-dev-'))) {
      effectivePublicUrl = rawUrl;
    }
  }

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(effectivePublicUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = effectivePublicUrl;
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

  const whatsappMessage = encodeURIComponent(
    `¡Hola! Te comparto la aplicación Super Lectores para practicar lectura interactiva y ganar gemas:\n${effectivePublicUrl}`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  return (
    <div 
      id="share-app-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-indigo-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo_superlectores.png"
              alt="Super Lectores"
              className="w-10 h-10 rounded-full object-cover border-2 border-white/80 shadow-xs"
            />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">Enlace Público para Clientes</h3>
              <p className="text-xs text-indigo-100">Comparte Super Lectores sin requerir cuenta de Google</p>
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
          {/* Main Direct Link Box */}
          <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border-2 border-indigo-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>Enlace oficial para tus clientes</span>
              </label>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Público (Sin inicio en Google)
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                readOnly
                value={effectivePublicUrl}
                className="w-full bg-white px-3 py-2 text-xs font-mono text-indigo-900 font-bold rounded-xl border border-slate-300 focus:outline-hidden select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-xs ${
                  copied 
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Enlace'}</span>
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enviar por WhatsApp</span>
              </a>
              <a
                href={effectivePublicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Abrir en nueva pestaña</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Explanation: Why did it send them to Google? */}
          <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-4 flex items-start gap-3 text-amber-950">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1.5">
              <p className="font-extrabold text-amber-900 text-xs sm:text-sm">
                ¿Por qué a tus clientes les pedía iniciar sesión en Google?
              </p>
              <p className="text-amber-800 leading-relaxed">
                Si copiaste el enlace de desarrollo que empieza por <code className="font-mono bg-amber-200/70 px-1 py-0.5 rounded font-bold">ais-dev-...</code> o el de la barra superior de Google AI Studio, Google lo bloquea por seguridad porque es tu <strong>entorno privado de desarrollo</strong>.
              </p>
              <p className="text-amber-900 font-medium">
                Tus clientes deben entrar usando el enlace con <code className="font-mono bg-amber-200/70 px-1 py-0.5 rounded font-bold">ais-pre-...</code> (el que tienes arriba para copiar).
              </p>
            </div>
          </div>

          {/* Checklist to share without issues */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Instrucciones para compartir con tus clientes:</span>
            </h4>

            {/* Step 1 */}
            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Confirma el botón "Share" en Google AI Studio:</span>
                En la barra superior de la pantalla de Google AI Studio, haz clic en el botón <strong>Share</strong> (Compartir) y asegúrate de publicarlo o dejarlo visible.
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  Al enviar por WhatsApp a clientes:
                </span>
                Tus clientes pueden abrir el enlace directamente en su celular o tablet. Entrarán directo a la página de bienvenida y podrán registrarse gratis con su nombre para guardar su puntuación real y gemas.
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-violet-600" />
                  Verificación en pestaña de incógnito:
                </span>
                Abre una ventana de incógnito en tu navegador y pega el enlace. Comprobarás que entra de inmediato a <strong>Super Lectores</strong> sin solicitar inicio de sesión en Google.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Super Lectores • Acceso Público
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            Listo, entendido
          </button>
        </div>
      </div>
    </div>
  );
};
