/**
 * Gym Companion v1.0 — Exercise Media Library & Muscle Anatomical Guide
 * Fornece GIFs demonstrativos, fotos detalhadas e ilustrações anatômicas de cada grupo muscular.
 * Inclui mais de 60 presets completos com parâmetros técnicos de execução, regulagem e erros comuns.
 */

import { MuscleGroup } from '../types';

export interface ExerciseMediaPreset {
  name: string;
  muscleGroup: MuscleGroup;
  gifUrl: string;
  videoUrl?: string;
  muscleIllustrationUrl: string;
  muscleDescription: string;
  equipment: string;
  defaultSets?: number;
  defaultReps?: number;
  defaultWeightKg?: number;
  defaultRestSeconds: number;
  adjustment?: string;
  execution?: string;
  commonErrors?: string;
}

/**
 * Adjusts weight, reps, and rest time based on individual user parameters:
 * Level ('Iniciante' | 'Intermediário' | 'Avançado'), body weight, or training goals.
 */
export function getUserCustomizedExercisePreset(
  preset: ExerciseMediaPreset,
  userLevel: 'Iniciante' | 'Intermediário' | 'Avançado' = 'Intermediário',
  userWeightKg: number = 75
): {
  sets: number;
  reps: number;
  weightKg: number;
  restSeconds: number;
} {
  let sets = preset.defaultSets || 4;
  let reps = preset.defaultReps || 10;
  let baseWeight = preset.defaultWeightKg || 20;
  let rest = preset.defaultRestSeconds || 60;

  // Level adjustments
  if (userLevel === 'Iniciante') {
    // Beginners start with 70% of standard load, +15s rest, controlled reps
    baseWeight = Math.max(2, Math.round((baseWeight * 0.7) / 2) * 2);
    rest = Math.min(120, rest + 15);
    sets = Math.max(3, sets - 1);
  } else if (userLevel === 'Avançado') {
    // Advanced lifters use 135% load, tighter rest or higher intensity
    baseWeight = Math.round((baseWeight * 1.35) / 2) * 2;
    sets = Math.min(5, sets + 1);
  }

  // Weight scale factor based on user bodyweight ratio if bodyweight exercise
  if (preset.muscleGroup === 'Cardio' || preset.muscleGroup === 'Mobilidade') {
    baseWeight = 0; // Cardio & Mobilidade não usam carga pesada de barra
  }

  return {
    sets,
    reps,
    weightKg: baseWeight,
    restSeconds: rest,
  };
}

export const MUSCLE_GROUP_INFO: Record<
  MuscleGroup,
  {
    title: string;
    description: string;
    illustrationUrl: string;
    accentColor: string;
  }
