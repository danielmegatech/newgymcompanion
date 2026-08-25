/**
 * Gym Companion v2.0 — Header Component (Single User Personal Edition)
 * Displays:
 * 1. Logo Gym Companion
 * 2. Perfil do Atleta (Foto + Nome) -> Abre o Painel Pessoal do Atleta
 * 3. Botão Configurações & Presets
 */

import React from 'react';
import { Dumbbell, Settings, User, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { useGym } from '../context/GymContext';

interface NavbarHeaderProps {
  onOpenSettings: () => void;
  onOpenProfileManager: () => void;
}

export const NavbarHeader: React.FC<NavbarHeaderProps> = ({
  onOpenSettings,
  onOpenProfileManager,
}) => {
  const { activeProfile, syncState, forceFullCloudSync } = useGym();
  const [isManualSyncing, setIsManualSyncing] = React.useState(false);

  const handleSyncClick = async () => {
    setIsManualSyncing(true);
    await forceFullCloudSync();
    setTimeout(() => setIsManualSyncing(false), 800);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0F0F11]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 h-16 py-2">
        {/* 1. Logo Gym Companion */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-500 text-black shadow-lg shadow-lime-500/20">
            <Dumbbell className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black tracking-tight uppercase text-slate-900 dark:text-white leading-none">
                Gym Companion
              </h1>
            </div>
            <span className="text-[10px] font-bold text-lime-600 dark:text-lime-400 tracking-wider">
              Glow Up 2026
            </span>
          </div>
        </div>

        {/* Right Section: Sync Status, Profile & Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Sync Status Indicator */}
          <button
            onClick={handleSyncClick}
            disabled={isManualSyncing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all active:scale-95 min-h-[44px]"
            title={
              syncState?.status === 'syncing' || isManualSyncing
                ? 'Sincronizando dados com a nuvem...'
                : syncState?.status === 'error'
                ? `Erro de sincronização: ${syncState.errorMessage || 'Verifique conexão'}`
                : 'Sincronizado em tempo real na Nuvem Firestore (Toque para sincronizar)'
            }
          >
            {syncState?.status === 'syncing' || isManualSyncing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 text-lime-500 animate-spin" />
                <span className="hidden md:inline text-[11px] font-bold text-lime-600 dark:text-lime-400">Sincronizando</span>
              </>
            ) : syncState?.status === 'error' ? (
              <>
                <CloudOff className="h-3.5 w-3.5 text-rose-500" />
                <span className="hidden md:inline text-[11px] font-bold text-rose-500">Offline</span>
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                </span>
                <Cloud className="h-3.5 w-3.5 text-lime-500" />
                <span className="hidden md:inline text-[11px] font-bold text-slate-700 dark:text-slate-300">Nuvem Ativa</span>
              </>
            )}
          </button>

          {/* 2. Botão Perfil Pessoal */}
          <button
            onClick={onOpenProfileManager}
            className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 px-2.5 sm:px-3 py-1.5 transition-all active:scale-95 min-h-[44px]"
            title="Meu Perfil & Biometria"
          >
            {activeProfile?.avatarUrl ? (
              <img
                src={activeProfile.avatarUrl}
                alt={activeProfile.name || 'Usuário'}
                className="h-7 w-7 rounded-full object-cover border border-lime-500/40 shrink-0"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            )}
            <div className="text-left hidden sm:block">
              <span className="block text-xs font-black text-slate-900 dark:text-white leading-tight">
                {activeProfile?.name || 'Daniel'}
              </span>
              <span className="block text-[10px] text-lime-600 dark:text-lime-400 font-semibold leading-tight truncate max-w-[120px]">
                {activeProfile?.goal || 'Glow Up 2026'}
              </span>
            </div>
          </button>

          {/* 3. Botão Configurações */}
          <button
            onClick={onOpenSettings}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 min-h-[44px] min-w-[44px]"
            title="Configurações & Ajustes"
            aria-label="Configurações"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
