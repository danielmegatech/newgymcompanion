/**
 * PersistenceService — Camada Unificada de Persistência e Sincronização Cloud
 * 
 * Fonte da Verdade: Cloud Firestore (Firebase)
 * Fallback & Cache: LocalStorage (Offline-First)
 * Sincronização: Bidirecional em tempo real com listeners do Firestore
 * Suporte: Multi-usuário, Upload de Imagens (Base64 comprimido), Fim de Sessão,
 *          Fichas de Treino, Biblioteca de Exercícios e Metadados do Sistema.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  MasterExercise,
  Workout,
  WorkoutLog,
  UserProfile,
  UserStats,
  UserBodyConfig,
  AppSettings,
  GymAccessConfig,
  ExerciseIndividualProfile,
  ActiveWorkoutState,
} from '../types';
import { MASTER_EXERCISES } from '../data/masterExercises';
import { DEFAULT_WORKOUTS } from '../data/defaultWorkouts';
import { INITIAL_PROFILES } from '../data/profiles';

// Primary User Identifier
export const PRIMARY_USER_ID = 'daniel';

// Collection Names in Cloud Firestore
const COLLECTIONS = {
  USERS: 'users',
  MASTER_EXERCISES: 'masterExercises',
  WORKOUT_PLANS: 'workoutPlans',
  WORKOUT_SESSIONS: 'workoutSessions',
  EXERCISE_PRESETS: 'exercisePresets',
  ACTIVE_SESSIONS: 'activeSessions',
  SYNC_METADATA: 'syncMetadata',
};

// LocalStorage Keys for offline-first caching
const CACHE_KEYS = {
  MASTER_EXERCISES: 'gym_companion_master_exercises_v3_abcd',
  WORKOUTS: 'gym_companion_workouts_v4_abcd_daniel_2026',
  LOGS: 'gym_companion_logs_v1',
  STATS: 'gym_companion_stats_v1',
  BODY: 'gym_companion_body_v1',
  SETTINGS: 'gym_companion_app_settings_v1',
  GYM: 'gym_companion_gym_v1',
  PROFILES: 'gym_companion_profiles_v4_abcd_daniel_2026',
  ACTIVE_PROFILE_ID: 'gym_companion_active_profile_id',
  ACTIVE_WORKOUT: 'gym_companion_active_workout_v1',
  EXERCISE_PROFILES: `gym_companion_exercise_profiles_${PRIMARY_USER_ID}`,
  LAST_SYNC: 'gym_companion_last_sync_timestamp',
};

export interface SyncState {
  status: 'synced' | 'syncing' | 'error';
  isOnline: boolean;
  lastSyncTime: string | null;
  errorMessage?: string | null;
}

class PersistenceServiceImpl {
  private syncListeners: Set<(state: SyncState) => void> = new Set();
  private state: SyncState = {
    status: 'synced',
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastSyncTime: localStorage.getItem(CACHE_KEYS.LAST_SYNC) || null,
    errorMessage: null,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.updateState({ isOnline: true, status: 'synced', errorMessage: null });
        this.flushPendingSync();
      });
      window.addEventListener('offline', () => {
        this.updateState({ isOnline: false, status: 'error', errorMessage: 'Sem conexão à internet (Modo Offline Ativo)' });
      });
    }
  }

  // Subscribe to sync state updates (for UI indicators)
  public onSyncStateChange(callback: (state: SyncState) => void): () => void {
    this.syncListeners.add(callback);
    callback(this.state);
    return () => {
      this.syncListeners.delete(callback);
    };
  }

  private updateState(partial: Partial<SyncState>) {
    this.state = { ...this.state, ...partial };
    if (partial.lastSyncTime) {
      localStorage.setItem(CACHE_KEYS.LAST_SYNC, partial.lastSyncTime);
    }
    this.syncListeners.forEach((cb) => cb(this.state));
  }

  public getSyncState(): SyncState {
    return this.state;
  }

  // ==========================================
  // 1. MASTER EXERCISES (Banco Global)
  // ==========================================

  public async saveMasterExercise(exercise: MasterExercise): Promise<void> {
    const updatedWithTimestamp = {
      ...exercise,
      updatedAt: new Date().toISOString(),
    };

    // 1. Local Cache immediate update
    try {
      const cached = this.getLocalMasterExercises();
      const index = cached.findIndex((e) => e.id === exercise.id);
      if (index >= 0) {
        cached[index] = updatedWithTimestamp;
      } else {
        cached.push(updatedWithTimestamp);
      }
      localStorage.setItem(CACHE_KEYS.MASTER_EXERCISES, JSON.stringify(cached));
    } catch (e) {
      console.warn('[Cache] Error updating local master exercises', e);
    }

    // 2. Cloud Firestore sync
    try {
      this.updateState({ status: 'syncing', errorMessage: null });
      const docRef = doc(db, COLLECTIONS.MASTER_EXERCISES, exercise.id);
      await setDoc(docRef, JSON.parse(JSON.stringify(updatedWithTimestamp)), { merge: true });
      this.updateState({ status: 'synced', lastSyncTime: new Date().toISOString() });
    } catch (err: any) {
      console.error('[Firestore] Error saving master exercise:', err);
      this.updateState({ status: 'error', errorMessage: err?.message || 'Erro ao sincronizar exercício' });
    }
  }

  public async deleteMasterExercise(exerciseId: string): Promise<void> {
    // 1. Local cache
    try {
      const cached = this.getLocalMasterExercises().filter((e) => e.id !== exerciseId);
      localStorage.setItem(CACHE_KEYS.MASTER_EXERCISES, JSON.stringify(cached));
    } catch (e) {}

    // 2. Cloud
    try {
      this.updateState({ status: 'syncing' });
      const docRef = doc(db, COLLECTIONS.MASTER_EXERCISES, exerciseId);
      await deleteDoc(docRef);
      this.updateState({ status: 'synced', lastSyncTime: new Date().toISOString() });
    } catch (err: any) {
      console.error('[Firestore] Error deleting master exercise:', err);
      this.updateState({ status: 'error', errorMessage: err?.message });
    }
  }

  public getLocalMasterExercises(): MasterExercise[] {
    try {
      const saved = localStorage.getItem(CACHE_KEYS.MASTER_EXERCISES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return MASTER_EXERCISES;
  }

  public subscribeMasterExercises(onUpdate: (exercises: MasterExercise[]) => void): Unsubscribe {
    const colRef = collection(db, COLLECTIONS.MASTER_EXERCISES);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const exercises: MasterExercise[] = [];
          snapshot.forEach((docSnap) => {
            exercises.push(docSnap.data() as MasterExercise);
          });
          // Update cache
          localStorage.setItem(CACHE_KEYS.MASTER_EXERCISES, JSON.stringify(exercises));
          this.updateState({ lastSyncTime: new Date().toISOString(), status: 'synced', errorMessage: null });
          onUpdate(exercises);
        } else {
          // If empty in cloud, seed with defaults
          this.seedInitialMasterExercises();
        }
      },
      (err) => {
        console.warn('[Firestore] Realtime subscription to MasterExercises failed (offline?):', err);
        this.updateState({ status: 'error', errorMessage: 'Modo offline: usando dados locais' });
      }
    );
  }

  public async seedInitialMasterExercises(): Promise<void> {
    try {
      const batch = writeBatch(db);
      for (const ex of MASTER_EXERCISES) {
        const docRef = doc(db, COLLECTIONS.MASTER_EXERCISES, ex.id);
        batch.set(docRef, JSON.parse(JSON.stringify({ ...ex, updatedAt: new Date().toISOString() })), { merge: true });
      }
      await batch.commit();
    } catch (e) {
      console.error('[Firestore] Error seeding MasterExercises', e);
    }
  }

  // ==========================================
  // 2. WORKOUT PLANS (Fichas A, B, C, D)
  // ==========================================

  public async saveWorkoutPlans(workouts: Workout[]): Promise<void> {
    // 1. Local Cache
    try {
      localStorage.setItem(CACHE_KEYS.WORKOUTS, JSON.stringify(workouts));
    } catch (e) {}

    // 2. Firestore Sync
    try {
      this.updateState({ status: 'syncing', errorMessage: null });
      const batch = writeBatch(db);
      for (const w of workouts) {
        const docRef = doc(db, COLLECTIONS.WORKOUT_PLANS, w.id);
        batch.set(docRef, JSON.parse(JSON.stringify({ ...w, updatedAt: new Date().toISOString() })), { merge: true });
      }
      await batch.commit();
      this.updateState({ status: 'synced', lastSyncTime: new Date().toISOString() });
    } catch (err: any) {
      console.error('[Firestore] Error saving workout plans:', err);
      this.updateState({ status: 'error', errorMessage: err?.message || 'Erro ao sincronizar treinos' });
    }
  }

  public getLocalWorkoutPlans(): Workout[] {
    try {
      const saved = localStorage.getItem(CACHE_KEYS.WORKOUTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_WORKOUTS;
  }

  public subscribeWorkoutPlans(onUpdate: (workouts: Workout[]) => void): Unsubscribe {
    const colRef = collection(db, COLLECTIONS.WORKOUT_PLANS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const plans: Workout[] = [];
          snapshot.forEach((docSnap) => {
            plans.push(docSnap.data() as Workout);
          });
          // Sort by code (A, B, C, D)
          plans.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
          localStorage.setItem(CACHE_KEYS.WORKOUTS, JSON.stringify(plans));
          this.updateState({ lastSyncTime: new Date().toISOString(), status: 'synced', errorMessage: null });
          onUpdate(plans);
        } else {
          // Seed default workouts in cloud
          this.saveWorkoutPlans(DEFAULT_WORKOUTS);
        }
      },
      (err) => {
        console.warn('[Firestore] Realtime subscription to WorkoutPlans failed:', err);
      }
    );
  }

  // ==========================================
  // 3. WORKOUT SESSIONS (Histórico de Treinos)
  // ==========================================

  public async saveWorkoutSession(session: WorkoutLog): Promise<void> {
    const sessionWithTimestamp = {
      ...session,
      updatedAt: new Date().toISOString(),
    };

    // 1. Local Cache
    try {
      const logs = this.getLocalWorkoutSessions();
      const filtered = logs.filter((l) => l.id !== session.id);
      filtered.unshift(sessionWithTimestamp);
      localStorage.setItem(CACHE_KEYS.LOGS, JSON.stringify(filtered));
    } catch (e) {}

    // 2. Firestore Sync
    try {
      this.updateState({ status: 'syncing', errorMessage: null });
      const docRef = doc(db, COLLECTIONS.WORKOUT_SESSIONS, session.id);
      await setDoc(docRef, JSON.parse(JSON.stringify(sessionWithTimestamp)), { merge: true });
      this.updateState({ status: 'synced', lastSyncTime: new Date().toISOString() });
    } catch (err: any) {
      console.error('[Firestore] Error saving workout session:', err);
      this.updateState({ status: 'error', errorMessage: err?.message });
    }
  }

  public async deleteWorkoutSession(sessionId: string): Promise<void> {
    // 1. Local
    try {
      const logs = this.getLocalWorkoutSessions().filter((l) => l.id !== sessionId);
      localStorage.setItem(CACHE_KEYS.LOGS, JSON.stringify(logs));
    } catch (e) {}

    // 2. Cloud
    try {
      this.updateState({ status: 'syncing' });
      const docRef = doc(db, COLLECTIONS.WORKOUT_SESSIONS, sessionId);
      await deleteDoc(docRef);
      this.updateState({ status: 'synced', lastSyncTime: new Date().toISOString() });
    } catch (err: any) {
      console.error('[Firestore] Error deleting session:', err);
      this.updateState({ status: 'error' });
    }
  }

  public getLocalWorkoutSessions(): WorkoutLog[] {
    try {
      const saved = localStorage.getItem(CACHE_KEYS.LOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    const defaultProfile = INITIAL_PROFILES.find((p) => p.id === PRIMARY_USER_ID);
    return defaultProfile?.workoutLogs || [];
  }

  public subscribeWorkoutSessions(onUpdate: (sessions: WorkoutLog[]) => void): Unsubscribe {
    const q = query(collection(db, COLLECTIONS.WORKOUT_SESSIONS), orderBy('date', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const logs: WorkoutLog[] = [];
        snapshot.forEach((docSnap) => {
          logs.push(docSnap.data() as WorkoutLog);
        });
        localStorage.setItem(CACHE_KEYS.LOGS, JSON.stringify(logs));
        this.updateState({ lastSyncTime: new Date().toISOString(), status: 'synced', errorMessage: null });
        onUpdate(logs);
      },
      (err) => {
        console.warn('[Firestore] Subscription to WorkoutSessions failed (offline?):', err);
      }
    );
  }

  // ==========================================
  // 4. USER PROFILES (Multi-usuário Bidirecional)
  // ==========================================

  public async saveProfile(profile: UserProfile): Promise<void> {
    const profileWithTime = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };

    // 1. Local Cache
    try {
      const currentProfiles = this.getLocalProfiles();
      const idx = currentProfiles.findIndex((p) => p.id === profile.id);
      if (idx >= 0) {
        currentProfiles[idx] = profileWithTime;
      } else {
        currentProfiles.push(profileWithTime);
      }
      this.saveLocalProfiles(currentProfiles);
    } catch (e) {}

    // 2. Cloud Firestore
    try {
      this.updateState({ status: 'syncing', errorMessage: null });
      const docRef = doc(db, COLLECTIONS.USERS, profile.id);
      await setDoc(docRef, JSON.parse(JSON.stringify(profileWithTime)), { merge: true });
      this.updateState({ status: 'synced', lastSyncTime: new Date().toISOString() });
    } catch (err: any) {
      console.error('[Firestore] Error saving profile:', err);
      this.updateState({ status: 'error', errorMessage: err?.message });
    }
  }

  public async deleteProfile(profileId: string): Promise<void> {
    // 1. Local Cache
    try {
      const remaining = this.getLocalProfiles().filter((p) => p.id !== profileId);
      this.saveLocalProfiles(remaining);
    } catch (e) {}

    // 2. Cloud Firestore
    try {
      this.updateState({ status: 'syncing' });
      const docRef = doc(db, COLLECTIONS.USERS, profileId);
      await deleteDoc(docRef);
      this.updateState({ status: 'synced', lastSyncTime: new Date().toISOString() });
    } catch (err: any) {
      console.error('[Firestore] Error deleting profile in Firestore:', err);
      this.updateState({ status: 'error', errorMessage: err?.message });
    }
  }

  public getLocalProfiles(): UserProfile[] {
    try {
      const saved = localStorage.getItem(CACHE_KEYS.PROFILES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_PROFILES;
  }

  public saveLocalProfiles(profiles: UserProfile[]): void {
    try {
      localStorage.setItem(CACHE_KEYS.PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.warn('[Cache] Could not write profiles to localStorage', e);
    }
  }

  public subscribeProfiles(onUpdate: (profiles: UserProfile[]) => void): Unsubscribe {
    const colRef = collection(db, COLLECTIONS.USERS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudProfiles: UserProfile[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as UserProfile;
            cloudProfiles.push({
              ...data,
              id: docSnap.id,
            });
          });
          this.saveLocalProfiles(cloudProfiles);
          this.updateState({ lastSyncTime: new Date().toISOString(), status: 'synced', errorMessage: null });
          onUpdate(cloudProfiles);
        } else {
          // If no profiles in Cloud Firestore yet, seed initial profiles
          this.seedInitialProfiles();
        }
      },
      (err) => {
        console.warn('[Firestore] Subscription to Users/Profiles failed:', err);
      }
    );
  }

  public async seedInitialProfiles(): Promise<void> {
    try {
      const batch = writeBatch(db);
      for (const p of INITIAL_PROFILES) {
        const docRef = doc(db, COLLECTIONS.USERS, p.id);
        batch.set(docRef, JSON.parse(JSON.stringify({ ...p, updatedAt: new Date().toISOString() })), { merge: true });
      }
      await batch.commit();
    } catch (e) {
      console.error('[Firestore] Error seeding profiles to Firestore', e);
    }
  }

  // Save specific partial user data (body, stats, settings, etc.)
  public async saveUserData(userId: string = PRIMARY_USER_ID, data: {
    profile?: Partial<UserProfile>;
    bodyConfig?: UserBodyConfig;
    userStats?: UserStats;
    appSettings?: AppSettings;
    gymConfig?: GymAccessConfig;
    exerciseProfiles?: Record<string, ExerciseIndividualProfile>;
  }): Promise<void> {
    // 1. Local Cache
    try {
      if (data.bodyConfig) localStorage.setItem(CACHE_KEYS.BODY, JSON.stringify(data.bodyConfig));
      if (data.userStats) localStorage.setItem(CACHE_KEYS.STATS, JSON.stringify(data.userStats));
      if (data.appSettings) localStorage.setItem(CACHE_KEYS.SETTINGS, JSON.stringify(data.appSettings));
      if (data.gymConfig) localStorage.setItem(CACHE_KEYS.GYM, JSON.stringify(data.gymConfig));
      if (data.exerciseProfiles) localStorage.setItem(CACHE_KEYS.EXERCISE_PROFILES, JSON.stringify(data.exerciseProfiles));
    } catch (e) {}

    // 2. Cloud Firestore
    try {
      this.updateState({ status: 'syncing', errorMessage: null });
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const payload: any = {
        ...data,
        id: userId,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, JSON.parse(JSON.stringify(payload)), { merge: true });
      this.updateState({ status: 'synced', lastSyncTime: new Date().toISOString() });
    } catch (err: any) {
      console.error('[Firestore] Error saving user data:', err);
      this.updateState({ status: 'error', errorMessage: err?.message });
    }
  }

  public subscribeUserData(
    userId: string = PRIMARY_USER_ID,
    onUpdate: (data: {
      bodyConfig?: UserBodyConfig;
      userStats?: UserStats;
      appSettings?: AppSettings;
      gymConfig?: GymAccessConfig;
      exerciseProfiles?: Record<string, ExerciseIndividualProfile>;
      profile?: Partial<UserProfile>;
    }) => void
  ): Unsubscribe {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.bodyConfig) localStorage.setItem(CACHE_KEYS.BODY, JSON.stringify(data.bodyConfig));
          if (data.userStats) localStorage.setItem(CACHE_KEYS.STATS, JSON.stringify(data.userStats));
          if (data.appSettings) localStorage.setItem(CACHE_KEYS.SETTINGS, JSON.stringify(data.appSettings));
          if (data.gymConfig) localStorage.setItem(CACHE_KEYS.GYM, JSON.stringify(data.gymConfig));
          if (data.exerciseProfiles) localStorage.setItem(CACHE_KEYS.EXERCISE_PROFILES, JSON.stringify(data.exerciseProfiles));
          
          this.updateState({ lastSyncTime: new Date().toISOString(), status: 'synced', errorMessage: null });
          onUpdate(data as any);
        }
      },
      (err) => {
        console.warn('[Firestore] Realtime subscription to UserData failed:', err);
      }
    );
  }

  // ==========================================
  // 5. ACTIVE WORKOUT SESSION (Live Recovery)
  // ==========================================

  public async saveActiveWorkout(activeWorkout: ActiveWorkoutState | null, userId: string = PRIMARY_USER_ID): Promise<void> {
    try {
      if (activeWorkout) {
        localStorage.setItem(CACHE_KEYS.ACTIVE_WORKOUT, JSON.stringify(activeWorkout));
      } else {
        localStorage.removeItem(CACHE_KEYS.ACTIVE_WORKOUT);
      }
    } catch (e) {}

    try {
      const docRef = doc(db, COLLECTIONS.ACTIVE_SESSIONS, userId);
      if (activeWorkout) {
        await setDoc(docRef, JSON.parse(JSON.stringify({ ...activeWorkout, userId, updatedAt: new Date().toISOString() })));
      } else {
        await deleteDoc(docRef);
      }
    } catch (err) {
      console.warn('[Firestore] Could not sync active workout live state:', err);
    }
  }

  // ==========================================
  // 6. OFFLINE SYNC FLUSH & MANUAL SYNC
  // ==========================================

  public async flushPendingSync(): Promise<void> {
    try {
      this.updateState({ status: 'syncing' });
      const localWorkouts = this.getLocalWorkoutPlans();
      await this.saveWorkoutPlans(localWorkouts);
      const localExercises = this.getLocalMasterExercises();
      for (const ex of localExercises) {
        await this.saveMasterExercise(ex);
      }
      const localProfiles = this.getLocalProfiles();
      for (const p of localProfiles) {
        await this.saveProfile(p);
      }
      this.updateState({ status: 'synced', lastSyncTime: new Date().toISOString() });
    } catch (e) {
      this.updateState({ status: 'error' });
    }
  }

  public async forceFullCloudSync(): Promise<{ success: boolean; message: string }> {
    try {
      this.updateState({ status: 'syncing', errorMessage: null });
      await this.flushPendingSync();
      return { success: true, message: 'Sincronização bidirecional com Cloud Firestore concluída com sucesso!' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Falha ao sincronizar com o Cloud Firestore' };
    }
  }
}

export const PersistenceService = new PersistenceServiceImpl();
