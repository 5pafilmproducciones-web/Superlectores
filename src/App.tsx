/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { 
  CoreRecord, 
  TabType, 
  ToastMessage, 
  Story, 
  ChildProfile, 
  ReadingEvaluation, 
  GameId 
} from './types';
import { 
  INITIAL_RECORDS, 
  INITIAL_STORIES, 
  INITIAL_CHILD_PROFILE, 
  INITIAL_EVALUATIONS 
} from './data/seedData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { DashboardView } from './components/DashboardView';
import { CoreOperationsView } from './components/CoreOperationsView';
import { RecordsView } from './components/RecordsView';
import { SettingsAndGamesView } from './components/SettingsAndGamesView';
import { RecordModal } from './components/RecordModal';
import { ReportExportModal } from './components/ReportExportModal';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/auth';
import { LandingPage } from './components/LandingPage';
import { AuthMode, SupabaseProfile, SupabaseUser } from './types';
import { getCurrentSession, fetchUserProfile } from './lib/authService';
import { RaceGame } from './components/games/RaceGame';
import { PuzzleGame } from './components/games/PuzzleGame';
import { PaintGame } from './components/games/PaintGame';
import { MazeGame } from './components/games/MazeGame';
import { MemoryGame } from './components/games/MemoryGame';
import { SpaceGame } from './components/games/SpaceGame';
import { WordsGame } from './components/games/WordsGame';
import { RunnerGame } from './components/games/RunnerGame';
import { RiverGame } from './components/games/RiverGame';
import { MolesGame } from './components/games/MolesGame';
import { PianoGame } from './components/games/PianoGame';
import { MascotCompanion, MascotMessage } from './components/MascotCompanion';

