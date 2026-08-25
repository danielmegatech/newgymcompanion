/**
 * Gym Companion v2.0 — Core Architecture & Data Types
 * Single-User Model with Master Exercise Library, Media Attachments,
 * Machine Plate Tables, and Workouts Prescription Architecture.
 */

export type MuscleGroup =
  | 'Peito'
  | 'Costas'
  | 'Ombros'
  | 'Bíceps'
  | 'Tríceps'
  | 'Quadríceps'
  | 'Posterior de Coxa'
  | 'Posterior'
  | 'Glúteos'
  | 'Panturrilha'
  | 'Panturrilhas'
  | 'Abdômen'
  | 'Trapézio'
  | 'Antebraço'
  | 'Cardio'
  | 'Mobilidade'
  | 'Aquecimento'
  | 'Opcionais';

export type MediaType = 'machine' | 'motion' | 'anatomy' | 'setup' | 'video' | 'custom';

export interface MediaAttachment {
  id: string;
  type: MediaType;
  url: string;
  title?: string;
  description?: string;
  source?: string;
  order: number;
  isPrimary?: boolean;
}

export interface MachinePlateEntry {
  position: number;
  kg: number;
  lb?: number;
}

export interface MachineSetup {
  photoUrl?: string;
  brand?: string;
  model?: string;
  seatPosition?: string;
  heightAdjustment?: string;
  pins?: string;
  notes?: string;
}

export interface AppSettings {
  soundEffects: boolean;
  alarmEnabled: boolean;
  vibrationEnabled: boolean;
  keepScreenOn: boolean;
  disableTouchDuringWorkout: boolean;
  weeklyWorkoutGoalDays: number;
  defaultLoadUnit?: 'kg' | 'lb';
  showAlternateLbUnit?: boolean;
}

export type EvolutionTrend = 'Evoluindo' | 'Estável' | 'Em queda' | 'Dados insuficientes';
export type ExerciseDifficultyLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

/**
 * Master Exercise Definition — Exists ONCE in the app's Master Library.
 */
export interface MasterExercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  difficultyLevel?: ExerciseDifficultyLevel;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  aliases?: string[];
  mediaAttachments: MediaAttachment[];
  instructions: string;
  executionTips?: string[];
  commonMistakes?: string[];
  machineSetup?: MachineSetup;
  loadUnit?: 'kg' | 'lb';
  plateTable?: MachinePlateEntry[];
  substituteExerciseIds?: string[];
  defaultRestSeconds?: number;
  defaultSets?: number;
  defaultReps?: number;
  defaultWeightKg?: number;
  
  // Legacy / fallback fields for smooth backward compatibility
  photoUrl?: string;
  gifUrl?: string;
  videoUrl?: string;
  anatomyUrl?: string;
  muscleIllustrationUrl?: string;
  adjustmentPhotoUrl?: string;
  adjustmentPhotoUrl2?: string;
  adjustment?: string;
  bench?: string;
  description?: string;
  safetyNotes?: string;
  kneeWarning?: boolean;
  shoulderWarning?: boolean;
}

export interface IndividualExerciseSessionLog {
  id: string;
  date: string; // ISO format
  exerciseId: string;
  exerciseName: string;
  plannedWeightKg: number;
  actualWeightKg: number;
  setsCompleted: number;
  repsPerSet: number[];
  totalVolumeKg: number;
  rpe?: number;
  notes?: string;
  status: 'Concluído' | 'Parcial' | 'Cancelado' | 'Desistiu' | 'Máquina Ocupada';
}

export interface ExerciseIndividualProfile {
  profileId?: string;
  exerciseId: string;
  initialWeightKg: number;
  currentWeightKg: number;
  lastWeightKg: number;
  personalRecordKg: number;
  bestReps: number;
  totalVolumeKg: number;
  sessionCount: number;
  lastSessionDate?: string;
  averageReps: number;
  averageRPE?: number;
  evolutionTrend: EvolutionTrend;
  suggestedWeightKg: number;
  suggestedReps: number;
  suggestionReason: string;
  history: IndividualExerciseSessionLog[];
  personalNotes?: string;
}

