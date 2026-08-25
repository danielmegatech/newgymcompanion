/**
 * Gym Companion — useScreenLock Hook
 * Keeps screen awake during active workout using Screen Wake Lock API
 * with automatic re-acquisition on visibility change, Samsung Internet compatibility,
 * and cross-platform Fullscreen toggle (including iOS / Safari fallbacks).
 */

import { useState, useEffect, useCallback, useRef } from 'react';

declare global {
  interface Document {
    webkitFullscreenElement?: Element;
    webkitExitFullscreen?: () => Promise<void>;
  }
  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
  }
}

export interface UseScreenLockOptions {
  enabled?: boolean;
}

export function useScreenLock(options: UseScreenLockOptions = { enabled: true }) {
  const { enabled = true } = options;
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  // Request Wake Lock safely
  const requestLock = useCallback(async () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    if (!('wakeLock' in navigator) || !navigator.wakeLock) {
      // Browser does not support WakeLock API (e.g. older iOS or unsupported webviews)
      return;
    }

    try {
      // If already held and not released, do not duplicate
      if (sentinelRef.current && !sentinelRef.current.released) {
        return;
      }

      const sentinel = await navigator.wakeLock.request('screen');
      sentinelRef.current = sentinel;
      setIsLocked(true);

      sentinel.onrelease = () => {
        sentinelRef.current = null;
        setIsLocked(false);
      };
    } catch (err) {
      // Gracefully handle rejection (e.g., low battery, tab unfocused, system policy)
      setIsLocked(false);
    }
  }, []);

  // Release Wake Lock
  const releaseLock = useCallback(async () => {
    if (sentinelRef.current && !sentinelRef.current.released) {
      try {
        await sentinelRef.current.release();
      } catch (err) {
        // Ignore release errors
      }
    }
    sentinelRef.current = null;
    setIsLocked(false);
  }, []);

  // Sync fullscreen state
  const checkFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
    setIsFullscreen(!!fsElement);
  }, []);

  // Toggle Fullscreen mode
  const toggleFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') return;

    try {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);

      if (!isCurrentlyFullscreen) {
        const root = document.documentElement;
        if (root.requestFullscreen) {
          await root.requestFullscreen();
        } else if (root.webkitRequestFullscreen) {
          await root.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      }
    } catch (err) {
      // Fail silently if browser blocks fullscreen
      console.warn('[PWA Fullscreen] Action could not be completed:', err);
    } finally {
      checkFullscreen();
    }
  }, [checkFullscreen]);

  useEffect(() => {
    if (!enabled) {
      releaseLock();
      return;
    }

    // 1. Initial lock acquisition
    requestLock();

    // 2. Re-acquire lock when app tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        requestLock();
      }
    };

    const handleFullscreenChange = () => {
      checkFullscreen();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    // Initial fullscreen check
    checkFullscreen();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      releaseLock();
    };
  }, [enabled, requestLock, releaseLock, checkFullscreen]);

  return {
    isLocked,
    isFullscreen,
    toggleFullscreen,
    requestLock,
    releaseLock,
  };
}
