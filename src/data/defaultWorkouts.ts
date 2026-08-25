/**
 * Gym Companion v2.0 — Default Workouts & Workouts Prescription
 * As Fichas de Treino (Treinos A, B, C, D) utilizam os exercícios cadastrados na Biblioteca Mestre.
 * Cada exercício possui sua prescrição específica (séries, repetições, carga prescrita).
 */

import { Workout, Badge, Exercise } from '../types';
import { getMasterExerciseById, getMasterExerciseByName } from './masterExercises';

export function createWorkoutExercise(
  masterId: string,
  prescription: {
    weightKg: number;
    reps: number;
    sets: number;
    targetReps?: string;
    defaultRestSeconds?: number;
    rpe?: number;
    notes?: string;
    isTimedCardio?: boolean;
    targetDurationSeconds?: number;
  }
): Exercise {
  const master = getMasterExerciseById(masterId) || getMasterExerciseByName(masterId);
  const primaryMedia = master?.mediaAttachments?.find((m) => m.isPrimary) || master?.mediaAttachments?.[0];

  return {
    id: `we-${masterId}-${Math.random().toString(36).substr(2, 6)}`,
    masterExerciseId: master ? master.id : masterId,
    name: master ? master.name : masterId,
    muscleGroup: master ? master.muscleGroup : 'Quadríceps',
    equipment: master ? master.equipment : 'Máquina',
    mediaAttachments: master?.mediaAttachments || [],
    machineSetup: master?.machineSetup,
    loadUnit: master?.loadUnit || 'kg',
    plateTable: master?.plateTable,
    weightKg: prescription.weightKg,
    previousWeightKg: prescription.weightKg,
    suggestedWeightKg: prescription.weightKg,
    reps: prescription.reps,
    sets: prescription.sets,
    targetReps: prescription.targetReps || `${prescription.reps}`,
    targetSets: prescription.sets,
    completedSetsCount: 0,
    completedSetsHistory: [],
    rpe: prescription.rpe || 7,
    defaultRestSeconds: prescription.defaultRestSeconds || master?.defaultRestSeconds || 60,
    notes: prescription.notes || master?.instructions,
    isTimedCardio: prescription.isTimedCardio,
    targetDurationSeconds: prescription.targetDurationSeconds,
    personalRecordKg: prescription.weightKg,
    history: [],
    photoUrl: primaryMedia?.url || master?.photoUrl || '',
    gifUrl: master?.mediaAttachments?.find((m) => m.type === 'motion')?.url || master?.gifUrl,
    anatomyUrl: master?.mediaAttachments?.find((m) => m.type === 'anatomy')?.url || master?.anatomyUrl,
    adjustment: master?.machineSetup?.seatPosition || master?.adjustment,
    masterData: master,
  };
}

