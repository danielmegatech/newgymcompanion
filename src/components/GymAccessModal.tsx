/**
 * Gym Companion v1.0 — Módulo de Acesso à Academia (QR Code)
 * Redesigned to match the layout, card structure, and visual polish of the Workout Confirmation / Report Modal.
 */
import React, { useState, useRef } from 'react';
import {
  X,
  QrCode,
  Upload,
  Trash2,
  Sun,
  CheckCircle2,
  Maximize2,
  Minimize2,
  LogOut,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Clock,
  Zap,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import { DEFAULT_QR_CODE_DATA } from '../data/defaultWorkouts';

interface GymAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTodayWorkout: () => void;
  initialMode?: 'checkin' | 'checkout';
}

export const GymAccessModal: React.FC<GymAccessModalProps> = ({
  isOpen,
  onClose,
  onStartTodayWorkout,
  initialMode = 'checkin',
}) => {
  const {
    gymConfig,
    updateGymQrCode,
    checkInGymWithQrCode,
    checkOutGymWithQrCode,
    todayWorkout,
  } = useGym();

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [mode, setMode] = useState<'checkin' | 'checkout'>(initialMode);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (isOpen && initialMode) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateGymQrCode(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetDefaultQr = () => {
    updateGymQrCode(DEFAULT_QR_CODE_DATA);
  };

  const handleCheckInAndStart = () => {
    checkInGymWithQrCode();
    onClose();
    onStartTodayWorkout();
  };

  const handleCheckOut = () => {
    checkOutGymWithQrCode();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div
        className={`relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] shadow-2xl transition-all ${
          isFullScreen
            ? 'h-[94vh] w-[96vw] max-w-4xl'
            : 'max-h-[92vh] w-full max-w-lg sm:max-w-xl'
        }`}
      >
        {/* Header Badge — Matches Workout Confirmation Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 p-4 sm:p-5 bg-slate-50 dark:bg-[#0A0A0B] shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg transition-colors ${
                mode === 'checkin'
                  ? 'bg-gradient-to-br from-lime-500 to-emerald-400 text-black shadow-lime-500/20'
                  : 'bg-gradient-to-br from-cyan-500 to-blue-500 text-black shadow-cyan-500/20'
              }`}
            >
              {mode === 'checkin' ? (
                <QrCode className="h-6 w-6 stroke-[2.5]" />
              ) : (
                <LogOut className="h-6 w-6 stroke-[2.5]" />
              )}
            </div>
            <div>
              <span
                className={`text-[10px] uppercase font-black tracking-wider block ${
                  mode === 'checkin'
                    ? 'text-lime-600 dark:text-lime-400'
                    : 'text-cyan-600 dark:text-cyan-400'
                }`}
              >
                Catraca & Acesso VIP
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {mode === 'checkin' ? 'Check-in (Entrada)' : 'Check-out (Saída do Ginásio)'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="rounded-xl p-2 bg-slate-200/60 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 transition-colors"
              title={isFullScreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
            >
              {isFullScreen ? (
                <Minimize2 className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-xl bg-slate-200/60 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 p-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 transition-colors"
              title="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs — Clean Toggle */}
        <div className="px-4 sm:px-6 pt-4 shrink-0">
          <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 dark:bg-[#0A0A0B] p-1.5 border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setMode('checkin')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black transition-all ${
                mode === 'checkin'
                  ? 'bg-lime-500 text-black shadow-md shadow-lime-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Check-in (Entrar)</span>
            </button>
            <button
              onClick={() => setMode('checkout')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black transition-all ${
                mode === 'checkout'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LogOut className="h-4 w-4" />
              <span>Check-out (Sair)</span>
            </button>
          </div>
        </div>

        {/* Main Body Content — Scrollable Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Automatic Brightness Boost Alert Banner */}
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500/10 px-4 py-2.5 text-xs font-extrabold text-amber-700 dark:text-amber-300 border border-amber-500/30 text-center">
            <Sun className="h-4 w-4 animate-pulse text-amber-500 shrink-0" />
            <span>Modo Brilho Máximo Ativo (100% luminosidade para o leitor óptico)</span>
          </div>

          {/* High Contrast QR Container Card */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div
              className={`flex items-center justify-center rounded-3xl bg-white p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-white/10 transition-all ${
                isFullScreen ? 'h-80 w-80 sm:h-96 sm:w-96' : 'h-60 w-60 sm:h-68 sm:w-68'
              }`}
            >
              <img
                src={gymConfig.qrCodeDataUrl}
                alt="QR Code da Academia"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="text-center space-y-1">
              <span className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                <Building2 className="h-4 w-4 text-lime-500" />
                <span>{gymConfig.gymName}</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aproxime o código do leitor da catraca
              </p>
            </div>
          </div>

          {/* 3 Metrics Cards Grid — Matches Workout Report Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-50 dark:bg-white/5 p-3.5 border border-slate-200 dark:border-white/10 text-center">
              <ShieldCheck className="h-5 w-5 text-lime-500 mx-auto mb-1" />
              <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Status Catraca</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">Liberado</span>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-white/5 p-3.5 border border-slate-200 dark:border-white/10 text-center">
              <Clock className="h-5 w-5 text-cyan-500 mx-auto mb-1" />
              <span className="text-[10px] uppercase font-extrabold text-slate-400 block">
                {mode === 'checkin' ? 'Último Registro' : 'Tempo Estimado'}
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {mode === 'checkin'
                  ? gymConfig.lastEntryTime || 'Agora'
                  : `${gymConfig.lastVisitDurationMinutes || 75} min`}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl bg-slate-50 dark:bg-white/5 p-3.5 border border-slate-200 dark:border-white/10 text-center">
              <Zap className="h-5 w-5 text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Recompensa</span>
              <span className="text-sm font-black text-amber-500">+50 XP Acesso</span>
            </div>
          </div>

          {/* Custom QR Upload & Reset Section */}
          <div className="rounded-2xl bg-slate-50 dark:bg-[#0A0A0B] p-4 border border-slate-200 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                Gerenciar Código QR
              </span>
              <span className="text-[10px] text-slate-400">Personalizado</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors border border-slate-300 dark:border-white/10"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Carregar Imagem do QR Code</span>
              </button>

              {gymConfig.qrCodeDataUrl !== DEFAULT_QR_CODE_DATA && (
                <button
                  onClick={handleResetDefaultQr}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 px-3.5 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors border border-rose-500/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Restaurar Padrão</span>
                </button>
              )}
            </div>
          </div>

          {/* Official Element Gyms App Links */}
          <div className="rounded-2xl bg-gradient-to-r from-lime-500/10 to-cyan-500/10 p-4 border border-slate-200 dark:border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-lime-600 dark:text-lime-400 flex items-center gap-1.5">
                <Smartphone className="h-4 w-4" />
                <span>Element Gyms • App Oficial</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">QR Mensal</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Caso o código de acesso da academia mude mensalmente, você pode abrir o app oficial para renovar seu QR Code:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              <a
                href="https://play.google.com/store/search?q=Element%20Gyms&c=apps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 px-3 py-2 text-xs font-extrabold text-slate-800 dark:text-white border border-slate-200 dark:border-white/15 transition-all shadow-sm"
              >
                <span>Android</span>
                <ExternalLink className="h-3 w-3 text-lime-600 dark:text-lime-400" />
              </a>
              <a
                href="https://apps.apple.com/pt/search?term=element%20gyms"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 px-3 py-2 text-xs font-extrabold text-slate-800 dark:text-white border border-slate-200 dark:border-white/15 transition-all shadow-sm"
              >
                <span>iPhone</span>
                <ExternalLink className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
              </a>
              <a
                href="https://elementgyms.pt/"
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-200/60 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 transition-all"
              >
                <span>Portal Web</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Actions — Matches Workout Confirmation Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0A0B] shrink-0 space-y-2.5">
          {mode === 'checkin' ? (
            <button
              onClick={handleCheckInAndStart}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-lime-500 hover:bg-lime-400 py-4 text-base font-black text-black shadow-xl shadow-lime-500/20 transition-all active:scale-95"
            >
              <span>ENTRAR NA ACADEMIA & INICIAR {todayWorkout.code} HOJE</span>
              <ChevronRight className="h-5 w-5 stroke-[3]" />
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 py-4 text-base font-black text-black shadow-xl shadow-cyan-500/20 transition-all active:scale-95"
            >
              <span>FAZER CHECK-OUT & LIBERAR SAÍDA 🚪</span>
              <ChevronRight className="h-5 w-5 stroke-[3]" />
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-200/60 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 transition-colors"
          >
            <span>FECHAR JANELA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
