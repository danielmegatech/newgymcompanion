/**
 * Gym Companion — PROJETO GLOW UP 2026 — FICHA DE TREINO & APOSTILA DO DANIEL
 * Documento Oficial Consolidado • Ficha ABCD Personalizada
 *
 * Estrutura:
 * - Filosofia: A e B como Programa Principal (Full Body), C e D como Sessões Opcionais (3–4x/semana).
 * - Cargas Iniciais de Referência e Regras de Progressão (10 -> 11 -> 12 reps antes de subir peso).
 * - Proteção Articular: Joelho Direito e Ombro Direito (Escala de Dor 0–10).
 * - Nutrição Econômica: 120–140g de proteína/dia e 3L de água.
 */

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Award,
  Utensils,
  TrendingUp,
  Flame,
  CheckCircle2,
  ShieldAlert,
  Dumbbell,
  Clock,
  Sparkles,
  Copy,
  Check,
  Activity,
  FileText,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  AlertOctagon,
  HeartHandshake,
} from 'lucide-react';
import { useGym } from '../context/GymContext';

interface ApostilaGlowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApostilaGlowUpModal: React.FC<ApostilaGlowUpModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    'filosofia' | 'perfil' | 'limitacoes' | 'treinoA' | 'treinoB' | 'treinoC' | 'treinoD' | 'progressao' | 'nutricao' | 'registro'
  >('filosofia');
  const [copied, setCopied] = useState(false);

  const { workouts, bodyConfig, activeProfile } = useGym();

  if (!isOpen) return null;

  const handleCopyFullPlan = () => {
    const fullText = `# 🏋️ PROJETO GLOW UP 2026 — FICHA ABCD DO DANIEL
Aluno: Daniel • Idade: 37 anos • Altura: 1,68 m • Peso: 77 kg • Nível: Iniciante (2x/semana base)
Objetivo: Recomposição Corporal (Perder gordura e ganhar massa muscular com dor zero)

---
## 🌟 FILOSOFIA DO PROGRAMA ABCD
- **A e B são o PROGRAMA PRINCIPAL (Full Body)**: Mantêm peito, costas, pernas e braços recebendo estímulo duas vezes por semana.
- **C e D são SESSÕES OPCIONAIS**: Para quando você conseguir treinar 3–4 vezes na semana.
  - 2 dias na semana: Treino A + Treino B
  - 3 dias na semana: Treino A + Treino B + Treino C (Superior)
  - 4 dias na semana: Treino A + Treino B + Treino C + Treino D (Inferior + Cardio)
- **Cargas de Referência**: A carga correta é aquela que permite completar as séries com técnica e sem dor articular.

---
## 🛡️ REGRAS DE SEGURANÇA ARTICULAR (JOELHO & OMBRO DIREITO)
- **Escala de Dor (0 a 10)**:
  - 0–2/10: Desconforto pequeno e controlável → observar.
  - 3–4/10: Reduzir carga/amplitude e reavaliar.
  - 5+/10: PARAR o exercício imediatamente.
- **Joelho Direito**: Controle excêntrico em 3 segundos, sem rebote e sem valgo.
- **Ombro Direito**: Proibida elevação lateral pesada; Chest Press com escápulas travadas; Face Pull e Rotação Externa obrigatórios.

---
## 🔴 TREINO A — FULL BODY 1 (Ênfase Peito + Quadríceps) ⭐ PRINCIPAL
1. Bike (Aquecimento) — 10 min leve/moderada
2. Leg Press 45° — 40 kg | 3 × 12 | Descanso: 90s | Cadência: 3-1-2 (⚠️ Atenção joelho)
3. Mesa Flexora — 15 kg | 3 × 12 | Descanso: 75s | Cadência: 2-1-3
4. Panturrilha Sentado — 20 kg | 4 × 15 | Descanso: 45s | Cadência: 2-2-2
5. Chest Press — 20 kg | 3 × 10 | Descanso: 90s | Cadência: 2-1-3 (⚠️ Atenção ombro)
6. Peck Deck — 15 kg | 3 × 12 | Descanso: 75s | Cadência: 2-1-3 (⚠️ Atenção ombro)
7. Puxada Frontal (Lat Pulldown) — 25 kg | 3 × 12 | Descanso: 90s | Cadência: 2-1-3
8. Remada Sentada (Seated Cable Row) — 20 kg | 3 × 12 | Descanso: 90s | Cadência: 2-1-3
9. Rosca Máquina (Machine Biceps Curl) — 10 kg | 3 × 12 | Descanso: 60s
10. Tríceps Corda (Rope Triceps Pushdown) — 10 kg | 3 × 12 | Descanso: 60s
11. Flexão de Punhos — 5 kg | 3 × 15 | Descanso: 45s
12. Extensão de Punhos — 4 kg | 3 × 15 | Descanso: 45s
13. Abdominal Máquina — 15 kg | 3 × 15 | Descanso: 45s
14. Bike (Cardio Final) — 20 min leve/moderada + 5 min desaquecimento

---
## 🔵 TREINO B — FULL BODY 2 (Ênfase Costas + Posterior & Ombro) ⭐ PRINCIPAL
1. Bike (Aquecimento) — 10 min
2. Cadeira Extensora — 15 kg | 3 × 12 | Descanso: 75s | Cadência: 2-1-3 (⚠️ Atenção joelho)
3. Mesa Flexora — 20 kg | 3 × 12 | Descanso: 75s | Cadência: 2-1-3
4. Hip Thrust Máquina — 20 kg | 3 × 12 | Descanso: 90s | Cadência: 2-1-2
5. Panturrilha em Pé — 20 kg | 4 × 15 | Descanso: 45s | Cadência: 2-2-2
6. Adução (Cadeira Adutora) — 20 kg | 3 × 15 | Descanso: 45s
7. Chest Press Inclinado — 20 kg | 3 × 10 | Descanso: 90s | Cadência: 2-1-3 (⚠️ Atenção ombro)
8. Pullover Máquina — 15 kg | 3 × 12 | Descanso: 75s | Cadência: 2-1-3
9. Remada Máquina — 20 kg | 3 × 12 | Descanso: 90s | Cadência: 2-1-3
10. Face Pull com Corda — 5 kg (5–7,5 kg) | 3 × 15 | Descanso: 60s (🛡️ Proteção Ombro)
11. Rotação Externa no Cabo — 2.5 kg | 3 × 15 | Descanso: 45s (🛡️ Manguito)
12. Rosca Martelo na Corda — 10 kg | 3 × 12 | Descanso: 60s
13. Tríceps Barra no Cabo — 10 kg | 3 × 12 | Descanso: 60s
14. Abdominal Máquina — 20 kg | 3 × 15 | Descanso: 45s
15. Oblíquo na Polia — 10 kg | 3 × 12 cada lado | Descanso: 45s
16. Crunch Inclinado — Peso Corporal (0 kg) | 3 × 15 | Descanso: 45s
17. Bike (Cardio Final) — 20 min + 5 min desaquecimento

---
## 🟡 TREINO C — SUPERIOR (Peito + Costas + Braços) (Opcional - 3ª Sessão)
1. Chest Press — 20 kg | 3 × 10 | 90s
2. Lat Pulldown — 25 kg | 3 × 12 | 90s
3. Machine Row — 20 kg | 3 × 12 | 90s
4. Peck Deck — 15 kg | 3 × 12 | 75s
5. Machine Biceps Curl — 10 kg | 3 × 12 | 60s
6. Rope Triceps Pushdown — 10 kg | 3 × 12 | 60s
7. Face Pull — 5 kg | 3 × 15 | 60s
8. Wrist Curl — 5 kg | 3 × 15 | 45s
9. Reverse Wrist Curl — 4 kg | 3 × 15 | 45s
10. Bike (Cardio) — 20 min

---
## 🟢 TREINO D — INFERIOR + CARDIO (Pernas + Glúteos + Panturrilha + Core) (Opcional - 4ª Sessão)
1. Leg Press 45° — 40 kg | 3 × 12 | 90s
2. Leg Extension — 15 kg | 3 × 12 | 75s
3. Leg Curl — 20 kg | 3 × 12 | 75s
4. Hip Thrust (Máquina) — 20 kg | 3 × 12 | 90s
5. Hip Abduction (Abdutora) — 20 kg | 3 × 15 | 45s
6. Hip Adduction (Adutora) — 20 kg | 3 × 15 | 45s
7. Standing Calf Raise — 20 kg | 4 × 15 | 45s
8. Abdominal Machine — 20 kg | 3 × 15 | 45s
9. Bike (Cardio) — 20 min

---
## 📈 REGRA DE PROGRESSÃO INTELIGENTE
1. **Primeiro aumentamos repetições dentro da faixa**: Ex: 10 -> 11 -> 12 repetições com a mesma carga e técnica limpa.
2. **Depois aumentamos carga**: Apenas após completar o topo da faixa em todas as séries.
3. **Depois reconstruímos as repetições**: Voltamos para a base (10 reps) com a nova carga e subimos novamente.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-lime-500/30 bg-[#0F0F11] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4 sm:p-6 bg-gradient-to-r from-lime-500/10 via-cyan-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-500 text-black shadow-lg shadow-lime-500/20">
              <BookOpen className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-xl font-black text-white">
                  Projeto Glow Up 2026 — Ficha ABCD do Daniel
                </h3>
                <span className="rounded-full bg-lime-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-lime-400 border border-lime-500/30">
                  Full Body A+B Base
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Documento Clínico e Prescrição • A e B Principal • C e D Opcionais • Proteção Articular
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyFullPlan}
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white px-3 py-2 text-xs font-bold transition-all"
              title="Copiar texto completo"
            >
              {copied ? <Check className="h-4 w-4 text-lime-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copiado!' : 'Copiar Plano'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-white/10 bg-[#0A0A0B]/90 px-4 pt-2 gap-1.5 shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('filosofia')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'filosofia'
                ? 'border-lime-500 text-lime-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>1. Filosofia ABCD</span>
          </button>

          <button
            onClick={() => setActiveTab('perfil')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'perfil'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>2. Perfil & Medidas</span>
          </button>

          <button
            onClick={() => setActiveTab('limitacoes')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'limitacoes'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            <span>3. Proteção Joelho & Ombro</span>
          </button>

          <button
            onClick={() => setActiveTab('treinoA')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'treinoA'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="h-3.5 w-3.5 text-emerald-400" />
            <span>4. Treino A (Principal)</span>
          </button>

          <button
            onClick={() => setActiveTab('treinoB')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'treinoB'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="h-3.5 w-3.5 text-cyan-400" />
            <span>5. Treino B (Principal)</span>
          </button>

          <button
            onClick={() => setActiveTab('treinoC')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'treinoC'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="h-3.5 w-3.5 text-amber-400" />
            <span>6. Treino C (Opcional)</span>
          </button>

          <button
            onClick={() => setActiveTab('treinoD')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'treinoD'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="h-3.5 w-3.5 text-violet-400" />
            <span>7. Treino D (Opcional)</span>
          </button>

          <button
            onClick={() => setActiveTab('progressao')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'progressao'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
            <span>8. Regras de Progressão</span>
          </button>

          <button
            onClick={() => setActiveTab('nutricao')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'nutricao'
                ? 'border-lime-500 text-lime-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Utensils className="h-3.5 w-3.5" />
            <span>9. Nutrição Econômica</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: FILOSOFIA ABCD */}
          {activeTab === 'filosofia' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-3xl border border-lime-500/20 bg-gradient-to-b from-lime-500/10 to-transparent p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-500/20 text-lime-400 border border-lime-500/30">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">
                      A e B como Programa Principal • C e D como Sessões Opcionais
                    </h4>
                    <p className="text-xs text-slate-300">
                      Entendendo o porquê desta distribuição estratégica para o seu perfil iniciante
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <p>
                    Como você é iniciante, treina apenas <strong>2×/semana atualmente</strong> e tem histórico de problema no joelho e dor importante no ombro direito, <strong>não queremos simplesmente dividir o corpo em quatro partes</strong> e reduzir a frequência de cada músculo para apenas 1 vez a cada 14 dias.
                  </p>
                  <p className="rounded-2xl bg-black/40 p-4 border border-lime-500/20 text-lime-300 font-medium">
                    ✨ <strong>A e B continuam Full Body</strong>, garantindo que peito, costas, pernas e braços recebam estímulo duas vezes por semana com altíssima eficiência metabólica e recuperação ideal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="rounded-2xl bg-black/40 p-4 border border-white/5 space-y-2">
                    <span className="text-[11px] font-bold text-lime-400 uppercase tracking-wider block">
                      Se Treinar 2x / Semana
                    </span>
                    <p className="text-xs text-white font-black">Treino A + Treino B</p>
                    <p className="text-[11px] text-slate-400">
                      Sua rotina base garantida. Todo o corpo estimulado 2x na semana com descanso perfeito no meio.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/40 p-4 border border-white/5 space-y-2">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                      Se Treinar 3x / Semana
                    </span>
                    <p className="text-xs text-white font-black">Treino A + Treino B + Treino C</p>
                    <p className="text-[11px] text-slate-400">
                      Adicione a sessão C (Superior: Peito, Costas e Braços) como bônus de hipertrofia.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/40 p-4 border border-white/5 space-y-2">
                    <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider block">
                      Se Treinar 4x / Semana
                    </span>
                    <p className="text-xs text-white font-black">Treino A + B + C + D</p>
                    <p className="text-[11px] text-slate-400">
                      Aproveite o Treino D (Inferior + Cardio + Core) para máxima queima e reforço de glúteos e pernas.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-500/10 p-4 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                  <strong>⚠️ Importante sobre as Cargas de Referência:</strong>
                  <p>
                    As cargas indicadas são <strong>cargas iniciais de referência</strong>. A carga correta é aquela que permite completar as séries com técnica perfeita e sem dor. Não é necessário atingir exatamente o número indicado na primeira sessão.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERFIL & MEDIDAS */}
          {activeTab === 'perfil' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-3xl border border-white/10 bg-[#0A0A0B] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-sm font-black uppercase text-lime-400 tracking-wider flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Perfil Oficial do Aluno</span>
                  </h4>
                  <span className="text-xs text-slate-400 font-bold">Glow Up 2026 — Lisboa</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5 space-y-1">
                    <span className="text-slate-400 font-medium">Nome & Idade</span>
                    <p className="text-sm font-black text-white">Daniel • 37 anos</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5 space-y-1">
                    <span className="text-slate-400 font-medium">Altura & Peso</span>
                    <p className="text-sm font-black text-white">1,68 m • 77 kg</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5 space-y-1">
                    <span className="text-slate-400 font-medium">Nível & Frequência</span>
                    <p className="text-sm font-black text-lime-400">Iniciante • 2x/Semana (Base)</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5 space-y-1">
                    <span className="text-slate-400 font-medium">Cardio Preferido</span>
                    <p className="text-sm font-black text-white">Bicicleta Ergométrica</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                  <div className="rounded-2xl bg-black/40 p-3.5 border border-white/5 text-center">
                    <span className="text-slate-400 block mb-1">Braço</span>
                    <strong className="text-lg font-black text-lime-400">35 cm</strong>
                  </div>
                  <div className="rounded-2xl bg-black/40 p-3.5 border border-white/5 text-center">
                    <span className="text-slate-400 block mb-1">Peitoral</span>
                    <strong className="text-lg font-black text-lime-400">100 cm</strong>
                  </div>
                  <div className="rounded-2xl bg-black/40 p-3.5 border border-white/5 text-center">
                    <span className="text-slate-400 block mb-1">Cintura</span>
                    <strong className="text-lg font-black text-amber-400">96 cm</strong>
                  </div>
                  <div className="rounded-2xl bg-black/40 p-3.5 border border-white/5 text-center">
                    <span className="text-slate-400 block mb-1">Quadril</span>
                    <strong className="text-lg font-black text-white">104 cm</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIMITAÇÕES ARTICULARES */}
          {activeTab === 'limitacoes' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <AlertOctagon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Protocolo Clínico de Proteção Articular</h4>
                    <p className="text-xs text-rose-300">Diretrizes absolutas para ombro direito e joelho</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-black/60 p-4 border border-rose-500/20 space-y-3">
                  <span className="text-xs font-black uppercase text-rose-400 tracking-wider block">
                    Escala de Dor (0 a 10) — Regra de Ouro
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/20">
                      <strong className="text-emerald-400 block mb-1">0 a 2 / 10</strong>
                      <p className="text-slate-300">Desconforto pequeno e controlável → Observar e prosseguir com técnica estrita.</p>
                    </div>
                    <div className="rounded-xl bg-amber-500/10 p-3 border border-amber-500/20">
                      <strong className="text-amber-400 block mb-1">3 a 4 / 10</strong>
                      <p className="text-slate-300">Alerta: Reduzir carga imediatamente ou diminuir amplitude de movimento.</p>
                    </div>
                    <div className="rounded-xl bg-rose-500/10 p-3 border border-rose-500/20">
                      <strong className="text-rose-400 block mb-1">5+ / 10</strong>
                      <p className="text-slate-300">PARAR o exercício imediatamente. Não tente 'vencer' a dor articular.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-2xl bg-black/40 p-4 border border-white/5 space-y-2">
                    <strong className="text-amber-400 font-bold flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4" />
                      Joelho Direito
                    </strong>
                    <ul className="list-disc pl-4 text-slate-300 space-y-1">
                      <li>Histórico de inchaço após sobrecarga.</li>
                      <li>Cadência obrigatória de 3 segundos na descida no Leg Press.</li>
                      <li>Nunca travar os joelhos em hiperextensão no final.</li>
                      <li>Proibido valgo dinâmico (joelho colapsando para dentro).</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-black/40 p-4 border border-white/5 space-y-2">
                    <strong className="text-rose-400 font-bold flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4" />
                      Ombro Direito
                    </strong>
                    <ul className="list-disc pl-4 text-slate-300 space-y-1">
                      <li>Histórico de acidente de moto com dor intensa na elevação lateral.</li>
                      <li>Elevação lateral pesada e desenvolvimentos livres são <strong>proibidos</strong>.</li>
                      <li>Chest Press executado apenas com escápulas aduzidas e ombros baixos.</li>
                      <li>Face Pull e Rotação Externa são obrigatórios para reabilitação do manguito.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TREINO A */}
          {activeTab === 'treinoA' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className="text-base font-black text-emerald-400">
                    Treino A — Full Body 1 (Peito + Quadríceps) ⭐ PRINCIPAL
                  </h4>
                  <p className="text-xs text-slate-400">
                    Duração: 70–85 min • Aquecimento + 12 exercícios + Cardio Final
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-400 border border-emerald-500/30">
                  Segunda-feira
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {workouts.find((w) => w.code === 'A')?.exercises.map((ex, idx) => (
                  <div key={ex.id || idx} className="rounded-2xl bg-white/5 p-3.5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-black text-emerald-400">
                          {idx + 1}
                        </span>
                        <strong className="text-white font-bold">{ex.name}</strong>
                        {ex.kneeWarning && (
                          <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-black text-amber-400 border border-amber-500/30">
                            Joelho
                          </span>
                        )}
                        {ex.shoulderWarning && (
                          <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-black text-rose-400 border border-rose-500/30">
                            Ombro
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 pl-7 line-clamp-2">{ex.notes}</p>
                    </div>
                    <div className="flex items-center gap-3 pl-7 sm:pl-0 shrink-0">
                      <span className="rounded-xl bg-black/40 px-2.5 py-1 text-white font-black text-xs border border-white/10">
                        {ex.weightKg > 0 ? `${ex.weightKg} kg` : 'PC'}
                      </span>
                      <span className="text-slate-300 font-bold text-xs">
                        {ex.sets} × {ex.targetReps || ex.reps}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {ex.defaultRestSeconds}s rest
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TREINO B */}
          {activeTab === 'treinoB' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className="text-base font-black text-cyan-400">
                    Treino B — Full Body 2 (Costas + Posterior & Ombro) ⭐ PRINCIPAL
                  </h4>
                  <p className="text-xs text-slate-400">
                    Duração: 70–85 min • Aquecimento + 15 exercícios + Cardio Final
                  </p>
                </div>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-black text-cyan-400 border border-cyan-500/30">
                  Quinta-feira
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {workouts.find((w) => w.code === 'B')?.exercises.map((ex, idx) => (
                  <div key={ex.id || idx} className="rounded-2xl bg-white/5 p-3.5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] font-black text-cyan-400">
                          {idx + 1}
                        </span>
                        <strong className="text-white font-bold">{ex.name}</strong>
                        {ex.kneeWarning && (
                          <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-black text-amber-400 border border-amber-500/30">
                            Joelho
                          </span>
                        )}
                        {ex.shoulderWarning && (
                          <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-black text-rose-400 border border-rose-500/30">
                            Ombro
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 pl-7 line-clamp-2">{ex.notes}</p>
                    </div>
                    <div className="flex items-center gap-3 pl-7 sm:pl-0 shrink-0">
                      <span className="rounded-xl bg-black/40 px-2.5 py-1 text-white font-black text-xs border border-white/10">
                        {ex.weightKg > 0 ? `${ex.weightKg} kg` : 'PC'}
                      </span>
                      <span className="text-slate-300 font-bold text-xs">
                        {ex.sets} × {ex.targetReps || ex.reps}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {ex.defaultRestSeconds}s rest
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TREINO C (OPCIONAL) */}
          {activeTab === 'treinoC' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className="text-base font-black text-amber-400">
                    Treino C — Superior (Peito + Costas + Braços) (Opcional)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Para semanas com 3 a 4 treinos • ~60 min
                  </p>
                </div>
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-400 border border-amber-500/30">
                  Opcional (3ª Sessão)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {workouts.find((w) => w.code === 'C')?.exercises.map((ex, idx) => (
                  <div key={ex.id || idx} className="rounded-2xl bg-white/5 p-3.5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-black text-amber-400">
                          {idx + 1}
                        </span>
                        <strong className="text-white font-bold">{ex.name}</strong>
                      </div>
                      <p className="text-[11px] text-slate-400 pl-7">{ex.notes}</p>
                    </div>
                    <div className="flex items-center gap-3 pl-7 sm:pl-0 shrink-0">
                      <span className="rounded-xl bg-black/40 px-2.5 py-1 text-white font-black text-xs border border-white/10">
                        {ex.weightKg > 0 ? `${ex.weightKg} kg` : 'PC'}
                      </span>
                      <span className="text-slate-300 font-bold text-xs">
                        {ex.sets} × {ex.targetReps || ex.reps}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: TREINO D (OPCIONAL) */}
          {activeTab === 'treinoD' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className="text-base font-black text-violet-400">
                    Treino D — Inferior + Cardio (Pernas + Glúteos + Core) (Opcional)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Para semanas com 4 treinos • ~60 min
                  </p>
                </div>
                <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-black text-violet-400 border border-violet-500/30">
                  Opcional (4ª Sessão)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {workouts.find((w) => w.code === 'D')?.exercises.map((ex, idx) => (
                  <div key={ex.id || idx} className="rounded-2xl bg-white/5 p-3.5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20 text-[10px] font-black text-violet-400">
                          {idx + 1}
                        </span>
                        <strong className="text-white font-bold">{ex.name}</strong>
                      </div>
                      <p className="text-[11px] text-slate-400 pl-7">{ex.notes}</p>
                    </div>
                    <div className="flex items-center gap-3 pl-7 sm:pl-0 shrink-0">
                      <span className="rounded-xl bg-black/40 px-2.5 py-1 text-white font-black text-xs border border-white/10">
                        {ex.weightKg > 0 ? `${ex.weightKg} kg` : 'PC'}
                      </span>
                      <span className="text-slate-300 font-bold text-xs">
                        {ex.sets} × {ex.targetReps || ex.reps}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: REGRAS DE PROGRESSÃO */}
          {activeTab === 'progressao' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-3xl border border-blue-500/30 bg-blue-500/5 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Como Evoluir Cargas com Segurança Total</h4>
                    <p className="text-xs text-blue-300">Regra de Ouro: Repetições primeiro, Carga depois</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-black/60 p-5 border border-blue-500/20 space-y-3 text-xs text-slate-300 leading-relaxed">
                  <p>
                    A progressão de carga no seu treino segue 3 passos estritos:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <strong>1. Primeiro aumentamos repetições dentro da faixa:</strong> Exemplo no Chest Press (faixa 8–10 reps). Semana 1 você faz 8 reps. Na semana 2 tenta 9 reps. Na semana 3 tenta 10 reps com a mesma carga de 20 kg.
                    </li>
                    <li>
                      <strong>2. Depois aumentamos a carga:</strong> Somente após conseguir completar 10 reps em todas as 3 séries com técnica limpa e sem dor, aumentamos o menor incremento da máquina (geralmente +2,5 kg ou +5 kg).
                    </li>
                    <li>
                      <strong>3. Depois reconstruímos as repetições:</strong> Com o novo peso (22,5 kg ou 25 kg), você volta para a base de 8 repetições e recomeça a progressão gradualmente.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: NUTRIÇÃO */}
          {activeTab === 'nutricao' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-3xl border border-lime-500/30 bg-lime-500/5 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-500/20 text-lime-400 border border-lime-500/30">
                    <Utensils className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Nutrição Econômica & Hidratação (120–140g Proteína)</h4>
                    <p className="text-xs text-lime-300">Alimentos acessíveis e fáceis em Portugal</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl bg-black/40 p-4 border border-white/5 space-y-2">
                    <strong className="text-lime-400 font-bold">Fontes Proteicas Acessíveis:</strong>
                    <ul className="list-disc pl-4 text-slate-300 space-y-1">
                      <li>Ovos inteiros e claras</li>
                      <li>Peito de frango / peru</li>
                      <li>Atum e sardinha em lata</li>
                      <li>Iogurte grego natural / Queijo fresco batido (0% ou magro)</li>
                      <li>Feijão, lentilhas e grão-de-bico</li>
                      <li>Aveia em flocos</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-black/40 p-4 border border-white/5 space-y-2">
                    <strong className="text-cyan-400 font-bold">Meta de Hidratação Diária:</strong>
                    <p className="text-slate-300">
                      <strong>3 litros de água</strong> distribuídos ao longo do dia para otimizar síntese proteica, recuperação muscular e lubrificação articular do joelho e ombro.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-[#0A0A0B] p-4 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Documento de Prescrição • Gym Companion v2.0
          </p>
          <button
            onClick={onClose}
            className="rounded-2xl bg-lime-500 hover:bg-lime-400 text-black px-5 py-2 text-xs font-black transition-colors"
          >
            Fechar Apostila
          </button>
        </div>
      </div>
    </div>
  );
};
