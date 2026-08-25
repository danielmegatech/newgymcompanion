/**
 * Gym Companion — PROJETO GLOW UP 2026 — PLANO BASE & RELATÓRIO DO DANIEL
 * Documento Oficial Consolidado • Element Gyms Campo Pequeno — Lisboa
 * 13 Seções Completas: Perfil, Medidas, Limitações, Estrutura Semanal, Aquecimento,
 * Mobilidade, Treino A, Treino B, Cardio, Progressão, Nutrição Econômica, Equipe Multidisciplinar e Registro de Dor/RPE.
 */

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Award,
  Heart,
  Utensils,
  TrendingUp,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ShieldAlert,
  Dumbbell,
  Clock,
  Sparkles,
  Users,
  Copy,
  Check,
  Calendar,
  Activity,
  ChevronRight,
  Printer,
  FileText,
  ShieldCheck,
  Stethoscope,
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
    'perfil' | 'limitacoes' | 'treinoA' | 'treinoB' | 'aquecimento' | 'progressao' | 'nutricao' | 'equipe' | 'registro'
  >('perfil');
  const [copied, setCopied] = useState(false);

  const { workouts, bodyConfig, activeProfile } = useGym();

  if (!isOpen) return null;

  const handleCopyFullPlan = () => {
    const fullText = `# 🏋️ PROJETO GLOW UP 2026 — PLANO BASE DO DANIEL
Academia: Lisboa
Aluno: Daniel • Idade: 37 anos • Altura: 1,68 m • Peso: 77 kg • Nível: Iniciante (2x/semana)
Objetivo: Perder gordura e ganhar massa muscular simultaneamente (Recomposição Corporal)

## 1. LIMITAÇÕES IMPORTANTES
- Joelho Direito: Inchaço pós-sobrecarga. Evitar impactos e cargas excessivas.
- Ombro Direito: Dor 10/10 na elevação lateral (acidente de moto). Evitar elevação lateral e desenvolvimento pesado.
- Filosofia: "Dor articular não é meta de treino."

## 2. ESTRUTURA SEMANAL
- Segunda: Treino A (Full Body — Ênfase Peito + Quadríceps)
- Quinta: Treino B (Full Body — Ênfase Costas + Posterior)
- Outros dias: Descanso / Caminhada leve / Mobilidade

## 3. TREINO A (Segunda)
1. Bike (Aquecimento) - 10 min
2. Mobilidade Pré-Treino - 5 min
3. Leg Press 45° - 40 kg, 3x12, 90s, cadência 3-1-2
4. Mesa Flexora - 15 kg, 3x12, 75s, cadência 2-1-3
5. Panturrilha Sentado - 20 kg, 4x15, 45s, cadência 2-2-2
6. Abdução de Quadril - 20 kg, 3x15, 45s
7. Chest Press - 20 kg, 3x10, 90s, cadência 2-1-3
8. Peck Deck - 15 kg, 3x12, 75s, cadência 2-1-3
9. Puxada Alta - 25 kg, 3x12, 90s, cadência 2-1-3
10. Remada Sentada - 20 kg, 3x12, 90s, cadência 2-1-3
11. Rosca Máquina - 10 kg, 3x12, 60s, cadência 2-1-3
12. Tríceps Corda - 10 kg, 3x12, 60s, cadência 2-1-3
13. Flexão de Punhos - 5 kg, 3x15, 45s
14. Extensão de Punhos - 4 kg, 3x15, 45s
15. Abdominal Máquina - 15 kg, 3x15, 45s
16. Elevação de Joelhos - Peso corporal, 3x12, 45s
17. Abdominal na Polia - 15 kg, 3x15, 45s
18. Cardio Final: Bike - 20 min leve/moderada + 5-10 min alongamento

## 4. TREINO B (Quinta)
1. Bike (Aquecimento) - 10 min
2. Mobilidade Pré-Treino - 5 min
3. Cadeira Extensora - 15 kg, 3x12, 75s, cadência 2-1-3
4. Mesa Flexora - 20 kg, 3x12, 75s, cadência 2-1-3
5. Hip Thrust Máquina - 20 kg, 3x12, 90s, cadência 2-1-2
6. Panturrilha em Pé - 20 kg, 4x15, 45s, cadência 2-2-2
7. Adução - 20 kg, 3x15, 45s
8. Chest Press Inclinado - 20 kg, 3x10, 90s, cadência 2-1-3
9. Pulldown - 25 kg, 3x12, 90s, cadência 2-1-3
10. Remada Máquina - 20 kg, 3x12, 90s, cadência 2-1-3
11. Pullover Máquina - 15 kg, 3x12, 75s, cadência 2-1-3
12. Face Pull - 7.5 kg, 3x15, 60s, cadência 2-1-2
13. Rotação Externa - 2.5 kg, 3x15, 45s
14. Rosca Martelo na Corda - 10 kg, 3x12, 60s
15. Tríceps Barra - 10 kg, 3x12, 60s
16. Abdominal Máquina - 20 kg, 3x15, 45s
17. Oblíquo na Polia - 10 kg, 3x12 cada lado, 45s
18. Crunch Inclinado - Peso corporal, 3x15, 45s
19. Cardio Final: Bike - 20 min leve/moderada + 5-10 min alongamento

## 5. NUTRIÇÃO ECONÔMICA BASE
- 120 a 140g de proteína/dia com alimentos acessíveis: ovos, frango, atum, sardinha, leite, iogurte grego, feijão, lentilha, grão-de-bico, aveia.
- 3 litros de água por dia.`;

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
                  Projeto Glow Up 2026 — Plano Base do Daniel
                </h3>
                <span className="rounded-full bg-lime-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-lime-400 border border-lime-500/30">
                  Element Gyms
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Documento Oficial Consolidado • 37 anos • 1,68 m • 77 kg • 2x/Semana (Segunda / Quinta)
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
            onClick={() => setActiveTab('perfil')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'perfil'
                ? 'border-lime-500 text-lime-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>1. Perfil & Medidas</span>
          </button>

          <button
            onClick={() => setActiveTab('limitacoes')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'limitacoes'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <span>2. Limitações (Joelho & Ombro)</span>
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
            <span>3. Treino A (Segunda)</span>
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
            <span>4. Treino B (Quinta)</span>
          </button>

          <button
            onClick={() => setActiveTab('aquecimento')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'aquecimento'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-orange-400" />
            <span>5. Aquecimento & Mobilidade</span>
          </button>

          <button
            onClick={() => setActiveTab('progressao')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'progressao'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5 text-violet-400" />
            <span>6. Progressão de Carga</span>
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
            <span>7. Nutrição Econômica</span>
          </button>

          <button
            onClick={() => setActiveTab('equipe')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'equipe'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5 text-blue-400" />
            <span>8. Especialistas</span>
          </button>

          <button
            onClick={() => setActiveTab('registro')}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'registro'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-pink-400" />
            <span>9. Registro & Dor (0-10)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: PERFIL & MEDIDAS */}
          {activeTab === 'perfil' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Profile Details Card */}
              <div className="rounded-3xl border border-white/10 bg-[#0A0A0B] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-sm font-black uppercase text-lime-400 tracking-wider flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>1. Perfil Oficial do Aluno</span>
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
                    <p className="text-sm font-black text-lime-400">Iniciante • 2x/Semana</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5 space-y-1">
                    <span className="text-slate-400 font-medium">Cardio Preferido</span>
                    <p className="text-sm font-black text-white">Bicicleta Ergométrica</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 p-4 border border-white/5 space-y-2 text-xs text-slate-300">
                  <strong className="text-white block font-bold">🎯 Objetivo Principal:</strong>
                  <p>
                    Perder gordura e ganhar massa muscular simultaneamente (Recomposição Corporal de Base).
                  </p>
                  <strong className="text-white block font-bold pt-1">⚙️ Preferência de Equipamentos:</strong>
                  <p>
                    Máquinas guiadas para máxima estabilidade e segurança articular, utilizando pesos livres somente quando fizer sentido biomecânico.
                  </p>
                </div>
              </div>

              {/* Medidas Iniciais Tabela */}
              <div className="rounded-3xl border border-white/10 bg-[#0A0A0B] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-sm font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span>2. Medidas Corporais Iniciais</span>
                  </h4>
                  <span className="text-xs text-slate-400">Reavaliação a cada 4 a 6 semanas</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="rounded-2xl bg-black/40 p-3.5 border border-white/5 text-center">
                    <span className="text-slate-400 block mb-1">Peso Atual</span>
                    <strong className="text-lg font-black text-white">77 kg</strong>
                  </div>
                  <div className="rounded-2xl bg-black/40 p-3.5 border border-white/5 text-center">
                    <span className="text-slate-400 block mb-1">Altura</span>
                    <strong className="text-lg font-black text-white">1,68 m</strong>
                  </div>
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
                  <div className="rounded-2xl bg-black/40 p-3.5 border border-white/5 text-center">
                    <span className="text-slate-400 block mb-1">Coxa</span>
                    <strong className="text-lg font-black text-white">50 cm</strong>
                  </div>
                  <div className="rounded-2xl bg-black/40 p-3.5 border border-white/5 text-center">
                    <span className="text-slate-400 block mb-1">Panturrilha</span>
                    <strong className="text-lg font-black text-white">40 cm</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIMITAÇÕES & SEGURANÇA */}
          {activeTab === 'limitacoes' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-6 space-y-4">
                <div className="flex items-center gap-3 text-amber-300">
                  <ShieldAlert className="h-6 w-6 shrink-0" />
                  <div>
                    <h4 className="text-base font-black uppercase tracking-wider">
                      3. Limitações Importantes & Diretrizes Clínicas
                    </h4>
                    <p className="text-xs text-amber-200/80 font-medium">
                      Diretriz máxima: &ldquo;Dor articular não é meta de treino.&rdquo;
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-2xl bg-black/50 p-4 border border-amber-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                      <span>🦵 Joelho Direito (Inchaço com Sobrecarga)</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                      <li>Incha após esforço intenso e sobrecarga patelar.</li>
                      <li><strong>Evitar:</strong> Impactos repetitivos e agachamentos profundos com carga livre desestabilizada.</li>
                      <li><strong>Prescrição:</strong> Priorizar máquinas guiadas (Leg Press 45° com 40kg, Mesa Flexora), com amplitude confortável e progressão gradual.</li>
                      <li>Nunca travar os joelhos em hiperextensão no topo do movimento.</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-black/50 p-4 border border-amber-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                      <span>🦾 Ombro Direito (Dor 10/10 Elevação Lateral)</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                      <li>Histórico de lesão grave decorrente de acidente de moto.</li>
                      <li><strong>Totalmente Proibido:</strong> Elevação lateral e desenvolvimento acima da cabeça com cargas pesadas.</li>
                      <li><strong>Prescrição:</strong> Chest Press em máquina sentada com pegada neutra/fechada, Peck Deck controlado sem hiper-abertura para trás.</li>
                      <li><strong>Corretivos Obrigatórios:</strong> Face Pull (7.5kg) e Rotação Externa (2.5kg) para reforço do manguito rotador.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Estrutura Semanal */}
              <div className="rounded-3xl border border-white/10 bg-[#0A0A0B] p-5 space-y-4">
                <h4 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-lime-400" />
                  <span>4. Estrutura Semanal Recomendada</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-emerald-400 text-sm font-black">SEGUNDA-FEIRA</strong>
                      <span className="rounded-lg bg-emerald-500/20 text-emerald-300 px-2 py-0.5 font-bold">~1h45 a 2h</span>
                    </div>
                    <p className="text-slate-200 font-bold">Treino A — Full Body (Ênfase Peito + Quadríceps)</p>
                    <p className="text-slate-400">Aquecimento 10 min + Mobilidade 5 min + 15 exercícios + Cardio Final 20 min.</p>
                  </div>

                  <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/30 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-cyan-400 text-sm font-black">QUINTA-FEIRA</strong>
                      <span className="rounded-lg bg-cyan-500/20 text-cyan-300 px-2 py-0.5 font-bold">~1h45 a 2h</span>
                    </div>
                    <p className="text-slate-200 font-bold">Treino B — Full Body (Ênfase Costas + Posterior)</p>
                    <p className="text-slate-400">Aquecimento 10 min + Mobilidade 5 min + 16 exercícios + Cardio Final 20 min.</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 italic">
                  💡 Terça, Quarta, Sexta, Sábado e Domingo: Descanso muscular, caminhadas leves ao ar livre e recuperação ativa.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: TREINO A COMPLETO */}
          {activeTab === 'treinoA' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-xs font-black uppercase text-emerald-400 block">Segunda-Feira • Full Body</span>
                  <h4 className="text-lg font-black text-white">Treino A — Ênfase Peito + Quadríceps</h4>
                </div>
                <span className="rounded-xl bg-emerald-500/20 text-emerald-300 px-3 py-1 text-xs font-black border border-emerald-500/30">
                  18 Etapas • ~105 min
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  { num: '01', name: 'Bike (Aquecimento)', spec: '10 min leve/moderada (80-90 RPM)', load: 'Resistência 3-5', rest: 'Sem pausa', cad: '-' },
                  { num: '02', name: 'Mobilidade Pré-Treino', spec: '5 min dinâmicos (ombros, quadril, tornozelos)', load: 'Corporal', rest: 'Sem pausa', cad: '-' },
                  { num: '03', name: 'Leg Press 45°', spec: '3 séries × 12 reps', load: '40 kg', rest: '90s', cad: '3-1-2', note: '⚠️ Alerta Joelho: amplitude confortável sem tranco' },
                  { num: '04', name: 'Mesa Flexora', spec: '3 séries × 12 reps', load: '15 kg', rest: '75s', cad: '2-1-3' },
                  { num: '05', name: 'Panturrilha Sentado', spec: '4 séries × 15 reps', load: '20 kg', rest: '45s', cad: '2-2-2' },
                  { num: '06', name: 'Abdução de Quadril', spec: '3 séries × 15 reps', load: '20 kg', rest: '45s', cad: '2-1-2' },
                  { num: '07', name: 'Chest Press', spec: '3 séries × 10 reps', load: '20 kg', rest: '90s', cad: '2-1-3', note: '⚠️ Alerta Ombro: se houver dor, interromper' },
                  { num: '08', name: 'Peck Deck (Voador)', spec: '3 séries × 12 reps', load: '15 kg', rest: '75s', cad: '2-1-3' },
                  { num: '09', name: 'Puxada Alta', spec: '3 séries × 12 reps', load: '25 kg', rest: '90s', cad: '2-1-3' },
                  { num: '10', name: 'Remada Sentada', spec: '3 séries × 12 reps', load: '20 kg', rest: '90s', cad: '2-1-3' },
                  { num: '11', name: 'Rosca Máquina', spec: '3 séries × 12 reps', load: '10 kg', rest: '60s', cad: '2-1-3' },
                  { num: '12', name: 'Tríceps Corda', spec: '3 séries × 12 reps', load: '10 kg', rest: '60s', cad: '2-1-3' },
                  { num: '13', name: 'Flexão de Punhos', spec: '3 séries × 15 reps', load: '5 kg', rest: '45s', cad: '2-1-2' },
                  { num: '14', name: 'Extensão de Punhos', spec: '3 séries × 15 reps', load: '4 kg', rest: '45s', cad: '2-1-2' },
                  { num: '15', name: 'Abdominal Máquina', spec: '3 séries × 15 reps', load: '15 kg', rest: '45s', cad: '2-1-2' },
                  { num: '16', name: 'Elevação de Joelhos', spec: '3 séries × 12 reps', load: 'Corporal', rest: '45s', cad: '2-1-2' },
                  { num: '17', name: 'Abdominal na Polia', spec: '3 séries × 15 reps', load: '15 kg', rest: '45s', cad: '2-1-2' },
                  { num: '18', name: 'Cardio Final: Bike', spec: '20 min leve/moderada + 5-10 min alongamento', load: 'Moderada', rest: 'Final', cad: '-' },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="rounded-2xl bg-[#0A0A0B] p-3.5 border border-white/5 flex flex-col justify-between hover:border-emerald-500/30 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs">
                          {item.num}
                        </span>
                        <strong className="text-white font-bold">{item.name}</strong>
                      </div>
                      <span className="font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        {item.load}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-white/5">
                      <span>{item.spec}</span>
                      <span>Descanso: <strong className="text-slate-200">{item.rest}</strong></span>
                      {item.cad !== '-' && <span>Cadência: <strong className="text-slate-200">{item.cad}</strong></span>}
                    </div>

                    {item.note && (
                      <p className="text-[10px] text-amber-300 font-semibold bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
                        {item.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TREINO B COMPLETO */}
          {activeTab === 'treinoB' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-xs font-black uppercase text-cyan-400 block">Quinta-Feira • Full Body</span>
                  <h4 className="text-lg font-black text-white">Treino B — Ênfase Costas + Posterior</h4>
                </div>
                <span className="rounded-xl bg-cyan-500/20 text-cyan-300 px-3 py-1 text-xs font-black border border-cyan-500/30">
                  19 Etapas • ~105 min
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  { num: '01', name: 'Bike (Aquecimento)', spec: '10 min leve/moderada (80-90 RPM)', load: 'Resistência 3-5', rest: 'Sem pausa', cad: '-' },
                  { num: '02', name: 'Mobilidade Pré-Treino', spec: '5 min dinâmicos (ombros, quadril, tornozelos)', load: 'Corporal', rest: 'Sem pausa', cad: '-' },
                  { num: '03', name: 'Cadeira Extensora', spec: '3 séries × 12 reps', load: '15 kg', rest: '75s', cad: '2-1-3', note: 'Carga leve, controle na descida' },
                  { num: '04', name: 'Mesa Flexora', spec: '3 séries × 12 reps', load: '20 kg', rest: '75s', cad: '2-1-3' },
                  { num: '05', name: 'Hip Thrust Máquina', spec: '3 séries × 12 reps', load: '20 kg', rest: '90s', cad: '2-1-2' },
                  { num: '06', name: 'Panturrilha em Pé', spec: '4 séries × 15 reps', load: '20 kg', rest: '45s', cad: '2-2-2' },
                  { num: '07', name: 'Adução de Quadril', spec: '3 séries × 15 reps', load: '20 kg', rest: '45s', cad: '2-1-2' },
                  { num: '08', name: 'Chest Press Inclinado', spec: '3 séries × 10 reps', load: '20 kg', rest: '90s', cad: '2-1-3', note: '⚠️ Alerta Ombro: pegada neutra e cotovelos alinhados' },
                  { num: '09', name: 'Pulldown (Puxada Frente)', spec: '3 séries × 12 reps', load: '25 kg', rest: '90s', cad: '2-1-3' },
                  { num: '10', name: 'Remada Máquina', spec: '3 séries × 12 reps', load: '20 kg', rest: '90s', cad: '2-1-3' },
                  { num: '11', name: 'Pullover Máquina', spec: '3 séries × 12 reps', load: '15 kg', rest: '75s', cad: '2-1-3' },
                  { num: '12', name: 'Face Pull', spec: '3 séries × 15 reps', load: '7.5 kg', rest: '60s', cad: '2-1-2', note: '🛡️ Reforço escápulas e posterior do ombro' },
                  { num: '13', name: 'Rotação Externa na Polia', spec: '3 séries × 15 reps', load: '2.5 kg', rest: '45s', cad: '2-1-2', note: '🛡️ Reabilitação do manguito rotador direito' },
                  { num: '14', name: 'Rosca Martelo na Corda', spec: '3 séries × 12 reps', load: '10 kg', rest: '60s', cad: '2-1-3' },
                  { num: '15', name: 'Tríceps Barra Reta', spec: '3 séries × 12 reps', load: '10 kg', rest: '60s', cad: '2-1-3' },
                  { num: '16', name: 'Abdominal Máquina', spec: '3 séries × 15 reps', load: '20 kg', rest: '45s', cad: '2-1-2' },
                  { num: '17', name: 'Oblíquo na Polia', spec: '3 séries × 12 reps (cada lado)', load: '10 kg', rest: '45s', cad: '2-1-2' },
                  { num: '18', name: 'Crunch Inclinado', spec: '3 séries × 15 reps', load: 'Corporal', rest: '45s', cad: '2-1-2' },
                  { num: '19', name: 'Cardio Final: Bike', spec: '20 min leve/moderada + 5-10 min alongamento', load: 'Moderada', rest: 'Final', cad: '-' },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="rounded-2xl bg-[#0A0A0B] p-3.5 border border-white/5 flex flex-col justify-between hover:border-cyan-500/30 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 font-black text-xs">
                          {item.num}
                        </span>
                        <strong className="text-white font-bold">{item.name}</strong>
                      </div>
                      <span className="font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                        {item.load}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-white/5">
                      <span>{item.spec}</span>
                      <span>Descanso: <strong className="text-slate-200">{item.rest}</strong></span>
                      {item.cad !== '-' && <span>Cadência: <strong className="text-slate-200">{item.cad}</strong></span>}
                    </div>

                    {item.note && (
                      <p className="text-[10px] text-cyan-300 font-semibold bg-cyan-500/10 p-1.5 rounded-lg border border-cyan-500/20">
                        {item.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AQUECIMENTO & MOBILIDADE */}
          {activeTab === 'aquecimento' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-3xl border border-white/10 bg-[#0A0A0B] p-6 space-y-4">
                <h4 className="text-sm font-black uppercase text-orange-400 tracking-wider flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  <span>5. Aquecimento Obrigatório (10 min)</span>
                </h4>
                <div className="rounded-2xl bg-white/5 p-4 border border-white/5 space-y-2 text-xs text-slate-300">
                  <p>
                    <strong>Bicicleta Ergométrica:</strong> 10 minutos contínuos com cadência constante entre <strong>80 a 90 RPM</strong> e resistência baixa/moderada (3 a 5).
                  </p>
                  <p className="text-slate-400">
                    Objetivo clínico: Elevação suave da temperatura corporal interna, estímulo da circulação de líquido sinovial nas cápsulas articulares dos joelhos e lubrificação sem impacto.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0A0A0B] p-6 space-y-4">
                <h4 className="text-sm font-black uppercase text-lime-400 tracking-wider flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>6. Mobilidade Dinâmica Pré-Treino (5 min)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5">
                    <strong className="text-white block mb-1">1. Rotação de Ombros</strong>
                    <p className="text-slate-400">15 rotações para trás e 15 para frente com movimentos lentos e controlados.</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5">
                    <strong className="text-white block mb-1">2. Circundução de Braços</strong>
                    <p className="text-slate-400">10 giros amplos à frente e 10 para trás mantendo as escápulas estáveis.</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5">
                    <strong className="text-white block mb-1">3. Rotação de Quadril</strong>
                    <p className="text-slate-400">15 círculos para cada lado para soltar a cintura pélvica e lombar.</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5">
                    <strong className="text-white block mb-1">4. Elevação de Joelhos</strong>
                    <p className="text-slate-400">15 elevações alternadas sem impacto no solo.</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5">
                    <strong className="text-white block mb-1">5. Flexão Plantar</strong>
                    <p className="text-slate-400">20 elevações na ponta dos pés para acordar tornozelos e tendão calcâneo.</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5">
                    <strong className="text-white block mb-1">6. Agachamento Livre sem Peso</strong>
                    <p className="text-slate-400">10 repetições com amplitude confortável testando a resposta dos joelhos.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0A0A0B] p-6 space-y-4">
                <h4 className="text-sm font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>7. Cardio Final & Desaceleração (25-30 min)</span>
                </h4>
                <div className="rounded-2xl bg-white/5 p-4 border border-white/5 space-y-2 text-xs text-slate-300">
                  <p>
                    <strong>Bike 20 min:</strong> Ritmo aeróbico sustentável na Zona 2 (conversa possível sem falta de ar).
                  </p>
                  <p>
                    <strong>5 a 10 min Desaceleração:</strong> Alongamentos leves estáticos (peitoral, grande dorsal, quadríceps, posteriores e panturrilhas) por 30s cada.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PROGRESSÃO DE CARGA */}
          {activeTab === 'progressao' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-3xl border border-violet-500/40 bg-violet-500/10 p-6 space-y-4">
                <h4 className="text-base font-black uppercase text-violet-300 tracking-wider flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>10. Sistema de Sobrecarga Progressiva Segura</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para o aluno iniciante com restrição no ombro e joelho, a progressão nunca é forçada. Ela ocorre naturalmente através do método de <strong>Repetições em Reserva (RIR)</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-2xl bg-black/50 p-4 border border-violet-500/20 space-y-2">
                    <strong className="text-violet-300 text-sm block font-bold">Membros Superiores</strong>
                    <p className="text-slate-300">
                      Subir no máximo <strong>+1 a +2,5 kg</strong> apenas quando conseguir completar as 12 repetições em todas as 3 séries com boa cadência e sem dor articular.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/50 p-4 border border-violet-500/20 space-y-2">
                    <strong className="text-violet-300 text-sm block font-bold">Membros Inferiores</strong>
                    <p className="text-slate-300">
                      Subir no máximo <strong>+2,5 a +5 kg</strong> no Leg Press apenas após 2 semanas consecutivas sem relato de inchaço pós-treino no joelho direito.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cadência dos Movimentos */}
              <div className="rounded-3xl border border-white/10 bg-[#0A0A0B] p-5 space-y-3">
                <h4 className="text-sm font-black uppercase text-white tracking-wider">
                  Guia de Cadências Explicadas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5">
                    <strong className="text-lime-400 block font-bold">3 - 1 - 2 (Controle Máximo)</strong>
                    <p className="text-slate-400 mt-1">3s descendo (excêntrica), 1s no ponto de contração, 2s subindo. Usado no Leg Press e Peito.</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5">
                    <strong className="text-cyan-400 block font-bold">2 - 1 - 3 (Foco Excêntrico)</strong>
                    <p className="text-slate-400 mt-1">2s subindo, 1s contraído, 3s descendo lento. Usado em puxadas e bíceps.</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5">
                    <strong className="text-orange-400 block font-bold">2 - 2 - 2 (Pico de Contração)</strong>
                    <p className="text-slate-400 mt-1">2s subindo, 2s segurando no topo, 2s descendo. Usado para panturrilhas e glúteos.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: NUTRIÇÃO ECONÔMICA */}
          {activeTab === 'nutricao' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-3xl border border-lime-500/30 bg-[#0A0A0B] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-base font-black uppercase text-lime-400 tracking-wider flex items-center gap-2">
                      <Utensils className="h-5 w-5" />
                      <span>11. Plano Nutricional Base Econômico</span>
                    </h4>
                    <p className="text-xs text-slate-400">Proteína de alta densidade sem gastos excessivos com suplementos caros</p>
                  </div>
                  <span className="rounded-xl bg-lime-500/20 text-lime-300 font-black text-xs px-3 py-1 border border-lime-500/30">
                    120 a 140 g / dia
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl bg-white/5 p-4 border border-white/5 space-y-2">
                    <strong className="text-lime-400 text-sm block font-bold">Fontes Econômicas de Proteína</strong>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      <li><strong>Ovos inteiros:</strong> 3 a 4 ovos = ~24g proteína.</li>
                      <li><strong>Peito de frango:</strong> 150g cozido = ~45g proteína.</li>
                      <li><strong>Atum e Sardinha em lata:</strong> 1 lata = ~20-25g proteína + Ômega-3 anti-inflamatório.</li>
                      <li><strong>Leite magro / Iogurte grego:</strong> Proteína de absorção lenta e cálcio.</li>
                      <li><strong>Feijão, Lentilha e Grão-de-bico:</strong> Proteínas vegetais e fibras digestivas.</li>
                      <li><strong>Aveia em flocos:</strong> Carboidrato complexo de baixo índice glicêmico e saciedade.</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4 border border-white/5 space-y-2">
                    <strong className="text-cyan-400 text-sm block font-bold">Diretrizes de Hidratação & Sono</strong>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      <li><strong>3 Litros de Água:</strong> Garante lubrificação da cápsula articular do joelho e reduz retenção.</li>
                      <li><strong>Déficit Calórico Moderado (~300 kcal):</strong> Garante queima de gordura preservando massa magra.</li>
                      <li><strong>Sono de 7h a 8h:</strong> Essencial para recuperação do sistema nervoso central e manguito rotador.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: EQUIPE MULTIDISCIPLINAR */}
          {activeTab === 'equipe' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-white/10 pb-3">
                <h4 className="text-base font-black uppercase text-blue-400 tracking-wider flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  <span>12. Equipe de Especialistas Mapeados</span>
                </h4>
                <p className="text-xs text-slate-400">Acompanhamento integrado de saúde e performance</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {[
                  { role: 'Personal Trainer', desc: 'Ajuste de cadência, biomecânica nas máquinas e controle de carga.' },
                  { role: 'Nutricionista Esportivo', desc: 'Ajuste de macronutrientes econômicos e timing das refeições.' },
                  { role: 'Médico de Família (SNS)', desc: 'Exames de sangue periódicos, hemograma, lipídios e check-up anual.' },
                  { role: 'Gastroenterologista', desc: 'Saúde digestiva, absorção de nutrientes e microbiota intestinal.' },
                  { role: 'Ortopedista', desc: 'Avaliação por imagem da cartilagem do joelho e lesão do ombro.' },
                  { role: 'Fisioterapeuta', desc: 'Terapia manual, liberação miofascial e estabilização de escápulas.' },
                  { role: 'Cardiologista', desc: 'Eletrocardiograma, teste ergométrico e monitoramento cardíaco.' },
                  { role: 'Psicólogo / Saúde Mental', desc: 'Gestão de estresse, consistência de hábitos e qualidade do sono.' },
                  { role: 'Consultor Financeiro', desc: 'Otimização de custos com academia, supermercado e sustentabilidade.' },
                  { role: 'Avaliador Corporal', desc: 'Medição de circunferências e dobras cutâneas a cada 6 semanas.' },
                ].map((spec, idx) => (
                  <div key={idx} className="rounded-2xl bg-[#0A0A0B] p-3.5 border border-white/5 space-y-1">
                    <strong className="text-white font-bold block">{spec.role}</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{spec.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: REGISTRO & ESCALA DE DOR */}
          {activeTab === 'registro' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-3xl border border-pink-500/30 bg-[#0A0A0B] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-base font-black uppercase text-pink-400 tracking-wider flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>13. Tabela de Registro & Monitoramento de Dor</span>
                  </h4>
                  <span className="text-xs text-slate-400">Escala de 0 (Sem Dor) a 10 (Dor Máxima)</span>
                </div>

                <div className="rounded-2xl bg-white/5 p-4 border border-white/5 space-y-3 text-xs text-slate-300">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl bg-black/40 p-3 border border-white/5 text-center">
                      <span className="text-slate-400 block mb-1">Dor Joelho (Meta)</span>
                      <strong className="text-emerald-400 font-black text-sm">0 a 2 (Normal / Seguro)</strong>
                    </div>
                    <div className="rounded-xl bg-black/40 p-3 border border-white/5 text-center">
                      <span className="text-slate-400 block mb-1">Dor Ombro (Meta)</span>
                      <strong className="text-emerald-400 font-black text-sm">0 a 2 (Totalmente Controlado)</strong>
                    </div>
                    <div className="rounded-xl bg-black/40 p-3 border border-white/5 text-center">
                      <span className="text-slate-400 block mb-1">RPE / Esforço Percebido</span>
                      <strong className="text-lime-400 font-black text-sm">7 a 8 (2 a 3 reps na reserva)</strong>
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs italic pt-2">
                    * Se a dor no joelho ou ombro ultrapassar 3 durante qualquer série, o aplicativo e o AI Coach recomendam reduzir imediatamente a carga em 20% ou pular o exercício para a próxima sessão.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#0A0A0B] p-4">
          <button
            onClick={handleCopyFullPlan}
            className="flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 text-xs font-bold transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-lime-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copiado para a Área de Transferência!' : 'Copiar Todo o Documento'}</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-2xl bg-lime-500 hover:bg-lime-400 text-black px-6 py-2.5 text-xs font-black shadow-md shadow-lime-500/20 transition-all active:scale-95"
          >
            Fechar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};
