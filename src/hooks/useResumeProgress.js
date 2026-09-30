// hooks/useResumeProgress.js
// Persists lastWatchedId to Firebase and returns a resume helper

import { useCallback } from "react";
import { ref, update, get } from "firebase/database";
import { db } from "../firebase-config";

/**
 * @param {string|null} targetUserKode
 * @returns {{ saveResume, loadResume }}
 */
export function useResumeProgress(targetUserKode) {
  const saveResume = useCallback(
    async (videoId) => {
      if (!targetUserKode || !videoId) return;
      try {
        await update(ref(db, `users/${targetUserKode}`), {
          lastWatchedId: videoId,
        });
      } catch (e) {
        console.error("saveResume:", e);
      }
    },
    [targetUserKode]
  );

  const loadResume = useCallback(async () => {
    if (!targetUserKode) return null;
    try {
      const snap = await get(ref(db, `users/${targetUserKode}/lastWatchedId`));
      return snap.exists() ? snap.val() : null;
    } catch (e) {
      console.error("loadResume:", e);
      return null;
    }
  }, [targetUserKode]);

  return { saveResume, loadResume };
}
