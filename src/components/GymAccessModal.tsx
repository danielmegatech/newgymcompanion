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
  ChevronDown,
  ShieldCheck,
  Building2,
  Zap,
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
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div
        className={`relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] shadow-2xl transition-all w-full ${
          isFullScreen
            ? 'h-[94vh] max-w-2xl'
            : 'max-h-[92vh] max-w-md'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 p-3.5 sm:p-4 bg-slate-50 dark:bg-[#0A0A0B] shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg transition-colors ${
                mode === 'checkin'
                  ? 'bg-gradient-to-br from-lime-500 to-emerald-400 text-black shadow-lime-500/20'
                  : 'bg-gradient-to-br from-cyan-500 to-blue-500 text-black shadow-cyan-500/20'
              }`}
            >
              {mode === 'checkin' ? (
                <QrCode className="h-5 w-5 stroke-[2.5]" />
              ) : (
                <LogOut className="h-5 w-5 stroke-[2.5]" />
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
                Catraca & Ginásio
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                {mode === 'checkin' ? 'Check-in (Entrada)' : 'Check-out (Saída)'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="rounded-xl p-2 bg-slate-200/60 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              title={isFullScreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
            >
              {isFullScreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-xl bg-slate-200/60 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 p-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 transition-colors min-h-[40px] min-w-[40px]"
              title="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-3.5 sm:px-5 pt-3 shrink-0">
          <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 dark:bg-[#0A0A0B] p-1.5 border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setMode('checkin')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black transition-all min-h-[44px] ${
                mode === 'checkin'
                  ? 'bg-lime-500 text-black shadow-md shadow-lime-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Entrada (Check-in)</span>
            </button>
            <button
              onClick={() => setMode('checkout')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black transition-all min-h-[44px] ${
                mode === 'checkout'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LogOut className="h-4 w-4" />
              <span>Saída (Check-out)</span>
            </button>
          </div>
        </div>

        {/* Main Body Content */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {/* Automatic Brightness Boost Alert Banner */}
          <div className="flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 px-3 py-1.5 text-[11px] font-extrabold text-amber-700 dark:text-amber-300 border border-amber-500/30 text-center">
            <Sun className="h-3.5 w-3.5 animate-pulse text-amber-500 shrink-0" />
            <span>Brilho Máximo Ativo para o leitor da catraca</span>
          </div>

          {/* High Contrast QR Container Card */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div
              className={`flex items-center justify-center rounded-3xl bg-white p-3 sm:p-4 shadow-2xl border-2 border-lime-500/30 transition-all ${
                isFullScreen ? 'h-72 w-72 sm:h-80 sm:w-80' : 'h-52 w-52 sm:h-60 sm:w-60'
              }`}
            >
              <img
                src={gymConfig.qrCodeDataUrl}
                alt="QR Code da Academia"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="text-center space-y-0.5">
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                <Building2 className="h-4 w-4 text-lime-500" />
                <span>{gymConfig.gymName}</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Aproxime o código do sensor óptico da catraca
              </p>
            </div>
          </div>

          {/* Compact Quick Status Strip */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-white/5 p-2.5 border border-slate-200 dark:border-white/10">
              <ShieldCheck className="h-4 w-4 text-lime-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-extrabold text-slate-400 block truncate">Catraca</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">Liberada</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-white/5 p-2.5 border border-slate-200 dark:border-white/10">
              <Zap className="h-4 w-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-extrabold text-slate-400 block truncate">Recompensa</span>
                <span className="text-xs font-black text-amber-500">+50 XP</span>
              </div>
            </div>
          </div>

          {/* Collapsible Advanced Settings (Upload custom QR, Official Apps) */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-[#0A0A0B]">
            <button
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="w-full flex items-center justify-between p-3 text-xs font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <span>⚙️ Opções & Apps Oficiais</span>
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  showAdvancedSettings ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {showAdvancedSettings && (
              <div className="p-3.5 border-t border-slate-200 dark:border-white/10 space-y-3">
                {/* Upload Section */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                    Atualizar Imagem do QR Code:
                  </span>
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
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors border border-slate-300 dark:border-white/10 min-h-[40px]"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Carregar Novo QR Code</span>
                    </button>
                    {gymConfig.qrCodeDataUrl !== DEFAULT_QR_CODE_DATA && (
                      <button
                        onClick={handleResetDefaultQr}
                        className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors border border-rose-500/30 min-h-[40px]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Restaurar</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Store Links */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-white/5">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Smartphone className="h-3.5 w-3.5 text-lime-500" />
                    <span>App Oficial Element Gyms:</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href="https://play.google.com/store/search?q=Element%20Gyms&c=apps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 px-2.5 py-2 text-xs font-extrabold text-slate-800 dark:text-white border border-slate-200 dark:border-white/15 transition-all shadow-sm min-h-[40px]"
                    >
                      <span>Android</span>
                      <ExternalLink className="h-3 w-3 text-lime-500" />
                    </a>
                    <a
                      href="https://apps.apple.com/pt/search?term=element%20gyms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 px-2.5 py-2 text-xs font-extrabold text-slate-800 dark:text-white border border-slate-200 dark:border-white/15 transition-all shadow-sm min-h-[40px]"
                    >
                      <span>iPhone</span>
                      <ExternalLink className="h-3 w-3 text-cyan-500" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0A0B] shrink-0 space-y-2">
          {mode === 'checkin' ? (
            <button
              onClick={handleCheckInAndStart}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-lime-500 hover:bg-lime-400 py-3.5 px-4 text-sm sm:text-base font-black text-black shadow-xl shadow-lime-500/20 transition-all active:scale-95 min-h-[50px]"
            >
              <span>LIBERAR & INICIAR {todayWorkout.code}</span>
              <ChevronRight className="h-5 w-5 stroke-[3]" />
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 py-3.5 px-4 text-sm sm:text-base font-black text-black shadow-xl shadow-cyan-500/20 transition-all active:scale-95 min-h-[50px]"
            >
              <span>FAZER CHECK-OUT & LIBERAR SAÍDA 🚪</span>
              <ChevronRight className="h-5 w-5 stroke-[3]" />
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-200/60 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 transition-colors min-h-[40px]"
          >
            <span>FECHAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};

