/**
 * Gym Companion v1.0 — Global State Context
 * Handles active workout flow, automatic rest timer, QR check-ins, AI Coach, and local storage persistence.
 */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Workout,
  Exercise,
  MuscleGroup,
  WorkoutLog,
  UserStats,
  Badge,
  UserBodyConfig,
  GymAccessConfig,
  AppThemeMode,
  ActiveWorkoutState,
  AICoachMessage,
  AppSettings,
  ExerciseIndividualProfile,
  IndividualExerciseSessionLog,
  MasterExercise,
  MediaAttachment,
  MachineSetup,
  MachinePlateEntry,
} from '../types';
import {
  DEFAULT_WORKOUTS,
  DEFAULT_BADGES,
  DEFAULT_QR_CODE_DATA,
} from '../data/defaultWorkouts';
import { MASTER_EXERCISES } from '../data/masterExercises';
import { INITIAL_PROFILES, DEMO_PROFILE, UserProfile } from '../data/profiles';
import { OPTIONAL_WORKOUTS, OptionalWorkoutItem } from '../data/optionalWorkouts';
import { estimateWorkoutCalories } from '../utils/calories';
import {
  calculateNextWeight,
  isNewPR,
  calculateExerciseProgression,
  calculateTrend,
  getCoachMetricInsight,
} from '../utils/progression';
import { soundGenerator } from '../utils/audio';
import { BadgeEngine } from '../utils/badgeEngine';
import { BadgeUnlockedModal } from '../components/BadgeUnlockedModal';
import { PersistenceService, PRIMARY_USER_ID, SyncState } from '../services/PersistenceService';

interface GymContextType {
  // Sync Status & Cloud Persistence
  syncState: SyncState;
  forceFullCloudSync: () => Promise<{ success: boolean; message: string }>;

