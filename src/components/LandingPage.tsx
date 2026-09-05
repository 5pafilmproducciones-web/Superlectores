import React, { useState } from 'react';
import { 
  BookOpen, 
  Mic, 
  Sparkles, 
  Gem, 
  Award, 
  Gamepad2, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  Star, 
  TrendingUp, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  Play, 
  Volume2, 
  Users, 
  Heart,
  ChevronRight,
  Smile,
  GraduationCap,
  FileText
} from 'lucide-react';
import { AuthMode } from '../types';

interface LandingPageProps {
  onNavigateToAuth: (mode: AuthMode) => void;
  onEnterApp: () => void;
  isAuthenticated?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToAuth,
  onEnterApp,
  isAuthenticated = false,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeSuccessModal, setStripeSuccessModal] = useState(false);

  const handleStartProCheckout = () => {
    setStripeLoading(true);
    // Simulación del flujo de sesión de pago con Stripe
    setTimeout(() => {
      setStripeLoading(false);
      setStripeSuccessModal(true);
    }, 1200);
  };

  const proPrice = billingCycle === 'monthly' ? 9.99 : 7.99;
  const proBilledText = billingCycle === 'monthly' 
    ? 'facturado mensualmente (cancela cuando quieras)' 
    : 'facturado anualmente ($95.88/año - ahorras 20%)';

  return (
    <div id="landing-page-root" className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans antialiased overflow-x-hidden w-full max-w-full">
      
      {/* ========================================================================= */}
      {/* NAVBAR SUPERIOR                                                           */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80 transition-all w-full max-w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-violet-600 to-indigo-600 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1 sm:gap-1.5">
                Lectura<span className="text-amber-400">Kids</span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/25 hidden xs:flex items-center gap-0.5">
                  <Gem className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> EdTech
                </span>
              </span>
            </div>
          </div>

          {/* Enlaces de navegación (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-amber-400 transition-colors">
              Cómo Funciona
            </a>
            <a href="#mockup" className="hover:text-amber-400 transition-colors">
              App y Cuentos
            </a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">
              Planes Familiares
            </a>
            <a href="#pedagogy" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-violet-400" />
              Enfoque Pedagógico
            </a>
          </nav>

          {/* Botones de acción del Header */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {isAuthenticated ? (
              <button
                id="landing-btn-enter-app"
                type="button"
                onClick={onEnterApp}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-extrabold shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Mi Panel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  id="landing-btn-nav-login"
                  type="button"
                  onClick={() => onNavigateToAuth('login')}
                  className="hidden sm:inline-flex px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Ingresar
                </button>
                <button
                  id="landing-btn-nav-register"
                  type="button"
                  onClick={() => onNavigateToAuth('register')}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-600/25 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Comenzar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (SECCIÓN PRINCIPAL)                                       */}
      {/* ========================================================================= */}
      <section className="relative pt-10 pb-16 sm:pt-24 sm:pb-32 overflow-hidden w-full max-w-full">
        {/* Luces de ambiente sutiles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[800px] h-[250px] sm:h-[350px] bg-gradient-to-tr from-violet-600/25 via-amber-500/15 to-indigo-600/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge superior de valor */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] sm:text-xs font-semibold text-slate-300 mb-6 sm:mb-8 shadow-inner max-w-full">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="truncate">Lectura guiada por voz para 6 a 12 años</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-amber-400 font-bold hidden sm:flex items-center gap-1 shrink-0">
              Gemas y Minijuegos <Sparkles className="w-3 h-3" />
            </span>
          </div>

          {/* Headline de impacto */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.12] sm:leading-[1.08] break-words">
            Haz que tus hijos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">amen leer</span> y comprendan cada palabra.
          </h1>

          {/* Subtítulo descriptivo corto */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed px-2">
            Una experiencia interactiva con reconocimiento de voz, cuentos por niveles, trivias de comprensión y un sistema de gemas que desbloquea divertidos minijuegos.
          </p>

          {/* Botones de Llamado a la Acción (CTA) */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto w-full">
            <button
              id="landing-hero-cta-start"
              type="button"
              onClick={() => onNavigateToAuth('register')}
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] text-slate-950 text-sm sm:text-base font-black shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Comenzar Gratis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onEnterApp}
              className="w-full sm:w-auto px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Explorar la Plataforma</span>
            </button>
          </div>

          {/* Trust badges para padres y educadores */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-slate-400 font-medium px-2">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              100% libre de anuncios comerciales
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Adaptado a 3 niveles (7, 8-9 y 10+ años)
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Reportes de fluidez para padres
            </span>
          </div>

          {/* ========================================================================= */}
          {/* MOCKUP VISUAL DE LA APP (INTERFAZ DE LECTURA REAL)                        */}
          {/* ========================================================================= */}
          <div id="mockup" className="mt-12 sm:mt-20 relative max-w-5xl mx-auto w-full">
            <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/20 via-violet-500/15 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-75 -z-10" />

            <div className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl overflow-hidden text-left w-full">
              
              {/* Fake Window Header */}
              <div className="px-3 sm:px-6 py-2.5 sm:py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shrink-0" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shrink-0" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shrink-0" />
                  <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs font-mono text-slate-400 font-medium truncate max-w-[130px] sm:max-w-none">
                    app.lecturakids.com/cuento
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-amber-400/20 text-[10px] sm:text-xs">
                    <Gem className="w-3 h-3" /> +25 Gemas
                  </span>
                </div>
              </div>

              {/* Panel del cuento simulado */}
              <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
                
                {/* Header del Cuento */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                      🌳
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded-md border border-violet-500/20">
                          Nivel 1 (7 años)
                        </span>
                        <span className="text-[10px] sm:text-xs text-slate-400">Naturaleza</span>
                      </div>
                      <h3 className="text-base sm:text-xl font-black text-white mt-0.5 leading-snug">
                        El Árbol Sabio y el Pequeño Gorrión
                      </h3>
                    </div>
                  </div>

                  {/* Micrófono y métrica de lectura en vivo */}
                  <div className="flex items-center justify-between sm:justify-start gap-3 bg-slate-950/80 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-slate-800 w-full sm:w-auto">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center animate-pulse shrink-0">
                        <Mic className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Reconocimiento de Voz</p>
                        <p className="text-xs sm:text-sm font-black text-emerald-400">94% Precisión • 88 PPM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Texto del cuento con resaltado de fluidez */}
                <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950/70 border border-slate-800/80 leading-relaxed text-xs sm:text-base text-slate-300 space-y-2 sm:space-y-3">
                  <p>
                    <span className="bg-emerald-500/20 text-emerald-300 font-medium px-1 rounded">En lo alto de la colina verde</span> vivía un roble muy viejo que podía hablar con el viento. Una mañana fría, un pequeño gorrión llamado Pipo buscaba refugio de la lluvia...
                  </p>
                  <p className="text-slate-400 text-[11px] sm:text-sm italic">
                    «Acércate, pequeño viajero», susurró el árbol con voz cálida. «Bajo mis hojas jamás te mojarás.»
                  </p>
                </div>

                {/* Grid de Recompensas y Trivia Interactiva */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
                  <div className="p-3 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold shrink-0">
                      <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-slate-400">Recompensa</p>
                      <p className="text-sm sm:text-base font-extrabold text-white">25 Gemas Mágicas</p>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold shrink-0">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-slate-400">Comprensión</p>
                      <p className="text-sm sm:text-base font-extrabold text-white">3 Preguntas Clave</p>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                      <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-slate-400">Desbloquea</p>
                      <p className="text-sm sm:text-base font-extrabold text-emerald-400">Carrera de Carros</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SECCIÓN DE CARACTERÍSTICAS (LOS 3 PILARES DEL SISTEMA)                  */}
      {/* ========================================================================= */}
      <section id="features" className="py-14 sm:py-28 bg-slate-900/50 border-t border-b border-slate-800/80 relative w-full max-w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 sm:mb-3">
              Método Comprobado de Motivación Lectora
            </h2>
            <p className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Los 3 Pilares del Éxito en LecturaKids
            </p>
            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-400 font-normal px-2">
              Combinamos ciencia pedagógica, reconocimiento de voz y gamificación sana para que la lectura deje de ser una obligación y se vuelva su actividad favorita.
            </p>
          </div>

          {/* Grid de 3 Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            
            {/* Pilar 1: Lectura Guiada por Micrófono e IA */}
            <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all group relative overflow-hidden">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shrink-0">
                <Mic className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
                Lectura en Voz Alta con Reconocimiento
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 sm:mb-6">
                El niño lee al micrófono mientras la aplicación evalúa fluidez, pronunciación y ritmo. Recibe retroalimentación positiva e inmediata sin frustración ni juicios.
              </p>
              <ul className="space-y-2 sm:space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  Mide precisión de voz y palabras por minuto (PPM)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  Cuentos graduados para 7, 8-9 y 10+ años
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  Paciencia infinita adaptada a cada ritmo lector
                </li>
              </ul>
            </div>

            {/* Pilar 2: Comprensión Lectora y Retos Creativos */}
            <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 hover:border-violet-500/50 transition-all group relative overflow-hidden">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shrink-0">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
                Comprensión Lectora y Creatividad
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 sm:mb-6">
                No basta con pronunciar palabras; el niño debe comprender. Cada historia incluye preguntas interactivas y desafíos de escritura para inventar finales alternativos.
              </p>
              <ul className="space-y-2 sm:space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  Trivias interactivas Verdadero / Falso con explicación
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  Retos de escritura creativa guiada por palabras clave
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  Desarrollo de pensamiento crítico y vocabulario
                </li>
              </ul>
            </div>

            {/* Pilar 3: Gamificación con Gemas y Minijuegos */}
            <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all group relative overflow-hidden">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shrink-0">
                <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
                Gemas Mágicas y Minijuegos
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4 sm:mb-6">
                Cada lectura exitosa otorga Gemas Mágicas. Las gemas permiten desbloquear minijuegos educativos como Carrera de Carros o Cruzar el Río, premiando el esfuerzo real.
              </p>
              <ul className="space-y-2 sm:space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Cero compras in-app engañosas: solo se gana leyendo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Minijuegos interactivos de agilidad mental y reflejos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Mascota compañera interactiva (Leo el León)
                </li>
              </ul>
            </div>

          </div>

          {/* Social Proof pedagógico */}
          <div id="pedagogy" className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-4xl font-black text-amber-400">+300%</p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase font-semibold">Minutos de lectura semanal</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-black text-white">92%</p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase font-semibold">Mejora en comprensión</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-black text-violet-400">100%</p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase font-semibold">Ambiente seguro y educativo</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-black text-emerald-400">PDF</p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase font-semibold">Reportes para padres</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECCIÓN DE PRECIOS (PRICING TABLE COMPARATIVA)                         */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-14 sm:py-32 relative w-full max-w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 sm:mb-3">
              Planes Transparentes para Familias
            </h2>
            <p className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Invierte en el futuro lector de tus hijos
            </p>
            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-400 px-2">
              Comienza 100% gratis hoy mismo o desbloquea toda la biblioteca interactiva y reportes avanzados con el Plan Familia PRO.
            </p>

            {/* Selector de Ciclo de Facturación */}
            <div className="mt-6 sm:mt-8 inline-flex items-center gap-2 p-1 sm:p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mensual
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Anual</span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold">
                  20% OFF
                </span>
              </button>
            </div>
          </div>

          {/* Tabla de Planes Comparativos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* PLAN GRATIS */}
            <div className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Plan Básico Gratis
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                    Para Explorar
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mb-5 sm:mb-6">
                  Perfecto para probar la experiencia y motivar los primeros hábitos de lectura en casa.
                </p>

                <div className="mb-5 sm:mb-6">
                  <span className="text-3xl sm:text-5xl font-black text-white">$0</span>
                  <span className="text-xs sm:text-sm text-slate-400 ml-2">/ para siempre</span>
                </div>

                <div className="border-t border-slate-800 pt-5 sm:pt-6 space-y-3 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Hasta <strong>5 cuentos interactivos</strong> por nivel</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Reconocimiento de voz y fluidez básico</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Trivias de comprensión y gemas</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Acceso al minijuego de Carrera de Carros</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <span className="w-4 h-4 flex items-center justify-center text-slate-600 font-bold shrink-0">✕</span>
                    <span>Sin reportes avanzados en PDF para padres</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-5 border-t border-slate-850">
                <button
                  id="btn-pricing-free-plan"
                  type="button"
                  onClick={() => onNavigateToAuth('register')}
                  className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Crear Cuenta Gratis</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* PLAN PRO FAMILIAR (EL MÁS POPULAR) */}
            <div className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 flex flex-col justify-between relative overflow-hidden">
              
              {/* Badge Más Popular */}
              <div className="absolute top-0 right-4 sm:right-8">
                <span className="px-3 py-1 rounded-b-xl text-[10px] sm:text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> El más popular
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4 pt-3 sm:pt-0">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    Familia PRO
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mb-5 sm:mb-6">
                  Acceso completo sin límites a toda la biblioteca de cuentos, análisis con IA y todos los minijuegos.
                </p>

                <div className="mb-1 sm:mb-2">
                  <span className="text-3xl sm:text-5xl font-black text-white">${proPrice}</span>
                  <span className="text-xs sm:text-sm text-slate-400 ml-2">USD / mes</span>
                </div>
                <p className="text-[11px] sm:text-xs text-amber-300 font-medium mb-5 sm:mb-6">
                  {proBilledText}
                </p>

                <div className="border-t border-amber-900/40 pt-5 sm:pt-6 space-y-3 text-xs sm:text-sm text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Biblioteca ilimitada de cuentos</strong> por edades</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Análisis de voz con IA ilimitado</strong> en tiempo real</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Reportes de progreso en PDF</strong> descargables</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Desbloqueo de <strong>todos los minijuegos</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Hasta <strong>3 perfiles de niños</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Suscripción segura con <strong>Stripe</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-5 border-t border-amber-900/40">
                <button
                  id="btn-pricing-pro-stripe"
                  type="button"
                  onClick={handleStartProCheckout}
                  disabled={stripeLoading}
                  className="w-full py-3.5 sm:py-4 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 active:scale-[0.99] text-slate-950 font-black text-xs sm:text-base shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {stripeLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Iniciando Checkout Seguro...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Comenzar Plan Familia PRO</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] sm:text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" /> Pago 100% cifrado SSL respaldado por Stripe
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FOOTER (PIE DE PÁGINA)                                                 */}
      {/* ========================================================================= */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-10 sm:py-16 w-full max-w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-10">
            
            {/* Columna 1: Brand */}
            <div className="sm:col-span-2 md:col-span-1 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight">LecturaKids</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Plataforma EdTech interactiva para el fomento de la comprensión lectora, lectura en voz alta y gamificación positiva para niños.
              </p>
            </div>

            {/* Columna 2: Cuentos y Niveles */}
            <div>
              <p className="font-bold text-white mb-2.5 uppercase tracking-wider text-[10px] sm:text-[11px]">
                Niveles de Lectura
              </p>
              <ul className="space-y-1.5 sm:space-y-2 text-xs">
                <li><span className="hover:text-amber-400 cursor-pointer">Nivel 1 (6-7 años: Primeras Letras)</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer">Nivel 2 (8-9 años: Aventuras)</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer">Nivel 3 (10-12 años: Misterios)</span></li>
                <li><button onClick={onEnterApp} className="hover:text-amber-400 text-left cursor-pointer">Explorar Cuentos</button></li>
              </ul>
            </div>

            {/* Columna 3: Tecnología y Seguridad */}
            <div>
              <p className="font-bold text-white mb-2.5 uppercase tracking-wider text-[10px] sm:text-[11px]">
                Seguridad & Familia
              </p>
              <ul className="space-y-1.5 sm:space-y-2 text-xs">
                <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Cero Anuncios</li>
                <li className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" /> Contenido Curado</li>
                <li className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Stripe Billing</li>
                <li><span className="text-slate-400">Protección COPPA</span></li>
              </ul>
            </div>

            {/* Columna 4: Legal & Contacto */}
            <div>
              <p className="font-bold text-white mb-2.5 uppercase tracking-wider text-[10px] sm:text-[11px]">
                Institucional
              </p>
              <ul className="space-y-1.5 sm:space-y-2 text-xs">
                <li><span className="hover:text-white cursor-pointer transition-colors">Términos de Servicio</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Política de Privacidad</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Planes Colegios</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Soporte Familias</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-6 sm:pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-[11px] text-slate-400 text-center sm:text-left">
            <p>© 2026 LecturaKids. Todos los derechos reservados.</p>
            <div className="flex items-center gap-3">
              <span>Diseñado para familias lectoras</span>
              <span>•</span>
              <button 
                type="button"
                onClick={onEnterApp}
                className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
              >
                Abrir Aplicación
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL DE INTEGRACIÓN STRIPE CHECKOUT                                      */}
      {/* ========================================================================= */}
      {stripeSuccessModal && (
        <div 
          id="stripe-checkout-modal"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center relative shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
              <CreditCard className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight">
              Suscripción Familia PRO
            </h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Sesión de pago configurada para el <strong className="text-white">Plan Familia PRO (${proPrice} USD/mes)</strong>.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Plan familiar:</span>
                <span className="font-bold text-white">LecturaKids PRO (3 Niños)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ciclo:</span>
                <span className="font-bold text-amber-400 capitalize">{billingCycle === 'monthly' ? 'Mensual' : 'Anual (20% OFF)'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Pasarela:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Stripe Checkout Listo
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setStripeSuccessModal(false);
                  onNavigateToAuth('register');
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-md transition-colors cursor-pointer"
              >
                Continuar con Registro y Checkout
              </button>
              <button
                type="button"
                onClick={() => setStripeSuccessModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