> = {
  Peito: {
    title: 'Peitoral (Maior e Menor)',
    description:
      'Trabalha a adução e flexão horizontal dos braços. Principal motor em supinos, apoios e crucifixos.',
    illustrationUrl:
      '',
    accentColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  },
  Costas: {
    title: 'Dorsais, Rombóides e Redondo Maior',
    description:
      'Responsável por puxadas verticais e remadas horizontais. Expande a largura e espessura da cintura escapular.',
    illustrationUrl:
      '',
    accentColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  },
  Ombros: {
    title: 'Deltoides (Anterior, Lateral e Posterior)',
    description:
      'Ativado em desenvolvimentos e elevações. Constrói a largura dos ombros e estabilidade articular.',
    illustrationUrl:
      '',
    accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  Bíceps: {
    title: 'Bíceps Braquial e Braquial',
    description:
      'Responsável pela flexão do cotovelo e supinação do antebraço em roscas com barra, halteres ou polia.',
    illustrationUrl:
      '',
    accentColor: 'text-lime-400 bg-lime-500/10 border-lime-500/30',
  },
  Tríceps: {
    title: 'Tríceps Braquial (3 Cabeças)',
    description:
      'Extensor principal do cotovelo. Representa cerca de 65% do volume total do braço.',
    illustrationUrl:
      '',
    accentColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  },
  Quadríceps: {
    title: 'Quadríceps Femoral',
    description:
      'Grupo frontal da coxa responsável pela extensão do joelho (Agachamento, Leg Press, Cadeira Extensora).',
    illustrationUrl:
      '',
    accentColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  'Posterior de Coxa': {
    title: 'Isquiotibiais (Posterior de Coxa)',
    description:
      'Flexão do joelho e extensão do quadril (Mesa Flexora, Stiff, Cadeira Flexora).',
    illustrationUrl:
      '',
    accentColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  },
  Posterior: {
    title: 'Isquiotibiais (Posterior de Coxa)',
    description:
      'Flexão do joelho e extensão do quadril (Mesa Flexora, Stiff, Cadeira Flexora).',
    illustrationUrl:
      '',
    accentColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  },
  Glúteos: {
    title: 'Glúteo Maior, Médio e Menor',
    description:
      'Maior músculo do corpo humano, motor primário na extensão e abdução do quadril (Elevação Pélvica, Agachamento).',
    illustrationUrl:
      '',
    accentColor: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  },
  Panturrilha: {
    title: 'Gastrocnêmio e Sóleo',
    description:
      'Flexão plantar do tornozelo. Essencial para impulsão, corrida e circulação venosa de retorno.',
    illustrationUrl:
      '',
    accentColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
  },
  Abdômen: {
    title: 'Reto Abdominal e Oblíquos',
    description:
      'Estabiliza a coluna vertebral, core e pelve. Ativado em pranchas, abdominais e exercícios compostos.',
    illustrationUrl:
      '',
    accentColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  },
  Trapézio: {
    title: 'Trapézio Superior, Médio e Inferior',
    description:
      'Movimenta e estabiliza as escápulas, ombros e pescoço em encolhimentos e remadas altas.',
    illustrationUrl:
      '',
    accentColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  },
  Antebraço: {
    title: 'Flexores e Extensores do Antebraço',
    description:
      'Garante força de pegada em todas as puxadas, levantamentos terra e roscas de punho.',
    illustrationUrl:
      '',
    accentColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  },
  Cardio: {
    title: 'Sistema Cardiovascular e Aeróbico',
    description:
      'Aumenta o consumo máximo de oxigênio (VO2), queima calórica eficiente e saúde cardíaca.',
    illustrationUrl:
      '',
    accentColor: 'text-red-400 bg-red-500/10 border-red-500/30',
  },
  Mobilidade: {
    title: 'Mobilidade Articular & Alongamento',
    description:
      'Prevenção de lesões, ganho de amplitude articular (ADM), lubrificação sinovial e alívio de tensões no joelho e ombro.',
    illustrationUrl:
      '',
    accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  Aquecimento: {
    title: 'Aquecimento Ativo & Preparação de Carga',
    description:
      'Ativação neuromuscular, elevação da temperatura corporal e preparação das articulações antes dos exercícios pesados.',
    illustrationUrl:
      '',
    accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  Opcionais: {
    title: 'Exercícios Opcionais & Acessórios',
    description:
      'Exercícios adicionais para pontos fracos, fortalecimento preventivo, acabamento ou personalização de treino.',
    illustrationUrl:
      '',
    accentColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  },
  Panturrilhas: {
    title: 'Gastrocnêmio e Sóleo',
    description:
      'Flexão plantar do tornozelo. Essencial para impulsão, corrida e circulação venosa de retorno.',
    illustrationUrl:
      '',
    accentColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
  },
};

export const EXERCISE_MEDIA_LIBRARY: ExerciseMediaPreset[] = [
  // --- CARDIO ---
  {
    name: 'Esteira Ergométrica (Caminhada Rápida / Corrida)',
    muscleGroup: 'Cardio',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Sistema cardiovascular, queima de gordura e resistência aeróbica dos membros inferiores.',
    equipment: 'Esteira Ergométrica',
    defaultSets: 1,
    defaultReps: 35,
    defaultWeightKg: 0,
    defaultRestSeconds: 60,
    adjustment: 'Inclinação 1-3%, velocidade 6-12 km/h',
    execution: 'Postura ereta, braços em 90°, pisada natural',
    commonErrors: 'Inclinar-se para frente, pisar com o calcanhar primeiro, velocidade inconsistente',
  },
  {
    name: 'Simulador de Escada (StairMaster)',
    muscleGroup: 'Cardio',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Ativação intensa de glúteo maior, panturrilhas, quadríceps e alta exigência cardiorrespiratória.',
    equipment: 'Simulador de Escada',
    defaultSets: 1,
    defaultReps: 25,
    defaultWeightKg: 0,
    defaultRestSeconds: 60,
    adjustment: 'Nível 5-8, velocidade moderada',
    execution: 'Corpo reto, apoio nos corrimãos leve, passos completos',
    commonErrors: 'Prender a respiração, apoiar-se demais nos corrimãos, passos pequenos',
  },
  {
    name: 'Elíptico (Transport Sem Impacto)',
    muscleGroup: 'Cardio',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Cardio de baixíssimo impacto nas articulações (ideal para joelho sensível), ativando pernas e braços simultaneamente.',
    equipment: 'Elíptico / Transport',
    defaultSets: 1,
    defaultReps: 35,
    defaultWeightKg: 0,
    defaultRestSeconds: 60,
    adjustment: 'Resistência 5-7, inclinação 3-5',
    execution: 'Movimento fluido e circular, braços e pernas sincronizados',
    commonErrors: 'Movimento irregular, resistência muito alta, falta de sincronização',
  },
  {
    name: 'Remo Ergométrico',
    muscleGroup: 'Cardio',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Ativação de corpo inteiro (dorsal, core, quadríceps e glúteos) com queima calórica elevada e sem impacto patelar.',
    equipment: 'Remo Ergométrico',
    defaultSets: 1,
    defaultReps: 25,
    defaultWeightKg: 0,
    defaultRestSeconds: 60,
    adjustment: 'Resistência 5-6, assento ajustado',
    execution: 'Puxar com pernas primeiro, depois costas e braços, retorno controlled',
    commonErrors: 'Puxar com braços primeiro, arredondar as costas, movimento muito rápido',
  },
  {
    name: 'Bicicleta Ergométrica (Spinning / Horizontal)',
    muscleGroup: 'Cardio',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Cardio de alto rendimento com zero impacto patelar. Ideal para fortalecimento cardiovascular e coxas.',
    equipment: 'Bicicleta Ergométrica',
    defaultSets: 1,
    defaultReps: 30,
    defaultWeightKg: 0,
    defaultRestSeconds: 60,
    adjustment: 'Selim na altura do quadril, guidão ajustado',
    execution: 'Manter cadência constante entre 80-90 RPM com pedala circular e fluida',
    commonErrors: 'Banco muito baixo forçando o joelho, dobrar excessivamente a coluna',
  },
  {
    name: 'Pular Corda (Cardio & Agilidade)',
    muscleGroup: 'Cardio',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Alta intensidade cardiorrespiratória, coordenação motora e fortalecimento de panturrilhas.',
    equipment: 'Corda de Salto',
    defaultSets: 4,
    defaultReps: 3,
    defaultWeightKg: 0,
    defaultRestSeconds: 45,
    adjustment: 'Corda ajustada na altura do peitoral com pés apoiados no centro',
    execution: 'Saltos curtos na ponta dos pés, mantendo cotovelos próximos ao corpo e punhos girando',
    commonErrors: 'Saltar alto demais, aterrissar com os calcanhares no chão',
  },

  // --- MOBILIDADE ---
  {
    name: 'Mobilidade de Quadril e Torácica (90/90)',
    muscleGroup: 'Mobilidade',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Liberação da cápsula articular do quadril e abertura torácica, reduzindo sobrecarga nos joelhos e lombar.',
    equipment: 'Colchonete no chão',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeightKg: 0,
    defaultRestSeconds: 40,
    adjustment: 'Colchonete no chão',
    execution: 'Sentado, uma perna flexionada 90°, rotação do tronco, manter alongamento',
    commonErrors: 'Forçar demais, movimento brusco, não respirar adequadamente',
  },
  {
    name: 'Alongamento Posterior de Coxa e Glúteo',
    muscleGroup: 'Mobilidade',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Alongamento estático dos isquiotibiais, piriforme e glúteos para melhora da postura e alívio da patela.',
    equipment: 'Colchonete / Solo',
    defaultSets: 3,
    defaultReps: 3,
    defaultWeightKg: 0,
    defaultRestSeconds: 20,
    adjustment: 'Colchonete ou chão',
    execution: 'Deitado, puxar joelho em direção ao peito, manter posição por 30-45 segundos',
    commonErrors: 'Movimento de balanço, puxar com força excessiva, respiração presa',
  },
  {
    name: 'Rotação Externa de Ombro (Manguito Rotador)',
    muscleGroup: 'Mobilidade',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Infraespinhal e redondo menor. Essencial para reabilitar o ombro e prevenir impacto subacromial.',
    equipment: 'Polia em altura média ou elástico leve',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeightKg: 4,
    defaultRestSeconds: 30,
    adjustment: 'Polia em altura média ou elástico leve',
    execution: 'Cotovelo 90°, rotacionar ombro para trás, movimento controlado',
    commonErrors: 'Usar peso muito pesado, movimento rápido, não fixar o cotovelo',
  },
  {
    name: 'Mobilidade de Tornozelo (Dorsiflexão na Parede)',
    muscleGroup: 'Mobilidade',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Aumenta a amplitude de dorsiflexão do tornozelo, essencial para agachamentos profundos e saúde do joelho.',
    equipment: 'Solo / Parede',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeightKg: 0,
    defaultRestSeconds: 30,
    adjustment: 'Pé posicionado a 10cm da parede em base de afundo',
    execution: 'Projetar o joelho à frente tentando tocar a parede sem tirar o calcanhar do chão',
    commonErrors: 'Descolar o calcanhar do solo, colapsar o joelho para dentro (valgo)',
  },
  {
    name: 'Alongamento de Flexores de Quadril (Ajoelhado)',
    muscleGroup: 'Mobilidade',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Alivia o psoas e ilíaco encurtados por longos períodos sentados, reduzindo a hiperlordose lombar.',
    equipment: 'Colchonete no solo',
    defaultSets: 3,
    defaultReps: 3,
    defaultWeightKg: 0,
    defaultRestSeconds: 30,
    adjustment: 'Um joelho no colchonete e a outra perna à frente em 90°',
    execution: 'Contrair o glúteo e projetar suavemente o quadril à frente sem hiperestender a lombar',
    commonErrors: 'Arquear excessivamente a coluna lombar, não contrair o glúteo',
  },

  // --- AQUECIMENTO ---
  {
    name: 'Polichinelos Ativos (Jumping Jacks)',
    muscleGroup: 'Aquecimento',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Elevação da frequência cardíaca, circulação e preparação de articulações de tornozelo e ombros.',
    equipment: 'Solo',
    defaultSets: 2,
    defaultReps: 30,
    defaultWeightKg: 0,
    defaultRestSeconds: 30,
    adjustment: 'Pés juntos e braços ao lado do corpo',
    execution: 'Saltar abrindo pernas e elevando braços acima da cabeça ritmadamente',
    commonErrors: 'Aterrissar com os calcanhares duros, falta de ritmo',
  },
  {
    name: 'Agachamento Corporal Livre (Air Squats de Aquecimento)',
    muscleGroup: 'Aquecimento',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Lubrificação do líquido sinovial nos joelhos e quadril antes do agachamento com barra.',
    equipment: 'Peso Corporal',
    defaultSets: 2,
    defaultReps: 15,
    defaultWeightKg: 0,
    defaultRestSeconds: 30,
    adjustment: 'Pés na largura dos ombros',
    execution: 'Agachar até 90° mantendo o tronco ereto e joelhos alinhados',
    commonErrors: 'Tirar os calcanhares do chão ou colapsar os joelhos',
  },
  {
    name: 'Rotação Dinâmica de Braços & Ombros',
    muscleGroup: 'Aquecimento',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Aquecimento dinâmico da cápsula articular do ombro e deltoides.',
    equipment: 'Livre / Elástico Leve',
    defaultSets: 2,
    defaultReps: 15,
    defaultWeightKg: 0,
    defaultRestSeconds: 20,
    adjustment: 'Em pé com postura ereta',
    execution: 'Circunduzir os braços para frente e para trás com amplitude fluida',
    commonErrors: 'Movimento brusco e trancado',
  },
  {
    name: 'Rotação Externa de Manguito com Elástico',
    muscleGroup: 'Aquecimento',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Fortalecimento e ativação dos supra/infraespinhal para estabilização do ombro no supino e desenvolvimento.',
    equipment: 'Mini-Band / Polia Leve',
    defaultSets: 2,
    defaultReps: 15,
    defaultWeightKg: 2,
    defaultRestSeconds: 25,
    adjustment: 'Cotovelo colado ao tronco em 90°',
    execution: 'Girar o antebraço para fora mantendo o cotovelo fixo na cintura',
    commonErrors: 'Afastar o cotovelo do corpo ou usar impulso do tronco',
  },
  {
    name: 'Prancha Isométrica de Ativação do Core',
    muscleGroup: 'Aquecimento',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Ativação do transverso do abdômen e estabilidade lombar pré-treino.',
    equipment: 'Colchonete',
    defaultSets: 2,
    defaultReps: 30,
    defaultWeightKg: 0,
    defaultRestSeconds: 30,
    adjustment: 'Antebraços apoiados no chão paralelos',
    execution: 'Manter a linha do corpo reta contraindo abdômen e glúteos vigorosamente',
    commonErrors: 'Deixar o quadril selar para baixo ou elevação excessiva do glúteo',
  },
  {
    name: 'Spiderman Stretch com Rotação Torácica',
    muscleGroup: 'Aquecimento',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Abertura de quadril, flexores e mobilidade torácica dinâmica.',
    equipment: 'Solo',
    defaultSets: 2,
    defaultReps: 8,
    defaultWeightKg: 0,
    defaultRestSeconds: 30,
    adjustment: 'Posição de afundo com mãos apoiadas internamente',
    execution: 'Girar a mão do lado da perna da frente em direção ao teto e acompanhar com o olhar',
    commonErrors: 'Não estender a perna traseira, pressa na rotação',
  },

  // --- OPCIONAIS ---
  {
    name: 'Rosca Bícipital de Concentração no Banco',
    muscleGroup: 'Opcionais',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Isolamento máximo do pico do bíceps sem nenhum impulso do tronco.',
    equipment: 'Halter + Banco Reto',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeightKg: 10,
    defaultRestSeconds: 45,
    adjustment: 'Cotovelo apoiado na parte interna da coxa',
    execution: 'Flexionar o antebraço em direção ao peito, apertando o bíceps no topo',
    commonErrors: 'Mover o cotovelo de posição durante a subida',
  },
  {
    name: 'Tríceps Coice com Halter (Kickback)',
    muscleGroup: 'Opcionais',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Contração isométrica de pico na cabeça longa e lateral do tríceps.',
    equipment: 'Halter + Banco',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeightKg: 8,
    defaultRestSeconds: 45,
    adjustment: 'Tronco paralelo ao solo apoiado no banco',
    execution: 'Estender o cotovelo totalmente mantendo a parte superior do braço fixa',
    commonErrors: 'Usar impulso do ombro em vez da extensão do cotovelo',
  },
  {
    name: 'Elevação Lateral Inclinada no Banco',
    muscleGroup: 'Opcionais',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Tensão constante na cabeça lateral do deltoide desde a fase inicial do movimento.',
    equipment: 'Halter + Banco Inclinado 45°',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeightKg: 6,
    defaultRestSeconds: 45,
    adjustment: 'Deitado de lado no banco inclinado',
    execution: 'Elevar o halter até a linha da cabeça sem inclinar o tronco',
    commonErrors: 'Rotacionar o punho ou usar impulso dos pés',
  },
  {
    name: 'Rosca Inversa para Antebraço e Braquial',
    muscleGroup: 'Opcionais',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Fortalecimento do braquiorradial e extensores do punho para pegada firme.',
    equipment: 'Barra W / Halter',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeightKg: 12,
    defaultRestSeconds: 45,
    adjustment: 'Pegada pronada (palmas para baixo)',
    execution: 'Flexionar os antebraços mantendo pegada firme sem dobrar os punhos',
    commonErrors: 'Hiperextender os punhos na fase alta do movimento',
  },
  {
    name: 'Panturrilha Unilateral em Pé no Degrau',
    muscleGroup: 'Opcionais',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Amplitude máxima de alongamento e contração concentrada do gastrocnêmio.',
    equipment: 'Degrau / Halter Unilateral',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 10,
    defaultRestSeconds: 45,
    adjustment: 'Ponta do pé apoiada na borda',
    execution: 'Descer o calcanhar ao máximo e subir até a extensão máxima na ponta dos pés',
    commonErrors: 'Fazer repetições curtas ou dar impulsos com o joelho',
  },

  // --- OMBROS ---
  {
    name: 'Face Pull com Corda na Polia',
    muscleGroup: 'Ombros',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Deltoide posterior, manguito rotador externo, trapézio médio e rombóides. Excelente para postura.',
    equipment: 'Polia alta, corda média',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 10,
    defaultRestSeconds: 50,
    adjustment: 'Polia alta, corda média',
    execution: 'Puxar corda em direção ao rosto, cotovelos altos, separar as cordas no final',
    commonErrors: 'Usar peso muito pesado, cotovelos baixos, movimento incompleto',
  },
  {
    name: 'Desenvolvimento de Ombros Máquina Articulada',
    muscleGroup: 'Ombros',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Deltoide Anterior e Lateral com apoio lombar seguro. Sem instabilidade excessiva no ombro.',
    equipment: 'Shoulder Press Máquina',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 20,
    defaultRestSeconds: 75,
    adjustment: 'Assento na altura do ombro, encosto firme',
    execution: 'Empurrar acima da cabeça, cotovelos ligeiramente flexionados, movimento controlled',
    commonErrors: 'Arquear a lombar, movimento muito rápido, não descer completamente',
  },
  {
    name: 'Elevação Lateral com Halteres',
    muscleGroup: 'Ombros',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Deltoide Lateral (cabeça média do ombro) e Trapézio Superior.',
    equipment: 'Halteres',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 8,
    defaultRestSeconds: 50,
    adjustment: 'Em pé, pés na largura dos ombros',
    execution: 'Elevar halteres lateralmente até altura dos ombros, cotovelos ligeiramente flexionados',
    commonErrors: 'Usar peso muito pesado, balançar o corpo, cotovelos muito flexionados',
  },
  {
    name: 'Elevação Frontal na Polia com Barra Reta',
    muscleGroup: 'Ombros',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Deltoide anterior com tensão contínua proporcionada pelos cabos da polia baixa.',
    equipment: 'Polia Baixa + Barra Reta',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 10,
    defaultRestSeconds: 50,
    adjustment: 'Polia na posição mais baixa, barra reta engatada',
    execution: 'Elevar a barra à frente até a linha dos olhos com braços semi-estendidos e tronco estável',
    commonErrors: 'Usar impulso do quadril, elevar além da linha dos ombros desalinhando a escápula',
  },
  {
    name: 'Crucifixo Invertido no Peck Deck (Deltoide Posterior)',
    muscleGroup: 'Ombros',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Foco exclusivo na cabeça posterior do deltoide e rombóides na máquina de voador invertido.',
    equipment: 'Peck Deck / Voador Invertido',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 15,
    defaultRestSeconds: 50,
    adjustment: 'Assento ajustado para as mãos ficarem no nível dos ombros',
    execution: 'Abrir as alavancas para trás focando em espremer a porção posterior do ombro',
    commonErrors: 'Dobrar demais os cotovelos ou puxar usando apenas o trapézio superior',
  },
  {
    name: 'Desenvolvimento Arnold com Halteres',
    muscleGroup: 'Ombros',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Recruta deltoides anterior e lateral com rotação fluida durante a subida.',
    equipment: 'Halteres + Banco 90°',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeightKg: 12,
    defaultRestSeconds: 75,
    adjustment: 'Banco a 90° com apoio total para a coluna',
    execution: 'Iniciar com palmas para dentro e rotacionar para fora durante a subida',
    commonErrors: 'Perder o controle na descida e bater os halteres no topo',
  },

  // --- GLÚTEOS ---
  {
    name: 'Cadeira Abdutora Máquina',
    muscleGroup: 'Glúteos',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Glúteo Médio e Mínimo. Estabiliza a pelve e protege diretamente a articulação do joelho.',
    equipment: 'Cadeira Abdutora',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 20,
    defaultRestSeconds: 50,
    adjustment: 'Assento ajustado, apoio nas costas firme',
    execution: 'Abrir as pernas contra a resistência, movimento controlado, apertar no final',
    commonErrors: 'Usar peso excessivo, movimento muito rápido, não abrir completamente',
  },
  {
    name: 'Glúteo Coice na Máquina (Glute Kickback)',
    muscleGroup: 'Glúteos',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Isolamento do Glúteo Maior com alavanca guiada sem sobrecarregar a lombar.',
    equipment: 'Máquina de Glúteo',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 15,
    defaultRestSeconds: 50,
    adjustment: 'Máquina ajustada à altura do quadril',
    execution: 'Empurrar a alavanca para trás com a perna, apertar glúteo no final',
    commonErrors: 'Usar momentum, não estender completamente, arquear a lombar',
  },
  {
    name: 'Elevação Pélvica com Barra (Hip Thrust)',
    muscleGroup: 'Glúteos',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Glúteo Maior (principal extensor de quadril) e ativação de posterior.',
    equipment: 'Barra + discos + banco baixo',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 30,
    defaultRestSeconds: 75,
    adjustment: 'Banco baixo, barra no quadril com protetor',
    execution: 'Elevar quadris até formar linha reta com o tronco, apertar glúteos no topo',
    commonErrors: 'Não elevar completamente, usar peso muito pesado, não apertar o glúteo',
  },
  {
    name: 'Agachamento Búlgaro com Halteres',
    muscleGroup: 'Glúteos',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Unilateral intenso com foco elevado em glúteo maior e quadríceps sem compressão axial.',
    equipment: 'Halteres + Banco Reto',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeightKg: 10,
    defaultRestSeconds: 60,
    adjustment: 'Pé traseiro apoiado no banco, pé da frente afastado adequadamente',
    execution: 'Flexionar a perna da frente projetando o quadril levemente para trás',
    commonErrors: 'Joelho da frente ultapassar excessivamente a ponta do pé sem controle',
  },
  {
    name: 'Abdução de Quadril na Polia Baixa',
    muscleGroup: 'Glúteos',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Desenvolvimento do glúteo médio com constante tensão do cabo.',
    equipment: 'Polia Baixa + Tornozeleira',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 8,
    defaultRestSeconds: 45,
    adjustment: 'Tornozeleira presa na perna mais distante da polia',
    execution: 'Abduzir a perna lateralmente mantendo o tronco ereto e estável',
    commonErrors: 'Inclinarse excessivamente para o lado oposto para compensar o peso',
  },

  // --- QUADRÍCEPS ---
  {
    name: 'Cadeira Adutora Máquina',
    muscleGroup: 'Quadríceps',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Adutores da coxa (magno, longo, curto e grácil). Equilibra a musculatura medial da coxa.',
    equipment: 'Cadeira Adutora',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 20,
    defaultRestSeconds: 50,
    adjustment: 'Assento ajustado, apoio nas costas',
    execution: 'Fechar as pernas contra a resistência, movimento controlado, apertar no final',
    commonErrors: 'Usar peso excessivo, movimento muito rápido, não fechar completamente',
  },
  {
    name: 'Leg Press Horizontal (Baixo Impacto)',
    muscleGroup: 'Quadríceps',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Quadríceps e Glúteo com trilho horizontal suave, evitando pressão vertical no joelho.',
    equipment: 'Leg Press Horizontal',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 60,
    defaultRestSeconds: 75,
    adjustment: 'Assento ajustado, pés na largura dos ombros',
    execution: 'Descer até 90° de flexão de joelho, empurrar sem travar os joelhos',
    commonErrors: 'Descer muito, travar joelhos no topo, pés muito próximos ou afastados',
  },
  {
    name: 'Cadeira Extensora (Carga Suave & Controle)',
    muscleGroup: 'Quadríceps',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Isolamento de Quadríceps (Vasto Medial e Lateral). Executar com carga moderada e sem tranco no joelho.',
    equipment: 'Cadeira Extensora',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 20,
    defaultRestSeconds: 50,
    adjustment: 'Assento ajustado, encosto firme, apoio de pé correto',
    execution: 'Estender joelhos lentamente, manter contração no topo, descida controlada',
    commonErrors: 'Usar peso muito pesado, movimento rápido, não estender completamente',
  },
  {
    name: 'Agachamento Livre com Barra',
    muscleGroup: 'Quadríceps',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Quadríceps (Vasto Lateral, Intermediário e Medial) e Glúteo Maior.',
    equipment: 'Barra e Gaiola de Segurança',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeightKg: 40,
    defaultRestSeconds: 105,
    adjustment: 'Barra na altura correta, gaiola de segurança ajustada',
    execution: 'Descer até 90°, manter tronco reto, joelhos alinhados com os pés',
    commonErrors: 'Joelhos valgos, tronco muito inclinado, não descer completamente',
  },
  {
    name: 'Leg Press 45º',
    muscleGroup: 'Quadríceps',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Quadríceps Femoral e Glúteo na fase de empurrada pesada.',
    equipment: 'Máquina Leg Press 45º',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeightKg: 90,
    defaultRestSeconds: 105,
    adjustment: 'Assento ajustado, pés na largura dos ombros',
    execution: 'Descer até 90° de flexão, empurrar sem travar os joelhos',
    commonErrors: 'Descer muito, travar joelhos, pés mal posicionados',
  },
  {
    name: 'Agachamento Hack Machine',
    muscleGroup: 'Quadríceps',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Foco intenso nos quadríceps com suporte total para a coluna em plano inclinado guiado.',
    equipment: 'Máquina Hack Squat',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeightKg: 50,
    defaultRestSeconds: 90,
    adjustment: 'Ombros apoiados confortavelmente e pés posicionados na plataforma',
    execution: 'Agachar até flexionar joelhos em 90° e empurrar mantendo apoio nas costas',
    commonErrors: 'Tirar os calcanhares da plataforma durante a descida profunda',
  },

  // --- POSTERIOR DE COXA ---
  {
    name: 'Mesa Flexora (Posterior de Coxa)',
    muscleGroup: 'Posterior de Coxa',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Bíceps Femoral, Semitendíneo e Semimembranáceo (Isquiotibiais).',
    equipment: 'Máquina Mesa Flexora',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 25,
    defaultRestSeconds: 75,
    adjustment: 'Assento ajustado, apoio no peito/perna firme',
    execution: 'Flexionar joelhos trazendo os pés em direção aos glúteos, movimento controlado',
    commonErrors: 'Usar peso muito pesado, movimento muito rápido, não flexionar completamente',
  },
  {
    name: 'Stiff com Halteres ou Barra',
    muscleGroup: 'Posterior de Coxa',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Isquiotibiais e Glúteo Maior com ênfase no alongamento sob carga.',
    equipment: 'Halteres ou Barra Olímpica',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 20,
    defaultRestSeconds: 75,
    adjustment: 'Pés na largura do quadril, joelhos semi-flexionados',
    execution: 'Flexionar o quadril projetando os glúteos para trás mantendo a coluna neutra',
    commonErrors: 'Arredondar a coluna lombar, dobrar demais os joelhos',
  },
  {
    name: 'Cadeira Flexora Sentada',
    muscleGroup: 'Posterior de Coxa',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Isolamento dos isquiotibiais na posição sentada, alongando a origem muscular no quadril.',
    equipment: 'Cadeira Flexora Máquina',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 30,
    defaultRestSeconds: 60,
    adjustment: 'Apoio superior sobre as coxas bem firme e rolo no tendão de Aquiles',
    execution: 'Flexionar os joelhos até o limite amplitude e retornar devagar',
    commonErrors: 'Deixar o rolo correr para as panturrilhas ou elevar o quadril',
  },
  {
    name: 'Elevação Pélvica Unilateral (Single Leg Hip Thrust)',
    muscleGroup: 'Posterior de Coxa',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Correção de assimetrias entre pernas com alta demanda em posterior de coxa e glúteos.',
    equipment: 'Banco Reto',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeightKg: 0,
    defaultRestSeconds: 45,
    adjustment: 'Escápulas apoiadas no banco, uma perna elevada',
    execution: 'Elevar o quadril usando apenas uma perna com foco no calcanhar apoiado',
    commonErrors: 'Rodar a pelve para o lado suspenso',
  },

  // --- COSTAS ---
  {
    name: 'Remada Articulada com Apoio no Peito',
    muscleGroup: 'Costas',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Dorsal, Rombóides e Trapézio com zero estresse na lombar devido ao apoio de peitoral.',
    equipment: 'Remada Articulada Máquina',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 30,
    defaultRestSeconds: 75,
    adjustment: 'Assento ajustado, apoio no peito firme',
    execution: 'Puxar em direção ao peito, cotovelos altos, apertar as costas no final',
    commonErrors: 'Usar peso muito pesado, movimento incompleto, não apertar as costas',
  },
  {
    name: 'Puxada Frente Pegada Neutra (Triângulo)',
    muscleGroup: 'Costas',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Grande Dorsal e Redondo Maior com pegada neutra mais confortável para a articulação do ombro.',
    equipment: 'Pulldown com Triângulo',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 30,
    defaultRestSeconds: 75,
    adjustment: 'Polia alta, triângulo neutro',
    execution: 'Puxar em direção ao peito, cotovelos altos, movimento controlado',
    commonErrors: 'Usar peso muito pesado, movimento incompleto, não abrir completamente',
  },
  {
    name: 'Puxada Aberta na Frente (Pulley)',
    muscleGroup: 'Costas',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Grande Dorsal (Asas da costa), Redondo Maior e Bíceps Braquial.',
    equipment: 'Barra Larga na Polia Alta',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 30,
    defaultRestSeconds: 75,
    adjustment: 'Polia alta, barra larga',
    execution: 'Puxar barra até o peito, cotovelos altos, movimento controlled',
    commonErrors: 'Usar peso muito pesado, inclinar-se para trás, movimento incompleto',
  },
  {
    name: 'Remada Curvada com Barra',
    muscleGroup: 'Costas',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Dorsal, Rombóides, Trapézio Médio e Eretores da Coluna.',
    equipment: 'Barra Olímpica',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeightKg: 35,
    defaultRestSeconds: 105,
    adjustment: 'Pés na largura dos ombros, joelhos ligeiramente flexionados',
    execution: 'Puxar barra em direção ao abdômen, cotovelos altos, tronco ligeiramente inclinado',
    commonErrors: 'Arredondar as costas, usar momentum, não puxar completamente',
  },
  {
    name: 'Remada Baixa com Pegada Triângulo',
    muscleGroup: 'Costas',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Rombóides, dorsal e trapézio inferior em tração horizontal.',
    equipment: 'Polia Baixa com Triângulo',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 35,
    defaultRestSeconds: 60,
    adjustment: 'Apoio dos pés firme, coluna ereta',
    execution: 'Puxar até o abdômen contraindo as escápulas no final',
    commonErrors: 'Balançar o tronco excessivamente com impulso',
  },
  {
    name: 'Remada Unilateral com Halter (Serrote)',
    muscleGroup: 'Costas',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Grande dorsal e rombóides com excelente amplitude e estabilidade no banco.',
    equipment: 'Halter + Banco Reto',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 18,
    defaultRestSeconds: 60,
    adjustment: 'Joelho e mão do mesmo lado apoiados no banco',
    execution: 'Puxar o halter em direção ao quadril, mantendo o cotovelo rente ao corpo',
    commonErrors: 'Rodar o tronco para subir o peso ou esticar o pescoço',
  },
  {
    name: 'Pullover na Polia Alta com Barra Reta',
    muscleGroup: 'Costas',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Isolamento da grande dorsal sem participação do bíceps.',
    equipment: 'Polia Alta + Barra Reta ou Corda',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 20,
    defaultRestSeconds: 50,
    adjustment: 'Polia no ponto mais alto, joelhos levemente flexionados',
    execution: 'Puxar a barra com cotovelos semi-rígidos em arco até as coxas',
    commonErrors: 'Dobrar os cotovelos transformando o exercício em tríceps pulley',
  },

  // --- PEITO ---
  {
    name: 'Supino Reto com Halteres',
    muscleGroup: 'Peito',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Peitoral Maior, Peitoral Menor, Deltoide Anterior e Tríceps.',
    equipment: 'Halteres + Banco Reto',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeightKg: 18,
    defaultRestSeconds: 105,
    adjustment: 'Banco reto, pés totalmente apoiados no chão',
    execution: 'Descer halteres até altura do peito, empurrar acima, movimento controlado',
    commonErrors: 'Descer muito, não estender completamente, usar peso muito pesado',
  },
  {
    name: 'Supino Inclinado Máquina / Halter',
    muscleGroup: 'Peito',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Feixe Clavicular (Parte Superior do Peito) e Deltoide Anterior.',
    equipment: 'Máquina Inclinada ou Halteres',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeightKg: 22,
    defaultRestSeconds: 105,
    adjustment: 'Banco inclinado 30-45°, encosto firme',
    execution: 'Empurrar acima e ligeiramente para frente, movimento controlled',
    commonErrors: 'Inclinar muito, usar peso excessivo, não estender completamente',
  },
  {
    name: 'Crossover Polia Alta (Cruzamento de Cabos)',
    muscleGroup: 'Peito',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Peitoral Maior (porção inferior e esternal) com pico de contração em adução contínua.',
    equipment: 'Polias Altas',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 12,
    defaultRestSeconds: 50,
    adjustment: 'Polias altas, cabos ajustados',
    execution: 'Cruzar os cabos na frente do corpo, apertar o peito no final',
    commonErrors: 'Usar peso muito pesado, movimento incompleto, não apertar o peito',
  },
  {
    name: 'Peck Deck (Voador Peitoral Máquina)',
    muscleGroup: 'Peito',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Peitoral Maior com braços semi-flexionados em máquina guiada, ideal para controle de movimento.',
    equipment: 'Peck Deck / Voador',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 22,
    defaultRestSeconds: 50,
    adjustment: 'Assento ajustado, apoio nas costas firme',
    execution: 'Fechar os braços em frente ao corpo, apertar o peito, movimento controlado',
    commonErrors: 'Usar peso muito pesado, movimento muito rápido, não apertar completamente',
  },
  {
    name: 'Flexão de Braços no Solo (Push-Up)',
    muscleGroup: 'Peito',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Peitoral, Deltoide Anterior e Tríceps com ativação profunda de core.',
    equipment: 'Solo / Colchonete',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeightKg: 0,
    defaultRestSeconds: 60,
    adjustment: 'Mãos alinhadas na largura dos ombros',
    execution: 'Descer até o peito quase tocar o chão mantendo o tronco ereto',
    commonErrors: 'Hiperextensão lombar, cotovelos muito abertos em 90°',
  },
  {
    name: 'Supino Reto com Barra Olímpica',
    muscleGroup: 'Peito',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Exercício básico clássico para hipertrofia e força geral do peitoral maior.',
    equipment: 'Barra Olímpica + Banco Reto',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeightKg: 40,
    defaultRestSeconds: 90,
    adjustment: 'Olhos alinhados com a barra na trava',
    execution: 'Tocar suavemente o osso esterno e empurrar mantendo as escápulas retraídas',
    commonErrors: 'Kikar a barra no peitoral, abrir cotovelos em ângulo reto de 90°',
  },
  {
    name: 'Crossover Polia Baixa (Porção Clavicular)',
    muscleGroup: 'Peito',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Foco na porção superior do peito puxando os cabos de baixo para cima.',
    equipment: 'Polias Baixas',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 10,
    defaultRestSeconds: 50,
    adjustment: 'Polias ajustadas na posição mais baixa',
    execution: 'Elevar as manoplas unindo os braços na altura do queixo',
    commonErrors: 'Puxar com o bíceps ou usar excesso de balanço no tronco',
  },

  // --- BÍCEPS ---
  {
    name: 'Rosca Direta com Barra W',
    muscleGroup: 'Bíceps',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Bíceps Braquial (cabeça longa e curta) e Braquial anterior.',
    equipment: 'Barra W',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeightKg: 20,
    defaultRestSeconds: 75,
    adjustment: 'Em pé, pés na largura dos ombros',
    execution: 'Flexionar cotovelos trazendo barra até o peito, movimento controlado, descida lenta',
    commonErrors: 'Usar momentum, não estender completamente, cotovelos se movem',
  },
  {
    name: 'Rosca Martelo com Halteres',
    muscleGroup: 'Bíceps',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Braquiorradial e braquial anterior, fortalecendo a pegada e espessura.',
    equipment: 'Halteres',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 12,
    defaultRestSeconds: 60,
    adjustment: 'Em pé, pegada neutra',
    execution: 'Subir mantendo as palmas voltadas uma para a outra',
    commonErrors: 'Balançar o tronco para subir o peso',
  },
  {
    name: 'Rosca Alternada no Banco Inclinado',
    muscleGroup: 'Bíceps',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Máximo alongamento da cabeça longa do bíceps devido à posição recuada dos ombros.',
    equipment: 'Halteres + Banco 45°',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 10,
    defaultRestSeconds: 60,
    adjustment: 'Banco a 45° com as costas totalmente apoiadas',
    execution: 'Subir alternando ou simultâneo supinando o punho no topo do movimento',
    commonErrors: 'Projetar os cotovelos para frente durante a subida',
  },
  {
    name: 'Rosca Scott na Máquina ou Banco',
    muscleGroup: 'Bíceps',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Isolamento estrito da cabeça curta do bíceps eliminando impulsos do corpo.',
    equipment: 'Máquina Scott ou Banco Preacher + Barra W',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeightKg: 18,
    defaultRestSeconds: 60,
    adjustment: 'Apoio de braço ajustado na altura da axila',
    execution: 'Estender quase totalmente o braço e flexionar até o topo com controle',
    commonErrors: 'Soltar a barra bruscamente no final da fase excêntrica',
  },

  // --- TRÍCEPS ---
  {
    name: 'Tríceps Corda na Polia',
    muscleGroup: 'Tríceps',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Tríceps (cabeça lateral e medial) com pico de contração em extensão.',
    equipment: 'Polia alta, corda média',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 15,
    defaultRestSeconds: 50,
    adjustment: 'Polia alta, corda média',
    execution: 'Estender os cotovelos para baixo, separar as cordas no final, movimento controlado',
    commonErrors: 'Usar peso muito pesado, não estender completamente, cotovelos se movem',
  },
  {
    name: 'Tríceps Testa com Barra W',
    muscleGroup: 'Tríceps',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Cabeça longa do tríceps com elevado estímulo de hipertrofia.',
    equipment: 'Barra W + Banco Reto',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeightKg: 18,
    defaultRestSeconds: 75,
    adjustment: 'Deitado em banco reto, pés no chão',
    execution: 'Flexionar cotovelos trazendo a barra em direção à testa e estender',
    commonErrors: 'Abrir demais os cotovelos para os lados',
  },
  {
    name: 'Tríceps Pulley com Barra Reta ou V',
    muscleGroup: 'Tríceps',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Foco na cabeça lateral e medial do tríceps permitindo maior emprego de carga.',
    equipment: 'Polia Alta + Barra Reta / V',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 20,
    defaultRestSeconds: 60,
    adjustment: 'Polia no topo com barra travada no mosquetão',
    execution: 'Empurrar a barra para baixo mantendo os cotovelos colados às costelas',
    commonErrors: 'Inclinar o corpo sobre a barra usando o peso do peitoral',
  },
  {
    name: 'Mergulho nas Paralelas / Banco (Dips)',
    muscleGroup: 'Tríceps',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Exercício composto de peso corporal para tríceps e peitoral inferior.',
    equipment: 'Barras Paralelas ou Banco',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeightKg: 0,
    defaultRestSeconds: 75,
    adjustment: 'Empunhadura firme com tronco levemente ereto',
    execution: 'Flexionar cotovelos até 90° e empurrar o corpo de volta para o topo',
    commonErrors: 'Descer fundo demais sobrecarregando a cápsula articular do ombro',
  },

  // --- ABDÔMEN ---
  {
    name: 'Abdominal Crunch no Cabo',
    muscleGroup: 'Abdômen',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Reto Abdominal (flexão do tronco com sobrecarga contínua).',
    equipment: 'Polia alta, corda média',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 15,
    defaultRestSeconds: 50,
    adjustment: 'Polia alta, corda média',
    execution: 'Flexionar o tronco trazendo o queixo em direção ao peito, apertar abdômen no final',
    commonErrors: 'Usar peso muito pesado, puxar com os braços, movimento incompleto',
  },
  {
    name: 'Prancha Frontal Isométrica',
    muscleGroup: 'Abdômen',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Fortalecimento isométrico do transverso do abdômen e estabilidade do core.',
    equipment: 'Colchonete no solo',
    defaultSets: 3,
    defaultReps: 45,
    defaultWeightKg: 0,
    defaultRestSeconds: 45,
    adjustment: 'Antebraços e pontas dos pés apoiados no solo',
    execution: 'Manter corpo alinhado e abdômen contraído isometricamente',
    commonErrors: 'Deixar o quadril selar ou elevar em excesso',
  },
  {
    name: 'Elevação de Pernas na Barra Fixa / Paralela (Leg Raise)',
    muscleGroup: 'Abdômen',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Foco intenso na porção infra do reto abdominal e flexores de quadril.',
    equipment: 'Barra Fixa ou Estação Paralela',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 0,
    defaultRestSeconds: 60,
    adjustment: 'Suspenso na barra ou apoiado nos antebraços',
    execution: 'Elevar as pernas até formar 90° com o quadril com movimento controlado',
    commonErrors: 'Balançar o corpo usando inércia para subir as pernas',
  },
  {
    name: 'Abdominal Infra na Prancha Declinada',
    muscleGroup: 'Abdômen',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Fortalecimento progressivo do abdômen inferior contra a gravidade.',
    equipment: 'Prancha Declinada',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 0,
    defaultRestSeconds: 45,
    adjustment: 'Prancha com inclinação moderada',
    execution: 'Elevar a pelve descolando a lombar do banco no final da subida',
    commonErrors: 'Fazer apenas flexão de coxa sem enrolar a pelve',
  },

  // --- PANTURRILHA ---
  {
    name: 'Leg Press Máquina - Panturrilha no Leg Press',
    muscleGroup: 'Panturrilha',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Gastrocnêmio em extensão de joelho apoiada, com alongamento controlado do tendão de Aquiles.',
    equipment: 'Leg Press Máquina',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 50,
    defaultRestSeconds: 50,
    adjustment: 'Joelhos estendidos, pés na ponta na plataforma',
    execution: 'Elevar os calcanhares, movimento controlled, alongamento completo na descida',
    commonErrors: 'Usar peso muito pesado, movimento muito rápido, não alongar completamente',
  },
  {
    name: 'Gêmeos em Pé na Máquina (Panturrilha em Pé)',
    muscleGroup: 'Panturrilha',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Hipertrofia direta do gastrocnêmio medial e lateral com joelhos estendidos.',
    equipment: 'Máquina de Panturrilha em Pé',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 40,
    defaultRestSeconds: 50,
    adjustment: 'Apoio nos ombros confortável com metatartso no degrau',
    execution: 'Fazer extensão plantar máxima e pausar 1 segundo no topo',
    commonErrors: 'Dobrar os joelhos durante a subida (usando impulso dos quadríceps)',
  },
  {
    name: 'Gêmeos Sentado na Máquina (Sóleo)',
    muscleGroup: 'Panturrilha',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Isolamento do músculo sóleo com joelhos flexionados em 90°.',
    equipment: 'Banco de Panturrilha Sentado',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 30,
    defaultRestSeconds: 45,
    adjustment: 'Almofada de apoio firme sobre as coxas',
    execution: 'Descer o calcanhar ao máximo e subir até a ponta dos pés',
    commonErrors: 'Movimento "quicado" rápido sem controle da amplitude',
  },

  // --- TRAPÉZIO ---
  {
    name: 'Encolhimento de Ombros com Halteres',
    muscleGroup: 'Trapézio',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Isolamento do trapézio superior com halteres ao lado do corpo.',
    equipment: 'Halteres',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 20,
    defaultRestSeconds: 50,
    adjustment: 'Em pé, pés alinhados com o quadril',
    execution: 'Elevar os ombros verticalmente em direção às orelhas sem rotacionar',
    commonErrors: 'Rodar os ombros para frente ou flexionar os cotovelos',
  },
  {
    name: 'Encolhimento de Ombros na Barra pela Frente / Máquina',
    muscleGroup: 'Trapézio',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Permite maior carregamento de peso com barra olímpica ou máquina Smith.',
    equipment: 'Barra Olímpica ou Smith Machine',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 40,
    defaultRestSeconds: 60,
    adjustment: 'Barra ajustada na altura das coxas',
    execution: 'Elevar a barra verticalmente contraindo o trapézio no topo por 1 segundo',
    commonErrors: 'Usar impulso dos joelhos para subir a barra',
  },

  // --- ANTEBRAÇO ---
  {
    name: 'Rosca Inversa com Barra W (Antebraço & Braquiorradial)',
    muscleGroup: 'Antebraço',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Ativação potente do braquiorradial e extensores do antebraço com pegada pronada.',
    equipment: 'Barra W',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 14,
    defaultRestSeconds: 50,
    adjustment: 'Pegada pronada (palmas para baixo)',
    execution: 'Subir a barra flexionando os cotovelos sem abrir as mãos',
    commonErrors: 'Usar balanço do corpo ou soltar o pulso na subida',
  },
  {
    name: 'Rosca de Punho na Polia ou Banco (Flexores do Antebraço)',
    muscleGroup: 'Antebraço',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Isolamento dos flexores do punho para hipertrofia do antebraço e pegada firme.',
    equipment: 'Barra / Halter + Banco Reto',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeightKg: 12,
    defaultRestSeconds: 45,
    adjustment: 'Antebraços apoiados nas coxas ou banco com os punhos para fora',
    execution: 'Flexionar os punhos para cima segurando a barra e controlar a descida',
    commonErrors: 'Tirar os antebraços do apoio durante a flexão',
  },

  // --- AQUECIMENTO & MOBILIDADE OPCIONAIS ---
  {
    name: 'Rotação Externa de Ombro (Manguito Rotador na Polia / Elástico)',
    muscleGroup: 'Mobilidade',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Fortalecimento do supraespinhal, infraespinhal e redondo menor para proteção do ombro.',
    equipment: 'Polia Baixa ou Faixa Elástica Mini Band',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeightKg: 2,
    defaultRestSeconds: 30,
    adjustment: 'Polia na altura do cotovelo, cotovelo colado ao tronco em 90°',
    execution: 'Rotacionar o antebraço para fora sem afastar o cotovelo da costela',
    commonErrors: 'Usar peso excessivo e afastar o cotovelo do corpo',
  },
  {
    name: 'Moinho de Vento (Windmill Mobility)',
    muscleGroup: 'Mobilidade',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Desbloqueio de mobilidade torácica, quadril e estabilidade de ombro.',
    equipment: 'Peso Corporal ou Kettlebell Leve',
    defaultSets: 2,
    defaultReps: 10,
    defaultWeightKg: 0,
    defaultRestSeconds: 30,
    adjustment: 'Pés afastados em 45°, um braço estendido para o teto',
    execution: 'Descer a mão oposta em direção ao tornozelo olhando fixo para a mão no teto',
    commonErrors: 'Flexionar os joelhos excessivamente ou perder o olhar no braço do topo',
  },
  {
    name: 'Gato-Vaca (Cat-Cow Dynamic Stretch)',
    muscleGroup: 'Mobilidade',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Mobilização articular de toda a coluna vertebral pré e pós-treino.',
    equipment: 'Colchonete',
    defaultSets: 2,
    defaultReps: 12,
    defaultWeightKg: 0,
    defaultRestSeconds: 30,
    adjustment: '4 apoios, mãos abaixo dos ombros e joelhos abaixo do quadril',
    execution: 'Arredondar a coluna inspirando e arcar a coluna olhando para cima expirando',
    commonErrors: 'Forçar o pescoço de forma brusca',
  },
  {
    name: 'Mobilidade de Quadril em 90/90',
    muscleGroup: 'Mobilidade',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Aumento da rotação interna e externa do quadril para agachamentos profundos.',
    equipment: 'Solo / Colchonete',
    defaultSets: 2,
    defaultReps: 10,
    defaultWeightKg: 0,
    defaultRestSeconds: 30,
    adjustment: 'Sentado no solo com ambas as pernas dobradas em ângulos de 90°',
    execution: 'Rotacionar o quadril trocando os lados mantendo os calcanhares fixos',
    commonErrors: 'Arrastar o tronco sem focar no movimento do quadril',
  },
  {
    name: 'Agachamento Sumô com Kettlebell',
    muscleGroup: 'Glúteos',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Enfase em adutores e glúteo máximo com base aberta.',
    equipment: 'Kettlebell ou Halter Pesado',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 20,
    defaultRestSeconds: 60,
    adjustment: 'Pés bem abertos com pontas viradas 45° para fora',
    execution: 'Agachar projetando os joelhos na direção das pontas dos pés e espremer glúteos no topo',
    commonErrors: 'Deixar os joelhos valgarem para dentro',
  },
  {
    name: 'Coice de Glúteo na Polia (Cable Glute Kickback)',
    muscleGroup: 'Glúteos',
    gifUrl:
      '',
    muscleIllustrationUrl:
      '',
    muscleDescription: 'Isolamento do glúteo máximo com tração contínua da polia baixa.',
    equipment: 'Polia Baixa + Tornozeleira',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeightKg: 12,
    defaultRestSeconds: 45,
    adjustment: 'Tornozeleira presa na polia baixa, tronco levemente inclinado',
    execution: 'Estender a perna para trás contraindo o glúteo no pico sem hiperestender a lombar',
    commonErrors: 'Chutar com a lombar ao invés de usar o glúteo',
  },
];

/**
 * Retorna todos os exercícios disponíveis no catálogo
 */
export function getAllExerciseMediaPresets(): ExerciseMediaPreset[] {
  return EXERCISE_MEDIA_LIBRARY;
}

/**
 * Busca exercícios por grupo muscular
 */
export function getExerciseMediaPresetsByGroup(group: MuscleGroup): ExerciseMediaPreset[] {
  return EXERCISE_MEDIA_LIBRARY.filter((item) => {
    if (group === 'Posterior' || group === 'Posterior de Coxa') {
      return item.muscleGroup === 'Posterior' || item.muscleGroup === 'Posterior de Coxa';
    }
    return item.muscleGroup === group;
  });
}
