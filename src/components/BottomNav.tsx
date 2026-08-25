/**
 * Gym Companion — Mobile Bottom Navigation Bar
 * One-handed mobile navigation dock for Gym Companion.
 * Allows quick tap access to Home, Fichas, Histórico, Opcionais, and Configurações.
 */

import React from 'react';
import { Home, Dumbbell, History, Sparkles, Settings, Play } from 'lucide-react';
import { useGym } from '../context/GymContext';

interface BottomNavProps {
  activeTab: 'home' | 'workouts' | 'history' | 'optionals' | 'settings';
  onSelectTab: (tab: 'home' | 'workouts' | 'history' | 'optionals' | 'settings') => void;
  onOpenWorkoutManager: () => void;
  onOpenHistory: () => void;
  onOpenOptionalWorkouts: () => void;
  onOpenSettings: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenWorkoutManager,
  onOpenHistory,
  onOpenOptionalWorkouts,
  onOpenSettings,
}) => {
  const { activeWorkout, todayWorkout, startWorkout } = useGym();

  // If user is currently in active workout, show the Gym Focus Mode mini-bar
  if (activeWorkout) {
    return null; // ActiveWorkoutScreen has its own gym focus controls
  }

  const items = [
    {
      id: 'home' as const,
      label: 'Início',
      icon: <Home className="h-5 w-5" />,
      action: () => onSelectTab('home'),
    },
    {
      id: 'workouts' as const,
      label: 'Fichas',
      icon: <Dumbbell className="h-5 w-5" />,
      action: () => {
        onSelectTab('workouts');
        onOpenWorkoutManager();
      },
    },
    {
      id: 'history' as const,
      label: 'Histórico',
      icon: <History className="h-5 w-5" />,
      action: () => {
        onSelectTab('history');
        onOpenHistory();
      },
    },
    {
      id: 'optionals' as const,
      label: 'Banco',
      icon: <Sparkles className="h-5 w-5" />,
      action: () => {
        onSelectTab('optionals');
        onOpenOptionalWorkouts();
      },
    },
    {
      id: 'settings' as const,
      label: 'Ajustes',
      icon: <Settings className="h-5 w-5" />,
      action: () => {
        onSelectTab('settings');
        onOpenSettings();
      },
    },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0F0F11]/95 backdrop-blur-xl px-2 pt-2 shadow-2xl transition-colors"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-1 flex-col items-center justify-center py-1 px-1 rounded-xl min-h-[48px] min-w-[48px] transition-all active:scale-95 ${
                isActive
                  ? 'text-lime-600 dark:text-lime-400 font-black'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? 'bg-lime-500/20 text-lime-600 dark:text-lime-400 border border-lime-500/40 shadow-lg shadow-lime-500/10'
                    : 'bg-transparent'
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] font-extrabold tracking-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
