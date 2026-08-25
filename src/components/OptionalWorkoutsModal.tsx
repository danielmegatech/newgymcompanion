import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Search,
  Plus,
  Edit3,
  Trash2,
  Dumbbell,
  Sparkles,
  Check,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Play,
  Layers,
  Info,
  Filter,
  Activity,
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import { MuscleGroup, Exercise, Workout } from '../types';
import { EXERCISE_MEDIA_LIBRARY, ExerciseMediaPreset, getUserCustomizedExercisePreset } from '../data/exerciseMediaLibrary';
import { ExerciseMediaModal } from './ExerciseMediaModal';

const muscleGroupsList: (MuscleGroup | 'Todos')[] = [
  'Todos',
  'Peito',
  'Costas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Quadríceps',
  'Posterior de Coxa',
  'Glúteos',
  'Panturrilha',
  'Abdômen',
  'Cardio',
  'Mobilidade',
  'Aquecimento',
  'Opcionais',
];

interface OptionalWorkoutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory?: string;
}

export const OptionalWorkoutsModal: React.FC<OptionalWorkoutsModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
}) => {
  const { workouts, updateWorkout, userStats } = useGym();

  // Search & Muscle Group Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>(selectedCategory || 'Todos');
  const [userExperienceLevel, setUserExperienceLevel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Intermediário');

  // Scroll ref for category pills
  const categoriesNavRef = useRef<HTMLDivElement>(null);

  const scrollCategoriesNav = (direction: 'left' | 'right') => {
    if (categoriesNavRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      categoriesNavRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Sync selectedCategory when passed
  useEffect(() => {
    if (selectedCategory) {
      setSelectedMuscle(selectedCategory);
    }
  }, [selectedCategory]);

  // Build complete preset exercises from EXERCISE_MEDIA_LIBRARY (65 exercises)
  const buildDefaultPresets = (level: 'Iniciante' | 'Intermediário' | 'Avançado') => {
    return EXERCISE_MEDIA_LIBRARY.map((preset, idx) => {
      const customSpec = getUserCustomizedExercisePreset(preset, level, userStats.weightKg || 75);
      return {
        id: `preset-${idx}-${preset.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: preset.name,
        photoUrl: preset.gifUrl,
        gifUrl: preset.gifUrl,
        videoUrl: preset.videoUrl,
        muscleIllustrationUrl: preset.muscleIllustrationUrl,
        muscleGroup: preset.muscleGroup,
        equipment: preset.equipment,
        equipmentName: preset.equipment,
        adjustment: preset.adjustment || 'Regulagem padrão recomendada',
        notes: `${preset.muscleDescription}${preset.execution ? ` | Execução: ${preset.execution}` : ''}${preset.commonErrors ? ` | Erros: ${preset.commonErrors}` : ''}`,
        execution: preset.execution,
        commonErrors: preset.commonErrors,
        sets: customSpec.sets,
        reps: customSpec.reps,
        weightKg: customSpec.weightKg,
        previousWeightKg: customSpec.weightKg,
        suggestedWeightKg: customSpec.weightKg,
        rpe: level === 'Iniciante' ? 6 : level === 'Intermediário' ? 8 : 9,
        defaultRestSeconds: customSpec.restSeconds,
        history: [],
        personalRecordKg: customSpec.weightKg,
      } as Exercise & { execution?: string; commonErrors?: string; equipmentName?: string };
    });
  };

  // Presets list initialized with full 65 items
  const [customPresets, setCustomPresets] = useState<Exercise[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('gym_global_preset_exercises_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 60) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return buildDefaultPresets('Intermediário');
  });

  // Save presets whenever updated
  useEffect(() => {
    localStorage.setItem('gym_global_preset_exercises_v3', JSON.stringify(customPresets));
  }, [customPresets]);

  // Reset to full 65 default exercises
  const handleResetToDefaultLibrary = () => {
    const fresh = buildDefaultPresets(userExperienceLevel);
    setCustomPresets(fresh);
    localStorage.setItem('gym_global_preset_exercises_v3', JSON.stringify(fresh));
    setAddedSuccessMsg('Biblioteca restaurada com sucesso (65 Exercícios em 14 categorias)!');
    setTimeout(() => setAddedSuccessMsg(null), 3000);
  };

  // Re-apply experience level to all exercises
  const handleLevelChange = (level: 'Iniciante' | 'Intermediário' | 'Avançado') => {
    setUserExperienceLevel(level);
    setCustomPresets((prev) =>
      prev.map((ex) => {
        const matchPreset = EXERCISE_MEDIA_LIBRARY.find((p) => p.name === ex.name);
        if (matchPreset) {
          const customSpec = getUserCustomizedExercisePreset(matchPreset, level, userStats.weightKg || 75);
          return {
            ...ex,
            sets: customSpec.sets,
            reps: customSpec.reps,
            weightKg: customSpec.weightKg,
            suggestedWeightKg: customSpec.weightKg,
            defaultRestSeconds: customSpec.restSeconds,
          };
        }
        return ex;
      })
    );
  };

  // Modal State for Editing Exercise Media/Options via ExerciseMediaModal
  const [exerciseToEdit, setExerciseToEdit] = useState<Exercise | null>(null);

  // Modal State for Adding New Custom Preset
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPresetForm, setNewPresetForm] = useState({
    name: '',
    muscleGroup: 'Peito' as MuscleGroup,
    equipmentName: 'Halteres',
    sets: 4,
    reps: 10,
    weightKg: 20,
    restSeconds: 60,
    gifUrl: '',
    notes: 'Execução focada na hipertrofia e amplitude completa.',
  });

  // Success Notification state
  const [addedSuccessMsg, setAddedSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Complete 16 Muscle Categories
  const muscleCategoriesList = [
    { name: 'Todos', count: customPresets.length },
    { name: 'Cardio', count: customPresets.filter((e) => e.muscleGroup === 'Cardio').length },
    { name: 'Mobilidade', count: customPresets.filter((e) => e.muscleGroup === 'Mobilidade').length },
    { name: 'Aquecimento', count: customPresets.filter((e) => e.muscleGroup === 'Aquecimento').length },
    { name: 'Opcionais', count: customPresets.filter((e) => e.muscleGroup === 'Opcionais').length },
    { name: 'Ombros', count: customPresets.filter((e) => e.muscleGroup === 'Ombros').length },
    { name: 'Glúteos', count: customPresets.filter((e) => e.muscleGroup === 'Glúteos').length },
    { name: 'Bíceps', count: customPresets.filter((e) => e.muscleGroup === 'Bíceps').length },
    { name: 'Tríceps', count: customPresets.filter((e) => e.muscleGroup === 'Tríceps').length },
    { name: 'Costas', count: customPresets.filter((e) => e.muscleGroup === 'Costas').length },
    { name: 'Peito', count: customPresets.filter((e) => e.muscleGroup === 'Peito').length },
    { name: 'Quadríceps', count: customPresets.filter((e) => e.muscleGroup === 'Quadríceps').length },
    { name: 'Posterior de Coxa', count: customPresets.filter((e) => e.muscleGroup === 'Posterior de Coxa' || e.muscleGroup === 'Posterior').length },
    { name: 'Panturrilhas', count: customPresets.filter((e) => e.muscleGroup === 'Panturrilhas' || e.muscleGroup === 'Panturrilha').length },
    { name: 'Abdômen', count: customPresets.filter((e) => e.muscleGroup === 'Abdômen' || e.muscleGroup === 'Abs').length },
    { name: 'Trapézio', count: customPresets.filter((e) => e.muscleGroup === 'Trapézio').length },
    { name: 'Antebraço', count: customPresets.filter((e) => e.muscleGroup === 'Antebraço').length },
  ];

  // Filter exercises
  const filteredPresets = customPresets.filter((ex) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      ex.name.toLowerCase().includes(term) ||
      ex.muscleGroup.toLowerCase().includes(term) ||
      (ex.equipment && ex.equipment.toLowerCase().includes(term)) ||
      (ex.notes && ex.notes.toLowerCase().includes(term));

    let matchesMuscle = selectedMuscle === 'Todos';
    if (!matchesMuscle) {
      if (selectedMuscle === 'Posterior de Coxa') {
        matchesMuscle = ex.muscleGroup === 'Posterior de Coxa' || ex.muscleGroup === 'Posterior';
      } else if (selectedMuscle === 'Panturrilhas') {
        matchesMuscle = ex.muscleGroup === 'Panturrilhas' || ex.muscleGroup === 'Panturrilha';
      } else if (selectedMuscle === 'Abdômen') {
        matchesMuscle = ex.muscleGroup === 'Abdômen' || ex.muscleGroup === 'Abs';
      } else {
        matchesMuscle = ex.muscleGroup.toLowerCase() === selectedMuscle.toLowerCase();
      }
    }
    return matchesSearch && matchesMuscle;
  });

  // Save updated exercise from ExerciseMediaModal
  const handleSaveExerciseMedia = (updatedEx: Exercise) => {
    setCustomPresets((prev) =>
      prev.map((ex) => (ex.id === updatedEx.id ? updatedEx : ex))
    );

    // Also update this exercise in any workout that contains it
    workouts.forEach((w) => {
      const hasEx = w.exercises.some((e) => e.name === updatedEx.name || e.id === updatedEx.id);
      if (hasEx) {
        updateWorkout({
          ...w,
          exercises: w.exercises.map((e) =>
            e.name === updatedEx.name || e.id === updatedEx.id ? { ...e, ...updatedEx } : e
          ),
        });
      }
    });

    setExerciseToEdit(null);
  };

  // Add Preset to Workout Ficha (A, B, C, D)
  const handleAddPresetToWorkout = (presetEx: Exercise, targetWorkoutId: string) => {
    const targetWorkout = (workouts || []).find((w) => w.id === targetWorkoutId);
    if (!targetWorkout) return;

    const newEx: Exercise = {
      ...presetEx,
      id: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };

    updateWorkout({
      ...targetWorkout,
      exercises: [...(targetWorkout.exercises || []), newEx],
    });

    setAddedSuccessMsg(`Exercício "${presetEx.name}" adicionado à Ficha ${targetWorkout.code}!`);
    setTimeout(() => setAddedSuccessMsg(null), 3000);
  };

  // Add New Custom Preset to Master Library
  const handleCreateNewPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetForm.name.trim()) return;

    const created: Exercise = {
      id: `preset-custom-${Date.now()}`,
      name: newPresetForm.name.trim(),
      photoUrl: newPresetForm.gifUrl,
      gifUrl: newPresetForm.gifUrl,
      muscleGroup: newPresetForm.muscleGroup,
      equipment: newPresetForm.equipmentName,
      adjustment: 'Ajuste personalizado',
      notes: newPresetForm.notes,
      sets: Number(newPresetForm.sets),
      reps: Number(newPresetForm.reps),
      weightKg: Number(newPresetForm.weightKg),
      previousWeightKg: Number(newPresetForm.weightKg),
      suggestedWeightKg: Number(newPresetForm.weightKg),
      rpe: 8,
      defaultRestSeconds: Number(newPresetForm.restSeconds),
      history: [],
      personalRecordKg: Number(newPresetForm.weightKg),
    };

    setCustomPresets((prev) => [created, ...prev]);
    setShowAddModal(false);
    setNewPresetForm({
      name: '',
      muscleGroup: 'Peito',
      equipmentName: 'Halteres',
      sets: 4,
      reps: 10,
      weightKg: 20,
      restSeconds: 60,
      gifUrl: '',
      notes: 'Execução focada na hipertrofia e amplitude completa.',
    });
  };

  // Delete Preset from Library
  const handleDeletePreset = (presetId: string) => {
    setCustomPresets((prev) => prev.filter((ex) => ex.id !== presetId));
    setAddedSuccessMsg('Exercício preset removido da biblioteca.');
    setTimeout(() => setAddedSuccessMsg(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-6 animate-fadeIn">
      <div className="relative flex flex-col h-[94vh] max-h-[920px] max-w-6xl w-full rounded-3xl border border-white/10 bg-[#0F0F11] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 p-4 sm:p-6 bg-[#0A0A0B] gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-500/20 text-lime-400 border border-lime-500/30">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Banco Global de Exercícios & Presets
                </h2>
                <span className="rounded bg-lime-500/20 px-2 py-0.5 text-[10px] font-black text-lime-400 border border-lime-500/30">
                  {customPresets.length} Exercícios
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Edite todas as opções, mídias, GIFs, regulagens e inclua novos exercícios em todas as fichas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-black text-xs shadow-lg shadow-lime-500/20 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Exercício Preset</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-xl bg-white/5 p-2.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {addedSuccessMsg && (
          <div className="bg-lime-500 text-black px-4 py-2.5 text-xs font-black flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>{addedSuccessMsg}</span>
            </div>
            <button onClick={() => setAddedSuccessMsg(null)}>✕</button>
          </div>
        )}

        {/* Search, Level Selector & 14 Muscle Category Filters Bar */}
        <div className="p-4 border-b border-white/10 bg-[#0A0A0B]/80 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por nome do exercício, grupo muscular, equipamento ou instrução..."
                className="w-full rounded-2xl bg-black/60 border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-500"
              />
            </div>

            {/* Level Selector Bar */}
            <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-2xl border border-white/10 shrink-0">
              <span className="text-[10px] uppercase font-black text-slate-400 px-2">
                Nível:
              </span>
              {(['Iniciante', 'Intermediário', 'Avançado'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleLevelChange(lvl)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition ${
                    userExperienceLevel === lvl
                      ? 'bg-lime-500 text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl === 'Iniciante' ? '🟢' : lvl === 'Intermediário' ? '🟡' : '🔴'} {lvl}
                </button>
              ))}
            </div>

            {/* Re-sync 65 presets button */}
            <button
              onClick={handleResetToDefaultLibrary}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-extrabold text-xs border border-white/10 transition shrink-0"
              title="Restaurar a biblioteca original com 65 exercícios em 14 categorias"
            >
              <Sparkles className="h-3.5 w-3.5 text-lime-400" />
              <span>Restaurar 65 Presets</span>
            </button>
          </div>

          {/* 14 Muscle Group Category Pills with Smooth Scroll & Navigation Buttons */}
          <div className="relative flex items-center gap-1.5 pt-1">
            <button
              onClick={() => scrollCategoriesNav('left')}
              className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition shrink-0 active:scale-95"
              title="Rolar Categorias para a Esquerda"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div
              ref={categoriesNavRef}
              className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth w-full"
            >
              {muscleCategoriesList.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedMuscle(cat.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                    selectedMuscle === cat.name
                      ? 'bg-lime-500 text-black shadow-md shadow-lime-500/20 scale-105'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-mono ${
                      selectedMuscle === cat.name
                        ? 'bg-black/20 text-black'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => scrollCategoriesNav('right')}
              className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition shrink-0 active:scale-95"
              title="Rolar Categorias para a Direita"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Preset Exercises Cards Grid */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {filteredPresets.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs font-medium space-y-2">
              <p>Nenhum exercício encontrado com os filtros aplicados.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedMuscle('Todos');
                }}
                className="text-lime-400 font-bold hover:underline"
              >
                Limpar Filtros de Busca
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPresets.map((ex) => (
                <div
                  key={ex.id}
                  className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-4 flex flex-col justify-between space-y-3 hover:border-lime-500/40 transition-all shadow-lg group"
                >
                  {/* Top Badge & Name */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-lime-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-lime-400 border border-lime-500/30">
                        {ex.muscleGroup}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {ex.equipmentName || 'Aparelho'}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-white group-hover:text-lime-400 transition-colors line-clamp-1">
                      {ex.name}
                    </h3>

                    {/* GIF / Thumbnail Preview */}
                    <div className="h-28 w-full rounded-xl overflow-hidden bg-black/60 border border-white/5 relative flex items-center justify-center">
                      {ex.gifUrl ? (
                        <img
                          src={ex.gifUrl}
                          alt={ex.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500 gap-1">
                          <Activity className="h-6 w-6 text-slate-600" />
                          <span className="text-[10px] text-slate-400 font-medium">Sem imagem vinculada</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 pointer-events-none">
                        <span className="text-[10px] text-slate-300 font-medium line-clamp-1">
                          {ex.notes || 'Configuração completa disponível'}
                        </span>
                      </div>
                    </div>

                    {/* Defaults specs */}
                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-300 bg-white/5 p-2 rounded-xl">
                      <span>{ex.sets || 4} Séries</span>
                      <span>•</span>
                      <span>{ex.reps || 10} Reps</span>
                      <span>•</span>
                      <span>{ex.weightKg || 20} kg</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    {/* Primary Button: Edit all 8 tabs & media */}
                    <button
                      onClick={() => setExerciseToEdit(ex)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-lime-500/15 hover:bg-lime-500 text-lime-400 hover:text-black font-black text-xs border border-lime-500/30 transition active:scale-95"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Editar Mídia, Regulagem & Abas</span>
                    </button>

                    {/* Quick Add to Ficha Dropdown / Action Buttons */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-bold shrink-0">➕ Adicionar a:</span>
                      <div className="flex flex-1 gap-1 overflow-x-auto">
                        {workouts.map((w) => (
                          <button
                            key={w.id}
                            onClick={() => handleAddPresetToWorkout(ex, w.id)}
                            className="flex-1 py-1 px-1.5 rounded-lg bg-white/5 hover:bg-lime-500 hover:text-black text-[10px] font-black text-slate-300 border border-white/10 transition"
                            title={`Adicionar ao treino Ficha ${w.code}`}
                          >
                            Ficha {w.code}
                          </button>
                        ))}
                      </div>

                      {/* Delete Custom Preset */}
                      <button
                        onClick={() => handleDeletePreset(ex.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition"
                        title="Excluir preset"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal 1: Edit Exercise via ExerciseMediaModal */}
        {exerciseToEdit && (
          <ExerciseMediaModal
            isOpen={Boolean(exerciseToEdit)}
            exercise={exerciseToEdit}
            onClose={() => setExerciseToEdit(null)}
            onSave={handleSaveExerciseMedia}
          />
        )}

        {/* Modal 2: Create New Custom Preset Form */}
        {showAddModal && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
            <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0F0F11] p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-lime-400" />
                  <h3 className="text-base font-black text-white">Criar Novo Exercício Preset</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateNewPreset} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Nome do Exercício</label>
                  <input
                    type="text"
                    required
                    value={newPresetForm.name || ''}
                    onChange={(e) => setNewPresetForm({ ...newPresetForm, name: e.target.value })}
                    placeholder="Ex: Agachamento Sumô com Kettlebell"
                    className="w-full rounded-xl bg-black border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-lime-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Grupo Muscular</label>
                    <select
                      value={newPresetForm.muscleGroup || 'Peito'}
                      onChange={(e) => setNewPresetForm({ ...newPresetForm, muscleGroup: e.target.value as MuscleGroup })}
                      className="w-full rounded-xl bg-black border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-lime-500"
                    >
                      {muscleGroupsList.filter((m) => m !== 'Todos').map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Equipamento</label>
                    <input
                      type="text"
                      value={newPresetForm.equipmentName || ''}
                      onChange={(e) => setNewPresetForm({ ...newPresetForm, equipmentName: e.target.value })}
                      placeholder="Ex: Halteres, Polia, Cadeira"
                      className="w-full rounded-xl bg-black border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-lime-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Séries</label>
                    <input
                      type="number"
                      value={newPresetForm.sets ?? 4}
                      onChange={(e) => setNewPresetForm({ ...newPresetForm, sets: Number(e.target.value) })}
                      className="w-full rounded-xl bg-black border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-lime-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Reps</label>
                    <input
                      type="number"
                      value={newPresetForm.reps ?? 10}
                      onChange={(e) => setNewPresetForm({ ...newPresetForm, reps: Number(e.target.value) })}
                      className="w-full rounded-xl bg-black border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-lime-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Carga (kg)</label>
                    <input
                      type="number"
                      value={newPresetForm.weightKg ?? 20}
                      onChange={(e) => setNewPresetForm({ ...newPresetForm, weightKg: Number(e.target.value) })}
                      className="w-full rounded-xl bg-black border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-lime-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">URL da Animação GIF / Imagem</label>
                  <input
                    type="url"
                    value={newPresetForm.gifUrl || ''}
                    onChange={(e) => setNewPresetForm({ ...newPresetForm, gifUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-xl bg-black border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-lime-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-lime-500 hover:bg-lime-400 text-black font-black text-xs shadow-xl shadow-lime-500/20 transition active:scale-95"
                >
                  Salvar Exercício no Banco Global
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
