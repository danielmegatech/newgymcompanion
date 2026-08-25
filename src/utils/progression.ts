/**
 * Gym Companion — Motor de Progressão Individual
 * Sistema determinístico de progressão de cargas por exercício.
 * Separação entre Biblioteca Mestre (metadata) e Perfil Individual do Exercício (desempenho).
 */

import {
  Exercise,
  EvolutionTrend,
  IndividualExerciseSessionLog,
  ExerciseIndividualProfile,
  MuscleGroup,
} from '../types';

export interface ProgressionRecommendation {
  suggestedWeightKg: number;
  suggestedReps: number;
  action: 'increase' | 'maintain' | 'decrease';
  reason: string;
  badgeText: string;
  evolutionTrend: EvolutionTrend;
  trendSummary: string;
}

/**
 * Normalizes lower vs upper body step size for deterministic progression.
 */
export function getStepSizeKg(muscleGroup: MuscleGroup): number {
  const isLowerBody =
    muscleGroup === 'Quadríceps' ||
    muscleGroup === 'Posterior de Coxa' ||
    muscleGroup === 'Posterior' ||
    muscleGroup === 'Glúteos' ||
    muscleGroup === 'Panturrilha';

  return isLowerBody ? 5 : 2.5;
}

/**
 * Calculates trend from session history logs
 */
export function calculateTrend(history: IndividualExerciseSessionLog[]): {
  trend: EvolutionTrend;
  summary: string;
  percentChange: number;
} {
  const validLogs = history.filter((h) => h.status === 'Concluído' || h.status === 'Parcial');
  if (validLogs.length < 2) {
    return {
      trend: 'Dados insuficientes',
      summary: 'Execute mais sessões para gerar dados de tendência.',
      percentChange: 0,
    };
  }

  // Recent 3 vs Previous 3
  const recentLogs = validLogs.slice(0, 3);
  const recentAvgVolume =
    recentLogs.reduce((acc, curr) => acc + curr.totalVolumeKg, 0) / recentLogs.length;

  const previousLogs = validLogs.slice(3, 6);
  if (previousLogs.length === 0) {
    const firstWeight = validLogs[validLogs.length - 1].actualWeightKg;
    const latestWeight = validLogs[0].actualWeightKg;
    const diff = latestWeight - firstWeight;
    const pct = firstWeight > 0 ? (diff / firstWeight) * 100 : 0;

    if (pct > 2) {
      return {
        trend: 'Evoluindo',
        summary: `Você aumentou sua carga em ${pct.toFixed(0)}% nas últimas ${validLogs.length} sessões.`,
        percentChange: pct,
      };
    } else if (pct < -2) {
      return {
        trend: 'Em queda',
        summary: `Seu rendimento médio reduziu ${Math.abs(pct).toFixed(0)}% recentemente.`,
        percentChange: pct,
      };
    } else {
      return {
        trend: 'Estável',
        summary: `Seu desempenho está estável nas últimas ${validLogs.length} sessões.`,
        percentChange: pct,
      };
    }
  }

  const previousAvgVolume =
    previousLogs.reduce((acc, curr) => acc + curr.totalVolumeKg, 0) / previousLogs.length;

  const pct = previousAvgVolume > 0 ? ((recentAvgVolume - previousAvgVolume) / previousAvgVolume) * 100 : 0;

  if (pct > 3) {
    return {
      trend: 'Evoluindo',
      summary: `Você aumentou seu volume de treino em ${pct.toFixed(0)}% nas últimas sessões.`,
      percentChange: pct,
    };
  } else if (pct < -3) {
    return {
      trend: 'Em queda',
      summary: `Seu volume médio de treino apresentou queda de ${Math.abs(pct).toFixed(0)}% nas últimas sessões.`,
      percentChange: pct,
    };
  } else {
    return {
      trend: 'Estável',
      summary: `Seu desempenho de carga e volume se mantém estável.`,
      percentChange: pct,
    };
  }
}