export interface ProfileBackupRecord {
  id?: string;
  timestamp?: string;
  profileName?: string;
  profileId?: string;
  format?: 'json' | 'csv' | 'txt' | string;
  fileSizeKb?: number;
  data?: string;
  profile?: UserProfile;
  exportedAt?: string;
  version?: string;
}

export interface ExerciseLog {
  date: string;
  weightKg: number;
  reps: number;
  setsCompleted: number;
  rpe?: number;
}

/**
 * Workout Exercise Prescription — References the Master Exercise by masterExerciseId.
 */
export interface Exercise {
  id: string;
  masterExerciseId?: string; // Reference to MasterExercise.id
  name: string;
  muscleGroup: MuscleGroup;
  equipment: string;
  mediaAttachments?: MediaAttachment[];
  machineSetup?: MachineSetup;
  loadUnit?: 'kg' | 'lb';
  plateTable?: MachinePlateEntry[];

  // Workout specific prescription
  weightKg: number;
  previousWeightKg: number;
  suggestedWeightKg: number;
  suggestionReason?: string;
  evolutionTrend?: EvolutionTrend;
  reps: number;
  sets?: number;
  targetReps?: string;
  targetSets?: number;
  completedSetsCount?: number;
  completedSetsHistory?: {
    setNumber: number;
    weightKg: number;
    reps: number;
    timestamp: number;
  }[];
  isTimedCardio?: boolean;
  targetDurationSeconds?: number;
  rpe: number;
  defaultRestSeconds: number;
  isSuperSetWithId?: string;
  isDropSet?: boolean;
  notes?: string;
  history: ExerciseLog[];
  individualHistory?: IndividualExerciseSessionLog[];
  performanceHistory?: IndividualExerciseSessionLog[];
  personalRecordKg: number;

  // Visual/Legacy fallback properties
  photoUrl?: string;
  gifUrl?: string;
  videoUrl?: string;
  anatomyUrl?: string;
  muscleIllustrationUrl?: string;
  adjustmentPhotoUrl?: string;
  adjustmentPhotoUrl2?: string;
  machine?: string;
  grip?: string;
  adjustment?: string;
  bench?: string;
  masterData?: MasterExercise;
  individualProfile?: ExerciseIndividualProfile;
}

export interface Workout {
  id: string;
  code: 'A' | 'B' | 'C' | 'D' | string;
  name: string;
  subtitle: string;
  color: string; // Tailwind color token or hex
  description: string;
  exercises: Exercise[];
  isFavorite?: boolean;
  lastCompletedAt?: string; // ISO date
  estimatedDurationMinutes: number;
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  workoutName: string;
  workoutCode: string;
  date: string; // ISO format
  startTime: string;
  endTime: string;
  durationSeconds: number;
  caloriesBurned: number;
  totalVolumeKg: number;
  exercisesCompletedCount: number;
  exercisesSkippedCount?: number;
  exercisesCanceledCount?: number;
  isPartial?: boolean;
  status?: 'completed' | 'cancelled' | 'partial';
  newPRsCount: number;
  rating: number; // 1 to 5 stars
  feedbackTags: string[];
  customFeedback?: string;
  lowerPerformanceCauses?: string[];
  showerCompleted?: boolean;
  showerDurationMinutes?: number;
  checkoutCompleted?: boolean;
}

export interface UserStats {
  streak: number; // Consecutive training days
  level: number;
  xp: number;
  nextLevelXp: number;
  totalWorkouts: number;
  totalHoursTrained: number;
  totalVolumeLiftedKg: number;
  totalCaloriesBurned: number;
  consecutiveWeeks: number;
  unlockedBadges: Badge[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  category:
    | 'consistência'
    | 'progressão'
    | 'volume'
    | 'desempenho'
    | 'disciplina'
    | 'força'
    | 'grupos'
    | 'técnica'
    | 'ritmo'
    | 'exercícios'
    | 'desafio'
    | 'milestones'
    | 'intensidade'
    | 'especial';
}

export interface BodyMeasurementRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFatPercent?: number;
  muscleMassPercent?: number;
  chestCm?: number;
  waistCm?: number;
  hipCm?: number;
  armCm?: number;
  thighCm?: number;
  calfCm?: number;
  notes?: string;
}

export interface UserBodyCircumferences {
  chestCm?: number;
  waistCm?: number;
  hipCm?: number;
  armCm?: number;
  thighCm?: number;
  calfCm?: number;
}