// ==========================================
// TREINO A — Full Body (Ênfase Peito + Quadríceps)
// 17 Exercícios Canônicos Estritamente Vinculados ao Banco Global
// ==========================================
export const DEFAULT_EXERCISES_A: Exercise[] = [
  // 1. Aquecimento Bike 10 min
  createWorkoutExercise('master-bike-ergometrica', {
    weightKg: 4,
    reps: 1,
    sets: 1,
    targetReps: '10 min',
    isTimedCardio: true,
    targetDurationSeconds: 600,
    defaultRestSeconds: 60,
    rpe: 6,
    notes: 'Cadência 80–90 RPM. Objetivo: aquecer articulações e elevar temperatura corporal.',
  }),

  // 2. Leg Press 45°
  createWorkoutExercise('master-leg-press-45', {
    weightKg: 80,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 90,
    rpe: 7,
    notes: '⚠️ ATENÇÃO JOELHO DIREITO: Evitar impactos e cargas excessivas. Não travar os joelhos no topo.',
  }),

  // 3. Mesa Flexora
  createWorkoutExercise('master-mesa-flexora', {
    weightKg: 30,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 75,
    rpe: 7,
    notes: 'Flexione os joelhos com cadência controlada. Mantenha o quadril pressionado contra a mesa.',
  }),

  // 4. Panturrilha Sentado
  createWorkoutExercise('master-panturrilha-sentado', {
    weightKg: 35,
    reps: 15,
    sets: 4,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: 'Descida lenta alongando bem os sóleos, subida explosiva travando 1 segundo no topo.',
  }),

  // 5. Cadeira Abdutora
  createWorkoutExercise('master-abducao-maquina', {
    weightKg: 40,
    reps: 15,
    sets: 4,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: 'Fortalece glúteo médio e estabiliza a patela/joelho direito. Abra com controle.',
  }),

  // 6. Chest Press Máquina Sentado
  createWorkoutExercise('master-chest-press-sentado', {
    weightKg: 35,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 90,
    rpe: 7,
    notes: '⚠️ ATENÇÃO OMBRO DIREITO: Mantenha as escápulas aduzidas e cotovelos a 45° sem trancos.',
  }),

  // 7. Peck Deck (Voador Peitoral)
  createWorkoutExercise('master-peck-deck', {
    weightKg: 30,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 75,
    rpe: 7,
    notes: 'Contração de 1 segundo juntando os apoios à frente. Não alongue além da linha dos ombros.',
  }),

  // 8. Puxada Alta Frente
  createWorkoutExercise('master-puxada-alta-frente', {
    weightKg: 40,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 90,
    rpe: 7,
    notes: 'Puxe em direção à clavícula conduzindo com os cotovelos. Evite puxar atrás da cabeça.',
  }),

  // 9. Remada Articulada Sentada
  createWorkoutExercise('master-remada-articulada-sentada', {
    weightKg: 35,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 75,
    rpe: 7,
    notes: 'Mantenha o peito estufado e contraia as escápulas no final do movimento para postura.',
  }),

  // 10. Rosca Scott Máquina
  createWorkoutExercise('master-rosca-scott-maquina', {
    weightKg: 20,
    reps: 12,
    sets: 3,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: 'Isolamento seguro de bíceps sem sobrecarregar tendões do ombro ou cotovelo.',
  }),

  // 11. Tríceps Corda no Cabo
  createWorkoutExercise('master-triceps-corda', {
    weightKg: 25,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: 'Abra a corda na parte inferior travando os cotovelos próximos ao tronco.',
  }),

  // 12. Flexão de Punhos
  createWorkoutExercise('master-flexao-punhos', {
    weightKg: 10,
    reps: 15,
    sets: 3,
    defaultRestSeconds: 45,
    rpe: 7,
    notes: 'Apoie os antebraços nos joelhos ou banco e flexione os punhos para fortalecimento.',
  }),

  // 13. Extensão de Punhos
  createWorkoutExercise('master-extensao-punhos', {
    weightKg: 8,
    reps: 15,
    sets: 3,
    defaultRestSeconds: 45,
    rpe: 7,
    notes: 'Extensão controlada para equilíbrio muscular do antebraço e prevenção de epicondilite.',
  }),

  // 14. Abdominal Máquina
  createWorkoutExercise('master-abdominal-maquina', {
    weightKg: 30,
    reps: 15,
    sets: 4,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: 'Flexione o tronco com a força abdominal sem puxar com os braços ou pescoço.',
  }),

  // 15. Elevação de Joelhos
  createWorkoutExercise('master-knee-raise-captain-chair', {
    weightKg: 0,
    reps: 12,
    sets: 3,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: 'Eleve os joelhos em direção ao peito com controle. Ótimo para parte inferior do abdômen.',
  }),

  // 16. Cable Crunch
  createWorkoutExercise('master-cable-crunch', {
    weightKg: 35,
    reps: 15,
    sets: 4,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: 'Ajoelhado, enrole o tronco para baixo usando a contração do abdômen.',
  }),

  // 17. Bike Cardio Pós-Treino 20 min
  createWorkoutExercise('master-bike-ergometrica', {
    weightKg: 5,
    reps: 1,
    sets: 1,
    targetReps: '20 min',
    isTimedCardio: true,
    targetDurationSeconds: 1200,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: '20 minutos de cardio aeróbico para queima de gordura e recuperação ativa. Hidrate-se bem.',
  }),
];

