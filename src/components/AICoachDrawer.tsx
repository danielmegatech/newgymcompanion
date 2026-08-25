/**
 * Gym Companion v1.0 — AI Coach Assistant Drawer
 * Real-time biomechanical analysis, load progression advice, and intelligent workout adaptations.
 */
import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  TrendingUp,
  ShieldAlert,
  Moon,
  Users,
} from 'lucide-react';
import { useGym } from '../context/GymContext';

interface AICoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    aiCoachMessages,
    isAiLoading,
    sendAiCoachMessage,
    userStats,
    todayWorkout,
  } = useGym();

  const [inputStr, setInputStr] = useState<string>('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputStr.trim() || isAiLoading) return;
    const text = inputStr;
    setInputStr('');
    sendAiCoachMessage(text);
  };

  const handleQuickQuestion = (question: string, tag: string) => {
    sendAiCoachMessage(question, tag);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col justify-between border-l border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Coach Gym</h3>
                <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-500/30">
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Seu treinador digital inteligente em tempo real
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

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {aiCoachMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-lime-500 text-black font-semibold rounded-br-none'
                      : 'bg-[#18181B] text-slate-200 border border-white/10 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      isUser ? 'text-neutral-900 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lime-500/20 text-lime-400 border border-lime-500/30">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
          {isAiLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Sparkles className="h-4 w-4 animate-spin text-violet-400" />
              <span>O AI Coach está analisando seu histórico e biomecânica...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips (Examples from Master Prompt) */}
        <div className="border-t border-white/10 bg-[#0A0A0B]/80 p-3">
          <span className="block text-[11px] font-bold text-slate-400 uppercase mb-2">
            Perguntas & Adaptações em 1 Toque:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() =>
                handleQuickQuestion(
                  'Hoje dormi mal e estou cansado. Devo reduzir a intensidade ou o peso?',
                  'Dormi mal'
                )
              }
              className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-left text-xs text-slate-300 border border-white/10"
            >
              <Moon className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Dormi mal hoje</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickQuestion(
                  'Senti leve dor no ombro direito. Como protejo a articulação no treino de hoje?',
                  'Dor no ombro'
                )
              }
              className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-left text-xs text-slate-300 border border-white/10"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-red-400 shrink-0" />
              <span className="truncate">Senti dor no ombro</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickQuestion(
                  'A academia está muito cheia hoje. Como substituo exercícios em máquina por halteres?',
                  'Academia cheia'
                )
              }
              className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-left text-xs text-slate-300 border border-white/10"
            >
              <Users className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">Academia lotada</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickQuestion(
                  `Fiz 45 kg no Supino Reto na semana passada com facilidade. Qual é a minha progressão ideal de carga?`,
                  'Progressão'
                )
              }
              className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-left text-xs text-slate-300 border border-white/10"
            >
              <TrendingUp className="h-3.5 w-3.5 text-lime-400 shrink-0" />
              <span className="truncate">Como progredir carga?</span>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="border-t border-white/10 p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Digite sua dúvida de treino, carga ou exercício..."
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              className="flex-1 rounded-xl bg-[#0A0A0B] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
            <button
              type="submit"
              disabled={!inputStr.trim() || isAiLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