export interface UserBodyConfig {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'M' | 'F' | 'Outro';
  goal: 'Hipertrofia' | 'Força' | 'Perda de Gordura' | 'Resistência' | 'Estética';
  experienceLevel: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Expert';
  bodyFatPercent?: number;
  muscleMassPercent?: number;
  muscleMassKg?: number;
  boneMassKg?: number;
  bodyWaterPercent?: number;
  circumferences?: UserBodyCircumferences;
  measurementHistory?: BodyMeasurementRecord[];
}

export interface UserPersonalData {
  birthDate?: string; // YYYY-MM-DD
  locationCity?: string;
  locationState?: string;
  email?: string;
  phone?: string;
}

export interface UserNutritionConfig {
  activityFactor: number; // 1.2 | 1.375 | 1.55 | 1.725 | 1.9
  targetGoal: 'Perda de Gordura' | 'Manutenção' | 'Ganho de Massa';
  proteinGramsPerKg?: number;
  fatPercentOfCalories?: number;
  customCalorieOffset?: number;
  customProteinGrams?: number;
  customCarbsGrams?: number;
  customFatGrams?: number;
  customFiberGrams?: number;
  customWaterLiters?: number;
}

export interface UserWorkoutPreferences {
  weeklyDays: number;
  durationMinutes: number;
  equipments: string[];
  primaryGoal: 'Hipertrofia' | 'Perda de Gordura' | 'Força' | 'Resistência' | 'Estética';
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  goal: string;
  isDemo?: boolean;
  createdAt?: string;
  updatedAt?: string;
  personalData?: UserPersonalData;
  bodyConfig: UserBodyConfig;
  nutritionConfig?: UserNutritionConfig;
  workoutPreferences?: UserWorkoutPreferences;
  userStats: UserStats;
  earnedBadges?: Badge[];
  workoutLogs: WorkoutLog[];
  workouts: Workout[];
}

export interface GymAccessConfig {
  qrCodeDataUrl?: string;
  gymName: string;
  autoBrightnessOnScan?: boolean;
  lastEntryDate?: string;
  lastEntryTime?: string;
  lastExitDate?: string;
  lastExitTime?: string;
  lastVisitDurationMinutes?: number;
  isCheckedIn: boolean;
}

export type AppThemeMode = 'dark' | 'oled' | 'light';

export interface ActiveWorkoutState {
  workoutId: string;
  workoutName: string;
  workoutCode: string;
  exercisesQueue: Exercise[];
  currentExerciseIndex: number;
  currentSetNumber: number;
  totalSetsForCurrentExercise: number;

  // Absolute timestamps for robust recovery and screen lock handling
  workoutStartTime: number; // timestamp ms (Date.now())
  workoutElapsedSeconds: number;
  totalPausedMs: number; // Total duration in ms spent paused
  lastPauseStartMs: number | null; // Date.now() when pause started, null if running
  isPaused: boolean;

  // Rest Timer Absolute Timestamps
  restTimerActive: boolean;
  restStartMs: number | null; // Date.now() when rest started
  restDurationMs: number | null; // Rest duration in ms
  restSecondsRemaining: number;
  totalRestSeconds: number;

  isWorkoutModeActive: boolean; // Modo Academia
  completedExercisesCount: number;
  canceledExercisesCount?: number;
  busyExercisesCount?: number;
  accumulatedVolumeKg: number;
  newPRsThisSession: string[]; // exercise names
  skippedOrBusyExercises: string[]; // ids of exercises postponed
  pendingQueue: Exercise[]; // Queue of skipped / pending exercises to perform after main list
  isProcessingPendingQueue?: boolean; // whether currently doing the pending queue
  lastSavedTimestamp?: number; // timestamp when auto-saved
  lastCompletedExerciseSummary?: {
    name: string;
    muscleGroup: MuscleGroup;
    weightKg: number;
    reps: number;
    sets: number;
    volumeKg: number;
  } | null;
  showExerciseTransitionModal?: boolean;
}

export interface AICoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  actionSuggestion?: {
    type: 'weight_adjust' | 'exercise_swap' | 'rest_adjust' | 'schedule_change';
    label: string;
    value: string;
  };
}