/**
 * Deterministic progression algorithm for individual exercise profiles
 */
export function calculateExerciseProgression(
  profile: ExerciseIndividualProfile,
  targetReps: number = 10,
  muscleGroup: MuscleGroup = 'Peito',
  recentFeedbackTags: string[] = []
): ProgressionRecommendation {
  const stepKg = getStepSizeKg(muscleGroup);
  const trendResult = calculateTrend(profile.history);

  // Recovery / Injury overrides
  const feedbackStr = recentFeedbackTags.map((f) => f.toLowerCase()).join(' ');
  if (feedbackStr.includes('dor') || feedbackStr.includes('desconforto')) {
    const reduced = Math.max(2.5, Math.round(profile.currentWeightKg * 0.8 * 2) / 2);
    return {
      suggestedWeightKg: reduced,
      suggestedReps: targetReps,
      action: 'decrease',
      reason: 'Redução preventiva por relato de desconforto ou dor articular.',
      badgeText: '🛡️ Proteção Articular',
      evolutionTrend: trendResult.trend,
      trendSummary: trendResult.summary,
    };
  }

  const validHistory = profile.history.filter(
    (h) => h.status === 'Concluído' || h.status === 'Parcial'
  );

  // Case 0: First session
  if (validHistory.length === 0) {
    return {
      suggestedWeightKg: profile.currentWeightKg || profile.initialWeightKg || 20,
      suggestedReps: targetReps,
      action: 'maintain',
      reason: 'Primeira sessão registrada. Estabeleça sua carga confortável de partida.',
      badgeText: '🎯 Carga Inicial Base',
      evolutionTrend: 'Dados insuficientes',
      trendSummary: 'Complete mais sessões para gerar histórico de evolução.',
    };
  }

  const lastSession = validHistory[0];
  const lastWeight = lastSession.actualWeightKg;
  const setsCount = lastSession.setsCompleted || 4;
  const targetTotalReps = targetReps * setsCount;
  const actualTotalReps = lastSession.repsPerSet.reduce((a, b) => a + b, 0);

  // Was target met across all sets?
  const allSetsMet = lastSession.repsPerSet.length > 0 && lastSession.repsPerSet.every((r) => r >= targetReps);

  // Check for manual weight adjustment during active workout
  const hadManualOverride = lastSession.plannedWeightKg !== lastSession.actualWeightKg;

  // Case 1: Target Reps Met (All sets >= targetReps)
  if (allSetsMet) {
    const nextWeight = lastWeight + stepKg;
    let reason = `Meta de ${setsCount} series × ${targetReps} reps completada na última sessão. Progressão programada (+${stepKg} kg).`;
    if (hadManualOverride) {
      reason += ` (Ajuste manual da sessão anterior respeitado: ${lastSession.actualWeightKg} kg).`;
    }

    return {
      suggestedWeightKg: nextWeight,
      suggestedReps: targetReps,
      action: 'increase',
      reason,
      badgeText: `📈 +${stepKg} kg (Progressão)`,
      evolutionTrend: trendResult.trend,
      trendSummary: trendResult.summary,
    };
  }

  // Case 2: Partial Target Reps Met (>= 80% total reps)
  if (actualTotalReps >= targetTotalReps * 0.8) {
    return {
      suggestedWeightKg: lastWeight,
      suggestedReps: targetReps,
      action: 'maintain',
      reason: `Desempenho consistente (${lastSession.repsPerSet.join('/')} reps). Mantendo ${lastWeight} kg para consolidar a execução.`,
      badgeText: '⚖️ Manter Carga (Consolidação)',
      evolutionTrend: trendResult.trend,
      trendSummary: trendResult.summary,
    };
  }

  // Case 3: Performance short (< 80%)
  // Check if last 2 sessions failed
  const recentTwo = validHistory.slice(0, 2);
  const consecutiveShort =
    recentTwo.length >= 2 &&
    recentTwo.every((s) => s.repsPerSet.reduce((a, b) => a + b, 0) < targetReps * s.setsCompleted * 0.8);

  if (consecutiveShort) {
    const reduced = Math.max(2.5, Math.round(lastWeight * 0.9 * 2) / 2);
    return {
      suggestedWeightKg: reduced,
      suggestedReps: targetReps,
      action: 'decrease',
      reason: 'Ajuste conservador (-10%) após 2 sessões abaixo da meta para priorizar a técnica.',
      badgeText: '⚠️ Ajuste Conservador (-10%)',
      evolutionTrend: trendResult.trend,
      trendSummary: trendResult.summary,
    };
  }

  // Default Maintain
  return {
    suggestedWeightKg: lastWeight,
    suggestedReps: targetReps,
    action: 'maintain',
    reason: `Carga mantida em ${lastWeight} kg para adaptação de força.`,
    badgeText: '⚖️ Manter Carga',
    evolutionTrend: trendResult.trend,
    trendSummary: trendResult.summary,
  };
}

