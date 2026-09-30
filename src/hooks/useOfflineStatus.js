// hooks/useOfflineStatus.js
// Monitors Firebase's .info/connected and browser navigator.onLine.
// Returns { isOnline, isFirebaseConnected }

import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase-config";

export function useOfflineStatus() {
  const [isOnline,           setIsOnline]           = useState(navigator.onLine);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);

  /* Browser online/offline events */
  useEffect(() => {
    const onOnline  = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online",  onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online",  onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  /* Firebase realtime connection */
  useEffect(() => {
    const connRef    = ref(db, ".info/connected");
    const unsubscribe = onValue(connRef, (snap) => {
      setIsFirebaseConnected(snap.val() === true);
    });
    return () => unsubscribe();
  }, []);

  return { isOnline, isFirebaseConnected };
}
