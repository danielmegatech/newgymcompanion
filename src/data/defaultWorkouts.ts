/**
 * Gym Companion v2.0 — Default Workouts & Workouts Prescription
 * Ficha ABCD Personalizada — Daniel (Projeto Glow Up 2026)
 *
 * Estrutura:
 * - Treino A: Full Body 1 (Peito + Quadríceps) ⭐ PROGRAMA PRINCIPAL
 * - Treino B: Full Body 2 (Costas + Posterior) ⭐ PROGRAMA PRINCIPAL
 * - Treino C: Superior (Peito + Costas + Braços) — Opcional (quando treinar 3–4x/semana)
 * - Treino D: Inferior + Cardio (Pernas + Glúteos + Panturrilha + Core) — Opcional (quando treinar 4x/semana)
 *
 * Princípios Clínicos:
 * - A e B são Full Body para manter frequência muscular 2x/semana para peito, costas, pernas e braços.
 * - Proteção ativa para joelho direito e ombro direito (dor zero é meta).
 * - Cargas iniciais de referência para técnica impecável.
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
    cadence?: string;
    kneeWarning?: boolean;
    shoulderWarning?: boolean;
    substitutes?: string;
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
    kneeWarning: prescription.kneeWarning ?? master?.kneeWarning ?? false,
    shoulderWarning: prescription.shoulderWarning ?? master?.shoulderWarning ?? false,
    personalRecordKg: prescription.weightKg,
    history: [],
    photoUrl: primaryMedia?.url || master?.photoUrl || '',
    gifUrl: master?.mediaAttachments?.find((m) => m.type === 'motion')?.url || master?.gifUrl,
    anatomyUrl: master?.mediaAttachments?.find((m) => m.type === 'anatomy')?.url || master?.anatomyUrl,
    adjustment: master?.machineSetup?.seatPosition || master?.adjustment,
    masterData: master,
  };
}

// =========================================================================
// 🔴 TREINO A — FULL BODY 1 (Ênfase Peito + Quadríceps) ⭐ PRINCIPAL
// Duração: 70–85 min (incluindo aquecimento e cardio final)
// =========================================================================
export const DEFAULT_EXERCISES_A: Exercise[] = [
  // 1. 🚴 Bike (Aquecimento) — 10 min
  createWorkoutExercise('master-bike-ergometrica', {
    weightKg: 0,
    reps: 1,
    sets: 1,
    targetReps: '10 min',
    isTimedCardio: true,
    targetDurationSeconds: 600,
    defaultRestSeconds: 60,
    rpe: 6,
    notes:
      '🚴 Como fazer: Pedalar progressivamente, começando leve e aumentando a resistência aos poucos. ❌ Evitar: Começar forte, ficar exausto antes da musculação ou pedalar muito rápido sem resistência.',
  }),

  // 2. Leg Press 45° (English: 45° Leg Press, Máquina: Leg Press 45°)
  createWorkoutExercise('master-leg-press-45', {
    weightKg: 40,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 90,
    rpe: 7,
    kneeWarning: true,
    notes:
      'Como fazer: Sentar com costas e lombar 100% apoiadas; pés na largura dos ombros no meio da plataforma; destravar com segurança; flexionar os joelhos até ~90° com cadência 3–1–2; empurrar com os calcanhares sem travar os joelhos no final. Deve sentir: Quadríceps e glúteos. ❌ Evitar: Joelho entrando para dentro (valgo), tirar quadril do banco, descer além da amplitude confortável, movimentos rápidos, aumentar peso se o joelho inchar. ⚠️ Joelho direito: Se o joelho começar a incomodar ou apresentar inchaço anormal, não tente "vencer" a dor. Alternativa: Hack Squat Machine.',
  }),

  // 3. Mesa Flexora (English: Leg Curl, Máquina: Leg Curl Machine)
  createWorkoutExercise('master-mesa-flexora', {
    weightKg: 15,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 75,
    rpe: 7,
    notes:
      'Como fazer: Deitar de bruços, ajustar o apoio logo acima do calcanhar; segurar as manoplas; flexionar os joelhos trazendo o rolo para trás com cadência 2–1–3; contrair o posterior da coxa no topo; retornar lentamente. Deve sentir: Posterior da coxa. ❌ Evitar: Levantar quadril, impulso com lombar, soltar o peso rápido. Alternativa: Outra máquina de Leg Curl.',
  }),

  // 4. Panturrilha Sentado (English: Seated Calf Raise, Máquina: Seated Calf Raise)
  createWorkoutExercise('master-panturrilha-sentado', {
    weightKg: 20,
    reps: 15,
    sets: 4,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 45,
    rpe: 7,
    notes:
      'Como fazer: Apoiar a almofada sobre os joelhos; calcanhar baixo no início; empurrar com a ponta dos pés até a contração máxima (cadência 2–2–2); pausar 1–2 segundos no topo; descer lentamente sentindo o alongamento. Deve sentir: Contração forte na panturrilha. ❌ Evitar: Quicar no fundo, movimentos curtíssimos, aumentar carga sacrificando amplitude.',
  }),

  // 5. Chest Press (English: Chest Press, Máquina: Chest Press Machine)
  createWorkoutExercise('master-chest-press-sentado', {
    weightKg: 20,
    reps: 10,
    sets: 3,
    targetReps: '10 (Faixa: 8–10)',
    defaultRestSeconds: 90,
    rpe: 7,
    shoulderWarning: true,
    notes:
      'Como fazer: Ajustar o banco para as pegadas ficarem na altura do meio do peito; encostar as costas; ombros baixos e escápulas aduzidas; empurrar para a frente (cadência 2–1–3); retornar devagar; parar antes de perder a posição dos ombros. Deve sentir: Peitoral com participação de tríceps. ❌ Evitar: Ombros subindo em direção às orelhas, cotovelos exageradamente abertos, travar bruscamente cotovelos, movimento explosivo. ⚠️ Ombro direito: Qualquer dor articular relevante = parar imediatamente. Alternativa: Converging Chest Press.',
  }),

  // 6. Peck Deck (English: Pec Deck / Chest Fly, Máquina: Pec Deck Machine)
  createWorkoutExercise('master-peck-deck', {
    weightKg: 15,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 75,
    rpe: 7,
    shoulderWarning: true,
    notes:
      'Como fazer: Ajustar o banco; peito aberto; segurar as manoplas sem tensionar ombros; aproximar os braços contraindo o peito no centro (cadência 2–1–3); segurar 1s; retornar lentamente sem esticar além do limite seguro. Deve sentir: Peitoral. ❌ Evitar: Abrir excessivamente os braços além da linha do corpo, esticar ombro até sentir dor, bater placas, usar impulso. Alternativa: Cable Chest Fly com amplitude reduzida.',
  }),

  // 7. Puxada Frontal (English: Lat Pulldown, Máquina: Lat Pulldown)
  createWorkoutExercise('master-puxada-alta-frente', {
    weightKg: 25,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 90,
    rpe: 7,
    notes:
      'Como fazer: Segurar a barra além da largura dos ombros; travar as pernas nos rolos; inclinar o tronco ligeiramente para trás (~10–15°); puxar a barra em direção ao peito superior trazendo cotovelos para baixo (cadência 2–1–3); subir lentamente. Deve sentir: Dorsais e parte superior das costas. ❌ Evitar: Puxar atrás da cabeça/nuca, balançar o corpo, transformar em remada. Alternativa: Assisted Pull-Up.',
  }),

  // 8. Remada Sentada (English: Seated Cable Row, Máquina: Seated Row)
  createWorkoutExercise('master-remada-articulada-sentada', {
    weightKg: 20,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 90,
    rpe: 7,
    notes:
      'Como fazer: Sentar com a coluna neutra e peito aberto; puxar a pega em direção ao abdômen com cotovelos para trás (cadência 2–1–3); pausar 1s esmagando as escápulas; retornar lentamente estendendo os braços. Deve sentir: Costas, principalmente região média. ❌ Evitar: Arredondar a lombar, jogar o tronco violentamente para trás, puxar só com braços. Alternativa: Machine Row.',
  }),

  // 9. Rosca Máquina (English: Machine Biceps Curl)
  createWorkoutExercise('master-machine-biceps-curl', {
    weightKg: 10,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 60,
    rpe: 7,
    notes:
      'Como fazer: Braços apoiados no estofado; movimento lento e controlado sem levantar o ombro do apoio; contrair o bíceps no topo; retornar sem soltar o peso. ❌ Evitar: Usar o corpo para ajudar, balançar o tronco. Alternativa: Cable Curl na polia baixa.',
  }),

  // 10. Tríceps Corda (English: Rope Triceps Pushdown, Máquina: Cable Machine)
  createWorkoutExercise('master-triceps-corda', {
    weightKg: 10,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 60,
    rpe: 7,
    notes:
      'Como fazer: Pegada neutra na corda; cotovelos colados e próximos ao corpo; estender os braços abrindo as pontas da corda na descida sem movimentar excessivamente os ombros; retornar até ~90° com controle. ❌ Evitar: Abrir os cotovelos para fora, balançar o corpo. Alternativa: Straight-Bar Triceps Pushdown.',
  }),

  // 11. Flexão de Punhos (English: Wrist Curl)
  createWorkoutExercise('master-flexao-punhos', {
    weightKg: 5,
    reps: 15,
    sets: 3,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 45,
    rpe: 7,
    notes:
      'Como fazer: Antebraços apoiados sobre as coxas ou banco, palmas para cima; flexionar os punhos para cima de forma lenta e controlada; descer na amplitude total. 💡 Regra: Controle e amplitude, não carga alta.',
  }),

  // 12. Extensão de Punhos (English: Reverse Wrist Curl)
  createWorkoutExercise('master-extensao-punhos', {
    weightKg: 4,
    reps: 15,
    sets: 3,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 45,
    rpe: 7,
    notes:
      'Como fazer: Antebraços apoiados, palmas para baixo; estender os punhos para cima controlando o movimento; descer devagar. 💡 Regra: Fortalecimento e proteção dos extensores do antebraço.',
  }),

  // 13. Abdominal Máquina (English: Abdominal Crunch Machine)
  createWorkoutExercise('master-abdominal-maquina', {
    weightKg: 15,
    reps: 15,
    sets: 3,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 45,
    rpe: 7,
    notes:
      'Como fazer: Sentar com as costas no encosto; segurar as manoplas; flexionar o tronco enrolando o abdômen; soltar o ar na contração máxima; retornar devagar sem bater as placas. ❌ Evitar: Puxar com o pescoço ou braços, movimentos rápidos.',
  }),

  // 14. 🚴 Bike (Cardio Final) — 20 min
  createWorkoutExercise('master-bike-ergometrica', {
    weightKg: 0,
    reps: 1,
    sets: 1,
    targetReps: '20 min',
    isTimedCardio: true,
    targetDurationSeconds: 1200,
    defaultRestSeconds: 60,
    rpe: 7,
    notes:
      '🚴 Cardio contínuo de 20 minutos em intensidade leve/moderada para queima de gordura e condicionamento cardiovascular. Ao terminar: 5 min de desaquecimento e relaxamento com alongamento leve opcional.',
  }),
];

// =========================================================================
// 🔵 TREINO B — FULL BODY 2 (Ênfase Costas + Posterior) ⭐ PRINCIPAL
// Duração: 70–85 min (incluindo aquecimento, ombro e cardio final)
// =========================================================================
export const DEFAULT_EXERCISES_B: Exercise[] = [
  // 1. 🚴 Bike (Aquecimento) — 10 min
  createWorkoutExercise('master-bike-ergometrica', {
    weightKg: 0,
    reps: 1,
    sets: 1,
    targetReps: '10 min',
    isTimedCardio: true,
    targetDurationSeconds: 600,
    defaultRestSeconds: 60,
    rpe: 6,
    notes:
      '10 min de aquecimento na bike para lubrificar articulações de joelho, quadril e elevar temperatura corporal com segurança.',
  }),

  // 2. Cadeira Extensora (English: Leg Extension, Máquina: Leg Extension Machine)
  createWorkoutExercise('master-leg-extension', {
    weightKg: 15,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 75,
    rpe: 7,
    kneeWarning: true,
    notes:
      'Como fazer: Rolo ajustado na parte inferior da canela; estender o joelho lentamente com cadência 2–1–3; pausar 1s no topo; descer controladamente em 3s. Deve sentir: Quadríceps. ❌ Evitar: Chutar a carga, movimento explosivo com tranco articular. ⚠️ Joelho direito: Aumentar carga apenas se houver zero desconforto. Alternativa: Leg Press com carga menor.',
  }),

  // 3. Mesa Flexora (English: Leg Curl, Máquina: Leg Curl Machine)
  createWorkoutExercise('master-mesa-flexora', {
    weightKg: 20,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 75,
    rpe: 7,
    notes:
      'Como fazer: Mesma técnica rigorosa do Treino A, com 20 kg de referência. Pressionar a pelve contra a mesa, puxar calcanhares para os glúteos e segurar a descida em 3 segundos.',
  }),

  // 4. Hip Thrust Máquina (English: Machine Hip Thrust, Máquina: Hip Thrust / Glute Drive)
  createWorkoutExercise('master-hip-thrust-machine', {
    weightKg: 20,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 90,
    rpe: 7,
    notes:
      'Como fazer: Apoiar a parte superior das costas; pés firmes no solo na largura do quadril; empurrar com força pelos calcanhares; elevar o quadril; contrair fortemente os glúteos 1s no topo; descer com cadência 2–1–2 controlada. ❌ Evitar: Hiperestender a lombar no topo, jogar o peso, aumentar peso sacrificando a posição.',
  }),

  // 5. Panturrilha em Pé (English: Standing Calf Raise)
  createWorkoutExercise('master-standing-calf-raise', {
    weightKg: 20,
    reps: 15,
    sets: 4,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 45,
    rpe: 7,
    notes:
      'Como fazer: Na máquina de panturrilha em pé ou smith com 20 kg. Ponta dos pés no apoio, joelhos estendidos sem travar; descer para alongar bem; subir até a contração máxima na ponta dos pés; pausar 2s no topo (cadência 2–2–2) e descer devagar.',
  }),

  // 6. Adução (English: Hip Adduction, Máquina: Hip Adductor)
  createWorkoutExercise('master-adutora-maquina', {
    weightKg: 20,
    reps: 15,
    sets: 3,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 45,
    rpe: 7,
    notes:
      'Como fazer: Sentar com as costas no encosto, almofadas na parte interna dos joelhos; fechar as pernas com movimento lento e controlado; segurar 1s; retornar devagar sem bater as placas. Fortalece a estabilidade medial do joelho.',
  }),

  // 7. Chest Press Inclinado (English: Incline Chest Press)
  createWorkoutExercise('master-incline-chest-press', {
    weightKg: 20,
    reps: 10,
    sets: 3,
    targetReps: '10 (Faixa: 8–10)',
    defaultRestSeconds: 90,
    rpe: 7,
    shoulderWarning: true,
    notes:
      'Como fazer: Ajustar o banco para alinhamento com o peitoral superior; costas no encosto; empurrar para frente/cima (cadência 2–1–3); descer devagar. ⚠️ Ombro direito: Se sentir qualquer desconforto articular no ombro direito, parar imediatamente e substituir por Chest Press horizontal ou máquina convergente.',
  }),

  // 8. Pullover Máquina (English: Machine Pullover)
  createWorkoutExercise('master-pullover-machine', {
    weightKg: 15,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 75,
    rpe: 7,
    notes:
      'Como fazer: Excelente para trabalhar dorsais e serrátil sem necessidade de pesos livres. Ajustar o assento, apoiar os cotovelos nas almofadas e puxar em arco até a altura do abdômen (cadência 2–1–3). ❌ Evitar: Forçar amplitude excessiva do ombro no topo, acelerar o retorno. Alternativa: Straight-Arm Pulldown na polia.',
  }),

  // 9. Remada Máquina (English: Machine Row)
  createWorkoutExercise('master-remada-articulada-sentada', {
    weightKg: 20,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 90,
    rpe: 7,
    notes:
      'Como fazer: Peito encostado na almofada frontal; puxar as pegadas com força das costas; contrair as escápulas atrás; segurar 1s (cadência 2–1–3); estender os braços devagar com controle.',
  }),

  // 10. Face Pull (English: Face Pull, Máquina: Cable Machine)
  createWorkoutExercise('master-face-pull', {
    weightKg: 5,
    reps: 15,
    sets: 3,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 60,
    rpe: 6,
    shoulderWarning: true,
    notes:
      '⚠️ EXERCÍCIO CHAVE PROTEÇÃO DE OMBRO: Carga 5–7,5 kg (padrão 5 kg). Polia na altura dos olhos. Puxar a corda em direção aos olhos/testa com rotação externa, mantendo cotovelos altos; movimento controlado (cadência 2–1–2). ❌ Evitar: Carga alta demais, impulso, dor.',
  }),

  // 11. Rotação Externa (English: Cable External Rotation)
  createWorkoutExercise('master-rotacao-externa-cabo', {
    weightKg: 2.5,
    reps: 15,
    sets: 3,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 45,
    rpe: 6,
    shoulderWarning: true,
    notes:
      '⚠️ REABILITAÇÃO DO MANGUITO: Carga 2,5–5 kg (padrão 2.5 kg). Cotovelo colado à costela a 90°. Girar o antebraço para fora de forma estritamente controlada; retornar devagar. 💡 Prioridade: Qualidade do movimento e controle articular, nunca força.',
  }),

  // 12. Rosca Martelo na Corda (English: Rope Hammer Curl)
  createWorkoutExercise('master-rosca-martelo', {
    weightKg: 10,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 60,
    rpe: 7,
    notes:
      'Como fazer: Polia baixa com corda, pegada neutra; flexionar os cotovelos trazendo a corda em direção aos ombros; manter cotovelos fixos ao lado do corpo; descer com controle (cadência 2–1–2).',
  }),

  // 13. Tríceps Barra (English: Straight-Bar Triceps Pushdown)
  createWorkoutExercise('master-triceps-barra', {
    weightKg: 10,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 60,
    rpe: 7,
    notes:
      'Como fazer: Polia alta com barra reta, pegada pronada; cotovelos colados ao tronco; empurrar a barra para baixo até estender totalmente os braços; retornar até ~90° com controle.',
  }),

  // 14. Abdominal Máquina (English: Abdominal Crunch Machine)
  createWorkoutExercise('master-abdominal-maquina', {
    weightKg: 20,
    reps: 15,
    sets: 3,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 45,
    rpe: 7,
    notes:
      'Como fazer: Carga ajustada para 20 kg; flexionar o tronco com a musculatura abdominal; soltar o ar na contração máxima; retornar de forma controlada.',
  }),

  // 15. Oblíquo na Polia (English: Cable Oblique Crunch)
  createWorkoutExercise('master-obliquo-polia', {
    weightKg: 10,
    reps: 12,
    sets: 3,
    targetReps: '12 cada lado',
    defaultRestSeconds: 45,
    rpe: 7,
    notes:
      'Como fazer: Polia média/alta com manopla unilateral; flexão lateral do tronco com foco na contração dos oblíquos; 12 repetições por lado com movimento estritamente controlado.',
  }),

  // 16. Crunch Inclinado (English: Incline Crunch)
  createWorkoutExercise('master-incline-crunch', {
    weightKg: 0,
    reps: 15,
    sets: 3,
    targetReps: '15 (Peso Corporal)',
    defaultRestSeconds: 45,
    rpe: 7,
    notes:
      'Como fazer: Banco inclinado com pés travados; enrole o tronco aproximando as costelas da bacia; mãos ao lado da cabeça sem puxar o pescoço; desça suavemente.',
  }),

  // 17. 🚴 Bike (Cardio Final) — 20 min
  createWorkoutExercise('master-bike-ergometrica', {
    weightKg: 0,
    reps: 1,
    sets: 1,
    targetReps: '20 min',
    isTimedCardio: true,
    targetDurationSeconds: 1200,
    defaultRestSeconds: 60,
    rpe: 7,
    notes:
      '🚴 20 minutos contínuos na bike em intensidade aeróbica moderada. Ao concluir: 5 min de desaquecimento e relaxamento com alongamento opcional.',
  }),
];

// =========================================================================
// 🟡 TREINO C — OPCIONAL (Superior)
// Quando conseguir treinar 3–4 vezes na semana
// Duração: ~60 min
// =========================================================================
export const DEFAULT_EXERCISES_C: Exercise[] = [
  // 1. Chest Press
  createWorkoutExercise('master-chest-press-sentado', {
    weightKg: 20,
    reps: 10,
    sets: 3,
    targetReps: '10 (Faixa: 8–10)',
    defaultRestSeconds: 90,
    shoulderWarning: true,
    notes: '20 kg | 3 × 10 | Descanso 90 s. Execução controlada com escápulas travadas.',
  }),

  // 2. Lat Pulldown (Puxada Frontal)
  createWorkoutExercise('master-puxada-alta-frente', {
    weightKg: 25,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 90,
    notes: '25 kg | 3 × 12 | Descanso 90 s. Puxada até a linha superior do peito.',
  }),

  // 3. Machine Row (Remada Máquina)
  createWorkoutExercise('master-remada-articulada-sentada', {
    weightKg: 20,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 90,
    notes: '20 kg | 3 × 12 | Descanso 90 s. Retração escapular no final do curso.',
  }),

  // 4. Peck Deck
  createWorkoutExercise('master-peck-deck', {
    weightKg: 15,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 75,
    shoulderWarning: true,
    notes: '15 kg | 3 × 12 | Descanso 75 s. Amplitude segura sem hiperextensão do ombro.',
  }),

  // 5. Machine Biceps Curl (Rosca Máquina)
  createWorkoutExercise('master-machine-biceps-curl', {
    weightKg: 10,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 60,
    notes: '10 kg | 3 × 12 | Descanso 60 s. Isolamento de bíceps com cotovelos apoiados.',
  }),

  // 6. Rope Triceps Pushdown (Tríceps Corda)
  createWorkoutExercise('master-triceps-corda', {
    weightKg: 10,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 60,
    notes: '10 kg | 3 × 12 | Descanso 60 s. Abertura da corda na parte mais baixa.',
  }),

  // 7. Face Pull
  createWorkoutExercise('master-face-pull', {
    weightKg: 5,
    reps: 15,
    sets: 3,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 60,
    shoulderWarning: true,
    notes: '5 kg | 3 × 15 | Descanso 60 s. Fortalecimento de deltoide posterior e manguito.',
  }),

  // 8. Wrist Curl (Flexão de Punhos)
  createWorkoutExercise('master-flexao-punhos', {
    weightKg: 5,
    reps: 15,
    sets: 3,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 45,
    notes: '5 kg | 3 × 15 | Descanso 45 s. Amplitude e cadência controlada.',
  }),

  // 9. Reverse Wrist Curl (Extensão de Punhos)
  createWorkoutExercise('master-extensao-punhos', {
    weightKg: 4,
    reps: 15,
    sets: 3,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 45,
    notes: '4 kg | 3 × 15 | Descanso 45 s. Fortalecimento equilibrado do antebraço.',
  }),

  // 10. Cardio: Bike 15–20 min
  createWorkoutExercise('master-bike-ergometrica', {
    weightKg: 0,
    reps: 1,
    sets: 1,
    targetReps: '20 min',
    isTimedCardio: true,
    targetDurationSeconds: 1200,
    defaultRestSeconds: 60,
    notes: 'Bike 15–20 minutos em intensidade leve a moderada.',
  }),
];

// =========================================================================
// 🟢 TREINO D — OPCIONAL (Inferior + Cardio)
// Pernas + Glúteos + Panturrilha + Core (Quando conseguir treinar 4x na semana)
// Duração: ~60 min
// =========================================================================
export const DEFAULT_EXERCISES_D: Exercise[] = [
  // 1. Leg Press 45°
  createWorkoutExercise('master-leg-press-45', {
    weightKg: 40,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 90,
    kneeWarning: true,
    notes: '40 kg | 3 × 12 | Descanso 90 s. Execução profunda sem tirar o quadril do banco.',
  }),

  // 2. Leg Extension (Cadeira Extensora)
  createWorkoutExercise('master-leg-extension', {
    weightKg: 15,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 75,
    kneeWarning: true,
    notes: '15 kg | 3 × 12 | Descanso 75 s. Extensão controlada sem trancos no joelho.',
  }),

  // 3. Leg Curl (Mesa Flexora)
  createWorkoutExercise('master-mesa-flexora', {
    weightKg: 20,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 75,
    notes: '20 kg | 3 × 12 | Descanso 75 s. Posterior de coxa com 20 kg de referência.',
  }),

  // 4. Hip Thrust (Máquina)
  createWorkoutExercise('master-hip-thrust-machine', {
    weightKg: 20,
    reps: 12,
    sets: 3,
    targetReps: '12 (Faixa: 10–12)',
    defaultRestSeconds: 90,
    notes: '20 kg | 3 × 12 | Descanso 90 s. Contração isométrica no pico do movimento.',
  }),

  // 5. Hip Abduction (Cadeira Abdutora)
  createWorkoutExercise('master-abducao-maquina', {
    weightKg: 20,
    reps: 15,
    sets: 3,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 45,
    notes: '20 kg | 3 × 15 | Descanso 45 s. Glúteo médio e estabilidade lateral da pelve.',
  }),

  // 6. Hip Adduction (Cadeira Adutora)
  createWorkoutExercise('master-adutora-maquina', {
    weightKg: 20,
    reps: 15,
    sets: 3,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 45,
    notes: '20 kg | 3 × 15 | Descanso 45 s. Fortalecimento do compartimento medial da coxa.',
  }),

  // 7. Standing Calf Raise (Panturrilha em Pé)
  createWorkoutExercise('master-standing-calf-raise', {
    weightKg: 20,
    reps: 15,
    sets: 4,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 45,
    notes: '20 kg | 4 × 15 | Descanso 45 s. Amplitude completa e pausa no topo.',
  }),

  // 8. Abdominal Machine
  createWorkoutExercise('master-abdominal-maquina', {
    weightKg: 20,
    reps: 15,
    sets: 3,
    targetReps: '15 (Faixa: 12–15)',
    defaultRestSeconds: 45,
    notes: '20 kg (15–20 kg) | 3 × 15 | Descanso 45 s. Contração consciente do reto abdominal.',
  }),

  // 9. Cardio: Bike 20 min
  createWorkoutExercise('master-bike-ergometrica', {
    weightKg: 0,
    reps: 1,
    sets: 1,
    targetReps: '20 min',
    isTimedCardio: true,
    targetDurationSeconds: 1200,
    defaultRestSeconds: 60,
    notes: 'Bike 20 minutos em intensidade leve a moderada.',
  }),
];

export const DEFAULT_WORKOUTS: Workout[] = [
  {
    id: 'workout-a',
    code: 'A',
    name: 'Treino A — Full Body 1',
    subtitle: '⭐ PROGRAMA PRINCIPAL — Peito + Quadríceps (Glow Up 2026)',
    color: 'emerald',
    description:
      'Programa Principal: Full Body 1 garantindo que peito, costas, pernas e braços recebam estímulo com ênfase em Peito e Quadríceps. 70–85 min com aquecimento e cardio final.',
    exercises: DEFAULT_EXERCISES_A,
    isFavorite: true,
    estimatedDurationMinutes: 80,
  },
  {
    id: 'workout-b',
    code: 'B',
    name: 'Treino B — Full Body 2',
    subtitle: '⭐ PROGRAMA PRINCIPAL — Costas + Posterior & Proteção Articular',
    color: 'cyan',
    description:
      'Programa Principal: Full Body 2 com foco em Dorsais, Posterior de Coxa, Glúteos e protocolo chave de proteção/reabilitação para ombro direito (Face Pull e Rotação Externa). 70–85 min.',
    exercises: DEFAULT_EXERCISES_B,
    isFavorite: true,
    estimatedDurationMinutes: 80,
  },
  {
    id: 'workout-c',
    code: 'C',
    name: 'Treino C — Superior (Opcional)',
    subtitle: 'Sessão Opcional de Tronco & Braços (Quando treinar 3–4× na semana)',
    color: 'amber',
    description:
      'Sessão opcional de Peito + Costas + Braços para semanas com maior disponibilidade (3ª ou 4ª sessão semanal). ~60 min.',
    exercises: DEFAULT_EXERCISES_C,
    isFavorite: false,
    estimatedDurationMinutes: 60,
  },
  {
    id: 'workout-d',
    code: 'D',
    name: 'Treino D — Inferior + Cardio (Opcional)',
    subtitle: 'Sessão Opcional de Pernas, Glúteos, Panturrilha & Core (4× na semana)',
    color: 'violet',
    description:
      'Sessão opcional de Pernas + Glúteos + Panturrilha + Core e Cardio para quando você conseguir treinar 4 vezes na semana. ~60 min.',
    exercises: DEFAULT_EXERCISES_D,
    isFavorite: false,
    estimatedDurationMinutes: 60,
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