// ==========================================
// TREINO B — Full Body (Ênfase Costas + Posterior)
// 18 Exercícios Canônicos Estritamente Vinculados ao Banco Global
// ==========================================
export const DEFAULT_EXERCISES_B: Exercise[] = [
  // 1. Aquecimento Bike 10 min
  createWorkoutExercise('master-bike-ergometrica', {
    weightKg: 4,
    reps: 1,
    sets: 1,
    targetReps: '10 min',
    isTimedCardio: true,
    targetDurationSeconds: 600,
    defaultRestSeconds: 60,
    rpe: 6,
    notes: 'Cadência 80–90 RPM. Aquecer articulações e preparar joelho e ombro para a sessão.',
  }),

  // 2. Cadeira Extensora
  createWorkoutExercise('master-leg-extension', {
    weightKg: 30,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 75,
    rpe: 7,
    notes: '⚠️ ATENÇÃO JOELHO DIREITO: Evitar impactos e cargas excessivas. Estenda sem dar tranco no topo.',
  }),

  // 3. Cadeira Flexora
  createWorkoutExercise('master-leg-curl-seated', {
    weightKg: 35,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 75,
    rpe: 7,
    notes: 'Trabalho focado no posterior da coxa, fortalecendo a estabilidade posterior do joelho.',
  }),

  // 4. Panturrilha no Leg Press
  createWorkoutExercise('master-calf-leg-press', {
    weightKg: 60,
    reps: 15,
    sets: 4,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: 'Apoio na ponta dos pés na borda da plataforma. Movimento lento e amplitude total.',
  }),

  // 5. Cadeira Adutora
  createWorkoutExercise('master-adutora-maquina', {
    weightKg: 40,
    reps: 15,
    sets: 4,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: 'Fortalecimento dos adutores para alinhamento e suporte medial da articulação do joelho.',
  }),

  // 6. Puxada Triângulo / Fechada
  createWorkoutExercise('master-puxada-triangulo', {
    weightKg: 35,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 90,
    rpe: 7,
    notes: 'Puxe verticalmente até o peito com pegada neutra e cotovelos fechados.',
  }),

  // 7. Remada Baixa no Cabo
  createWorkoutExercise('master-remada-baixa-cabo', {
    weightKg: 35,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 75,
    rpe: 7,
    notes: 'Puxe em direção ao abdômen mantendo a coluna ereta e junte as escápulas.',
  }),

  // 8. Supino Inclinado Máquina
  createWorkoutExercise('master-incline-chest-press', {
    weightKg: 30,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 75,
    rpe: 7,
    notes: 'Foco na porção superior do peitoral com segurança e controle escapular.',
  }),

  // 9. Peck Deck (Voador Peitoral)
  createWorkoutExercise('master-peck-deck', {
    weightKg: 30,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 75,
    rpe: 7,
    notes: 'Aperto central no peito mantendo a articulação do ombro estável.',
  }),

  // 10. Elevação Lateral no Cabo
  createWorkoutExercise('master-elevacao-lateral-cabo', {
    weightKg: 6,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: 'Tensão constante em todo o arco lateral do ombro sem forçar a articulação.',
  }),

  // 11. Face Pull no Cabo
  createWorkoutExercise('master-face-pull', {
    weightKg: 20,
    reps: 15,
    sets: 4,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: '⚠️ EXERCÍCIO CHAVE: Reabilitação e fortalecimento do ombro direito. Puxe em direção ao rosto.',
  }),

  // 12. Rotação Externa no Cabo / Elástico
  createWorkoutExercise('master-rotacao-externa-cabo', {
    weightKg: 4,
    reps: 15,
    sets: 3,
    defaultRestSeconds: 45,
    rpe: 6,
    notes: '⚠️ REABILITAÇÃO DO OMBRO DIREITO: Fortalece o manguito rotador sem forçar a articulação.',
  }),

  // 13. Rosca Martelo com Halteres
  createWorkoutExercise('master-rosca-martelo', {
    weightKg: 10,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: 'Pegada neutra para proteção de punhos e ativação forte de braquial e antebraço.',
  }),

  // 14. Tríceps Testa na Polia
  createWorkoutExercise('master-triceps-testa-polia', {
    weightKg: 18,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: 'Extensão controlada para cabeça longa do tríceps.',
  }),

  // 15. Prancha Abdominal Frontal
  createWorkoutExercise('master-prancha-frontal', {
    weightKg: 0,
    reps: 45,
    sets: 3,
    targetReps: '45 seg',
    defaultRestSeconds: 45,
    rpe: 7,
    notes: 'Sustentação isométrica do core com abdômen e glúteos travados.',
  }),

  // 16. Prancha Lateral
  createWorkoutExercise('master-prancha-lateral', {
    weightKg: 0,
    reps: 30,
    sets: 3,
    targetReps: '30 seg/lado',
    defaultRestSeconds: 45,
    rpe: 7,
    notes: 'Estabilização lateral de coluna e oblíquos.',
  }),

  // 17. Mobilidade de Ombro
  createWorkoutExercise('master-mobilidade-ombro', {
    weightKg: 0,
    reps: 10,
    sets: 3,
    defaultRestSeconds: 30,
    rpe: 5,
    notes: 'Trabalho de flexibilidade preventiva com bastão ou elástico.',
  }),

  // 18. Bike Cardio Pós-Treino 20 min
  createWorkoutExercise('master-bike-ergometrica', {
    weightKg: 5,
    reps: 1,
    sets: 1,
    targetReps: '20 min',
    isTimedCardio: true,
    targetDurationSeconds: 1200,
    defaultRestSeconds: 60,
    rpe: 7,
    notes: '20 min finais de queima calórica e saúde cardiovascular.',
  }),
];

