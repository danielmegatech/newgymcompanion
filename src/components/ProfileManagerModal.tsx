/**
 * Gym Companion v2.0 — Sistema Completo de Personalização de Perfil
 * Gerenciamento de Perfis, Dados Pessoais, Corporais, Nutricionais, Backup & Demo
 */

import React, { useState, useEffect } from 'react';
import { compressImageFile } from '../utils/imageUtils';
import {
  X,
  User,
  UserCheck,
  UserPlus,
  Copy,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Scale,
  Utensils,
  Dumbbell,
  FileText,
  Check,
  AlertTriangle,
  Sparkles,
  Camera,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Activity,
  Heart,
  ShieldCheck,
  Flame,
  Award,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react';
import {
  TrendingUp,
  Plus,
  BarChart2,
  LineChart as LineChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useGym } from '../context/GymContext';
import {
  UserProfile,
  UserBodyConfig,
  UserPersonalData,
  UserNutritionConfig,
  UserWorkoutPreferences,
  ProfileBackupRecord,
  BodyMeasurementRecord,
} from '../types';
import {
  calculateAge,
  calculateBMI,
  calculateTMB,
  calculateTDEE,
  calculateMacros,
} from '../utils/nutritionAndBody';

const defaultSampleMeasurements: BodyMeasurementRecord[] = [
  { id: 'm-1', date: '2026-04-10', weightKg: 81.5, bodyFatPercent: 18.2, muscleMassPercent: 39.5, chestCm: 98, waistCm: 84, armCm: 36.5, thighCm: 56.5, calfCm: 37.0 },
  { id: 'm-2', date: '2026-05-12', weightKg: 80.2, bodyFatPercent: 17.0, muscleMassPercent: 40.2, chestCm: 99, waistCm: 82.5, armCm: 37.0, thighCm: 57.0, calfCm: 37.5 },
  { id: 'm-3', date: '2026-06-14', weightKg: 79.1, bodyFatPercent: 16.1, muscleMassPercent: 41.0, chestCm: 99.5, waistCm: 81.2, armCm: 37.5, thighCm: 57.5, calfCm: 38.0 },
  { id: 'm-4', date: '2026-07-10', weightKg: 78.4, bodyFatPercent: 15.3, muscleMassPercent: 41.8, chestCm: 100, waistCm: 80.5, armCm: 37.8, thighCm: 58.0, calfCm: 38.0 },
  { id: 'm-5', date: '2026-08-05', weightKg: 78.0, bodyFatPercent: 15.0, muscleMassPercent: 42.0, chestCm: 100.5, waistCm: 80.0, armCm: 38.0, thighCm: 58.2, calfCm: 38.0 },
];

interface ProfileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileManagerModal: React.FC<ProfileManagerModalProps> = ({ isOpen, onClose }) => {
  const {
    profiles,
    activeProfileId,
    activeProfile,
    switchProfile,
    createProfile,
    updateProfile,
    duplicateProfile,
    deleteProfile,
    resetAllProfilesToDemo,
    exportProfileBackup,
    importProfileBackup,
    theme,
    setTheme,
  } = useGym();

  const [selectedProfileId, setSelectedProfileId] = useState<string>(activeProfileId);
  const [activeTab, setActiveTab] = useState<'gerenciar' | 'pessoais' | 'corporais' | 'nutricao' | 'tema' | 'treino' | 'backup'>('gerenciar');

  // Deletion and reset confirmation modal states
  const [profileToDelete, setProfileToDelete] = useState<UserProfile | null>(null);
  const [showResetAllConfirm, setShowResetAllConfirm] = useState<boolean>(false);

  // Form states for the selected profile
  const targetProfile = profiles.find((p) => p.id === selectedProfileId) || activeProfile;

  const [formName, setFormName] = useState(targetProfile?.name || '');
  const [formAvatarUrl, setFormAvatarUrl] = useState(targetProfile?.avatarUrl || '');
  const [formGoal, setFormGoal] = useState(targetProfile?.goal || 'Hipertrofia');

  const [personalData, setPersonalData] = useState<UserPersonalData>(
    targetProfile?.personalData || {
      birthDate: '1998-05-15',
      locationCity: 'São Paulo',
      locationState: 'SP',
      email: '',
      phone: '',
    }
  );

  const [bodyConfig, setBodyConfig] = useState<UserBodyConfig>(
    targetProfile?.bodyConfig || {
      weightKg: 78,
      heightCm: 178,
      age: 28,
      gender: 'M',
      goal: 'Hipertrofia',
      experienceLevel: 'Intermediário',
      bodyFatPercent: 15,
      muscleMassPercent: 42,
      circumferences: {
        chestCm: 100,
        waistCm: 80,
        hipCm: 96,
        armCm: 38,
        thighCm: 58,
        calfCm: 38,
      },
    }
  );

  const [nutritionConfig, setNutritionConfig] = useState<UserNutritionConfig>(
    targetProfile?.nutritionConfig || {
      activityFactor: 1.55,
      targetGoal: 'Ganho de Massa',
      proteinGramsPerKg: 2.0,
      fatPercentOfCalories: 25,
      customCalorieOffset: 350,
    }
  );

  const [workoutPreferences, setWorkoutPreferences] = useState<UserWorkoutPreferences>(
    targetProfile?.workoutPreferences || {
      weeklyDays: 4,
      durationMinutes: 60,
      equipments: ['Barra', 'Halteres', 'Máquinas', 'Polia'],
      primaryGoal: 'Hipertrofia',
    }
  );

  const [importText, setImportText] = useState('');
  const [importFeedback, setImportFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [backupHistory, setBackupHistory] = useState<ProfileBackupRecord[]>(() => {
    const saved = localStorage.getItem('gym_companion_backup_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Body measurement logging form states
  const [newMeasDate, setNewMeasDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newMeasWeight, setNewMeasWeight] = useState<number | ''>(78);
  const [newMeasFat, setNewMeasFat] = useState<number | ''>(15);
  const [newMeasMuscle, setNewMeasMuscle] = useState<number | ''>(42);
  const [newMeasArm, setNewMeasArm] = useState<number | ''>(38);
  const [newMeasChest, setNewMeasChest] = useState<number | ''>(100);
  const [newMeasWaist, setNewMeasWaist] = useState<number | ''>(80);
  const [newMeasThigh, setNewMeasThigh] = useState<number | ''>(58);
  const [newMeasCalf, setNewMeasCalf] = useState<number | ''>(38);

  const handleAddMeasurementRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeasWeight) return;

    const newRecord: BodyMeasurementRecord = {
      id: `meas-${Date.now()}`,
      date: newMeasDate,
      weightKg: Number(newMeasWeight),
      bodyFatPercent: newMeasFat !== '' ? Number(newMeasFat) : undefined,
      muscleMassPercent: newMeasMuscle !== '' ? Number(newMeasMuscle) : undefined,
      armCm: newMeasArm !== '' ? Number(newMeasArm) : undefined,
      chestCm: newMeasChest !== '' ? Number(newMeasChest) : undefined,
      waistCm: newMeasWaist !== '' ? Number(newMeasWaist) : undefined,
      thighCm: newMeasThigh !== '' ? Number(newMeasThigh) : undefined,
      calfCm: newMeasCalf !== '' ? Number(newMeasCalf) : undefined,
    };

    const currentHistory = bodyConfig.measurementHistory && bodyConfig.measurementHistory.length > 0
      ? bodyConfig.measurementHistory
      : defaultSampleMeasurements;

    const updatedHistory = [newRecord, ...currentHistory].sort((a, b) => b.date.localeCompare(a.date));

    setBodyConfig({
      ...bodyConfig,
      weightKg: Number(newMeasWeight),
      bodyFatPercent: newMeasFat !== '' ? Number(newMeasFat) : bodyConfig.bodyFatPercent,
      muscleMassPercent: newMeasMuscle !== '' ? Number(newMeasMuscle) : bodyConfig.muscleMassPercent,
      circumferences: {
        ...bodyConfig.circumferences,
        armCm: newMeasArm !== '' ? Number(newMeasArm) : bodyConfig.circumferences?.armCm,
        chestCm: newMeasChest !== '' ? Number(newMeasChest) : bodyConfig.circumferences?.chestCm,
        waistCm: newMeasWaist !== '' ? Number(newMeasWaist) : bodyConfig.circumferences?.waistCm,
        thighCm: newMeasThigh !== '' ? Number(newMeasThigh) : bodyConfig.circumferences?.thighCm,
        calfCm: newMeasCalf !== '' ? Number(newMeasCalf) : bodyConfig.circumferences?.calfCm,
      },
      measurementHistory: updatedHistory,
    });

    setImportFeedback({ msg: 'Registro de medição corporal salvo com sucesso!', type: 'success' });
  };

  const handleDeleteMeasurementRecord = (id: string) => {
    const currentHistory = bodyConfig.measurementHistory && bodyConfig.measurementHistory.length > 0
      ? bodyConfig.measurementHistory
      : defaultSampleMeasurements;

    const updated = currentHistory.filter((m) => m.id !== id);
    setBodyConfig({
      ...bodyConfig,
      measurementHistory: updated,
    });
  };

  // Sync form states whenever selectedProfileId changes
  useEffect(() => {
    if (targetProfile) {
      setFormName(targetProfile.name || '');
      setFormAvatarUrl(targetProfile.avatarUrl || '');
      setFormGoal(targetProfile.goal || 'Hipertrofia');
      setPersonalData(
        targetProfile.personalData || {
          birthDate: '1998-05-15',
          locationCity: 'São Paulo',
          locationState: 'SP',
          email: '',
          phone: '',
        }
      );
      setBodyConfig(
        targetProfile.bodyConfig || {
          weightKg: 78,
          heightCm: 178,
          age: 28,
          gender: 'M',
          goal: 'Hipertrofia',
          experienceLevel: 'Intermediário',
        }
      );
      setNutritionConfig(
        targetProfile.nutritionConfig || {
          activityFactor: 1.55,
          targetGoal: 'Ganho de Massa',
          proteinGramsPerKg: 2.0,
        }
      );
      setWorkoutPreferences(
        targetProfile.workoutPreferences || {
          weeklyDays: 4,
          durationMinutes: 60,
          equipments: ['Barra', 'Halteres', 'Máquinas'],
          primaryGoal: 'Hipertrofia',
        }
      );
    }
  }, [selectedProfileId, profiles]);

  if (!isOpen) return null;

  // Real-time calculated metrics
  const calculatedAge = calculateAge(personalData.birthDate);
  const bmiInfo = calculateBMI(bodyConfig.weightKg, bodyConfig.heightCm);
  const tmbVal = calculateTMB(bodyConfig.weightKg, bodyConfig.heightCm, calculatedAge, bodyConfig.gender);
  const tdeeVal = calculateTDEE(tmbVal, nutritionConfig.activityFactor);
  const macroBreakdown = calculateMacros(
    { ...bodyConfig, age: calculatedAge },
    nutritionConfig
  );

  // Form submit / save
  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateProfile(selectedProfileId, {
      name: formName,
      avatarUrl: formAvatarUrl,
      goal: formGoal,
      personalData,
      bodyConfig: {
        ...bodyConfig,
        age: calculatedAge,
      },
      nutritionConfig,
      workoutPreferences,
    });
    setImportFeedback({ msg: 'Perfil atualizado com sucesso!', type: 'success' });
    setTimeout(() => setImportFeedback(null), 3000);
  };

  // Avatar Upload Handler
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImageFile(file, {
          maxDimension: 500,
          quality: 0.82,
          mimeType: 'image/jpeg',
        });
        setFormAvatarUrl(compressedBase64);
        setImportFeedback({ msg: 'Foto de perfil carregada e otimizada com sucesso!', type: 'success' });
        setTimeout(() => setImportFeedback(null), 3000);
      } catch (err) {
        console.error('Error compressing avatar image:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setFormAvatarUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Export JSON/CSV Backup
  const handleExportBackup = (format: 'json' | 'csv' = 'json') => {
    const backupContent = exportProfileBackup(selectedProfileId, format);
    const mimeType = format === 'json' ? 'application/json' : 'text/csv';
    const filename = `profile-${targetProfile.name.toLowerCase().replace(/\s+/g, '_')}-${new Date().toISOString().slice(0, 10)}.${format}`;

    const blob = new Blob([backupContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Save backup record
    const newRecord: ProfileBackupRecord = {
      id: `bk-${Date.now()}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      profileName: targetProfile.name,
      profileId: selectedProfileId,
      format,
      fileSizeKb: Math.round(blob.size / 1024 * 10) / 10,
      data: backupContent,
    };
    const updatedHistory = [newRecord, ...backupHistory.slice(0, 9)];
    setBackupHistory(updatedHistory);
    localStorage.setItem('gym_companion_backup_history', JSON.stringify(updatedHistory));
  };

  // Import Backup
  const handleImportBackup = () => {
    if (!importText.trim()) return;
    const ok = importProfileBackup(importText);
    if (ok) {
      setImportFeedback({ msg: 'Backup importado e perfil restaurado com sucesso!', type: 'success' });
      setImportText('');
    } else {
      setImportFeedback({ msg: 'Erro ao importar: arquivo ou formato JSON inválido.', type: 'error' });
    }
  };

  // Equipment Toggle Helper
  const toggleEquipment = (eq: string) => {
    setWorkoutPreferences((prev) => {
      const exists = prev.equipments.includes(eq);
      return {
        ...prev,
        equipments: exists
          ? prev.equipments.filter((e) => e !== eq)
          : [...prev.equipments, eq],
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-5 overflow-y-auto backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F0F11] shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 p-4 sm:p-6 bg-slate-50 dark:bg-[#0A0A0B]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-lime-500/30">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Personalização de Perfil
                </h2>
                <span className="rounded-full bg-lime-500/15 border border-lime-500/30 px-2.5 py-0.5 text-[10px] font-black text-lime-600 dark:text-lime-400">
                  v2.0 Multi-Profile
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Gerencie atletas, métricas corporais, TMB/TDEE, macronutrientes e backups
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-white/10 bg-slate-100/60 dark:bg-[#0A0A0B]/60 px-4 sm:px-6 pt-3 gap-1 sm:gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('gerenciar')}
            className={`pb-3 px-3 text-xs font-black border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'gerenciar'
                ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Gerenciar Perfis ({profiles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pessoais')}
            className={`pb-3 px-3 text-xs font-black border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'pessoais'
                ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Dados Pessoais</span>
          </button>

          <button
            onClick={() => setActiveTab('corporais')}
            className={`pb-3 px-3 text-xs font-black border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'corporais'
                ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Scale className="h-4 w-4" />
            <span>Corporais & IMC</span>
          </button>

          <button
            onClick={() => setActiveTab('nutricao')}
            className={`pb-3 px-3 text-xs font-black border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'nutricao'
                ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Utensils className="h-4 w-4" />
            <span>Nutrição & Macros</span>
          </button>

          <button
            onClick={() => setActiveTab('tema')}
            className={`pb-3 px-3 text-xs font-black border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'tema'
                ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Tema & Aparência</span>
          </button>

          <button
            onClick={() => setActiveTab('treino')}
            className={`pb-3 px-3 text-xs font-black border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'treino'
                ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Dumbbell className="h-4 w-4" />
            <span>Preferências</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-3 px-3 text-xs font-black border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'backup'
                ? 'border-lime-500 text-lime-600 dark:text-lime-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Download className="h-4 w-4" />
            <span>Backup & REST</span>
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Feedback Toast */}
          {importFeedback && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                importFeedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {importFeedback.type === 'success' ? <Check className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
                <span>{importFeedback.msg}</span>
              </div>
              <button onClick={() => setImportFeedback(null)} className="opacity-60 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* TAB 1: GERENCIAR PERFIS */}
          {activeTab === 'gerenciar' && (
            <div className="space-y-6">
              
              {/* Header Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Perfis Cadastrados ({profiles.length})
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Selecione para alternar, editar, duplicar ou crie novos perfis para outros atletas
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      createProfile({
                        name: 'Novo Atleta',
                        goal: 'Hipertrofia',
                      });
                      setActiveTab('pessoais');
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black px-3.5 py-2 text-xs font-black shadow-lg shadow-lime-500/20 transition-all active:scale-95"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>+ Criar Novo Perfil</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowResetAllConfirm(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 px-3 py-2 text-xs font-bold transition-all active:scale-95"
                    title="Zerar Perfis"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Zerar Perfis</span>
                  </button>
                </div>
              </div>

              {/* Profiles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profiles.map((p) => {
                  const isActive = p.id === activeProfileId;
                  const isSelectedForEdit = p.id === selectedProfileId;
                  const unlockedBadgeCount = p.userStats?.unlockedBadges?.filter((b) => b.isUnlocked).length || 0;
                  const pTmb = calculateTMB(p.bodyConfig.weightKg, p.bodyConfig.heightCm, p.bodyConfig.age, p.bodyConfig.gender);
                  const pTdee = calculateTDEE(pTmb, p.nutritionConfig?.activityFactor || 1.55);

                  return (
                    <div
                      key={p.id}
                      className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                        isActive
                          ? 'border-lime-500 bg-lime-500/10 dark:bg-lime-500/10 shadow-lg shadow-lime-500/10'
                          : isSelectedForEdit
                          ? 'border-cyan-500/50 bg-cyan-500/5 dark:bg-white/5'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0A0B] hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      {/* Badge Tags Top */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          {p.id === 'daniel' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-lime-500/15 border border-lime-500/30 px-2.5 py-0.5 text-[10px] font-black text-lime-600 dark:text-lime-400">
                              ⭐ Perfil Principal
                            </span>
                          )}
                          {p.id === 'teste1' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 border border-violet-500/30 px-2.5 py-0.5 text-[10px] font-black text-violet-600 dark:text-violet-400">
                              🧪 Perfil de Teste
                            </span>
                          )}
                          {isActive && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-lime-500 text-black px-2.5 py-0.5 text-[10px] font-black">
                              <Check className="h-3 w-3 stroke-[3]" />
                              Ativo Agora
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">
                          {p.bodyConfig.gender === 'M' ? '♂️ Masc' : p.bodyConfig.gender === 'F' ? '♀️ Fem' : '👤 Outro'}
                        </span>
                      </div>

                      {/* Main Profile Info */}
                      <div className="flex items-start gap-3 mb-4">
                        <img
                          src={p.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={p.name}
                          className="h-14 w-14 rounded-2xl object-cover border-2 border-lime-500/30 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-black text-slate-900 dark:text-white truncate">
                            {p.name}
                          </h4>
                          <p className="text-xs font-bold text-lime-600 dark:text-lime-400">
                            🎯 {p.goal}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            <span>{p.bodyConfig.weightKg} kg</span>
                            <span>•</span>
                            <span>{p.bodyConfig.heightCm} cm</span>
                            <span>•</span>
                            <span>{p.bodyConfig.age} anos</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-white/60 dark:bg-black/40 border border-slate-100 dark:border-white/5 mb-4 text-center">
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">TDEE</span>
                          <span className="text-xs font-black text-slate-900 dark:text-white">{pTdee} kcal</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">Treinos</span>
                          <span className="text-xs font-black text-lime-600 dark:text-lime-400">{p.userStats?.totalWorkouts || 0}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">Badges</span>
                          <span className="text-xs font-black text-amber-500">🏆 {unlockedBadgeCount}</span>
                        </div>
                      </div>

                      {/* Action Buttons Toolbar */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-white/10">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProfileId(p.id);
                              setActiveTab('pessoais');
                            }}
                            className="rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white transition-all"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => duplicateProfile(p.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                            title="Duplicar Perfil"
                          >
                            <Copy className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setProfileToDelete(p)}
                            className="p-1.5 rounded-xl text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/15 border border-rose-500/20 transition-colors"
                            title="Excluir Perfil do Usuário"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => switchProfile(p.id)}
                            className="flex items-center gap-1 rounded-xl bg-lime-500 hover:bg-lime-400 text-black px-3 py-1.5 text-xs font-black shadow-md shadow-lime-500/20 transition-all active:scale-95"
                          >
                            <span>Ativar</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: DADOS PESSOAIS */}
          {activeTab === 'pessoais' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Dados Pessoais — {formName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Foto, identificação, data de nascimento e contatos do perfil selecionado
                  </p>
                </div>
                <span className="text-xs font-bold text-lime-600 dark:text-lime-400 bg-lime-500/10 px-3 py-1 rounded-full border border-lime-500/20">
                  ID: {selectedProfileId}
                </span>
              </div>

              {/* Avatar Photo Upload & Preview */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10">
                <div className="relative group">
                  {formAvatarUrl ? (
                    <img
                      src={formAvatarUrl}
                      alt={formName}
                      className="h-24 w-24 rounded-3xl object-cover border-4 border-lime-500/40 shadow-xl"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-3xl bg-lime-500/15 border-4 border-lime-500/40 shadow-xl flex items-center justify-center text-2xl font-black text-lime-500">
                      {formName ? formName.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                      URL da Foto de Perfil
                    </label>
                    <input
                      type="url"
                      value={formAvatarUrl || ''}
                      onChange={(e) => setFormAvatarUrl(e.target.value)}
                      placeholder="https://..."
                      className="mt-1 w-full rounded-xl bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium focus:border-lime-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white transition-colors">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload do Dispositivo</span>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Personal Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formName || ''}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-bold focus:border-lime-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Objetivo Principal
                  </label>
                  <input
                    type="text"
                    value={formGoal || ''}
                    onChange={(e) => setFormGoal(e.target.value)}
                    placeholder="Ex: Hipertrofia, Perda de Gordura, Força..."
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-bold focus:border-lime-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Data de Nascimento (Cálculo Automático de Idade)
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      type="date"
                      value={personalData.birthDate || ''}
                      onChange={(e) => setPersonalData({ ...personalData, birthDate: e.target.value })}
                      className="w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-bold focus:border-lime-500 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-lime-600 dark:text-lime-400 font-bold mt-1">
                    Idade Calculada: {calculatedAge} anos
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Sexo / Gênero Biológico
                  </label>
                  <select
                    value={bodyConfig.gender || 'M'}
                    onChange={(e) => setBodyConfig({ ...bodyConfig, gender: e.target.value as any })}
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-bold focus:border-lime-500 outline-none"
                  >
                    <option value="M">Masculino (M)</option>
                    <option value="F">Feminino (F)</option>
                    <option value="Outro">Outro / Neutro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={personalData.locationCity || ''}
                    onChange={(e) => setPersonalData({ ...personalData, locationCity: e.target.value })}
                    placeholder="Ex: São Paulo"
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-bold focus:border-lime-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    value={personalData.locationState || ''}
                    onChange={(e) => setPersonalData({ ...personalData, locationState: e.target.value })}
                    placeholder="Ex: SP"
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-bold focus:border-lime-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    E-mail (Opcional)
                  </label>
                  <input
                    type="email"
                    value={personalData.email || ''}
                    onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                    placeholder="atleta@email.com"
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-bold focus:border-lime-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Telefone (Opcional)
                  </label>
                  <input
                    type="tel"
                    value={personalData.phone || ''}
                    onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-bold focus:border-lime-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="rounded-2xl bg-lime-500 hover:bg-lime-400 text-black font-black px-6 py-3 text-sm shadow-lg shadow-lime-500/20 transition-all active:scale-95"
                >
                  Salvar Dados Pessoais
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: DADOS CORPORAIS & IMC */}
          {activeTab === 'corporais' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Métricas Corporais & Composição — {formName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Peso, altura, IMC em tempo real, bioimpedância e circunferências em cm
                  </p>
                </div>
              </div>

              {/* Real-time IMC Highlight Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-black text-white border border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-lime-400 tracking-wider">
                    Cálculo Automático em Tempo Real
                  </span>
                  <h4 className="text-2xl font-black mt-0.5">
                    IMC: {bmiInfo.bmi} kg/m²
                  </h4>
                  <p className={`text-xs font-bold ${bmiInfo.colorClass} mt-0.5`}>
                    Classificação: {bmiInfo.classification}
                  </p>
                </div>

                <div className="text-right sm:border-l border-white/10 sm:pl-6">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Peso Desejável Estimado</span>
                  <p className="text-sm font-black text-white mt-0.5">
                    {Math.round(18.5 * Math.pow(bodyConfig.heightCm / 100, 2))} kg ~ {Math.round(24.9 * Math.pow(bodyConfig.heightCm / 100, 2))} kg
                  </p>
                </div>
              </div>

              {/* Main Weight and Height */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyConfig.weightKg ?? 70}
                    onChange={(e) => setBodyConfig({ ...bodyConfig, weightKg: Number(e.target.value) || 0 })}
                    required
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-base font-black text-slate-900 dark:text-white outline-none focus:border-lime-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    value={bodyConfig.heightCm ?? 175}
                    onChange={(e) => setBodyConfig({ ...bodyConfig, heightCm: Number(e.target.value) || 0 })}
                    required
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-base font-black text-slate-900 dark:text-white outline-none focus:border-lime-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Gordura Corporal (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyConfig.bodyFatPercent ?? ''}
                    placeholder="Ex: 14.5"
                    onChange={(e) =>
                      setBodyConfig({
                        ...bodyConfig,
                        bodyFatPercent: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-base font-black text-slate-900 dark:text-white outline-none focus:border-lime-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Massa Muscular (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyConfig.muscleMassPercent ?? ''}
                    placeholder="Ex: 42.0"
                    onChange={(e) =>
                      setBodyConfig({
                        ...bodyConfig,
                        muscleMassPercent: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-base font-black text-slate-900 dark:text-white outline-none focus:border-lime-500"
                  />
                </div>
              </div>

              {/* Circumferences Section */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
                <span className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Circunferências Corporais (cm)
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase">Peito</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="100"
                      value={bodyConfig.circumferences?.chestCm ?? ''}
                      onChange={(e) =>
                        setBodyConfig({
                          ...bodyConfig,
                          circumferences: {
                            ...bodyConfig.circumferences,
                            chestCm: e.target.value ? Number(e.target.value) : undefined,
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase">Cintura</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="80"
                      value={bodyConfig.circumferences?.waistCm ?? ''}
                      onChange={(e) =>
                        setBodyConfig({
                          ...bodyConfig,
                          circumferences: {
                            ...bodyConfig.circumferences,
                            waistCm: e.target.value ? Number(e.target.value) : undefined,
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase">Quadril</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="96"
                      value={bodyConfig.circumferences?.hipCm ?? ''}
                      onChange={(e) =>
                        setBodyConfig({
                          ...bodyConfig,
                          circumferences: {
                            ...bodyConfig.circumferences,
                            hipCm: e.target.value ? Number(e.target.value) : undefined,
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase">Braço</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="38"
                      value={bodyConfig.circumferences?.armCm ?? ''}
                      onChange={(e) =>
                        setBodyConfig({
                          ...bodyConfig,
                          circumferences: {
                            ...bodyConfig.circumferences,
                            armCm: e.target.value ? Number(e.target.value) : undefined,
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase">Coxa</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="58"
                      value={bodyConfig.circumferences?.thighCm ?? ''}
                      onChange={(e) =>
                        setBodyConfig({
                          ...bodyConfig,
                          circumferences: {
                            ...bodyConfig.circumferences,
                            thighCm: e.target.value ? Number(e.target.value) : undefined,
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase">Panturrilha</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="38"
                      value={bodyConfig.circumferences?.calfCm ?? ''}
                      onChange={(e) =>
                        setBodyConfig({
                          ...bodyConfig,
                          circumferences: {
                            ...bodyConfig.circumferences,
                            calfCm: e.target.value ? Number(e.target.value) : undefined,
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                    />
                  </div>
                </div>
              </div>

              {/* Save Main Data Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="rounded-2xl bg-lime-500 hover:bg-lime-400 text-black font-black px-6 py-3 text-sm shadow-lg shadow-lime-500/20 transition-all active:scale-95"
                >
                  Salvar Dados Corporais
                </button>
              </div>

              {/* PROGRESS CHARTS & HISTORICAL MEASUREMENT TRACKING */}
              {(() => {
                const historyList = bodyConfig.measurementHistory && bodyConfig.measurementHistory.length > 0
                  ? bodyConfig.measurementHistory
                  : defaultSampleMeasurements;

                const sortedAsc = [...historyList].sort((a, b) => a.date.localeCompare(b.date));

                const chartDataComp = sortedAsc.map((m) => ({
                  data: m.date.slice(5).replace('-', '/'),
                  pesoKg: m.weightKg,
                  gorduraPct: m.bodyFatPercent,
                  massaMuscularPct: m.muscleMassPercent,
                }));

                const chartDataCirc = sortedAsc.map((m) => ({
                  data: m.date.slice(5).replace('-', '/'),
                  bracoCm: m.armCm,
                  peitoCm: m.chestCm,
                  cinturaCm: m.waistCm,
                  coxaCm: m.thighCm,
                }));

                return (
                  <div className="space-y-6 pt-6 border-t-2 border-slate-200 dark:border-white/10">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-lime-500" />
                          <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            Gráficos de Evolução Corporal
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Acompanhamento temporal de peso, % de gordura, % de massa muscular e circunferências em cm
                        </p>
                      </div>
                      <span className="rounded-full bg-lime-500/10 border border-lime-500/30 px-3 py-1 text-xs font-bold text-lime-600 dark:text-lime-400">
                        {historyList.length} Registros no Histórico
                      </span>
                    </div>

                    {/* Chart 1: Weight & Body Comp */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                          Evolução: Peso (kg), Gordura (%) e Massa Muscular (%)
                        </span>
                      </div>
                      <div className="h-64 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartDataComp} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                            <XAxis dataKey="data" stroke="#888888" fontSize={11} tickLine={false} />
                            <YAxis stroke="#888888" fontSize={11} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0F0F11', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                            <Line type="monotone" dataKey="pesoKg" name="Peso (kg)" stroke="#84cc16" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="gorduraPct" name="Gordura (%)" stroke="#f97316" strokeWidth={2.5} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="massaMuscularPct" name="Massa Muscular (%)" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Chart 2: Muscle Circumferences */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                          Evolução de Circunferências (cm) — Braço, Peito, Cintura e Coxa
                        </span>
                      </div>
                      <div className="h-64 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartDataCirc} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                            <XAxis dataKey="data" stroke="#888888" fontSize={11} tickLine={false} />
                            <YAxis stroke="#888888" fontSize={11} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0F0F11', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                            <Line type="monotone" dataKey="bracoCm" name="Braço (cm)" stroke="#ec4899" strokeWidth={2.5} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="peitoCm" name="Peito (cm)" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="cinturaCm" name="Cintura (cm)" stroke="#eab308" strokeWidth={2.5} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="coxaCm" name="Coxa (cm)" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Form to Log New Measurement Entry */}
                    <div className="p-4 rounded-2xl bg-lime-500/10 border border-lime-500/30 space-y-4">
                      <div className="flex items-center gap-2 text-lime-600 dark:text-lime-400 font-black text-xs uppercase tracking-wider">
                        <Plus className="h-4 w-4" />
                        <span>Registrar Nova Medição Temporal</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Data</label>
                          <input
                            type="date"
                            value={newMeasDate}
                            onChange={(e) => setNewMeasDate(e.target.value)}
                            className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Peso (kg)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={newMeasWeight}
                            onChange={(e) => setNewMeasWeight(e.target.value ? Number(e.target.value) : '')}
                            placeholder="78.0"
                            className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Gordura (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={newMeasFat}
                            onChange={(e) => setNewMeasFat(e.target.value ? Number(e.target.value) : '')}
                            placeholder="15.0"
                            className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Massa Muscular (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={newMeasMuscle}
                            onChange={(e) => setNewMeasMuscle(e.target.value ? Number(e.target.value) : '')}
                            placeholder="42.0"
                            className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Braço (cm)</label>
                          <input
                            type="number"
                            step="0.5"
                            value={newMeasArm}
                            onChange={(e) => setNewMeasArm(e.target.value ? Number(e.target.value) : '')}
                            placeholder="38.0"
                            className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Peito (cm)</label>
                          <input
                            type="number"
                            step="0.5"
                            value={newMeasChest}
                            onChange={(e) => setNewMeasChest(e.target.value ? Number(e.target.value) : '')}
                            placeholder="100.0"
                            className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Cintura (cm)</label>
                          <input
                            type="number"
                            step="0.5"
                            value={newMeasWaist}
                            onChange={(e) => setNewMeasWaist(e.target.value ? Number(e.target.value) : '')}
                            placeholder="80.0"
                            className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Coxa (cm)</label>
                          <input
                            type="number"
                            step="0.5"
                            value={newMeasThigh}
                            onChange={(e) => setNewMeasThigh(e.target.value ? Number(e.target.value) : '')}
                            placeholder="58.0"
                            className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Panturrilha (cm)</label>
                          <input
                            type="number"
                            step="0.5"
                            value={newMeasCalf}
                            onChange={(e) => setNewMeasCalf(e.target.value ? Number(e.target.value) : '')}
                            placeholder="38.0"
                            className="mt-1 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-lime-500"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={handleAddMeasurementRecord}
                            className="w-full py-2.5 px-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-black text-xs transition active:scale-95 shadow-md shadow-lime-500/20"
                          >
                            + Salvar Medição
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Table of Past Measurement History */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Histórico de Registros Anteriores
                      </h5>
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0A0B]">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-200/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-[10px] uppercase font-black text-slate-500 dark:text-slate-400">
                            <tr>
                              <th className="p-3">Data</th>
                              <th className="p-3">Peso</th>
                              <th className="p-3">Gordura %</th>
                              <th className="p-3">Massa %</th>
                              <th className="p-3">Braço</th>
                              <th className="p-3">Peito</th>
                              <th className="p-3">Cintura</th>
                              <th className="p-3 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-bold text-slate-800 dark:text-slate-200">
                            {historyList.map((m) => (
                              <tr key={m.id} className="hover:bg-slate-100 dark:hover:bg-white/5">
                                <td className="p-3 font-mono text-lime-600 dark:text-lime-400">{m.date}</td>
                                <td className="p-3 font-black">{m.weightKg} kg</td>
                                <td className="p-3">{m.bodyFatPercent ? `${m.bodyFatPercent}%` : '-'}</td>
                                <td className="p-3">{m.muscleMassPercent ? `${m.muscleMassPercent}%` : '-'}</td>
                                <td className="p-3">{m.armCm ? `${m.armCm} cm` : '-'}</td>
                                <td className="p-3">{m.chestCm ? `${m.chestCm} cm` : '-'}</td>
                                <td className="p-3">{m.waistCm ? `${m.waistCm} cm` : '-'}</td>
                                <td className="p-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMeasurementRecord(m.id)}
                                    className="p-1 text-slate-400 hover:text-rose-500 transition"
                                    title="Excluir medição"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </form>
          )}

          {/* TAB 4: NUTRIÇÃO & MACROS */}
          {activeTab === 'nutricao' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Plano Nutricional — {formName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Cálculo metabólico Mifflin-St Jeor, TDEE, divisão de macronutrientes e água
                  </p>
                </div>
              </div>

              {/* Energy Summary Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 text-center">
                  <span className="block text-[10px] font-black uppercase text-slate-400">TMB (Basal)</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">{tmbVal} kcal</span>
                  <p className="text-[10px] text-slate-500 mt-1">Mifflin-St Jeor</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 text-center">
                  <span className="block text-[10px] font-black uppercase text-slate-400">TDEE (Gasto Total)</span>
                  <span className="text-xl font-black text-lime-600 dark:text-lime-400">{tdeeVal} kcal</span>
                  <p className="text-[10px] text-slate-500 mt-1">Fator: {nutritionConfig.activityFactor}x</p>
                </div>

                <div className="p-4 rounded-2xl bg-lime-500/10 border border-lime-500/30 text-center">
                  <span className="block text-[10px] font-black uppercase text-lime-600 dark:text-lime-400">Meta Diária Ajustada</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">{macroBreakdown.targetCalories} kcal</span>
                  <p className="text-[10px] text-slate-500 mt-1">{nutritionConfig.targetGoal}</p>
                </div>
              </div>

              {/* Nutrition Config Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Nível de Atividade Física
                  </label>
                  <select
                    value={nutritionConfig.activityFactor}
                    onChange={(e) => setNutritionConfig({ ...nutritionConfig, activityFactor: Number(e.target.value) })}
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-lime-500"
                  >
                    <option value={1.2}>Sedentário (pouco ou nenhum exercício) — 1.2x</option>
                    <option value={1.375}>Leve (exercício 1-3 dias/sem) — 1.375x</option>
                    <option value={1.55}>Moderado (exercício 3-5 dias/sem) — 1.55x</option>
                    <option value={1.725}>Intenso (exercício 6-7 dias/sem) — 1.725x</option>
                    <option value={1.9}>Muito Intenso (2x/dia ou atleta profissional) — 1.9x</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Objetivo Nutricional
                  </label>
                  <select
                    value={nutritionConfig.targetGoal}
                    onChange={(e) =>
                      setNutritionConfig({
                        ...nutritionConfig,
                        targetGoal: e.target.value as any,
                        customCalorieOffset: e.target.value === 'Perda de Gordura' ? -400 : e.target.value === 'Ganho de Massa' ? 350 : 0,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-lime-500"
                  >
                    <option value="Perda de Gordura">Perda de Gordura (Déficit -400 kcal)</option>
                    <option value="Manutenção">Manutenção de Peso (TDEE)</option>
                    <option value="Ganho de Massa">Ganho de Massa / Hipertrofia (Superávit +350 kcal)</option>
                  </select>
                </div>
              </div>

              {/* Calculated Macronutrients Cards */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
                <span className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Macronutrientes e Hidratação Calculados
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Proteína</span>
                    <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {macroBreakdown.proteinGrams}g
                    </p>
                    <span className="text-[10px] font-semibold text-lime-600 dark:text-lime-400">
                      {Math.round((macroBreakdown.proteinGrams * 4 / macroBreakdown.targetCalories) * 100)}% das kcal
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Carboidratos</span>
                    <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {macroBreakdown.carbsGrams}g
                    </p>
                    <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">
                      {Math.round((macroBreakdown.carbsGrams * 4 / macroBreakdown.targetCalories) * 100)}% das kcal
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Gorduras</span>
                    <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {macroBreakdown.fatGrams}g
                    </p>
                    <span className="text-[10px] font-semibold text-amber-500">
                      {Math.round((macroBreakdown.fatGrams * 9 / macroBreakdown.targetCalories) * 100)}% das kcal
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Fibras</span>
                    <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {macroBreakdown.fiberGrams}g
                    </p>
                    <span className="text-[10px] font-semibold text-slate-500">14g / 1000 kcal</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-blue-500 uppercase">Água Diária</span>
                    <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
                      💧 {macroBreakdown.waterLiters}L
                    </p>
                    <span className="text-[10px] font-semibold text-slate-500">35ml / kg</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="rounded-2xl bg-lime-500 hover:bg-lime-400 text-black font-black px-6 py-3 text-sm shadow-lg shadow-lime-500/20 transition-all active:scale-95"
                >
                  Salvar Plano Nutricional
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: TEMA & APARÊNCIA */}
          {activeTab === 'tema' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Tema & Economia de Bateria (OLED)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Escolha o modo visual ideal para uso diário na academia ou em ambientes de pouca luz
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center justify-center gap-3 rounded-2xl border p-5 transition-all ${
                    theme === 'dark'
                      ? 'border-lime-500 bg-lime-500/15 text-slate-900 dark:text-white font-black shadow-lg shadow-lime-500/10'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0A0B] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="p-3 rounded-2xl bg-slate-200 dark:bg-white/10 text-lime-600 dark:text-lime-400">
                    <Moon className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-black block">Escuro Padrão</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Contraste equilibrado em tom chumbo</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('oled')}
                  className={`flex flex-col items-center justify-center gap-3 rounded-2xl border p-5 transition-all ${
                    theme === 'oled'
                      ? 'border-cyan-500 bg-cyan-500/15 text-slate-900 dark:text-white font-black shadow-lg shadow-cyan-500/10'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="p-3 rounded-2xl bg-slate-200 dark:bg-white/10 text-cyan-600 dark:text-cyan-400">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-black block">OLED Preto Puro</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Economia de bateria em telas AMOLED</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center justify-center gap-3 rounded-2xl border p-5 transition-all ${
                    theme === 'light'
                      ? 'border-lime-500 bg-lime-500/15 text-slate-900 dark:text-white font-black shadow-lg shadow-lime-500/10'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0A0A0B] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="p-3 rounded-2xl bg-slate-200 dark:bg-white/10 text-amber-500">
                    <Sun className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-black block">Claro Dia</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Alta visibilidade para locais abertos</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: PREFERÊNCIAS DE TREINO */}
          {activeTab === 'treino' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Preferências de Treino — {formName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Frequência semanal, tempo de sessão, nível de experiência e equipamentos
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Nível de Experiência
                  </label>
                  <select
                    value={bodyConfig.experienceLevel}
                    onChange={(e) => setBodyConfig({ ...bodyConfig, experienceLevel: e.target.value as any })}
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-lime-500"
                  >
                    <option value="Iniciante">Iniciante (&lt; 6 meses)</option>
                    <option value="Intermediário">Intermediário (6 meses - 2 anos)</option>
                    <option value="Avançado">Avançado (2 - 5 anos)</option>
                    <option value="Expert">Expert (5+ anos)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Frequência Semanal (Dias)
                  </label>
                  <select
                    value={workoutPreferences.weeklyDays}
                    onChange={(e) => setWorkoutPreferences({ ...workoutPreferences, weeklyDays: Number(e.target.value) })}
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-lime-500"
                  >
                    {[2, 3, 4, 5, 6, 7].map((d) => (
                      <option key={d} value={d}>{d} dias por semana</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Duração Média por Sessão
                  </label>
                  <select
                    value={workoutPreferences.durationMinutes}
                    onChange={(e) => setWorkoutPreferences({ ...workoutPreferences, durationMinutes: Number(e.target.value) })}
                    className="mt-1.5 w-full rounded-xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-lime-500"
                  >
                    <option value={30}>30 minutos (Express)</option>
                    <option value={45}>45 minutos (Padrão Recomendado)</option>
                    <option value={60}>60 minutos (Completo)</option>
                    <option value={90}>90 minutos (Avançado/Volume)</option>
                    <option value={120}>120 minutos (Atleta/Intenso)</option>
                  </select>
                </div>
              </div>

              {/* Available Equipment Chips */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
                <span className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Equipamentos Disponíveis na sua Academia
                </span>

                <div className="flex flex-wrap gap-2">
                  {['Barra', 'Halteres', 'Máquinas', 'Polia/Cabo', 'Peso Corporal', 'Cardio', 'Smith', 'Kettlebell', 'Bancos'].map((eq) => {
                    const isSelected = workoutPreferences.equipments.includes(eq);
                    return (
                      <button
                        key={eq}
                        type="button"
                        onClick={() => toggleEquipment(eq)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-lime-500 text-black border-lime-400 shadow-md shadow-lime-500/20'
                            : 'bg-slate-100 dark:bg-[#0A0A0B] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/30'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {eq}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="rounded-2xl bg-lime-500 hover:bg-lime-400 text-black font-black px-6 py-3 text-sm shadow-lg shadow-lime-500/20 transition-all active:scale-95"
                >
                  Salvar Preferências de Treino
                </button>
              </div>
            </form>
          )}

          {/* TAB 6: BACKUP & RESTAURAÇÃO */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Backup, Exportação & Restauração
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Exportação em JSON e CSV do perfil e histórico para segurança total
                  </p>
                </div>
              </div>

              {/* Export Buttons Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                    <Download className="h-5 w-5 text-lime-500" />
                    <span>Exportar Backup do Perfil (JSON)</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gera um arquivo JSON completo contendo dados corporais, nutricionais, histórico de treinos e badges do perfil {targetProfile.name}.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleExportBackup('json')}
                    className="w-full py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-xs font-black shadow-md shadow-lime-500/20 transition-all"
                  >
                    Baixar Perfil Completo (.JSON)
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                    <FileText className="h-5 w-5 text-cyan-500" />
                    <span>Exportar Relatório Tabular (CSV)</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gera uma planilha CSV compatível com Excel e Google Sheets com os dados corporais e estatísticas.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleExportBackup('csv')}
                    className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white text-xs font-black transition-all"
                  >
                    Baixar Relatório Tabular (.CSV)
                  </button>
                </div>
              </div>

              {/* Import Section */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                  <Upload className="h-5 w-5 text-amber-500" />
                  <span>Restaurar Backup do Perfil</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cole o conteúdo do backup JSON baixado anteriormente para restaurar os dados do perfil no aplicativo.
                </p>

                <textarea
                  rows={4}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Cole aqui o conteúdo JSON do backup de perfil..."
                  className="w-full rounded-xl bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 p-3 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-500 outline-none focus:border-lime-500"
                />

                <button
                  type="button"
                  onClick={handleImportBackup}
                  disabled={!importText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 disabled:opacity-40 text-black text-xs font-black transition-all shadow-md shadow-lime-500/20"
                >
                  Restaurar e Ativar Perfil
                </button>
              </div>

              {/* History of Backups */}
              {backupHistory.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
                  <span className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Histórico Recente de Backups Locais ({backupHistory.length})
                  </span>

                  <div className="space-y-2">
                    {backupHistory.map((bk) => (
                      <div
                        key={bk.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {bk.profileName} ({bk.format.toUpperCase()})
                          </span>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {bk.timestamp} • {bk.fileSizeKb} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const blob = new Blob([bk.data], {
                              type: bk.format === 'json' ? 'application/json' : 'text/csv',
                            });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `backup-${bk.profileName.toLowerCase()}.${bk.format}`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold text-[11px]"
                        >
                          Baixar Novamente
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE PERFIL */}
      {profileToDelete && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setProfileToDelete(null)}
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
                  Excluir Perfil de Usuário?
                </h3>
                <p className="text-xs text-rose-500 font-bold">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>

            {/* Profile Info Summary Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 flex items-center gap-3">
              <img
                src={profileToDelete.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={profileToDelete.name}
                className="h-12 w-12 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                  {profileToDelete.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  🎯 {profileToDelete.goal} • {profileToDelete.userStats?.totalWorkouts || 0} treinos
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {profiles.length <= 1
                ? 'Este é o seu único perfil ativo. Ao confirmar, todos os dados, fichas e histórico deste usuário serão removidos e um perfil novo e limpo será criado automaticamente.'
                : `Tem certeza que deseja excluir o perfil "${profileToDelete.name}"? Todo o histórico de treinos, fichas e configurações deste usuário serão apagados permanentemente.`}
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProfileToDelete(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const idToDelete = profileToDelete.id;
                  deleteProfile(idToDelete);
                  if (selectedProfileId === idToDelete) {
                    const remaining = profiles.filter((p) => p.id !== idToDelete);
                    if (remaining.length > 0) {
                      setSelectedProfileId(remaining[0].id);
                    }
                  }
                  setProfileToDelete(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Trash2 className="h-4 w-4" />
                <span>Sim, Excluir Perfil</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO PARA ZERAR TODOS OS PERFIS */}
      {showResetAllConfirm && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setShowResetAllConfirm(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-[#18181B] border border-slate-200 dark:border-white/10 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30">
                <RefreshCw className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Zerar Todos os Perfis?
                </h3>
                <p className="text-xs text-amber-500 font-bold">
                  Restaura o estado inicial do aplicativo
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Deseja zerar todos os perfis personalizados e restaurar apenas o Perfil Demo inicial (Daniel - Glow Up 2026)?
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetAllConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllProfilesToDemo();
                  setShowResetAllConfirm(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all shadow-lg shadow-rose-600/30 active:scale-95"
              >
                Sim, Restaurar Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
