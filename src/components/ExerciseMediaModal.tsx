/**
 * Gym Companion — Exercise Media & Machine Setup Customization Modal
 * Simplified, fast, and 100% reliable direct media editor.
 * Supports:
 * 1. Opções & Cargas Básicas
 * 2. Movimento (GIF / Vídeo de Execução)
 * 3. Regulagem da Máquina e Pinos
 * 4. Foto da Máquina / Equipamento
 * 5. Anatomia Muscular / Ilustração
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Check,
  Image as ImageIcon,
  Settings2,
  Sliders,
  Play,
  Camera,
  Activity,
  Dumbbell,
  RefreshCw,
  ExternalLink,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Exercise } from '../types';
import { useGym } from '../context/GymContext';

interface ExerciseMediaModalProps {
  isOpen: boolean;
  exercise: Exercise | null;
  onClose: () => void;
  onSave?: (updatedEx: Exercise) => void;
}

export const ExerciseMediaModal: React.FC<ExerciseMediaModalProps> = ({
  isOpen,
  exercise,
  onClose,
  onSave,
}) => {
  const { updateExerciseMedia } = useGym();

  const [activeTab, setActiveTab] = useState<
    'opcoes' | 'movimento' | 'regulagem' | 'maquina' | 'anatomia'
  >('opcoes');

  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  const [formData, setFormData] = useState({
    name: exercise?.name || '',
    muscleGroup: exercise?.muscleGroup || 'Peito',
    equipment: exercise?.equipment || 'Halteres',
    machine: exercise?.machine || '',
    weightKg: exercise?.weightKg ?? 20,
    sets: exercise?.sets ?? 4,
    reps: exercise?.reps ?? 12,
    targetReps: exercise?.targetReps || `${exercise?.reps || 12}`,
    rpe: exercise?.rpe ?? 8,
    defaultRestSeconds: exercise?.defaultRestSeconds ?? 90,
    isTimedCardio: exercise?.isTimedCardio ?? false,
    targetDurationSeconds: exercise?.targetDurationSeconds ?? 600,
    adjustment: exercise?.adjustment || '',
    bench: exercise?.bench || '',
    notes: exercise?.notes || '',
    photoUrl: exercise?.photoUrl || '',
    gifUrl: exercise?.gifUrl || '',
    videoUrl: exercise?.videoUrl || '',
    muscleIllustrationUrl: exercise?.muscleIllustrationUrl || exercise?.anatomyUrl || '',
    adjustmentPhotoUrl: exercise?.adjustmentPhotoUrl || '',
    adjustmentPhotoUrl2: exercise?.adjustmentPhotoUrl2 || '',
  });

  // Sync state whenever selected exercise changes
  useEffect(() => {
    if (exercise) {
      setFormData({
        name: exercise.name || '',
        muscleGroup: exercise.muscleGroup || 'Peito',
        equipment: exercise.equipment || 'Halteres',
        machine: exercise.machine || '',
        weightKg: exercise.weightKg ?? 20,
        sets: exercise.sets ?? 4,
        reps: exercise.reps ?? 12,
        targetReps: exercise.targetReps || `${exercise.reps || 12}`,
        rpe: exercise.rpe ?? 8,
        defaultRestSeconds: exercise.defaultRestSeconds ?? 90,
        isTimedCardio: exercise.isTimedCardio ?? false,
        targetDurationSeconds: exercise.targetDurationSeconds ?? 600,
        adjustment: exercise.adjustment || '',
        bench: exercise.bench || '',
        notes: exercise.notes || exercise.instructions || '',
        safetyNotes: exercise.safetyNotes || exercise.executionTips || '',
        executionTips: exercise.executionTips || '',
        photoUrl: exercise.photoUrl || '',
        gifUrl: exercise.gifUrl || '',
        videoUrl: exercise.videoUrl || '',
        muscleIllustrationUrl: exercise.muscleIllustrationUrl || exercise.anatomyUrl || '',
        adjustmentPhotoUrl: exercise.adjustmentPhotoUrl || '',
        adjustmentPhotoUrl2: exercise.adjustmentPhotoUrl2 || '',
      });
    }
  }, [exercise?.id, exercise?.name]);

  if (!isOpen || !exercise) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const resultStr = reader.result as string;
          if (file.type.startsWith('image/') && !file.type.includes('gif')) {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              const maxDim = 900;
              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
                setFormData((prev) => ({ ...prev, [field]: compressedDataUrl }));
                return;
              }
              setFormData((prev) => ({ ...prev, [field]: resultStr }));
            };
            img.onerror = () => {
              setFormData((prev) => ({ ...prev, [field]: resultStr }));
            };
            img.src = resultStr;
          } else {
            setFormData((prev) => ({ ...prev, [field]: resultStr }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!exercise) return;

    const updatedData: Partial<Exercise> = {
      ...formData,
      adjustment: formData.adjustment || formData.bench,
    };

    const fullUpdatedExercise: Exercise = {
      ...exercise,
      ...updatedData,
    };

    // Update global state, localStorage, profiles, and active workout
    updateExerciseMedia(exercise.id, updatedData);

    // Also call parent callback if provided
    if (onSave) {
      onSave(fullUpdatedExercise);
    }

    setSaveSuccessToast(true);
    setTimeout(() => {
      setSaveSuccessToast(false);
      onClose();
    }, 600);
  };

  const handleUndo = () => {
    if (!exercise) return;
    setFormData({
      name: exercise.name || '',
      muscleGroup: exercise.muscleGroup || 'Peito',
      equipment: exercise.equipment || 'Halteres',
      machine: exercise.machine || '',
      weightKg: exercise.weightKg ?? 20,
      sets: exercise.sets ?? 4,
      reps: exercise.reps ?? 12,
      targetReps: exercise.targetReps || `${exercise.reps || 12}`,
      rpe: exercise.rpe ?? 8,
      defaultRestSeconds: exercise.defaultRestSeconds ?? 90,
      isTimedCardio: exercise.isTimedCardio ?? false,
      targetDurationSeconds: exercise.targetDurationSeconds ?? 600,
      adjustment: exercise.adjustment || '',
      bench: exercise.bench || '',
      notes: exercise.notes || '',
      photoUrl: exercise.photoUrl || '',
      gifUrl: exercise.gifUrl || '',
      videoUrl: exercise.videoUrl || '',
      muscleIllustrationUrl: exercise.muscleIllustrationUrl || exercise.anatomyUrl || '',
      adjustmentPhotoUrl: exercise.adjustmentPhotoUrl || '',
      adjustmentPhotoUrl2: exercise.adjustmentPhotoUrl2 || '',
    });
  };

  const handleClear = () => {
    setFormData((prev) => ({
      ...prev,
      photoUrl: '',
      gifUrl: '',
      videoUrl: '',
      muscleIllustrationUrl: '',
      adjustmentPhotoUrl: '',
      adjustmentPhotoUrl2: '',
      notes: '',
      bench: '',
      adjustment: '',
      machine: '',
    }));
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fadeIn">
      <div className="relative flex flex-col max-h-[92vh] max-w-2xl w-full rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 p-4 sm:p-5 bg-slate-50 dark:bg-[#0A0A0B]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-500/20 text-lime-600 dark:text-lime-400 border border-lime-500/30">
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Editar Exercício — Opções, Mídia & Regulagem
              </h3>
              <span className="text-xs text-lime-600 dark:text-lime-400 font-bold">{formData.name || exercise.name}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-200 dark:bg-white/5 p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 5 Clean Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-100 dark:border-white/10 bg-slate-100/50 dark:bg-black/40 p-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('opcoes')}
            className={`flex items-center gap-1.5 py-2 px-3 text-xs font-black rounded-xl transition-all shrink-0 ${
              activeTab === 'opcoes'
                ? 'bg-lime-500 text-black shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span>1. Opções & Cargas</span>
          </button>

          <button
            onClick={() => setActiveTab('movimento')}
            className={`flex items-center gap-1.5 py-2 px-3 text-xs font-black rounded-xl transition-all shrink-0 ${
              activeTab === 'movimento'
                ? 'bg-lime-500 text-black shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            <span>2. Movimento (GIF)</span>
          </button>

          <button
            onClick={() => setActiveTab('regulagem')}
            className={`flex items-center gap-1.5 py-2 px-3 text-xs font-black rounded-xl transition-all shrink-0 ${
              activeTab === 'regulagem'
                ? 'bg-lime-500 text-black shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>3. Anotações & Dicas</span>
          </button>

          <button
            onClick={() => setActiveTab('maquina')}
            className={`flex items-center gap-1.5 py-2 px-3 text-xs font-black rounded-xl transition-all shrink-0 ${
              activeTab === 'maquina'
                ? 'bg-lime-500 text-black shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>4. Foto da Máquina</span>
          </button>

          <button
            onClick={() => setActiveTab('anatomia')}
            className={`flex items-center gap-1.5 py-2 px-3 text-xs font-black rounded-xl transition-all shrink-0 ${
              activeTab === 'anatomia'
                ? 'bg-lime-500 text-black shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>5. Anatomia Muscular</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* TAB 1: OPÇÕES & CARGAS */}
          {activeTab === 'opcoes' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                  <Dumbbell className="h-4 w-4 text-lime-500" /> Configurações Básicas & Métricas de Treino
                </span>
                <p>Edite o nome do exercício, grupo muscular, séries, repetições, carga e tempo de descanso.</p>
              </div>

              {/* Name & Muscle Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nome do Exercício</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Grupo Muscular</label>
                  <select
                    value={formData.muscleGroup || 'Peito'}
                    onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value as any })}
                    className="w-full rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {[
                      'Peito',
                      'Costas',
                      'Ombros',
                      'Bíceps',
                      'Tríceps',
                      'Quadríceps',
                      'Posterior de Coxa',
                      'Posterior',
                      'Glúteos',
                      'Panturrilha',
                      'Panturrilhas',
                      'Abdômen',
                      'Trapézio',
                      'Antebraço',
                      'Cardio',
                      'Mobilidade',
                      'Aquecimento',
                      'Opcionais',
                    ].map((mg) => (
                      <option key={mg} value={mg} className="bg-slate-900 text-white">
                        {mg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Equipment & Machine */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Equipamento</label>
                  <input
                    type="text"
                    placeholder="Ex: Halteres, Polia, Barra, Máquina"
                    value={formData.equipment || ''}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                    className="w-full rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nome/Número da Máquina</label>
                  <input
                    type="text"
                    placeholder="Ex: Cadeira Extensora #04"
                    value={formData.machine || ''}
                    onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                    className="w-full rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Numeric Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Séries (Sets)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.sets ?? 4}
                    onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs font-extrabold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Repetições Alvo</label>
                  <input
                    type="text"
                    placeholder="Ex: 10-12"
                    value={formData.targetReps || ''}
                    onChange={(e) => setFormData({ ...formData, targetReps: e.target.value })}
                    className="w-full rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs font-extrabold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Carga Atual (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    value={formData.weightKg ?? 0}
                    onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs font-extrabold text-lime-600 dark:text-lime-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nível de Esforço RPE (1-10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.rpe ?? 8}
                    onChange={(e) => setFormData({ ...formData, rpe: parseInt(e.target.value) || 8 })}
                    className="w-full rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs font-extrabold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tempo Descanso (seg)</label>
                  <input
                    type="number"
                    step="5"
                    min={10}
                    value={formData.defaultRestSeconds ?? 60}
                    onChange={(e) => setFormData({ ...formData, defaultRestSeconds: parseInt(e.target.value) || 60 })}
                    className="w-full rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs font-extrabold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Modo Cardio Tempo</label>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, isTimedCardio: !prev.isTimedCardio }))}
                    className={`w-full py-3 px-3 rounded-xl text-xs font-black border transition ${
                      formData.isTimedCardio
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {formData.isTimedCardio ? '⏱️ Cardio Ativo' : '⚪ Repetições'}
                  </button>
                </div>
              </div>

              {formData.isTimedCardio && (
                <div className="space-y-1.5 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  <label className="text-xs font-bold text-cyan-300">Duração do Cardio (Segundos)</label>
                  <input
                    type="number"
                    step={30}
                    value={formData.targetDurationSeconds ?? 300}
                    onChange={(e) => setFormData({ ...formData, targetDurationSeconds: parseInt(e.target.value) || 300 })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 p-3 text-xs font-bold text-white"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MOVIMENTO (GIF / VÍDEO EXECUÇÃO) */}
          {activeTab === 'movimento' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">🎬 Mídia de Movimento e Execução (GIF / Vídeo)</span>
                <p>Cole a URL do GIF do movimento (ex: GIPHY ou ExerciseDB) ou faça upload da animação do exercício.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">URL do GIF / Animação do Movimento</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Cole aqui a URL (ex: https://media0.giphy.com/media/.../giphy.gif)"
                    value={formData.gifUrl || ''}
                    onChange={(e) => setFormData({ ...formData, gifUrl: e.target.value })}
                    className="flex-1 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-white font-mono"
                  />
                  {formData.gifUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gifUrl: '' })}
                      className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                      title="Remover URL"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <label className="flex items-center gap-1 rounded-xl bg-slate-200 dark:bg-white/10 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer shrink-0">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/gif,image/webp,image/*"
                      onChange={(e) => handleFileUpload(e, 'gifUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">URL do Vídeo Externo Complementar (YouTube / MP4)</label>
                <input
                  type="url"
                  placeholder="Ex: https://youtube.com/watch?v=..."
                  value={formData.videoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* Instant Real-Time Preview */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Preview do Movimento</span>
                {formData.gifUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 max-h-64 flex justify-center bg-black/90 p-2">
                    <img
                      src={formData.gifUrl}
                      alt="Preview Movimento"
                      className="h-56 object-contain rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).alt = 'Erro ao carregar URL da imagem/GIF';
                      }}
                    />
                    <a
                      href={formData.gifUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 text-white hover:bg-black transition-colors"
                      title="Abrir URL em nova aba"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-black/20">
                    Nenhuma URL de movimento inserida. Cole um link GIF acima para visualizar.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ANOTAÇÕES & DICAS DE SEGURANÇA */}
          {activeTab === 'regulagem' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">📋 Anotações & Dicas de Segurança</span>
                <p>Personalize suas anotações técnicas de execução e alertas de segurança para treinar com máxima eficiência e prevenção de lesões.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Anotações do Exercício (Postura, Pegada, Execução)</label>
                <textarea
                  rows={3}
                  placeholder="Ex: Escápulas travadas no banco, pegada pronada na largura dos ombros, descer controlando até a altura do peito."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Dicas de Segurança & Prevenção
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Não hiperestender a lombar; travar a barra com firmeza; manter os pés firmes no chão."
                  value={formData.safetyNotes || ''}
                  onChange={(e) => setFormData({ ...formData, safetyNotes: e.target.value })}
                  className="w-full rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-slate-900 dark:text-amber-100 font-medium"
                />
              </div>

              {/* Foto de Apoio / Referência Visual */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">📸 Foto de Apoio / Referência Visual (Opcional)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Cole aqui a URL da foto de apoio..."
                    value={formData.adjustmentPhotoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, adjustmentPhotoUrl: e.target.value })}
                    className="flex-1 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-white font-mono"
                  />
                  {formData.adjustmentPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, adjustmentPhotoUrl: '' })}
                      className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                      title="Remover URL"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <label className="flex items-center gap-1 rounded-xl bg-slate-200 dark:bg-white/10 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer shrink-0">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'adjustmentPhotoUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.adjustmentPhotoUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 max-h-48 flex justify-center bg-black/90 p-2">
                    <img
                      src={formData.adjustmentPhotoUrl}
                      alt="Preview Foto de Apoio"
                      className="h-40 object-contain rounded-xl"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: FOTO DA MÁQUINA */}
          {activeTab === 'maquina' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">📷 Foto da Máquina / Equipamento</span>
                <p>Cole a URL de uma foto ou envie uma foto da máquina da sua academia.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">URL da Foto da Máquina</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://exemplo.com/foto-maquina.jpg"
                    value={formData.photoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="flex-1 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-white font-mono"
                  />
                  {formData.photoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, photoUrl: '' })}
                      className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                      title="Remover URL"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <label className="flex items-center gap-1 rounded-xl bg-slate-200 dark:bg-white/10 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer shrink-0">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'photoUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Instant Real-Time Preview */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Preview da Máquina</span>
                {formData.photoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 max-h-64 flex justify-center bg-black/90 p-2">
                    <img
                      src={formData.photoUrl}
                      alt="Preview Máquina"
                      className="h-56 object-contain rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).alt = 'Erro ao carregar URL da foto da máquina';
                      }}
                    />
                    <a
                      href={formData.photoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 text-white hover:bg-black transition-colors"
                      title="Abrir URL em nova aba"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-black/20">
                    Nenhuma URL de foto inserida. Cole o link da foto da máquina acima para visualizar.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ANATOMIA MUSCULAR */}
          {activeTab === 'anatomia' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">🧠 Ilustração Anatômica Muscular</span>
                <p>Cole a URL do diagrama anatômico que destaca os músculos recrutados (ex: ExerciseDB / Wix).</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">URL do Mapa Muscular / Anatomia</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Cole aqui a URL (ex: https://static.exercisedb.dev/media/...)"
                    value={formData.muscleIllustrationUrl || ''}
                    onChange={(e) => setFormData({ ...formData, muscleIllustrationUrl: e.target.value })}
                    className="flex-1 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-white font-mono"
                  />
                  {formData.muscleIllustrationUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, muscleIllustrationUrl: '' })}
                      className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                      title="Remover URL"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <label className="flex items-center gap-1 rounded-xl bg-slate-200 dark:bg-white/10 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer shrink-0">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'muscleIllustrationUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Instant Real-Time Preview */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Preview da Anatomia</span>
                {formData.muscleIllustrationUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 max-h-64 flex justify-center bg-black/90 p-2">
                    <img
                      src={formData.muscleIllustrationUrl}
                      alt="Preview Anatomia"
                      className="h-56 object-contain rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).alt = 'Erro ao carregar URL de anatomia';
                      }}
                    />
                    <a
                      href={formData.muscleIllustrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 text-white hover:bg-black transition-colors"
                      title="Abrir URL em nova aba"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-black/20">
                    Nenhuma URL de anatomia inserida. Cole a URL da ilustração anatômica acima.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-white/10 p-4 bg-slate-50 dark:bg-[#0A0A0B]">
          {saveSuccessToast ? (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 px-4 py-2 text-xs font-black text-emerald-400 animate-bounce">
              <Check className="h-4 w-4 stroke-[3]" />
              <span>✓ Alterações e URLs salvas com sucesso no app e presets!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUndo}
                className="flex items-center gap-1 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 px-3 py-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 transition-colors"
                title="Desfazer e restaurar valores originais do exercício"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Desfazer</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-3 py-2 text-xs font-extrabold transition-colors"
                title="Limpar campos de mídia e observações"
              >
                <X className="h-3.5 w-3.5" />
                <span>Limpar</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 shrink-0">
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-200 dark:bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl bg-lime-500 hover:bg-lime-400 px-5 py-2.5 text-xs font-black text-black shadow-lg shadow-lime-500/20 active:scale-95 transition-transform"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