// ==========================================
// TREINO C — Pernas & Glúteos (Opcional)
// ==========================================
export const DEFAULT_EXERCISES_C: Exercise[] = [
  createWorkoutExercise('master-bike-ergometrica', {
    weightKg: 4,
    reps: 1,
    sets: 1,
    targetReps: '10 min',
    isTimedCardio: true,
    targetDurationSeconds: 600,
    defaultRestSeconds: 60,
  }),
  createWorkoutExercise('master-leg-press-45', {
    weightKg: 90,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 90,
    notes: 'Progressão gradual de pernas com segurança.',
  }),
  createWorkoutExercise('master-leg-extension', {
    weightKg: 35,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 75,
  }),
  createWorkoutExercise('master-mesa-flexora', {
    weightKg: 35,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 75,
  }),
  createWorkoutExercise('master-abducao-maquina', {
    weightKg: 45,
    reps: 15,
    sets: 4,
    defaultRestSeconds: 60,
  }),
  createWorkoutExercise('master-panturrilha-sentado', {
    weightKg: 40,
    reps: 15,
    sets: 4,
    defaultRestSeconds: 60,
  }),
  createWorkoutExercise('master-hip-thrust-machine', {
    weightKg: 45,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 75,
  }),
];

// ==========================================
// TREINO D — Ombros, Trapézio & Abdômen (Opcional)
// ==========================================
export const DEFAULT_EXERCISES_D: Exercise[] = [
  createWorkoutExercise('master-shoulder-press-machine', {
    weightKg: 25,
    reps: 12,
    sets: 4,
    defaultRestSeconds: 75,
  }),
  createWorkoutExercise('master-lateral-raise-dumbbell', {
    weightKg: 10,
    reps: 15,
    sets: 4,
    defaultRestSeconds: 60,
  }),
  createWorkoutExercise('master-rear-delt-fly', {
    weightKg: 25,
    reps: 15,
    sets: 4,
    defaultRestSeconds: 60,
  }),
  createWorkoutExercise('master-face-pull', {
    weightKg: 20,
    reps: 15,
    sets: 4,
    defaultRestSeconds: 60,
  }),
  createWorkoutExercise('master-abdominal-maquina', {
    weightKg: 35,
    reps: 15,
    sets: 4,
    defaultRestSeconds: 60,
  }),
  createWorkoutExercise('master-cable-crunch', {
    weightKg: 40,
    reps: 15,
    sets: 4,
    defaultRestSeconds: 60,
  }),
  createWorkoutExercise('master-knee-raise-captain-chair', {
    weightKg: 0,
    reps: 12,
    sets: 3,
    defaultRestSeconds: 60,
  }),
];

