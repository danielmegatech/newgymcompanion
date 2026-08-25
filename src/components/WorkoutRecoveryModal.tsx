import React from 'react';
import { Play, Trash2, Clock, Dumbbell, AlertTriangle, RefreshCw } from 'lucide-react';
import { useGym } from '../context/GymContext';
import { formatDuration } from '../utils/calories';

export const WorkoutRecoveryModal: React.FC = () => {
  const {
    hasUnfinishedWorkout,
    unfinishedWorkoutData,
    restoreSavedWorkout,
    discardSavedWorkout,
  } = useGym();

  if (!hasUnfinishedWorkout || !unfinishedWorkoutData) return null;

  const currentExercise =
    unfinishedWorkoutData.exercisesQueue[unfinishedWorkoutData.currentExerciseIndex] ||
    unfinishedWorkoutData.exercisesQueue[0];

  const totalExercises = unfinishedWorkoutData.exercisesQueue.length;
  const setNumber = unfinishedWorkoutData.currentSetNumber;
  const totalSets = unfinishedWorkoutData.totalSetsForCurrentExercise;

  const savedTimeFormatted = unfinishedWorkoutData.lastSavedTimestamp
    ? new Date(unfinishedWorkoutData.lastSavedTimestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : undefined;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-lime-500/30 bg-[#0F0F11] p-6 shadow-2xl space-y-5">
        {/* Header Icon & Title */}
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-lime-500/10 p-3 border border-lime-500/30 text-lime-400 shrink-0">
            <RefreshCw className="h-6 w-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-lime-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
                Treino em Andamento
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-0.5">
              Existe um treino em andamento.
            </h3>
          </div>
        </div>

        {/* Workout Details Card */}
        <div className="rounded-2xl bg-[#0A0A0B] p-4 border border-white/10 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div>
              <span className="text-xs font-semibold text-slate-400">Sessão Interrompida</span>
              <h4 className="text-base font-bold text-white">
                {unfinishedWorkoutData.workoutCode ? `${unfinishedWorkoutData.workoutCode} - ` : ''}
                {unfinishedWorkoutData.workoutName}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400">Duração Atual</span>
              <div className="flex items-center gap-1 text-lime-400 font-mono font-bold text-sm">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatDuration(unfinishedWorkoutData.workoutElapsedSeconds || 0)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-white/5 p-2.5 border border-white/5">
              <span className="text-slate-400 block">Exercício Atual</span>
              <span className="font-bold text-white truncate block mt-0.5">
                {currentExercise?.name || 'Exercício'}
              </span>
              <span className="text-[10px] text-slate-400">
                Série {setNumber}/{totalSets} • Ex {unfinishedWorkoutData.currentExerciseIndex + 1}/{totalExercises}
              </span>
            </div>

            <div className="rounded-xl bg-white/5 p-2.5 border border-white/5">
              <span className="text-slate-400 block">Volume Acumulado</span>
              <span className="font-bold text-lime-400 block mt-0.5">
                {Math.round(unfinishedWorkoutData.accumulatedVolumeKg || 0)} kg
              </span>
              <span className="text-[10px] text-slate-400">
                {savedTimeFormatted ? `Salvo às ${savedTimeFormatted}` : 'Salvo automaticamente'}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed text-center">
          Deseja restaurar e continuar seu treino exatamente de onde parou? Todo o seu progresso, cargas e cronômetros foram preservados.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            onClick={restoreSavedWorkout}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-lime-500 hover:bg-lime-400 py-3.5 text-base font-black text-black shadow-lg shadow-lime-500/20 transition-all active:scale-95"
          >
            <Play className="h-5 w-5 fill-black" />
            <span>Continuar Treino</span>
          </button>

          <button
            onClick={discardSavedWorkout}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 py-2.5 text-xs font-bold text-slate-400 border border-white/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Cancelar Treino Salvo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
