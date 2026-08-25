/**
 * Gym Companion v2.0 — Treinos Opcionais & Complementares Library
 * Categories: Mobilidade, Alongamento, Yoga, Cardio, Abdominal, Panturrilhas, Respiração, Liberação Miofascial, Fisioterapia
 */

export interface OptionalWorkoutItem {
  id: string;
  category:
    | 'Mobilidade'
    | 'Alongamento'
    | 'Yoga'
    | 'Cardio'
    | 'Abdominal'
    | 'Panturrilhas'
    | 'Respiração'
    | 'Liberação Miofascial'
    | 'Fisioterapia';
  title: string;
  subtitle: string;
  estimatedDurationMinutes: number;
  icon: string;
  imageUrl: string;
  gifUrl?: string;
  videoUrl?: string;
  notes?: string;
  exercises: {
    name: string;
    setsOrDuration: string;
    restSeconds: number;
    description: string;
    imageUrl?: string;
    gifUrl?: string;
    videoUrl?: string;
  }[];
}

export const OPTIONAL_WORKOUTS: OptionalWorkoutItem[] = [
  {
    id: 'opt-1',
    category: 'Mobilidade',
    title: 'Mobilidade Articular de Quadril & Torácica',
    subtitle: 'Destrava articulações antes de treinos pesados de perna ou costas',
    estimatedDurationMinutes: 12,
    icon: 'Activity',
    imageUrl: '',
    gifUrl: '',
    notes: 'Realizar de forma fluida sem trancos. Respire fundo a cada extensão.',
    exercises: [
      { name: 'Rotação Interna/Externa 90/90', setsOrDuration: '2x 10 reps cada lado', restSeconds: 30, description: 'Sentado com joelhos a 90°, gire o quadril trocando o lado sem levantar os pés do chão.' },
      { name: 'World Greatest Stretch', setsOrDuration: '2x 8 reps cada lado', restSeconds: 30, description: 'Afundo profundo com rotação de tronco abrindo o peito para o teto.' },
      { name: 'Gato-Vaca Torácico', setsOrDuration: '2x 12 reps', restSeconds: 30, description: 'Em 4 apoios, flexione e estenda a coluna coordenando com a respiração.' },
    ],
  },
  {
    id: 'opt-2',
    category: 'Alongamento',
    title: 'Alongamento Estático Pós-Treino',
    subtitle: 'Relaxamento muscular e recuperação de amplitude',
    estimatedDurationMinutes: 15,
    icon: 'Maximize2',
    imageUrl: '',
    notes: 'Segurar cada posição por pelo menos 30 segundos sem dor excessiva.',
    exercises: [
      { name: 'Alongamento de Isquiotibiais em Pé', setsOrDuration: '2x 45s', restSeconds: 20, description: 'Mantenha joelhos estendidos e dobre o tronco para frente tentando tocar os pés.' },
      { name: 'Alongamento de Peitoral na Parede', setsOrDuration: '2x 45s cada lado', restSeconds: 20, description: 'Aapoie o antebraço na parede e rode o corpo para o lado oposto.' },
      { name: 'Alongamento de Flexores de Quadril', setsOrDuration: '2x 45s cada lado', restSeconds: 20, description: 'Ajoelhado em afundo, projete o quadril levemente à frente mantendo o tronco ereto.' },
    ],
  },
  {
    id: 'opt-3',
    category: 'Yoga',
    title: 'Flow Vinyasa de Força & Equilíbrio',
    subtitle: 'Série fluida para postura, estabilidade e foco mental',
    estimatedDurationMinutes: 20,
    icon: 'Sparkles',
    imageUrl: '',
    notes: 'Ideal para dias de descanso ativo.',
    exercises: [
      { name: 'Saudação ao Sol A (Surya Namaskar)', setsOrDuration: '5 ciclos', restSeconds: 15, description: 'Sequência dinâmica conectando respiração e movimento.' },
      { name: 'Postura do Guerreiro II (Virabhadrasana II)', setsOrDuration: '3x 30s cada lado', restSeconds: 20, description: 'Afundo lateral com braços estendidos e olhar fixo à frente.' },
      { name: 'Postura da Árvore (Vrksasana)', setsOrDuration: '2x 45s cada lado', restSeconds: 20, description: 'Equilíbrio unipodal focado na estabilidade de tornozelo e quadril.' },
    ],
  },
  {
    id: 'opt-4',
    category: 'Cardio',
    title: 'HIIT Tabata de Alta Queima Calórica',
    subtitle: 'Protocolo intenso de 20s de esforço e 10s de descanso',
    estimatedDurationMinutes: 16,
    icon: 'Zap',
    imageUrl: '',
    notes: 'Manter a intensidade máxima durante os 20 segundos.',
    exercises: [
      { name: 'Polichinelos Acelerados', setsOrDuration: '8 tiros de 20s (10s descanso)', restSeconds: 10, description: 'Ritmo forte coordenando pernas e braços.' },
      { name: 'Mountain Climbers (Escalador)', setsOrDuration: '8 tiros de 20s (10s descanso)', restSeconds: 10, description: 'Em prancha alta, traga os joelhos em direção ao peito alternando rapidamente.' },
      { name: 'Corrida Estacionária com Elevação de Joelhos', setsOrDuration: '8 tiros de 20s (10s descanso)', restSeconds: 10, description: 'Eleve os joelhos até a altura da cintura em velocidade máxima.' },
    ],
  },
  {
    id: 'opt-5',
    category: 'Abdominal',
    title: 'Série Core de Aço & Estabilidade',
    subtitle: 'Fortalecimento do reto abdominal, oblíquos e transverso',
    estimatedDurationMinutes: 14,
    icon: 'Shield',
    imageUrl: '',
    notes: 'Contração consciente da musculatura em cada repetição.',
    exercises: [
      { name: 'Prancha Frontal Isométrica', setsOrDuration: '3x 60s', restSeconds: 30, description: 'Manter quadril neutro sem selar a lombar.' },
      { name: 'Abdominal Supra na Polia ou Chão', setsOrDuration: '3x 20 reps', restSeconds: 30, description: 'Flexão de tronco soltando o ar na subida.' },
      { name: 'Abdominal Infra na Barra (Elevação de Pernas)', setsOrDuration: '3x 15 reps', restSeconds: 30, description: 'Elevação controlada do quadril sem balanço.' },
    ],
  },
  {
    id: 'opt-6',
    category: 'Panturrilhas',
    title: 'Especialização de Panturrilha em Bloco',
    subtitle: 'Estímulo de hipertrofia para Sóleo e Gastrocnêmio',
    estimatedDurationMinutes: 10,
    icon: 'Dumbbell',
    imageUrl: '',
    notes: 'Pausa de 2 segundos no pico de contração e na máxima extensão.',
    exercises: [
      { name: 'Gêmeos em Pé (No Degrau ou Smith)', setsOrDuration: '4x 15 reps', restSeconds: 45, description: 'Amplitude total descendo o calcanhar o máximo possível.' },
      { name: 'Gêmeos Sentado (Cadeira de Panturrilha)', setsOrDuration: '4x 20 reps', restSeconds: 45, description: 'Foco no músculo Sóleo com ritmo cadenciado (3s descida).' },
    ],
  },
  {
    id: 'opt-7',
    category: 'Respiração',
    title: 'Protocolo de Respiração de Recuperação (Box Breathing)',
    subtitle: 'Redução do cortisol e ativação parassimpática imediata',
    estimatedDurationMinutes: 8,
    icon: 'Wind',
    imageUrl: '',
    notes: 'Sente-se confortavelmente com as costas eretas e olhos fechados.',
    exercises: [
      { name: 'Respiração Quadrada (4s-4s-4s-4s)', setsOrDuration: '10 minutos', restSeconds: 0, description: 'Inspire em 4s, segure por 4s, expire em 4s, segure pulmão vazio por 4s.' },
    ],
  },
  {
    id: 'opt-8',
    category: 'Liberação Miofascial',
    title: 'Rolo de Liberação Miofascial (Foam Roller)',
    subtitle: 'Alívio de nós de tensão e melhoria do fluxo sanguíneo',
    estimatedDurationMinutes: 12,
    icon: 'Circle',
    imageUrl: '',
    notes: 'Passe o rolo lentamente encontrando os pontos de gatilho.',
    exercises: [
      { name: 'Liberação de Quadríceps e TI', setsOrDuration: '2x 90s cada perna', restSeconds: 15, description: 'Deslize o rolo da espinha ilíaca até acima do joelho.' },
      { name: 'Liberação de Dorsais e Latíssimo', setsOrDuration: '2x 90s cada lado', restSeconds: 15, description: 'Deite de lado com o rolo abaixo da axila e deslize pelas costas.' },
    ],
  },
  {
    id: 'opt-9',
    category: 'Fisioterapia',
    title: 'Estabilização de Manguito Rotador & Joelho',
    subtitle: 'Prevenção de lesões e fortalecimento de estabilizadores',
    estimatedDurationMinutes: 15,
    icon: 'HeartPulse',
    imageUrl: '',
    notes: 'Cargas leves e focar puramente no controle motor.',
    exercises: [
      { name: 'Rotação Externa com Elástico / Polia (Manguito)', setsOrDuration: '3x 15 reps cada lado', restSeconds: 30, description: 'Cotovelo colado à costela, gire o antebraço para fora.' },
      { name: 'Caminhada Lateral com Mini Band (Glúteo Médio)', setsOrDuration: '3x 12 passos cada lado', restSeconds: 30, description: 'Joelho levemente flexionado, passos mantendo tensão na faixa.' },
    ],
  },
];
