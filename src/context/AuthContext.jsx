import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInAnonymously, signOut } from "firebase/auth";
import { get, onValue, ref, update } from "firebase/database";
import { db } from "../firebase-config";

const AuthContext = createContext(null);
const auth = getAuth();
const STORAGE_KEY = "ikigai_user";

function makeUser(profile, code) {
  return {
    ...profile,
    id: code,
    kode: code,
    isAdmin: String(profile.role || "").toUpperCase() === "ADMIN",
    permissions: profile.permissions || [],
    scopes: profile.scopes || [],
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    if (auth.currentUser) await signOut(auth);
  }, []);

  const login = useCallback(async ({ kode }) => {
    const code = String(kode || "").trim().toUpperCase();
    if (!code) throw new Error("Akun tidak ditemukan.");

    if (!auth.currentUser) await signInAnonymously(auth);
    const snapshot = await get(ref(db, `users/${code}`));
    const profile = snapshot.val();
    if (!profile) throw new Error("Akun tidak ditemukan.");
    if (String(profile.status || "Active").toLowerCase() !== "active") {
      throw new Error("Akun kamu telah dinonaktifkan. Hubungi admin.");
    }

    const now = new Date();
    const lastActive = `${now.toLocaleDateString("id-ID")}, ${now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
    await update(ref(db, `users/${code}`), { lastActive });
    const nextUser = makeUser({ ...profile, lastActive }, code);
    localStorage.setItem(STORAGE_KEY, code);
    setUser(nextUser);
    setLoading(false);
    return nextUser;
  }, []);

  useEffect(() => onAuthStateChanged(auth, async (firebaseUser) => {
    const code = localStorage.getItem(STORAGE_KEY);
    if (!firebaseUser || !code) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const snapshot = await get(ref(db, `users/${code}`));
      const profile = snapshot.val();
      if (!profile || String(profile.status || "Active").toLowerCase() !== "active") {
        localStorage.removeItem(STORAGE_KEY);
        await signOut(auth);
        setUser(null);
      } else {
        setUser(makeUser(profile, code));
      }
    } catch (error) {
      console.error("Gagal memulihkan sesi:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }), []);

  useEffect(() => {
    if (!user?.kode) return undefined;
    return onValue(ref(db, `users/${user.kode}/status`), (snapshot) => {
      if (snapshot.val() === "Inactive") logout();
    });
  }, [user?.kode, logout]);

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth harus digunakan di dalam AuthProvider.");
  return value;
}