/**
 * Checks if weight sets a Personal Record
 */
export function isNewPR(exercise: Exercise, newWeightKg: number): boolean {
  if (!exercise.personalRecordKg || exercise.personalRecordKg === 0) return true;
  return newWeightKg > exercise.personalRecordKg;
}

/**
 * Legacy compatibility calculateNextWeight wrapper
 */
export function calculateNextWeight(
  exercise: Exercise,
  lastCompletedSetsCount: number,
  lastRepsCompleted: number,
  rpeRating: number = 8,
  recentFeedbackTags: string[] = []
): {
  suggestedWeightKg: number;
  reason: string;
  action: 'increase' | 'maintain' | 'decrease' | 'swap_suggested';
  badgeText: string;
} {
  const isLowerBody =
    exercise.muscleGroup === 'Quadríceps' ||
    exercise.muscleGroup === 'Posterior de Coxa' ||
    exercise.muscleGroup === 'Glúteos' ||
    exercise.muscleGroup === 'Panturrilha';

  const stepKg = isLowerBody ? 5 : 2.5;
  const current = exercise.weightKg;

  if (lastRepsCompleted >= exercise.reps && rpeRating <= 9) {
    return {
      suggestedWeightKg: current + stepKg,
      reason: `Meta de repetições atingida na sessão anterior. Progressão de carga (+${stepKg} kg).`,
      action: 'increase',
      badgeText: `📈 +${stepKg} kg`,
    };
  }

  return {
    suggestedWeightKg: current,
    reason: `Manter ${current} kg para consolidar a execução.`,
    action: 'maintain',
    badgeText: '⚖️ Manter Carga',
  };
}

/**
 * Generates metric-grounded AI Coach insights strictly based on performance data
 */
export function getCoachMetricInsight(
  volumeDiffPct: number,
  prsCount: number,
  evolvedCount: number,
  stableCount: number,
  belowCount: number
): string {
  if (prsCount > 0) {
    return `Incrível sessão! Você bateu ${prsCount} novo(s) recorde(s) de carga. Excelente progresso de força muscular.`;
  }

  if (volumeDiffPct >= 5) {
    return `Ótimo desempenho! Seu volume de treino subiu ${volumeDiffPct.toFixed(0)}% em relação ao último treino equivalente.`;
  }

  if (evolvedCount > 0 && belowCount === 0) {
    return `Evolução consistente! ${evolvedCount} exercício(s) tiveram progresso de carga mantendo a boa faixa de repetições.`;
  }

  if (volumeDiffPct <= -5) {
    return `Seu volume total ficou ${Math.abs(volumeDiffPct).toFixed(0)}% abaixo do último treino similar. Dias de fadiga acumulada são normais no processo de adaptação.`;
  }

  return `Treino consistente concluído. A regularidade é o pilar principal da hipertrofia e condicionamento.`;
}
