/**
 * Gym Companion v1.0 — Documentação Arquitetural Completa & Specs
 * Comprehensive technical documentation, database schemas, component tree, and roadmap.
 */
import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Code2,
  Database,
  Layers,
  CheckSquare,
  GitBranch,
  FileText,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<
    'arquitetura' | 'banco' | 'fluxo' | 'componentes' | 'roadmap' | 'changelog'
  >('arquitetura');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400 border border-violet-500/30">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Gym Companion — Documentação & Especificações v1.0
              </h3>
              <p className="text-xs text-neutral-400">
                Arquitetura de produto comercial, estrutura de dados, AI Coach e roadmap de expansão
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section Navigation */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/60 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSection('arquitetura')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
              activeSection === 'arquitetura'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            🏗️ Arquitetura & UX
          </button>
          <button
            onClick={() => setActiveSection('banco')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
              activeSection === 'banco'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            🗄️ Banco de Dados & Schema
          </button>
          <button
            onClick={() => setActiveSection('fluxo')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
              activeSection === 'fluxo'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            🔄 Fluxo de Navegação & 1-Mão
          </button>
          <button
            onClick={() => setActiveSection('componentes')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
              activeSection === 'componentes'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            🧩 Componentes & Pastas
          </button>
          <button
            onClick={() => setActiveSection('roadmap')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
              activeSection === 'roadmap'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            🚀 Ecossistema & Integrações
          </button>
          <button
            onClick={() => setActiveSection('changelog')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
              activeSection === 'changelog'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            📋 Checklist & Changelog
          </button>
        </div>

        {/* Section Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm text-neutral-300 leading-relaxed">
          {activeSection === 'arquitetura' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-2">
                  1. Filosofia: Workout Companion vs. Tracker Convencional
                </h4>
                <p>
                  O <strong className="text-emerald-400">Gym Companion v1.0</strong> foi concebido não apenas como um registro de séries e repetições, mas como um <strong>assistente que guia o treino em tempo real</strong>. Ele assume o papel de um personal trainer digital: controla intervalos de descanso com alarmes, sugere automaticamente progressões de carga com base nas últimas semanas, reorganiza a ordem das séries de forma contínua quando uma máquina está ocupada e calcula gasto energético via MET ponderado pelo volume.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <h5 className="font-bold text-white">⚡ Desempenho & Acessibilidade com 1 Mão</h5>
                  <p className="text-xs text-neutral-400">
                    Todos os botões principais de controle durante o treino ("Concluir Série", "Ajuste +2.5kg", "Máquina Ocupada") estão localizados na zona de alcance ergonômico do polegar inferior.
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <h5 className="font-bold text-white">🧠 AI Coach (OpenRouter Claude + Fallback Heurístico)</h5>
                  <p className="text-xs text-neutral-400">
                    Integração full-stack via rota <code className="text-violet-300">/api/ai-coach</code> conectada ao OpenRouter (Claude Sonnet / DeepSeek), com motor de fallback inteligente embutido no cliente para operação offline contínua.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2">
                  2. Regra Anti-Fricção (&lt; 3 Segundos para qualquer ação)
                </h4>
                <p>
                  Durante uma sessão ativa, nenhuma ação principal (concluir série, mudar peso, iniciar descanso ou pular aparelho) requer mais do que 1 toque ou 3 segundos na tela.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'banco' && (
            <div className="space-y-5 font-mono text-xs">
              <div>
                <h4 className="text-sm font-bold text-white font-sans mb-2">
                  Estrutura de Modelos TypeScript (Core Storage Engine)
                </h4>
                <p className="font-sans text-neutral-400 mb-4">
                  O aplicativo mantém persistência atômica via LocalStorage serializado, pronto para espelhamento em nuvem (Firestore / Supabase) via interfaces padronizadas:
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                <span className="text-emerald-400 font-bold">// Entidade: Exercise & Log History</span>
                <pre className="text-neutral-300 overflow-x-auto">{`interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: string;
  weightKg: number;
  previousWeightKg: number;
  suggestedWeightKg: number;
  reps: number;
  rpe: number;
  defaultRestSeconds: number;
  personalRecordKg: number;
  history: ExerciseLog[];
}`}</pre>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                <span className="text-violet-400 font-bold">// Entidade: WorkoutLog (Feedback Pós-Treino)</span>
                <pre className="text-neutral-300 overflow-x-auto">{`interface WorkoutLog {
  id: string;
  workoutId: string;
  workoutCode: 'A' | 'B' | 'C' | 'D';
  date: string;
  durationSeconds: number;
  caloriesBurned: number;
  totalVolumeKg: number;
  rating: number; // 1 to 5 stars
  feedbackTags: string[]; // "Dormi mal", "Dor no ombro"...
}`}</pre>
              </div>
            </div>
          )}

          {activeSection === 'fluxo' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-2">
                  Fluxo Ideal de Acesso & Treino — "One-Screen Flow"
                </h4>
                <p>
                  O fluxo foi modelado para minimizar a fragmentação de telas:
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-white">
                  <span className="rounded bg-emerald-500/20 px-3 py-1.5 text-emerald-300">1. Abrir App</span>
                  <span>→</span>
                  <span className="rounded bg-emerald-500/20 px-3 py-1.5 text-emerald-300">2. Entrar na Academia (QR Code)</span>
                  <span>→</span>
                  <span className="rounded bg-emerald-500/20 px-3 py-1.5 text-emerald-300">3. Treino A Inicia Automaticamente</span>
                  <span>→</span>
                  <span className="rounded bg-emerald-500/20 px-3 py-1.5 text-emerald-300">4. Concluir Série</span>
                  <span>→</span>
                  <span className="rounded bg-emerald-500/20 px-3 py-1.5 text-emerald-300">5. Descanso 90s (Automático)</span>
                  <span>→</span>
                  <span className="rounded bg-emerald-500/20 px-3 py-1.5 text-emerald-300">6. Próximo Exercício / Ocupado</span>
                  <span>→</span>
                  <span className="rounded bg-emerald-500/20 px-3 py-1.5 text-emerald-300">7. Encerrar & Avaliar Treino</span>
                  <span>→</span>
                  <span className="rounded bg-emerald-500/20 px-3 py-1.5 text-emerald-300">8. AI Coach Atualiza Próximas Cargas</span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-bold text-white mb-1">Modo Academia (Workout Mode)</h5>
                <p className="text-neutral-400">
                  Ao acionar um treino, a tela ajusta os botões e números para exibição de alto contraste, prevenindo toques acidentais e permitindo leitura rápida em pé ou durante séries intensas.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'componentes' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">
                Estrutura Modular de Pastas & Componentes
              </h4>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs text-neutral-300 space-y-1">
                <p className="text-emerald-400 font-bold">/src</p>
                <p className="pl-4">├── types.ts — Modelos TypeScript globais</p>
                <p className="pl-4">├── data/defaultWorkouts.ts — Seed data com Treinos A, B, C, D e PRs</p>
                <p className="pl-4">├── utils/calories.ts — Estimativa calórica por MET + carga</p>
                <p className="pl-4">├── utils/progression.ts — Algoritmo inteligente de progressão</p>
                <p className="pl-4">├── utils/audio.ts — Gerador de beep e sons com Web Audio API</p>
                <p className="pl-4">├── context/GymContext.tsx — Contexto global do aplicativo</p>
                <p className="pl-4 text-violet-300 font-bold">├── components/</p>
                <p className="pl-8">├── NavbarHeader.tsx — Cabeçalho com Streak, XP e Modo Academia</p>
                <p className="pl-8">├── HomeDashboard.tsx — Tela inicial com CTA de 1 toque e A, B, C, D</p>
                <p className="pl-8">├── GymAccessModal.tsx — Módulo QR Code da Academia (Brilho 100%)</p>
                <p className="pl-8">├── ActiveWorkoutScreen.tsx — Tela principal durante treino com descanso</p>
                <p className="pl-8">├── PostWorkoutRatingModal.tsx — Avaliação de 5 estrelas & Tags</p>
                <p className="pl-8">├── WorkoutManagerModal.tsx — CRUD de Treinos, Ordem e Cargas</p>
                <p className="pl-8">├── AICoachDrawer.tsx — Assistente de Inteligência Artificial</p>
                <p className="pl-8">├── HistoryAnalyticsModal.tsx — Gráficos Recharts de volume e PRs</p>
                <p className="pl-8">└── SettingsModal.tsx — Opções, temas, biometria e backup</p>
                <p className="text-cyan-400 font-bold">/server.ts</p>
                <p className="pl-4">└── Backend Express + Vite para Proxy do AI Coach (Gemini API)</p>
              </div>
            </div>
          )}

          {activeSection === 'roadmap' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">
                Ecossistema & Integrações Suportadas
              </h4>
              <p>
                A arquitetura do Gym Companion foi desenvolvida com conectores expansíveis para as seguintes plataformas:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
                  <span className="text-xs font-bold text-violet-300">LifeOS & Notion Sync</span>
                  <p className="text-xs text-neutral-400 mt-1">
                    Exportação automática do resumo de treino e notas de recuperação para tabelas centrais de hábitos.
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
                  <span className="text-xs font-bold text-cyan-300">Apple Health & Google Fit</span>
                  <p className="text-xs text-neutral-400 mt-1">
                    Sincronização de calorias ativas e fechamento de metas diárias sem duplicação de esforço.
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
                  <span className="text-xs font-bold text-emerald-300">Spotify Premium SDK</span>
                  <p className="text-xs text-neutral-400 mt-1">
                    Troca automática para playlist de treino ao iniciar séries com alta intensidade.
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
                  <span className="text-xs font-bold text-amber-300">Strava & Garmin</span>
                  <p className="text-xs text-neutral-400 mt-1">
                    Integração de frequência cardíaca contínua e compartilhamento de volume de musculação no Strava.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'changelog' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-2">
                  Checklist de Qualidade — Gym Companion v1.0
                </h4>
                <div className="space-y-2">
                  {[
                    '✓ Zero telas complexas durante treino — Ações em < 3 segundos',
                    '✓ Progresso de carga inteligente que aprende com feedback (Dor = redução / Fácil = aumento)',
                    '✓ Cronômetro de descanso com alertas visuais, vibratórios e sonoros embutidos',
                    '✓ Botão "Máquina Ocupada" que reorganiza exercícios na fila sem perder o ritmo',
                    '✓ QR Code para acesso à academia com brilho automático e início de treino no mesmo toque',
                    '✓ Módulo de Música em painel inferior que nunca interrompe os cronômetros',
                    '✓ Avaliação pós-treino com 5 estrelas e tags de fadiga/sono que alimentam o AI Coach',
                    '✓ Backup e restauração JSON em tempo real',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <h5 className="text-sm font-bold text-white mb-2">Changelog — v1.0.0 (Lançamento Oficial)</h5>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  • Lançamento do core com Treinos A, B, C, D configurados e ilustrados.<br />
                  • Integração do AI Coach com modelo Gemini e fallback heurístico de proteção articular.<br />
                  • Sistema de gamificação com Streaks, níveis e medalhas de consistência.<br />
                  • Arquitetura modular documentada e testada.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