  // Theme & App modes
  theme: AppThemeMode;
  setTheme: (theme: AppThemeMode) => void;
  isWorkoutModeActive: boolean;
  setIsWorkoutModeActive: (active: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  vibrateEnabled: boolean;
  setVibrateEnabled: (enabled: boolean) => void;
  appSettings: AppSettings;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  resetApplication: () => void;

  // Master Exercises Library (Biblioteca Mestre de Exercícios)
  masterExercises: MasterExercise[];
  updateMasterExercise: (exercise: MasterExercise) => void;
  addMasterExercise: (exercise: MasterExercise) => void;
  deleteMasterExercise: (id: string) => void;
  addMediaAttachment: (exerciseId: string, attachment: MediaAttachment) => void;
  removeMediaAttachment: (exerciseId: string, attachmentId: string) => void;
  reorderMediaAttachments: (exerciseId: string, attachmentIds: string[]) => void;
  updateMachineSetup: (exerciseId: string, setup: MachineSetup) => void;
  updatePlateTable: (exerciseId: string, table: MachinePlateEntry[]) => void;
  restoreDefaultPresets: (confirm?: boolean) => void;
  applySuggestedWeight: () => void;

  // Workouts & Exercises CRUD
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  updateWorkout: (workout: Workout) => void;
  createWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  duplicateWorkout: (id: string) => void;
  addExerciseToWorkout: (
    workoutId: string,
    exerciseData: Partial<Exercise> & { name: string; muscleGroup: MuscleGroup }
  ) => void;

  // Today's suggested workout
  todayWorkout: Workout;

  // Active workout session
  activeWorkout: ActiveWorkoutState | null;
  startWorkout: (workoutId: string, isFromQrCode?: boolean) => void;
  completeCurrentSet: () => void;
  adjustCurrentWeight: (deltaKg: number) => void;
  setCurrentWeightDirect: (weightKg: number) => void;
  adjustCurrentReps: (deltaReps: number) => void;
  setCurrentRepsDirect: (reps: number) => void;
  markCurrentExerciseBusy: () => void; // "Máquina ocupada" / pular para fila
  previousExercise: () => void;
  cancelCurrentExercise: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  dismissExerciseTransition: () => void;

  // Rest Timer controls
  restSecondsRemaining: number;
  addRestTime: (seconds: number) => void;
  skipRestTime: () => void;
  restFinishedAlert: string | null;
  dismissRestFinishedAlert: () => void;

  // Workout Recovery Engine
  hasUnfinishedWorkout: boolean;
  unfinishedWorkoutData: ActiveWorkoutState | null;
  restoreSavedWorkout: () => void;
  discardSavedWorkout: () => void;

  // Multi-Profile System & Individual Progression Engine
  profiles: UserProfile[];
  activeProfileId: string;
  activeProfile: UserProfile;
  switchProfile: (profileId: string) => void;
  createProfile: (profileData: Partial<UserProfile>) => void;
  updateProfile: (profileId: string, profileData: Partial<UserProfile>) => void;
  duplicateProfile: (profileId: string) => void;
  deleteProfile: (profileId: string) => void;
  resetAllProfilesToDemo: () => void;
  exportProfileBackup: (profileId?: string, format?: 'json' | 'csv') => string;
  importProfileBackup: (content: string) => boolean;
  exerciseProfiles: Record<string, ExerciseIndividualProfile>;
  getExerciseProfile: (exercise: Exercise) => ExerciseIndividualProfile;
  recordExerciseSessionLog: (
    exercise: Exercise,
    plannedWeightKg: number,
    actualWeightKg: number,
    setsCompleted: number,
    repsPerSet: number[],
    status?: IndividualExerciseSessionLog['status']
  ) => void;
  progressionEngine: {
    getProfile: (exercise: Exercise) => ExerciseIndividualProfile;
    recordSessionLog: (
      exercise: Exercise,
      plannedWeightKg: number,
      actualWeightKg: number,
      setsCompleted: number,
      repsPerSet: number[],
      status?: IndividualExerciseSessionLog['status']
    ) => void;
    calculateProgression: typeof calculateExerciseProgression;
    calculateTrend: typeof calculateTrend;
    getCoachInsight: typeof getCoachMetricInsight;
  };

  // Optional Workouts
  optionalWorkouts: OptionalWorkoutItem[];
  updateOptionalWorkout: (item: OptionalWorkoutItem) => void;

  // Exercise Media Customization
  updateExerciseMedia: (exerciseId: string, media: Partial<Exercise>) => void;

  // Post workout rating & feedback
  pendingFinishedLog: WorkoutLog | null;
  submitWorkoutRatingAndFeedback: (
    rating: number,
    tags: string[],
    customText?: string,
    showerCompleted?: boolean,
    showerDurationMinutes?: number,
    lowerPerformanceCauses?: string[]
  ) => void;
  closePostWorkoutModal: () => void;

  // Gym Access (QR Code Check-in & Check-out)
  gymConfig: GymAccessConfig;
  updateGymQrCode: (dataUrl: string) => void;
  checkInGymWithQrCode: () => void;
  checkOutGymWithQrCode: () => void;

  // User Stats & Body Config
  userStats: UserStats;
  bodyConfig: UserBodyConfig;
  updateBodyConfig: (config: UserBodyConfig) => void;
  workoutLogs: WorkoutLog[];
  deleteWorkoutLog: (id: string) => void;

  // AI Coach state
  aiCoachMessages: AICoachMessage[];
  isAiLoading: boolean;
  sendAiCoachMessage: (messageText: string, feedbackType?: string) => Promise<void>;

  // Badge Engine & Unlocked Badges Modal
  badgeEngine: typeof BadgeEngine;
  evaluateBadgesNow: (log?: WorkoutLog) => Badge[];
  newlyUnlockedBadgesModal: Badge[] | null;
  dismissNewlyUnlockedBadgesModal: () => void;

  // Data import/export
  exportBackupJson: () => string;
  importBackupJson: (jsonStr: string) => boolean;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_WORKOUTS = 'gym_companion_workouts_v4_abcd_daniel_2026';
const LOCAL_STORAGE_KEY_LOGS = 'gym_companion_logs_v1';
const LOCAL_STORAGE_KEY_STATS = 'gym_companion_stats_v1';
const LOCAL_STORAGE_KEY_BODY = 'gym_companion_body_v1';
const LOCAL_STORAGE_KEY_GYM = 'gym_companion_gym_v1';
const LOCAL_STORAGE_KEY_THEME = 'gym_companion_theme_v1';
const LOCAL_STORAGE_KEY_PROFILES = 'gym_companion_profiles_v4_abcd_daniel_2026';

export const getCustomMediaMap = (): Record<string, Partial<Exercise>> => {
  try {
    const saved = localStorage.getItem('gym_companion_custom_media');
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
};

export const applyCustomMediaToExercises = (exercises: Exercise[], customMedia?: Record<string, Partial<Exercise>>): Exercise[] => {
  const mediaMap = customMedia || getCustomMediaMap();
  if (!exercises || !Array.isArray(exercises) || Object.keys(mediaMap).length === 0) {
    return exercises;
  }
  return exercises.map((ex) => {
    const keyId = ex.id;
    const keyName = ex.name ? ex.name.trim().toLowerCase() : '';
    const custom = { ...(mediaMap[keyName] || {}), ...(mediaMap[keyId] || {}) };
    if (Object.keys(custom).length > 0) {
      return { ...ex, ...custom };
    }
    return ex;
  });
};

export const applyCustomMediaToWorkouts = (workoutList: Workout[]): Workout[] => {
  const customMedia = getCustomMediaMap();
  if (Object.keys(customMedia).length === 0) return workoutList;
  return workoutList.map((w) => ({
    ...w,
    exercises: applyCustomMediaToExercises(w.exercises, customMedia),
  }));
};

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme
  const [theme, setThemeState] = useState<AppThemeMode>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_THEME);
    return (saved as AppThemeMode) || 'dark';
  });

  const setTheme = (mode: AppThemeMode) => {
    setThemeState(mode);
    localStorage.setItem(LOCAL_STORAGE_KEY_THEME, mode);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    } else if (theme === 'oled') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#f1f5f9';
    } else {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#0A0A0B';
      document.body.style.color = '#f1f5f9';
    }
  }, [theme]);

  const [isWorkoutModeActive, setIsWorkoutModeActive] = useState<boolean>(false);

  // Cloud Firestore Sync State
  const [syncState, setSyncState] = useState<SyncState>(() => PersistenceService.getSyncState());

  const forceFullCloudSync = async () => {
    return await PersistenceService.forceFullCloudSync();
  };

  const [appSettings, setAppSettingsState] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('gym_companion_app_settings_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      soundEffects: true,
      alarmEnabled: true,
      vibrationEnabled: true,
      keepScreenOn: true,
      disableTouchDuringWorkout: false,
      weeklyWorkoutGoalDays: 2,
    };
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(appSettings.soundEffects);
  const [vibrateEnabled, setVibrateEnabled] = useState<boolean>(appSettings.vibrationEnabled);

  const updateAppSettings = (newSettings: Partial<AppSettings>) => {
    setAppSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('gym_companion_app_settings_v1', JSON.stringify(updated));
      if (typeof newSettings.soundEffects === 'boolean') setSoundEnabled(newSettings.soundEffects);
      if (typeof newSettings.vibrationEnabled === 'boolean') setVibrateEnabled(newSettings.vibrationEnabled);
      PersistenceService.saveUserData(PRIMARY_USER_ID, { appSettings: updated });
      return updated;
    });
  };

  const resetApplication = () => {
    localStorage.clear();
    window.location.reload();
  };

  // 1.5 Master Exercises Library State
  const [masterExercises, setMasterExercises] = useState<MasterExercise[]>(() => {
    return PersistenceService.getLocalMasterExercises();
  });

  useEffect(() => {
    localStorage.setItem('gym_companion_master_exercises_v2', JSON.stringify(masterExercises));
  }, [masterExercises]);

  const updateMasterExercise = (updated: MasterExercise) => {
    setMasterExercises((prev) =>
      prev.map((ex) => (ex.id === updated.id ? { ...ex, ...updated } : ex))
    );
    PersistenceService.saveMasterExercise(updated);

    // Extract primary motion GIF & media from attachments
    const motionAtt = updated.mediaAttachments?.find(
      (m) => m.type === 'motion' || m.url.toLowerCase().endsWith('.gif') || m.isPrimary
    );
    const photoAtt = updated.mediaAttachments?.find(
      (m) => m.type === 'machine' || m.type === 'setup'
    );
    const anatomyAtt = updated.mediaAttachments?.find((m) => m.type === 'anatomy');
    const videoAtt = updated.mediaAttachments?.find((m) => m.type === 'video');

    const syncedFields: Partial<Exercise> = {
      name: updated.name,
      muscleGroup: updated.muscleGroup,
      equipment: updated.equipment,
      mediaAttachments: updated.mediaAttachments,
      gifUrl: motionAtt ? motionAtt.url : (updated.gifUrl ?? ''),
      photoUrl: photoAtt ? photoAtt.url : (updated.photoUrl ?? ''),
      muscleIllustrationUrl: anatomyAtt ? anatomyAtt.url : (updated.muscleIllustrationUrl ?? ''),
      videoUrl: videoAtt ? videoAtt.url : (updated.videoUrl ?? ''),
      plateTable: updated.plateTable,
      loadUnit: updated.loadUnit,
    };

    const cleanedUpdates: any = Object.fromEntries(
      Object.entries(syncedFields).filter(([_, v]) => v !== undefined)
    );

    const isMatch = (e: any) =>
      e.masterExerciseId === updated.id ||
      e.id === updated.id ||
      (e.name && e.name.trim().toLowerCase() === updated.name.trim().toLowerCase());

    // 1. Update active workout plans
    setWorkouts((prevWorkouts) => {
      const safeWorkouts = Array.isArray(prevWorkouts) ? prevWorkouts : [];
      const next = safeWorkouts.map((w) => ({
        ...w,
        exercises: (w?.exercises || []).map((e) => (isMatch(e) ? { ...e, ...cleanedUpdates } : e)),
      }));
      PersistenceService.saveWorkoutPlans(next);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_WORKOUTS, JSON.stringify(next));
      } catch (err) {}
      return next;
    });

    // 2. Update active workout queue if currently training
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const updatedQueue = (prev.exercisesQueue || []).map((e) => (isMatch(e) ? { ...e, ...cleanedUpdates } : e));
      const updatedActive = { ...prev, exercisesQueue: updatedQueue };
      try {
        localStorage.setItem('gym_companion_active_workout_v1', JSON.stringify(updatedActive));
      } catch (err) {}
      return updatedActive;
    });

    // 3. Update optional workouts (presets)
    setOptionalWorkouts((prev) => {
      const safeOptional = Array.isArray(prev) ? prev : [];
      const updated = safeOptional.map((opt) => ({
        ...opt,
        exercises: (opt?.exercises || []).map((e: any) => (isMatch(e) ? { ...e, ...cleanedUpdates } : e)),
      }));
      try {
        localStorage.setItem('gym_companion_optional_workouts_v1', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    // 4. Update all profiles
    setProfiles((prev) => {
      const safeProfiles = Array.isArray(prev) ? prev : [];
      const updated = safeProfiles.map((p) => ({
        ...p,
        workouts: (p.workouts || []).map((w) => ({
          ...w,
          exercises: (w?.exercises || []).map((e) => (isMatch(e) ? { ...e, ...cleanedUpdates } : e)),
        })),
      }));
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_PROFILES, JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  const addMasterExercise = (newEx: MasterExercise) => {
    setMasterExercises((prev) => {
      const updated = prev.some((ex) => ex.id === newEx.id)
        ? prev.map((ex) => (ex.id === newEx.id ? newEx : ex))
        : [...prev, newEx];
      return updated;
    });
    PersistenceService.saveMasterExercise(newEx);
  };

  const deleteMasterExercise = (id: string) => {
    setMasterExercises((prev) => prev.filter((ex) => ex.id !== id));
    PersistenceService.deleteMasterExercise(id);
  };

  const addMediaAttachment = (exerciseId: string, attachment: MediaAttachment) => {
    setMasterExercises((prev) => {
      const updatedList = prev.map((ex) => {
        if (ex.id === exerciseId) {
          const current = ex.mediaAttachments || [];
          const updatedEx = {
            ...ex,
            mediaAttachments: [...current, { ...attachment, order: current.length + 1 }],
          };
          PersistenceService.saveMasterExercise(updatedEx);
          return updatedEx;
        }
        return ex;
      });
      return updatedList;
    });
  };

  const removeMediaAttachment = (exerciseId: string, attachmentId: string) => {
    setMasterExercises((prev) => {
      const updatedList = prev.map((ex) => {
        if (ex.id === exerciseId) {
          const updatedEx = {
            ...ex,
            mediaAttachments: (ex.mediaAttachments || []).filter((m) => m.id !== attachmentId),
          };
          PersistenceService.saveMasterExercise(updatedEx);
          return updatedEx;
        }
        return ex;
      });
      return updatedList;
    });
  };

  const reorderMediaAttachments = (exerciseId: string, attachmentIds: string[]) => {
    setMasterExercises((prev) => {
      const updatedList = prev.map((ex) => {
        if (ex.id === exerciseId && ex.mediaAttachments) {
          const reordered = attachmentIds
            .map((id, index) => {
              const item = ex.mediaAttachments?.find((m) => m.id === id);
              return item ? { ...item, order: index + 1 } : null;
            })
            .filter(Boolean) as MediaAttachment[];
          const updatedEx = { ...ex, mediaAttachments: reordered };
          PersistenceService.saveMasterExercise(updatedEx);
          return updatedEx;
        }
        return ex;
      });
      return updatedList;
    });
  };

  const updateMachineSetup = (exerciseId: string, setup: MachineSetup) => {
    setMasterExercises((prev) => {
      const updatedList = prev.map((ex) => {
        if (ex.id === exerciseId) {
          const updatedEx = { ...ex, machineSetup: setup };
          PersistenceService.saveMasterExercise(updatedEx);
          return updatedEx;
        }
        return ex;
      });
      return updatedList;
    });
  };

  const updatePlateTable = (exerciseId: string, table: MachinePlateEntry[]) => {
    setMasterExercises((prev) => {
      const updatedList = prev.map((ex) => {
        if (ex.id === exerciseId) {
          const updatedEx = { ...ex, plateTable: table };
          PersistenceService.saveMasterExercise(updatedEx);
          return updatedEx;
        }
        return ex;
      });
      return updatedList;
    });
  };

  const restoreDefaultPresets = (confirm = true) => {
    if (confirm) {
      setMasterExercises(MASTER_EXERCISES);
      PersistenceService.seedInitialMasterExercises();
      setWorkouts(DEFAULT_WORKOUTS);
      PersistenceService.saveWorkoutPlans(DEFAULT_WORKOUTS);
    }
  };

  // 2. Workouts
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    return applyCustomMediaToWorkouts(PersistenceService.getLocalWorkoutPlans());
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_WORKOUTS, JSON.stringify(workouts));
  }, [workouts]);

  // Realtime Cloud Subscriptions
  useEffect(() => {
    const unsubSync = PersistenceService.onSyncStateChange(setSyncState);

    const unsubProfiles = PersistenceService.subscribeProfiles((cloudProfiles) => {
      if (cloudProfiles && cloudProfiles.length > 0) {
        setProfiles(cloudProfiles);
      }
    });

    const unsubExercises = PersistenceService.subscribeMasterExercises((cloudExercises) => {
      if (cloudExercises && cloudExercises.length > 0) {
        setMasterExercises(cloudExercises);
      }
    });

    const unsubWorkouts = PersistenceService.subscribeWorkoutPlans((cloudWorkouts) => {
      if (cloudWorkouts && cloudWorkouts.length > 0) {
        setWorkouts(applyCustomMediaToWorkouts(cloudWorkouts));
      }
    });

    const unsubSessions = PersistenceService.subscribeWorkoutSessions((cloudSessions) => {
      if (cloudSessions) {
        setWorkoutLogs(cloudSessions);
      }
    });

    const unsubUserData = PersistenceService.subscribeUserData(PRIMARY_USER_ID, (cloudData) => {
      if (cloudData.bodyConfig) setBodyConfig(cloudData.bodyConfig);
      if (cloudData.userStats) setUserStats(cloudData.userStats);
      if (cloudData.appSettings) setAppSettingsState((prev) => ({ ...prev, ...cloudData.appSettings }));
      if (cloudData.gymConfig) setGymConfig((prev) => ({ ...prev, ...cloudData.gymConfig }));
      if (cloudData.exerciseProfiles) setExerciseProfiles(cloudData.exerciseProfiles);
    });

    return () => {
      unsubSync();
      unsubProfiles();
      unsubExercises();
      unsubWorkouts();
      unsubSessions();
      unsubUserData();
    };
  }, []);

  // 3. User Stats & Logs
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Zera dados de exemplo histórico para o usuário inserir durante a semana
    return [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LOGS, JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  // State for newly unlocked badges celebration modal
  const [newlyUnlockedBadgesModal, setNewlyUnlockedBadgesModal] = useState<Badge[] | null>(null);

  const dismissNewlyUnlockedBadgesModal = () => {
    setNewlyUnlockedBadgesModal(null);
  };

  // Helper to evaluate all badges dynamically using BadgeEngine
  const evaluateAllBadges = (
    currentBadges: Badge[],
    stats: UserStats,
    finalLog?: WorkoutLog
  ): Badge[] => {
    const result = BadgeEngine.evaluateBadges(currentBadges, {
      stats,
      workoutLogs,
      exerciseProfiles,
      bodyConfig,
      latestLog: finalLog,
    });
    return result.updatedBadges;
  };

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STATS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedBadgesMap = new Map<string, Badge>((parsed.unlockedBadges || []).map((b: Badge) => [b.id, b]));
        const mergedBadges = DEFAULT_BADGES.map((def) => {
          const existing = savedBadgesMap.get(def.id);
          return existing ? { ...def, isUnlocked: existing.isUnlocked, unlockedAt: existing.unlockedAt } : def;
        });
        return {
          ...parsed,
          unlockedBadges: mergedBadges,
        };
      } catch (e) {
        console.error(e);
      }
    }
    return {
      streak: 0,
      level: 1,
      xp: 0,
      nextLevelXp: 500,
      totalWorkouts: 0,
      totalHoursTrained: 0,
      totalVolumeLiftedKg: 0,
      totalCaloriesBurned: 0,
      consecutiveWeeks: 1,
      unlockedBadges: DEFAULT_BADGES.map((b) => ({
        ...b,
        isUnlocked: b.id === 'badge-4' || b.id === 'cons-1' || b.id === 'esp-glowup2026',
      })),
    };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_STATS, JSON.stringify(userStats));
  }, [userStats]);

  // Auto-evaluate badges when stats or workouts change
  useEffect(() => {
    setUserStats((prev) => {
      const evaluated = evaluateAllBadges(prev.unlockedBadges, prev);
      const hasChanges = evaluated.some(
        (b, i) => b.isUnlocked !== prev.unlockedBadges[i]?.isUnlocked
      );
      if (hasChanges) {
        return {
          ...prev,
          unlockedBadges: evaluated,
        };
      }
      return prev;
    });
  }, [userStats.totalWorkouts, userStats.totalVolumeLiftedKg, userStats.streak, userStats.consecutiveWeeks]);

  // Multi-Profile State
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved =
      localStorage.getItem('gym_companion_profiles_v3_glowup2026') ||
      localStorage.getItem('gym_companion_profiles_v2.5_glowup2026');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    const savedId = localStorage.getItem('gym_companion_active_profile_id');
    if (savedId) return savedId;
    return 'daniel';
  });

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || INITIAL_PROFILES[0];

  useEffect(() => {
    localStorage.setItem('gym_companion_profiles_v3_glowup2026', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('gym_companion_active_profile_id', activeProfileId);
  }, [activeProfileId]);

  // Individual Exercise Profiles State (Per Profile Data Isolation)
  const [exerciseProfiles, setExerciseProfiles] = useState<Record<string, ExerciseIndividualProfile>>(() => {
    const saved = localStorage.getItem(`gym_companion_exercise_profiles_${activeProfileId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem(`gym_companion_exercise_profiles_${activeProfileId}`, JSON.stringify(exerciseProfiles));
  }, [exerciseProfiles, activeProfileId]);

  const getExerciseProfile = (exercise: Exercise): ExerciseIndividualProfile => {
    if (exerciseProfiles[exercise.id]) {
      return exerciseProfiles[exercise.id];
    }
    return {
      exerciseId: exercise.id,
      profileId: activeProfileId,
      initialWeightKg: exercise.weightKg || 20,
      currentWeightKg: exercise.weightKg || 20,
      lastWeightKg: exercise.previousWeightKg || exercise.weightKg || 20,
      personalRecordKg: exercise.personalRecordKg || exercise.weightKg || 20,
      bestReps: exercise.reps || 10,
      totalVolumeKg: 0,
      sessionCount: 0,
      averageReps: exercise.reps || 10,
      evolutionTrend: exercise.evolutionTrend || 'Dados insuficientes',
      suggestedWeightKg: exercise.suggestedWeightKg || exercise.weightKg || 20,
      suggestedReps: exercise.reps || 10,
      suggestionReason: exercise.suggestionReason || 'Sessão inicial. Estabeleça sua carga confortável de partida.',
      history: [],
    };
  };

  const recordExerciseSessionLog = (
    exercise: Exercise,
    plannedWeightKg: number,
    actualWeightKg: number,
    setsCompleted: number,
    repsPerSet: number[],
    status: IndividualExerciseSessionLog['status'] = 'Concluído'
  ) => {
    const currentExProfile = getExerciseProfile(exercise);
    const totalVol = Math.round(actualWeightKg * repsPerSet.reduce((a, b) => a + b, 0));

    const newLog: IndividualExerciseSessionLog = {
      id: `exlog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toISOString(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      plannedWeightKg,
      actualWeightKg,
      setsCompleted,
      repsPerSet,
      totalVolumeKg: totalVol,
      rpe: exercise.rpe || 8,
      status,
    };

    const updatedHistory = [newLog, ...currentExProfile.history];
    const newPR = Math.max(currentExProfile.personalRecordKg || 0, actualWeightKg);

    const progRec = calculateExerciseProgression(
      { ...currentExProfile, history: updatedHistory, currentWeightKg: actualWeightKg },
      exercise.reps || 10,
      exercise.muscleGroup
    );

    const updatedProfile: ExerciseIndividualProfile = {
      ...currentExProfile,
      currentWeightKg: actualWeightKg,
      lastWeightKg: actualWeightKg,
      personalRecordKg: newPR,
      sessionCount: currentExProfile.sessionCount + 1,
      lastSessionDate: newLog.date,
      totalVolumeKg: currentExProfile.totalVolumeKg + totalVol,
      evolutionTrend: progRec.evolutionTrend,
      suggestedWeightKg: progRec.suggestedWeightKg,
      suggestionReason: progRec.reason,
      history: updatedHistory,
    };

    setExerciseProfiles((prev) => ({
      ...prev,
      [exercise.id]: updatedProfile,
    }));

    // Synchronize exercise object in workouts list
    setWorkouts((prev) => {
      const safeWorkouts = Array.isArray(prev) ? prev : [];
      return safeWorkouts.map((w) => ({
        ...w,
        exercises: (w?.exercises || []).map((ex) => {
          if (ex.id === exercise.id) {
            return {
              ...ex,
              weightKg: actualWeightKg,
              previousWeightKg: actualWeightKg,
              suggestedWeightKg: progRec.suggestedWeightKg,
              suggestionReason: progRec.reason,
              evolutionTrend: progRec.evolutionTrend,
              personalRecordKg: newPR,
              individualProfile: updatedProfile,
            };
          }
          return ex;
        }),
      }));
    });
  };

  const switchProfile = (newProfileId: string) => {
    if (newProfileId === activeProfileId) return;

    // Save current profile exercise profiles
    localStorage.setItem(`gym_companion_exercise_profiles_${activeProfileId}`, JSON.stringify(exerciseProfiles));

    // 1. Save current state into profiles array
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === activeProfileId) {
          return {
            ...p,
            workoutLogs,
            userStats,
            bodyConfig,
            workouts,
          };
        }
        return p;
      })
    );

    // 2. Find target profile and apply its state
    const target = profiles.find((p) => p.id === newProfileId);
    if (target) {
      setActiveProfileId(newProfileId);
      setWorkoutLogs(target.workoutLogs || []);
      setUserStats(target.userStats);
      setBodyConfig(target.bodyConfig);
      setWorkouts(target.workouts || DEFAULT_WORKOUTS);

      // Load target profile exercise profiles
      const savedExProfiles = localStorage.getItem(`gym_companion_exercise_profiles_${newProfileId}`);
      if (savedExProfiles) {
        try {
          setExerciseProfiles(JSON.parse(savedExProfiles));
        } catch (e) {
          setExerciseProfiles({});
        }
      } else {
        setExerciseProfiles({});
      }
    }
  };

  const createProfile = (profileData: Partial<UserProfile>) => {
    const newId = `profile-${Date.now()}`;
    const newProfile: UserProfile = {
      id: newId,
      name: profileData.name || 'Novo Atleta',
      avatarUrl: profileData.avatarUrl || '',
      goal: profileData.goal || 'Hipertrofia',
      isDemo: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      personalData: profileData.personalData || {
        birthDate: '1998-01-01',
        locationCity: 'São Paulo',
        locationState: 'SP',
      },
      bodyConfig: profileData.bodyConfig || {
        weightKg: 75,
        heightCm: 175,
        age: 26,
        gender: 'M',
        goal: 'Hipertrofia',
        experienceLevel: 'Iniciante',
      },
      nutritionConfig: profileData.nutritionConfig || {
        activityFactor: 1.55,
        targetGoal: 'Ganho de Massa',
        proteinGramsPerKg: 2.0,
      },
      workoutPreferences: profileData.workoutPreferences || {
        weeklyDays: 4,
        durationMinutes: 60,
        equipments: ['Barra', 'Halteres', 'Máquinas'],
        primaryGoal: 'Hipertrofia',
      },
      userStats: {
        streak: 0,
        level: 1,
        xp: 0,
        nextLevelXp: 500,
        totalWorkouts: 0,
        totalHoursTrained: 0,
        totalVolumeLiftedKg: 0,
        totalCaloriesBurned: 0,
        consecutiveWeeks: 0,
        unlockedBadges: DEFAULT_BADGES.map((b) => ({ ...b, isUnlocked: false, unlockedAt: undefined })),
      },
      workoutLogs: [],
      workouts: DEFAULT_WORKOUTS,
    };

    setProfiles((prev) => [...prev, newProfile]);
    PersistenceService.saveProfile(newProfile);
    switchProfile(newId);
  };

  const updateProfile = (profileId: string, profileData: Partial<UserProfile>) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          const updated: UserProfile = {
            ...p,
            ...profileData,
            updatedAt: new Date().toISOString(),
            bodyConfig: {
              ...p.bodyConfig,
              ...(profileData.bodyConfig || {}),
            },
            personalData: {
              ...p.personalData,
              ...(profileData.personalData || {}),
            },
            nutritionConfig: {
              ...p.nutritionConfig,
              ...(profileData.nutritionConfig || {}),
            },
            workoutPreferences: {
              ...p.workoutPreferences,
              ...(profileData.workoutPreferences || {}),
            },
          };
          if (profileId === activeProfileId) {
            setBodyConfig(updated.bodyConfig);
          }
          PersistenceService.saveProfile(updated);
          return updated;
        }
        return p;
      })
    );
  };

  const duplicateProfile = (profileId: string) => {
    const source = profiles.find((p) => p.id === profileId);
    if (!source) return;

    const newId = `profile-dup-${Date.now()}`;
    const duplicated: UserProfile = {
      ...source,
      id: newId,
      name: `${source.name} (Cópia)`,
      isDemo: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProfiles((prev) => [...prev, duplicated]);
    PersistenceService.saveProfile(duplicated);
    switchProfile(newId);
  };

  const deleteProfile = (profileId: string) => {
    const target = profiles.find((p) => p.id === profileId);
    if (!target) return;

    if (profiles.length <= 1) {
      // If deleting the last profile, create a fresh clean user profile
      const freshProfileId = `profile-${Date.now()}`;
      const freshProfile: UserProfile = {
        id: freshProfileId,
        name: 'Novo Usuário',
        avatarUrl: '',
        goal: 'Hipertrofia',
        isDemo: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        personalData: {
          birthDate: '1998-01-01',
          locationCity: 'São Paulo',
          locationState: 'SP',
          email: '',
          phone: '',
        },
        bodyConfig: {
          weightKg: 75,
          heightCm: 175,
          age: 25,
          gender: 'M',
          goal: 'Hipertrofia',
          experienceLevel: 'Iniciante',
          bodyFatPercent: 15,
          muscleMassPercent: 40,
        },
        userStats: {
          streak: 0,
          level: 1,
          xp: 0,
          nextLevelXp: 100,
          totalWorkouts: 0,
          totalHoursTrained: 0,
          totalVolumeLiftedKg: 0,
          totalCaloriesBurned: 0,
          consecutiveWeeks: 0,
          unlockedBadges: [],
        },
        workouts: DEFAULT_WORKOUTS,
        workoutLogs: [],
      };

      setProfiles([freshProfile]);
      PersistenceService.deleteProfile(profileId);
      PersistenceService.saveProfile(freshProfile);
      switchProfile(freshProfileId);
      return;
    }

    const remaining = profiles.filter((p) => p.id !== profileId);
    setProfiles(remaining);
    PersistenceService.deleteProfile(profileId);

    if (profileId === activeProfileId) {
      const nextProfile = remaining[0];
      switchProfile(nextProfile.id);
    }
  };

  const resetAllProfilesToDemo = () => {
    setProfiles(INITIAL_PROFILES);
    const main = INITIAL_PROFILES[0];
    setActiveProfileId(main.id);
    setWorkoutLogs(main.workoutLogs || []);
    setUserStats(main.userStats);
    setBodyConfig(main.bodyConfig);
    setWorkouts(main.workouts || DEFAULT_WORKOUTS);
    localStorage.removeItem('gym_companion_profiles_v3_glowup2026');
    localStorage.removeItem('gym_companion_profiles_v2.5_glowup2026');
    localStorage.removeItem('gym_companion_profiles_v2.0');
  };

  const exportProfileBackup = (profileId?: string, format: 'json' | 'csv' = 'json'): string => {
    const targetId = profileId || activeProfileId;
    const target = profiles.find((p) => p.id === targetId) || activeProfile;

    if (format === 'csv') {
      const headers = ['Campo', 'Valor'];
      const rows = [
        ['ID', target.id],
        ['Nome', target.name],
        ['Objetivo', target.goal],
        ['Idade', String(target.bodyConfig.age)],
        ['Peso (kg)', String(target.bodyConfig.weightKg)],
        ['Altura (cm)', String(target.bodyConfig.heightCm)],
        ['Sexo', target.bodyConfig.gender],
        ['Cidade', target.personalData?.locationCity || ''],
        ['Estado', target.personalData?.locationState || ''],
        ['Email', target.personalData?.email || ''],
        ['Telefone', target.personalData?.phone || ''],
        ['Total de Treinos', String(target.userStats.totalWorkouts)],
        ['Volume Total (kg)', String(target.userStats.totalVolumeLiftedKg)],
        ['Calorias Queimadas', String(target.userStats.totalCaloriesBurned)],
        ['Data do Backup', new Date().toISOString()],
      ];
      return [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    }

    return JSON.stringify(target, null, 2);
  };

  const importProfileBackup = (content: string): boolean => {
    try {
      if (content.trim().startsWith('{')) {
        const parsed = JSON.parse(content) as UserProfile;
        if (!parsed.name || !parsed.bodyConfig) return false;

        const newId = parsed.id && !profiles.some((p) => p.id === parsed.id) ? parsed.id : `imported-${Date.now()}`;
        const importedProfile: UserProfile = {
          ...parsed,
          id: newId,
          isDemo: false,
          updatedAt: new Date().toISOString(),
        };

        setProfiles((prev) => [...prev.filter((p) => p.id !== newId), importedProfile]);
        switchProfile(newId);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Optional Workouts State
  const [optionalWorkouts, setOptionalWorkouts] = useState<OptionalWorkoutItem[]>(() => {
    const saved = localStorage.getItem('gym_companion_optional_workouts_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return OPTIONAL_WORKOUTS;
  });

  useEffect(() => {
    localStorage.setItem('gym_companion_optional_workouts_v1', JSON.stringify(optionalWorkouts));
  }, [optionalWorkouts]);

  const updateOptionalWorkout = (updatedItem: OptionalWorkoutItem) => {
    setOptionalWorkouts((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const updateExerciseMedia = (exerciseId: string, media: Partial<Exercise>) => {
    const targetName = media.name ? media.name.trim().toLowerCase() : '';

    const isMatch = (ex: any) => {
      if (!ex) return false;
      if (ex.id === exerciseId) return true;
      if (targetName && ex.name && ex.name.trim().toLowerCase() === targetName) return true;
      return false;
    };

    // 1. Update current workouts list
    setWorkouts((prev) => {
      const safeWorkouts = Array.isArray(prev) ? prev : [];
      const updated = safeWorkouts.map((w) => ({
        ...w,
        exercises: (w?.exercises || []).map((ex) => (isMatch(ex) ? { ...ex, ...media } : ex)),
      }));
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_WORKOUTS, JSON.stringify(updated));
      } catch (e) {
        console.error('Error persisting workouts to localStorage:', e);
      }
      return updated;
    });

    // 2. Update active workout queue if active
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const updatedQueue = (prev.exercisesQueue || []).map((ex) => (isMatch(ex) ? { ...ex, ...media } : ex));
      const updatedActive = {
        ...prev,
        exercisesQueue: updatedQueue,
      };
      try {
        localStorage.setItem('gym_companion_active_workout_v1', JSON.stringify(updatedActive));
      } catch (e) {}
      return updatedActive;
    });

    // 3. Update optional workouts (presets) list
    setOptionalWorkouts((prev) => {
      const safeOptional = Array.isArray(prev) ? prev : [];
      const updated = safeOptional.map((opt) => ({
        ...opt,
        exercises: (opt?.exercises || []).map((ex: any) => (isMatch(ex) ? { ...ex, ...media } : ex)),
      }));
      try {
        localStorage.setItem('gym_companion_optional_workouts_v1', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 4. Update profile workouts state so media & exercise details persist across profiles
    setProfiles((prev) => {
      const safeProfiles = Array.isArray(prev) ? prev : [];
      const updated = safeProfiles.map((p) => {
        if (p.id === activeProfileId) {
          return {
            ...p,
            workouts: (p.workouts || []).map((w) => ({
              ...w,
              exercises: (w?.exercises || []).map((ex) => (isMatch(ex) ? { ...ex, ...media } : ex)),
            })),
          };
        }
        return p;
      });
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_PROFILES, JSON.stringify(updated));
      } catch (e) {
        console.error('Error persisting profiles to localStorage:', e);
      }
      return updated;
    });

    // 5. Update master exercises list & cloud sync
    setMasterExercises((prev) => {
      const safeMaster = Array.isArray(prev) ? prev : [];
      const updatedMasterList = safeMaster.map((mEx) => {
        if (isMatch(mEx)) {
          const newAttachments = [...(mEx.mediaAttachments || [])];
          if (media.gifUrl && !newAttachments.some((a) => a.url === media.gifUrl)) {
            newAttachments.unshift({
              id: `att-motion-${Date.now()}`,
              type: 'motion',
              url: media.gifUrl,
              title: 'Movimento / GIF',
              isPrimary: true,
              order: 1,
            });
          }
          if (media.photoUrl && !newAttachments.some((a) => a.url === media.photoUrl)) {
            newAttachments.push({
              id: `att-photo-${Date.now()}`,
              type: 'machine',
              url: media.photoUrl,
              title: 'Foto do Exercício',
              order: newAttachments.length + 1,
            });
          }
          const updatedMaster: MasterExercise = {
            ...mEx,
            name: media.name || mEx.name,
            muscleGroup: media.muscleGroup || mEx.muscleGroup,
            equipment: media.equipment || mEx.equipment,
            mediaAttachments: media.mediaAttachments || newAttachments,
          };
          PersistenceService.saveMasterExercise(updatedMaster);
          return updatedMaster;
        }
        return mEx;
      });
      return updatedMasterList;
    });

    // 6. Save to custom media localStorage map for permanent offline persistence
    try {
      const existingStr = localStorage.getItem('gym_companion_custom_media');
      const customMediaMap = existingStr ? JSON.parse(existingStr) : {};
      const newEntry = {
        ...(customMediaMap[exerciseId] || {}),
        ...media,
      };
      customMediaMap[exerciseId] = newEntry;
      if (targetName) {
        customMediaMap[targetName] = {
          ...(customMediaMap[targetName] || {}),
          ...media,
        };
      }
      localStorage.setItem('gym_companion_custom_media', JSON.stringify(customMediaMap));
    } catch (e) {
      console.error('Error saving custom exercise media to localStorage:', e);
    }
  };
  const [bodyConfig, setBodyConfig] = useState<UserBodyConfig>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BODY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      weightKg: 77,
      heightCm: 168,
      age: 37,
      gender: 'M',
      goal: 'Perder Gordura & Ganhar Massa',
      experienceLevel: 'Iniciante',
    };
  });

  const updateBodyConfig = (config: UserBodyConfig) => {
    setBodyConfig(config);
    localStorage.setItem(LOCAL_STORAGE_KEY_BODY, JSON.stringify(config));
    PersistenceService.saveUserData(PRIMARY_USER_ID, { bodyConfig: config });
  };

  // 5. Gym QR Code Check-in
  const [gymConfig, setGymConfig] = useState<GymAccessConfig>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_GYM);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      qrCodeDataUrl: DEFAULT_QR_CODE_DATA,
      gymName: 'Minha Academia (Glow Up 2026)',
      autoBrightnessOnScan: true,
      lastEntryDate: '2026-08-01',
      lastEntryTime: '08:30',
      isCheckedIn: true,
    };
  });

  const updateGymQrCode = (dataUrl: string) => {
    setGymConfig((prev) => {
      const updated = { ...prev, qrCodeDataUrl: dataUrl };
      localStorage.setItem(LOCAL_STORAGE_KEY_GYM, JSON.stringify(updated));
      PersistenceService.saveUserData(PRIMARY_USER_ID, { gymConfig: updated });
      return updated;
    });
  };

  const checkInGymWithQrCode = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    setGymConfig((prev) => {
      const updated = {
        ...prev,
        lastEntryDate: dateStr,
        lastEntryTime: timeStr,
        isCheckedIn: true,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_GYM, JSON.stringify(updated));
      PersistenceService.saveUserData(PRIMARY_USER_ID, { gymConfig: updated });
      return updated;
    });

    // Also check unlock badge
    setUserStats((prev) => {
      const badges = prev.unlockedBadges.map((b) =>
        b.id === 'badge-4' ? { ...b, isUnlocked: true, unlockedAt: dateStr } : b
      );
      const updatedStats = { ...prev, unlockedBadges: badges };
      PersistenceService.saveUserData(PRIMARY_USER_ID, { userStats: updatedStats });
      return updatedStats;
    });
  };

  const checkOutGymWithQrCode = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    let durationMins = 75; // default fallback
    if (gymConfig.lastEntryTime) {
      const [inH, inM] = gymConfig.lastEntryTime.split(':').map(Number);
      const [outH, outM] = timeStr.split(':').map(Number);
      if (!isNaN(inH) && !isNaN(outH)) {
        const totalIn = inH * 60 + inM;
        const totalOut = outH * 60 + outM;
        if (totalOut >= totalIn) {
          durationMins = totalOut - totalIn;
        }
      }
    }

    setGymConfig((prev) => {
      const updated = {
        ...prev,
        lastExitDate: dateStr,
        lastExitTime: timeStr,
        lastVisitDurationMinutes: durationMins,
        isCheckedIn: false,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_GYM, JSON.stringify(updated));
      PersistenceService.saveUserData(PRIMARY_USER_ID, { gymConfig: updated });
      return updated;
    });

    // Award +50 XP for completing full gym session checkout
    setUserStats((prev) => {
      const updatedStats = {
        ...prev,
        xp: prev.xp + 50,
      };
      PersistenceService.saveUserData(PRIMARY_USER_ID, { userStats: updatedStats });
      return updatedStats;
    });
  };

  // 7. Today's suggested workout
  // Determine which workout is next in sequence A -> B -> C -> D
  const todayWorkout = React.useMemo(() => {
    if (workouts.length === 0) return DEFAULT_WORKOUTS[0];
    const lastLog = workoutLogs[0];
    if (!lastLog) return workouts[0];
    const index = workouts.findIndex((w) => w.id === lastLog.workoutId || w.code === lastLog.workoutCode);
    const nextIndex = (index + 1) % workouts.length;
    return workouts[nextIndex] || workouts[0];
  }, [workouts, workoutLogs]);

  // 8. Active Workout State & Recovery Engine
  const LOCAL_STORAGE_KEY_ACTIVE_WORKOUT = 'gym_companion_active_workout_recovery_v2';

  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState | null>(null);
  const [hasUnfinishedWorkout, setHasUnfinishedWorkout] = useState<boolean>(false);
  const [unfinishedWorkoutData, setUnfinishedWorkoutData] = useState<ActiveWorkoutState | null>(null);
  const [restFinishedAlert, setRestFinishedAlert] = useState<string | null>(null);
  const [pendingFinishedLog, setPendingFinishedLog] = useState<WorkoutLog | null>(null);

  // Timer reference for active workout elapsed time & rest countdown
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect unfinished workout on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVE_WORKOUT);
    if (saved) {
      try {
        const parsed: ActiveWorkoutState = JSON.parse(saved);
        if (parsed && parsed.workoutId && Array.isArray(parsed.exercisesQueue) && parsed.exercisesQueue.length > 0) {
          setHasUnfinishedWorkout(true);
          setUnfinishedWorkoutData(parsed);
        }
      } catch (e) {
        console.error('Error loading saved active workout', e);
      }
    }
  }, []);

  // Auto-save activeWorkout immediately on any mutation
  useEffect(() => {
    if (activeWorkout) {
      const stateToSave: ActiveWorkoutState = {
        ...activeWorkout,
        lastSavedTimestamp: Date.now(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE_WORKOUT, JSON.stringify(stateToSave));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ACTIVE_WORKOUT);
    }
  }, [activeWorkout]);

  // Absolute timestamp based timer loop
  useEffect(() => {
    if (activeWorkout) {
      timerRef.current = setInterval(() => {
        setActiveWorkout((prev) => {
          if (!prev) return null;

          const now = Date.now();

          // 1. Calculate workout elapsed time using absolute timestamps
          let elapsed = prev.workoutElapsedSeconds;
          if (!prev.isPaused) {
            const runningMs = now - prev.workoutStartTime - (prev.totalPausedMs || 0);
            elapsed = Math.max(0, Math.floor(runningMs / 1000));
          }

          // 2. Calculate rest timer using absolute timestamps
          let nextRestRemaining = prev.restSecondsRemaining;
          let nextRestActive = prev.restTimerActive;

          if (prev.restTimerActive && prev.restStartMs && prev.restDurationMs) {
            const restRemainingMs = prev.restStartMs + prev.restDurationMs - now;
            if (restRemainingMs > 0) {
              nextRestRemaining = Math.ceil(restRemainingMs / 1000);
            } else {
              nextRestActive = false;
              nextRestRemaining = 0;
              if (vibrateEnabled && 'vibrate' in navigator) {
                navigator.vibrate([200, 100, 200, 100, 300]);
              }
              if (soundEnabled) {
                soundGenerator.playTimerBeep();
              }
              setRestFinishedAlert('Descanso finalizado! Próxima série pronta.');
            }
          }

          return {
            ...prev,
            workoutElapsedSeconds: elapsed,
            restSecondsRemaining: nextRestRemaining,
            restTimerActive: nextRestActive,
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeWorkout?.isPaused, activeWorkout?.restTimerActive, vibrateEnabled, soundEnabled]);

  const restoreSavedWorkout = () => {
    if (!unfinishedWorkoutData) return;
    const now = Date.now();

    const currentPauseMs = unfinishedWorkoutData.isPaused && unfinishedWorkoutData.lastPauseStartMs
      ? now - unfinishedWorkoutData.lastPauseStartMs
      : 0;
    const elapsedMs = now - unfinishedWorkoutData.workoutStartTime - (unfinishedWorkoutData.totalPausedMs || 0) - currentPauseMs;
    const workoutElapsedSeconds = Math.max(0, Math.floor(elapsedMs / 1000));

    let restTimerActive = unfinishedWorkoutData.restTimerActive;
    let restSecondsRemaining = 0;
    if (restTimerActive && unfinishedWorkoutData.restStartMs && unfinishedWorkoutData.restDurationMs) {
      const restRemainingMs = unfinishedWorkoutData.restStartMs + unfinishedWorkoutData.restDurationMs - now;
      if (restRemainingMs > 0) {
        restSecondsRemaining = Math.ceil(restRemainingMs / 1000);
      } else {
        restTimerActive = false;
        restSecondsRemaining = 0;
        setRestFinishedAlert('Descanso finalizado enquanto o aplicativo esteve em segundo plano.');
      }
    }

    const restoredState: ActiveWorkoutState = {
      ...unfinishedWorkoutData,
      workoutElapsedSeconds,
      restTimerActive,
      restSecondsRemaining,
      totalPausedMs: (unfinishedWorkoutData.totalPausedMs || 0) + currentPauseMs,
      lastPauseStartMs: unfinishedWorkoutData.isPaused ? now : null,
      pendingQueue: unfinishedWorkoutData.pendingQueue || [],
    };

    setActiveWorkout(restoredState);
    setIsWorkoutModeActive(true);
    setHasUnfinishedWorkout(false);
    setUnfinishedWorkoutData(null);
  };

  const discardSavedWorkout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY_ACTIVE_WORKOUT);
    setHasUnfinishedWorkout(false);
    setUnfinishedWorkoutData(null);
  };

  const dismissRestFinishedAlert = () => {
    setRestFinishedAlert(null);
  };

  const startWorkout = (workoutId: string, isFromQrCode: boolean = false) => {
    const workout = workouts.find((w) => w.id === workoutId);
    if (!workout) return;

    if (isFromQrCode) {
      checkInGymWithQrCode();
    }

    setIsWorkoutModeActive(true);

    const initialQueue = workout.exercises.map((ex) => ({
      ...ex,
      completedSetsCount: 0,
      completedSetsHistory: [],
    }));
    const now = Date.now();
    const firstTotalSets = initialQueue[0]?.targetSets || initialQueue[0]?.sets || 4;

    setActiveWorkout({
      workoutId: workout.id,
      workoutName: workout.name,
      workoutCode: workout.code,
      exercisesQueue: initialQueue,
      currentExerciseIndex: 0,
      currentSetNumber: 1,
      totalSetsForCurrentExercise: firstTotalSets,
      workoutStartTime: now,
      workoutElapsedSeconds: 0,
      totalPausedMs: 0,
      lastPauseStartMs: null,
      isPaused: false,
      restTimerActive: false,
      restStartMs: null,
      restDurationMs: null,
      restSecondsRemaining: 0,
      totalRestSeconds: 90,
      isWorkoutModeActive: true,
      completedExercisesCount: 0,
      accumulatedVolumeKg: 0,
      newPRsThisSession: [],
      skippedOrBusyExercises: [],
      pendingQueue: [],
      isProcessingPendingQueue: false,
      lastSavedTimestamp: now,
    });
  };

  const completeCurrentSet = () => {
    if (!activeWorkout) return;
    const currentEx = activeWorkout.exercisesQueue[activeWorkout.currentExerciseIndex];
    if (!currentEx) return;

    if (vibrateEnabled && 'vibrate' in navigator) {
      navigator.vibrate(80);
    }

    const currentReps = currentEx.reps || 10;
    const setVolume = currentEx.weightKg * currentReps;
    const isPR = isNewPR(currentEx, currentEx.weightKg);

    setActiveWorkout((prev) => {
      if (!prev) return null;
      const nextVolume = prev.accumulatedVolumeKg + setVolume;
      const nextPRs = isPR && !prev.newPRsThisSession.includes(currentEx.name)
        ? [...prev.newPRsThisSession, currentEx.name]
        : prev.newPRsThisSession;

      const restTime = currentEx.defaultRestSeconds || 90;
      const now = Date.now();
      const restDurationMs = restTime * 1000;

      // Update current exercise completed sets count and history in the queue
      const updatedQueue = [...prev.exercisesQueue];
      const exToUpdate = { ...updatedQueue[prev.currentExerciseIndex] };
      const currentCompletedCount = (exToUpdate.completedSetsCount || 0) + 1;
      const newHistoryItem = {
        setNumber: prev.currentSetNumber,
        weightKg: exToUpdate.weightKg,
        reps: currentReps,
        timestamp: now,
      };
      exToUpdate.completedSetsCount = currentCompletedCount;
      exToUpdate.completedSetsHistory = [
        ...(exToUpdate.completedSetsHistory || []),
        newHistoryItem,
      ];
      updatedQueue[prev.currentExerciseIndex] = exToUpdate;

      const totalSets = prev.totalSetsForCurrentExercise || exToUpdate.targetSets || exToUpdate.sets || 4;

      // Check if this was the last set of the exercise
      if (prev.currentSetNumber >= totalSets) {
        const exerciseSummary = {
          name: exToUpdate.name,
          muscleGroup: exToUpdate.muscleGroup,
          weightKg: exToUpdate.weightKg,
          reps: currentReps,
          sets: totalSets,
          volumeKg: Math.round(exToUpdate.weightKg * currentReps * totalSets),
        };

        const nextIndex = prev.currentExerciseIndex + 1;
        if (nextIndex < updatedQueue.length) {
          const nextEx = updatedQueue[nextIndex];
          const nextTotalSets = nextEx?.targetSets || nextEx?.sets || 4;
          return {
            ...prev,
            exercisesQueue: updatedQueue,
            currentExerciseIndex: nextIndex,
            currentSetNumber: 1,
            totalSetsForCurrentExercise: nextTotalSets,
            completedExercisesCount: prev.completedExercisesCount + 1,
            accumulatedVolumeKg: nextVolume,
            newPRsThisSession: nextPRs,
            restTimerActive: true,
            restStartMs: now,
            restDurationMs: restDurationMs,
            restSecondsRemaining: restTime,
            totalRestSeconds: restTime,
            lastCompletedExerciseSummary: exerciseSummary,
            showExerciseTransitionModal: true,
          };
        } else if (prev.pendingQueue && prev.pendingQueue.length > 0) {
          const pendingEx = prev.pendingQueue[0];
          const pendingTotalSets = pendingEx?.targetSets || pendingEx?.sets || 4;
          return {
            ...prev,
            exercisesQueue: prev.pendingQueue,
            pendingQueue: [],
            isProcessingPendingQueue: true,
            currentExerciseIndex: 0,
            currentSetNumber: 1,
            totalSetsForCurrentExercise: pendingTotalSets,
            completedExercisesCount: prev.completedExercisesCount + 1,
            accumulatedVolumeKg: nextVolume,
            newPRsThisSession: nextPRs,
            restTimerActive: true,
            restStartMs: now,
            restDurationMs: restDurationMs,
            restSecondsRemaining: restTime,
            totalRestSeconds: restTime,
            lastCompletedExerciseSummary: exerciseSummary,
            showExerciseTransitionModal: true,
          };
        } else {
          return {
            ...prev,
            exercisesQueue: updatedQueue,
            completedExercisesCount: prev.completedExercisesCount + 1,
            accumulatedVolumeKg: nextVolume,
            newPRsThisSession: nextPRs,
            restTimerActive: true,
            restStartMs: now,
            restDurationMs: restDurationMs,
            restSecondsRemaining: restTime,
            totalRestSeconds: restTime,
            lastCompletedExerciseSummary: exerciseSummary,
            showExerciseTransitionModal: true,
          };
        }
      } else {
        return {
          ...prev,
          exercisesQueue: updatedQueue,
          currentSetNumber: prev.currentSetNumber + 1,
          accumulatedVolumeKg: nextVolume,
          newPRsThisSession: nextPRs,
          restTimerActive: true,
          restStartMs: now,
          restDurationMs: restDurationMs,
          restSecondsRemaining: restTime,
          totalRestSeconds: restTime,
        };
      }
    });
  };

  const adjustCurrentWeight = (deltaKg: number) => {
    if (!activeWorkout) return;
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const queueCopy = [...prev.exercisesQueue];
      const ex = { ...queueCopy[prev.currentExerciseIndex] };
      ex.weightKg = Math.max(0, Number((ex.weightKg + deltaKg).toFixed(1)));
      queueCopy[prev.currentExerciseIndex] = ex;
      return {
        ...prev,
        exercisesQueue: queueCopy,
      };
    });
  };

  const setCurrentWeightDirect = (weightKg: number) => {
    if (!activeWorkout) return;
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const queueCopy = [...prev.exercisesQueue];
      const ex = { ...queueCopy[prev.currentExerciseIndex] };
      ex.weightKg = Math.max(0, weightKg);
      queueCopy[prev.currentExerciseIndex] = ex;
      return {
        ...prev,
        exercisesQueue: queueCopy,
      };
    });
  };

  const applySuggestedWeight = () => {
    if (!activeWorkout) return;
    const currentEx = activeWorkout.exercisesQueue[activeWorkout.currentExerciseIndex];
    if (currentEx && typeof currentEx.suggestedWeightKg === 'number') {
      setCurrentWeightDirect(currentEx.suggestedWeightKg);
    }
  };

  const adjustCurrentReps = (deltaReps: number) => {
    if (!activeWorkout) return;
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const queueCopy = [...prev.exercisesQueue];
      const ex = { ...queueCopy[prev.currentExerciseIndex] };
      const currentReps = ex.reps || 10;
      ex.reps = Math.max(1, currentReps + deltaReps);
      ex.targetReps = `${ex.reps}`;
      queueCopy[prev.currentExerciseIndex] = ex;
      return {
        ...prev,
        exercisesQueue: queueCopy,
      };
    });
  };

  const setCurrentRepsDirect = (reps: number) => {
    if (!activeWorkout) return;
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const queueCopy = [...prev.exercisesQueue];
      const ex = { ...queueCopy[prev.currentExerciseIndex] };
      ex.reps = Math.max(1, reps);
      ex.targetReps = `${ex.reps}`;
      queueCopy[prev.currentExerciseIndex] = ex;
      return {
        ...prev,
        exercisesQueue: queueCopy,
      };
    });
  };

  const markCurrentExerciseBusy = () => {
    if (!activeWorkout) return;
    if (vibrateEnabled && 'vibrate' in navigator) {
      navigator.vibrate([60, 40, 60]);
    }

    setActiveWorkout((prev) => {
      if (!prev) return null;
      const queueCopy = [...prev.exercisesQueue];
      if (queueCopy.length === 0) return prev;

      const currentEx = queueCopy[prev.currentExerciseIndex];
      if (!currentEx) return prev;

      const newPending = [...(prev.pendingQueue || []), currentEx];
      const skippedIds = prev.skippedOrBusyExercises.includes(currentEx.id)
        ? prev.skippedOrBusyExercises
        : [...prev.skippedOrBusyExercises, currentEx.id];

      const nextBusyCount = (prev.busyExercisesCount || 0) + 1;

      if (prev.currentExerciseIndex < queueCopy.length - 1) {
        const nextIndex = prev.currentExerciseIndex + 1;
        const nextEx = queueCopy[nextIndex];
        return {
          ...prev,
          currentExerciseIndex: nextIndex,
          currentSetNumber: 1,
          totalSetsForCurrentExercise: nextEx?.sets || 4,
          skippedOrBusyExercises: skippedIds,
          busyExercisesCount: nextBusyCount,
          pendingQueue: newPending,
        };
      } else if (newPending.length > 0) {
        const pendingEx = newPending[0];
        return {
          ...prev,
          exercisesQueue: newPending,
          pendingQueue: [],
          isProcessingPendingQueue: true,
          currentExerciseIndex: 0,
          currentSetNumber: 1,
          totalSetsForCurrentExercise: pendingEx?.sets || 4,
          skippedOrBusyExercises: skippedIds,
          busyExercisesCount: nextBusyCount,
        };
      } else {
        return {
          ...prev,
          busyExercisesCount: nextBusyCount,
        };
      }
    });
  };

  const previousExercise = () => {
    if (!activeWorkout) return;
    setActiveWorkout((prev) => {
      if (!prev || prev.currentExerciseIndex <= 0) return prev;
      const prevIndex = prev.currentExerciseIndex - 1;
      const prevEx = prev.exercisesQueue[prevIndex];
      return {
        ...prev,
        currentExerciseIndex: prevIndex,
        currentSetNumber: 1,
        totalSetsForCurrentExercise: prevEx?.sets || 4,
      };
    });
  };

  const cancelCurrentExercise = () => {
    if (!activeWorkout) return;
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const queueCopy = [...prev.exercisesQueue];
      queueCopy.splice(prev.currentExerciseIndex, 1);
      const nextCanceledCount = (prev.canceledExercisesCount || 0) + 1;

      if (queueCopy.length === 0) {
        if (prev.pendingQueue && prev.pendingQueue.length > 0) {
          const nextPending = prev.pendingQueue[0];
          return {
            ...prev,
            exercisesQueue: prev.pendingQueue,
            pendingQueue: [],
            isProcessingPendingQueue: true,
            currentExerciseIndex: 0,
            currentSetNumber: 1,
            totalSetsForCurrentExercise: nextPending?.sets || 4,
            canceledExercisesCount: nextCanceledCount,
          };
        } else {
          return {
            ...prev,
            canceledExercisesCount: nextCanceledCount,
          };
        }
      }

      const nextIndex = Math.min(prev.currentExerciseIndex, queueCopy.length - 1);
      const nextEx = queueCopy[nextIndex];
      return {
        ...prev,
        exercisesQueue: queueCopy,
        currentExerciseIndex: nextIndex,
        currentSetNumber: 1,
        totalSetsForCurrentExercise: nextEx?.sets || 4,
        canceledExercisesCount: nextCanceledCount,
      };
    });
  };

  const pauseWorkout = () => {
    if (!activeWorkout || activeWorkout.isPaused) return;
    setActiveWorkout((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isPaused: true,
        lastPauseStartMs: Date.now(),
      };
    });
  };

  const resumeWorkout = () => {
    if (!activeWorkout || !activeWorkout.isPaused) return;
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const now = Date.now();
      const pauseStart = prev.lastPauseStartMs || now;
      const pauseDelta = now - pauseStart;
      return {
        ...prev,
        isPaused: false,
        lastPauseStartMs: null,
        totalPausedMs: (prev.totalPausedMs || 0) + pauseDelta,
      };
    });
  };

  const addRestTime = (seconds: number) => {
    if (!activeWorkout) return;
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const now = Date.now();
      const currentStart = prev.restStartMs || now;
      const currentDuration = prev.restDurationMs || (prev.restSecondsRemaining * 1000);
      const newDuration = Math.max(0, currentDuration + seconds * 1000);
      const remainingMs = currentStart + newDuration - now;
      const remainingSecs = Math.max(0, Math.ceil(remainingMs / 1000));
      return {
        ...prev,
        restStartMs: currentStart,
        restDurationMs: newDuration,
        restSecondsRemaining: remainingSecs,
        totalRestSeconds: Math.max(prev.totalRestSeconds, remainingSecs),
        restTimerActive: remainingSecs > 0,
      };
    });
  };

  const skipRestTime = () => {
    if (!activeWorkout) return;
    setActiveWorkout((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        restSecondsRemaining: 0,
        restTimerActive: false,
        restStartMs: null,
        restDurationMs: null,
      };
    });
  };

  const finishWorkout = () => {
    if (!activeWorkout) return;

    // Record individual exercise progression logs for all exercises in current workout
    activeWorkout.exercisesQueue.forEach((ex, idx) => {
      const setsDone = ex.sets || 4;
      const repsDone = ex.reps || 10;
      const repsArray = Array(setsDone).fill(repsDone);
      const plannedWeight = ex.suggestedWeightKg || ex.weightKg;
      const actualWeight = ex.weightKg;

      recordExerciseSessionLog(
        ex,
        plannedWeight,
        actualWeight,
        setsDone,
        repsArray,
        'Concluído'
      );
    });

    const calories = estimateWorkoutCalories(
      bodyConfig,
      activeWorkout.workoutElapsedSeconds,
      activeWorkout.accumulatedVolumeKg
    );

    const now = new Date();
    const newLog: WorkoutLog = {
      id: `log-${Date.now()}`,
      workoutId: activeWorkout.workoutId,
      workoutName: activeWorkout.workoutName,
      workoutCode: activeWorkout.workoutCode,
      date: now.toISOString().split('T')[0],
      startTime: new Date(activeWorkout.workoutStartTime).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      endTime: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      durationSeconds: activeWorkout.workoutElapsedSeconds,
      caloriesBurned: calories,
      totalVolumeKg: Math.round(activeWorkout.accumulatedVolumeKg),
      exercisesCompletedCount: activeWorkout.completedExercisesCount || activeWorkout.exercisesQueue.length,
      exercisesSkippedCount: activeWorkout.busyExercisesCount || activeWorkout.skippedOrBusyExercises.length,
      exercisesCanceledCount: activeWorkout.canceledExercisesCount || 0,
      status: 'completed',
      newPRsCount: activeWorkout.newPRsThisSession.length,
      rating: 5,
      feedbackTags: [],
    };

    setPendingFinishedLog(newLog);
    localStorage.removeItem(LOCAL_STORAGE_KEY_ACTIVE_WORKOUT);
    setActiveWorkout(null);
    setIsWorkoutModeActive(false);
  };

  const cancelWorkout = () => {
    if (activeWorkout) {
      if (activeWorkout.workoutElapsedSeconds > 10 || activeWorkout.accumulatedVolumeKg > 0) {
        const calories = estimateWorkoutCalories(
          bodyConfig,
          activeWorkout.workoutElapsedSeconds,
          activeWorkout.accumulatedVolumeKg
        );
        const now = new Date();
        const partialLog: WorkoutLog = {
          id: `log-partial-${Date.now()}`,
          workoutId: activeWorkout.workoutId,
          workoutName: `${activeWorkout.workoutName} (Cancelado/Parcial)`,
          workoutCode: activeWorkout.workoutCode,
          date: now.toISOString().split('T')[0],
          startTime: new Date(activeWorkout.workoutStartTime).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          endTime: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          durationSeconds: activeWorkout.workoutElapsedSeconds,
          caloriesBurned: calories,
          totalVolumeKg: Math.round(activeWorkout.accumulatedVolumeKg),
          exercisesCompletedCount: activeWorkout.completedExercisesCount,
          exercisesSkippedCount: activeWorkout.busyExercisesCount || activeWorkout.skippedOrBusyExercises.length,
          exercisesCanceledCount: activeWorkout.canceledExercisesCount || 0,
          isPartial: true,
          status: 'cancelled',
          newPRsCount: activeWorkout.newPRsThisSession.length,
          rating: 3,
          feedbackTags: ['Treino Interrompido/Parcial'],
        };
        setWorkoutLogs((prev) => [partialLog, ...prev]);
      }
      localStorage.removeItem(LOCAL_STORAGE_KEY_ACTIVE_WORKOUT);
    }
    setActiveWorkout(null);
    setIsWorkoutModeActive(false);
  };

  const submitWorkoutRatingAndFeedback = (
    rating: number,
    tags: string[],
    customText?: string,
    showerCompleted?: boolean,
    showerDurationMinutes?: number,
    lowerPerformanceCauses?: string[]
  ) => {
    if (!pendingFinishedLog) return;
    const finalLog: WorkoutLog = {
      ...pendingFinishedLog,
      rating,
      feedbackTags: tags,
      customFeedback: customText,
      showerCompleted,
      showerDurationMinutes,
      lowerPerformanceCauses,
    };

    // 1. Add to logs
    setWorkoutLogs((prev) => [finalLog, ...prev]);
    PersistenceService.saveWorkoutSession(finalLog);

    // 2. Update stats & xp
    setUserStats((prev) => {
      const addedXp = 150 + (finalLog.newPRsCount * 50) + (showerCompleted ? 15 : 0);
      const nextXp = prev.xp + addedXp;
      const nextStreak = prev.streak + 1;
      let nextLevel = prev.level;
      let nextLevelThreshold = prev.nextLevelXp;
      if (nextXp >= nextLevelThreshold) {
        nextLevel += 1;
        nextLevelThreshold += 1000;
      }

      const nextTotalWorkouts = prev.totalWorkouts + 1;
      const nextTotalVolume = prev.totalVolumeLiftedKg + finalLog.totalVolumeKg;

      const updatedStatsObj: UserStats = {
        ...prev,
        streak: nextStreak,
        xp: nextXp,
        level: nextLevel,
        nextLevelXp: nextLevelThreshold,
        totalWorkouts: nextTotalWorkouts,
        totalHoursTrained: Number((prev.totalHoursTrained + finalLog.durationSeconds / 3600).toFixed(1)),
        totalVolumeLiftedKg: nextTotalVolume,
        totalCaloriesBurned: prev.totalCaloriesBurned + finalLog.caloriesBurned,
      };

      const evalRes = BadgeEngine.evaluateBadges(prev.unlockedBadges, {
        stats: updatedStatsObj,
        workoutLogs: [finalLog, ...workoutLogs],
        exerciseProfiles,
        bodyConfig,
        latestLog: finalLog,
      });

      if (evalRes.newlyUnlockedBadges.length > 0) {
        setNewlyUnlockedBadgesModal(evalRes.newlyUnlockedBadges);
      }

      const finalStatsToSave = {
        ...updatedStatsObj,
        unlockedBadges: evalRes.updatedBadges,
      };
      PersistenceService.saveUserData(PRIMARY_USER_ID, { userStats: finalStatsToSave });

      // Sync activeProfile earnedBadges
      const unlockedOnly = evalRes.updatedBadges.filter((b) => b.isUnlocked);
      setProfiles((profilesPrev) =>
        profilesPrev.map((p) =>
          p.id === activeProfileId
            ? {
                ...p,
                earnedBadges: unlockedOnly,
                userStats: finalStatsToSave,
              }
            : p
        )
      );

      return finalStatsToSave;
    });

    // 3. Update workout lastCompletedAt
    setWorkouts((prev) => {
      const nextWorkouts = prev.map((w) =>
        w.id === finalLog.workoutId
          ? {
              ...w,
              lastCompletedAt: finalLog.date,
            }
          : w
      );
      PersistenceService.saveWorkoutPlans(nextWorkouts);
      return nextWorkouts;
    });

    // 4. Trigger AI Coach feedback adaptation
    sendAiCoachMessage(
      customText || `Treino concluído com nota ${rating} estrelas.`,
      tags.length > 0 ? tags.join(', ') : 'Treino concluído'
    );

    setPendingFinishedLog(null);
  };

  const closePostWorkoutModal = () => {
    setPendingFinishedLog(null);
  };

  const evaluateBadgesNow = (log?: WorkoutLog): Badge[] => {
    const evalRes = BadgeEngine.evaluateBadges(userStats.unlockedBadges, {
      stats: userStats,
      workoutLogs,
      exerciseProfiles,
      bodyConfig,
      latestLog: log || workoutLogs[0],
    });

    if (evalRes.newlyUnlockedBadges.length > 0) {
      setNewlyUnlockedBadgesModal(evalRes.newlyUnlockedBadges);
    }

    const updatedStats = {
      ...userStats,
      unlockedBadges: evalRes.updatedBadges,
    };
    setUserStats(updatedStats);
    PersistenceService.saveUserData(PRIMARY_USER_ID, { userStats: updatedStats });

    const unlockedOnly = evalRes.updatedBadges.filter((b) => b.isUnlocked);
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? {
              ...p,
              earnedBadges: unlockedOnly,
              userStats: updatedStats,
            }
          : p
      )
    );

    return evalRes.updatedBadges;
  };

  // Workout CRUD
  const updateWorkout = (updated: Workout) => {
    setWorkouts((prev) => {
      const next = prev.map((w) => (w.id === updated.id ? updated : w));
      PersistenceService.saveWorkoutPlans(next);
      return next;
    });
  };

  const createWorkout = (newWorkout: Workout) => {
    setWorkouts((prev) => {
      const next = [...prev, newWorkout];
      PersistenceService.saveWorkoutPlans(next);
      return next;
    });
  };

  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => {
      const next = prev.filter((w) => w.id !== id);
      PersistenceService.saveWorkoutPlans(next);
      return next;
    });
  };

  const duplicateWorkout = (id: string) => {
    const existing = workouts.find((w) => w.id === id);
    if (!existing) return;
    const duplicated: Workout = {
      ...existing,
      id: `workout-${Date.now()}`,
      name: `${existing.name} (Cópia)`,
      code: existing.code,
    };
    setWorkouts((prev) => {
      const next = [...prev, duplicated];
      PersistenceService.saveWorkoutPlans(next);
      return next;
    });
  };

  const addExerciseToWorkout = (
    workoutId: string,
    exerciseData: Partial<Exercise> & { name: string; muscleGroup: MuscleGroup }
  ) => {
    const targetWorkout = workouts.find((w) => w.id === workoutId);
    if (!targetWorkout) return;

    const newExercise: Exercise = {
      id: exerciseData.id || `ex-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: exerciseData.name,
      muscleGroup: exerciseData.muscleGroup,
      equipment: exerciseData.equipment || 'Máquina / Halter',
      weightKg: exerciseData.weightKg ?? 20,
      previousWeightKg: exerciseData.previousWeightKg ?? exerciseData.weightKg ?? 20,
      suggestedWeightKg: exerciseData.suggestedWeightKg ?? exerciseData.weightKg ?? 20,
      reps: exerciseData.reps ?? (typeof exerciseData.targetReps === 'number' ? (exerciseData.targetReps as unknown as number) : 10),
      targetReps: typeof exerciseData.targetReps === 'string' ? exerciseData.targetReps : `${exerciseData.targetReps || 10} reps`,
      targetSets: exerciseData.targetSets || 3,
      sets: exerciseData.targetSets || 3,
      rpe: exerciseData.rpe ?? 8,
      defaultRestSeconds: exerciseData.defaultRestSeconds ?? 60,
      personalRecordKg: exerciseData.personalRecordKg ?? exerciseData.weightKg ?? 20,
      notes: exerciseData.notes || '',
      history: exerciseData.history || [],
      photoUrl: exerciseData.photoUrl || '',
      gifUrl: exerciseData.gifUrl || '',
      videoUrl: exerciseData.videoUrl || '',
      anatomyUrl: exerciseData.anatomyUrl || '',
      kneeWarning: exerciseData.kneeWarning,
      shoulderWarning: exerciseData.shoulderWarning,
      masterExerciseId: exerciseData.masterExerciseId,
      mediaAttachments: exerciseData.mediaAttachments,
      machineSetup: exerciseData.machineSetup,
      plateTable: exerciseData.plateTable,
      loadUnit: exerciseData.loadUnit || 'kg',
      ...exerciseData,
    };

    const updatedWorkout: Workout = {
      ...targetWorkout,
      exercises: [...(targetWorkout.exercises || []), newExercise],
    };

    updateWorkout(updatedWorkout);

    // If this workout is currently active in session, update activeWorkout queue as well
    setActiveWorkout((prev) => {
      if (!prev || prev.workoutId !== workoutId) return prev;
      const updatedActive = {
        ...prev,
        exercisesQueue: [...prev.exercisesQueue, newExercise],
      };
      try {
        localStorage.setItem('gym_companion_active_workout_v1', JSON.stringify(updatedActive));
      } catch (_) {}
      return updatedActive;
    });
  };

  const deleteWorkoutLog = (id: string) => {
    PersistenceService.deleteWorkoutSession(id);
    setWorkoutLogs((prevLogs) => {
      const remainingLogs = prevLogs.filter((l) => l.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_LOGS, JSON.stringify(remainingLogs));
      } catch (e) {
        console.error('Error persisting remaining logs:', e);
      }

      // Re-calculate userStats based on remaining history
      const newTotalWorkouts = remainingLogs.length;
      const newTotalVolume = remainingLogs.reduce((acc, l) => acc + (l.totalVolumeKg || 0), 0);
      const newTotalHours = Math.round(remainingLogs.reduce((acc, l) => acc + ((l.durationSeconds || 0) / 3600), 0));
      const newTotalCalories = remainingLogs.reduce((acc, l) => acc + (l.caloriesBurned || 0), 0);

      const evalRes = BadgeEngine.evaluateBadges(userStats.unlockedBadges, {
        stats: {
          ...userStats,
          totalWorkouts: newTotalWorkouts,
          totalVolumeLiftedKg: newTotalVolume,
          totalHoursTrained: newTotalHours,
          totalCaloriesBurned: newTotalCalories,
          streak: newTotalWorkouts > 0 ? userStats.streak : 0,
        },
        workoutLogs: remainingLogs,
        exerciseProfiles,
        bodyConfig,
        latestLog: remainingLogs[0],
      });

      const updatedStats: UserStats = {
        ...userStats,
        totalWorkouts: newTotalWorkouts,
        totalVolumeLiftedKg: newTotalVolume,
        totalHoursTrained: newTotalHours,
        totalCaloriesBurned: newTotalCalories,
        streak: newTotalWorkouts > 0 ? userStats.streak : 0,
        unlockedBadges: evalRes.updatedBadges,
      };

      setUserStats(updatedStats);
      PersistenceService.saveUserData(PRIMARY_USER_ID, { userStats: updatedStats });

      // Update current active profile with new logs and stats
      const unlockedOnly = evalRes.updatedBadges.filter((b) => b.isUnlocked);
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === activeProfileId
            ? {
                ...p,
                workoutLogs: remainingLogs,
                earnedBadges: unlockedOnly,
                userStats: updatedStats,
              }
            : p
        )
      );

      return remainingLogs;
    });
  };

  // AI Coach Messages state
  const [aiCoachMessages, setAiCoachMessages] = useState<AICoachMessage[]>([
    {
      id: 'ai-msg-1',
      sender: 'coach',
      text: '💪 Olá! Sou seu AI Coach do Gym Companion v1.0. Analiso seu histórico, cadência, sono e cargas em tempo real para otimizar sua progressão sem lesões. Como está se sentindo hoje?',
      timestamp: '08:30',
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const sendAiCoachMessage = async (messageText: string, feedbackType?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const userMsg: AICoachMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: timeStr,
    };

    setAiCoachMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          feedbackType,
          currentWorkout: activeWorkout ? { name: activeWorkout.workoutName } : null,
          userStats,
          recentFeedback: workoutLogs.slice(0, 3).flatMap((l) => l.feedbackTags),
        }),
      });

      if (!response.ok) {
        throw new Error(`AI Coach API error: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Non-JSON response from AI Coach');
      }

      const data = await response.json();
      const coachMsg: AICoachMessage = {
        id: `msg-c-${Date.now()}`,
        sender: 'coach',
        text: data.reply || 'Ótimo treino! Continue focado na cadência de movimento.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setAiCoachMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.warn('[AI Coach] Request fallback to heuristic message:', err);
      const fallbackMsg: AICoachMessage = {
        id: `msg-c-${Date.now()}`,
        sender: 'coach',
        text: '🔥 Dica Rápida: Lembre-se de manter a hidratação e respeitar os 90 segundos de intervalo entre séries para máxima performance!',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setAiCoachMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Wake Lock API (Tela Sempre Ligada durante treino ativo se habilitado)
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && appSettings.keepScreenOn && activeWorkout) {
        try {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          // Silently ignore if Wake Lock permission policy is disabled in sandbox
        }
      }
    };
    requestWakeLock();
    return () => {
      if (wakeLock && wakeLock.release) {
        wakeLock.release().catch(() => {});
      }
    };
  }, [appSettings.keepScreenOn, activeWorkout]);

  // Import / Export Full Application JSON Backup
  const exportBackupJson = () => {
    const backupObj = {
      version: '3.0.0',
      exportedAt: new Date().toISOString(),
      activeProfileId,
      profiles,
      workouts,
      masterExercises,
      exerciseProfiles,
      workoutLogs,
      userStats,
      bodyConfig,
      gymConfig,
      appSettings,
    };
    return JSON.stringify(backupObj, null, 2);
  };

  const importBackupJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.profiles && Array.isArray(parsed.profiles)) {
        setProfiles(parsed.profiles);
        localStorage.setItem('gym_companion_profiles_v3_glowup2026', JSON.stringify(parsed.profiles));
      }
      if (parsed.activeProfileId) {
        setActiveProfileId(parsed.activeProfileId);
        localStorage.setItem('gym_companion_active_profile_id', parsed.activeProfileId);
      }
      if (parsed.masterExercises) setMasterExercises(parsed.masterExercises);
      if (parsed.exerciseProfiles) setExerciseProfiles(parsed.exerciseProfiles);
      if (parsed.workouts) setWorkouts(parsed.workouts);
      if (parsed.workoutLogs) setWorkoutLogs(parsed.workoutLogs);
      if (parsed.userStats) setUserStats(parsed.userStats);
      if (parsed.bodyConfig) setBodyConfig(parsed.bodyConfig);
      if (parsed.gymConfig) setGymConfig(parsed.gymConfig);
      if (parsed.appSettings) updateAppSettings(parsed.appSettings);
      return true;
    } catch (e) {
      console.error('Falha ao importar backup', e);
      return false;
    }
  };

  const dismissExerciseTransition = () => {
    if (!activeWorkout) return;
    setActiveWorkout((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        showExerciseTransitionModal: false,
      };
    });
  };

  return (
    <GymContext.Provider
      value={{
        theme,
        setTheme,
        isWorkoutModeActive,
        setIsWorkoutModeActive,
        soundEnabled,
        setSoundEnabled,
        vibrateEnabled,
        setVibrateEnabled,
        appSettings,
        updateAppSettings,
        resetApplication,
        masterExercises,
        updateMasterExercise,
        addMasterExercise,
        deleteMasterExercise,
        addMediaAttachment,
        removeMediaAttachment,
        reorderMediaAttachments,
        updateMachineSetup,
        updatePlateTable,
        restoreDefaultPresets,
        applySuggestedWeight,
        workouts,
        setWorkouts,
        updateWorkout,
        createWorkout,
        deleteWorkout,
        duplicateWorkout,
        addExerciseToWorkout,
        todayWorkout,
        activeWorkout,
        startWorkout,
        completeCurrentSet,
        adjustCurrentWeight,
        setCurrentWeightDirect,
        adjustCurrentReps,
        setCurrentRepsDirect,
        markCurrentExerciseBusy,
        previousExercise,
        cancelCurrentExercise,
        pauseWorkout,
        resumeWorkout,
        finishWorkout,
        cancelWorkout,
        dismissExerciseTransition,
        restSecondsRemaining: activeWorkout?.restSecondsRemaining || 0,
        addRestTime,
        skipRestTime,
        restFinishedAlert,
        dismissRestFinishedAlert,
        hasUnfinishedWorkout,
        unfinishedWorkoutData,
        restoreSavedWorkout,
        discardSavedWorkout,
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
        exerciseProfiles,
        getExerciseProfile,
        recordExerciseSessionLog,
        progressionEngine: {
          getProfile: getExerciseProfile,
          recordSessionLog: recordExerciseSessionLog,
          calculateProgression: calculateExerciseProgression,
          calculateTrend: calculateTrend,
          getCoachInsight: getCoachMetricInsight,
        },
        optionalWorkouts,
        updateOptionalWorkout,
        updateExerciseMedia,
        pendingFinishedLog,
        submitWorkoutRatingAndFeedback,
        closePostWorkoutModal,
        gymConfig,
        updateGymQrCode,
        checkInGymWithQrCode,
        checkOutGymWithQrCode,
        userStats,
        bodyConfig,
        updateBodyConfig,
        workoutLogs,
        deleteWorkoutLog,
        syncState,
        forceFullCloudSync,
        aiCoachMessages,
        isAiLoading,
        sendAiCoachMessage,
        badgeEngine: BadgeEngine,
        evaluateBadgesNow,
        newlyUnlockedBadgesModal,
        dismissNewlyUnlockedBadgesModal,
        exportBackupJson,
        importBackupJson,
      }}
    >
      {children}
      <BadgeUnlockedModal
        badges={newlyUnlockedBadgesModal}
        onClose={dismissNewlyUnlockedBadgesModal}
      />
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
