/**
 * Gym Companion — WarmUpSequenceModal
 * 5-Minute Dynamic Warm-Up Sequence tailored to scheduled session exercises.
 * Features guided interactive timer, drill step-by-step instructions, and target muscles.
 */

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Check,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  Activity,
  Dumbbell,
  ShieldCheck,
} from 'lucide-react';
import { Exercise, MuscleGroup } from '../types';
import { soundGenerator } from '../utils/audio';

interface WarmUpDrill {
  id: string;
  title: string;
  targetMuscles: string;
  durationSeconds: number;
  repsOrDurationText: string;
  instructions: string;
  tip: string;
}

interface WarmUpSequenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  workoutName?: string;
}

export function generateWarmUpSequence(exercises: Exercise[] = []): WarmUpDrill[] {
  const safeExercises = Array.isArray(exercises) ? exercises : [];
  const muscleGroups = Array.from(
    new Set(safeExercises.map((ex) => ex?.muscleGroup).filter(Boolean))
  ) as MuscleGroup[];

  const hasPeito = muscleGroups.some((m) => m === 'Peito');
  const hasCostas = muscleGroups.some((m) => m === 'Costas' || m === 'Trapézio');
  const hasOmbros = muscleGroups.some((m) => m === 'Ombros');
  const hasPernas = muscleGroups.some(
    (m) => m === 'Quadríceps' || m === 'Posterior' || m === 'Posterior de Coxa' || m === 'Glúteos' || m === 'Panturrilha'
  );
  const hasBracos = muscleGroups.some((m) => m === 'Bíceps' || m === 'Tríceps' || m === 'Antebraço');

  const drills: WarmUpDrill[] = [
    {
      id: 'drill-1',
      title: 'Polichinelos Suaves & Elevação Biorritmo',
      targetMuscles: 'Corpo Todo & Cardio Geral',
      durationSeconds: 60,
      repsOrDurationText: '60 segundos contínuos',
      instructions: 'Realize polichinelos em ritmo leve para elevar a frequência cardíaca, lubricar articulações e ativar a circulação sanguínea.',
      tip: 'Mantenha joelhos levemente flexionados na aterrissagem para proteger as articulações.',
    },
  ];

  if (hasPeito || hasOmbros || hasBracos) {
    drills.push({
      id: 'drill-upper-1',
      title: 'Rotação de Ombros & Circundução de Braços',
      targetMuscles: 'Deltoides, Manguito Rotador e Peitoral',
      durationSeconds: 60,
      repsOrDurationText: '30s para frente / 30s para trás',
      instructions: 'Abra os braços em cruz e faça pequenos círculos progressivos, ampliando o raio do movimento para aquecer o manguito e a cintura escapular.',
      tip: 'Ative o abdômen e não eleve excessivamente os ombros em direção às orelhas.',
    });
    drills.push({
      id: 'drill-upper-2',
      title: 'Abraço Dinâmico & Abertura Torácica',
      targetMuscles: 'Peito, Bíceps e Trapézio Superior',
      durationSeconds: 60,
      repsOrDurationText: '20 repetições dinâmicas',
      instructions: 'Cruzamento alternado dos braços à frente do peito e abertura máxima atrás, mobilizando a cavidade torácica e escápulas.',
      tip: 'Sinta o alongamento dinâmico do peitoral sem forçar o final do arco.',
    });
  }

  if (hasCostas) {
    drills.push({
      id: 'drill-back-1',
      title: 'Gato-Camelo & Mobilidade de Coluna',
      targetMuscles: 'Dorsais, Paravertebrais e Core',
      durationSeconds: 60,
      repsOrDurationText: '12 a 15 ciclos suaves',
      instructions: 'Em 4 apoios no solo ou em pé com apoio nos joelhos, alterne entre arcar a coluna para cima (gato) e selar a lombar olhando à frente (camelo).',
      tip: 'Sincronize com a respiração: solte o ar ao arcar a coluna para cima.',
    });
  }

  if (hasPernas) {
    drills.push({
      id: 'drill-lower-1',
      title: 'Agachamento Corporal Profundo com Pausa',
      targetMuscles: 'Quadríceps, Glúteos e Tornozelos',
      durationSeconds: 60,
      repsOrDurationText: '12 a 15 repetições controladas',
      instructions: 'Agache apenas com o peso do corpo até o ponto mais fundo mantendo os calcanhares no chão. Faça uma pausa de 1 segundo embaixo antes de subir.',
      tip: 'Empurre os joelhos para fora na direção das pontas dos pés.',
    });
    drills.push({
      id: 'drill-lower-2',
      title: 'Passada Dinâmica com Torção de Troncoc',
      targetMuscles: 'Flexores de Quadril, Glúteos e Core',
      durationSeconds: 60,
      repsOrDurationText: '10 passadas alternadas',
      instructions: 'Dê um passo longo à frente em afundo e rode o tronco para o lado da perna que está à frente, liberando o quadril.',
      tip: 'Mantenha o tronco ereto e o joelho de trás quase tocando o solo.',
    });
  }

  // Fallback if sequence is short
  if (drills.length < 5) {
    drills.push({
      id: 'drill-core',
      title: 'Prancha Dinâmica com Toque de Ombros',
      targetMuscles: 'Core, Estabilizadores & Ombros',
      durationSeconds: 60,
      repsOrDurationText: '60 segundos ritmados',
      instructions: 'Em posição de flexão de braço, toque alternadamente a mão esquerda no ombro direito e vice-versa sem balançar o quadril.',
      tip: 'Afaste um pouco os pés para garantir maior estabilidade no quadril.',
    });
  }

  if (drills.length < 5) {
    drills.push({
      id: 'drill-final',
      title: 'Série de Aativação Específica na Máquina/Barra',
      targetMuscles: 'Grupamento Principal do 1º Exercício',
      durationSeconds: 60,
      repsOrDurationText: '15 a 20 reps com 30% da carga',
      instructions: 'Aproxime-se do primeiro aparelho do seu treino e execute uma série muito leve focando na técnica perfeita e na conexão mente-músculo.',
      tip: 'Esta série prepara os receptores neuromusculares para as cargas pesadas.',
    });
  }

  return drills.slice(0, 5);
}

