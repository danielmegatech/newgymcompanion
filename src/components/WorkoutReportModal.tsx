/**
 * Gym Companion — Automated Workout Report Modal
 * Replaces the AI Coach post-workout drawer.
 * Compares Time, Volume, Calories, XP, Exercises against previous workout of same type.
 * Handles lower performance gracefully with cause checkboxes and encouragement.
 */

import React, { useState, useMemo } from 'react';
import {
  Trophy,
  TrendingUp,
  Clock,
  Flame,
  Dumbbell,
  Zap,
  CheckCircle2,
  AlertCircle,
  ShowerHead,
  Star,
  Check,
  ChevronRight,
  HeartHandshake,
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import { WorkoutLog } from '../types';

interface WorkoutReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkoutReportModal: React.FC<WorkoutReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { pendingFinishedLog, workoutLogs, submitWorkoutRatingAndFeedback } = useGym();

  const [rating, setRating] = useState<number>(5);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [otherCauseText, setOtherCauseText] = useState('');
  const [showerDone, setShowerDone] = useState(false);
  const [showerMinutes, setShowerMinutes] = useState(10);
  const [customNotes, setCustomNotes] = useState('');

  // Find previous log of same workout type
  const previousSameLog = useMemo(() => {
    if (!pendingFinishedLog) return null;
    return workoutLogs.find(
      (log) =>
        log.id !== pendingFinishedLog.id &&
        (log.workoutCode === pendingFinishedLog.workoutCode ||
          log.workoutId === pendingFinishedLog.workoutId)
    );
  }, [pendingFinishedLog, workoutLogs]);

  if (!isOpen || !pendingFinishedLog) return null;

  const currentVol = pendingFinishedLog.totalVolumeKg;
  const prevVol = previousSameLog?.totalVolumeKg || 0;
  const volDiff = currentVol - prevVol;
  const isVolumeImproved = !previousSameLog || volDiff >= 0;

  const currentDurationMins = Math.round(pendingFinishedLog.durationSeconds / 60);
  const prevDurationMins = previousSameLog ? Math.round(previousSameLog.durationSeconds / 60) : 0;

  const causesOptions = [
    'Pouco descanso',
    'Academia cheia',
    'Fadiga',
    'Pouco tempo',
    'Dor / Desconforto',
    'Sono inadequado',
    'Outro',
  ];

  const toggleCause = (cause: string) => {
    if (selectedCauses.includes(cause)) {
      setSelectedCauses(selectedCauses.filter((c) => c !== cause));
    } else {
      setSelectedCauses([...selectedCauses, cause]);
    }
  };

  const handleSubmitReport = () => {
    let finalCauses = [...selectedCauses];
    if (selectedCauses.includes('Outro') && otherCauseText.trim()) {
      finalCauses = finalCauses.filter((c) => c !== 'Outro');
      finalCauses.push(`Outro: ${otherCauseText.trim()}`);
    }

    submitWorkoutRatingAndFeedback(
      rating,
      isVolumeImproved ? ['Evolução Carga', 'Sessão Concluída'] : ['Ajuste de Recuperação'],
      customNotes,
      showerDone,
      showerMinutes,
      finalCauses
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-lg p-3 sm:p-6 animate-fadeIn">
      <div className="relative flex flex-col max-h-[92vh] max-w-2xl w-full rounded-3xl border border-lime-500/30 bg-[#0F0F11] shadow-2xl overflow-hidden">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-white/10 p-5 bg-[#0A0A0B]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-500 text-black shadow-lg shadow-lime-500/20">
              <Trophy className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-lime-400 tracking-wider block">
                Relatório de Desempenho
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {pendingFinishedLog.workoutName}
              </h2>
            </div>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Performance Comparison Message */}
          {isVolumeImproved ? (
            <div className="rounded-3xl bg-lime-500/10 border border-lime-500/40 p-5 space-y-2 text-left">
              <div className="flex items-center gap-2 text-lime-400 font-extrabold text-sm uppercase tracking-wider">
                <TrendingUp className="h-5 w-5" />
                <span>Excelente evolução!</span>
              </div>
              <p className="text-sm text-slate-200">
                {previousSameLog
                  ? `Você movimentou +${volDiff} kg a mais do que no seu último ${pendingFinishedLog.workoutName}! Parabéns pelo progresso e constância.`
                  : 'Sua primeira sessão deste treino foi registrada com sucesso! Excelente marco inicial.'}
              </p>
            </div>
          ) : (
            <div className="rounded-3xl bg-amber-500/10 border border-amber-500/30 p-5 space-y-3 text-left">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm uppercase tracking-wider">
                <HeartHandshake className="h-5 w-5" />
                <span>Hoje seu desempenho ficou abaixo do último treino</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Treinar nem sempre é sobre bater recordes todos os dias. A consistência nos dias de fadiga é o que constrói resultados reais a longo prazo.
              </p>
              
              {/* Causes Selection */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  Selecione possíveis fatores que influenciaram seu treino hoje:
                </span>
                <div className="flex flex-wrap gap-2">
                  {causesOptions.map((cause) => {
                    const active = selectedCauses.includes(cause);
                    return (
                      <button
                        key={cause}
                        onClick={() => toggleCause(cause)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition-all ${
                          active
                            ? 'bg-amber-500 text-black border-amber-400'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {cause}
                      </button>
                    );
                  })}
                </div>
                {selectedCauses.includes('Outro') && (
                  <input
                    type="text"
                    placeholder="Descreva o motivo..."
                    value={otherCauseText}
                    onChange={(e) => setOtherCauseText(e.target.value)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 p-2.5 text-xs text-white mt-2"
                  />
                )}
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10 text-center">
              <Clock className="h-5 w-5 text-lime-400 mx-auto mb-1" />
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tempo Total</span>
              <span className="text-lg font-black text-white">{currentDurationMins} min</span>
              {previousSameLog && (
                <span className="text-[10px] text-slate-400 block">vs {prevDurationMins}m anterior</span>
              )}
            </div>

            <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10 text-center">
              <Dumbbell className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Volume Movimentado</span>
              <span className="text-lg font-black text-white">{currentVol} kg</span>
              {previousSameLog && (
                <span className={`text-[10px] block font-bold ${volDiff >= 0 ? 'text-lime-400' : 'text-amber-400'}`}>
                  {volDiff >= 0 ? `+${volDiff}kg` : `${volDiff}kg`}
                </span>
              )}
            </div>

            <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10 text-center">
              <Flame className="h-5 w-5 text-rose-400 mx-auto mb-1" />
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Calorias Estimadas</span>
              <span className="text-lg font-black text-white">{pendingFinishedLog.caloriesBurned} kcal</span>
            </div>

            <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10 text-center">
              <Zap className="h-5 w-5 text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] uppercase font-bold text-slate-400 block">XP Ganho</span>
              <span className="text-lg font-black text-amber-400">+150 XP</span>
            </div>
          </div>

          {/* Session Rating */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">Como você avalia a sessão?</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-xl transition-all ${
                    rating >= star ? 'text-amber-400 scale-110' : 'text-slate-600'
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Banho de Ducha Pós-Treino */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <ShowerHead className="h-5 w-5 text-cyan-400" />
              <div>
                <span className="text-xs font-bold text-white block">Ducha / Banho Pós-Treino</span>
                <span className="text-[10px] text-slate-400 block">Ganha +15 XP extras de higiene e recuperação</span>
              </div>
            </div>
            <button
              onClick={() => setShowerDone(!showerDone)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                showerDone
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}
            >
              <Check className="h-4 w-4" />
              <span>{showerDone ? 'Tomado' : 'Não'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0A0A0B]">
          <button
            onClick={handleSubmitReport}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-lime-500 hover:bg-lime-400 py-4 text-base font-black text-black shadow-xl shadow-lime-500/20 transition-all active:scale-95"
          >
            <span>SALVAR & RETORNAR À HOME</span>
            <ChevronRight className="h-5 w-5 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
