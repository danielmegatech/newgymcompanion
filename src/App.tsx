/**
 * Gym Companion — Root Application
 * Modern Gym Companion with Focus Mode, Automated Workout Report, Multi-Profile System, and Full ESC Keyboard Accessibility.
 */

import React, { useState, useEffect } from 'react';
import { GymProvider, useGym } from './context/GymContext';
import { NavbarHeader } from './components/NavbarHeader';
import { HomeDashboard } from './components/HomeDashboard';
import { GymAccessModal } from './components/GymAccessModal';
import { ActiveWorkoutScreen } from './components/ActiveWorkoutScreen';
import { WorkoutReportModal } from './components/WorkoutReportModal';
import { AICoachDrawer } from './components/AICoachDrawer';
import { WorkoutManagerModal } from './components/WorkoutManagerModal';
import { HistoryAnalyticsModal } from './components/HistoryAnalyticsModal';
import { SettingsModal } from './components/SettingsModal';
import { ProfileManagerModal } from './components/ProfileManagerModal';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { WorkoutRecoveryModal } from './components/WorkoutRecoveryModal';
import { OptionalWorkoutsModal } from './components/OptionalWorkoutsModal';
import { ApostilaGlowUpModal } from './components/ApostilaGlowUpModal';
import { MasterExerciseLibraryModal } from './components/MasterExerciseLibraryModal';
import { BottomNav } from './components/BottomNav';

