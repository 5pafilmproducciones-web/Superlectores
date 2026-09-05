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
    <div id="landing-page-root" className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans antialiased overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* NAVBAR SUPERIOR                                                           */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-violet-600 to-indigo-600 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Lectura<span className="text-amber-400">Kids</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/25 flex items-center gap-1">
                  <Gem className="w-2.5 h-2.5" /> EdTech
                </span>
              </span>
            </div>
          </div>

          {/* Enlaces de navegación */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
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
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                id="landing-btn-enter-app"
                type="button"
                onClick={onEnterApp}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-extrabold shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Entrar a Mi Panel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  id="landing-btn-nav-login"
                  type="button"
                  onClick={() => onNavigateToAuth('login')}
                  className="hidden sm:inline-flex px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Iniciar Sesión
                </button>
                <button
                  id="landing-btn-nav-register"
                  type="button"
                  onClick={() => onNavigateToAuth('register')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Comenzar Gratis</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (SECCIÓN PRINCIPAL)                                       */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        {/* Luces de ambiente sutiles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-tr from-violet-600/25 via-amber-500/15 to-indigo-600/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge superior de valor */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-300 mb-8 shadow-inner hover:border-amber-400/40 transition-colors">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-slate-300">Lectura guiada por voz para niños de 6 a 12 años</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              Gemas y Minijuegos <Sparkles className="w-3 h-3" />
            </span>
          </div>

          {/* Headline de impacto en 5 segundos */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
            Haz que tus hijos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">amen leer</span> y comprendan cada palabra.
          </h1>

          {/* Subtítulo descriptivo corto */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Una experiencia interactiva con reconocimiento de voz, cuentos por niveles, trivias de comprensión y un sistema de gemas que desbloquea divertidos minijuegos.
          </p>

          {/* Botones de Llamado a la Acción (CTA) */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="landing-hero-cta-start"
              type="button"
              onClick={() => onNavigateToAuth('register')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] text-slate-950 text-base font-extrabold shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <span>Comenzar Gratis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onEnterApp}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-base font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Explorar la Plataforma</span>
            </button>
          </div>

          {/* Trust badges para padres y educadores */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              100% libre de anuncios comerciales
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              Adaptado a 3 niveles de aprendizaje (7, 8-9 y 10+ años)
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              Reportes de fluidez y precisión para padres
            </span>
          </div>

          {/* ========================================================================= */}
          {/* MOCKUP VISUAL DE LA APP (INTERFAZ DE LECTURA REAL)                        */}
          {/* ========================================================================= */}
          <div id="mockup" className="mt-16 sm:mt-20 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/20 via-violet-500/15 to-transparent rounded-3xl blur-xl opacity-75 -z-10" />

            <div className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl overflow-hidden text-left">
              
              {/* Fake Window Header */}
              <div className="px-4 sm:px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400 font-medium">
                    app.lecturakids.com/cuento/el-arbol-sabio
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                    <Gem className="w-3.5 h-3.5" /> +25 Gemas al completar
                  </span>
                </div>
              </div>

              {/* Panel del cuento simulado */}
              <div className="p-5 sm:p-8 space-y-6">
                
                {/* Header del Cuento */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-2xl">
                      🌳
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20">
                          Nivel 1 (7 años)
                        </span>
                        <span className="text-xs text-slate-400">Naturaleza y Amistad</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                        El Árbol Sabio y el Pequeño Gorrión
                      </h3>
                    </div>
                  </div>

                  {/* Micrófono y métrica de lectura en vivo */}
                  <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center animate-pulse">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-semibold uppercase">Reconocimiento de Voz</p>
                      <p className="text-sm font-black text-emerald-400">94% Precisión • 88 PPM</p>
                    </div>
                  </div>
                </div>

                {/* Texto del cuento con resaltado de fluidez */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 leading-relaxed text-sm sm:text-base text-slate-300 space-y-3">
                  <p>
                    <span className="bg-emerald-500/20 text-emerald-300 font-medium px-1 rounded">En lo alto de la colina verde</span> vivía un roble muy viejo que podía hablar con el viento. Una mañana fría, un pequeño gorrión llamado Pipo buscaba refugio de la lluvia...
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm italic">
                    «Acércate, pequeño viajero», susurró el árbol con voz cálida. «Bajo mis hojas jamás te mojarás.»
                  </p>
                </div>

                {/* Grid de Recompensas y Trivia Interactiva */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                      <Gem className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Recompensa</p>
                      <p className="text-base font-extrabold text-white">25 Gemas Mágicas</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Comprensión</p>
                      <p className="text-base font-extrabold text-white">3 Preguntas Clave</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Desbloquea</p>
                      <p className="text-base font-extrabold text-emerald-400">Carrera de Carros</p>
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
      <section id="features" className="py-20 sm:py-28 bg-slate-900/50 border-t border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
              Método Comprobado de Motivación Lectora
            </h2>
            <p className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Los 3 Pilares del Éxito en LecturaKids
            </p>
            <p className="mt-4 text-base sm:text-lg text-slate-400 font-normal">
              Combinamos ciencia pedagógica, reconocimiento de voz y gamificación sana para que la lectura deje de ser una obligación y se vuelva su actividad favorita.
            </p>
          </div>

          {/* Grid de 3 Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pilar 1: Lectura Guiada por Micrófono e IA */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all group relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mic className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                Lectura en Voz Alta con Reconocimiento
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                El niño lee al micrófono mientras la aplicación evalúa fluidez, pronunciación y ritmo. Recibe retroalimentación positiva e inmediata sin frustración ni juicios.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
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
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-violet-500/50 transition-all group relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                Comprensión Lectora y Creatividad
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                No basta con pronunciar palabras; el niño debe comprender. Cada historia incluye preguntas interactivas y desafíos de escritura para inventar finales alternativos.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
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
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all group relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                Gemas Mágicas y Minijuegos
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Cada lectura exitosa otorga Gemas Mágicas. Las gemas permiten desbloquear minijuegos educativos como Carrera de Carros o Cruzar el Río, premiando el esfuerzo real.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
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
          <div id="pedagogy" className="mt-16 pt-12 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-amber-400">+300%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Minutos de lectura semanal</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">92%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Mejora en comprensión</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-violet-400">100%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Ambiente seguro y educativo</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">PDF</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Reportes para padres</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECCIÓN DE PRECIOS (PRICING TABLE COMPARATIVA)                         */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
              Planes Transparentes para Familias
            </h2>
            <p className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Invierte en el futuro lector de tus hijos
            </p>
            <p className="mt-4 text-base text-slate-400">
              Comienza 100% gratis hoy mismo o desbloquea toda la biblioteca interactiva y reportes avanzados con el Plan Familia PRO.
            </p>

            {/* Selector de Ciclo de Facturación */}
            <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Anual</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold">
                  Ahorra 20%
                </span>
              </button>
            </div>
          </div>

          {/* Tabla de Planes Comparativos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* PLAN GRATIS */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Plan Básico Gratis
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                    Para Explorar
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-6">
                  Perfecto para probar la experiencia y motivar los primeros hábitos de lectura en casa.
                </p>

                <div className="mb-6">
                  <span className="text-4xl sm:text-5xl font-black text-white">$0</span>
                  <span className="text-sm text-slate-400 ml-2">/ para siempre</span>
                </div>

                <div className="border-t border-slate-800 pt-6 space-y-3.5 text-sm text-slate-300">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Hasta <strong>5 cuentos interactivos</strong> por nivel</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Reconocimiento de voz y fluidez básico</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Trivias de comprensión y gemas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Acceso al minijuego de Carrera de Carros</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="w-4 h-4 flex items-center justify-center text-slate-600 font-bold">✕</span>
                    <span>Sin reportes avanzados en PDF para padres</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-850">
                <button
                  id="btn-pricing-free-plan"
                  type="button"
                  onClick={() => onNavigateToAuth('register')}
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Crear Cuenta Gratis</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* PLAN PRO FAMILIAR (EL MÁS POPULAR) */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 flex flex-col justify-between relative overflow-hidden">
              
              {/* Badge Más Popular */}
              <div className="absolute top-0 right-8">
                <span className="px-4 py-1 rounded-b-xl text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> El más popular
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    Familia PRO
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  </h3>
                </div>
                <p className="text-sm text-slate-400 mb-6">
                  Acceso completo sin límites a toda la biblioteca de cuentos, análisis con IA y todos los minijuegos.
                </p>

                <div className="mb-2">
                  <span className="text-4xl sm:text-5xl font-black text-white">${proPrice}</span>
                  <span className="text-sm text-slate-400 ml-2">USD / mes</span>
                </div>
                <p className="text-xs text-amber-300 font-medium mb-6">
                  {proBilledText}
                </p>

                <div className="border-t border-amber-900/40 pt-6 space-y-3.5 text-sm text-slate-200">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Biblioteca ilimitada de cuentos</strong> por edades (7 a 12 años)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Análisis de voz con IA ilimitado</strong> (precisión, velocidad y entonación)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Reportes de progreso en PDF</strong> descargables para colegios y padres</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Desbloqueo de <strong>todos los minijuegos</strong> educativos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Hasta <strong>3 perfiles de niños</strong> en la misma cuenta familiar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Suscripción segura procesada con <strong>Stripe</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-amber-900/40">
                <button
                  id="btn-pricing-pro-stripe"
                  type="button"
                  onClick={handleStartProCheckout}
                  disabled={stripeLoading}
                  className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 active:scale-[0.99] text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
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
                <p className="text-center text-[11px] text-slate-400 mt-2.5 flex items-center justify-center gap-1">
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
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            
            {/* Columna 1: Brand */}
            <div className="col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950">
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
              <p className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">
                Niveles de Lectura
              </p>
              <ul className="space-y-2">
                <li><span className="hover:text-amber-400 cursor-pointer">Nivel 1 (6-7 años: Primeras Letras)</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer">Nivel 2 (8-9 años: Aventuras y Naturaleza)</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer">Nivel 3 (10-12 años: Ciencia y Misterios)</span></li>
                <li><button onClick={onEnterApp} className="hover:text-amber-400 text-left cursor-pointer">Explorar Creador de Cuentos</button></li>
              </ul>
            </div>

            {/* Columna 3: Tecnología y Seguridad */}
            <div>
              <p className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">
                Seguridad & Familia
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Cero Anuncios</li>
                <li className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-400" /> Contenido Curado</li>
                <li className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-amber-400" /> Stripe Billing</li>
                <li><span className="text-slate-400">Protección de Datos COPPA</span></li>
              </ul>
            </div>

            {/* Columna 4: Legal & Contacto */}
            <div>
              <p className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">
                Institucional
              </p>
              <ul className="space-y-2">
                <li><span className="hover:text-white cursor-pointer transition-colors">Términos de Servicio</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Política de Privacidad</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Planes para Colegios</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Soporte a Familias</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© 2026 LecturaKids. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <span>Diseñado con cariño para familias lectoras</span>
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
