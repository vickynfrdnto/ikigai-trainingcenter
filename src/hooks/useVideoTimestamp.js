// hooks/useVideoTimestamp.js
// Persists video timestamp to localStorage so users can resume mid-video after refresh.
// Saves every SAVE_INTERVAL_MS while playing, and on pause/beforeunload.

import { useEffect, useRef, useCallback } from "react";

const SAVE_INTERVAL_MS = 5_000; // every 5 s while playing
const STORAGE_PREFIX   = "ik_vts_"; // ik_vts_<videoId>

/**
 * @param {React.RefObject<HTMLVideoElement>} videoRef
 * @param {string|null|undefined} videoId
 */
export function useVideoTimestamp(videoRef, videoId) {
  const intervalRef = useRef(null);

  const storageKey = videoId ? `${STORAGE_PREFIX}${videoId}` : null;

  /* ── Save helper ── */
  const saveTimestamp = useCallback(() => {
    if (!videoRef.current || !storageKey) return;
    const t = videoRef.current.currentTime;
    if (t > 1) {
      // Don't save the very first second (auto-restore may re-trigger onEnded)
      localStorage.setItem(storageKey, String(t));
    }
  }, [videoRef, storageKey]);

  /* ── Clear saved timestamp (call when video finishes) ── */
  const clearTimestamp = useCallback(() => {
    if (storageKey) localStorage.removeItem(storageKey);
  }, [storageKey]);

  /* ── Restore timestamp when video metadata loaded ── */
  const restoreTimestamp = useCallback(() => {
    if (!videoRef.current || !storageKey) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const t = parseFloat(saved);
      if (!isNaN(t) && t > 1) {
        videoRef.current.currentTime = t;
      }
    }
  }, [videoRef, storageKey]);

  /* ── Attach / detach listeners when videoId changes ── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !storageKey) return;

    const onPlay = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(saveTimestamp, SAVE_INTERVAL_MS);
    };
    const onPause  = () => { clearInterval(intervalRef.current); saveTimestamp(); };
    const onEnded  = () => { clearInterval(intervalRef.current); clearTimestamp(); };
    const onMeta   = () => restoreTimestamp();
    const onUnload = () => saveTimestamp();

    video.addEventListener("play",         onPlay);
    video.addEventListener("pause",        onPause);
    video.addEventListener("ended",        onEnded);
    video.addEventListener("loadedmetadata", onMeta);
    window.addEventListener("beforeunload", onUnload);

    return () => {
      clearInterval(intervalRef.current);
      video.removeEventListener("play",         onPlay);
      video.removeEventListener("pause",        onPause);
      video.removeEventListener("ended",        onEnded);
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [videoId, storageKey, saveTimestamp, clearTimestamp, restoreTimestamp, videoRef]);

  return { clearTimestamp };
}