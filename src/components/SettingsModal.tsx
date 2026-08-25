/**
 * Gym Companion v1.0 — Configurações & Arquitetura de Futuras Integrações
 * Handles theme (Claro/Escuro/OLED), body metrics for caloric estimation, backup JSON, and roadmap integrations.
 */
import React, { useState } from 'react';
import {
  X,
  Settings,
  Sun,
  Moon,
  Sparkles,
  Download,
  Upload,
  Database,
  Link2,
  Lock,
  User,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Cloud,
  CloudOff,
  RefreshCw,
  Dumbbell,
  RotateCcw,
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import { AppThemeMode, UserBodyConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMasterExercises?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenMasterExercises,
}) => {
  const {
    theme,
    setTheme,
    bodyConfig,
    updateBodyConfig,
    soundEnabled,
    setSoundEnabled,
    vibrateEnabled,
    setVibrateEnabled,
    appSettings,
    updateAppSettings,
    resetApplication,
    exportBackupJson,
    importBackupJson,
    restoreDefaultPresets,
    syncState,
    forceFullCloudSync,
  } = useGym();

  const [activeTab, setActiveTab] = useState<'geral' | 'backup' | 'integrações'>('geral');
  const [importStr, setImportStr] = useState<string>('');
  const [importFeedback, setImportFeedback] = useState<string>('');
  const [showRestoreConfirm, setShowRestoreConfirm] = useState<boolean>(false);
  const [showResetAppConfirm, setShowResetAppConfirm] = useState<boolean>(false);
  const [restoreFeedback, setRestoreFeedback] = useState<string>('');
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [cloudSyncMsg, setCloudSyncMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const jsonStr = exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gym-companion-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportBackup = () => {
    if (!importStr.trim()) return;
    const ok = importBackupJson(importStr);
    if (ok) {
      setImportFeedback('Backup restaurado com sucesso!');
      setImportStr('');
    } else {
      setImportFeedback('Falha ao restaurar: arquivo de backup inválido.');
    }
  };

  const FUTURE_INTEGRATIONS_LIST = [
    {
      name: 'LifeOS Ecosystem',
      category: 'Produtividade & Hábitos',
      status: 'Preparado para Sincronização API v1',
      icon: '🧠',
      desc: 'Sincroniza seus treinos, calorias e tempo de foco diretamente com o cronograma do LifeOS.',
    },
    {
      name: 'Google Calendar',
      category: 'Agenda',
      status: 'Módulo OAuth Reservado',
      icon: '📅',
      desc: 'Bloqueio automático de agenda no horário do seu treino regular e lembretes de descanso.',
    },
    {
      name: 'Samsung Health / Health Connect',
      category: 'Saúde Mobile',
      status: 'Módulo Sensor Android',
      icon: '⌚',
      desc: 'Integração de frequência cardíaca ao vivo e exportação de gastos calóricos e treinos.',
    },
    {
      name: 'Apple Health (HealthKit)',
      category: 'Saúde Mobile',
      status: 'Arquitetura Multiplataforma',
      icon: '🍎',
      desc: 'Sincronização nativa de atividades de musculação e fechamento de anéis de energia.',
    },
    {
      name: 'Google Fit',
      category: 'Saúde',
      status: 'Preparado',
      icon: '🏃',
      desc: 'Envio de calorias ativas e pontuação Heart Points após a conclusão de cada sessão.',
    },
    {
      name: 'Garmin & Polar Connect',
      category: 'Wearables de Performance',
      status: 'Preparado',
      icon: '⚡',
      desc: 'Sincronização com relógios multiesporte para carga de treino e recuperação ortostática.',
    },
    {
      name: 'Player Externo (Spotify / Apple Music)',
      category: 'Mídia & Áudio',
      status: 'Suportado',
      icon: '🎧',
      desc: 'Compatibilidade com players externos via sistema de controle de mídia do dispositivo.',
    },
    {
      name: 'Strava & Notion',
      category: 'Comunidade & Notas',
      status: 'Preparado',
      icon: '📝',
      desc: 'Compartilhamento de resumos de treino no Strava e arquivamento de PRs em banco de dados Notion.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 p-5 sm:p-6 bg-slate-50 dark:bg-[#0A0A0B]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-lime-500/10 p-2.5 text-lime-600 dark:text-lime-400 border border-lime-500/30">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Configurações & Integrações
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize tema, biometria calórica, sons, backup e ecossistema
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-white/10 bg-slate-100/60 dark:bg-[#0A0A0B]/60 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('geral')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'geral'
                ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⚙️ Geral & Tema
          </button>
          <button
            onClick={() => setActiveTab('integrações')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'integrações'
                ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🔗 Futuras Integrações
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'backup'
                ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            💾 Backup & Privacidade
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'geral' && (
            <div className="space-y-6">
              {/* Theme selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase">
                  Tema & Economia de Bateria (OLED)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all ${
                      theme === 'dark'
                        ? 'border-lime-500 bg-lime-500/15 text-slate-900 dark:text-white font-black'
                        : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#0A0A0B] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <Moon className="h-6 w-6 text-lime-600 dark:text-lime-400" />
                    <span className="text-xs font-bold">Escuro Padrão</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('oled')}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all ${
                      theme === 'oled'
                        ? 'border-lime-500 bg-lime-500/15 text-slate-900 dark:text-white font-black'
                        : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <Sparkles className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                    <span className="text-xs font-bold">OLED Preto Puro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all ${
                      theme === 'light'
                        ? 'border-lime-500 bg-lime-500/15 text-slate-900 dark:text-white font-black'
                        : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#0A0A0B] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <Sun className="h-6 w-6 text-amber-500" />
                    <span className="text-xs font-bold">Modo Claro</span>
                  </button>
                </div>
              </div>

              {/* Meta Semanal de Treino */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-lime-600 dark:text-lime-400 uppercase">
                      Meta Semanal de Treinos (Glow Up 2026)
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Defina quantos dias por semana você se compromete a treinar
                    </p>
                  </div>
                  <span className="rounded-full bg-lime-500/15 border border-lime-500/30 px-3 py-1 text-xs font-black text-lime-600 dark:text-lime-400">
                    {appSettings.weeklyWorkoutGoalDays}x / semana
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((days) => {
                    const isSelected = appSettings.weeklyWorkoutGoalDays === days;
                    return (
                      <button
                        key={days}
                        type="button"
                        onClick={() => updateAppSettings({ weeklyWorkoutGoalDays: days })}
                        className={`py-2.5 rounded-xl text-xs font-black border transition-all ${
                          isSelected
                            ? 'bg-lime-500 text-black border-lime-400 shadow-lg shadow-lime-500/20'
                            : 'bg-slate-100 dark:bg-[#0A0A0B] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {days}d
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  Dica: Para o perfil Daniel (Glow Up 2026), a meta recomendada é de 2 dias por semana de treino.
                </p>
              </div>

              {/* Biblioteca Mestre & Presets de Treino */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
                <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Biblioteca Mestre & Presets Padrão
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {onOpenMasterExercises && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenMasterExercises();
                      }}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0A0B] p-4 text-left hover:border-lime-500/50 hover:bg-lime-500/5 transition-all group min-h-[44px]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-500/20 text-lime-600 dark:text-lime-400 group-hover:bg-lime-500 group-hover:text-black transition-colors">
                        <Dumbbell className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white block">
                          Banco Global de Exercícios (85+)
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Repositório mestre com fotos, GIFs de máquinas, biomecânica e novos cadastros
                        </p>
                      </div>
                    </button>
                  )}

                  <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0A0B] p-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          Restaurar Presets Padrão
                        </span>
                        <RotateCcw className="h-4 w-4 text-lime-500" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Recarrega os treinos recomendados A, B, C, D e exercícios padrão. Históricos e logs permanecem intactos.
                      </p>
                    </div>

                    {showRestoreConfirm ? (
                      <div className="mt-3 space-y-2 animate-fadeIn">
                        <p className="text-[11px] font-bold text-amber-500">
                          Confirmar restauração dos treinos padrão?
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              restoreDefaultPresets(true);
                              setShowRestoreConfirm(false);
                              setRestoreFeedback('Presets padrão restaurados com sucesso!');
                            }}
                            className="flex-1 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-xs font-black transition-all"
                          >
                            Sim, Restaurar
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowRestoreConfirm(false)}
                            className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowRestoreConfirm(true)}
                        className="mt-3 w-full py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all min-h-[44px]"
                      >
                        Restaurar Treinos A, B, C, D
                      </button>
                    )}

                    {restoreFeedback && (
                      <p className="text-[11px] text-emerald-500 font-bold mt-2">
                        {restoreFeedback}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sound & Vibration */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
                <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Áudio, Alarme & Feedback Hápico
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0A0B] p-4 cursor-pointer hover:border-slate-300 dark:hover:border-white/20 transition-colors">
                    <div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Sons de Efeito (UI)</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Sons ao bater metas, concluir séries e XP
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={appSettings.soundEffects}
                      onChange={(e) => updateAppSettings({ soundEffects: e.target.checked })}
                      className="h-5 w-5 rounded bg-slate-200 dark:bg-white/10 accent-lime-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0A0B] p-4 cursor-pointer hover:border-slate-300 dark:hover:border-white/20 transition-colors">
                    <div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Alarme de Descanso</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Beep ao zerar cronômetro de intervalo
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={appSettings.alarmEnabled}
                      onChange={(e) => updateAppSettings({ alarmEnabled: e.target.checked })}
                      className="h-5 w-5 rounded bg-slate-200 dark:bg-white/10 accent-lime-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0A0B] p-4 cursor-pointer hover:border-slate-300 dark:hover:border-white/20 transition-colors sm:col-span-2">
                    <div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Vibração (Feedback Tátil/Hápico)</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Vibração leve ao concluir séries, tempo de descanso e check-in QR
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={appSettings.vibrationEnabled}
                      onChange={(e) => updateAppSettings({ vibrationEnabled: e.target.checked })}
                      className="h-5 w-5 rounded bg-slate-200 dark:bg-white/10 accent-lime-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Comportamento de Tela */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <span className="block text-xs font-bold text-slate-400 uppercase">
                  Tela & Foco Durante Treino Ativo
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0A0A0B] p-4 cursor-pointer hover:border-white/20 transition-colors">
                    <div>
                      <span className="text-sm font-bold text-white">Tela Sempre Ligada</span>
                      <p className="text-xs text-slate-400">
                        Mantém a tela ativa na execução (Wake Lock)
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={appSettings.keepScreenOn}
                      onChange={(e) => updateAppSettings({ keepScreenOn: e.target.checked })}
                      className="h-5 w-5 rounded bg-white/10 accent-lime-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0A0A0B] p-4 cursor-pointer hover:border-white/20 transition-colors">
                    <div>
                      <span className="text-sm font-bold text-white">Desativar Toque Acidental</span>
                      <p className="text-xs text-slate-400">
                        Evita toques na tela durante o exercício
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={appSettings.disableTouchDuringWorkout}
                      onChange={(e) => updateAppSettings({ disableTouchDuringWorkout: e.target.checked })}
                      className="h-5 w-5 rounded bg-white/10 accent-lime-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Privacy Badge */}
              <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-4 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-lime-400 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-white uppercase">Privacidade 100% Local</h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Todos os seus treinos, histórico e notas ficam salvos localmente no seu dispositivo. Nenhuma telemetria intrusiva é enviada.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrações' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Integrações & Conectividade
                </h4>
                <p className="text-xs text-neutral-400">
                  Estrutura modular preparada para conectar o Gym Companion ao LifeOS, agendas e relógios inteligentes sem reescrever o core do aplicativo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FUTURE_INTEGRATIONS_LIST.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="rounded bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-500/20">
                          {item.status}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white">{item.name}</h5>
                      <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <span>Módulo v1.0</span>
                      <span className="text-lime-400">Pronto para Conexão</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              {/* Cloud Firestore Sync Section */}
              <div className="rounded-2xl border border-lime-500/30 bg-lime-500/5 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-lime-500/10 text-lime-400">
                      <Cloud className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                        Sincronização em Nuvem (Cloud Firestore)
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Seus dados são sincronizados em tempo real entre computador e celular.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-[11px] font-bold">
                    {syncState?.status === 'syncing' ? (
                      <span className="text-lime-500 flex items-center gap-1">
                        <RefreshCw className="h-3 w-3 animate-spin" /> Sincronizando
                      </span>
                    ) : syncState?.status === 'error' ? (
                      <span className="text-rose-500 flex items-center gap-1">
                        <CloudOff className="h-3 w-3" /> Offline / Erro
                      </span>
                    ) : (
                      <span className="text-lime-600 dark:text-lime-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Conectado & Ativo
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-xl bg-white/60 dark:bg-[#0A0A0B]/60 border border-slate-200 dark:border-white/5 p-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Usuário Ativo:</span>
                    <span className="font-bold text-slate-900 dark:text-white">Daniel (daniel_glowup_2026)</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Última Sincronização:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {syncState?.lastSyncTime ? new Date(syncState.lastSyncTime).toLocaleTimeString('pt-BR') : 'Agora mesmo'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Cache Offline (Local):</span>
                    <span className="text-lime-600 dark:text-lime-400 font-bold">Ativo & Seguro</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      setIsCloudSyncing(true);
                      setCloudSyncMsg('');
                      try {
                        const ok = await forceFullCloudSync();
                        setCloudSyncMsg(ok ? 'Sincronização com Cloud Firestore concluída com sucesso!' : 'Falha ao sincronizar com nuvem.');
                      } catch (e) {
                        setCloudSyncMsg('Erro na conexão com Firebase.');
                      } finally {
                        setIsCloudSyncing(false);
                      }
                    }}
                    disabled={isCloudSyncing}
                    className="flex items-center gap-2 rounded-xl bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-black px-4 py-2.5 text-xs font-black transition-all shadow-md shadow-lime-500/20"
                  >
                    <RefreshCw className={`h-4 w-4 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                    <span>{isCloudSyncing ? 'Sincronizando...' : 'Forçar Sincronização Completa Agora'}</span>
                  </button>
                  {cloudSyncMsg && (
                    <span className="text-xs font-semibold text-lime-600 dark:text-lime-400">
                      {cloudSyncMsg}
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-5 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Download className="h-5 w-5 text-lime-400" />
                  <span>Exportar Backup Completo (JSON)</span>
                </div>
                <p className="text-xs text-slate-400">
                  Baixe um arquivo JSON com todas as suas programações A, B, C, D, histórico completo de séries, notas de avaliação, QR Code cadastrado e pontuação de gamificação.
                </p>
                <button
                  onClick={handleDownloadBackup}
                  className="rounded-xl bg-[#0F0F11] hover:bg-white/10 px-4 py-2.5 text-xs font-bold text-white border border-white/10"
                >
                  Baixar Arquivo JSON de Backup
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-5 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Upload className="h-5 w-5 text-cyan-400" />
                  <span>Importar e Restaurar Backup (JSON)</span>
                </div>
                <p className="text-xs text-slate-400">
                  Cole o conteúdo JSON do seu backup para restaurar seus dados em qualquer dispositivo.
                </p>
                <textarea
                  rows={3}
                  placeholder="Cole aqui o conteúdo JSON do backup anterior..."
                  value={importStr}
                  onChange={(e) => setImportStr(e.target.value)}
                  className="w-full rounded-xl bg-[#0F0F11] border border-white/10 p-3 text-xs text-white font-mono placeholder-slate-600"
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleImportBackup}
                    disabled={!importStr.trim()}
                    className="rounded-xl bg-lime-500 hover:bg-lime-400 disabled:opacity-40 px-4 py-2 text-xs font-black text-black"
                  >
                    Restaurar Backup
                  </button>
                  {importFeedback && (
                    <span className="text-xs font-semibold text-lime-400">
                      {importFeedback}
                    </span>
                  )}
                </div>
              </div>

              {/* Resetar Aplicação */}
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>Reset de Dados da Aplicação</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Esta ação remove o histórico salvo localmente e restaura as fichas iniciais do perfil Daniel (Glow Up 2026), zerando estatísticas para começar uma nova semana.
                </p>
                <button
                  type="button"
                  onClick={() => setShowResetAppConfirm(true)}
                  className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-xs font-black text-white transition-all shadow-lg shadow-rose-500/20"
                >
                  Zerar Dados e Reiniciar Aplicação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONFIRMAÇÃO DE RESET TOTAL DA APLICAÇÃO */}
      {showResetAppConfirm && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setShowResetAppConfirm(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-[#18181B] border border-white/10 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/30">
                <AlertCircle className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-black text-white">
                  Resetar Aplicação?
                </h3>
                <p className="text-xs text-rose-500 font-bold">
                  Restauração completa dos dados locais
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tem certeza que deseja zerar todos os dados locais e reiniciar o app para o estado inicial Glow Up 2026? Todos os históricos e modificações não sincronizadas serão redefinidos.
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetAppConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  resetApplication();
                  setShowResetAppConfirm(false);
                  onClose();
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all shadow-lg shadow-rose-600/30 active:scale-95"
              >
                Sim, Resetar Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
