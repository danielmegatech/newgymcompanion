/**
 * Gym Companion — BadgeUnlockedModal
 * Animated modal popped whenever the user unlocks one or more new achievement badges.
 * Displays badge icon, title, description, category, and celebratory particle/glow effects.
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Sparkles, CheckCircle, Share2, X, Trophy } from 'lucide-react';
import { Badge } from '../types';
import { soundGenerator } from '../utils/audio';

interface BadgeUnlockedModalProps {
  badges: Badge[] | null;
  onClose: () => void;
}

export const BadgeUnlockedModal: React.FC<BadgeUnlockedModalProps> = ({ badges, onClose }) => {
  useEffect(() => {
    if (badges && badges.length > 0) {
      try {
        soundGenerator.playFanfare();
      } catch (e) {
        console.log(e);
      }
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }
    }
  }, [badges]);

  if (!badges || badges.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/30 p-6 sm:p-8 text-white shadow-2xl overflow-hidden"
        >
          {/* Glowing Background Radial Effects */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-lime-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner */}
          <div className="text-center space-y-2 mb-6">
            <motion.div
              initial={{ rotate: -10, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-lime-400 text-slate-950 font-black shadow-lg shadow-amber-500/25 mb-2"
            >
              <Trophy className="w-8 h-8" />
            </motion.div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {badges.length === 1 ? 'Conquista Desbloqueada!' : `${badges.length} Novas Conquistas!`}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-lime-200">
              Parabéns pelo Desempenho!
            </h2>
            <p className="text-sm text-slate-300">
              Seus dados de treino no motor de progressão foram avaliados e você conquistou os seguintes badges:
            </p>
          </div>

          {/* Badge List Container */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {badges.map((badge, idx) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + idx * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-amber-500/20 hover:border-amber-500/40 transition"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-lime-500/20 border border-amber-400/30 flex items-center justify-center text-3xl shadow-md">
                  {badge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-amber-300 truncate">{badge.title}</h3>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                      {badge.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{badge.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-lime-400 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Desbloqueado hoje ({badge.unlockedAt || new Date().toISOString().split('T')[0]})
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-lime-500 hover:from-amber-400 hover:to-lime-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              Excelente! Continuar Treinando
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
