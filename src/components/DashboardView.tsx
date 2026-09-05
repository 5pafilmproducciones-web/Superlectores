import React, { useState } from 'react';
import { CoreRecord, Story, ChildProfile, ReadingEvaluation } from '../types';
import { MascotMessage } from './MascotCompanion';
import { 
  Gem, 
  BookCheck, 
  Award, 
  Mic, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  Gamepad2,
  TrendingUp,
  Play,
  Lock,
  Check,
  Volume2
} from 'lucide-react';
import { AVAILABLE_MINI_GAMES } from '../data/seedData';

interface DashboardViewProps {
  records: CoreRecord[];
  profile: ChildProfile;
  stories: Story[];
  evaluations: ReadingEvaluation[];
  onStartReading: (storyId?: string) => void;
  onOpenGames: () => void;
  onTriggerMascot?: (message: MascotMessage) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  profile,
  stories,
  evaluations,
  onStartReading,
  onOpenGames,
  onTriggerMascot,
}) => {
  // Reactive KPIs
  const totalGems = profile.gems;
  const completedRecordsCount = records.filter((r) => r.status === 'completado').length;
  const totalRecords = records.length;
  const activeRecordsCount = records.filter((r) => r.status === 'activo').length;
  const pendingRecordsCount = records.filter((r) => r.status === 'pendiente').length;

  // Reading average accuracy from evaluations
  const avgAccuracy = evaluations.length > 0
    ? Math.round(evaluations.reduce((acc, curr) => acc + curr.voiceAccuracy, 0) / evaluations.length)
    : profile.audioAccuracyAverage;

  // Distribution percentages
  const completedPct = totalRecords > 0 ? Math.round((completedRecordsCount / totalRecords) * 100) : 0;
  const activePct = totalRecords > 0 ? Math.round((activeRecordsCount / totalRecords) * 100) : 0;
  const pendingPct = totalRecords > 0 ? Math.round((pendingRecordsCount / totalRecords) * 100) : 0;

  // Find next recommended story matching child's level
  const recommendedStory = stories.find((s) => s.level === profile.level) || stories[0];

  // Dashboard story level filter
  const [dashboardLevelFilter, setDashboardLevelFilter] = useState<'all' | number>('all');
  const displayedStories = dashboardLevelFilter === 'all'
    ? stories
    : stories.filter((s) => s.level === dashboardLevelFilter);

  return (
    <div id="dashboard-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 4 KPI Cards Header */}
      <div id="kpi-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Gemas Totales */}
        <div 
          id="kpi-card-gems"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gemas Acumuladas</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Gem className="w-5 h-5 fill-amber-300" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalGems}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{evaluations.length * 10} ganadas
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Canjeables por recesos con mini-juegos</p>
        </div>

        {/* KPI 2: Cuentos Completados */}
        <div 
          id="kpi-card-stories"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cuentos Leídos</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <BookCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{completedRecordsCount}</span>
            <span className="text-xs font-semibold text-slate-500">de {totalRecords} registrados</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">{completedPct}% completado del directorio</p>
        </div>

        {/* KPI 3: Nivel Actual */}
        <div 
          id="kpi-card-level"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Nivel Actual</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Award className="w-5 h-5 fill-indigo-100" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">Nivel {profile.level}</span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              {profile.level === 1 ? '7 años' : profile.level === 2 ? '8-9 años' : '10 años'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">{profile.score} XP acumulados</p>
        </div>

        {/* KPI 4: Fluidez Auditiva */}
        <div 
          id="kpi-card-accuracy"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fluidez en Voz Alta</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Mic className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{avgAccuracy}%</span>
            <span className="text-xs font-semibold text-emerald-600">Excelente</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Medido con reconocimiento de voz en vivo</p>
        </div>
      </div>

      {/* Main Grid: 8-columns for Stories & Hero, 4-columns for Game Zone & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Hero Banner + Book Directory Grid */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Welcome Hero Banner with .story-card-gradient */}
          <div 
            id="welcome-banner"
            className="story-card-gradient rounded-3xl p-5 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden shadow-lg gap-6 w-full max-w-full"
          >
            <div className="relative z-10 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Nivel {profile.level} • {profile.name}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">¡Hola {profile.name}! 👋</h2>
              <p className="mt-2 text-indigo-100 text-xs sm:text-sm leading-relaxed opacity-95">
                Tienes una nueva misión de lectura: &ldquo;{recommendedStory.title}&rdquo;. ¡Léelo en voz alta para ganar {recommendedStory.rewardGems} gemas!
              </p>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-5 sm:mt-6 w-full">
                <button
                  id="btn-quick-start-reading"
                  onClick={() => onStartReading(recommendedStory.id)}
                  className="bg-white text-indigo-600 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-all text-xs sm:text-sm transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex-1 sm:flex-none"
                >
                  <span>Empezar Lectura</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="btn-listen-leo-greeting"
                  type="button"
                  onClick={() => {
                    onTriggerMascot?.({
                      id: `mascot-greeting-${Date.now()}`,
                      type: 'welcome',
                      title: `¡Hola, ${profile.name}!`,
                      text: `¡Hola ${profile.name}! Me alegra mucho verte listo para leer hoy. Hoy tenemos cuentos fascinantes como "${recommendedStory.title}". Léelo en voz alta, responde las preguntas y gana muchas gemas para jugar en el arcade. ¡Acompáñame a leer!`,
                      actionLabel: '¡Empezar Cuento!',
                      onAction: () => onStartReading(recommendedStory.id),
                      autoSpeak: true,
                    });
                  }}
                  className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  title="Escuchar el saludo motivador de Leo el Búho"
                >
                  <span className="text-base">🦉</span>
                  <span>Escuchar a Leo</span>
                </button>
                <button
                  id="btn-quick-open-games"
                  onClick={onOpenGames}
                  className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gamepad2 className="w-4 h-4 text-amber-300" />
                  <span>Zona de Juegos</span>
                </button>
              </div>
            </div>

            {/* Recommended Story Cover Illustration Visual */}
            <div className="w-full sm:w-52 h-44 rounded-2xl overflow-hidden relative shrink-0 shadow-lg border-2 border-white/30 group bg-white/10">
              {recommendedStory.coverImage ? (
                <img
                  src={recommendedStory.coverImage}
                  alt={recommendedStory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center shadow-inner">
                  <span className="text-5xl sm:text-6xl">{recommendedStory.emoji || '🚀'}</span>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <span>💎 +{recommendedStory.rewardGems}</span>
              </div>
            </div>
          </div>

          {/* Book Directory Grid ("Cuentos por Nivel") */}
          <section id="featured-stories-section" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-bold text-xl text-slate-900 tracking-tight">Cuentos Ilustrados por Nivel</h3>
                <p className="text-xs text-slate-500">Aventuras interactivas de lectura con evaluación auditiva y quiz</p>
              </div>

              {/* Level Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto max-w-full">
                <button
                  onClick={() => setDashboardLevelFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    dashboardLevelFilter === 'all'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos ({stories.length})
                </button>
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setDashboardLevelFilter(lvl)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      dashboardLevelFilter === lvl
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Nivel {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedStories.map((story) => {
                const bgBox = story.level === 1 ? 'bg-emerald-50' : story.level === 2 ? 'bg-sky-50' : 'bg-amber-50';
                const tagClass = story.level === 1 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : story.level === 2 
                  ? 'bg-sky-100 text-sky-700' 
                  : 'bg-amber-100 text-amber-700';

                return (
                  <div 
                    key={story.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image container */}
                      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-100 border border-slate-100 shadow-inner group-hover:shadow-sm transition-all">
                        {story.coverImage ? (
                          <img
                            src={story.coverImage}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className={`w-full h-full ${bgBox} flex items-center justify-center text-4xl`}>
                            {story.emoji}
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-slate-900/75 backdrop-blur-xs text-amber-300 text-[11px] px-2 py-0.5 rounded-full font-bold shadow-xs flex items-center gap-1">
                          <span>💎 +{story.rewardGems}</span>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <span className={`text-[10px] ${tagClass} px-2 py-0.5 rounded-full font-bold uppercase shadow-xs`}>
                            {story.badge}
                          </span>
                        </div>
                      </div>

                      <h5 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {story.title}
                      </h5>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {story.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {story.wordCount} palabras
                      </span>
                      <button
                        id={`btn-open-story-${story.id}`}
                        onClick={() => onStartReading(story.id)}
                        className="text-xs text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Leer cuento</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Distribution Progress & Status Bar */}
          <div id="distribution-card" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">Distribución de Registros por Estado</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">{totalRecords} registros en total</span>
            </div>

            {/* Segmented bar */}
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                <div 
                  style={{ width: `${completedPct}%` }} 
                  className="bg-emerald-500 transition-all duration-500" 
                  title={`Completados: ${completedRecordsCount} (${completedPct}%)`}
                />
                <div 
                  style={{ width: `${activePct}%` }} 
                  className="bg-indigo-500 transition-all duration-500" 
                  title={`Activos: ${activeRecordsCount} (${activePct}%)`}
                />
                <div 
                  style={{ width: `${pendingPct}%` }} 
                  className="bg-amber-400 transition-all duration-500" 
                  title={`Pendientes: ${pendingRecordsCount} (${pendingPct}%)`}
                />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Completados</span>
                    <span className="font-bold text-slate-800">{completedRecordsCount} ({completedPct}%)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Activos</span>
                    <span className="font-bold text-slate-800">{activeRecordsCount} ({activePct}%)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Pendientes</span>
                    <span className="font-bold text-slate-800">{pendingRecordsCount} ({pendingPct}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Game Zone & Rewards Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Tienda de Juegos & Receso Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col shadow-xs h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                  <span className="text-indigo-600 font-black">🎮</span> Tienda de Juegos
                </h3>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                  <Gem className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{profile.gems} 💎</span>
                </span>
              </div>

              {/* Game list cards */}
              <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                {AVAILABLE_MINI_GAMES.map((game) => {
                  const canAfford = profile.gems >= game.gemCost;
                  return (
                    <div 
                      key={game.id}
                      onClick={onOpenGames}
                      className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-2xl flex items-center gap-3.5 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-2xl text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                        {game.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate">{game.name}</p>
                        <p className="text-xs text-slate-500">
                          {canAfford ? 'Disponible para jugar' : `Requiere ${game.gemCost} Gemas`}
                        </p>
                      </div>
                      {canAfford ? (
                        <div className="bg-emerald-500 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          ✓
                        </div>
                      ) : (
                        <button className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0">
                          {game.gemCost} 💎
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievement Widget at bottom of right column */}
            <div className="pt-6 mt-6 border-t border-slate-100">
              <div className="bg-indigo-50/80 p-4 rounded-2xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Logro del día</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-xl shrink-0">
                    🎖️
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Lector Veloz</p>
                    <p className="text-[11px] text-slate-500">Lee 3 cuentos seguidos con &gt;85% precisión</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Box */}
          <div id="recent-activity-card" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-sm text-slate-900">Actividad Reciente</h4>
              </div>
              <span className="text-[11px] text-slate-400">{records.length} registros</span>
            </div>

            <div className="divide-y divide-slate-50 space-y-1">
              {records.slice(0, 4).map((record) => (
                <div key={record.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-slate-800 block truncate">{record.title}</span>
                    <span className="text-[10px] text-slate-400">{record.createdAt}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                    record.status === 'completado' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : record.status === 'activo'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
