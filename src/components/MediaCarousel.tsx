/**
 * Gym Companion v2.0 — Unified Media Carousel & Slideshow Component
 * 
 * Features:
 * - Motion GIF set as DEFAULT image (Slide 1/Default view)
 * - Seamless Touch/Swipe Slideshow on mobile (Samsung Galaxy A15 optimized)
 * - Multi-media aggregation (GIF, Photos, Anatomy, Videos, Custom Attachments)
 * - Auto-play slideshow toggle with timer
 * - Tap-to-zoom Lightbox modal with high-res display
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Pause,
  Plus,
  Image as ImageIcon,
  ZoomIn,
  Video,
  Layers,
  Settings,
  Activity,
  Sparkles,
  Trash2,
  Link2,
  Edit3,
  Check,
} from 'lucide-react';
import { MediaAttachment, MediaType } from '../types';

interface MediaCarouselProps {
  attachments?: MediaAttachment[];
  exerciseName: string;
  gifUrl?: string;
  photoUrl?: string;
  muscleIllustrationUrl?: string;
  anatomyUrl?: string;
  videoUrl?: string;
  adjustmentPhotoUrl?: string;
  fallbackPhotoUrl?: string;
  onAddMediaClick?: () => void;
  onDeleteMedia?: (media: MediaAttachment, index: number) => void;
  onReplaceMedia?: (media: MediaAttachment, newUrl: string, newTitle?: string) => void;
  compact?: boolean;
  autoPlayDefault?: boolean;
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({
  attachments = [],
  exerciseName,
  gifUrl,
  photoUrl,
  muscleIllustrationUrl,
  anatomyUrl,
  videoUrl,
  adjustmentPhotoUrl,
  fallbackPhotoUrl,
  onAddMediaClick,
  onDeleteMedia,
  onReplaceMedia,
  compact = false,
  autoPlayDefault = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(autoPlayDefault);

  // Quick Replace Modal State
  const [showReplaceModal, setShowReplaceModal] = useState<boolean>(false);
  const [replaceUrlInput, setReplaceUrlInput] = useState<string>('');
  const [replaceTitleInput, setReplaceTitleInput] = useState<string>('');

  // Quick Delete Confirmation State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Touch gesture tracking for mobile swipe (Samsung Galaxy A15 / touch screens)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Build unified and deduplicated media list with MOTION GIF as #1 Priority (Default Slide)
  const mediaList: MediaAttachment[] = useMemo(() => {
    const list: MediaAttachment[] = [];
    const seenUrls = new Set<string>();

    const addIfUnique = (
      type: MediaType,
      url?: string,
      title?: string,
      description?: string,
      isPrimary = false
    ) => {
      if (!url || typeof url !== 'string') return;
      const cleanUrl = url.trim();
      if (!cleanUrl || seenUrls.has(cleanUrl)) return;
      seenUrls.add(cleanUrl);
      list.push({
        id: `media-${type}-${list.length}-${Date.now()}`,
        type,
        url: cleanUrl,
        title: title || (type === 'motion' ? 'Movimento (GIF de Execução)' : 'Foto do Exercício'),
        description,
        order: list.length + 1,
        isPrimary,
      });
    };

    // 1. MOTION GIF IS THE #1 DEFAULT PRIMARY IMAGE
    if (gifUrl) {
      addIfUnique('motion', gifUrl, 'Movimento / GIF', 'Execução biomecânica padrão', true);
    }

    // Also check for motion attachments in provided attachments
    (attachments || []).forEach((att) => {
      if (att && att.url && (att.type === 'motion' || att.url.toLowerCase().endsWith('.gif'))) {
        addIfUnique('motion', att.url, att.title || 'Movimento / GIF', att.description, true);
      }
    });

    // 2. Machine & Exercise Photos
    if (photoUrl) {
      addIfUnique('machine', photoUrl, 'Foto da Máquina / Equipamento', 'Postura e equipamento');
    }

    // 3. Anatomy / Muscle Illustrations
    const anatomy = muscleIllustrationUrl || anatomyUrl;
    if (anatomy) {
      addIfUnique('anatomy', anatomy, 'Anatomia / Músculos', 'Músculos primários e secundários');
    }

    // 4. Video URL
    if (videoUrl) {
      addIfUnique('video', videoUrl, 'Vídeo Demonstrativo', 'Tutorial de execução guiada');
    }

    // 5. Machine adjustments / photo
    if (adjustmentPhotoUrl) {
      addIfUnique('setup', adjustmentPhotoUrl, 'Anotação Visual', 'Foto de apoio');
    }

    // 6. Remaining attachments
    (attachments || []).forEach((att) => {
      if (att && att.url) {
        addIfUnique(att.type || 'machine', att.url, att.title, att.description, att.isPrimary);
      }
    });

    // 7. Fallback if still empty
    if (list.length === 0 && fallbackPhotoUrl) {
      addIfUnique('machine', fallbackPhotoUrl, 'Foto do Exercício', undefined, true);
    }

    return list;
  }, [
    attachments,
    gifUrl,
    photoUrl,
    muscleIllustrationUrl,
    anatomyUrl,
    videoUrl,
    adjustmentPhotoUrl,
    fallbackPhotoUrl,
  ]);

  const totalSlides = mediaList.length;

  // Reset index if out of bounds or when media changes
  useEffect(() => {
    if (currentIndex >= totalSlides && totalSlides > 0) {
      setCurrentIndex(0);
    }
  }, [totalSlides]);

  // Slideshow Auto-play interval
  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1 || lightboxOpen) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides, lightboxOpen]);

  const handlePrev = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  // Touch Swipe Handlers for Mobile (Samsung Galaxy A15)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next slide
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev slide
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const getMediaBadgeLabel = (type: MediaType) => {
    switch (type) {
      case 'motion':
        return { label: 'Movimento (GIF)', icon: <Activity className="h-3 w-3 text-lime-400" /> };
      case 'machine':
        return { label: 'Máquina / Foto', icon: <Settings className="h-3 w-3 text-sky-400" /> };
      case 'anatomy':
        return { label: 'Anatomia Muscular', icon: <Layers className="h-3 w-3 text-purple-400" /> };
      case 'setup':
        return { label: 'Anotações', icon: <Sparkles className="h-3 w-3 text-amber-400" /> };
      case 'video':
        return { label: 'Vídeo Tutorial', icon: <Video className="h-3 w-3 text-rose-400" /> };
      default:
        return { label: 'Mídia', icon: <ImageIcon className="h-3 w-3 text-slate-300" /> };
    }
  };

  const renderMediaContent = (media: MediaAttachment, isZoomed = false) => {
    if (!media || !media.url) return null;

    const isVideo =
      media.type === 'video' ||
      media.url.includes('youtube.com') ||
      media.url.includes('youtu.be') ||
      media.url.includes('vimeo.com') ||
      media.url.endsWith('.mp4');

    if (isVideo) {
      if (media.url.includes('youtube.com') || media.url.includes('youtu.be')) {
        const videoId = media.url.includes('v=')
          ? media.url.split('v=')[1]?.split('&')[0]
          : media.url.split('/').pop();
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
            title={media.title || exerciseName}
            className="w-full h-full rounded-2xl border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }
      return (
        <video
          src={media.url}
          controls
          className="w-full h-full object-contain rounded-2xl bg-black"
        />
      );
    }

    return (
      <img
        src={media.url}
        alt={media.title || exerciseName}
        className={`w-full h-full object-contain transition-transform duration-300 ${
          isZoomed ? 'scale-100' : 'hover:scale-[1.01]'
        }`}
        loading="eager"
      />
    );
  };

  // EMPTY STATE
  if (totalSlides === 0) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-black/30 text-center p-4 ${
          compact ? 'h-36' : 'h-48 sm:h-64'
        }`}
      >
        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500 mb-2">
          <ImageIcon className="h-5 w-5" />
        </div>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Nenhum GIF ou foto vinculado
        </p>
        {onAddMediaClick && (
          <button
            onClick={onAddMediaClick}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-xs font-black transition-all active:scale-95 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar GIF ou Foto
          </button>
        )}
      </div>
    );
  }

  const currentMedia = mediaList[currentIndex] || mediaList[0];
  const badgeInfo = currentMedia ? getMediaBadgeLabel(currentMedia.type) : null;

  const handleOpenReplace = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentMedia) return;
    setReplaceUrlInput(currentMedia.url || '');
    setReplaceTitleInput(currentMedia.title || '');
    setShowReplaceModal(true);
  };

  const handleConfirmReplace = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentMedia || !replaceUrlInput.trim()) return;
    if (onReplaceMedia) {
      onReplaceMedia(currentMedia, replaceUrlInput.trim(), replaceTitleInput.trim() || undefined);
    }
    setShowReplaceModal(false);
  };

  const handleOpenDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentMedia) return;
    if (onDeleteMedia) {
      onDeleteMedia(currentMedia, currentIndex);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-black/95 select-none group touch-pan-y ${
          compact ? 'h-40 sm:h-48' : 'h-56 sm:h-72 md:h-80'
        }`}
      >
        {/* Main Media Slide with Tap-To-Zoom */}
        <div
          onClick={() => setLightboxOpen(true)}
          className="w-full h-full flex items-center justify-center cursor-pointer relative"
        >
          {currentMedia && renderMediaContent(currentMedia)}

          {/* Top-Left Badge: Type & Slide Counter */}
          {badgeInfo && (
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-black text-white shadow-lg">
              {badgeInfo.icon}
              <span>{currentMedia.title || badgeInfo.label}</span>
              {totalSlides > 1 && (
                <span className="text-slate-400 font-bold ml-1">
                  ({currentIndex + 1}/{totalSlides})
                </span>
              )}
            </div>
          )}

          {/* Top-Right Control Group: Replace, Delete, Slideshow Toggle & Zoom Button */}
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
            {onReplaceMedia && (
              <button
                type="button"
                onClick={handleOpenReplace}
                className="h-8 px-2.5 rounded-xl bg-black/75 hover:bg-black text-sky-400 hover:text-sky-300 flex items-center gap-1 text-[11px] font-bold backdrop-blur-md border border-sky-500/30 transition-transform active:scale-90 shadow-md"
                title="Substituir esta imagem por um novo link"
              >
                <Link2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Substituir Link</span>
              </button>
            )}

            {onDeleteMedia && (
              <button
                type="button"
                onClick={handleOpenDelete}
                className="h-8 px-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 flex items-center gap-1 text-[11px] font-bold backdrop-blur-md border border-rose-500/40 transition-transform active:scale-90 shadow-md"
                title="Excluir esta imagem do exercício"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Excluir</span>
              </button>
            )}

            {totalSlides > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAutoPlaying(!isAutoPlaying);
                }}
                className={`h-8 px-2.5 rounded-xl flex items-center gap-1 text-[11px] font-black backdrop-blur-md border transition-all active:scale-95 ${
                  isAutoPlaying
                    ? 'bg-lime-500 text-black border-lime-400 shadow-md shadow-lime-500/20'
                    : 'bg-black/70 hover:bg-black text-white border-white/10'
                }`}
                title={isAutoPlaying ? 'Pausar Slideshow' : 'Reproduzir Slideshow Automático'}
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>Auto</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>Slideshow</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              className="h-8 w-8 rounded-xl bg-black/75 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-transform active:scale-90"
              title="Ampliar Imagem / GIF"
            >
              <ZoomIn className="h-4 w-4 text-lime-400" />
            </button>
          </div>

          {/* Bottom Caption Overlay */}
          {currentMedia?.description && (
            <div className="absolute bottom-8 left-3 right-3 z-10 pointer-events-none">
              <div className="inline-block max-w-full truncate px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-[11px] text-slate-200 border border-white/10">
                {currentMedia.description}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Arrows for Desktop and Touch */}
        {totalSlides > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all active:scale-90 shadow-xl opacity-80 hover:opacity-100"
              aria-label="Mídia Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all active:scale-90 shadow-xl opacity-80 hover:opacity-100"
              aria-label="Próxima Mídia"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Slide Indicators: Interactive Dots & Preview Chips */}
        {totalSlides > 1 && (
          <div className="absolute bottom-2.5 left-0 right-0 z-20 flex items-center justify-center gap-1.5 px-3">
            {mediaList.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  type="button"
                  key={item.id || idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-6 bg-lime-400 shadow-md shadow-lime-400/50'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* QUICK REPLACE MODAL */}
      {showReplaceModal && currentMedia && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setShowReplaceModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#18181B] border border-slate-200 dark:border-white/10 p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-sky-500/20 text-sky-500 flex items-center justify-center">
                  <Link2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Substituir Imagem por Link
                  </h4>
                  <p className="text-[11px] text-slate-400">{exerciseName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReplaceModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReplace} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Cole o Novo Link da Imagem ou GIF
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://exemplo.com/imagem.gif ou .jpg"
                  value={replaceUrlInput}
                  onChange={(e) => setReplaceUrlInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/50 p-2.5 text-xs text-slate-900 dark:text-white font-mono"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Título / Legenda (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Execução padrão da academia"
                  value={replaceTitleInput}
                  onChange={(e) => setReplaceTitleInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/50 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              {replaceUrlInput.trim() && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Preview</span>
                  <div className="h-32 rounded-xl bg-black flex items-center justify-center overflow-hidden border border-white/10">
                    <img
                      src={replaceUrlInput.trim()}
                      alt="Preview novo link"
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).alt = 'Link inválido ou não carregável';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReplaceModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-white/20 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black text-xs font-black transition shadow-lg shadow-lime-500/20"
                >
                  Salvar Substituição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && currentMedia && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#18181B] border border-rose-500/30 p-5 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Excluir esta Imagem?
                </h4>
                <p className="text-xs text-slate-400">
                  {currentMedia.title || 'Mídia atual'} de {exerciseName}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              A imagem será desvinculada deste exercício. Você poderá adicionar uma nova a qualquer momento.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-white/20 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black transition shadow-lg shadow-rose-500/20"
              >
                Excluir Imagem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX ZOOM MODAL */}
      {lightboxOpen && currentMedia && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-2 sm:p-6 animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Lightbox */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 h-11 w-11 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90 border border-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Lightbox Header */}
          <div className="absolute top-4 left-4 z-50 flex items-center gap-2 max-w-[80vw]">
            <span className="text-xs sm:text-sm font-black text-white bg-black/80 px-3 py-1.5 rounded-xl border border-white/15 truncate">
              {exerciseName}
            </span>
            <span className="text-xs font-bold text-lime-400 bg-lime-500/20 px-2.5 py-1.5 rounded-xl border border-lime-500/30 shrink-0">
              {currentMedia.title || badgeInfo?.label}
            </span>

            {onReplaceMedia && (
              <button
                type="button"
                onClick={handleOpenReplace}
                className="px-2.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-xs font-bold border border-sky-500/40 flex items-center gap-1 transition"
              >
                <Link2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Substituir Link</span>
              </button>
            )}

            {onDeleteMedia && (
              <button
                type="button"
                onClick={handleOpenDelete}
                className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-bold border border-rose-500/40 flex items-center gap-1 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Excluir</span>
              </button>
            )}
          </div>

          {/* Full Screen Media Viewer */}
          <div
            className="w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {renderMediaContent(currentMedia, true)}
          </div>

          {/* Navigation inside Lightbox */}
          {totalSlides > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-2xl bg-black/80 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all active:scale-90 shadow-2xl"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-2xl bg-black/80 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all active:scale-90 shadow-2xl"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}

          {/* Lightbox Footer */}
          <div className="absolute bottom-4 left-0 right-0 z-50 flex flex-col items-center justify-center gap-1 text-center px-4">
            {currentMedia.description && (
              <p className="text-xs text-slate-200 font-medium max-w-lg bg-black/80 px-3.5 py-1.5 rounded-xl border border-white/10">
                {currentMedia.description}
              </p>
            )}
            <p className="text-[11px] text-slate-400 font-bold">
              Item {currentIndex + 1} de {totalSlides}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
