/**
 * Gym Companion v2.0 — Master Exercise Library Modal (Banco Global de Exercícios)
 * Repositório Central Unificado com 85+ Exercícios:
 * - Slideshow/Carrossel de Mídias (Fotos da Máquina, GIFs de Movimento, Anatomia, Setup)
 * - Editor Completo de Exercícios (Criar novo, Editar campos técnicos, Deletar)
 * - Filtro Rápido por Status: "Todos", "Faltam Imagem/GIF", "Com Mídia"
 * - Inserir Exercício diretamente nos Treinos (Treino A, B, C, D ou Personalizado)
 * - Regulagens de Máquinas e Cuidados Articulares
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Dumbbell,
  Search,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Table,
  Sliders,
  AlertTriangle,
  Check,
  FolderPlus,
  Video,
  Link2,
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import { MasterExercise, MediaAttachment, MuscleGroup } from '../types';
import { MediaCarousel } from './MediaCarousel';

interface MasterExerciseLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  onSelectExerciseForWorkout?: (exercise: MasterExercise) => void;
}

const MUSCLE_GROUPS: (MuscleGroup | 'Todos')[] = [
  'Todos',
  'Quadríceps',
  'Costas',
  'Peito',
  'Ombros',
  'Posterior',
  'Bíceps',
  'Tríceps',
  'Abdômen',
  'Glúteos',
  'Panturrilha',
  'Antebraço',
  'Trapézio',
  'Cardio',
  'Mobilidade',
  'Aquecimento',
];

export const MasterExerciseLibraryModal: React.FC<MasterExerciseLibraryModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
  onSelectExerciseForWorkout,
}) => {
  const {
    masterExercises,
    updateMasterExercise,
    addMasterExercise,
    deleteMasterExercise,
    addMediaAttachment,
    removeMediaAttachment,
    workouts,
    addExerciseToWorkout,
  } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'Todos'>('Todos');
  const [mediaFilter, setMediaFilter] = useState<'todos' | 'sem_midia' | 'com_midia'>('todos');
  const [selectedExercise, setSelectedExercise] = useState<MasterExercise | null>(null);

  // Modals & Panels
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);
  const [isEditingFullExercise, setIsEditingFullExercise] = useState(false);
  const [showAddToWorkoutDropdown, setShowAddToWorkoutDropdown] = useState(false);
  const [addedSuccessMessage, setAddedSuccessMessage] = useState<string | null>(null);

  // New Media Form state
  const [newMediaType, setNewMediaType] = useState<MediaAttachment['type']>('motion');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaDesc, setNewMediaDesc] = useState('');

  // Editing Media Item State (for inline URL replacement)
  const [editingMediaTarget, setEditingMediaTarget] = useState<{
    id?: string;
    type: MediaAttachment['type'];
    url: string;
    title?: string;
  } | null>(null);
  const [editingMediaNewUrl, setEditingMediaNewUrl] = useState('');
  const [editingMediaNewTitle, setEditingMediaNewTitle] = useState('');

  // Machine Notes edit state
  const [setupNotes, setSetupNotes] = useState('');
  const [setupPins, setSetupPins] = useState('');

  // Deletion confirmation modal state
  const [exerciseToDelete, setExerciseToDelete] = useState<MasterExercise | null>(null);

  // Full Exercise Form (Create / Edit) state
  const [formName, setFormName] = useState('');
  const [formMuscleGroup, setFormMuscleGroup] = useState<MuscleGroup>('Peito');
  const [formEquipment, setFormEquipment] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formExecutionTips, setFormExecutionTips] = useState('');
  const [formCommonMistakes, setFormCommonMistakes] = useState('');
  const [formLoadUnit, setFormLoadUnit] = useState<'kg' | 'placas' | 'nivel' | 'minutos'>('kg');
  const [formDifficulty, setFormDifficulty] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Intermediário');
  const [formRestSeconds, setFormRestSeconds] = useState(60);
  const [formKneeWarning, setFormKneeWarning] = useState(false);
  const [formShoulderWarning, setFormShoulderWarning] = useState(false);

  // Sync category on open or category prop change
  useEffect(() => {
    if (initialCategory) {
      const match = MUSCLE_GROUPS.find(
        (mg) => mg.toLowerCase() === initialCategory.toLowerCase()
      );
      if (match) {
        setSelectedMuscle(match);
      } else if (initialCategory === 'Todos') {
        setSelectedMuscle('Todos');
      } else {
        setSearchQuery(initialCategory);
      }
    }
  }, [initialCategory, isOpen]);

  if (!isOpen) return null;

  const totalWithoutMedia = masterExercises.filter(
    (ex) => !ex.mediaAttachments || ex.mediaAttachments.length === 0
  ).length;
  const totalWithMedia = masterExercises.length - totalWithoutMedia;

  const filteredExercises = masterExercises.filter((ex) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ex.name.toLowerCase().includes(q) ||
      ex.equipment.toLowerCase().includes(q) ||
      (ex.aliases && ex.aliases.some((a) => a.toLowerCase().includes(q))) ||
      ex.primaryMuscles.some((m) => m.toLowerCase().includes(q));

    const matchesMuscle =
      selectedMuscle === 'Todos' ||
      ex.muscleGroup === selectedMuscle ||
      (selectedMuscle === 'Posterior' && ex.muscleGroup === 'Posterior de Coxa') ||
      (selectedMuscle === 'Panturrilha' && ex.muscleGroup === 'Panturrilhas');

    const mediaCount = ex.mediaAttachments?.length || 0;
    const matchesMediaFilter =
      mediaFilter === 'todos' ||
      (mediaFilter === 'sem_midia' && mediaCount === 0) ||
      (mediaFilter === 'com_midia' && mediaCount > 0);

    return matchesSearch && matchesMuscle && matchesMediaFilter;
  });

  const handleOpenDetail = (ex: MasterExercise) => {
    setSelectedExercise(ex);
    setIsEditingNotes(false);
    setIsAddingMedia(false);
    setIsEditingFullExercise(false);
    setShowAddToWorkoutDropdown(false);
    setSetupNotes(ex.machineSetup?.notes || ex.instructions || '');
    setSetupPins(ex.machineSetup?.pins || (ex.executionTips ? ex.executionTips.join('. ') : ''));
  };

  const handleSaveNotes = () => {
    if (!selectedExercise) return;
    const updated: MasterExercise = {
      ...selectedExercise,
      instructions: setupNotes || selectedExercise.instructions,
      machineSetup: {
        ...(selectedExercise.machineSetup || {}),
        notes: setupNotes,
        pins: setupPins,
      },
    };
    updateMasterExercise(updated);
    setSelectedExercise(updated);
    setIsEditingNotes(false);
  };

  const handleAddMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExercise || !newMediaUrl.trim()) return;

    const attachment: MediaAttachment = {
      id: `media-${Date.now()}`,
      type: newMediaType,
      url: newMediaUrl.trim(),
      title: newMediaTitle.trim() || 'Nova Mídia',
      description: newMediaDesc.trim() || undefined,
      order: (selectedExercise.mediaAttachments?.length || 0) + 1,
    };

    addMediaAttachment(selectedExercise.id, attachment);

    const updated = {
      ...selectedExercise,
      mediaAttachments: [...(selectedExercise.mediaAttachments || []), attachment],
    };
    setSelectedExercise(updated);
    setIsAddingMedia(false);
    setNewMediaUrl('');
    setNewMediaTitle('');
    setNewMediaDesc('');
  };

  const handleDeleteMediaAttachment = (media: MediaAttachment, index?: number) => {
    if (!selectedExercise) return;
    const targetUrl = media.url?.trim();
    const targetId = media.id;

    // 1. Remove from media attachments array
    const updatedAttachments = (selectedExercise.mediaAttachments || []).filter(
      (m) => m.id !== targetId && m.url?.trim() !== targetUrl
    );

    // 2. Clear legacy / shortcut fields if they match this media URL or type
    const isMotion = media.type === 'motion' || targetUrl === selectedExercise.gifUrl;
    const isPhoto = media.type === 'machine' || targetUrl === selectedExercise.photoUrl;
    const isAnatomy =
      media.type === 'anatomy' ||
      targetUrl === selectedExercise.muscleIllustrationUrl ||
      targetUrl === selectedExercise.anatomyUrl;
    const isSetup = media.type === 'setup' || targetUrl === selectedExercise.adjustmentPhotoUrl;
    const isVideo = media.type === 'video' || targetUrl === selectedExercise.videoUrl;

    const updated: MasterExercise = {
      ...selectedExercise,
      mediaAttachments: updatedAttachments,
      gifUrl: isMotion ? '' : selectedExercise.gifUrl,
      photoUrl: isPhoto ? '' : selectedExercise.photoUrl,
      muscleIllustrationUrl: isAnatomy ? '' : selectedExercise.muscleIllustrationUrl,
      anatomyUrl: isAnatomy ? '' : selectedExercise.anatomyUrl,
      adjustmentPhotoUrl: isSetup ? '' : selectedExercise.adjustmentPhotoUrl,
      videoUrl: isVideo ? '' : selectedExercise.videoUrl,
    };

    updateMasterExercise(updated);
    setSelectedExercise(updated);
    if (media.id) {
      removeMediaAttachment(selectedExercise.id, media.id);
    }
  };

  const handleReplaceMediaAttachment = (
    media: { id?: string; type: MediaAttachment['type']; url: string; title?: string },
    newUrl: string,
    newTitle?: string
  ) => {
    if (!selectedExercise || !newUrl.trim()) return;
    const cleanUrl = newUrl.trim();
    const oldUrl = media.url?.trim();
    const targetId = media.id;

    let foundInAttachments = false;
    const updatedAttachments = (selectedExercise.mediaAttachments || []).map((m) => {
      if ((targetId && m.id === targetId) || (oldUrl && m.url?.trim() === oldUrl)) {
        foundInAttachments = true;
        return {
          ...m,
          url: cleanUrl,
          title: newTitle || m.title || media.title || 'Mídia Atualizada',
        };
      }
      return m;
    });

    if (!foundInAttachments) {
      updatedAttachments.push({
        id: `media-${Date.now()}`,
        type: media.type || 'motion',
        url: cleanUrl,
        title: newTitle || media.title || 'Mídia Atualizada',
        order: updatedAttachments.length + 1,
      });
    }

    const isMotion = media.type === 'motion' || oldUrl === selectedExercise.gifUrl;
    const isPhoto = media.type === 'machine' || oldUrl === selectedExercise.photoUrl;
    const isAnatomy =
      media.type === 'anatomy' ||
      oldUrl === selectedExercise.muscleIllustrationUrl ||
      oldUrl === selectedExercise.anatomyUrl;
    const isSetup = media.type === 'setup' || oldUrl === selectedExercise.adjustmentPhotoUrl;
    const isVideo = media.type === 'video' || oldUrl === selectedExercise.videoUrl;

    const updated: MasterExercise = {
      ...selectedExercise,
      mediaAttachments: updatedAttachments,
      gifUrl: isMotion ? cleanUrl : selectedExercise.gifUrl,
      photoUrl: isPhoto ? cleanUrl : selectedExercise.photoUrl,
      muscleIllustrationUrl: isAnatomy ? cleanUrl : selectedExercise.muscleIllustrationUrl,
      anatomyUrl: isAnatomy ? cleanUrl : selectedExercise.anatomyUrl,
      adjustmentPhotoUrl: isSetup ? cleanUrl : selectedExercise.adjustmentPhotoUrl,
      videoUrl: isVideo ? cleanUrl : selectedExercise.videoUrl,
    };

    updateMasterExercise(updated);
    setSelectedExercise(updated);
    setEditingMediaTarget(null);
  };

  const handleStartCreateNew = () => {
    setFormName('');
    setFormMuscleGroup(selectedMuscle !== 'Todos' ? selectedMuscle : 'Peito');
    setFormEquipment('');
    setFormInstructions('');
    setFormExecutionTips('');
    setFormCommonMistakes('');
    setFormLoadUnit('kg');
    setFormDifficulty('Intermediário');
    setFormRestSeconds(60);
    setFormKneeWarning(false);
    setFormShoulderWarning(false);
    setIsCreatingExercise(true);
    setIsEditingFullExercise(false);
  };

  const handleStartEditFull = () => {
    if (!selectedExercise) return;
    setFormName(selectedExercise.name);
    setFormMuscleGroup(selectedExercise.muscleGroup);
    setFormEquipment(selectedExercise.equipment);
    setFormInstructions(selectedExercise.instructions || '');
    setFormExecutionTips(selectedExercise.executionTips ? selectedExercise.executionTips.join('\n') : '');
    setFormCommonMistakes(selectedExercise.commonMistakes ? selectedExercise.commonMistakes.join('\n') : '');
    setFormLoadUnit((selectedExercise.loadUnit as any) || 'kg');
    setFormDifficulty(selectedExercise.difficultyLevel || 'Intermediário');
    setFormRestSeconds(selectedExercise.defaultRestSeconds || 60);
    setFormKneeWarning(Boolean(selectedExercise.kneeWarning));
    setFormShoulderWarning(Boolean(selectedExercise.shoulderWarning));
    setIsEditingFullExercise(true);
    setIsCreatingExercise(false);
  };

  const handleSaveFullExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const tipsArray = formExecutionTips
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);
    const mistakesArray = formCommonMistakes
      .split('\n')
      .map((m) => m.trim())
      .filter(Boolean);

    if (isCreatingExercise) {
      const slug = formName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const newEx: MasterExercise = {
        id: `master-${slug}-${Date.now()}`,
        name: formName.trim(),
        muscleGroup: formMuscleGroup,
        difficultyLevel: formDifficulty,
        equipment: formEquipment.trim() || 'Livre / Máquina',
        primaryMuscles: [formMuscleGroup],
        secondaryMuscles: [],
        mediaAttachments: [],
        instructions: formInstructions.trim() || 'Executar com postura ereta e controle da cadência.',
        executionTips: tipsArray.length > 0 ? tipsArray : undefined,
        commonMistakes: mistakesArray.length > 0 ? mistakesArray : undefined,
        loadUnit: (formLoadUnit === 'minutos' || formLoadUnit === 'nivel' || formLoadUnit === 'placas') ? 'kg' : formLoadUnit,
        defaultRestSeconds: formRestSeconds,
        defaultSets: 3,
        defaultReps: 10,
        defaultWeightKg: 20,
        kneeWarning: formKneeWarning,
        shoulderWarning: formShoulderWarning,
      };

      addMasterExercise(newEx);
      setSelectedExercise(newEx);
      setIsCreatingExercise(false);
    } else if (isEditingFullExercise && selectedExercise) {
      const updated: MasterExercise = {
        ...selectedExercise,
        name: formName.trim(),
        muscleGroup: formMuscleGroup,
        difficultyLevel: formDifficulty,
        equipment: formEquipment.trim() || selectedExercise.equipment,
        instructions: formInstructions.trim() || selectedExercise.instructions,
        executionTips: tipsArray,
        commonMistakes: mistakesArray,
        loadUnit: (formLoadUnit === 'minutos' || formLoadUnit === 'nivel' || formLoadUnit === 'placas') ? 'kg' : formLoadUnit,
        defaultRestSeconds: formRestSeconds,
        kneeWarning: formKneeWarning,
        shoulderWarning: formShoulderWarning,
      };

      updateMasterExercise(updated);
      setSelectedExercise(updated);
      setIsEditingFullExercise(false);
    }
  };

  const handleDeleteExercise = () => {
    if (!selectedExercise) return;
    setExerciseToDelete(selectedExercise);
  };

  const handleAddDirectlyToWorkout = (workoutId: string) => {
    if (!selectedExercise) return;
    addExerciseToWorkout(workoutId, {
      name: selectedExercise.name,
      muscleGroup: selectedExercise.muscleGroup,
      equipment: selectedExercise.equipment,
      machine: selectedExercise.equipment,
      targetSets: selectedExercise.defaultSets || 3,
      targetReps: selectedExercise.defaultReps || 10,
      weightKg: selectedExercise.defaultWeightKg || 20,
      defaultRestSeconds: selectedExercise.defaultRestSeconds || 60,
      rpe: 8,
      notes: selectedExercise.instructions || '',
      photoUrl: selectedExercise.photoUrl || '',
      gifUrl: selectedExercise.gifUrl || '',
      kneeWarning: selectedExercise.kneeWarning,
      shoulderWarning: selectedExercise.shoulderWarning,
    });

    const workoutName = workouts.find((w) => w.id === workoutId)?.name || 'Treino';
    setAddedSuccessMessage(`Adicionado com sucesso ao ${workoutName}!`);
    setTimeout(() => {
      setAddedSuccessMessage(null);
      setShowAddToWorkoutDropdown(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-fadeIn">
      <div className="flex flex-col h-full max-h-[94vh] w-full max-w-6xl rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 px-4 sm:px-6 py-3.5 bg-slate-50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-500 text-black shadow-lg shadow-lime-500/20">
              <Dumbbell className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Banco Global de Exercícios
                </h2>
                <span className="bg-lime-500/20 text-lime-600 dark:text-lime-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-lime-500/30">
                  Principal
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {masterExercises.length} exercícios canônicos • Adicione fotos, GIFs de máquinas e notas técnicas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartCreateNew}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-black text-xs shadow-md shadow-lime-500/20 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>+ Novo Exercício</span>
            </button>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-all active:scale-90"
              title="Fechar (ESC)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Container (Two Columns on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Column: Search, Filters & Exercise List */}
          <div
            className={`lg:col-span-5 flex flex-col border-r border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 overflow-hidden ${
              selectedExercise || isCreatingExercise ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Search Input & Filter Tabs */}
            <div className="p-3 border-b border-slate-100 dark:border-white/10 space-y-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar no Banco Global (ex: Leg Press, Supino, Cadeira...)"
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-lime-500 focus:outline-hidden"
                />
              </div>

              {/* Status Filter (Todos / Faltando Imagem / Com Mídia) */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-white/5 rounded-xl text-[11px] font-bold">
                <button
                  onClick={() => setMediaFilter('todos')}
                  className={`flex-1 py-1 px-2 rounded-lg transition-all text-center ${
                    mediaFilter === 'todos'
                      ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Todos ({masterExercises.length})
                </button>
                <button
                  onClick={() => setMediaFilter('sem_midia')}
                  className={`flex-1 py-1 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                    mediaFilter === 'sem_midia'
                      ? 'bg-amber-500 text-black shadow-xs font-extrabold'
                      : 'text-amber-500 hover:text-amber-400'
                  }`}
                >
                  <AlertTriangle className="h-3 w-3" />
                  <span>Faltam ({totalWithoutMedia})</span>
                </button>
                <button
                  onClick={() => setMediaFilter('com_midia')}
                  className={`flex-1 py-1 px-2 rounded-lg transition-all text-center ${
                    mediaFilter === 'com_midia'
                      ? 'bg-lime-500 text-black shadow-xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Com Mídia ({totalWithMedia})
                </button>
              </div>

              {/* Muscle Filters */}
              <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none">
                {MUSCLE_GROUPS.map((mg) => (
                  <button
                    key={mg}
                    onClick={() => setSelectedMuscle(mg)}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                      selectedMuscle === mg
                        ? 'bg-lime-500 text-black shadow-md shadow-lime-500/20 font-black'
                        : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/5'
                    }`}
                  >
                    {mg}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredExercises.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-xs">Nenhum exercício encontrado com esses filtros.</p>
                  <button
                    onClick={handleStartCreateNew}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-lime-500 text-black font-bold text-xs inline-flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Criar Novo Exercício
                  </button>
                </div>
              ) : (
                filteredExercises.map((ex) => {
                  const isSelected = selectedExercise?.id === ex.id;
                  const mediaCount = ex.mediaAttachments?.length || 0;
                  return (
                    <div
                      key={ex.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpenDetail(ex)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenDetail(ex);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-2xl transition-all border flex items-center justify-between gap-2 cursor-pointer select-none ${
                        isSelected
                          ? 'bg-lime-500/15 border-lime-500/40 shadow-sm'
                          : 'bg-white dark:bg-white/5 border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-extrabold uppercase text-lime-600 dark:text-lime-400">
                            {ex.muscleGroup}
                          </span>
                          {mediaCount > 0 ? (
                            <span className="text-[10px] text-lime-600 dark:text-lime-400 font-bold bg-lime-500/10 px-1.5 py-0.2 rounded border border-lime-500/20">
                              {mediaCount} {mediaCount === 1 ? 'mídia' : 'mídias'}
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                              Falta imagem
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {ex.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {ex.equipment}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExerciseToDelete(ex);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title={`Excluir ${ex.name} do Banco Global`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Mobile Create Button */}
            <div className="p-2 border-t border-slate-100 dark:border-white/10 sm:hidden">
              <button
                onClick={handleStartCreateNew}
                className="w-full py-2.5 rounded-xl bg-lime-500 text-black font-black text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Criar Novo Exercício no Banco
              </button>
            </div>
          </div>

          {/* Right Column: Exercise Detail, Media Manager, or Create/Edit Form */}
          <div
            className={`lg:col-span-7 flex flex-col h-full overflow-y-auto p-4 sm:p-6 ${
              !selectedExercise && !isCreatingExercise
                ? 'hidden lg:flex items-center justify-center text-center'
                : 'flex'
            }`}
          >
            {/* VIEW 1: CREATE / EDIT FULL EXERCISE FORM */}
            {(isCreatingExercise || isEditingFullExercise) ? (
              <form onSubmit={handleSaveFullExercise} className="space-y-4 max-w-2xl mx-auto w-full animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-lime-500" />
                    {isCreatingExercise ? 'Criar Novo Exercício no Banco Global' : 'Editar Dados Técnicos do Exercício'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingExercise(false);
                      setIsEditingFullExercise(false);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Nome do Exercício *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ex: Cadeira Flexora Sentada"
                      className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/60 p-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Grupo Muscular *</label>
                    <select
                      value={formMuscleGroup}
                      onChange={(e) => setFormMuscleGroup(e.target.value as MuscleGroup)}
                      className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/60 p-2.5 text-xs text-slate-900 dark:text-white"
                    >
                      {MUSCLE_GROUPS.filter((m) => m !== 'Todos').map((mg) => (
                        <option key={mg} value={mg}>
                          {mg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Equipamento / Máquina</label>
                    <input
                      type="text"
                      value={formEquipment}
                      onChange={(e) => setFormEquipment(e.target.value)}
                      placeholder="Ex: Máquina Articulada / Halteres"
                      className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/60 p-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Nível de Dificuldade</label>
                    <select
                      value={formDifficulty}
                      onChange={(e) => setFormDifficulty(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/60 p-2.5 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="Iniciante">Iniciante</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Instruções de Execução Biomecânica</label>
                  <textarea
                    rows={2}
                    value={formInstructions}
                    onChange={(e) => setFormInstructions(e.target.value)}
                    placeholder="Descreva a postura inicial, alinhamento articular e respiração..."
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/60 p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Dicas de Execução (uma por linha)</label>
                  <textarea
                    rows={2}
                    value={formExecutionTips}
                    onChange={(e) => setFormExecutionTips(e.target.value)}
                    placeholder="Mantenha o peito aberto&#10;Controle a descida em 3 segundos"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/60 p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Erros Comuns (um por linha)</label>
                  <textarea
                    rows={2}
                    value={formCommonMistakes}
                    onChange={(e) => setFormCommonMistakes(e.target.value)}
                    placeholder="Projetar os joelhos para dentro&#10;Balançar o tronco para dar impulso"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/60 p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex gap-4 p-3 rounded-2xl bg-slate-100 dark:bg-white/5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formKneeWarning}
                      onChange={(e) => setFormKneeWarning(e.target.checked)}
                      className="rounded accent-lime-500 h-4 w-4"
                    />
                    <span>Alerta Articular de Joelho</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formShoulderWarning}
                      onChange={(e) => setFormShoulderWarning(e.target.checked)}
                      className="rounded accent-lime-500 h-4 w-4"
                    />
                    <span>Alerta Articular de Ombro</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-lime-500 hover:bg-lime-400 text-black font-black text-xs shadow-lg shadow-lime-500/25 transition active:scale-95"
                >
                  {isCreatingExercise ? 'Salvar Novo Exercício no Banco Global' : 'Salvar Alterações no Banco'}
                </button>
              </form>
            ) : selectedExercise ? (
              /* VIEW 2: EXERCISE DETAILS & MEDIA MANAGER */
              <div className="space-y-5 max-w-2xl mx-auto w-full animate-fadeIn">
                {/* Mobile Back Button & Action Controls */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => setSelectedExercise(null)}
                    className="lg:hidden inline-flex items-center gap-1 text-xs font-bold text-lime-600 dark:text-lime-400"
                  >
                    ← Voltar para a lista
                  </button>

                  <div className="flex items-center gap-2 ml-auto">
                    {/* Add to Workout Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowAddToWorkoutDropdown(!showAddToWorkoutDropdown)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-black text-xs shadow-md shadow-lime-500/20 active:scale-95 transition-all"
                      >
                        <FolderPlus className="h-3.5 w-3.5" />
                        <span>Usar no Treino</span>
                      </button>

                      {showAddToWorkoutDropdown && (
                        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#1C1C1F] border border-slate-200 dark:border-white/10 shadow-2xl p-2 z-50 space-y-1 animate-fadeIn">
                          <span className="text-[10px] font-black uppercase text-slate-400 px-2 py-1 block">
                            Adicionar a qual treino?
                          </span>
                          {workouts.map((w) => (
                            <button
                              key={w.id}
                              onClick={() => handleAddDirectlyToWorkout(w.id)}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-lime-500 hover:text-black transition-all flex items-center justify-between"
                            >
                              <span className="truncate">{w.name}</span>
                              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Edit Full Exercise */}
                    <button
                      onClick={handleStartEditFull}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition"
                      title="Editar todos os dados técnicos"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    {/* Delete Exercise */}
                    <button
                      onClick={handleDeleteExercise}
                      className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition"
                      title="Excluir do Banco Global"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {addedSuccessMessage && (
                  <div className="p-3 rounded-2xl bg-lime-500/20 border border-lime-500/40 text-lime-600 dark:text-lime-400 text-xs font-black flex items-center gap-2 animate-fadeIn">
                    <Check className="h-4 w-4" /> {addedSuccessMessage}
                  </div>
                )}

                {/* Title & Muscle Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-lime-500/20 text-lime-600 dark:text-lime-400 text-xs font-black uppercase">
                        {selectedExercise.muscleGroup}
                      </span>
                      {selectedExercise.difficultyLevel && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                          {selectedExercise.difficultyLevel}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {selectedExercise.id}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedExercise.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Equipamento: <strong>{selectedExercise.equipment}</strong>
                  </p>
                </div>

                {/* 1. CARROSSEL DE MÍDIAS DA MÁQUINA */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-lime-500" />
                      Anexos de Mídia & Visualização
                    </h4>
                    <button
                      onClick={() => setIsAddingMedia(!isAddingMedia)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-lime-500/20 hover:bg-lime-500/30 text-lime-600 dark:text-lime-400 text-xs font-bold transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Adicionar Foto/GIF
                    </button>
                  </div>

                  <MediaCarousel
                    attachments={selectedExercise.mediaAttachments}
                    gifUrl={selectedExercise.gifUrl}
                    photoUrl={selectedExercise.photoUrl}
                    muscleIllustrationUrl={selectedExercise.muscleIllustrationUrl || selectedExercise.anatomyUrl}
                    videoUrl={selectedExercise.videoUrl}
                    adjustmentPhotoUrl={selectedExercise.adjustmentPhotoUrl}
                    fallbackPhotoUrl={selectedExercise.photoUrl || selectedExercise.gifUrl}
                    exerciseName={selectedExercise.name}
                    onAddMediaClick={() => setIsAddingMedia(true)}
                    onDeleteMedia={handleDeleteMediaAttachment}
                    onReplaceMedia={handleReplaceMediaAttachment}
                  />

                  {/* Add Media Form */}
                  {isAddingMedia && (
                    <form
                      onSubmit={handleAddMediaSubmit}
                      className="mt-3 p-3.5 rounded-2xl border border-lime-500/30 bg-lime-500/5 space-y-2.5 animate-fadeIn"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-lime-600 dark:text-lime-400 flex items-center gap-1.5">
                          <Plus className="h-3.5 w-3.5" />
                          Vincular Nova Imagem ou GIF por Link
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAddingMedia(false)}
                          className="text-xs text-slate-400 hover:text-slate-200"
                        >
                          Cancelar
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Tipo de Mídia</label>
                          <select
                            value={newMediaType}
                            onChange={(e) => setNewMediaType(e.target.value as any)}
                            className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black p-2 text-xs text-slate-900 dark:text-white font-medium"
                          >
                            <option value="motion">Movimento / GIF de Execução (Padrão)</option>
                            <option value="machine">Foto da Máquina / Equipamento</option>
                            <option value="anatomy">Anatomia Muscular</option>
                            <option value="setup">Anotações Visuais / Apoio</option>
                            <option value="video">Vídeo Tutorial (YouTube / MP4)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Título / Legenda</label>
                          <input
                            type="text"
                            value={newMediaTitle}
                            onChange={(e) => setNewMediaTitle(e.target.value)}
                            placeholder="Ex: Execução padrão no Leg Press"
                            className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black p-2 text-xs text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">URL da Imagem / GIF / Vídeo</label>
                        <input
                          type="url"
                          required
                          value={newMediaUrl}
                          onChange={(e) => setNewMediaUrl(e.target.value)}
                          placeholder="https://exemplo.com/imagem.gif ou .jpg"
                          className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black p-2 text-xs text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      {newMediaUrl.trim() && (
                        <div className="h-28 rounded-xl bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                          <img
                            src={newMediaUrl.trim()}
                            alt="Preview"
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).alt = 'Link inválido ou não carregável';
                            }}
                          />
                        </div>
                      )}
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-xs font-black shadow-md shadow-lime-500/20 active:scale-95 transition"
                      >
                        Salvar e Anexar ao Exercício
                      </button>
                    </form>
                  )}

                  {/* GERENCIADOR DE TODAS AS MÍDIAS DO EXERCÍCIO (SUBSTITUIR OU EXCLUIR) */}
                  <div className="mt-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#18181B] p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <ImageIcon className="h-3.5 w-3.5 text-lime-500" />
                        Imagens Cadastradas ({selectedExercise.mediaAttachments?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAddingMedia(true)}
                        className="text-[11px] font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> + Nova Imagem
                      </button>
                    </div>

                    {/* Media Items List */}
                    {(() => {
                      const allItems: MediaAttachment[] = [];
                      const seen = new Set<string>();

                      const pushIfNew = (
                        type: MediaAttachment['type'],
                        url?: string,
                        title?: string,
                        id?: string
                      ) => {
                        if (!url || !url.trim() || seen.has(url.trim())) return;
                        seen.add(url.trim());
                        allItems.push({
                          id: id || `media-item-${allItems.length}`,
                          type,
                          url: url.trim(),
                          title: title || (type === 'motion' ? 'GIF de Movimento' : 'Foto do Exercício'),
                          order: allItems.length + 1,
                        });
                      };

                      if (selectedExercise.gifUrl) {
                        pushIfNew('motion', selectedExercise.gifUrl, 'Movimento (GIF Principal)');
                      }
                      if (selectedExercise.photoUrl) {
                        pushIfNew('machine', selectedExercise.photoUrl, 'Foto da Máquina / Equipamento');
                      }
                      if (selectedExercise.muscleIllustrationUrl || selectedExercise.anatomyUrl) {
                        pushIfNew('anatomy', selectedExercise.muscleIllustrationUrl || selectedExercise.anatomyUrl, 'Anatomia Muscular');
                      }
                      if (selectedExercise.adjustmentPhotoUrl) {
                        pushIfNew('setup', selectedExercise.adjustmentPhotoUrl, 'Foto de Apoio / Regulagem');
                      }
                      if (selectedExercise.videoUrl) {
                        pushIfNew('video', selectedExercise.videoUrl, 'Vídeo Tutorial');
                      }
                      (selectedExercise.mediaAttachments || []).forEach((att) => {
                        if (att && att.url) {
                          pushIfNew(att.type || 'machine', att.url, att.title, att.id);
                        }
                      });

                      if (allItems.length === 0) {
                        return (
                          <div className="py-4 text-center rounded-xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 text-xs text-slate-400 space-y-2">
                            <p>Nenhuma imagem ou GIF cadastrado para este exercício.</p>
                            <button
                              type="button"
                              onClick={() => setIsAddingMedia(true)}
                              className="px-3 py-1.5 rounded-xl bg-lime-500 text-black text-xs font-black inline-flex items-center gap-1"
                            >
                              <Plus className="h-3.5 w-3.5" /> Adicionar Imagem por Link
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-2">
                          {allItems.map((item, idx) => (
                            <div
                              key={item.id || idx}
                              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-lime-500/30 transition-all"
                            >
                              {/* Preview thumbnail */}
                              <div className="h-12 w-14 rounded-lg bg-black flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                {item.type === 'video' ? (
                                  <Video className="h-5 w-5 text-rose-400" />
                                ) : (
                                  <img
                                    src={item.url}
                                    alt={item.title || 'Mídia'}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23666" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                                    }}
                                  />
                                )}
                              </div>

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                                    item.type === 'motion'
                                      ? 'bg-lime-500/20 text-lime-600 dark:text-lime-400'
                                      : item.type === 'anatomy'
                                      ? 'bg-purple-500/20 text-purple-400'
                                      : item.type === 'video'
                                      ? 'bg-rose-500/20 text-rose-400'
                                      : 'bg-sky-500/20 text-sky-400'
                                  }`}>
                                    {item.type === 'motion' ? 'GIF Movimento' : item.type === 'anatomy' ? 'Anatomia' : item.type === 'video' ? 'Vídeo' : 'Foto Máquina'}
                                  </span>
                                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                    {item.title || 'Mídia'}
                                  </h5>
                                </div>
                                <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5" title={item.url}>
                                  {item.url}
                                </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMediaTarget(item);
                                    setEditingMediaNewUrl(item.url);
                                    setEditingMediaNewTitle(item.title || '');
                                  }}
                                  className="px-2 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-500 dark:text-sky-400 text-[11px] font-bold border border-sky-500/30 flex items-center gap-1 transition"
                                  title="Substituir Link desta Imagem"
                                >
                                  <Link2 className="h-3 w-3" />
                                  <span className="hidden sm:inline">Substituir</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteMediaAttachment(item, idx)}
                                  className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-500 text-[11px] font-bold border border-rose-500/30 transition"
                                  title="Excluir esta imagem"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Inline Replace Modal from Media Manager */}
                  {editingMediaTarget && (
                    <div
                      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
                      onClick={() => setEditingMediaTarget(null)}
                    >
                      <div
                        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#18181B] border border-slate-200 dark:border-white/10 p-5 shadow-2xl space-y-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl bg-sky-500/20 text-sky-500 flex items-center justify-center">
                              <Link2 className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                Substituir Link da Imagem
                              </h4>
                              <p className="text-[11px] text-slate-400">{selectedExercise.name}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingMediaTarget(null)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (editingMediaTarget && editingMediaNewUrl.trim()) {
                              handleReplaceMediaAttachment(
                                editingMediaTarget,
                                editingMediaNewUrl.trim(),
                                editingMediaNewTitle.trim() || undefined
                              );
                            }
                          }}
                          className="space-y-3"
                        >
                          <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              Nova URL da Imagem / GIF / Vídeo
                            </label>
                            <input
                              type="url"
                              required
                              placeholder="https://exemplo.com/imagem.gif ou .jpg"
                              value={editingMediaNewUrl}
                              onChange={(e) => setEditingMediaNewUrl(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/50 p-2.5 text-xs text-slate-900 dark:text-white font-mono"
                              autoFocus
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              Título / Legenda (Opcional)
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Execução padrão da academia"
                              value={editingMediaNewTitle}
                              onChange={(e) => setEditingMediaNewTitle(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/50 p-2.5 text-xs text-slate-900 dark:text-white"
                            />
                          </div>

                          {editingMediaNewUrl.trim() && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Preview</span>
                              <div className="h-32 rounded-xl bg-black flex items-center justify-center overflow-hidden border border-white/10">
                                <img
                                  src={editingMediaNewUrl.trim()}
                                  alt="Preview"
                                  className="h-full w-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).alt = 'Link inválido ou não carregável';
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setEditingMediaTarget(null)}
                              className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-white/20 transition"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-xs font-black transition shadow-lg shadow-lime-500/20"
                            >
                              Salvar Substituição
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. ANOTAÇÕES & DICAS DE SEGURANÇA */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#18181B] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sliders className="h-4 w-4 text-lime-500" />
                      Anotações & Dicas de Segurança
                    </h4>
                    <button
                      onClick={() => setIsEditingNotes(!isEditingNotes)}
                      className="text-xs font-bold text-lime-600 dark:text-lime-400 flex items-center gap-1"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      {isEditingNotes ? 'Fechar Edição' : 'Editar Anotações'}
                    </button>
                  </div>

                  {isEditingNotes ? (
                    <div className="space-y-2.5 animate-fadeIn">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400">Anotações do Exercício</label>
                        <textarea
                          rows={2}
                          value={setupNotes}
                          onChange={(e) => setSetupNotes(e.target.value)}
                          placeholder="Instruções de execução, postura e pegada..."
                          className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black p-2 text-xs text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400">Dicas de Segurança & Execução</label>
                        <textarea
                          rows={2}
                          value={setupPins}
                          onChange={(e) => setSetupPins(e.target.value)}
                          placeholder="Dicas de segurança, cuidados articulares..."
                          className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black p-2 text-xs text-slate-900 dark:text-white"
                        />
                      </div>

                      <button
                        onClick={handleSaveNotes}
                        className="w-full py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-xs font-black shadow-md shadow-lime-500/20"
                      >
                        Salvar Anotações & Dicas
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 space-y-1">
                        <span className="block text-[10px] text-slate-400 font-bold">Anotações</span>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                          {selectedExercise.machineSetup?.notes || selectedExercise.instructions || 'Nenhuma anotação cadastrada.'}
                        </p>
                      </div>
                      {(selectedExercise.machineSetup?.pins || selectedExercise.safetyNotes || selectedExercise.executionTips) && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
                          <span className="block text-[10px] text-amber-400 font-bold flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Dica de Segurança
                          </span>
                          <p className="text-[11px] text-amber-100 leading-relaxed">
                            {selectedExercise.machineSetup?.pins || selectedExercise.safetyNotes || (selectedExercise.executionTips ? selectedExercise.executionTips.join('. ') : '')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. INSTRUÇÕES TÉCNICAS BIOMECÂNICAS */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#18181B] p-4 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-amber-500" />
                    Instruções Técnicas & Biomecânica
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedExercise.instructions}
                  </p>
                  {selectedExercise.executionTips && selectedExercise.executionTips.length > 0 && (
                    <ul className="space-y-1 pt-1 text-xs text-slate-600 dark:text-slate-400">
                      {(selectedExercise.executionTips || []).map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-lime-500 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <Dumbbell className="h-12 w-12 mx-auto text-slate-500 mb-2" />
                <p className="text-sm font-bold text-slate-300">Selecione um exercício na lista</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Visualize fotos da máquina, GIFs de movimento, notas biomecânicas ou clique em "+ Novo Exercício" para cadastrar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE EXERCÍCIO */}
      {exerciseToDelete && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setExerciseToDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-[#18181B] border border-slate-200 dark:border-white/10 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/30">
                <Trash2 className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Excluir Exercício do Banco?
                </h3>
                <p className="text-xs text-rose-500 font-bold">
                  Remoção do Banco Global de Exercícios
                </p>
              </div>
            </div>

            {/* Exercise Info Summary Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-lime-500/20 text-lime-600 dark:text-lime-400 uppercase">
                  {exerciseToDelete.muscleGroup}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  {exerciseToDelete.equipment}
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {exerciseToDelete.name}
              </h4>
              {exerciseToDelete.instructions && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {exerciseToDelete.instructions}
                </p>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Tem certeza que deseja excluir <strong>"{exerciseToDelete.name}"</strong>? O exercício e suas mídias vinculadas serão removidos da biblioteca.
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setExerciseToDelete(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetId = exerciseToDelete.id;
                  const targetName = exerciseToDelete.name;
                  deleteMasterExercise(targetId);
                  if (selectedExercise?.id === targetId) {
                    setSelectedExercise(null);
                  }
                  setExerciseToDelete(null);
                  setAddedSuccessMessage(`Exercício "${targetName}" excluído com sucesso do Banco Global.`);
                  setTimeout(() => setAddedSuccessMessage(null), 3000);
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Trash2 className="h-4 w-4" />
                <span>Sim, Excluir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