export default function App() {
  // Local persistence states via custom hook
  const [records, setRecords] = useLocalStorage<CoreRecord[]>('lecturakids_records', INITIAL_RECORDS);
  const [profile, setProfile] = useLocalStorage<ChildProfile>('lecturakids_profile', INITIAL_CHILD_PROFILE);
  const [stories, setStories] = useLocalStorage<Story[]>('lecturakids_stories', INITIAL_STORIES);
  const [evaluations, setEvaluations] = useLocalStorage<ReadingEvaluation[]>('lecturakids_evaluations', INITIAL_EVALUATIONS);
  const [currentTab, setCurrentTab] = useLocalStorage<TabType>('lecturakids_current_tab', 'landing');

  // Interactive Mascot Companion state
  const [mascotMessage, setMascotMessage] = useState<MascotMessage | null>(null);

  // Ensure child starts with 0 gems when opening for the first time
  useEffect(() => {
    const initializedKey = 'lecturakids_zero_gems_v4';
    if (!localStorage.getItem(initializedKey)) {
      setProfile((prev) => ({
        ...prev,
        gems: 0,
        score: 0,
        storiesCompletedCount: 0,
      }));
      localStorage.setItem(initializedKey, 'true');
    }
  }, [setProfile]);

  // Ensure all 13 stories, balanced rewards, and cover images are synced
  useEffect(() => {
    if (stories.length < INITIAL_STORIES.length) {
      const existingIds = new Set(stories.map((s) => s.id));
      const missingStories = INITIAL_STORIES.filter((s) => !existingIds.has(s.id));
      setStories((prev) => [...prev, ...missingStories]);
    } else {
      const needUpdate = stories.some((s) => {
        const seed = INITIAL_STORIES.find((init) => init.id === s.id);
        return seed && (seed.rewardGems !== s.rewardGems || !s.coverImage || (s.questions?.length || 0) < seed.questions.length);
      });
      if (needUpdate) {
        const updated = stories.map((s) => {
          const seed = INITIAL_STORIES.find((init) => init.id === s.id);
          return seed
            ? { ...s, rewardGems: seed.rewardGems, coverImage: s.coverImage || seed.coverImage, questions: seed.questions }
            : s;
        });
        setStories(updated);
      }
    }
  }, [stories, setStories]);

  // Selected story for operations
  const [activeStoryId, setActiveStoryId] = useState<string | undefined>(undefined);
  const activeStory = stories.find((s) => s.id === activeStoryId) || stories[0];

  // Modals state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<CoreRecord | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  // Supabase Authentication state
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [currentSupabaseProfile, setCurrentSupabaseProfile] = useState<SupabaseProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');

  // Check existing Supabase session on startup
  useEffect(() => {
    getCurrentSession().then(async ({ user }) => {
      if (user) {
        setCurrentUser(user as SupabaseUser);
        const prof = await fetchUserProfile(user.id);
        setCurrentSupabaseProfile(prof);
        if (prof?.child_name) {
          setProfile((prev) => ({ ...prev, name: prof.child_name! }));
        }
      }
    });
  }, [setProfile]);

  const handleOpenAuthModal = (mode: AuthMode = 'login') => {
    setAuthModalMode(mode);
    setCurrentTab('auth');
  };

  const handleAuthChange = (user: SupabaseUser | null, profileData: SupabaseProfile | null) => {
    setCurrentUser(user);
    setCurrentSupabaseProfile(profileData);
    if (profileData?.child_name) {
      setProfile((prev) => ({ ...prev, name: profileData.child_name! }));
    }
  };

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastMessage = { id, type, title, description };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Reset seed data
  const handleResetSeedData = () => {
    setRecords(INITIAL_RECORDS);
    setProfile(INITIAL_CHILD_PROFILE);
    setStories(INITIAL_STORIES);
    setEvaluations(INITIAL_EVALUATIONS);
    setCurrentTab('dashboard');
    showToast('success', 'Datos Semilla Restablecidos', 'Se han restaurado los cuentos, registros y perfil iniciales.');
  };

  // Records CRUD
  const handleOpenCreateRecord = () => {
    setRecordToEdit(null);
    setIsRecordModalOpen(true);
  };

  const handleEditRecord = (record: CoreRecord) => {
    setRecordToEdit(record);
    setIsRecordModalOpen(true);
  };

  const handleSaveRecord = (record: CoreRecord) => {
    setRecords((prev) => {
      const exists = prev.some((r) => r.id === record.id);
      if (exists) {
        return prev.map((r) => (r.id === record.id ? record : r));
      } else {
        return [record, ...prev];
      }
    });

    showToast(
      'success',
      recordToEdit ? 'Registro Actualizado' : 'Registro Creado',
      `"${record.title}" guardado en almacenamiento local.`
    );
  };

  const handleDeleteRecord = (id: string) => {
    const target = records.find((r) => r.id === id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
    showToast(
      'info',
      'Registro Eliminado',
      target ? `"${target.title}" fue removido de la lista.` : undefined
    );
  };

  const handleUpdateStatus = (id: string, newStatus: 'activo' | 'pendiente' | 'completado') => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast('success', 'Estado Actualizado', `El registro cambió a estado: ${newStatus}`);
  };

  // Child Profile Updates
  const handleUpdateProfile = (updated: Partial<ChildProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Reading Evaluation completion
  const handleSaveEvaluation = (evaluation: ReadingEvaluation) => {
    setEvaluations((prev) => [evaluation, ...prev]);

    // Also add or update corresponding record
    const newRecord: CoreRecord = {
      id: `rec-${Date.now()}`,
      title: `Lectura: ${evaluation.storyTitle}`,
      category: 'Evaluación Completada',
      status: 'completado',
      createdAt: new Date().toISOString().split('T')[0],
      level: profile.level,
      gemsReward: evaluation.gemsEarned,
      authorOrTarget: profile.name,
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  // Start reading flow
  const handleStartReading = (storyId?: string) => {
    if (storyId) {
      setActiveStoryId(storyId);
    }
    setCurrentTab('operations');
  };

  // Render standalone dark-mode public SaaS landing page
  if (currentTab === 'landing') {
    return (
      <div id="landing-container" className="min-h-screen bg-slate-950">
        <LandingPage
          onNavigateToAuth={(mode) => {
            setAuthModalMode(mode);
            setCurrentTab('auth');
          }}
          onEnterApp={() => setCurrentTab('dashboard')}
          isAuthenticated={Boolean(currentUser)}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-indigo-500 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        profile={profile}
        currentUser={currentUser}
        currentSupabaseProfile={currentSupabaseProfile}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        {/* Top Header */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          profile={profile}
          onResetSeedData={handleResetSeedData}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          currentUser={currentUser}
          currentSupabaseProfile={currentSupabaseProfile}
          onOpenAuthModal={handleOpenAuthModal}
        />

        {/* Viewport Content */}
        <main id="main-content-viewport" className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden">
          {currentTab === 'dashboard' && (
            <DashboardView
              records={records}
              profile={profile}
              stories={stories}
              evaluations={evaluations}
              onStartReading={handleStartReading}
              onOpenGames={() => setCurrentTab('settings')}
              onTriggerMascot={(msg) => setMascotMessage(msg)}
            />
          )}

          {currentTab === 'operations' && (
            <CoreOperationsView
              stories={stories}
              profile={profile}
              selectedStoryId={activeStoryId}
              onUpdateProfile={handleUpdateProfile}
              onSaveEvaluation={handleSaveEvaluation}
              onOpenGames={() => setCurrentTab('settings')}
              showToast={showToast}
              onTriggerMascot={(msg) => setMascotMessage(msg)}
            />
          )}

          {currentTab === 'records' && (
            <RecordsView
              records={records}
              onOpenCreateModal={handleOpenCreateRecord}
              onEditRecord={handleEditRecord}
              onDeleteRecord={handleDeleteRecord}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsAndGamesView
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onLaunchGame={(gameId) => setActiveGame(gameId)}
              onResetSeedData={handleResetSeedData}
              showToast={showToast}
              currentUser={currentUser}
              currentSupabaseProfile={currentSupabaseProfile}
              onOpenAuthModal={handleOpenAuthModal}
            />
          )}

          {currentTab === 'auth' && (
            <AuthScreen
              currentUser={currentUser}
              currentProfile={currentSupabaseProfile}
              onAuthChange={handleAuthChange}
              onBackToApp={() => setCurrentTab('operations')}
              showToast={showToast}
              initialMode={authModalMode}
            />
          )}
        </main>
      </div>

      {/* Supabase Authentication Modal (Login, Register, Recovery, Update Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        currentProfile={currentSupabaseProfile}
        onAuthChange={handleAuthChange}
        initialMode={authModalMode}
        showToast={showToast}
      />

      {/* Record Creation / Edit Modal */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSave={handleSaveRecord}
        recordToEdit={recordToEdit}
      />

      {/* Report Preview & Export Modal */}
      <ReportExportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        profile={profile}
        records={records}
        evaluations={evaluations}
        stories={stories}
      />

      {/* Mini-Games Interactive Modals */}
      {activeGame === 'race' && (
        <RaceGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === 'puzzle' && (
        <PuzzleGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === 'paint' && (
        <PaintGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === 'maze' && (
        <MazeGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === 'memory' && (
        <MemoryGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === 'space' && (
        <SpaceGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === 'words' && (
        <WordsGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === 'runner' && (
        <RunnerGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === 'river' && (
        <RiverGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === 'moles' && (
        <MolesGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === 'piano' && (
        <PianoGame onClose={() => setActiveGame(null)} />
      )}

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Interactive Mascot Companion (Leo el Búho Lector) */}
      <MascotCompanion
        childName={profile.name}
        incomingMessage={mascotMessage}
        onDismissIncoming={() => setMascotMessage(null)}
        onStartReading={(storyId) => handleStartReading(storyId)}
        activeStoryTitle={activeStory?.title}
        activeStoryText={activeStory?.text}
        storyQuestions={activeStory?.questions?.map((q) => q.question)}
      />
    </div>
  );
}
