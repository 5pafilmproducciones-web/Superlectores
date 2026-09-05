import React, { useState } from 'react';
import { 
  Boxes, 
  History, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Zap, 
  CreditCard, 
  Layers, 
  Database, 
  ArrowUpRight, 
  Smartphone, 
  CheckCircle2, 
  BarChart3, 
  TrendingUp, 
  Lock, 
  ExternalLink,
  ChevronRight,
  PackageCheck,
  AlertTriangle,
  RotateCcw,
  Plus
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
    // Simulación del flujo de redirección / sesión de Stripe Checkout
    setTimeout(() => {
      setStripeLoading(false);
      setStripeSuccessModal(true);
    }, 1200);
  };

  const proPrice = billingCycle === 'monthly' ? 19 : 15;
  const proBilledText = billingCycle === 'monthly' ? 'facturado mensualmente' : 'facturado anualmente ($180/año)';

  return (
    <div id="landing-page-root" className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* NAVBAR DE LA LANDING                                                      */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Boxes className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Inventario<span className="text-indigo-400">Pro</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v2.0
                </span>
              </span>
            </div>
          </div>

          {/* Links de navegación */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">
              Características
            </a>
            <a href="#mockup" className="hover:text-white transition-colors">
              Plataforma
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Precios
            </a>
            <a href="#security" className="hover:text-white transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Seguridad RLS
            </a>
          </nav>

          {/* Botones de acción Header */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                id="landing-btn-enter-app"
                type="button"
                onClick={onEnterApp}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Entrar al Sistema</span>
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
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
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge superior de lanzamiento */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-300 mb-8 shadow-inner hover:border-indigo-500/40 transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Motor de Base de Datos Multiusuario</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-400 font-bold flex items-center gap-1">
              Supabase + RLS Activo <Sparkles className="w-3 h-3" />
            </span>
          </div>

          {/* Headline impactante (Beneficio en 5 segundos) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
            Control total de tu inventario e historial en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400">
              tiempo real.
            </span>
          </h1>

          {/* Subtítulo descriptivo corto */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Administra stock, registra trazabilidad inmutable y evita quiebres de existencias con aislamiento estricto por usuario y transacciones atómicas.
          </p>

          {/* Botones de Llamado a la Acción (CTA) */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="landing-hero-cta-start"
              type="button"
              onClick={() => onNavigateToAuth('register')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-base font-extrabold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <span>Comenzar Gratis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#mockup"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-base font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <span>Ver Interfaz en Acción</span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              Sin tarjeta de crédito requerida
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              Políticas Row Level Security (RLS)
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              Historial auditable e inmutable
            </span>
          </div>

          {/* ========================================================================= */}
          {/* MOCKUP VISUAL DE LA APLICACIÓN                                             */}
          {/* ========================================================================= */}
          <div id="mockup" className="mt-16 sm:mt-20 relative max-w-5xl mx-auto">
            {/* Ambient edge glow */}
            <div className="absolute -inset-1 bg-gradient-to-b from-indigo-500/25 via-violet-500/10 to-transparent rounded-3xl blur-xl opacity-75 -z-10" />

            <div className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden text-left">
              {/* Fake Window Header */}
              <div className="px-4 sm:px-6 py-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400 font-medium">
                    app.inventariopro.com/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> PostgreSQL Conectado
                  </span>
                </div>
              </div>

              {/* Dashboard Content Mockup */}
              <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                {/* Metrics row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Stock Total
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                      1,482 <span className="text-xs font-medium text-emerald-400">+12%</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Artículos registrados</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Valor Inventario
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                      $48,250
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Valoración neta activa</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Stock Mínimo
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
                      3
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Requieren reabastecimiento</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                      Movimientos Hoy
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-indigo-400 mt-1">
                      +42
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Entradas, salidas y ajustes</p>
                  </div>
                </div>

                {/* Table representation */}
                <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/40">
                  <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Últimos Movimientos de Inventario (Trazabilidad)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Filtrado por user_id autenticado
                    </span>
                  </div>
                  <div className="divide-y divide-slate-800/60 text-xs sm:text-sm">
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-900/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                          +
                        </span>
                        <div>
                          <p className="font-bold text-white">Entrada de Mercancía • Lote #4092</p>
                          <p className="text-xs text-slate-400">SKU: PROD-9921 • Factura #F-88210</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-400">+150 unidades</span>
                        <p className="text-xs text-slate-400">Stock: 250 → 400</p>
                      </div>
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-900/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs">
                          -
                        </span>
                        <div>
                          <p className="font-bold text-white">Despacho de Pedido Cliente</p>
                          <p className="text-xs text-slate-400">SKU: ART-5510 • Guía Despacho #GD-102</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-rose-400">-24 unidades</span>
                        <p className="text-xs text-slate-400">Stock: 80 → 56</p>
                      </div>
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-900/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs">
                          ~
                        </span>
                        <div>
                          <p className="font-bold text-white">Ajuste de Conteo Físico Mensual</p>
                          <p className="text-xs text-slate-400">SKU: MAT-1100 • Auditoría Bodega Central</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-sky-400">Ajuste Físico</span>
                        <p className="text-xs text-slate-400">Stock fijado: 120</p>
                      </div>
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">
              Arquitectura Robusta y Escalable
            </h2>
            <p className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Los 3 Pilares Fundamentales del Sistema
            </p>
            <p className="mt-4 text-base sm:text-lg text-slate-400 font-normal">
              Diseñado desde las bases para garantizar velocidad relacional, trazabilidad a prueba de fallos y aislamiento total de datos.
            </p>
          </div>

          {/* Grid de 3 Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pilar 1: Gestión de Inventario Inteligente */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Boxes className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                Gestión de Inventario Inteligente
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Organización de artículos por SKU, categorías dinámicas, costos unitarios y ubicaciones físicas de bodega. Incluye avisos preventivos de stock mínimo.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  Control de stock actual y umbrales mínimos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  Categorías personalizables con etiquetas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  Búsqueda instantánea por SKU o nombre
                </li>
              </ul>
            </div>

            {/* Pilar 2: Historial de Movimientos Automatizado */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-violet-500/50 transition-all group relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <History className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                Historial de Movimientos Automatizado
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Registro inmutable de cada entrada, salida o ajuste mediante transacciones ACID. Registra motivo, número de factura o guía y costo unitario.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  Transacciones atómicas (RPC en PostgreSQL)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  Validación de stock negativo en salidas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  Trazabilidad con fecha y código de referencia
                </li>
              </ul>
            </div>

            {/* Pilar 3: Multiplataforma y Concurrencia RLS */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all group relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                Multiplataforma y Seguro (RLS)
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Acceso fluido desde dispositivos móviles, tablets o computadoras de escritorio. Cada usuario accede exclusivamente a su información gracias a Supabase RLS.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Row Level Security con auth.uid() en cada fila
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Diseño 100% responsivo adaptable a pantallas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Respaldos y sincronización automática en la nube
                </li>
              </ul>
            </div>

          </div>

          {/* Social Proof metrics */}
          <div id="security" className="mt-16 pt-12 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">99.9%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Disponibilidad Cloud</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">0 ms</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Desincronizaciones</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-indigo-400">100%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Aislamiento RLS</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">ACID</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Transacciones PostgreSQL</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECCIÓN DE PRECIOS (PRICING TABLE)                                     */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">
              Planes Transparentes
            </h2>
            <p className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Precios simples, sin sorpresas
            </p>
            <p className="mt-4 text-base text-slate-400">
              Comienza gratis hoy mismo o desbloquea capacidad ilimitada para tu negocio con nuestro plan Pro respaldado por Stripe.
            </p>

            {/* Selector Mensual / Anual */}
            <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-indigo-600 text-white shadow-md'
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
                    ? 'bg-indigo-600 text-white shadow-md'
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

          {/* Tabla de 2 Planes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* PLAN GRATIS */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Plan Gratis
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                    Para Iniciar
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-6">
                  Ideal para emprendimientos iniciales o control de inventario básico personal.
                </p>

                <div className="mb-6">
                  <span className="text-4xl sm:text-5xl font-black text-white">$0</span>
                  <span className="text-sm text-slate-400 ml-2">/ para siempre</span>
                </div>

                <div className="border-t border-slate-800 pt-6 space-y-3.5 text-sm text-slate-300">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Hasta <strong>50 productos</strong> en catálogo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Historial de movimientos de los últimos 30 días</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Categorías y unidades básicas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Seguridad multiusuario con RLS de Supabase</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="w-4 h-4 flex items-center justify-center text-slate-600 font-bold">✕</span>
                    <span>Sin exportación de reportes avanzados</span>
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

            {/* PLAN PRO (DESTACADO: EL MÁS POPULAR) */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-indigo-950/60 via-slate-950 to-slate-950 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10 flex flex-col justify-between relative overflow-hidden">
              {/* Badge Más Popular */}
              <div className="absolute top-0 right-8 -translate-y-0">
                <span className="px-4 py-1 rounded-b-xl text-xs font-black uppercase tracking-wider bg-indigo-600 text-white shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> El más popular
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    Plan PRO
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  </h3>
                </div>
                <p className="text-sm text-slate-400 mb-6">
                  Solución completa y sin límites para empresas, pymes y operaciones en crecimiento.
                </p>

                <div className="mb-2">
                  <span className="text-4xl sm:text-5xl font-black text-white">${proPrice}</span>
                  <span className="text-sm text-slate-400 ml-2">USD / mes</span>
                </div>
                <p className="text-xs text-indigo-300 font-medium mb-6">
                  {proBilledText}
                </p>

                <div className="border-t border-indigo-900/40 pt-6 space-y-3.5 text-sm text-slate-200">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Productos y stock ilimitados</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Historial y trazabilidad completa</strong> sin límite de tiempo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Múltiples bodegas, estantes y ubicaciones</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Exportación de reportes a PDF e impresión directa</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Procesador de pagos seguro con Stripe</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Soporte prioritario 24/7 y respaldos continuos</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-indigo-900/40">
                <button
                  id="btn-pricing-pro-stripe"
                  type="button"
                  onClick={handleStartProCheckout}
                  disabled={stripeLoading}
                  className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                >
                  {stripeLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Iniciando Stripe Checkout...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Comenzar con Plan PRO</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2.5 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" /> Pago seguro cifrado SSL vía Stripe
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
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Boxes className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight">InventarioPro</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Plataforma SaaS para el control de inventario inteligente, auditoría de existencias y trazabilidad multiusuario en la nube.
              </p>
            </div>

            {/* Columna 2: Producto */}
            <div>
              <p className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">
                Producto
              </p>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#mockup" className="hover:text-white transition-colors">Panel y Vistas</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Planes y Precios</a></li>
                <li><button onClick={() => onNavigateToAuth('register')} className="hover:text-white transition-colors text-left">Registro de Usuarios</button></li>
              </ul>
            </div>

            {/* Columna 3: Arquitectura */}
            <div>
              <p className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">
                Seguridad & Tech
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Supabase RLS</li>
                <li className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-indigo-400" /> PostgreSQL RPC</li>
                <li className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-violet-400" /> Stripe Billing</li>
                <li><span className="text-slate-400">Transacciones ACID</span></li>
              </ul>
            </div>

            {/* Columna 4: Legal & Soporte */}
            <div>
              <p className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">
                Legal & Empresa
              </p>
              <ul className="space-y-2">
                <li><span className="hover:text-white cursor-pointer transition-colors">Términos de Servicio</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Política de Privacidad</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Cumplimiento GDPR / Datos</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Contacto de Soporte</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© 2026 InventarioPro Inc. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <span>Alojado en infraestructura Cloud</span>
              <span>•</span>
              <button 
                type="button"
                onClick={onEnterApp}
                className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer"
              >
                Abrir Aplicación
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL DE INTEGRACIÓN STRIPE CHECKOUT (CONFIRMACIÓN)                       */}
      {/* ========================================================================= */}
      {stripeSuccessModal && (
        <div 
          id="stripe-checkout-modal"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center relative shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
              <CreditCard className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight">
              Flujo de Suscripción PRO
            </h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              El portal de pagos de Stripe se ha configurado para el <strong className="text-white">Plan PRO (${proPrice} USD/mes)</strong>.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Plan seleccionado:</span>
                <span className="font-bold text-white">InventarioPro PRO</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Facturación:</span>
                <span className="font-bold text-indigo-400 capitalize">{billingCycle === 'monthly' ? 'Mensual' : 'Anual'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estado:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sesión Stripe Lista
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
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
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
