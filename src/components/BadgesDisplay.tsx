/**
 * Gym Companion v1.0 — BadgesDisplay Component
 * Component for rendering user achievement badges with filtering, search, progress stats, and detailed modal popups.
 */
import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Award,
  Lock,
  Unlock,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  X,
  Share2,
  Calendar,
  Flame,
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import { Badge } from '../types';

interface BadgesDisplayProps {
  badges?: Badge[];
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

export const BADGE_CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'consistência', label: 'Consistência' },
  { id: 'progressão', label: 'Progressão' },
  { id: 'volume', label: 'Volume' },
  { id: 'desempenho', label: 'Desempenho' },
  { id: 'disciplina', label: 'Disciplina' },
  { id: 'força', label: 'Força' },
  { id: 'grupos', label: 'Grupos' },
  { id: 'técnica', label: 'Técnica' },
  { id: 'ritmo', label: 'Ritmo' },
  { id: 'exercícios', label: 'Exercícios' },
  { id: 'desafio', label: 'Desafio' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'intensidade', label: 'Intensidade' },
  { id: 'especial', label: 'Especial' },
];

export const BadgesDisplay: React.FC<BadgesDisplayProps> = ({
  badges: customBadges,
  className = '',
  showTitle = true,
  compact = false,
}) => {
  const { userStats, evaluateBadgesNow } = useGym();
  const allBadges = customBadges || userStats.unlockedBadges || [];

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalBadge, setActiveModalBadge] = useState<Badge | null>(null);

  // Statistics
  const totalBadges = allBadges.length;
  const unlockedCount = useMemo(
    () => allBadges.filter((b) => b.isUnlocked).length,
    [allBadges]
  );
  const unlockedPercentage = totalBadges > 0 ? Math.round((unlockedCount / totalBadges) * 100) : 0;

  // Filtered Badges
  const filteredBadges = useMemo(() => {
    return allBadges.filter((badge) => {
      // Category match
      if (selectedCategory !== 'todos' && badge.category !== selectedCategory) {
        return false;
      }
      // Status match
      if (statusFilter === 'unlocked' && !badge.isUnlocked) return false;
      if (statusFilter === 'locked' && badge.isUnlocked) return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = badge.title.toLowerCase().includes(query);
        const matchesDesc = badge.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [allBadges, selectedCategory, statusFilter, searchQuery]);

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Optional Header Banner & Progress */}
      {showTitle && (
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-lime-500 text-black font-black shadow-lg shadow-lime-500/20">
                <Trophy className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-lime-600 dark:text-lime-400 block">
                  Galeria de Conquistas
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Badges & Conquistas do Atleta
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-2 rounded-2xl border border-slate-200 dark:border-white/10 flex-1 sm:flex-none justify-around">
                <div className="text-center px-3">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block">
                    Desbloqueados
                  </span>
                  <span className="text-base font-black text-lime-600 dark:text-lime-400">
                    {unlockedCount} / {totalBadges}
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
                <div className="text-center px-3">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block">
                    Progresso Total
                  </span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {unlockedPercentage}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => evaluateBadgesNow()}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-lime-500 hover:bg-lime-400 text-black text-xs font-black shadow-md shadow-lime-500/20 transition active:scale-95 shrink-0"
                title="Avaliar conquistas agora"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Avaliar Conquistas</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>Nível de Colecionador</span>
              <span className="text-lime-600 dark:text-lime-400 font-extrabold">
                {unlockedCount} de {totalBadges} conquistas ({unlockedPercentage}%)
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden p-0.5 border border-slate-200 dark:border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lime-500 via-emerald-400 to-cyan-400 transition-all duration-700 shadow-sm"
                style={{ width: `${Math.max(unlockedPercentage, 3)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar badge por nome ou descrição..."
              className="w-full rounded-2xl bg-white dark:bg-[#0F0F11] border border-slate-200 dark:border-white/10 pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 dark:bg-[#0F0F11] p-1 border border-slate-200 dark:border-white/10 shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-lime-500 text-black shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todos ({totalBadges})
            </button>
            <button
              onClick={() => setStatusFilter('unlocked')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === 'unlocked'
                  ? 'bg-lime-500 text-black shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Conquistados ({unlockedCount})
            </button>
            <button
              onClick={() => setStatusFilter('locked')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === 'locked'
                  ? 'bg-lime-500 text-black shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Bloqueados ({totalBadges - unlockedCount})
            </button>
          </div>
        </div>

        {/* Category Carousel Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {BADGE_CATEGORIES.map((cat) => {
            const countCat = allBadges.filter(
              (b) => cat.id === 'todos' || b.category === cat.id
            ).length;
            if (countCat === 0 && cat.id !== 'todos') return null;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 dark:bg-lime-500 text-white dark:text-black border-slate-900 dark:border-lime-500 shadow-md'
                    : 'bg-white dark:bg-[#0F0F11] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[9px] ${
                    selectedCategory === cat.id
                      ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black'
                      : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {countCat}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges Grid */}
      {filteredBadges.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 p-10 text-center space-y-3 bg-slate-50/50 dark:bg-white/5">
          <Award className="h-10 w-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-black text-slate-900 dark:text-white">
            Nenhuma badge encontrada
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Tente ajustar os filtros ou o termo de busca para visualizar mais conquistas.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('todos');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="rounded-xl bg-lime-500 text-black px-4 py-2 text-xs font-black shadow-md hover:bg-lime-400 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-3 ${
            compact
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
          }`}
        >
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => setActiveModalBadge(badge)}
              className={`group cursor-pointer relative flex flex-col justify-between p-4 rounded-3xl border transition-all duration-200 hover:scale-[1.02] ${
                badge.isUnlocked
                  ? 'border-lime-500/40 bg-white dark:bg-[#0F0F11] shadow-lg shadow-lime-500/5 hover:border-lime-500'
                  : 'border-slate-200 dark:border-white/5 bg-slate-50/70 dark:bg-white/5 opacity-60 hover:opacity-90'
              }`}
            >
              <div className="space-y-3">
                {/* Badge Top Header */}
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-transform group-hover:scale-110 ${
                      badge.isUnlocked
                        ? 'bg-lime-500/10 border border-lime-500/30'
                        : 'bg-slate-200/60 dark:bg-white/10'
                    }`}
                  >
                    <span>{badge.icon}</span>
                  </div>

                  {badge.isUnlocked ? (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase bg-lime-500/20 text-lime-600 dark:text-lime-400 border border-lime-500/30 px-2 py-0.5 rounded-full shadow-sm">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>OK</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-200/80 dark:bg-white/10 text-slate-400">
                      <Lock className="h-3 w-3" />
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Unlocked Date or Category tag */}
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[9px] font-semibold text-slate-400">
                <span className="capitalize">{badge.category}</span>
                {badge.unlockedAt ? (
                  <span className="text-lime-600 dark:text-lime-400 font-extrabold">
                    {badge.unlockedAt}
                  </span>
                ) : (
                  <span>Bloqueado</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {activeModalBadge && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] p-6 shadow-2xl space-y-5 text-center">
            <button
              onClick={() => setActiveModalBadge(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Icon */}
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-lime-500/20 to-emerald-500/20 border-2 border-lime-500 text-5xl shadow-xl shadow-lime-500/20">
              <span>{activeModalBadge.icon}</span>
              {activeModalBadge.isUnlocked && (
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-lime-500 text-black shadow-md">
                  <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-2">
              <span className="inline-block rounded-md bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                Categoria: {activeModalBadge.category}
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {activeModalBadge.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {activeModalBadge.description}
              </p>
            </div>

            {/* Status Footer */}
            <div className="rounded-2xl bg-slate-50 dark:bg-white/5 p-3.5 border border-slate-200 dark:border-white/10 text-xs font-bold space-y-1">
              {activeModalBadge.isUnlocked ? (
                <div className="flex items-center justify-center gap-2 text-lime-600 dark:text-lime-400">
                  <Sparkles className="h-4 w-4" />
                  <span>Conquistado em {activeModalBadge.unlockedAt || 'Histórico Recente'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <Lock className="h-4 w-4" />
                  <span>Ainda Não Conquistado — Continue Treinando!</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveModalBadge(null)}
              className="w-full rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black py-3 text-xs font-black shadow-lg hover:opacity-90 transition-opacity"
            >
              FECHAR DETALHES
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