export const DEFAULT_WORKOUTS: Workout[] = [
  {
    id: 'workout-a',
    code: 'A',
    name: 'Treino A — Peito & Quadríceps',
    subtitle: 'Foco em Peitoral, Joelho Protegido & Core (Glow Up 2026)',
    color: 'emerald',
    description:
      'Sessão completa (2x semana, 1h45–2h) com máquinas seguras para o joelho direito e aquecimento na bike.',
    exercises: DEFAULT_EXERCISES_A,
    isFavorite: true,
    estimatedDurationMinutes: 105,
  },
  {
    id: 'workout-b',
    code: 'B',
    name: 'Treino B — Costas & Posterior',
    subtitle: 'Foco em Dorsal, Posterior de Coxa & Reabilitação do Ombro',
    color: 'cyan',
    description:
      'Puxadas e remadas articuladas, alongamento posterior e exercícios corretivos (Face Pull e Rotação Externa) para o ombro direito.',
    exercises: DEFAULT_EXERCISES_B,
    isFavorite: true,
    estimatedDurationMinutes: 105,
  },
  {
    id: 'workout-c',
    code: 'C',
    name: 'Treino C — Pernas & Glúteos (Opcional)',
    subtitle: 'Foco Complementar de Membros Inferiores',
    color: 'amber',
    description:
      'Sessão suplementar de agachamento, leg press, posteriores e panturrilha caso evolua para frequência 3x na semana.',
    exercises: DEFAULT_EXERCISES_C,
    isFavorite: false,
    estimatedDurationMinutes: 55,
  },
  {
    id: 'workout-d',
    code: 'D',
    name: 'Treino D — Ombros, Trapézio & Abdômen (Opcional)',
    subtitle: 'Foco Complementar de Estabilidade e Core',
    color: 'violet',
    description:
      'Desenvolvimentos e elevações para largura de ombros, somados a trabalho de core e trapézio.',
    exercises: DEFAULT_EXERCISES_D,
    isFavorite: false,
    estimatedDurationMinutes: 45,
  },
];