export const WarmUpSequenceModal: React.FC<WarmUpSequenceModalProps> = ({
  isOpen,
  onClose,
  exercises,
  workoutName,
}) => {
  const [drills, setDrills] = useState<WarmUpDrill[]>([]);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [drillSecondsLeft, setDrillSecondsLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedDrillIds, setCompletedDrillIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      const generated = generateWarmUpSequence(exercises);
      setDrills(generated);
      setCurrentDrillIndex(0);
      setDrillSecondsLeft(generated[0]?.durationSeconds || 60);
      setIsTimerRunning(false);
      setCompletedDrillIds(new Set());
    }
  }, [isOpen, exercises]);

  const activeDrill = drills[currentDrillIndex] || drills[0];

  // Timer Interval Effect
  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning && drillSecondsLeft > 0) {
      timer = setInterval(() => {
        setDrillSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && drillSecondsLeft === 0) {
      // Drill Finished!
      soundGenerator.playTimerBeep();
      setCompletedDrillIds((prev) => new Set(prev).add(activeDrill.id));

      if (currentDrillIndex < drills.length - 1) {
        // Advance to next drill
        const nextIndex = currentDrillIndex + 1;
        setCurrentDrillIndex(nextIndex);
        setDrillSecondsLeft(drills[nextIndex].durationSeconds || 60);
      } else {
        // All drills complete!
        setIsTimerRunning(false);
        try {
          soundGenerator.playFanfare();
        } catch (e) {
          console.log(e);
        }
      }
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, drillSecondsLeft, currentDrillIndex, drills, activeDrill]);

  if (!isOpen) return null;

  const toggleTimer = () => setIsTimerRunning((prev) => !prev);

  const resetDrillTimer = () => {
    setIsTimerRunning(false);
    setDrillSecondsLeft(activeDrill?.durationSeconds || 60);
  };

  const handleNextDrill = () => {
    setCompletedDrillIds((prev) => new Set(prev).add(activeDrill.id));
    if (currentDrillIndex < drills.length - 1) {
      const nextIndex = currentDrillIndex + 1;
      setCurrentDrillIndex(nextIndex);
      setDrillSecondsLeft(drills[nextIndex].durationSeconds || 60);
      setIsTimerRunning(false);
    }
  };

  const toggleDrillCompletedManually = (id: string) => {
    setCompletedDrillIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalCompleted = completedDrillIds.size;
  const isAllComplete = totalCompleted === drills.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0F0F11] border border-amber-500/30 p-5 sm:p-7 text-white shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black font-black shadow-lg shadow-amber-500/20">
              <Flame className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  AQUECIMENTO DINÂMICO (5 MINUTOS)
                </span>
                {workoutName && (
                  <span className="text-xs text-slate-400 font-bold">• {workoutName}</span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Sequência de Mobilidade e Ativação
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Interactive Active Drill Banner & Timer */}
        {activeDrill && (
          <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-black to-slate-900/80 p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                  ETAPA {currentDrillIndex + 1} DE {drills.length} • {activeDrill.targetMuscles}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">{activeDrill.title}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{activeDrill.instructions}</p>
              </div>

              {/* Timer Block */}
              <div className="flex items-center gap-3 self-center sm:self-auto bg-black/60 p-3 rounded-2xl border border-white/10">
                <div className="text-center min-w-[70px]">
                  <span className="text-2xl font-mono font-black text-amber-400 block">
                    {Math.floor(drillSecondsLeft / 60)}:
                    {(drillSecondsLeft % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Cronômetro</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={toggleTimer}
                    className={`p-2.5 rounded-xl font-bold text-xs transition active:scale-95 ${
                      isTimerRunning
                        ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    title={isTimerRunning ? 'Pausar' : 'Iniciar'}
                  >
                    {isTimerRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
                  </button>
                  <button
                    onClick={resetDrillTimer}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                    title="Reiniciar etapa"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNextDrill}
                    className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                    title="Próxima etapa"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-amber-300/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 flex items-center gap-2">
              <Zap className="h-4 w-4 shrink-0 text-amber-400" />
              <span><strong>Dica de Execução:</strong> {activeDrill.tip}</span>
            </div>
          </div>
        )}

        {/* Drill Progress Checklist */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
            <span>TODAS AS ETAPAS DO AQUECIMENTO</span>
            <span className="text-amber-400 font-extrabold">
              {totalCompleted} / {drills.length} Concluídas
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {(drills || []).map((drill, idx) => {
              const isCurrent = idx === currentDrillIndex;
              const isDone = completedDrillIds.has(drill.id);

              return (
                <div
                  key={drill.id}
                  onClick={() => {
                    setCurrentDrillIndex(idx);
                    setDrillSecondsLeft(drill.durationSeconds);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                      : isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 opacity-80'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDrillCompletedManually(drill.id);
                      }}
                      className={`flex h-7 w-7 items-center justify-center rounded-xl border transition ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-400 text-black font-black'
                          : 'border-white/20 text-transparent hover:border-amber-400'
                      }`}
                    >
                      <Check className="h-4 w-4 stroke-[3]" />
                    </button>

                    <div>
                      <h4 className={`text-xs font-bold ${isCurrent ? 'text-amber-300' : isDone ? 'text-emerald-300' : 'text-white'}`}>
                        {idx + 1}. {drill.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">{drill.targetMuscles} • {drill.repsOrDurationText}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {drill.durationSeconds}s
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onClose}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm transition active:scale-95 flex items-center justify-center gap-2 shadow-xl ${
              isAllComplete
                ? 'bg-gradient-to-r from-emerald-400 to-lime-400 text-black shadow-emerald-500/20'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-amber-500/20'
            }`}
          >
            <ShieldCheck className="h-5 w-5" />
            <span>
              {isAllComplete
                ? '✓ Aquecimento Concluído! Iniciar Treino Principal'
                : 'Concluir Aquecimento e Ir ao Treino'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
