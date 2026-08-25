/**
 * Gym Companion v1.0 — History & Analytics Modal
 * Recharts charts for weekly volume, exercise progression, streak stats, and detailed logs.
 */
import React, { useState } from 'react';
import {
  X,
  BarChart3,
  TrendingUp,
  Flame,
  Calendar,
  CalendarDays,
  Award,
  Trash2,
  Clock,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { useGym } from '../context/GymContext';
import { WorkoutLog, IndividualExerciseSessionLog } from '../types';

interface HistoryAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimeRange = '7d' | '30d' | '90d' | '6m' | '1y' | 'all';

function filterByTimeRange<T extends { date: string }>(items: T[], range: TimeRange): T[] {
  if (range === 'all') return items;
  const now = new Date().getTime();
  const daysMap: Record<Exclude<TimeRange, 'all'>, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '6m': 180,
    '1y': 365,
  };
  const days = daysMap[range];
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  return items.filter((item) => {
    const itemTime = new Date(item.date).getTime();
    return itemTime >= cutoff;
  });
}

export const HistoryAnalyticsModal: React.FC<HistoryAnalyticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { userStats, workoutLogs, deleteWorkoutLog, workouts, getExerciseProfile } = useGym();
  const [activeTab, setActiveTab] = useState<'charts' | 'calendar' | 'logs' | 'badges'>('charts');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  // Calendar State & Calculations
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  const currentYear = calendarDate.getFullYear();
  const currentMonth = calendarDate.getMonth(); // 0-indexed

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Robust date normalizer helper
  const normalizeDateStr = (dateInput: any): string => {
    if (!dateInput) return '';
    try {
      const str = typeof dateInput === 'string' ? dateInput : new Date(dateInput).toISOString();
      const clean = str.split('T')[0].trim();
      const parts = clean.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          return `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`;
        } else if (parts[2].length === 4) {
          return `${parts[2]}-${String(parts[1]).padStart(2, '0')}-${String(parts[0]).padStart(2, '0')}`;
        }
      }
      return clean;
    } catch (e) {
      return '';
    }
  };

  const handlePrevMonth = () => {
    setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleTodayMonth = () => {
    setCalendarDate(new Date());
  };

  const daysInMonthCount = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  const calendarGrid = React.useMemo(() => {
    const days: Array<{ dayNum: number | null; dateStr: string | null; logs: WorkoutLog[] }> = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ dayNum: null, dateStr: null, logs: [] });
    }

    for (let d = 1; d <= daysInMonthCount; d++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const fullDateStr = `${currentYear}-${monthStr}-${dayStr}`;

      const logsOnDay = workoutLogs.filter((log) => normalizeDateStr(log.date) === fullDateStr);

      days.push({
        dayNum: d,
        dateStr: fullDateStr,
        logs: logsOnDay,
      });
    }

    return days;
  }, [currentYear, currentMonth, daysInMonthCount, firstDayOfWeek, workoutLogs]);

  const monthLogs = React.useMemo(() => {
    const prefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    return (workoutLogs || []).filter((log) => normalizeDateStr(log?.date || '').startsWith(prefix));
  }, [currentYear, currentMonth, workoutLogs]);

  const monthActiveDaysCount = React.useMemo(() => {
    const activeDates = new Set((monthLogs || []).map((log) => normalizeDateStr(log?.date || '')));
    return activeDates.size;
  }, [monthLogs]);

  const monthTotalVolume = (monthLogs || []).reduce((acc, log) => acc + (log?.totalVolumeKg || 0), 0);
  const monthTotalCalories = (monthLogs || []).reduce((acc, log) => acc + (log?.caloriesBurned || 0), 0);
  const consistencyPercent = Math.round((monthActiveDaysCount / daysInMonthCount) * 100);

  // Extract all unique exercises from current workouts list
  const allExercises = React.useMemo(() => {
    const list: Array<{ id: string; name: string }> = [];
    const seen = new Set<string>();
    (workouts || []).forEach((w) => {
      (w?.exercises || []).forEach((ex) => {
        if (ex?.name && !seen.has(ex.name)) {
          seen.add(ex.name);
          list.push({ id: ex.id, name: ex.name });
        }
      });
    });
    return list.length > 0 ? list : [{ id: 'supino', name: 'Supino Reto com Halteres' }];
  }, [workouts]);

  const [selectedExerciseName, setSelectedExerciseName] = useState<string>(
    allExercises[0]?.name || 'Supino Reto com Halteres'
  );

  if (!isOpen) return null;

  // Build Recharts data for weekly volume filtered by time range
  const filteredWorkoutLogs = filterByTimeRange<WorkoutLog>(workoutLogs || [], timeRange);
  const chartData = (filteredWorkoutLogs || []).slice(0, 12).reverse().map((log) => ({
    name: log?.date ? log.date.slice(5) : '',
    volumeKg: log?.totalVolumeKg || 0,
    calorias: log?.caloriesBurned || 0,
  }));

  // Selected exercise profile and chart history
  const activeExObj = (workouts || [])
    .flatMap((w) => w?.exercises || [])
    .find((ex) => ex?.name === selectedExerciseName) || workouts[0]?.exercises?.[0];

  const exProfile = activeExObj ? getExerciseProfile(activeExObj) : null;
  const rawHistory: IndividualExerciseSessionLog[] = exProfile?.history || activeExObj?.performanceHistory || activeExObj?.individualHistory || [];
  const filteredExHistory = filterByTimeRange<IndividualExerciseSessionLog>(rawHistory || [], timeRange);

  const exerciseHistoryData = (filteredExHistory || []).length > 0
    ? (filteredExHistory || []).slice().reverse().map((h) => ({
        data: h?.date ? h.date.slice(5, 10).replace('-', '/') : '',
        pesoKg: h?.actualWeightKg || 0,
        metaPesoKg: h?.plannedWeightKg || 0,
        volumeKg: h?.totalVolumeKg || 0,
        reps: Array.isArray(h?.repsPerSet) ? h.repsPerSet.join('/') : '',
      }))
    : [
        { data: 'Anterior', pesoKg: activeExObj?.previousWeightKg || activeExObj?.weightKg || 20, metaPesoKg: activeExObj?.weightKg || 20, volumeKg: (activeExObj?.weightKg || 20) * 40, reps: '10/10/10/10' },
        { data: 'Atual', pesoKg: activeExObj?.weightKg || 20, metaPesoKg: activeExObj?.suggestedWeightKg || activeExObj?.weightKg || 20, volumeKg: (activeExObj?.weightKg || 20) * 40, reps: '10/10/10/10' },
      ];

  const totalPeriodVolume = filteredExHistory.reduce((acc, h) => acc + h.totalVolumeKg, 0);
  const maxWeightInPeriod = filteredExHistory.reduce((max, h) => Math.max(max, h.actualWeightKg), activeExObj?.weightKg || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0F0F11] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-lime-500/10 p-2.5 text-lime-400 border border-lime-500/30">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Estatísticas & Histórico de Treino
              </h3>
              <p className="text-xs text-slate-400">
                Acompanhe volume movimentado, progressão de carga e consistência
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-[#0A0A0B]/60 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('charts')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'charts'
                ? 'border-lime-500 text-lime-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            📈 Gráficos & Evolução
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'border-lime-500 text-lime-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            📅 Calendário Mensal
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'logs'
                ? 'border-lime-500 text-lime-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            📋 Histórico ({workoutLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'badges'
                ? 'border-lime-500 text-lime-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            🏆 Conquistas & XP
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'charts' && (
            <div className="space-y-8">
              {/* Time Range Filter Bar */}
              <div className="flex items-center justify-between gap-2 bg-[#0A0A0B] p-2 rounded-2xl border border-white/10">
                <span className="text-xs font-bold text-slate-400 pl-2">Período de Análise:</span>
                <div className="flex items-center gap-1 overflow-x-auto">
                  {(
                    [
                      { id: '7d', label: '7 D' },
                      { id: '30d', label: '30 D' },
                      { id: '90d', label: '90 D' },
                      { id: '6m', label: '6 M' },
                      { id: '1y', label: '1 A' },
                      { id: 'all', label: 'Tudo' },
                    ] as const
                  ).map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setTimeRange(btn.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                        timeRange === btn.id
                          ? 'bg-lime-500 text-black shadow-lg shadow-lime-500/20'
                          : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Stats summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-4">
                  <span className="text-xs text-slate-400">Volume Total Levantado</span>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">
                    {(userStats.totalVolumeLiftedKg / 1000).toFixed(1)}t
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-4">
                  <span className="text-xs text-slate-400">Tempo de Treino</span>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">
                    {userStats.totalHoursTrained}h
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-4">
                  <span className="text-xs text-slate-400">Calorias Queimadas</span>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">
                    {userStats.totalCaloriesBurned.toLocaleString('pt-BR')} kcal
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-4">
                  <span className="text-xs text-slate-400">Treinos Concluídos</span>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">
                    {userStats.totalWorkouts}
                  </p>
                </div>
              </div>

              {/* Weekly Volume Chart */}
              <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Volume de Treino Semanal (kg)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Soma total de kg levantados por sessão ({timeRange === 'all' ? 'Todo histórico' : `Últimos ${timeRange}`})
                    </p>
                  </div>
                  <span className="rounded bg-lime-500/10 px-2.5 py-1 text-xs font-bold text-lime-400 border border-lime-500/20">
                    {filteredWorkoutLogs.length} Treinos Registrados
                  </span>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke="#737373" fontSize={11} />
                      <YAxis stroke="#737373" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181B',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                      />
                      <Bar
                        dataKey="volumeKg"
                        fill="#84cc16"
                        radius={[8, 8, 0, 0]}
                        name="Volume (kg)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Individual Exercise Performance & Trend Chart */}
              <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-4 w-4 text-lime-400" />
                      <h4 className="text-sm font-bold text-white">
                        Desempenho Individual do Exercício
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Histórico detalhado de cargas e volume ({selectedExerciseName})
                    </p>
                  </div>

                  <select
                    value={selectedExerciseName}
                    onChange={(e) => setSelectedExerciseName(e.target.value)}
                    className="rounded-xl bg-[#0F0F11] border border-white/10 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-lime-500"
                  >
                    {allExercises.map((ex) => (
                      <option key={ex.id} value={ex.name}>
                        {ex.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Exercise Profile Stats Pill Header */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-white/5 bg-[#0F0F11] p-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Carga Atual</span>
                    <span className="text-lg font-black text-white">{activeExObj?.weightKg || 20} kg</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#0F0F11] p-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Carga Sugerida</span>
                    <span className="text-lg font-black text-lime-400">
                      {exProfile?.suggestedWeightKg || activeExObj?.suggestedWeightKg || activeExObj?.weightKg || 20} kg
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#0F0F11] p-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Maior Carga no Período</span>
                    <span className="text-lg font-black text-amber-400">{maxWeightInPeriod} kg</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#0F0F11] p-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Tendência</span>
                    <span className="text-xs font-extrabold text-lime-300 block mt-1">
                      {exProfile?.evolutionTrend || activeExObj?.evolutionTrend || 'Estável'}
                    </span>
                  </div>
                </div>

                {/* Weight Progression Line Chart */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Evolução de Carga (kg)</span>
                    <span className="text-slate-400 text-[11px]">Realizada vs Meta Programada</span>
                  </div>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={exerciseHistoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                        <XAxis dataKey="data" stroke="#737373" fontSize={11} />
                        <YAxis stroke="#737373" fontSize={11} domain={['auto', 'auto']} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#18181B',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="pesoKg"
                          stroke="#84cc16"
                          strokeWidth={3}
                          dot={{ r: 5, fill: '#84cc16' }}
                          name="Carga Realizada (kg)"
                        />
                        <Line
                          type="monotone"
                          dataKey="metaPesoKg"
                          stroke="#a855f7"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          dot={{ r: 3, fill: '#a855f7' }}
                          name="Carga Programada (kg)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CALENDÁRIO MENSAL */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              {/* Calendar Month Header Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0A0A0B] border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-500/20">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white uppercase tracking-tight">
                      {monthNames[currentMonth]} {currentYear}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Consistência mensal e frequência de treinos por dia
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTodayMonth}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 transition"
                  >
                    Mês Atual
                  </button>
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition"
                    title="Mês Anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition"
                    title="Próximo Mês"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Monthly Stats Summary Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Dias Ativos / Treinados</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black text-lime-400">{monthActiveDaysCount}</span>
                    <span className="text-xs text-slate-500 font-bold">/ {daysInMonthCount} dias</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Consistência Mensal</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black text-white">{consistencyPercent}%</span>
                    <span className="text-[10px] text-lime-400 font-bold">
                      {consistencyPercent >= 50 ? '🔥 Excelente' : '⚡ Regular'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Volume do Mês</span>
                  <p className="text-xl font-black text-amber-400 mt-1">
                    {(monthTotalVolume / 1000).toFixed(1)} t
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Calorias Queimadas</span>
                  <p className="text-xl font-black text-rose-400 mt-1">
                    {monthTotalCalories.toLocaleString('pt-BR')} kcal
                  </p>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/10 space-y-3">
                {/* Weekday Labels */}
                <div className="grid grid-cols-7 text-center text-[10px] font-black uppercase text-slate-400 pb-2 border-b border-white/10">
                  <span>Dom</span>
                  <span>Seg</span>
                  <span>Ter</span>
                  <span>Qua</span>
                  <span>Qui</span>
                  <span>Sex</span>
                  <span>Sáb</span>
                </div>

                {/* Grid Cells */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {calendarGrid.map((item, idx) => {
                    if (!item.dayNum || !item.dateStr) {
                      return <div key={`empty-${idx}`} className="h-14 sm:h-20 rounded-xl bg-white/[0.02]" />;
                    }

                    const hasWorkout = item.logs.length > 0;
                    const isSelected = selectedCalendarDate === item.dateStr;
                    const isToday = item.dateStr === new Date().toISOString().split('T')[0];
                    const badgesEarnedOnThisDate = (userStats.unlockedBadges || []).filter(
                      (b) => b.isUnlocked && b.unlockedAt && b.unlockedAt.split('T')[0] === item.dateStr
                    );

                    return (
                      <button
                        key={item.dateStr}
                        onClick={() => setSelectedCalendarDate(isSelected ? null : item.dateStr)}
                        className={`h-14 sm:h-20 p-1.5 sm:p-2 rounded-xl flex flex-col justify-between text-left transition-all relative overflow-hidden border ${
                          isSelected
                            ? 'ring-2 ring-lime-400 border-lime-500 bg-lime-500/20'
                            : hasWorkout
                            ? 'bg-lime-500/15 border-lime-500/40 text-white hover:bg-lime-500/25'
                            : 'bg-[#0F0F11] border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`text-xs sm:text-sm font-black ${
                              isToday
                                ? 'bg-lime-500 text-black px-1.5 py-0.5 rounded-md text-[10px]'
                                : hasWorkout
                                ? 'text-lime-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {item.dayNum}
                          </span>
                          <div className="flex items-center gap-1">
                            {badgesEarnedOnThisDate.length > 0 && (
                              <span
                                className="text-amber-400 text-[11px] font-black"
                                title={`🏆 ${badgesEarnedOnThisDate.length} Badge(s) Conquistado(s) neste dia!`}
                              >
                                🏆
                              </span>
                            )}
                            {hasWorkout && (
                              <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
                            )}
                          </div>
                        </div>

                        {hasWorkout ? (
                          <div className="mt-auto">
                            <span className="hidden sm:inline-block text-[10px] font-extrabold text-lime-300 truncate max-w-full">
                              {item.logs[0]?.workoutTitle?.split('-')[0]?.trim() || 'Treino'}
                            </span>
                            <div className="flex items-center gap-1 text-[9px] font-black text-lime-400">
                              <Dumbbell className="h-3 w-3 shrink-0" />
                              <span>{((item.logs[0]?.totalVolumeKg || 0) / 1000).toFixed(1)}t</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-600 hidden sm:block">Descanso</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Date Details Card */}
              {selectedCalendarDate && (() => {
                const dayLogs = workoutLogs.filter((log) => normalizeDateStr(log.date) === normalizeDateStr(selectedCalendarDate));
                const dayBadges = (userStats.unlockedBadges || []).filter(
                  (b) => b.isUnlocked && b.unlockedAt && normalizeDateStr(b.unlockedAt) === normalizeDateStr(selectedCalendarDate)
                );

                return (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0A0A0B] to-black border border-lime-500/40 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-lime-400" />
                        <h5 className="text-sm font-black text-white uppercase tracking-tight">
                          Detalhamento do Dia: {selectedCalendarDate}
                        </h5>
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        {dayLogs.length} {dayLogs.length === 1 ? 'Treino Realizado' : 'Treinos Realizados'}
                      </span>
                    </div>

                    {dayBadges && dayBadges.length > 0 && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider">
                          <Trophy className="h-4 w-4 shrink-0" />
                          <span>🏆 Conquistas Desbloqueadas neste Dia ({dayBadges.length}):</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(dayBadges || []).map((b) => (
                            <div
                              key={b.id}
                              className="flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-500/20"
                            >
                              <span>{b.icon || '🏆'}</span>
                              <span>{b.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!dayLogs || dayLogs.length === 0) ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        Dia de descanso ou sem treino registrado.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {(dayLogs || []).map((log) => (
                          <div key={log.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <h6 className="text-sm font-bold text-white">{log.workoutTitle}</h6>
                              <span className="text-xs font-bold text-lime-400">
                                ★ {log.rating}/5
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
                              <span>Horário: {log.startTime} - {log.endTime}</span>
                              <span>Volume: <strong>{((log.totalVolumeKg || 0) / 1000).toFixed(1)}t</strong></span>
                              <span>Calorias: <strong>{log.caloriesBurned || 0} kcal</strong></span>
                            </div>
                            {log.feedbackTags && log.feedbackTags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {(log.feedbackTags || []).map((tag, idx) => (
                                  <span key={idx} className="rounded-lg bg-black px-2 py-0.5 text-[10px] text-slate-300 border border-white/10">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">
                Registro Contínuo de Treinos & Feedback
              </h4>

              {(!workoutLogs || workoutLogs.length === 0) ? (
                <div className="text-center py-12 text-neutral-400 text-xs">
                  Nenhum treino registrado ainda. Inicie seu primeiro treino na tela inicial!
                </div>
              ) : (
                <div className="space-y-3">
                  {(workoutLogs || []).map((log) => (
                    <div
                      key={log.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0A0A0B] p-4 transition-all hover:border-white/20"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-lime-500/20 px-2 py-0.5 text-xs font-bold text-lime-400 border border-lime-500/30">
                            {log.workoutCode}
                          </span>
                          <h5 className="text-base font-bold text-white">{log.workoutName}</h5>
                          <span className="text-amber-400 text-xs font-bold">
                            ★ {log.rating} / 5
                          </span>
                        </div>

                        <p className="text-xs text-neutral-400">
                          {log.date} ({log.startTime} - {log.endTime}) •{' '}
                          <span className="text-white font-semibold">
                            {((log.totalVolumeKg || 0) / 1000).toFixed(1)}t levantadas
                          </span>{' '}
                          • {log.caloriesBurned || 0} kcal
                        </p>

                        {log.feedbackTags && log.feedbackTags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(log.feedbackTags || []).map((tag, idx) => (
                              <span
                                key={idx}
                                className="rounded-lg bg-neutral-900 px-2.5 py-0.5 text-[11px] text-neutral-300 border border-neutral-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {log.customFeedback && (
                          <p className="text-xs italic text-neutral-300 bg-neutral-900/60 p-2 rounded-lg">
                            "{log.customFeedback}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 shrink-0">
                        <button
                          onClick={() => deleteWorkoutLog(log.id)}
                          className="rounded-xl p-2 text-neutral-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                          title="Excluir este registro"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/40 to-neutral-900 p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-violet-300 uppercase">
                    Gamificação Discreta
                  </span>
                  <h4 className="text-xl font-extrabold text-white">
                    Nível {userStats?.level || 1} • {userStats?.xp || 0} XP
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Próximo nível em {(userStats?.nextLevelXp || 500) - (userStats?.xp || 0)} XP. Ganhe +150 XP ao concluir treinos.
                  </p>
                </div>
                <Award className="h-12 w-12 text-violet-400" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(userStats?.unlockedBadges || []).map((badge) => (
                  <div
                    key={badge.id}
                    className={`flex items-start gap-3 rounded-2xl border p-4 transition-all ${
                      badge.isUnlocked
                        ? 'border-lime-500/40 bg-[#0A0A0B] text-white'
                        : 'border-white/10 bg-[#0A0A0B]/40 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="text-3xl shrink-0">{badge.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold text-white">{badge.title}</h5>
                        {badge.isUnlocked && (
                          <span className="rounded bg-lime-500/20 px-1.5 py-0.5 text-[10px] font-bold text-lime-400">
                            DESBLOQUEADO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">{badge.description}</p>
                      {badge.unlockedAt && (
                        <span className="text-[10px] text-neutral-500 mt-1 block">
                          Conquistado em: {badge.unlockedAt}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