export const DEFAULT_BADGES: Badge[] = [
  // CONSISTÊNCIA
  { id: 'cons-1', title: 'Primeiro Treino', description: 'Realizou seu primeiro treino no Gym Companion', icon: '🎯', isUnlocked: true, unlockedAt: '2026-08-01', category: 'consistência' },
  { id: 'cons-3', title: '3 Treinos', description: 'Completou 3 sessões de treino registradas', icon: '🔥', isUnlocked: true, unlockedAt: '2026-08-03', category: 'consistência' },
  { id: 'cons-7', title: '7 Treinos', description: 'Alcançou a marca de 7 treinos concluídos', icon: '⚡', isUnlocked: false, category: 'consistência' },
  { id: 'cons-10', title: '10 Treinos', description: 'Completou 10 treinos no seu histórico', icon: '🥇', isUnlocked: false, category: 'consistência' },
  { id: 'cons-15', title: 'Guardião da Rotina', description: 'Completou 15 sessões de treino registradas', icon: '🛡️', isUnlocked: false, category: 'consistência' },
  { id: 'cons-25', title: '25 Treinos', description: 'Consistência de ferro com 25 treinos realizados', icon: '🎖️', isUnlocked: false, category: 'consistência' },
  { id: 'cons-50', title: '50 Treinos', description: 'Meio século de treinos cumpridos no ginásio', icon: '👑', isUnlocked: false, category: 'consistência' },
  { id: 'cons-100', title: '100 Treinos', description: 'Lenda da academia com 100 treinos concluídos', icon: '🏆', isUnlocked: false, category: 'consistência' },

  // PROGRESSÃO
  { id: 'prog-1', title: 'Primeiro Aumento', description: 'Aumentou a carga de um exercício pela primeira vez', icon: '📈', isUnlocked: true, unlockedAt: '2026-08-02', category: 'progressão' },
  { id: 'prog-pr1', title: 'Primeiro PR', description: 'Bateu seu primeiro Recorde Pessoal de carga', icon: '🚀', isUnlocked: true, unlockedAt: '2026-08-02', category: 'progressão' },
  { id: 'prog-pr5', title: '5 Recordes (PRs)', description: 'Conquistou 5 novos Recordes Pessoais', icon: '💥', isUnlocked: false, category: 'progressão' },
  { id: 'prog-pr10', title: '10 Recordes (PRs)', description: 'Série inquebrável com 10 PRs registrados', icon: '🌟', isUnlocked: false, category: 'progressão' },

  // VOLUME
  { id: 'vol-1k', title: '1.000 kg Movimentados', description: 'Moveu no total 1 tonelada de carga nos treinos', icon: '🏋️', isUnlocked: true, unlockedAt: '2026-08-01', category: 'volume' },
  { id: 'vol-5k', title: '5.000 kg Movimentados', description: 'Superou a marca de 5.000 kg de volume acumulado', icon: '⚖️', isUnlocked: true, unlockedAt: '2026-08-03', category: 'volume' },
  { id: 'vol-10k', title: '10.000 kg Movimentados', description: 'Mestre do volume com 10 toneladas movimentadas', icon: '🏗️', isUnlocked: false, category: 'volume' },

  // DESEMPENHO
  { id: 'des-1', title: 'Primeiro Treino Concluído', description: 'Terminou com sucesso um treino do início ao fim', icon: '✅', isUnlocked: true, unlockedAt: '2026-08-01', category: 'desempenho' },
  { id: 'des-complete', title: 'Treino 100% Completo', description: 'Executou todos os exercícios e séries sem pular', icon: '💯', isUnlocked: true, unlockedAt: '2026-08-03', category: 'desempenho' },
  { id: 'des-sets', title: 'Todas as Séries Cumpridas', description: 'Executou 100% das repetições e séries planejadas', icon: '🎯', isUnlocked: false, category: 'desempenho' },

  // DISCIPLINA
  { id: 'disc-weeks', title: 'Semanas Consecutivas', description: 'Manteve a rotina de treinos semanal sem faltar', icon: '📆', isUnlocked: true, unlockedAt: '2026-08-01', category: 'disciplina' },
  { id: 'disc-plan', title: 'Ficha Completa Planejada', description: 'Cumpriu a sequência exata planejada da Ficha A à Ficha D', icon: '📋', isUnlocked: false, category: 'disciplina' },

  // ESPECIAL
  { id: 'esp-glowup2026', title: 'Temporada Glow Up 2026', description: 'Participante ativo do programa oficial de performance 2026', icon: '✨', isUnlocked: true, unlockedAt: '2026-08-01', category: 'especial' },
];

export const DEFAULT_QR_CODE_DATA =
  'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=GYM-COMPANION-ELEMENT-MEMBER-ACCESS-2026';
