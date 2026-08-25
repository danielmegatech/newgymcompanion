/**
 * Gym Companion — Home Dashboard (Visual & UX Upgrade)
 * Priority: "Fichas de Treino" selection (A, B, C, D), Workout Confirmation Modal,
 * Athlete Evolution metrics, Comparative Last Workout card, and Expanded Badges Library.
 * 100% focused on commercial gym performance (No optional non-gym items).
 */

import React, { useState, useRef } from 'react';
import {
  Play,
  QrCode,
  Flame,
  Clock,
  Layers,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  Dumbbell,
  History,
  TrendingDown,
  ChevronRight,
  ChevronLeft,
  User,
  CheckCircle2,
  Edit3,
  ArrowLeft,
  Calendar,
  Lock,
  Medal,
  Users,
  BookOpen,
  FileText,
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import { Workout } from '../types';
import { BadgesDisplay } from './BadgesDisplay';

interface HomeDashboardProps {
  onOpenGymQr: () => void;
  onOpenWorkoutManager: (workoutId?: string) => void;
  onOpenOptionalWorkouts?: (category?: string) => void;
  onOpenHistory: () => void;
  onOpenProfileSettings?: () => void;
  onOpenApostilaGlowUp?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onOpenGymQr,
  onOpenWorkoutManager,
  onOpenOptionalWorkouts,
  onOpenHistory,
  onOpenProfileSettings,
  onOpenApostilaGlowUp,
}) => {
  const categoriesCarouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (categoriesCarouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      categoriesCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  const {
    workouts,
    todayWorkout,
    startWorkout,
    userStats,
    workoutLogs,
    bodyConfig,
    gymConfig,
    activeProfile,
    profiles,
    switchProfile,
  } = useGym();

  const [selectedWorkoutForConfirm, setSelectedWorkoutForConfirm] = useState<Workout | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);

  const lastLog = workoutLogs[0];
  const secondLastLog = workoutLogs[1];

  // Compare last log with second last log for instant evolution insights
  let volumeTrendPercent = 0;
  let isVolumeUp = true;
  if (lastLog && secondLastLog && secondLastLog.totalVolumeKg > 0) {
    const diff = lastLog.totalVolumeKg - secondLastLog.totalVolumeKg;
    volumeTrendPercent = Math.round((diff / secondLastLog.totalVolumeKg) * 100);
    isVolumeUp = diff >= 0;
  }

  // Calculate total volume across logs
  const totalVolumeAllLogs = workoutLogs.reduce((acc, log) => acc + log.totalVolumeKg, 0);

  const getLastPerformedDate = (workoutId: string) => {
    const foundLog = workoutLogs.find((l) => l.workoutId === workoutId || l.workoutCode === workoutId);
    if (!foundLog) return 'Ainda não realizado';
    return foundLog.date;
  };

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 py-4 space-y-6 animate-fadeIn pb-28">
      {/* 1. TOP PROFILE & ACADEMIA BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] p-4 shadow-lg">
        <button
          onClick={onOpenProfileSettings}
          className="flex items-center gap-3 text-left w-full sm:w-auto p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all min-h-[44px]"
          title="Ver Meu Perfil & Medidas"
        >
          <img
            src={activeProfile.avatarUrl}
            alt={activeProfile.name}
            className="h-12 w-12 rounded-full object-cover border-2 border-lime-500 shadow-md shadow-lime-500/20 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {activeProfile.name}
              </h2>
              <span className="rounded-md bg-lime-500/20 px-2 py-0.5 text-[10px] font-extrabold text-lime-600 dark:text-lime-400 border border-lime-500/30">
                Nível {userStats.level}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5">
              <span>Meta: <strong className="text-lime-600 dark:text-lime-400">{bodyConfig.goal || 'Glow Up 2026'}</strong></span>
              <span>•</span>
              <span className="text-slate-400">Ver Biometria & Medidas →</span>
            </p>
          </div>
        </button>

        {/* Quick QR Code Button */}
        <button
          onClick={onOpenGymQr}
          className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-black transition-all border active:scale-95 ${
            gymConfig.isCheckedIn
              ? 'bg-lime-500/20 text-lime-700 dark:text-lime-300 border-lime-500/40 shadow-lg shadow-lime-500/10'
              : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          <QrCode className="h-4 w-4" />
          <span>{gymConfig.isCheckedIn ? 'Na Academia (Check-out)' : 'Acesso QR Code'}</span>
        </button>
      </div>

      {/* 1.5 BANNER OFICIAL DO PROJETO GLOW UP 2026 */}
      {onOpenApostilaGlowUp && (
        <div className="relative overflow-hidden rounded-3xl border border-lime-500/40 bg-gradient-to-r from-lime-500/15 via-emerald-500/10 to-cyan-500/10 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lime-500 text-black shadow-md shadow-lime-500/20">
              <BookOpen className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-lime-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-lime-600 dark:text-lime-400 border border-lime-500/30">
                  Documento Oficial
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Plano Personalizado</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-0.5">
                Projeto Glow Up 2026 — Plano Base & Relatório do Daniel
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                13 Seções: Treino A/B, Medidas, Limitações (Joelho & Ombro), Aquecimento, Nutrição e Especialistas.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenApostilaGlowUp}
            className="flex items-center justify-center gap-2 rounded-2xl bg-lime-500 hover:bg-lime-400 text-black px-4 py-2.5 text-xs font-black shadow-md shadow-lime-500/20 transition-all active:scale-95 shrink-0"
          >
            <FileText className="h-4 w-4" />
            <span>Ver Plano Completo</span>
          </button>
        </div>
      )}

      {/* 2. ESCOLHA DAS FICHAS DE TREINO (A, B, C, D) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-black text-lime-600 dark:text-lime-400 tracking-wider block">
              Plano de Treino Semanal
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Fichas de Treino
            </h2>
          </div>

          <button
            onClick={() => onOpenWorkoutManager()}
            className="flex items-center gap-1.5 text-xs font-black text-lime-600 dark:text-lime-400 hover:underline bg-lime-500/10 dark:bg-lime-500/20 border border-lime-500/30 px-3 py-1.5 rounded-xl"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Editar Fichas</span>
          </button>
        </div>

        {/* Fichas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(workouts || []).map((workout) => {
            const isSuggestedToday = todayWorkout?.id === workout.id;
            const lastPerformed = getLastPerformedDate(workout.id);

            return (
              <div
                key={workout.id}
                className={`relative flex flex-col justify-between rounded-3xl p-5 border-2 transition-all shadow-lg ${
                  isSuggestedToday
                    ? 'border-lime-500 bg-gradient-to-br from-lime-500/10 via-white dark:via-[#0F0F11] to-white dark:to-[#0F0F11] shadow-lime-500/10'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                {isSuggestedToday && (
                  <span className="absolute -top-3 right-5 inline-flex items-center gap-1 rounded-full bg-lime-500 px-3 py-0.5 text-[10px] font-black uppercase text-black shadow-md">
                    <Flame className="h-3 w-3 fill-current" />
                    RECOMENDADO HOJE
                  </span>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-black px-3 py-1 text-sm shadow">
                      FICHA {workout.code}
                    </span>
                    <span className="text-[11px] font-extrabold text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {lastPerformed}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {workout.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                      {workout.subtitle}
                    </p>
                  </div>

                  {/* Exercise Count & Time Specs */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 pt-1">
                    <span className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-black/40 px-2.5 py-1 border border-slate-200 dark:border-white/5">
                      <Layers className="h-3.5 w-3.5 text-lime-500" />
                      {workout.exercises.length} Exercícios
                    </span>

                    <span className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-black/40 px-2.5 py-1 border border-slate-200 dark:border-white/5">
                      <Clock className="h-3.5 w-3.5 text-lime-500" />
                      ~{workout.estimatedDurationMinutes} min
                    </span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-4 mt-2 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedWorkoutForConfirm(workout)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-lime-500 hover:bg-lime-400 py-3 px-4 text-sm font-black text-black shadow-md transition-all active:scale-95"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>SELECIONAR</span>
                  </button>

                  <button
                    onClick={() => onOpenWorkoutManager(workout.id)}
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-white/10"
                    title="Editar exercícios desta ficha"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2.5 BANCO GLOBAL DE EXERCÍCIOS & PRESETS (85+ EXERCÍCIOS EM 14 CATEGORIAS) */}
      <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] p-5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-lime-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-lime-600 dark:text-lime-400 border border-lime-500/30">
                85+ Exercícios Disponíveis
              </span>
              <span className="text-xs text-slate-400 font-bold">14 Grupos Musculares</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
              Banco Global de Exercícios & Presets
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Scroll Navigation Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10">
              <button
                onClick={() => scrollCarousel('left')}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition active:scale-95"
                title="Categorias Anteriores"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-[10px] font-bold text-slate-400 px-1">Rolagem</span>
              <button
                onClick={() => scrollCarousel('right')}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition active:scale-95"
                title="Próximas Categorias"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => onOpenOptionalWorkouts && onOpenOptionalWorkouts('Todos')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-lime-500 hover:bg-lime-400 text-black font-black text-xs shadow-md shadow-lime-500/20 transition active:scale-95 shrink-0"
            >
              <Dumbbell className="h-4 w-4" />
              <span>Ver Banco</span>
            </button>
          </div>
        </div>

        {/* Categories Lateral Scroll Carousel */}
        <div
          ref={categoriesCarouselRef}
          className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {[
            { name: 'Cardio', icon: '🏃', count: '6 Presets', color: 'border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-500/60' },
            { name: 'Mobilidade', icon: '🧘', count: '5 Presets', color: 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60' },
            { name: 'Ombros', icon: '🏋️', count: '6 Presets', color: 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60' },
            { name: 'Glúteos', icon: '🍑', count: '5 Presets', color: 'border-rose-500/30 bg-rose-500/5 hover:border-rose-500/60' },
            { name: 'Bíceps', icon: '💪', count: '5 Presets', color: 'border-lime-500/30 bg-lime-500/5 hover:border-lime-500/60' },
            { name: 'Tríceps', icon: '⚡', count: '5 Presets', color: 'border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-500/60' },
            { name: 'Costas', icon: '🦅', count: '5 Presets', color: 'border-blue-500/30 bg-blue-500/5 hover:border-blue-500/60' },
            { name: 'Peito', icon: '🛡️', count: '5 Presets', color: 'border-red-500/30 bg-red-500/5 hover:border-red-500/60' },
            { name: 'Quadríceps', icon: '🦵', count: '5 Presets', color: 'border-teal-500/30 bg-teal-500/5 hover:border-teal-500/60' },
            { name: 'Posterior de Coxa', count: '5 Presets', icon: '🔥', color: 'border-purple-500/30 bg-purple-500/5 hover:border-purple-500/60' },
            { name: 'Panturrilhas', icon: '🦶', count: '3 Presets', color: 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/60' },
            { name: 'Abdômen', icon: '🎯', count: '4 Presets', color: 'border-orange-500/30 bg-orange-500/5 hover:border-orange-500/60' },
            { name: 'Trapézio', icon: '🏆', count: '3 Presets', color: 'border-slate-500/30 bg-slate-500/5 hover:border-slate-500/60' },
            { name: 'Antebraço', icon: '✊', count: '3 Presets', color: 'border-lime-500/30 bg-lime-500/5 hover:border-lime-500/60' },
          ].map((cat) => (
            <button
              key={cat.name}
              onClick={() => onOpenOptionalWorkouts && onOpenOptionalWorkouts(cat.name)}
              className={`flex flex-col justify-between p-3.5 rounded-2xl border text-left min-w-[130px] sm:min-w-[150px] shrink-0 snap-start hover:scale-105 transition-all shadow-sm ${cat.color}`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xl">{cat.icon}</span>
                <span className="text-[10px] font-mono font-black text-slate-400 bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded-full">
                  {cat.count}
                </span>
              </div>
              <div className="mt-3">
                <span className="text-xs font-black text-slate-900 dark:text-white block truncate">
                  {cat.name}
                </span>
                <span className="text-[10px] text-lime-600 dark:text-lime-400 font-extrabold flex items-center gap-0.5 mt-0.5">
                  Ver Exercícios <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. EVOLUÇÃO E PROGRESSO DO USUÁRIO */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-lime-500" />
            <span>MÉTRICAS DE EVOLUÇÃO</span>
          </span>
          <button
            onClick={onOpenHistory}
            className="text-xs font-extrabold text-lime-600 dark:text-lime-400 hover:underline"
          >
            Histórico Detalhado →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Metric 1 */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] p-4 flex flex-col justify-between space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-extrabold text-slate-400">Total Treinos</span>
              <Award className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {workoutLogs.length}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Sessões concluídas</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] p-4 flex flex-col justify-between space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-extrabold text-slate-400">Volume Total</span>
              <Dumbbell className="h-4 w-4 text-lime-500" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {(totalVolumeAllLogs / 1000).toFixed(1)} <span className="text-xs font-bold text-slate-400">ton</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Massa movimentada</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] p-4 flex flex-col justify-between space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-extrabold text-slate-400">Sequência</span>
              <Zap className="h-4 w-4 text-rose-500" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {userStats.streak} <span className="text-xs font-bold text-slate-400">dias</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Foco ininterrupto</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] p-4 flex flex-col justify-between space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-extrabold text-slate-400">Consistência</span>
              <Sparkles className="h-4 w-4 text-cyan-500" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-lime-600 dark:text-lime-400">
                {Math.min(100, Math.round((workoutLogs.length / 12) * 100))}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Meta atingida</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CARD DE ÚLTIMO TREINO COMPARATIVO */}
      <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] p-5 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-lime-500" />
            <span className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
              ÚLTIMO TREINO REGISTRADO
            </span>
          </div>

          <button
            onClick={onOpenHistory}
            className="text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline"
          >
            Ver Histórico Completo →
          </button>
        </div>

        {lastLog ? (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {lastLog.workoutName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  🗓️ {lastLog.date} • {Math.round(lastLog.durationSeconds / 60)} min de duração
                </p>
              </div>

              {secondLastLog && (
                <div
                  className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-black border ${
                    isVolumeUp
                      ? 'bg-lime-500/10 text-lime-700 dark:text-lime-300 border-lime-500/30'
                      : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                  }`}
                >
                  {isVolumeUp ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>
                    {isVolumeUp ? `+${volumeTrendPercent}% Volume` : `${volumeTrendPercent}% Volume`}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="rounded-2xl bg-slate-50 dark:bg-black/60 p-3 border border-slate-200 dark:border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Volume Total</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{lastLog.totalVolumeKg} kg</span>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-black/60 p-3 border border-slate-200 dark:border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tempo</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{Math.round(lastLog.durationSeconds / 60)} min</span>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-black/60 p-3 border border-slate-200 dark:border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Gasto Estimado</span>
                <span className="text-base font-black text-rose-500">{lastLog.caloriesBurned} kcal</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
            Nenhum treino anterior registrado. Escolha uma Ficha acima para começar!
          </div>
        )}
      </section>

      {/* 5. SISTEMA DE BADGES / CONQUISTAS EXPANDIDO */}
      <section className="pt-2">
        <BadgesDisplay />
      </section>

      {/* CONFIRMAÇÃO DO TREINO DRAWER / MODAL */}
      {selectedWorkoutForConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121215] p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-xl bg-lime-500 text-black font-black px-2.5 py-0.5 text-xs">
                  FICHA {selectedWorkoutForConfirm.code}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Confirmação do Treino
                </h3>
              </div>
              <button
                onClick={() => setSelectedWorkoutForConfirm(null)}
                className="rounded-full p-1.5 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Workout Details */}
            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedWorkoutForConfirm.name}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {selectedWorkoutForConfirm.subtitle} — {selectedWorkoutForConfirm.description}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 p-3 rounded-2xl">
                <span>⏱️ Estimativa: ~{selectedWorkoutForConfirm.estimatedDurationMinutes || 60} min</span>
                <span>•</span>
                <span>💪 {(selectedWorkoutForConfirm.exercises || []).length} Exercícios</span>
              </div>

              {/* Exercises List Preview */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                  Sequência de Exercícios ({(selectedWorkoutForConfirm.exercises || []).length}):
                </span>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {(selectedWorkoutForConfirm.exercises || []).map((ex, idx) => (
                    <div
                      key={ex.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-xs font-bold"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-400 text-[10px] font-mono">#{idx + 1}</span>
                        <span className="text-slate-900 dark:text-white font-extrabold">{ex.name}</span>
                      </div>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {ex.sets || 4}x {ex.reps || 10} • {ex.weightKg} kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <button
                onClick={() => {
                  const wId = selectedWorkoutForConfirm.id;
                  setSelectedWorkoutForConfirm(null);
                  startWorkout(wId, false);
                }}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-lime-500 hover:bg-lime-400 py-4 px-6 text-base font-black text-black shadow-xl shadow-lime-500/20 transition-all active:scale-95"
              >
                <Play className="h-5 w-5 fill-current" />
                <span>▶ INICIAR TREINO AGORA</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const wId = selectedWorkoutForConfirm.id;
                    setSelectedWorkoutForConfirm(null);
                    onOpenWorkoutManager(wId);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 py-3 text-xs font-black text-slate-700 dark:text-slate-300 transition-all"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>EDITAR FICHA</span>
                </button>

                <button
                  onClick={() => setSelectedWorkoutForConfirm(null)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 py-3 text-xs font-black text-slate-500 transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>VOLTAR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
