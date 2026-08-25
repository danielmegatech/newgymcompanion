/**
 * Gym Companion — BadgeEngine
 * Evaluates user performance data from the ProgressionEngine, workout logs, user stats,
 * exercise individual profiles, and body configuration against predefined badge criteria.
 */

import {
  Badge,
  UserStats,
  WorkoutLog,
  ExerciseIndividualProfile,
  UserBodyConfig,
  UserProfile,
} from '../types';
import { DEFAULT_BADGES } from '../data/defaultWorkouts';

export interface BadgeEvaluationContext {
  stats: UserStats;
  workoutLogs: WorkoutLog[];
  exerciseProfiles?: Record<string, ExerciseIndividualProfile>;
  bodyConfig?: UserBodyConfig;
  userProfile?: UserProfile;
  latestLog?: WorkoutLog;
}

export interface BadgeEvaluationResult {
  updatedBadges: Badge[];
  newlyUnlockedBadges: Badge[];
  unlockedCount: number;
  totalCount: number;
  unlockedPercentage: number;
}

export class BadgeEngine {
  /**
   * Evaluates all badges for a given user context and returns the updated badge list
   * along with any newly unlocked badges in this evaluation run.
   */
  public static evaluateBadges(
    currentBadges: Badge[] = DEFAULT_BADGES,
    context: BadgeEvaluationContext
  ): BadgeEvaluationResult {
    const {
      stats,
      workoutLogs = [],
      exerciseProfiles = {},
      bodyConfig,
      latestLog,
    } = context;

    const safeBadges = currentBadges && currentBadges.length > 0 ? currentBadges : DEFAULT_BADGES;
    const safeStats = stats || { totalWorkouts: 0, streak: 0, totalVolumeLiftedKg: 0, consecutiveWeeks: 0, xp: 0, level: 1, nextLevelXp: 1000, totalHoursTrained: 0, totalCaloriesBurned: 0, unlockedBadges: [] };
    const safeLogs = workoutLogs || [];
    const safeProfiles = exerciseProfiles || {};

    // If user has zero workout history / 0 workouts completed, badges MUST BE strictly zerados (locked)
    const hasHistory = (safeStats.totalWorkouts || 0) > 0 || safeLogs.length > 0;
    if (!hasHistory) {
      const zeradoBadges = safeBadges.map((b) => ({
        ...b,
        isUnlocked: false,
        unlockedAt: undefined,
      }));
      return {
        updatedBadges: zeradoBadges,
        newlyUnlockedBadges: [],
        unlockedCount: 0,
        totalCount: zeradoBadges.length,
        unlockedPercentage: 0,
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const existingBadgesMap = new Map<string, Badge>();

    // Seed map with current badges or fallback defaults
    safeBadges.forEach((b) => existingBadgesMap.set(b.id, { ...b }));

    // Ensure any missing default badges are included
    DEFAULT_BADGES.forEach((defaultBadge) => {
      if (!existingBadgesMap.has(defaultBadge.id)) {
        existingBadgesMap.set(defaultBadge.id, { ...defaultBadge });
      }
    });

    const allBadgesList = Array.from(existingBadgesMap.values());
    const newlyUnlockedBadges: Badge[] = [];

    // Helper metrics calculation
    const totalWorkouts = Math.max(safeStats.totalWorkouts || 0, safeLogs.length);
    const totalVolume = Math.max(safeStats.totalVolumeLiftedKg || 0, safeLogs.reduce((acc, l) => acc + (l.totalVolumeKg || 0), 0));
    const streak = safeStats.streak || 0;
    const consecutiveWeeks = safeStats.consecutiveWeeks || Math.max(0, Math.floor(totalWorkouts / 3));

    // Sort logs chronologically to bind exact dates to badges
    const chronoLogs = [...safeLogs].sort(
      (a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
    );

    const getDateForNthWorkout = (n: number): string => {
      if (chronoLogs.length >= n && chronoLogs[n - 1]?.date) {
        return chronoLogs[n - 1].date.split('T')[0];
      }
      return chronoLogs[chronoLogs.length - 1]?.date
        ? chronoLogs[chronoLogs.length - 1].date.split('T')[0]
        : todayStr;
    };

    // Calculate PR metrics across exercise profiles
    const profilesList = Object.values(safeProfiles);
    let totalPRsCount = 0;
    let maxWeightBench = 0;
    let maxWeightSquat = 0;
    let maxWeightDeadlift = 0;
    let maxWeightLegPress = 0;
    let maxWeightBiceps = 0;
    let maxWeightOverhead = 0;
    let maxWeightOverall = 0;

    profilesList.forEach((prof) => {
      const pr = prof.personalRecordKg || prof.currentWeightKg || 0;
      if (pr > 0) totalPRsCount += 1;
      if (pr > maxWeightOverall) maxWeightOverall = pr;

      const nameLower = (prof.exerciseId || '').toLowerCase();
      // Match exercise categories by ID or name
      if (nameLower.includes('supino')) {
        if (pr > maxWeightBench) maxWeightBench = pr;
      }
      if (nameLower.includes('agachamento') || nameLower.includes('squat')) {
        if (pr > maxWeightSquat) maxWeightSquat = pr;
      }
      if (nameLower.includes('terra') || nameLower.includes('deadlift')) {
        if (pr > maxWeightDeadlift) maxWeightDeadlift = pr;
      }
      if (nameLower.includes('legpress') || nameLower.includes('leg press')) {
        if (pr > maxWeightLegPress) maxWeightLegPress = pr;
      }
      if (nameLower.includes('rosca') || nameLower.includes('biceps') || nameLower.includes('bíceps')) {
        if (pr > maxWeightBiceps) maxWeightBiceps = pr;
      }
      if (nameLower.includes('desenvolvimento') || nameLower.includes('ohp') || nameLower.includes('ombro')) {
        if (pr > maxWeightOverhead) maxWeightOverhead = pr;
      }
    });

    // Also count PRs from workout logs
    const prsFromLogs = safeLogs.reduce((acc, l) => acc + (l.newPRsCount || 0), 0);
    const combinedPRsCount = Math.max(totalPRsCount, prsFromLogs);

    const userWeight = bodyConfig?.weightKg || 75;

    // Check weekend / morning / night workout conditions in logs
    let hasMorningWorkout = false;
    let hasNightWorkout = false;
    let hasWeekendWorkout = false;
    let hasSingleSession15k = false;
    let maxSingleSessionVolume = 0;
    let has3PRsInSingleSession = false;

    safeLogs.forEach((log) => {
      if ((log.totalVolumeKg || 0) > maxSingleSessionVolume) {
        maxSingleSessionVolume = log.totalVolumeKg || 0;
      }
      if ((log.totalVolumeKg || 0) >= 15000) {
        hasSingleSession15k = true;
      }
      if ((log.newPRsCount || 0) >= 3) {
        has3PRsInSingleSession = true;
      }

      if (log.startTime) {
        const [h] = log.startTime.split(':').map(Number);
        if (!isNaN(h)) {
          if (h < 8) hasMorningWorkout = true;
          if (h >= 20) hasNightWorkout = true;
        }
      }

      if (log.date) {
        const logDate = new Date(log.date);
        const dayOfWeek = logDate.getDay(); // 0 is Sunday, 6 is Saturday
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          hasWeekendWorkout = true;
        }
      }
    });

    // Evaluate each badge against current valid logs
    const updatedBadges = allBadgesList.map((badge) => {
      let shouldUnlock = false;
      let calculatedUnlockDate: string | undefined = undefined;

      switch (badge.id) {
        // CONSISTÊNCIA
        case 'cons-1':
          shouldUnlock = totalWorkouts >= 1;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'cons-3':
          shouldUnlock = totalWorkouts >= 3;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(3);
          break;
        case 'cons-7':
          shouldUnlock = totalWorkouts >= 7;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(7);
          break;
        case 'cons-10':
          shouldUnlock = totalWorkouts >= 10;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(10);
          break;
        case 'cons-15':
          shouldUnlock = totalWorkouts >= 15;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(15);
          break;
        case 'cons-25':
          shouldUnlock = totalWorkouts >= 25;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(25);
          break;
        case 'cons-50':
          shouldUnlock = totalWorkouts >= 50;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(50);
          break;
        case 'cons-100':
          shouldUnlock = totalWorkouts >= 100;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(100);
          break;
        case 'cons-200':
          shouldUnlock = totalWorkouts >= 200;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(200);
          break;

        // PROGRESSÃO
        case 'prog-1':
          shouldUnlock = combinedPRsCount >= 1 || (latestLog?.newPRsCount || 0) >= 1 || totalWorkouts >= 1;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'prog-pr1':
          shouldUnlock = combinedPRsCount >= 1 || (latestLog?.newPRsCount || 0) >= 1;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'prog-pr5':
          shouldUnlock = combinedPRsCount >= 5 || totalWorkouts >= 4;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(4);
          break;
        case 'prog-pr10':
          shouldUnlock = combinedPRsCount >= 10 || totalWorkouts >= 8;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(8);
          break;
        case 'prog-pr25':
          shouldUnlock = combinedPRsCount >= 25 || totalWorkouts >= 15;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(15);
          break;
        case 'prog-pr50':
          shouldUnlock = combinedPRsCount >= 50 || totalWorkouts >= 30;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(30);
          break;
        case 'prog-double':
          shouldUnlock = (latestLog?.newPRsCount || 0) >= 2 || safeLogs.some((l) => (l.newPRsCount || 0) >= 2);
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'prog-master':
          shouldUnlock = consecutiveWeeks >= 4 || totalWorkouts >= 12;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(12);
          break;
        case 'prog-escalada':
          shouldUnlock = combinedPRsCount >= 5 || totalWorkouts >= 5;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(5);
          break;
        case 'prog-ouro':
          shouldUnlock = combinedPRsCount >= 10 || totalWorkouts >= 10;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(10);
          break;
        case 'prog-dupla':
          shouldUnlock = combinedPRsCount >= 1 || totalWorkouts >= 2;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(2);
          break;
        case 'prog-recup':
          shouldUnlock = totalWorkouts >= 2;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(2);
          break;
        case 'prog-extrema':
          shouldUnlock = totalWorkouts >= 3;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(3);
          break;

        // VOLUME
        case 'vol-1k':
          shouldUnlock = totalVolume >= 1000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'vol-5k':
          shouldUnlock = totalVolume >= 5000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(2);
          break;
        case 'vol-10k':
          shouldUnlock = totalVolume >= 10000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(3);
          break;
        case 'vol-50k':
          shouldUnlock = totalVolume >= 50000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(10);
          break;
        case 'vol-100k':
          shouldUnlock = totalVolume >= 100000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(20);
          break;
        case 'vol-250k':
          shouldUnlock = totalVolume >= 250000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(40);
          break;
        case 'vol-500k':
          shouldUnlock = totalVolume >= 500000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(80);
          break;
        case 'vol-daily15k':
          shouldUnlock = hasSingleSession15k || maxSingleSessionVolume >= 15000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;

        // DESEMPENHO
        case 'des-1':
        case 'des-complete':
        case 'des-sets':
          shouldUnlock = totalWorkouts >= 1;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'des-vol':
          shouldUnlock = maxSingleSessionVolume >= 3000 || totalVolume >= 3000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'des-time':
          shouldUnlock = totalWorkouts >= 1;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'des-pump':
          shouldUnlock = (latestLog?.rating || 0) >= 4 || totalWorkouts >= 1;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'des-fast':
          shouldUnlock = totalWorkouts >= 2;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(2);
          break;
        case 'des-beast':
          shouldUnlock = totalWorkouts >= 2;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(2);
          break;

        // DISCIPLINA
        case 'disc-weeks':
          shouldUnlock = totalWorkouts >= 1;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'disc-plan':
          shouldUnlock = totalWorkouts >= 2;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(2);
          break;
        case 'disc-resume':
          shouldUnlock = totalWorkouts >= 1;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'disc-morning':
          shouldUnlock = hasMorningWorkout || totalWorkouts >= 2;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'disc-night':
          shouldUnlock = hasNightWorkout || totalWorkouts >= 2;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'disc-rain':
          shouldUnlock = totalWorkouts >= 1;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'disc-weekend':
          shouldUnlock = hasWeekendWorkout || totalWorkouts >= 2;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;

        // FORÇA ESPECÍFICA
        case 'forca-100bench':
          shouldUnlock = maxWeightBench >= 100 || totalVolume >= 15000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-bp80':
          shouldUnlock = maxWeightBench >= 80 || totalVolume >= 8000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-bp120':
          shouldUnlock = maxWeightBench >= 120 || totalVolume >= 30000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-bp150':
          shouldUnlock = maxWeightBench >= 150 || totalVolume >= 50000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-200leg':
          shouldUnlock = maxWeightLegPress >= 200 || totalVolume >= 10000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-sq100':
          shouldUnlock = maxWeightSquat >= 100 || totalVolume >= 12000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-sq150':
          shouldUnlock = maxWeightSquat >= 150 || totalVolume >= 30000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-sq200':
          shouldUnlock = maxWeightSquat >= 200 || totalVolume >= 60000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-dl150':
          shouldUnlock = maxWeightDeadlift >= 150 || totalVolume >= 20000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-dl250':
          shouldUnlock = maxWeightDeadlift >= 250 || totalVolume >= 50000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-dl300':
          shouldUnlock = maxWeightDeadlift >= 300 || totalVolume >= 100000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-bc50':
          shouldUnlock = maxWeightBiceps >= 50 || totalVolume >= 10000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-bc70':
          shouldUnlock = maxWeightBiceps >= 70 || totalVolume >= 25000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-ohp60':
          shouldUnlock = maxWeightOverhead >= 60 || totalVolume >= 12000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-ohp100':
          shouldUnlock = maxWeightOverhead >= 100 || totalVolume >= 40000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'forca-bodyweight':
          shouldUnlock = maxWeightOverall >= userWeight * 1.8 || totalVolume >= 5000;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;

        // GRUPOS MUSCULARES
        case 'grp-peito':
        case 'grp-costas':
        case 'grp-pernas':
        case 'grp-ombros':
        case 'grp-bracos':
        case 'grp-core':
          shouldUnlock = totalWorkouts >= 2;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(2);
          break;

        // VARIAÇÃO E TÉCNICA
        case 'tec-flex':
        case 'tec-var':
        case 'tec-drop':
        case 'tec-super':
        case 'tec-tri':
        case 'tec-piram':
          shouldUnlock = totalWorkouts >= 2;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(2);
          break;

        // RITMO E CADÊNCIA
        case 'rit-exp':
        case 'rit-ctrl':
        case 'rit-tst':
          shouldUnlock = totalWorkouts >= 1;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'rit-sprint':
          shouldUnlock = totalWorkouts >= 1;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'rit-marathon':
          shouldUnlock = totalWorkouts >= 5;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(5);
          break;

        // EXERCÍCIOS ESPECÍFICOS
        case 'ex-agachador':
        case 'ex-rosca':
        case 'ex-puxador':
        case 'ex-supino':
        case 'ex-legpress':
        case 'ex-inversa':
          shouldUnlock = totalWorkouts >= 2;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(2);
          break;

        // DESAFIO E GAMIFICAÇÃO
        case 'des-5desafios':
          shouldUnlock = totalWorkouts >= 5;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(5);
          break;
        case 'des-20desafios':
          shouldUnlock = totalWorkouts >= 20;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(20);
          break;
        case 'des-semfalhas':
          shouldUnlock = totalWorkouts >= 3;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(3);
          break;
        case 'des-triplepr':
          shouldUnlock = has3PRsInSingleSession || (latestLog?.newPRsCount || 0) >= 3 || combinedPRsCount >= 3;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;
        case 'des-perfeito':
          shouldUnlock = (latestLog?.rating || 0) === 5 || totalWorkouts >= 1;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;

        // COMUNIDADE E MILESTONES
        case 'com-influencer':
        case 'com-mentor':
        case 'com-veterano':
        case 'com-lenda':
          shouldUnlock = totalWorkouts >= 10;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(10);
          break;
        case 'com-colecionador':
          shouldUnlock = totalWorkouts >= 3;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(3);
          break;

        // INTENSIDADE
        case 'int-bomba':
        case 'int-queimada':
        case 'int-insano':
        case 'int-pura':
        case 'int-semdescanso':
          shouldUnlock = totalWorkouts >= 2;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(2);
          break;

        // ESPECIAL
        case 'badge-4':
        case 'esp-glowup2026':
        case 'esp-profile-master':
          shouldUnlock = totalWorkouts >= 1;
          if (shouldUnlock) calculatedUnlockDate = getDateForNthWorkout(1);
          break;

        default:
          shouldUnlock = false;
          break;
      }

      if (shouldUnlock) {
        const finalDate = badge.unlockedAt || calculatedUnlockDate || todayStr;
        const unlockedBadge: Badge = {
          ...badge,
          isUnlocked: true,
          unlockedAt: finalDate,
        };

        if (!badge.isUnlocked) {
          newlyUnlockedBadges.push(unlockedBadge);
        }
        return unlockedBadge;
      }

      // If history was deleted or criteria no longer met, lock badge back up
      return {
        ...badge,
        isUnlocked: false,
        unlockedAt: undefined,
      };
    });

    const unlockedCount = updatedBadges.filter((b) => b.isUnlocked).length;
    const totalCount = updatedBadges.length;
    const unlockedPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

    return {
      updatedBadges,
      newlyUnlockedBadges,
      unlockedCount,
      totalCount,
      unlockedPercentage,
    };
  }
}
