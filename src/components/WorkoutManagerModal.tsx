/**
 * Gym Companion v1.0 — Treinos & Exercícios Manager
 * CRUD for Workouts A, B, C, D, exercise reordering, supersets, dropsets, and machine adjustment notes.
 */
import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Copy,
  Edit3,
  Check,
  ChevronUp,
  ChevronDown,
  Layers,
  Dumbbell,
  AlertCircle,
  HelpCircle,
  Film,
  Activity,
  Sparkles,
  PlayCircle,
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import { Workout, Exercise, MuscleGroup } from '../types';
import { ExerciseMediaModal } from './ExerciseMediaModal';

interface WorkoutManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWorkoutId?: string;
  onOpenPresetLibrary?: () => void;
}

export const WorkoutManagerModal: React.FC<WorkoutManagerModalProps> = ({
  isOpen,
  onClose,
  initialWorkoutId,
  onOpenPresetLibrary,
}) => {
  const { workouts, updateWorkout, createWorkout, deleteWorkout, duplicateWorkout } = useGym();
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>(
    initialWorkoutId || (workouts[0] ? workouts[0].id : '')
  );
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  if (!isOpen) return null;

  const currentWorkout = workouts.find((w) => w.id === selectedWorkoutId) || workouts[0];

  const handleCreateNewWorkout = () => {
    const newWorkout: Workout = {
      id: `workout-${Date.now()}`,
      code: 'E',
      name: 'Novo Treino Personalizado',
      subtitle: 'Foco e Adaptação Livre',
      color: 'emerald',
      description: 'Sessão customizada com seus exercícios favoritos.',
      exercises: [],
      estimatedDurationMinutes: 45,
    };
    createWorkout(newWorkout);
    setSelectedWorkoutId(newWorkout.id);
  };

  const handleAddExercise = () => {
    if (!currentWorkout) return;
    const newEx: Exercise = {
      id: `ex-${Date.now()}`,
      name: 'Novo Exercício',
      photoUrl: '',
      machine: 'Livre / Máquina',
      muscleGroup: 'Peito',
      equipment: 'Halteres',
      weightKg: 20,
      previousWeightKg: 20,
      suggestedWeightKg: 20,
      reps: 12,
      rpe: 8,
      defaultRestSeconds: 90,
      personalRecordKg: 20,
      history: [],
    };

    const updated = {
      ...currentWorkout,
      exercises: [...currentWorkout.exercises, newEx],
    };
    updateWorkout(updated);
    setEditingExercise(newEx);
  };

  const handleSaveExercise = (ex: Exercise) => {
    if (!currentWorkout) return;
    const currentExercises = currentWorkout.exercises || [];
    const updated = {
      ...currentWorkout,
      exercises: currentExercises.map((e) => (e.id === ex.id ? ex : e)),
    };
    updateWorkout(updated);
    setEditingExercise(null);
  };

  const handleDeleteExercise = (exId: string) => {
    if (!currentWorkout) return;
    const currentExercises = currentWorkout.exercises || [];
    const updated = {
      ...currentWorkout,
      exercises: currentExercises.filter((e) => e.id !== exId),
    };
    updateWorkout(updated);
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    if (!currentWorkout) return;
    const copy = [...(currentWorkout.exercises || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= copy.length) return;

    const [removed] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, removed);

    updateWorkout({ ...currentWorkout, exercises: copy });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0F0F11] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-lime-500/10 p-2.5 text-lime-400 border border-lime-500/30">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Fichas de Treino & Personalização
                </h3>
                <span className="rounded-full bg-lime-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-lime-600 dark:text-lime-400 border border-lime-500/30">
                  {currentWorkout?.code} • {currentWorkout?.name}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ficha A (17 exercícios: Peito + Quadríceps) e Ficha B (18 exercícios: Costas + Posterior)
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

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
          {/* Left Column: Workouts List */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 p-4 space-y-3 bg-[#0A0A0B]/60 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">
                Seus Treinos ({workouts.length})
              </span>
              <button
                onClick={handleCreateNewWorkout}
                className="flex items-center gap-1 rounded-lg bg-lime-500/20 px-2.5 py-1 text-xs font-bold text-lime-400 hover:bg-lime-500/30 border border-lime-500/30"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Criar</span>
              </button>
            </div>

            <div className="space-y-2">
              {workouts.map((w) => {
                const isSelected = w.id === currentWorkout?.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWorkoutId(w.id)}
                    className={`group cursor-pointer flex items-center justify-between rounded-xl p-3.5 border transition-all ${
                      isSelected
                        ? 'border-lime-500 bg-lime-500/10 text-white'
                        : 'border-white/10 bg-[#0F0F11]/60 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 font-extrabold text-xs text-white">
                        {w.code}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold truncate">{w.name}</h4>
                        <span className="text-[11px] text-slate-400">
                          {w.exercises.length} exercícios
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateWorkout(w.id);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Duplicar treino"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      {workouts.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteWorkout(w.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-400"
                          title="Excluir treino"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Exercises list for Selected Workout */}
          <div className="flex-1 p-5 sm:p-6 space-y-6">
            {currentWorkout && (
              <>
                {/* Workout Details Editor */}
                <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Informações Gerais do Treino
                    </span>
                    <div className="flex items-center gap-2">
                      {onOpenPresetLibrary && (
                        <button
                          onClick={onOpenPresetLibrary}
                          className="flex items-center gap-1.5 rounded-xl bg-lime-500/20 px-3.5 py-2 text-xs font-black text-lime-400 hover:bg-lime-500/30 border border-lime-500/30 transition"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>Banco Global de Exercícios (85+)</span>
                        </button>
                      )}
                      <button
                        onClick={handleAddExercise}
                        className="flex items-center gap-1.5 rounded-xl bg-lime-500 px-3.5 py-2 text-xs font-black text-black hover:bg-lime-400 shadow-md shadow-lime-500/20"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Adicionar Manualmente</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400">
                        Código / Letra
                      </label>
                      <input
                        type="text"
                        value={currentWorkout.code || ''}
                        onChange={(e) =>
                          updateWorkout({ ...currentWorkout, code: e.target.value as any })
                        }
                        className="mt-1 w-full rounded-xl bg-[#0F0F11] border border-white/10 px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-400">
                        Nome do Treino
                      </label>
                      <input
                        type="text"
                        value={currentWorkout.name || ''}
                        onChange={(e) =>
                          updateWorkout({ ...currentWorkout, name: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl bg-[#0F0F11] border border-white/10 px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Exercises list with Up/Down buttons */}
                <div className="space-y-3">
                  <span className="block text-xs font-bold text-slate-400 uppercase">
                    Lista de Exercícios & Ordem ({(currentWorkout?.exercises || []).length})
                  </span>

                  {(currentWorkout?.exercises || []).map((ex, index) => (
                    <div
                      key={ex.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0A0A0B] p-4 transition-all hover:border-white/20"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 font-extrabold text-xs text-slate-400">
                          {index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-white">{ex.name}</h5>
                            <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-300 border border-white/10">
                              {ex.muscleGroup}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {ex.isTimedCardio || ex.name.toLowerCase().includes('bike') ? (
                              <span className="text-lime-400 font-semibold">
                                ⏱ 1 série × 10 min (Cronômetro Cardio) • Descanso {ex.defaultRestSeconds}s
                              </span>
                            ) : (
                              <span>
                                {ex.weightKg} kg • {ex.sets || 4} séries × {ex.targetReps || `${ex.reps}`} reps • Descanso {ex.defaultRestSeconds}s
                              </span>
                            )}
                          </p>
                          {ex.adjustment && (
                            <p className="text-[11px] text-lime-400 mt-0.5">
                              Regulagem: {ex.adjustment}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleMoveExercise(index, 'up')}
                          disabled={index === 0}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-20"
                          title="Mover para cima"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleMoveExercise(index, 'down')}
                          disabled={index === currentWorkout.exercises.length - 1}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-20"
                          title="Mover para baixo"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingExercise(ex)}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white border border-white/10"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteExercise(ex.id)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                          title="Remover exercício"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Unified Exercise Editor Modal */}
        <ExerciseMediaModal
          isOpen={!!editingExercise}
          exercise={editingExercise}
          onClose={() => setEditingExercise(null)}
        />
      </div>
    </div>
  );
};