const MainAppContent: React.FC = () => {
  const {
    theme,
    activeWorkout,
    todayWorkout,
    startWorkout,
    gymConfig,
    pendingFinishedLog,
    closePostWorkoutModal,
  } = useGym();

  // Modal / Drawer state
  const [showGymQrModal, setShowGymQrModal] = useState<boolean>(false);
  const [showAiCoach, setShowAiCoach] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showWorkoutManagerModal, setShowWorkoutManagerModal] = useState<boolean>(false);
  const [selectedWorkoutIdForManager, setSelectedWorkoutIdForManager] = useState<string | undefined>(
    undefined
  );
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showProfileManagerModal, setShowProfileManagerModal] = useState<boolean>(false);
  const [showMasterExercisesModal, setShowMasterExercisesModal] = useState<boolean>(false);
  const [selectedMasterCategory, setSelectedMasterCategory] = useState<string | undefined>(undefined);
  const [showDocsModal, setShowDocsModal] = useState<boolean>(false);
  const [showApostilaModal, setShowApostilaModal] = useState<boolean>(false);
  const [showOptionalWorkoutsModal, setShowOptionalWorkoutsModal] = useState<boolean>(false);
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'workouts' | 'history' | 'optionals' | 'settings'>('home');

  // Requirement 11: ESC Key closes all modals and returns to Home
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowGymQrModal(false);
        setShowAiCoach(false);
        setShowHistoryModal(false);
        setShowWorkoutManagerModal(false);
        setShowSettingsModal(false);
        setShowProfileManagerModal(false);
        setShowMasterExercisesModal(false);
        setShowDocsModal(false);
        setShowApostilaModal(false);
        setShowOptionalWorkoutsModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenWorkoutManager = (workoutId?: string) => {
    setSelectedWorkoutIdForManager(workoutId);
    setShowWorkoutManagerModal(true);
  };

  const handleOpenMasterExercises = (category?: string) => {
    setSelectedMasterCategory(category);
    setShowMasterExercisesModal(true);
  };

  const handleStartTodayWorkoutFromQr = () => {
    if (!todayWorkout) return;
    startWorkout(todayWorkout.id, true);
  };

  // Theme styling wrapper
  const getThemeWrapperClass = () => {
    switch (theme) {
      case 'oled':
        return 'min-h-screen bg-black text-slate-100 antialiased selection:bg-lime-500 selection:text-black';
      case 'light':
        return 'min-h-screen bg-neutral-100 text-neutral-900 antialiased selection:bg-lime-500 selection:text-black';
      case 'dark':
      default:
        return 'min-h-screen bg-[#0A0A0B] text-slate-100 antialiased selection:bg-lime-500 selection:text-black';
    }
  };

  return (
    <div className={getThemeWrapperClass()}>
      {/* 1. STICKY NAVBAR (Simplified header: Logo, Profile Name/Switcher, Settings Button) */}
      <NavbarHeader
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenProfileManager={() => setShowProfileManagerModal(true)}
      />

      {/* 2. MAIN SCREEN CONTENT (Dashboard when idle, ActiveWorkoutScreen when training) */}
      {!activeWorkout ? (
        <main className="pb-24">
          <HomeDashboard
            onOpenGymQr={() => setShowGymQrModal(true)}
            onOpenWorkoutManager={handleOpenWorkoutManager}
            onOpenOptionalWorkouts={handleOpenMasterExercises}
            onOpenHistory={() => setShowHistoryModal(true)}
            onOpenProfileSettings={() => setShowProfileManagerModal(true)}
            onOpenApostilaGlowUp={() => setShowApostilaModal(true)}
          />
        </main>
      ) : (
        /* 3. MODO ACADEMIA (FOCUS MODE) ACTIVE WORKOUT SCREEN */
        <main className="pb-24">
          <ActiveWorkoutScreen onOpenAiCoach={() => setShowAiCoach(true)} />
        </main>
      )}

      {/* 4. MODALS & DRAWERS */}
      <WorkoutRecoveryModal />

      <ApostilaGlowUpModal
        isOpen={showApostilaModal}
        onClose={() => setShowApostilaModal(false)}
      />

      <GymAccessModal
        isOpen={showGymQrModal}
        onClose={() => setShowGymQrModal(false)}
        onStartTodayWorkout={handleStartTodayWorkoutFromQr}
        initialMode={gymConfig.isCheckedIn ? 'checkout' : 'checkin'}
      />

      {/* Automated Post-Workout Report (Requirement 7) */}
      {pendingFinishedLog && (
        <WorkoutReportModal
          isOpen={Boolean(pendingFinishedLog)}
          onClose={closePostWorkoutModal}
        />
      )}

      <OptionalWorkoutsModal
        isOpen={showOptionalWorkoutsModal}
        onClose={() => setShowOptionalWorkoutsModal(false)}
        selectedCategory={selectedMasterCategory}
      />

      <AICoachDrawer
        isOpen={showAiCoach}
        onClose={() => setShowAiCoach(false)}
      />

      <WorkoutManagerModal
        isOpen={showWorkoutManagerModal}
        onClose={() => setShowWorkoutManagerModal(false)}
        initialWorkoutId={selectedWorkoutIdForManager}
        onOpenPresetLibrary={() => {
          setShowWorkoutManagerModal(false);
          handleOpenMasterExercises('Todos');
        }}
      />

      <HistoryAnalyticsModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onOpenMasterExercises={() => handleOpenMasterExercises('Todos')}
      />

      <ProfileManagerModal
        isOpen={showProfileManagerModal}
        onClose={() => setShowProfileManagerModal(false)}
      />

      <MasterExerciseLibraryModal
        isOpen={showMasterExercisesModal}
        onClose={() => setShowMasterExercisesModal(false)}
        initialCategory={selectedMasterCategory}
      />

      <ArchitectureDocsModal
        isOpen={showDocsModal}
        onClose={() => setShowDocsModal(false)}
      />

      {/* 5. MOBILE BOTTOM NAVIGATION DOCK */}
      <BottomNav
        activeTab={activeNavTab}
        onSelectTab={setActiveNavTab}
        onOpenWorkoutManager={() => handleOpenWorkoutManager()}
        onOpenHistory={() => setShowHistoryModal(true)}
        onOpenOptionalWorkouts={() => handleOpenMasterExercises('Todos')}
        onOpenSettings={() => setShowSettingsModal(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <GymProvider>
      <MainAppContent />
    </GymProvider>
  );
}
