/**
 * Gym Companion — Active Workout Screen / Gym Focus Mode (Visual & UX Upgrade)
 * Specialized for gym environment use: High visibility, huge touch targets (52px+),
 * giant primary action button, circular rest timer ring with clear text states,
 * load suggestion banner, and discreet secondary controls.
 */

import React, { useState, useEffect } from 'react';
import {
  Check,
  Plus,
  Minus,
  SkipForward,
  Clock,
  Sparkles,
  Info,
  Flame,
  XCircle,
  TrendingUp,
  Film,
  Activity,
  Pause,
  Play,
  Settings2,
  AlertTriangle,
  RotateCcw,
  Zap,
  CheckCircle2,
  Maximize2,
  Minimize2,
  X,
  ExternalLink,
  Sliders,
  Image as ImageIcon,
  HelpCircle,
  Sun,
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import { useScreenLock } from '../hooks/useScreenLock';
import { soundGenerator } from '../utils/audio';
import { ExerciseMediaModal } from './ExerciseMediaModal';
import { WarmUpSequenceModal } from './WarmUpSequenceModal';
import { MediaCarousel } from './MediaCarousel';

interface ActiveWorkoutScreenProps {
  onOpenAiCoach: () => void;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({
  onOpenAiCoach,
}) => {
  const {
    activeWorkout,
    completeCurrentSet,
    adjustCurrentWeight,
    setCurrentWeightDirect,
    applySuggestedWeight,
    adjustCurrentReps,
    markCurrentExerciseBusy,
    cancelCurrentExercise,
    pauseWorkout,
    resumeWorkout,
    finishWorkout,
    cancelWorkout,
    restSecondsRemaining,
    addRestTime,
    skipRestTime,
    soundEnabled,
    vibrateEnabled,
  } = useGym();

  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [showFinishModal, setShowFinishModal] = useState<boolean>(false);
  const [mediaViewMode, setMediaViewMode] = useState<
    'anim' | 'photo' | 'regulagem1' | 'regulagem2' | 'muscle'
  >('anim');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isWarmUpModalOpen, setIsWarmUpModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Screen Always-On (WakeLock) and Fullscreen Mode Hook
  const { isLocked, isFullscreen, toggleFullscreen } = useScreenLock({ enabled: true });

  const currentExercise =
    activeWorkout?.exercisesQueue[activeWorkout?.currentExerciseIndex] ||
    activeWorkout?.exercisesQueue[0];

  // Sound/Vibration in last 5 seconds of rest and when rest finishes
  useEffect(() => {
    if (activeWorkout?.restTimerActive) {
      if (restSecondsRemaining === 0) {
        if (soundEnabled) {
          soundGenerator.playAlarmBeepSequence();
        }
        if (vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([300, 150, 300, 150, 400]);
        }
      } else if (restSecondsRemaining <= 5 && restSecondsRemaining > 0) {
        if (soundEnabled) {
          soundGenerator.playTimerBeep();
        }
        if (vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([100, 100, 100]);
        }
      }
    }
  }, [restSecondsRemaining, activeWorkout?.restTimerActive, soundEnabled, vibrateEnabled]);

  if (!activeWorkout || !currentExercise) return null;

  // Calculate workout progress
  const totalExercises = activeWorkout.exercisesQueue.length;
  const currentExNum = activeWorkout.currentExerciseIndex + 1;
  const progressPercent = Math.round((currentExNum / totalExercises) * 100);

  const setNumber = activeWorkout.currentSetNumber || (currentExercise.completedSetsCount || 0) + 1;
  const totalSets = activeWorkout.totalSetsForCurrentExercise || currentExercise.targetSets || currentExercise.sets || 4;

  // Calculate estimated finish time
  const remainingCurrentSets = Math.max(0, totalSets - setNumber + 1);
  let totalRemainingSets = remainingCurrentSets;
  for (let i = activeWorkout.currentExerciseIndex + 1; i < activeWorkout.exercisesQueue.length; i++) {
    const ex = activeWorkout.exercisesQueue[i];
    totalRemainingSets += ex.targetSets || ex.sets || 4;
  }
  const remainingMinutes = Math.ceil(totalRemainingSets * 1.5);
  const finishTimeDate = new Date(Date.now() + remainingMinutes * 60000);
  const finishTimeStr = finishTimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Rest Timer Circle Math
  const totalRest = activeWorkout.totalRestSeconds || 60;
  const restRatio = Math.max(0, Math.min(1, restSecondsRemaining / totalRest));
  const circleRadius = 75;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleDashOffset = circleCircumference * (1 - restRatio);

  // Dynamic color for timer ring
  const getTimerColor = () => {
    if (restSecondsRemaining === 0) return '#10b981'; // Emerald complete
    if (restRatio > 0.35) return '#84cc16'; // Lime green
    if (restRatio > 0.15) return '#f59e0b'; // Amber yellow
    return '#f43f5e'; // Rose red
  };

  const getTimerTextStatus = () => {
    if (restSecondsRemaining === 0) return '🔔 ALARME • DESCANSO CONCLUÍDO!';
    if (restSecondsRemaining <= 10) return '⚡ DESCANSO TERMINANDO!';
    return 'DESCANSO EM ANDAMENTO...';
  };

  return (
    <div className="mx-auto max-w-4xl px-2.5 sm:px-4 py-2 space-y-2.5 sm:space-y-4 animate-fadeIn pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))]">
      {/* 1. GYM FOCUS MODE HEADER */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0F0F11] p-3 sm:p-4 shadow-xl space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-lime-500 text-black font-black text-base sm:text-lg shadow-lg shadow-lime-500/20">
              {activeWorkout.workoutCode}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase text-lime-400 tracking-wider block truncate">
                MODO ACADEMIA FOCUS • {activeWorkout.workoutName}
              </span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-black text-white">
                <span>Exercício {currentExNum} de {totalExercises}</span>
                <span className="text-lime-400">• {progressPercent}% Concluído</span>
                <span className="text-cyan-400 flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                  <Clock className="h-3 w-3" />
                  Previsão: {finishTimeStr} (~{remainingMinutes} min)
                </span>
                {isLocked && (
                  <span className="text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20" title="Tela sempre acesa ativa durante o treino">
                    <Sun className="h-3 w-3 animate-pulse" />
                    Tela Sempre Acesa
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Controls Right */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Fullscreen Mode Toggle */}
            <button
              onClick={toggleFullscreen}
              className={`flex items-center justify-center gap-1.5 min-h-[48px] min-w-[48px] rounded-xl border px-3 py-2 text-xs font-bold active:scale-95 transition-all ${
                isFullscreen
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 shadow-sm shadow-violet-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
              title={isFullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia (Tela sempre acesa)'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-4 w-4 text-violet-400" />
                  <span className="hidden sm:inline">Sair Tela Cheia</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4 text-slate-300" />
                  <span className="hidden sm:inline">Tela Cheia</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsWarmUpModalOpen(true)}
              className="flex items-center justify-center gap-1.5 min-h-[48px] rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-400 border border-amber-500/40 px-3 py-2 text-xs font-black shadow-md shadow-amber-500/10 active:scale-95 transition"
              title="Sugerir e guiar aquecimento dinâmico de 5 minutos"
            >
              <Flame className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Aquecer</span>
            </button>

            {activeWorkout.isPaused ? (
              <button
                onClick={resumeWorkout}
                className="flex items-center justify-center gap-1 min-h-[48px] rounded-xl bg-lime-500/20 text-lime-400 border border-lime-500/40 px-3 py-2 text-xs font-bold active:scale-95"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Continuar</span>
              </button>
            ) : (
              <button
                onClick={pauseWorkout}
                className="flex items-center justify-center gap-1 min-h-[48px] rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-3 py-2 text-xs font-bold active:scale-95"
              >
                <Pause className="h-4 w-4" />
                <span>Pausar</span>
              </button>
            )}

            <button
              onClick={() => setShowFinishModal(true)}
              className="min-h-[48px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-3.5 py-2 text-xs font-black active:scale-95"
            >
              Finalizar
            </button>
          </div>
        </div>

        {/* High Visibility Progress Bar */}
        <div className="w-full bg-white/10 h-2 sm:h-2.5 rounded-full overflow-hidden border border-white/5">
          <div
            className="bg-lime-500 h-full transition-all duration-300 shadow-md shadow-lime-500/30"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. SUPERIMPOSED REST OVERLAY (VIEWPORT-FITTED MODAL WHEN REST IS ACTIVE) */}
      {activeWorkout.restTimerActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative flex flex-col items-center justify-center rounded-3xl border-2 border-lime-500/60 bg-[#0F0F11] p-4 sm:p-6 text-center shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto space-y-3.5 sm:space-y-4 animate-scaleUp">
            {/* Exercise context pill */}
            <div className="flex items-center justify-between w-full border-b border-white/10 pb-3">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase text-lime-400 tracking-wider block">
                  Intervalo de Recuperação
                </span>
                <h3 className="text-sm sm:text-base font-black text-white truncate max-w-[220px] sm:max-w-xs">
                  {currentExercise.name}
                </h3>
              </div>
              <span className="rounded-xl bg-lime-500/20 px-2.5 py-1 text-xs font-black text-lime-400 border border-lime-500/30">
                Série {setNumber}/{totalSets}
              </span>
            </div>

            <span className={`text-xs sm:text-sm font-black uppercase tracking-wider block ${
              restSecondsRemaining === 0 ? 'text-emerald-400 animate-bounce' : 'text-lime-400'
            }`}>
              {getTimerTextStatus()}
            </span>

            {/* SVG Circular Progress Ring Timer */}
            <div className="relative flex items-center justify-center my-1">
              <svg className="w-36 h-36 sm:w-44 sm:h-44 transform rotate-90" viewBox="0 0 170 170">
                {/* Background ring */}
                <circle
                  cx="85"
                  cy="85"
                  r="70"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Animated Progress Ring */}
                <circle
                  cx="85"
                  cy="85"
                  r="70"
                  stroke={getTimerColor()}
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={2 * Math.PI * 70 * (1 - restRatio)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-linear"
                />
              </svg>

              {/* Centered Countdown */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  {restSecondsRemaining}s
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold text-slate-300 uppercase mt-0.5">
                  {restSecondsRemaining > 0 ? 'Descansando...' : 'Tempo Esgotado!'}
                </span>
              </div>
            </div>

            {/* Weight for next set */}
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-2 w-full flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Carga da Próxima Série:</span>
              <span className="text-sm sm:text-base font-black text-lime-400">{currentExercise.weightKg} kg</span>
            </div>

            {/* Rest Action Buttons with Snooze & Confirmation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full pt-1">
              <button
                onClick={() => addRestTime(30)}
                className="w-full sm:w-auto flex-1 min-h-[48px] rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-4 py-3 text-xs font-black active:scale-95 flex items-center justify-center gap-1.5"
                title="Snooze / Adicionar +30s de descanso"
              >
                <RotateCcw className="h-4 w-4" />
                <span>+30s Snooze</span>
              </button>

              <button
                onClick={skipRestTime}
                className="w-full sm:w-auto flex-[1.5] min-h-[52px] rounded-2xl bg-lime-500 hover:bg-lime-400 px-5 py-3.5 text-sm sm:text-base font-black text-black shadow-xl shadow-lime-500/25 active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>INICIAR SÉRIE</span>
              </button>
            </div>

            {activeWorkout.currentExerciseIndex < totalExercises - 1 && (
              <button
                onClick={() => {
                  skipRestTime();
                  cancelCurrentExercise();
                }}
                className="w-full min-h-[42px] rounded-xl bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-extrabold text-slate-400 hover:text-white border border-white/10 active:scale-95 flex items-center justify-center gap-1.5 transition-colors"
                title="Avançar diretamente para o próximo exercício da ficha"
              >
                <SkipForward className="h-4 w-4" />
                <span>Pular para Próximo Exercício</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* CONTAINER WITH EXERCISE DISPLAY */}
      <div className="relative">
        {/* 3. CURRENT EXERCISE DISPLAY & WEIGHT ADJUSTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 transition-all duration-300">
          {/* Left Column: Media & Setup Notes */}
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0F0F11] p-3.5 sm:p-5 space-y-3 sm:space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-lime-400 tracking-wider">
                  {currentExercise.muscleGroup} • {currentExercise.equipment}
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                  {currentExercise.name}
                </h2>
              </div>
              <button
                onClick={() => setIsMediaModalOpen(true)}
                className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 active:scale-95"
                title="Personalizar Mídia & Regulagem"
              >
                <Settings2 className="h-5 w-5" />
              </button>
            </div>

            {/* Unified Media Carousel with Touch-Friendly Navigation, Default Motion GIF & Lightbox */}
            <MediaCarousel
              attachments={currentExercise.mediaAttachments}
              gifUrl={currentExercise.gifUrl}
              photoUrl={currentExercise.photoUrl}
              muscleIllustrationUrl={currentExercise.muscleIllustrationUrl || currentExercise.anatomyUrl}
              videoUrl={currentExercise.videoUrl}
              adjustmentPhotoUrl={currentExercise.adjustmentPhotoUrl}
              fallbackPhotoUrl={currentExercise.photoUrl || currentExercise.gifUrl}
              exerciseName={currentExercise.name}
              onAddMediaClick={() => setIsMediaModalOpen(true)}
            />

            {/* Anotações do Exercício */}
            {(currentExercise.notes || currentExercise.instructions) && (
              <div className="p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-lime-400">
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Anotações do Exercício</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed pl-5">
                  {currentExercise.notes || currentExercise.instructions}
                </p>
              </div>
            )}

            {/* Dicas de Segurança & Execução */}
            {(currentExercise.executionTips || currentExercise.safetyNotes) && (
              <div className="p-3 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Dicas de Segurança & Execução</span>
                </div>
                <p className="text-[11px] text-amber-100/90 leading-relaxed pl-5">
                  {currentExercise.executionTips || currentExercise.safetyNotes}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Load Suggestion, Numbers, Giant Button */}
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0F0F11] p-3.5 sm:p-5 flex flex-col justify-between space-y-3 sm:space-y-4 shadow-xl">
            {/* Individual Load Progression Banner */}
            <div className="rounded-2xl border border-lime-500/30 bg-lime-500/10 p-3 sm:p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-lime-400">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" />
                  <span className="uppercase tracking-wider">SUGESTÃO PROGRAMADA</span>
                </div>
                <span className="rounded-md bg-lime-500/20 px-2 py-0.5 text-[10px] font-extrabold text-lime-300">
                  {currentExercise.evolutionTrend || 'Estável'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-lime-500/20">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Última Carga</span>
                  <span className="text-sm font-black text-white">
                    {currentExercise.previousWeightKg || currentExercise.weightKg} kg
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sugestão Hoje</span>
                    {typeof currentExercise.suggestedWeightKg === 'number' &&
                      currentExercise.suggestedWeightKg !== currentExercise.weightKg && (
                        <button
                          onClick={applySuggestedWeight}
                          className="px-2 py-0.5 rounded-md bg-lime-500 hover:bg-lime-400 text-black text-[10px] font-black shadow transition-all active:scale-95"
                          title="Aplicar carga sugerida"
                        >
                          Usar {currentExercise.suggestedWeightKg} kg
                        </button>
                      )}
                  </div>
                  <span className="text-sm font-black text-lime-400">
                    {currentExercise.suggestedWeightKg || currentExercise.weightKg} kg{' '}
                    <span className="text-[10px] text-slate-300">
                      ({currentExercise.targetReps || currentExercise.reps} reps)
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Series Visual Progress Strip */}
            <div className="space-y-2 border-b border-white/10 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-black text-slate-400 tracking-wider">PROGRESSO DAS SÉRIES</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-3xl font-black text-lime-400">
                      {Math.min(setNumber, totalSets)}
                    </span>
                    <span className="text-sm font-extrabold text-slate-400">/ {totalSets}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] uppercase font-black text-slate-400 tracking-wider">REPETIÇÕES</span>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <button
                      onClick={() => adjustCurrentReps(-1)}
                      className="h-12 w-12 min-h-[48px] min-w-[48px] rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-black active:scale-90 transition-all"
                      title="Diminuir 1 repetição"
                    >
                      <Minus className="h-5 w-5 stroke-[2.5]" />
                    </button>
                    <span className="text-2xl sm:text-3xl font-black text-white px-1.5 min-w-[2.5rem] text-center">
                      {currentExercise.reps || 10}
                    </span>
                    <button
                      onClick={() => adjustCurrentReps(1)}
                      className="h-12 w-12 min-h-[48px] min-w-[48px] rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-black active:scale-90 transition-all"
                      title="Aumentar 1 repetição"
                    >
                      <Plus className="h-5 w-5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Set Pills / Indicators */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {Array.from({ length: totalSets }, (_, idx) => {
                  const setIdx = idx + 1;
                  const isCompleted = setIdx < setNumber;
                  const isCurrent = setIdx === setNumber;
                  const historyItem = currentExercise.completedSetsHistory?.[idx];

                  return (
                    <div
                      key={setIdx}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : isCurrent
                          ? 'bg-lime-500/20 border-lime-400 text-lime-300 ring-1 ring-lime-400/50 shadow-sm'
                          : 'bg-white/5 border-white/5 text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase">
                        Série {setIdx}
                      </span>
                      <span className="text-xs font-extrabold mt-0.5">
                        {isCompleted ? (
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            ✓ {historyItem ? `${historyItem.weightKg}k` : 'Feita'}
                          </span>
                        ) : isCurrent ? (
                          <span className="text-lime-300 animate-pulse">Atual</span>
                        ) : (
                          <span className="text-slate-400">Pendente</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Big Weight Adjuster */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-400">
                <span>CARGA EXECUTADA (KG)</span>
                <span className="text-slate-300">Anterior: {currentExercise.previousWeightKg} kg</span>
              </div>

              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <button
                  onClick={() => adjustCurrentWeight(-2.5)}
                  className="flex h-14 w-14 sm:h-16 sm:w-16 min-h-[48px] min-w-[48px] items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-slate-100 border border-white/10 active:scale-90 transition-all"
                  title="Diminuir 2.5 kg"
                >
                  <Minus className="h-7 w-7 sm:h-8 sm:w-8 stroke-[3]" />
                </button>

                <div className="flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">{currentExercise.weightKg}</span>
                  <span className="text-[11px] font-extrabold text-lime-400 uppercase">Quilogramas</span>
                </div>

                <button
                  onClick={() => adjustCurrentWeight(2.5)}
                  className="flex h-14 w-14 sm:h-16 sm:w-16 min-h-[48px] min-w-[48px] items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-slate-100 border border-white/10 active:scale-90 transition-all"
                  title="Aumentar 2.5 kg"
                >
                  <Plus className="h-7 w-7 sm:h-8 sm:w-8 stroke-[3]" />
                </button>
              </div>

              {/* Quick Delta Buttons (48dp touch targets) */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 pt-1">
                {[-5, -2.5, 2.5, 5].map((delta) => (
                  <button
                    key={delta}
                    onClick={() => adjustCurrentWeight(delta)}
                    className="flex items-center justify-center min-h-[48px] rounded-xl bg-white/5 px-2 py-2 text-xs font-extrabold text-slate-200 border border-white/10 hover:bg-white/10 active:scale-90 transition-all"
                  >
                    {delta > 0 ? `+${delta}` : delta} kg
                  </button>
                ))}
              </div>
            </div>

            {/* GIANT PRIMARY ACTION BUTTON (Min Height 56px, min 48dp) */}
            <button
              onClick={() => {
                if (activeWorkout.restTimerActive) {
                  skipRestTime();
                } else {
                  completeCurrentSet();
                }
              }}
              className="w-full min-h-[56px] flex items-center justify-center gap-3 rounded-2xl bg-lime-500 hover:bg-lime-400 py-3.5 sm:py-4 px-4 text-base sm:text-lg font-black text-black shadow-xl shadow-lime-500/25 active:scale-95 transition-all"
            >
              <Check className="h-6 w-6 sm:h-7 sm:w-7 stroke-[3.5]" />
              <span className="tracking-tight">
                {activeWorkout.restTimerActive
                  ? '▶ INICIAR PRÓXIMA SÉRIE'
                  : `CONCLUIR SÉRIE ${setNumber}/${totalSets}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. DISCREET SECONDARY CONTROLS (Min 48x48 touch targets on mobile) */}
      <div className="grid grid-cols-3 gap-2 p-2.5 sm:p-3 rounded-2xl bg-[#0F0F11] border border-white/10 text-xs font-bold">
        <button
          onClick={markCurrentExerciseBusy}
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 min-h-[48px] rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-2 text-center active:scale-95 text-[11px] sm:text-xs"
        >
          <SkipForward className="h-4 w-4 shrink-0" />
          <span>Ocupada</span>
        </button>

        <button
          onClick={cancelCurrentExercise}
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 min-h-[48px] rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-2 text-center active:scale-95 text-[11px] sm:text-xs"
        >
          <XCircle className="h-4 w-4 shrink-0" />
          <span>Pular</span>
        </button>

        <button
          onClick={() => setShowCancelDialog(true)}
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 min-h-[48px] rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10 px-2 py-2 text-center active:scale-95 text-[11px] sm:text-xs"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Cancelar</span>
        </button>
      </div>

      {/* Modals */}
      <ExerciseMediaModal
        isOpen={isMediaModalOpen}
        exercise={currentExercise}
        onClose={() => setIsMediaModalOpen(false)}
      />

      {/* Cancel Confirmation Modal */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="rounded-3xl bg-[#0F0F11] border border-white/10 p-6 max-w-sm w-full space-y-4 text-center">
            <h3 className="text-lg font-black text-white">Deseja cancelar o treino?</h3>
            <p className="text-xs text-slate-300">
              Seu progresso parcial será salvo automaticamente no histórico.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 rounded-2xl bg-white/5 py-3 text-xs font-bold text-slate-300"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setShowCancelDialog(false);
                  cancelWorkout();
                }}
                className="flex-1 rounded-2xl bg-red-500 py-3 text-xs font-black text-white"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finish Confirmation Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="rounded-3xl bg-[#0F0F11] border border-lime-500/40 p-6 max-w-sm w-full space-y-4 text-center">
            <h3 className="text-lg font-black text-white">Finalizar Treino Agora?</h3>
            <p className="text-xs text-slate-300">
              Você acumulou um ótimo volume! Deseja gerar o relatório e finalizar a sessão?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFinishModal(false)}
                className="flex-1 rounded-2xl bg-white/5 py-3 text-xs font-bold text-slate-300"
              >
                Continuar Treinando
              </button>
              <button
                onClick={() => {
                  setShowFinishModal(false);
                  finishWorkout();
                }}
                className="flex-1 rounded-2xl bg-lime-500 py-3 text-xs font-black text-black"
              >
                Finalizar Treino
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5-Minute Dynamic Warm-Up Sequence Modal */}
      <WarmUpSequenceModal
        isOpen={isWarmUpModalOpen}
        onClose={() => setIsWarmUpModalOpen(false)}
        exercises={activeWorkout.exercisesQueue}
        workoutName={activeWorkout.workoutName}
      />

      {/* Lightbox / High-Res Image & Regulation Zoom Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 animate-fadeIn">
          <div className="relative max-w-4xl w-full max-h-[92vh] flex flex-col rounded-3xl border border-white/20 bg-[#0A0A0C] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/60">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">{lightboxImage.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Abrir em tamanho original"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/90">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
