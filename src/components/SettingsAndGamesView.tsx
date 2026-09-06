import React, { useState } from 'react';
import { ChildProfile, MiniGameDefinition, GameId } from '../types';
import { AVAILABLE_MINI_GAMES } from '../data/seedData';
import { 
  User, 
  Gamepad2, 
  Gem, 
  Sparkles, 
  Camera, 
  RotateCcw, 
  Save, 
  Play, 
  Lock, 
  Check, 
  HelpCircle,
  Clock,
  ShieldCheck,
  LogIn,
  LogOut,
  UserCheck,
  Database
} from 'lucide-react';
import { SupabaseProfile, AuthMode, SupabaseUser } from '../types';

interface SettingsAndGamesViewProps {
  profile: ChildProfile;
  onUpdateProfile: (updated: Partial<ChildProfile>) => void;
  onLaunchGame: (gameId: GameId) => void;
  onResetSeedData: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
  currentUser?: SupabaseUser | null;
  currentSupabaseProfile?: SupabaseProfile | null;
  onOpenAuthModal?: (mode?: AuthMode) => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
];

export const SettingsAndGamesView: React.FC<SettingsAndGamesViewProps> = ({
  profile,
  onUpdateProfile,
  onLaunchGame,
  onResetSeedData,
  showToast,
  currentUser,
  currentSupabaseProfile,
  onOpenAuthModal,
}) => {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [level, setLevel] = useState(profile.level);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('error', 'Nombre requerido', 'El nombre del niño no puede estar vacío.');
      return;
    }

    onUpdateProfile({
      name: name.trim(),
      age: Number(age),
      level: Number(level),
      avatar: customAvatarUrl.trim() || avatar,
    });

    showToast('success', 'Perfil Guardado', 'Los datos del estudiante se actualizaron correctamente.');
  };

  const handlePlayGame = (game: MiniGameDefinition) => {
    if (profile.gems < game.gemCost) {
      showToast(
        'error',
        'Gemas insuficientes',
        `Necesitas ${game.gemCost} gemas para jugar ${game.name}. ¡Lee un cuento para ganar más!`
      );
      return;
    }

    // Deduct gems
    const remainingGems = profile.gems - game.gemCost;
    onUpdateProfile({ gems: remainingGems });
    showToast(
      'info',
      '¡Receso iniciado!',
      `Canjeaste ${game.gemCost} gemas para jugar a ${game.name}. Te quedan ${remainingGems} 💎.`
    );

    // Launch game
    onLaunchGame(game.id);
  };

  return (
    <div id="settings-and-games-view" className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* SECTION 1: MINI-GAMES ARCADE (ZONA DE JUEGOS Y RECESO) */}
      <div id="games-arcade-section" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🕹️</span>
              <h2 className="text-xl font-extrabold tracking-tight">
                Salón de Juegos y Receso
              </h2>
            </div>
            <p className="text-xs text-indigo-200 mt-1 max-w-xl">
              Premia tu esfuerzo lector. Las gemas inician en <strong>0</strong> y se ganan únicamente leyendo y respondiendo las preguntas de comprensión de cada cuento.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
              <Gem className="w-5 h-5 text-sky-300 fill-sky-200 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-300 uppercase block font-semibold">Tus Gemas</span>
                <span className="text-lg font-black text-white">{profile.gems} 💎</span>
              </div>
            </div>

            {profile.gems > 0 && (
              <button
                id="btn-reset-gems-to-zero"
                onClick={() => {
                  onUpdateProfile({ gems: 0 });
                  showToast('info', 'Gemas Reiniciadas a 0', 'El contador de gemas ha vuelto a cero para una nueva sesión.');
                }}
                className="px-2.5 py-2 bg-white/10 hover:bg-rose-500/80 text-white rounded-xl text-xs font-semibold border border-white/20 transition-colors"
                title="Poner gemas en 0 para iniciar de nuevo"
              >
                Poner en 0 💎
              </button>
            )}
          </div>
        </div>

        {/* 7 Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {AVAILABLE_MINI_GAMES.map((game) => {
            const canAfford = profile.gems >= game.gemCost;

            return (
              <div
                key={game.id}
                id={`game-card-${game.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl p-2.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-2xs">
                      {game.emoji}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                      <Gem className="w-3 h-3 text-sky-500 fill-sky-400" />
                      <span>{game.gemCost} Gemas</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{game.name}</h3>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">{game.genre}</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{game.description}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>Receso ~{Math.round(game.durationSeconds / 60)} min</span>
                  </div>

                  <button
                    id={`btn-play-${game.id}`}
                    onClick={() => handlePlayGame(game)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      canAfford
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Play className="w-3 h-3 fill-white" />
                        <span>Jugar ({game.gemCost} 💎)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Faltan Gemas</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: CHILD PROFILE REGISTRATION (REGISTRO DEL NIÑO) */}
      <div id="child-profile-registration-section" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Registro del Niño y Ajustes del Estudiante
            </h3>
            <p className="text-xs text-slate-500">
              Configura el nombre, edad, nivel y fotografía o avatar de tu hijo.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Avatar picker */}
            <div className="flex flex-col items-center space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="relative">
                <img
                  src={customAvatarUrl || avatar}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
                <span className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 text-white rounded-full shadow-xs">
                  <Camera className="w-3.5 h-3.5" />
                </span>
              </div>

              <span className="text-xs font-bold text-slate-700">Elige un Avatar</span>
              <div className="flex items-center gap-2">
                {AVATAR_OPTIONS.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setAvatar(imgUrl);
                      setCustomAvatarUrl('');
                    }}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                      avatar === imgUrl && !customAvatarUrl
                        ? 'border-indigo-600 ring-2 ring-indigo-200 scale-110'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Avatar ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>

              <div className="w-full pt-1">
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="O pega URL de foto..."
                  className="w-full text-[11px] p-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Profile fields */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre Completo del Niño
                </label>
                <input
                  id="input-profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Edad (7 a 10 años)
                  </label>
                  <select
                    id="select-profile-age"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={7}>7 años (1º - 2º Primaria)</option>
                    <option value={8}>8 años (2º - 3º Primaria)</option>
                    <option value={9}>9 años (3º - 4º Primaria)</option>
                    <option value={10}>10 años (4º - 5º Primaria)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nivel de Lectura Inicial
                  </label>
                  <select
                    id="select-profile-level"
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={1}>Nivel 1 (Principiante - Oraciones Cortas)</option>
                    <option value={2}>Nivel 2 (Intermedio - Fábulas y Metáforas)</option>
                    <option value={3}>Nivel 3 (Avanzado - Ciencias y Aventuras)</option>
                  </select>
                </div>
              </div>

              {/* Stats badges */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 grid grid-cols-3 gap-3 text-center text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Cuentos Leídos</span>
                  <span className="font-extrabold text-slate-800 text-sm">{profile.storiesCompletedCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Puntos Acumulados</span>
                  <span className="font-extrabold text-amber-600 text-sm">{profile.score} pts</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Días de Racha</span>
                  <span className="font-extrabold text-indigo-600 text-sm">{profile.streakDays} días 🔥</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="btn-save-profile-settings"
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios de Perfil</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* SECTION 3: SUPABASE AUTHENTICATION & ACCOUNT */}
      <div id="supabase-account-management" className="bg-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Cuenta y Perfil de Usuario
                {currentUser && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Autenticado
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sincronización en la nube para guardar tu puntuación real y gemas mágicas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <button
                id="btn-manage-supabase-account"
                type="button"
                onClick={() => onOpenAuthModal?.('login')}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <UserCheck className="w-4 h-4" />
                <span>Gestionar Cuenta</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-settings-login"
                  type="button"
                  onClick={() => onOpenAuthModal?.('login')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </button>
                <button
                  id="btn-settings-register"
                  type="button"
                  onClick={() => onOpenAuthModal?.('register')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Registrarse</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {currentUser ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Correo Registrado</span>
              <span className="text-sm font-bold text-slate-900 truncate block mt-0.5">{currentUser.email}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Estudiante Vinculado</span>
              <span className="text-sm font-bold text-indigo-700 truncate block mt-0.5">
                {currentSupabaseProfile?.child_name || profile.name}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tutor / Apoderado</span>
              <span className="text-sm font-bold text-slate-700 truncate block mt-0.5">
                {currentSupabaseProfile?.full_name || 'Tutor Registrado'}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/70 to-amber-50/70 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-slate-800">¿Deseas respaldar tus cuentos y gemas en la nube?</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Crea una cuenta gratuita en Super Lectores para sincronizar el avance de tu hijo entre diferentes dispositivos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenAuthModal?.('register')}
              className="font-extrabold text-indigo-700 hover:text-indigo-900 underline whitespace-nowrap cursor-pointer"
            >
              Crear cuenta de estudiante →
            </button>
          </div>
        )}
      </div>

      {/* SECTION 4: LOCAL SYSTEM & DEMO DATA MANAGEMENT */}
      <div id="system-storage-management" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-bold text-sm text-slate-900">Almacenamiento Local (LocalStorage)</h4>
            <p className="text-xs text-slate-500">
              Todos tus datos, cuentos, registros y gemas se guardan localmente en el navegador sin base de datos externa.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            Sincronizado
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-600 max-w-xl">
            Si deseas reiniciar la demostración para presentar ante un nuevo cliente o inversionista, pulsa el botón para restablecer las historias y registros semilla originales.
          </p>
          <button
            id="btn-reset-seed-settings"
            onClick={onResetSeedData}
            className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Datos Semilla</span>
          </button>
        </div>
      </div>
    </div>
  );
};
