/**
 * Gym Companion v1.0 — Post-Workout Rating & Feedback Modal
 * Celebrates completed session, collects 1-5 star rating, and tags fatigue/gym conditions for AI Coach learning.
 */
import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  Clock,
  TrendingUp,
  Award,
  Star,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Droplets,
  QrCode,
  LogOut,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGym } from '../context/GymContext';
import { formatDuration } from '../utils/calories';
import { GymAccessModal } from './GymAccessModal';

export const PostWorkoutRatingModal: React.FC = () => {
  const {
    pendingFinishedLog,
    submitWorkoutRatingAndFeedback,
    closePostWorkoutModal,
  } = useGym();

  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customText, setCustomText] = useState<string>('');
  const [showerCompleted, setShowerCompleted] = useState<boolean>(false);
  const [showerDurationMinutes, setShowerDurationMinutes] = useState<number>(10);
  const [showExitQrModal, setShowExitQrModal] = useState<boolean>(false);

  useEffect(() => {
    if (pendingFinishedLog) {
      // Launch celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if canvas confetti fails
      }
    }
  }, [pendingFinishedLog]);

  if (!pendingFinishedLog) return null;

  const FEEDBACK_TAGS_OPTIONS = [
    'Academia muito cheia',
    'Máquinas ocupadas',
    'Pouca energia',
    'Dormi mal',
    'Dor muscular',
    'Dor no ombro',
    'Dor articular',
    'Lesão',
    'Pouco tempo',
    'Muito cansado',
    'Treino muito pesado',
    'Treino muito leve',
    'Exercícios difíceis',
    'Equipamento indisponível',
    'Ótima energia',
    'Treino no tempo ideal',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    const finalTags = showerCompleted
      ? [...selectedTags, 'Banho Pós-Treino Concluído']
      : selectedTags;
    submitWorkoutRatingAndFeedback(
      rating,
      finalTags,
      customText,
      showerCompleted,
      showerDurationMinutes
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0F0F11] p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Title Badge */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-500 to-emerald-400 text-black shadow-lg shadow-lime-500/30">
            <Trophy className="h-9 w-9 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Treino Concluído!
          </h2>
          <p className="text-sm font-semibold text-lime-400">
            {pendingFinishedLog.workoutName} • Sessão Registrada
          </p>
        </div>

        {/* 4 CORE METRICS GRID (Tempo, Calorias, Exercícios, Volume + PRs) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-4 space-y-1 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Tempo Total</span>
            <div className="flex items-center justify-center gap-1.5 text-white">
              <Clock className="h-4 w-4 text-lime-400" />
              <span className="text-lg font-extrabold">
                {formatDuration(pendingFinishedLog.durationSeconds)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-4 space-y-1 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Calorias Estimadas</span>
            <div className="flex items-center justify-center gap-1.5 text-white">
              <Flame className="h-4 w-4 text-amber-400" />
              <span className="text-lg font-extrabold">
                {pendingFinishedLog.caloriesBurned} kcal
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-4 space-y-1 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Volume Total</span>
            <div className="flex items-center justify-center gap-1.5 text-white">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span className="text-lg font-extrabold">
                {(pendingFinishedLog.totalVolumeKg / 1000).toFixed(1)}t
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-4 space-y-1 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Recordes (PRs)</span>
            <div className="flex items-center justify-center gap-1.5 text-white">
              <Award className="h-4 w-4 text-violet-400" />
              <span className="text-lg font-extrabold">
                {pendingFinishedLog.newPRsCount} {pendingFinishedLog.newPRsCount === 1 ? 'novo PR' : 'novos PRs'}
              </span>
            </div>
          </div>
        </div>

        {/* 5-STAR RATING SYSTEM */}
        <div className="space-y-3 pt-2 border-t border-neutral-800 text-center">
          <label className="block text-sm font-bold text-white">
            Como foi seu treino hoje?
          </label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1.5 transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400 drop-shadow-md'
                      : 'text-neutral-700'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Feedback response depending on rating */}
          {rating === 5 && (
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-lime-400 bg-lime-500/10 py-2 px-4 rounded-xl border border-lime-500/20">
              <Sparkles className="h-4 w-4" />
              <span>Excelente! O AI Coach vai sugerir progressão de carga na sua próxima sessão.</span>
            </div>
          )}

          {rating === 4 && (
            <p className="text-xs font-medium text-neutral-300">
              Muito bom! O que podemos melhorar para a próxima vez?
            </p>
          )}

          {rating <= 3 && (
            <p className="text-xs font-semibold text-amber-300">
              ⚠️ Sentiu algum desconforto ou dificuldade? Selecione abaixo para o AI Coach adaptar suas próximas cargas:
            </p>
          )}
        </div>

        {/* FEEDBACK TAGS (if <= 4 stars or user wants to tag) */}
        {rating <= 4 && (
          <div className="space-y-3 pt-2">
            <span className="block text-xs font-bold text-slate-400 uppercase">
              Fatores que influenciaram seu treino (Opcional)
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {FEEDBACK_TAGS_OPTIONS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-lime-500/20 border-lime-500 text-lime-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Optional text input */}
            <input
              type="text"
              placeholder="Outro motivo ou observação livre..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full rounded-xl bg-[#0A0A0B] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-500"
            />
          </div>
        )}

        {/* POST-WORKOUT SHOWER & CHECKOUT */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-cyan-500/20 p-2 text-cyan-400">
                  <Droplets className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Banho Pós-Treino no Ginásio</h4>
                  <p className="text-[11px] text-cyan-300">
                    Registrar banho no histórico (+15 XP de Autocuidado)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowerCompleted(!showerCompleted)}
                className={`h-6 w-11 rounded-full p-0.5 transition-colors ${
                  showerCompleted ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white transition-transform ${
                    showerCompleted ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {showerCompleted && (
              <div className="mt-3 pt-3 border-t border-cyan-500/20 flex items-center justify-between">
                <span className="text-xs text-slate-300">Duração do banho:</span>
                <div className="flex gap-1.5">
                  {[5, 10, 15, 20].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setShowerDurationMinutes(mins)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                        showerDurationMinutes === mins
                          ? 'bg-cyan-500 text-black shadow-sm'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CHECKOUT WITH QR CODE BUTTON */}
          <button
            type="button"
            onClick={() => setShowExitQrModal(true)}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 px-5 py-3.5 text-sm font-extrabold text-cyan-300 transition-all active:scale-95 shadow-md"
          >
            <QrCode className="h-5 w-5" />
            <span>ABRIR QR CODE PARA SAÍDA & CHECK-OUT DO GINÁSIO 🚪</span>
          </button>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-lime-500 hover:bg-lime-400 px-6 py-4 text-base font-black text-black shadow-lg shadow-lime-500/25 transition-all active:scale-95"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>SALVAR TREINO & ATUALIZAR HISTÓRICO</span>
          </button>
        </div>

        {/* Exit Gym QR Code Modal */}
        <GymAccessModal
          isOpen={showExitQrModal}
          onClose={() => setShowExitQrModal(false)}
          initialMode="checkout"
          onStartTodayWorkout={() => {}}
        />
      </div>
    </div>
  );
};
