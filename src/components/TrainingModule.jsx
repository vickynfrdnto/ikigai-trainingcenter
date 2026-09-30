// TrainingModule.jsx
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useAuth }         from "../context/AuthContext";
import { db }              from "../firebase-config";
import { ref, update, onValue } from "firebase/database";
import { matchesModuleAudience } from "../domain/organization";

// Components
import Quiz                 from "./Quiz";
import CandidateDashboard    from "./CandidateDashboard";
import AchievementToast      from "./AchievementToast";
import LogoutConfirmDialog   from "./LogoutConfirmDialog";
import OfflineBanner         from "./OfflineBanner";
import QuizReviewModal       from "./QuizReviewModal";
import QuizHistoryPage       from "./QuizHistoryPage";

// Hooks
import { useResumeProgress }    from "../hooks/useResumeProgress";
import { useVideoTimestamp }    from "../hooks/useVideoTimestamp";
import { useOfflineStatus }     from "../hooks/useOfflineStatus";
import { normalizeQuizAnswers } from "../utils/normalizeQuizAnswers";

// Flipbook
import FlipbookDocViewer from "./FlipbookDocViewer";
import "../FlipbookDocViewer.css";

import "../TrainingModule.css";

// ── Inline SVG Icons untuk Tampilan Elegan & Ringan ──
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const CertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

// ── History icon dipakai di tombol "Lihat Semua Riwayat" (Profil) ──
const HistoryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ── Bell icon (Notifikasi Modul Baru) ──
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// ── Bookmark icon (Simpan Modul) ──
const BookmarkIcon = ({ filled = false }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

// ── Document icon (SOP Reader) ──
const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

/* ══════════════════════════════════════════════════════════
   PUSAT NOTIFIKASI (hook + komponen + CSS, semuanya di file ini)
   ──────────────────────────────────────────────────────────
   - useNotifications : sumber tunggal data notifikasi + status baca.
   - NotificationCenter: dropdown (desktop) / bottom sheet (mobile).
   - NC_STYLES         : CSS, disuntikkan sekali ke <head>. Boleh
                         dipindah ke TrainingModule.css bila mau.

   Menambah jenis notifikasi baru:
     1) tambah blok list.push({...}) di useNotifications
     2) tambah entri di NC_TYPE_META
   ══════════════════════════════════════════════════════════ */

const NC_DAY = 24 * 60 * 60 * 1000;
const NC_RECENT_DAYS = 7;       // modul dianggap "baru" bila diunggah <= 7 hari (saat baseline pertama)
const NC_KEEP_READ_DAYS = 30;   // notifikasi yang sudah dibaca disembunyikan setelah 30 hari
const NC_PAGE_SIZE = 6;

const ncReadKey   = (k) => `ikigai_notif_read_${k}`;
const ncBaseKey   = (k) => `ikigai_notif_baseline_${k}`;
const ncLegacyKey = (k) => `ikigai_seen_modules_${k}`;

// Waktu unggah modul. Sesuaikan nama field dengan yang disimpan AdminPanel.
function getModuleTime(m) {
  const raw = m?.createdAt ?? m?.uploadedAt ?? m?.timestamp ?? null;
  if (raw == null) return null;
  const t = typeof raw === "number" ? raw : Date.parse(raw);
  return Number.isNaN(t) ? null : t;
}

function ncSafeParse(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}

function useNotifications({ userKey, modules, completedVideos, passedQuizzes }) {
  const [readIds, setReadIds] = useState([]);
  const hasModules = modules.length > 0;

  const persist = useCallback((ids) => {
    try { localStorage.setItem(ncReadKey(userKey), JSON.stringify(ids)); } catch { /* abaikan */ }
  }, [userKey]);

  // Muat status baca + baseline pertama kali. Baseline mencegah SEMUA modul
  // lama (mis. 62 modul) tampil sebagai "baru" di perangkat yang baru dibuka.
  useEffect(() => {
    if (!userKey || !hasModules) return;

    let ids = ncSafeParse(localStorage.getItem(ncReadKey(userKey)), []);

    // Migrasi dari format lama (id modul polos -> "module:<id>")
    const legacy = ncSafeParse(localStorage.getItem(ncLegacyKey(userKey)), []);
    if (legacy.length) ids = [...ids, ...legacy.map((id) => `module:${id}`)];

    if (!localStorage.getItem(ncBaseKey(userKey))) {
      const now = Date.now();
      const old = modules
        .filter((m) => {
          const t = getModuleTime(m);
          return t == null || now - t > NC_RECENT_DAYS * NC_DAY;
        })
        .map((m) => `module:${m.id}`);
      ids = [...ids, ...old];
      try { localStorage.setItem(ncBaseKey(userKey), "1"); } catch { /* abaikan */ }
    }

    ids = Array.from(new Set(ids));
    setReadIds(ids);
    persist(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userKey, hasModules]);

  const notifications = useMemo(() => {
    const readSet   = new Set(readIds);
    const passedSet = new Set(passedQuizzes.map((q) => q.id));
    const doneSet   = new Set(completedVideos);
    const now       = Date.now();
    const list      = [];

    modules.forEach((m) => {
      if (passedSet.has(m.id)) return; // sudah lulus -> tidak perlu diingatkan

      // 1) Modul baru
      const nid   = `module:${m.id}`;
      const time  = getModuleTime(m);
      const read  = readSet.has(nid);
      const stale = read && (time == null || now - time > NC_KEEP_READ_DAYS * NC_DAY);
      if (!stale) {
        list.push({
          id: nid, type: "module_new", moduleId: m.id,
          title: m.title, meta: m.category, time, read,
        });
      }

      // 2) Kuis tertunda (video/dokumen selesai, kuis belum lulus)
      if (doneSet.has(m.id)) {
        const pid = `pending:${m.id}`;
        list.push({
          id: pid, type: "quiz_pending", moduleId: m.id,
          title: m.title, meta: "Kuis belum dikerjakan", time: null,
          read: readSet.has(pid),
        });
      }
    });

    return list;
  }, [modules, readIds, completedVideos, passedQuizzes]);

  const markRead = useCallback((ids) => {
    setReadIds((prev) => {
      const next = Array.from(new Set([...prev, ...ids]));
      persist(next);
      return next;
    });
  }, [persist]);

  const markAllRead = useCallback(() => {
    markRead(notifications.filter((n) => !n.read).map((n) => n.id));
  }, [notifications, markRead]);

  return { notifications, markRead, markAllRead };
}

/* ── Ikon khusus notifikasi ── */
const NcClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 14" />
  </svg>
);
const NcCheckAllIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 6 9 17 4 12" />
    <polyline points="22 6 13 17" />
  </svg>
);

/* ── Konfigurasi per jenis notifikasi ── */
const NC_TYPE_META = {
  module_new:   { label: "Modul baru",    tone: "emerald", Icon: BookIcon },
  quiz_pending: { label: "Kuis tertunda", tone: "gold",    Icon: NcClockIcon },
};
const NC_FALLBACK_META = { label: "Info", tone: "neutral", Icon: BellIcon };

const ncRtf = typeof Intl !== "undefined" && Intl.RelativeTimeFormat
  ? new Intl.RelativeTimeFormat("id", { numeric: "auto" })
  : null;

function ncFormatTime(ts) {
  if (!ts || !ncRtf) return "";
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Baru saja";
  if (min < 60) return ncRtf.format(-min, "minute");
  const hr = Math.floor(min / 60);
  if (hr < 24) return ncRtf.format(-hr, "hour");
  const day = Math.floor(hr / 24);
  if (day < 30) return ncRtf.format(-day, "day");
  return new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const NC_STYLES = `
.nc-wrap{--nc-ink:#12332a;--nc-muted:#6b7f77;--nc-line:#e4ece8;--nc-emerald:#0f6b4f;--nc-emerald-bg:#e3f4ee;--nc-gold:#a97416;--nc-gold-bg:#fbf1de;--nc-unread-bg:#f3faf7;position:relative}
.nc-trigger{position:relative}
.nc-badge{position:absolute;top:-5px;right:-5px;min-width:17px;height:17px;padding:0 4px;display:grid;place-items:center;background:#d64545;color:#fff;font-size:10px;font-weight:700;line-height:1;border-radius:999px;border:2px solid #063d2e}
.nc-panel{position:absolute;right:0;top:calc(100% + 12px);z-index:60;width:min(392px,92vw);max-height:min(560px,74vh);display:flex;flex-direction:column;background:#fff;color:var(--nc-ink);border:1px solid var(--nc-line);border-radius:16px;box-shadow:0 18px 48px rgba(6,40,30,.22);overflow:hidden;animation:nc-in .16s ease-out}
.nc-backdrop,.nc-handle{display:none}
@keyframes nc-in{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.nc-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px 10px}
.nc-head-title{display:flex;align-items:center;gap:8px}
.nc-head h3{margin:0;font-size:16px;font-weight:700}
.nc-count{font-size:11px;font-weight:600;color:var(--nc-emerald);background:var(--nc-emerald-bg);padding:2px 8px;border-radius:999px}
.nc-markall{display:inline-flex;align-items:center;gap:5px;background:none;border:0;padding:6px 8px;margin-right:-8px;font:inherit;font-size:12px;font-weight:600;color:var(--nc-emerald);border-radius:8px;cursor:pointer}
.nc-markall:hover:not(:disabled){background:var(--nc-emerald-bg)}
.nc-markall:disabled{color:#a3b3ad;cursor:default}
.nc-tabs{display:flex;gap:4px;padding:0 16px;border-bottom:1px solid var(--nc-line)}
.nc-tabs button{background:none;border:0;padding:8px 4px 10px;margin-right:14px;font:inherit;font-size:13px;font-weight:600;color:var(--nc-muted);border-bottom:2px solid transparent;margin-bottom:-1px;cursor:pointer}
.nc-tabs button.active{color:var(--nc-emerald);border-bottom-color:var(--nc-emerald)}
.nc-body{overflow-y:auto;overscroll-behavior:contain;padding-bottom:8px}
.nc-group{margin:0;padding:12px 16px 6px;font-size:12px;font-weight:600;color:var(--nc-muted)}
.nc-list{list-style:none;margin:0;padding:0}
.nc-row{position:relative;display:flex;align-items:stretch}
.nc-row.unread{background:var(--nc-unread-bg)}
.nc-item{flex:1;min-width:0;display:flex;align-items:flex-start;gap:12px;padding:11px 44px 11px 16px;background:none;border:0;text-align:left;font:inherit;color:inherit;cursor:pointer}
.nc-item:hover{background:rgba(15,107,79,.06)}
.nc-icon{flex:none;width:34px;height:34px;border-radius:10px;display:grid;place-items:center}
.nc-icon.emerald{background:var(--nc-emerald-bg);color:var(--nc-emerald)}
.nc-icon.gold{background:var(--nc-gold-bg);color:var(--nc-gold)}
.nc-icon.neutral{background:#eef1f0;color:#3d4f48}
.nc-text{min-width:0;display:flex;flex-direction:column;gap:4px}
.nc-title{font-size:13.5px;font-weight:600;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.nc-row:not(.unread) .nc-title{font-weight:500;color:#3d4f48}
.nc-sub{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;font-size:11.5px;color:var(--nc-muted)}
.nc-tag{font-weight:600;padding:1px 7px;border-radius:999px}
.nc-tag.emerald{background:var(--nc-emerald-bg);color:var(--nc-emerald)}
.nc-tag.gold{background:var(--nc-gold-bg);color:var(--nc-gold)}
.nc-tag.neutral{background:#eef1f0;color:#3d4f48}
.nc-time{margin-left:auto}
.nc-dot{position:absolute;top:16px;right:16px;width:8px;height:8px;border-radius:50%;background:#16a37f}
.nc-mark{position:absolute;top:9px;right:10px;width:26px;height:26px;border-radius:8px;display:none;place-items:center;background:#fff;color:var(--nc-emerald);border:1px solid var(--nc-line);cursor:pointer}
.nc-mark:hover{background:var(--nc-emerald-bg)}
.nc-row:hover .nc-mark,.nc-mark:focus-visible{display:grid}
.nc-row:hover .nc-dot{display:none}
.nc-more{display:flex;align-items:baseline;justify-content:center;gap:8px;width:calc(100% - 32px);margin:10px 16px 4px;padding:9px;background:none;border:1px dashed var(--nc-line);border-radius:10px;font:inherit;font-size:13px;font-weight:600;color:var(--nc-emerald);cursor:pointer}
.nc-more small{font-weight:500;color:var(--nc-muted)}
.nc-more:hover{background:var(--nc-emerald-bg)}
.nc-empty{display:flex;flex-direction:column;align-items:center;text-align:center;padding:36px 24px;gap:6px}
.nc-empty-icon{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:var(--nc-emerald-bg);color:var(--nc-emerald);margin-bottom:4px}
.nc-empty strong{font-size:14px}
.nc-empty p{margin:0;font-size:12.5px;color:var(--nc-muted)}
.nc-wrap button:focus-visible{outline:2px solid #16a37f;outline-offset:-2px;border-radius:8px}
@media (max-width:640px){
.nc-wrap{position:static}
.nc-backdrop{display:block;position:fixed;inset:0;z-index:1000;background:rgba(6,30,24,.5)}
.nc-panel{position:fixed;left:0;right:0;bottom:0;top:auto;z-index:1001;width:auto;max-height:82vh;border-radius:20px 20px 0 0;border-bottom:0;animation:nc-sheet .22s ease-out;padding-bottom:env(safe-area-inset-bottom,0)}
.nc-handle{display:block;width:40px;height:4px;border-radius:4px;background:#d3ddd8;margin:8px auto 0}
.nc-item{padding-top:13px;padding-bottom:13px}
.nc-mark{display:grid}
.nc-dot{display:none}
.nc-row.unread .nc-item{padding-right:48px}
@keyframes nc-sheet{from{transform:translateY(100%)}to{transform:none}}
}
@media (prefers-reduced-motion:reduce){.nc-panel{animation:none}}
`;

/**
 * notifications: [{ id, type, title, meta, time, read }]
 * onSelect(n), onMarkRead(ids[]), onMarkAllRead()
 */
function NotificationCenter({ notifications = [], onSelect, onMarkRead, onMarkAllRead }) {
  const [open,  setOpen]  = useState(false);
  const [tab,   setTab]   = useState("all");
  const [limit, setLimit] = useState(NC_PAGE_SIZE);
  const wrapRef = useRef(null);

  // Suntik CSS sekali saja
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("nc-styles")) return;
    const el = document.createElement("style");
    el.id = "nc-styles";
    el.textContent = NC_STYLES;
    document.head.appendChild(el);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const sorted = useMemo(() => {
    const src = tab === "unread" ? notifications.filter((n) => !n.read) : notifications;
    return [...src].sort((a, b) => (a.read - b.read) || ((b.time || 0) - (a.time || 0)));
  }, [notifications, tab]);

  const visible    = sorted.slice(0, limit);
  const unreadRows = visible.filter((n) => !n.read);
  const readRows   = visible.filter((n) => n.read);
  const remaining  = sorted.length - visible.length;

  const close = () => { setOpen(false); setTab("all"); setLimit(NC_PAGE_SIZE); };

  // Tutup saat klik di luar / tekan Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) close(); };
    const onKey  = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleSelect = (n) => {
    onMarkRead?.([n.id]);
    onSelect?.(n);
    close();
  };

  const renderRow = (n) => {
    const meta = NC_TYPE_META[n.type] || NC_FALLBACK_META;
    const { Icon } = meta;
    return (
      <li key={n.id} className={`nc-row ${n.read ? "" : "unread"}`}>
        <button type="button" className="nc-item" onClick={() => handleSelect(n)}>
          <span className={`nc-icon ${meta.tone}`}><Icon /></span>
          <span className="nc-text">
            <span className="nc-title">{n.title}</span>
            <span className="nc-sub">
              <span className={`nc-tag ${meta.tone}`}>{meta.label}</span>
              {n.meta && <span className="nc-meta">{n.meta}</span>}
              {n.time && <span className="nc-time">{ncFormatTime(n.time)}</span>}
            </span>
          </span>
          {!n.read && <span className="nc-dot" aria-label="Belum dibaca" />}
        </button>
        {!n.read && (
          <button
            type="button"
            className="nc-mark"
            title="Tandai dibaca"
            aria-label={`Tandai "${n.title}" sudah dibaca`}
            onClick={() => onMarkRead?.([n.id])}
          >
            <CheckIcon />
          </button>
        )}
      </li>
    );
  };

  return (
    <div className="nc-wrap" ref={wrapRef}>
      <button
        type="button"
        className="topbar-help-btn nc-trigger"
        onClick={() => (open ? close() : setOpen(true))}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={unreadCount ? `Notifikasi, ${unreadCount} belum dibaca` : "Notifikasi"}
        title="Notifikasi"
      >
        <BellIcon />
        {unreadCount > 0 && <span className="nc-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>

      {open && (
        <>
          <div className="nc-backdrop" onClick={close} />
          <section className="nc-panel" role="dialog" aria-label="Pusat notifikasi">
            <div className="nc-handle" />

            <header className="nc-head">
              <div className="nc-head-title">
                <h3>Notifikasi</h3>
                {unreadCount > 0 && <span className="nc-count">{unreadCount} baru</span>}
              </div>
              <button
                type="button"
                className="nc-markall"
                disabled={unreadCount === 0}
                onClick={() => onMarkAllRead?.()}
              >
                <NcCheckAllIcon /> Tandai semua dibaca
              </button>
            </header>

            <div className="nc-tabs" role="tablist">
              <button
                type="button" role="tab" aria-selected={tab === "all"}
                className={tab === "all" ? "active" : ""}
                onClick={() => { setTab("all"); setLimit(NC_PAGE_SIZE); }}
              >
                Semua
              </button>
              <button
                type="button" role="tab" aria-selected={tab === "unread"}
                className={tab === "unread" ? "active" : ""}
                onClick={() => { setTab("unread"); setLimit(NC_PAGE_SIZE); }}
              >
                Belum dibaca{unreadCount > 0 ? ` (${unreadCount})` : ""}
              </button>
            </div>

            <div className="nc-body">
              {sorted.length === 0 ? (
                <div className="nc-empty">
                  <span className="nc-empty-icon"><BellIcon /></span>
                  <strong>{tab === "unread" ? "Semua sudah dibaca" : "Belum ada notifikasi"}</strong>
                  <p>
                    {tab === "unread"
                      ? "Tidak ada yang perlu Anda cek saat ini."
                      : "Modul baru dan pengingat kuis akan muncul di sini."}
                  </p>
                </div>
              ) : (
                <>
                  {unreadRows.length > 0 && (
                    <>
                      <p className="nc-group">Belum dibaca</p>
                      <ul className="nc-list">{unreadRows.map(renderRow)}</ul>
                    </>
                  )}
                  {readRows.length > 0 && (
                    <>
                      <p className="nc-group">Sebelumnya</p>
                      <ul className="nc-list">{readRows.map(renderRow)}</ul>
                    </>
                  )}
                  {remaining > 0 && (
                    <button type="button" className="nc-more" onClick={() => setLimit((l) => l + NC_PAGE_SIZE)}>
                      Tampilkan {Math.min(remaining, NC_PAGE_SIZE)} lagi
                      <small>{remaining} tersisa</small>
                    </button>
                  )}
                </>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HEADER SERTIFIKAT (CertificateHeader)
   ──────────────────────────────────────────────────────────
   Satu komponen dipakai di sertifikat asli DAN pratinjau terkunci.
   - Logo + nama IKIGAI + tagline = satu paket brand di kiri.
   - Paket brand sejajar secara vertikal dengan blok "No. Sertifikat".
   - Ganti brand cukup lewat CERT_BRAND atau prop `brand`.
   - CSS (CERT_STYLES) disuntikkan sekali ke <head>, jadi tidak perlu
     mengubah TrainingModule.css. Class lama .cert-logo-box /
     .cert-brand-* tidak lagi dipakai dan boleh dihapus dari CSS.
   ══════════════════════════════════════════════════════════ */

const CERT_BRAND = {
  name: "IKIGAI",
  tagline: "HOT STONE MASSAGE & REFLEXOLOGY",
  logo: "/logo_ikigai.png",
};

const CERT_STYLES = `
.official-certificate-frame .cert-header.cert-header{
  position:relative;display:flex;align-items:center;justify-content:space-between;
  gap:16px;margin:0 0 20px;padding:0 0 16px;border-bottom:1px solid #efe6d2}
.cert-brand{display:flex;align-items:center;gap:12px;min-width:0}
.cert-brand .cert-brand__logo{
  position:static;flex:none;width:48px;height:48px;margin:0;border-radius:50%;
  object-fit:cover;box-shadow:0 0 0 2px #fff,0 0 0 3px #d9c9a3}
.cert-brand__text{display:flex;flex-direction:column;align-items:flex-start;gap:3px;min-width:0;line-height:1;text-align:left}
.cert-brand__name{font-size:24px;font-weight:800;letter-spacing:.06em;color:#0b4f3c}
.cert-brand__tagline{font-size:9.5px;font-weight:700;letter-spacing:.14em;color:#d97706;white-space:nowrap}
.cert-no{display:flex;flex-direction:column;align-items:flex-end;gap:3px;text-align:right;line-height:1}
.cert-no__label{font-size:10px;font-weight:600;letter-spacing:.04em;color:#8a9a94}
.cert-no__value{
  font-family:ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;
  font-size:11.5px;font-weight:700;letter-spacing:.04em;color:#b87511}
@media (max-width:640px){
.official-certificate-frame .cert-header.cert-header{flex-wrap:wrap;row-gap:10px}
.cert-brand .cert-brand__logo{width:40px;height:40px}
.cert-brand__name{font-size:20px}
.cert-brand__tagline{font-size:8px;white-space:normal}
.cert-no{align-items:flex-start;text-align:left}
}
@media print{
.cert-header,.cert-brand__logo,.cert-brand__name,.cert-brand__tagline,.cert-no__value{
  -webkit-print-color-adjust:exact;print-color-adjust:exact}
}
`;

function CertificateHeader({ credentialId, brand = CERT_BRAND }) {
  // Suntik CSS sekali saja
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("cert-styles")) return;
    const el = document.createElement("style");
    el.id = "cert-styles";
    el.textContent = CERT_STYLES;
    document.head.appendChild(el);
  }, []);

  return (
    <header className="cert-header">
      <div className="cert-brand">
        <img
          src={brand.logo}
          alt={`Logo ${brand.name}`}
          className="cert-brand__logo"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <div className="cert-brand__text">
          <span className="cert-brand__name">{brand.name}</span>
          <span className="cert-brand__tagline">{brand.tagline}</span>
        </div>
      </div>

      {credentialId && (
        <div className="cert-no">
          <span className="cert-no__label">No. Sertifikat</span>
          <strong className="cert-no__value">{credentialId}</strong>
        </div>
      )}
    </header>
  );
}

/* ══════════════════════════════════════════════════════════
   HALAMAN PROFIL (ProfileView)
   ──────────────────────────────────────────────────────────
   Komponen presentasional: semua data masuk lewat props, tidak tahu
   soal Firebase / state induk. CSS (PF_STYLES) disuntikkan sekali.
   Struktur:
     hero (identitas + status + aksi utama + 4 statistik)
     ├─ kolom utama : Progres (ring + rincian per kategori + langkah
     │                berikutnya) → Riwayat kuis terbaru
     └─ kolom samping: Identitas & akses → Bantuan & akun
   Menambah kategori modul baru tidak perlu ubah kode: rincian
   progres dihitung otomatis dari field `category`.
   ══════════════════════════════════════════════════════════ */

const PF_RECENT_LIMIT = 5;

const pfScoreTier = (s) => (s >= 80 ? "high" : s >= 70 ? "mid" : "low");
const pfFormatDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const PfCopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const PfPlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);

const PF_STYLES = `
.pf{--pf-ink:#12332a;--pf-muted:#5f746c;--pf-line:#e4ece8;--pf-emerald:#0f6b4f;--pf-green:#16a37f;--pf-emerald-bg:#e3f4ee;--pf-gold:#a97416;--pf-gold-bg:#fbf1de;--pf-red:#c4433a;--pf-red-bg:#fbebe8;display:flex;flex-direction:column;gap:16px;max-width:1120px;margin:0 auto;color:var(--pf-ink)}
.pf-hero{position:relative;overflow:hidden;border-radius:22px;padding:24px;color:#fff;background:radial-gradient(120% 140% at 0% 0%,#1a8a68 0%,#0b5a43 45%,#053b2d 100%);box-shadow:0 14px 34px rgba(5,59,45,.28);display:flex;flex-direction:column;gap:22px}
.pf-hero-top{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.pf-avatar{position:relative;flex:none;width:72px;height:72px;border-radius:50%;display:grid;place-items:center;font-size:24px;font-weight:800;letter-spacing:.02em;background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.55)}
.pf-avatar i{position:absolute;right:2px;bottom:2px;width:14px;height:14px;border-radius:50%;background:#34d399;border:3px solid #0b5a43}
.pf-id{flex:1;min-width:200px;display:flex;flex-direction:column;gap:6px}
.pf-status{align-self:flex-start;font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.28)}
.pf-status.done{background:rgba(250,204,21,.18);border-color:rgba(250,204,21,.5);color:#fde68a}
.pf-name{margin:0;font-size:clamp(22px,3vw,28px);font-weight:800;line-height:1.2;letter-spacing:-.01em}
.pf-sub{margin:0;font-size:13.5px;color:rgba(255,255,255,.8)}
.pf-hero-actions{display:flex;gap:8px;flex-wrap:wrap}
.pf-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font:inherit;font-size:13.5px;font-weight:700;padding:10px 16px;border-radius:12px;border:1px solid transparent;cursor:pointer;transition:background .15s,transform .12s}
.pf-btn.light{background:#fff;color:var(--pf-emerald)}
.pf-btn.light:hover{background:#f0faf6}
.pf-btn.ghost{background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.3)}
.pf-btn.ghost:hover{background:rgba(255,255,255,.2)}
.pf-btn.primary{background:linear-gradient(135deg,#0f6b4f,#16a37f);color:#fff}
.pf-btn.primary:hover{transform:translateY(-1px)}
.pf-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.pf-stat{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:2px;min-width:0}
.pf-stat b{font-size:22px;font-weight:800;line-height:1.1}
.pf-stat span{font-size:12px;color:rgba(255,255,255,.75)}
.pf-stat.gold b{color:#fcd34d}
.pf-stat.mint b{color:#6ee7b7}
.pf-grid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px;align-items:start}
.pf-col{display:flex;flex-direction:column;gap:16px;min-width:0}
.pf-card{background:#fff;border:1px solid var(--pf-line);border-radius:18px;padding:20px;display:flex;flex-direction:column;gap:16px;box-shadow:0 1px 2px rgba(6,40,30,.04)}
.pf-card-head{display:flex;align-items:center;gap:10px;min-height:32px}
.pf-card-icon{flex:none;width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:var(--pf-emerald-bg);color:var(--pf-emerald)}
.pf-card-head h3{margin:0;flex:1;min-width:0;font-size:15.5px;font-weight:700}
.pf-link{display:inline-flex;align-items:center;gap:4px;background:none;border:0;padding:6px 8px;margin-right:-8px;font:inherit;font-size:12.5px;font-weight:700;color:var(--pf-emerald);border-radius:8px;cursor:pointer}
.pf-link:hover{background:var(--pf-emerald-bg)}
.pf-progress{display:flex;align-items:center;gap:20px}
.pf-ring{position:relative;flex:none;width:104px;height:104px}
.pf-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.pf-ring circle{fill:none;stroke-width:9}
.pf-ring .bg{stroke:#e9f1ed}
.pf-ring .fg{stroke:var(--pf-green);stroke-linecap:round;transition:stroke-dasharray .5s ease}
.pf-ring strong{position:absolute;inset:0;display:grid;place-items:center;font-size:22px;font-weight:800}
.pf-progress-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:10px}
.pf-progress-info p{margin:0;font-size:13.5px;line-height:1.55;color:var(--pf-muted)}
.pf-seg{display:flex;height:8px;border-radius:8px;overflow:hidden;background:#eef1f0}
.pf-seg span{display:block;height:100%}
.pf-seg .s-done{background:var(--pf-green)}
.pf-seg .s-wait{background:#f2b53d}
.pf-legend{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12px;color:var(--pf-muted)}
.pf-legend span{display:inline-flex;align-items:center;gap:6px}
.pf-legend i{width:8px;height:8px;border-radius:50%}
.pf-cats{display:flex;flex-direction:column;gap:12px;padding-top:14px;border-top:1px solid var(--pf-line)}
.pf-cat-row{display:grid;grid-template-columns:110px 1fr auto;align-items:center;gap:12px;font-size:13px}
.pf-cat-row b{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pf-cat-track{height:6px;border-radius:6px;background:#eef1f0;overflow:hidden}
.pf-cat-track span{display:block;height:100%;background:var(--pf-green);border-radius:6px}
.pf-cat-row small{font-size:12px;color:var(--pf-muted);font-variant-numeric:tabular-nums}
.pf-next{display:flex;align-items:center;gap:14px;padding:14px;border-radius:14px;background:#f3faf7;border:1px solid #d6ebe2}
.pf-next-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.pf-next-text small{font-size:12px;color:var(--pf-muted)}
.pf-next-text b{font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pf-next.done{background:var(--pf-gold-bg);border-color:#f1dfb5}
.pf-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.pf-item{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:14px;background:#f7faf9;border:1px solid transparent}
.pf-item-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.pf-item-text b{font-size:13.5px;font-weight:600;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pf-item-text small{font-size:12px;color:var(--pf-muted)}
.pf-score{flex:none;font-size:12.5px;font-weight:700;padding:4px 10px;border-radius:999px;font-variant-numeric:tabular-nums}
.pf-score.high{background:var(--pf-emerald-bg);color:var(--pf-emerald)}
.pf-score.mid{background:var(--pf-gold-bg);color:var(--pf-gold)}
.pf-score.low{background:var(--pf-red-bg);color:var(--pf-red)}
.pf-empty{margin:0;padding:22px 12px;text-align:center;font-size:13.5px;color:var(--pf-muted);line-height:1.6}
.pf-dl{margin:0;display:flex;flex-direction:column}
.pf-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--pf-line)}
.pf-row:last-child{border-bottom:0;padding-bottom:0}
.pf-row:first-child{padding-top:0}
.pf-row dt{font-size:12.5px;color:var(--pf-muted)}
.pf-row dd{margin:0;font-size:13.5px;font-weight:600;text-align:right;min-width:0;overflow-wrap:anywhere}
.pf-row dd.accent{color:var(--pf-emerald)}
.pf-copy{display:inline-flex;align-items:center;gap:8px;font:inherit;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12.5px;font-weight:700;padding:6px 10px;border-radius:10px;border:1px solid var(--pf-line);background:#f7faf9;color:var(--pf-ink);cursor:pointer}
.pf-copy:hover{background:var(--pf-emerald-bg)}
.pf-copy.ok{background:var(--pf-emerald-bg);color:var(--pf-emerald);border-color:transparent}
.pf-copy-hint{margin:8px 0 0;font-size:11.5px;color:var(--pf-muted);text-align:right}
.pf-actions{display:flex;flex-direction:column;gap:8px}
.pf-tile{display:flex;align-items:center;gap:12px;width:100%;padding:12px;border-radius:14px;border:1px solid var(--pf-line);background:#fff;font:inherit;color:var(--pf-ink);text-align:left;cursor:pointer;transition:background .15s}
.pf-tile:hover{background:#f6faf8}
.pf-tile-icon{flex:none;width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:var(--pf-emerald-bg);color:var(--pf-emerald)}
.pf-tile-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}
.pf-tile-text b{font-size:13.5px;font-weight:700}
.pf-tile-text small{font-size:12px;color:var(--pf-muted)}
.pf-tile.danger .pf-tile-icon{background:var(--pf-red-bg);color:var(--pf-red)}
.pf-tile.danger b{color:var(--pf-red)}
.pf-tile.danger:hover{background:#fdf5f3}
.pf button:focus-visible{outline:2px solid var(--pf-green);outline-offset:2px}
@media (max-width:960px){
.pf-grid{grid-template-columns:1fr}
}
@media (max-width:640px){
.pf-hero{padding:18px;border-radius:18px}
.pf-stats{grid-template-columns:1fr 1fr}
.pf-hero-actions{width:100%}
.pf-hero-actions .pf-btn{flex:1}
.pf-card{padding:16px;border-radius:16px}
.pf-progress{flex-direction:column;align-items:flex-start}
.pf-cat-row{grid-template-columns:90px 1fr auto}
}
@media (prefers-reduced-motion:reduce){.pf-ring .fg,.pf-btn{transition:none}}
`;

function ProfileView({
  user, progressPct, playable, completedVideos, passedQuizzes, history,
  allPassed, onViewHistory, onViewCertificate, onOpenModule, onHelp, onLogout,
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("pf-styles")) return;
    const el = document.createElement("style");
    el.id = "pf-styles";
    el.textContent = PF_STYLES;
    document.head.appendChild(el);
  }, []);

  const stats = useMemo(() => {
    const passedIds  = new Set(passedQuizzes.map((q) => q.id));
    const watchedIds = new Set(completedVideos);
    const passed  = playable.filter((m) => passedIds.has(m.id));
    const pending = playable.filter((m) => watchedIds.has(m.id) && !passedIds.has(m.id));
    const total   = playable.length;

    const scores = passedQuizzes
      .filter((q) => playable.some((m) => m.id === q.id))
      .map((q) => Number(q.score) || 0);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    // Rincian per kategori (otomatis mengikuti data)
    const byCat = {};
    playable.forEach((m) => {
      const key = m.category || "Lainnya";
      byCat[key] = byCat[key] || { name: key, total: 0, done: 0 };
      byCat[key].total += 1;
      if (passedIds.has(m.id)) byCat[key].done += 1;
    });

    return {
      total,
      passedCount: passed.length,
      pendingCount: pending.length,
      restCount: Math.max(total - passed.length - pending.length, 0),
      avg,
      categories: Object.values(byCat),
      nextModule: pending[0] || playable.find((m) => !passedIds.has(m.id)) || null,
      nextIsPending: pending.length > 0,
    };
  }, [playable, passedQuizzes, completedVideos]);

  const recent = useMemo(
    () => [...history].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, PF_RECENT_LIMIT),
    [history]
  );

  const code = user?.kode || user?.id || "-";
  const initials = (user?.nama || "IK").trim().slice(0, 2).toUpperCase();
  const pct = (n) => (stats.total ? (n / stats.total) * 100 : 0);
  const RING = 2 * Math.PI * 42;

  const handleCopy = async () => {
    if (!user?.kode && !user?.id) return;
    try {
      await navigator.clipboard.writeText(String(code));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard tidak tersedia */ }
  };

  return (
    <div className="pf">
      {/* ── Hero: identitas + aksi utama + statistik ── */}
      <header className="pf-hero">
        <div className="pf-hero-top">
          <div className="pf-avatar" aria-hidden="true">{initials}<i title="Akun aktif" /></div>
          <div className="pf-id">
            <span className={`pf-status ${allPassed ? "done" : ""}`}>
              {allPassed ? "Lulus training" : "Training aktif"}
            </span>
            <h2 className="pf-name">{user?.nama || "Karyawan IKIGAI"}</h2>
            <p className="pf-sub"><b>{user?.role || "Karyawan"}</b> · {user?.divisi || "Corporate Outlet"}</p>
          </div>
          <div className="pf-hero-actions">
            {allPassed ? (
              <button type="button" className="pf-btn light" onClick={onViewCertificate}>
                <CertIcon /> Lihat sertifikat
              </button>
            ) : stats.nextModule ? (
              <button type="button" className="pf-btn light" onClick={() => onOpenModule(stats.nextModule)}>
                <PfPlayIcon /> Lanjutkan belajar
              </button>
            ) : null}
          </div>
        </div>

        <div className="pf-stats">
          <div className="pf-stat mint"><b>{progressPct}%</b><span>Total progres</span></div>
          <div className="pf-stat"><b>{stats.passedCount}/{stats.total}</b><span>Modul selesai</span></div>
          <div className="pf-stat gold"><b>{stats.passedCount}</b><span>Kuis lulus</span></div>
          <div className="pf-stat mint"><b>{stats.avg}</b><span>Rata-rata skor</span></div>
        </div>
      </header>

      <div className="pf-grid">
        {/* ── Kolom utama ── */}
        <div className="pf-col">
          <section className="pf-card" aria-label="Progres training">
            <div className="pf-card-head">
              <span className="pf-card-icon"><CheckIcon /></span>
              <h3>Progres training</h3>
            </div>

            <div className="pf-progress">
              <div className="pf-ring" role="img" aria-label={`Progres ${progressPct} persen`}>
                <svg viewBox="0 0 100 100">
                  <circle className="bg" cx="50" cy="50" r="42" />
                  <circle className="fg" cx="50" cy="50" r="42"
                    strokeDasharray={`${(progressPct / 100) * RING} ${RING}`} />
                </svg>
                <strong>{progressPct}%</strong>
              </div>

              <div className="pf-progress-info">
                <p>
                  {allPassed
                    ? "Selamat! Seluruh modul dan kuis sudah selesai. Sertifikat Anda siap dilihat."
                    : `${stats.total - stats.passedCount} modul lagi sampai status Lulus Training.`}
                </p>
                <div className="pf-seg" aria-hidden="true">
                  <span className="s-done" style={{ width: `${pct(stats.passedCount)}%` }} />
                  <span className="s-wait" style={{ width: `${pct(stats.pendingCount)}%` }} />
                </div>
                <div className="pf-legend">
                  <span><i style={{ background: "#16a37f" }} />Tuntas {stats.passedCount}</span>
                  <span><i style={{ background: "#f2b53d" }} />Kuis menunggu {stats.pendingCount}</span>
                  <span><i style={{ background: "#d5dfdb" }} />Belum dimulai {stats.restCount}</span>
                </div>
              </div>
            </div>

            {stats.categories.length > 0 && (
              <div className="pf-cats">
                {stats.categories.map((c) => (
                  <div key={c.name} className="pf-cat-row">
                    <b title={c.name}>{c.name}</b>
                    <span className="pf-cat-track" aria-hidden="true">
                      <span style={{ width: `${c.total ? (c.done / c.total) * 100 : 0}%` }} />
                    </span>
                    <small>{c.done}/{c.total}</small>
                  </div>
                ))}
              </div>
            )}

            {allPassed ? (
              <div className="pf-next done">
                <div className="pf-next-text">
                  <small>Status</small>
                  <b>Semua modul tuntas</b>
                </div>
                <button type="button" className="pf-btn primary" onClick={onViewCertificate}>
                  <CertIcon /> Sertifikat
                </button>
              </div>
            ) : stats.nextModule && (
              <div className="pf-next">
                <div className="pf-next-text">
                  <small>{stats.nextIsPending ? "Kuis menunggu Anda" : "Langkah berikutnya"}</small>
                  <b title={stats.nextModule.title}>{stats.nextModule.title}</b>
                </div>
                <button type="button" className="pf-btn primary" onClick={() => onOpenModule(stats.nextModule)}>
                  {stats.nextIsPending ? "Kerjakan kuis" : "Mulai"} <ChevronRight />
                </button>
              </div>
            )}
          </section>

          <section className="pf-card" aria-label="Riwayat kuis">
            <div className="pf-card-head">
              <span className="pf-card-icon"><DocumentIcon /></span>
              <h3>Riwayat kuis terbaru</h3>
              {history.length > 0 && (
                <button type="button" className="pf-link" onClick={onViewHistory}>
                  Lihat semua ({history.length}) <HistoryIcon />
                </button>
              )}
            </div>

            {recent.length === 0 ? (
              <p className="pf-empty">
                Belum ada kuis yang diselesaikan. Buka "Daftar Modul", selesaikan materi, lalu kerjakan kuisnya.
              </p>
            ) : (
              <ul className="pf-list">
                {recent.map((q, i) => (
                  <li key={q.id || i} className="pf-item">
                    <div className="pf-item-text">
                      <b>{q.title}</b>
                      <small>{[q.category, pfFormatDate(q.date)].filter(Boolean).join(" · ")}</small>
                    </div>
                    <span className={`pf-score ${pfScoreTier(q.score)}`}>{q.score}/100</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* ── Kolom samping ── */}
        <aside className="pf-col">
          <section className="pf-card" aria-label="Identitas dan akses">
            <div className="pf-card-head">
              <span className="pf-card-icon"><LockIcon /></span>
              <h3>Identitas &amp; akses</h3>
            </div>
            <dl className="pf-dl">
              <div className="pf-row">
                <dt>Kode akses</dt>
                <dd>
                  <button type="button" className={`pf-copy ${copied ? "ok" : ""}`} onClick={handleCopy}
                    title="Salin kode akses" aria-live="polite">
                    {copied ? "Tersalin" : code}
                    {copied ? <CheckIcon /> : <PfCopyIcon />}
                  </button>
                </dd>
              </div>
              <div className="pf-row"><dt>Outlet / divisi</dt><dd>{user?.divisi || "Semua outlet"}</dd></div>
              <div className="pf-row"><dt>Jabatan</dt><dd className="accent">{user?.role || "Karyawan"}</dd></div>
              <div className="pf-row"><dt>Terdaftar</dt><dd>{user?.createdAt || "-"}</dd></div>
            </dl>
            <p className="pf-copy-hint" style={{ margin: 0, textAlign: "left" }}>
              Gunakan kode akses untuk masuk kembali ke portal.
            </p>
          </section>

          <section className="pf-card" aria-label="Bantuan dan akun">
            <div className="pf-card-head">
              <span className="pf-card-icon"><HelpIcon /></span>
              <h3>Bantuan &amp; akun</h3>
            </div>
            <div className="pf-actions">
              <button type="button" className="pf-tile" onClick={onHelp}>
                <span className="pf-tile-icon"><HelpIcon /></span>
                <span className="pf-tile-text">
                  <b>Butuh bantuan</b>
                  <small>Hubungi Tim HRD &amp; Support IKIGAI</small>
                </span>
                <ChevronRight />
              </button>
              <button type="button" className="pf-tile danger" onClick={onLogout}>
                <span className="pf-tile-icon"><LogoutIcon /></span>
                <span className="pf-tile-text">
                  <b>Keluar dari akun</b>
                  <small>Akhiri sesi di perangkat ini</small>
                </span>
                <ChevronRight />
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   KARTU DETAIL MODUL (ModuleDetailCard)
   ──────────────────────────────────────────────────────────
   Menggantikan blok "emerald-module-details" lama. Semua data masuk
   lewat props, jadi tidak tahu apa-apa soal Firebase / state induk.
   Struktur:  header (kategori · status · simpan)
              → judul + deskripsi (bisa diringkas) + tujuan belajar
              → langkah belajar (Materi → Kuis → Tuntas)
              → aksi utama (kuis) + navigasi modul sebelumnya/berikutnya
   Menambah info baru (durasi, trainer, dll) cukup lewat array `facts`.
   ══════════════════════════════════════════════════════════ */

const MD_SUMMARY_LIMIT = 220;   // karakter; lebih panjang dari ini -> ada "Baca selengkapnya"

// Pisahkan "Tujuan pembelajaran: ..." dari ringkasan materi (bila ada)
function splitModuleDescription(desc) {
  const text = String(desc || "").trim();
  if (!text) return { summary: "", goal: "" };
  const [summary, ...rest] = text.split(/\s*Tujuan\s+pembelajaran\s*:\s*/i);
  return { summary: summary.trim(), goal: rest.join(" ").trim() };
}

const MD_STYLES = `
.md-card{--md-ink:#12332a;--md-muted:#5f746c;--md-line:#e4ece8;--md-emerald:#0f6b4f;--md-green:#16a37f;--md-emerald-bg:#e3f4ee;--md-gold:#a97416;--md-gold-bg:#fbf1de;--md-red:#c4433a;--md-red-bg:#fbebe8;background:#fff;color:var(--md-ink);border:1px solid var(--md-line);border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:18px;box-shadow:0 1px 2px rgba(6,40,30,.04)}
.md-top{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.md-badges{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.md-chip{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:4px 10px;border-radius:999px;background:#eef1f0;color:#3d4f48;line-height:1.2}
.md-chip.category{background:var(--md-emerald-bg);color:var(--md-emerald)}
.md-chip.done{background:var(--md-emerald-bg);color:var(--md-emerald)}
.md-chip.progress{background:var(--md-gold-bg);color:var(--md-gold)}
.md-chip.danger{background:var(--md-red-bg);color:var(--md-red)}
.md-chip i{width:6px;height:6px;border-radius:50%;background:currentColor}
.md-save{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:12.5px;font-weight:600;color:var(--md-muted);background:#fff;border:1px solid var(--md-line);border-radius:999px;padding:6px 12px;cursor:pointer;transition:background .15s,color .15s,border-color .15s}
.md-save:hover{background:#f6faf8;color:var(--md-emerald)}
.md-save.active{color:var(--md-emerald);background:var(--md-emerald-bg);border-color:transparent}
.md-head{display:flex;flex-direction:column;gap:8px}
.md-eyebrow{font-size:12.5px;color:var(--md-muted);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.md-eyebrow b{color:var(--md-ink);font-weight:700}
.md-track{flex:none;width:72px;height:4px;border-radius:4px;background:var(--md-line);overflow:hidden}
.md-track span{display:block;height:100%;background:var(--md-green);border-radius:4px}
.md-title{margin:0;font-size:clamp(20px,2.4vw,26px);line-height:1.25;font-weight:800;letter-spacing:-.01em}
.md-desc{margin:0;font-size:14px;line-height:1.7;color:var(--md-muted);max-width:75ch}
.md-desc.clamped{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.md-more{align-self:flex-start;background:none;border:0;padding:2px 0;font:inherit;font-size:13px;font-weight:700;color:var(--md-emerald);cursor:pointer}
.md-more:hover{text-decoration:underline}
.md-goal{display:flex;gap:12px;padding:14px 16px;border-radius:14px;background:#f3faf7;border:1px solid #d6ebe2}
.md-goal-icon{flex:none;width:32px;height:32px;border-radius:10px;background:var(--md-emerald-bg);color:var(--md-emerald);display:grid;place-items:center}
.md-goal h4{margin:0 0 2px;font-size:13px;font-weight:700;color:var(--md-emerald)}
.md-goal p{margin:0;font-size:13.5px;line-height:1.6;color:#33473f}
.md-steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.md-step{position:relative;display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--md-line);border-radius:14px;background:#fff;min-width:0}
.md-step-dot{flex:none;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:700;background:#eef1f0;color:#8fa39a}
.md-step-text{display:flex;flex-direction:column;min-width:0}
.md-step-text b{font-size:13px;font-weight:700;line-height:1.25}
.md-step-text small{font-size:11.5px;color:var(--md-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.md-step.done{border-color:#cfe7dd;background:#f6fbf9}
.md-step.done .md-step-dot{background:var(--md-green);color:#fff}
.md-step.current{border-color:var(--md-green);box-shadow:0 0 0 3px rgba(22,163,127,.12)}
.md-step.current .md-step-dot{background:var(--md-emerald-bg);color:var(--md-emerald)}
.md-step.locked b{color:#8fa39a}
.md-score.high{color:var(--md-emerald)}
.md-score.mid{color:var(--md-gold)}
.md-score.low{color:var(--md-red)}
.md-actions{display:flex;flex-direction:column;gap:10px}
.md-cta{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:14px 18px;border-radius:14px;border:1px solid transparent;font:inherit;font-size:15px;font-weight:700;cursor:pointer;transition:transform .12s,box-shadow .15s,background .15s}
.md-cta.primary{background:linear-gradient(135deg,#0f6b4f,#16a37f);color:#fff;box-shadow:0 6px 16px rgba(15,107,79,.22)}
.md-cta.primary:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(15,107,79,.28)}
.md-cta.outline{background:#fff;color:var(--md-emerald);border-color:#b9dccf}
.md-cta.outline:hover{background:var(--md-emerald-bg)}
.md-cta.locked{background:#f2f5f4;color:#7d918a;border-color:var(--md-line);cursor:not-allowed}
.md-cta-hint{margin:0;font-size:12.5px;color:var(--md-muted);text-align:center}
.md-nav{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.md-nav-btn{display:flex;align-items:center;gap:10px;min-width:0;padding:10px 12px;background:#fff;border:1px solid var(--md-line);border-radius:14px;font:inherit;color:var(--md-ink);text-align:left;cursor:pointer;transition:background .15s,border-color .15s}
.md-nav-btn.next{flex-direction:row-reverse;text-align:right}
.md-nav-btn:hover:not(:disabled){background:#f6faf8;border-color:#cfe7dd}
.md-nav-btn:disabled{opacity:.5;cursor:not-allowed}
.md-nav-icon{flex:none;display:grid;place-items:center;color:var(--md-emerald)}
.md-nav-text{display:flex;flex-direction:column;min-width:0;flex:1}
.md-nav-text small{font-size:11px;color:var(--md-muted)}
.md-nav-text b{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.md-card button:focus-visible{outline:2px solid var(--md-green);outline-offset:2px}
@media (max-width:640px){
.md-card{padding:18px;border-radius:16px}
.md-steps{grid-template-columns:1fr}
.md-nav-text b{display:none}
.md-nav-text small{font-size:13px;color:var(--md-ink);font-weight:600}
}
@media (prefers-reduced-motion:reduce){.md-cta{transition:none}.md-cta.primary:hover{transform:none}}
`;

function ModuleDetailCard({
  module: mod, index, total, isDocument,
  isWatched, isPassed, score, isDisabled, isSoon,
  bookmarked, onToggleBookmark,
  prevTitle, nextTitle, hasPrev, hasNext, onPrev, onNext,
  onStartQuiz,
}) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("md-styles")) return;
    const el = document.createElement("style");
    el.id = "md-styles";
    el.textContent = MD_STYLES;
    document.head.appendChild(el);
  }, []);

  // Modul baru dipilih -> ringkasan kembali ke mode singkat
  useEffect(() => { setExpanded(false); }, [mod?.id]);

  const { summary, goal } = useMemo(
    () => splitModuleDescription(mod?.desc || ""),
    [mod?.desc]
  );
  const summaryText = summary || (goal ? "" : "Penjelasan lengkap mengenai materi modul training ini.");
  const isLong = summaryText.length > MD_SUMMARY_LIMIT;

  const unavailable = isDisabled || isSoon;
  const scoreTier = score >= 80 ? "high" : score >= 70 ? "mid" : "low";
  const materiLabel = isDocument ? "Baca dokumen" : "Tonton video";
  const position = index >= 0 ? index + 1 : null;

  // Status tunggal yang mudah dipahami (menggantikan banyak pill sekaligus)
  const status = isDisabled ? { cls: "danger", text: "Dinonaktifkan" }
    : isSoon      ? { cls: "progress", text: "Segera hadir" }
    : isPassed    ? { cls: "done", text: "Modul tuntas" }
    : isWatched   ? { cls: "progress", text: "Kuis menunggu" }
    :               { cls: "", text: "Belum dimulai" };

  const steps = [
    {
      key: "materi", label: materiLabel,
      state: isWatched ? "done" : "current",
      sub: isWatched ? (isDocument ? "Sudah dikonfirmasi" : "Sudah selesai") : "Langkah 1",
    },
    {
      key: "kuis", label: "Kerjakan kuis",
      state: isPassed ? "done" : isWatched ? "current" : "locked",
      sub: isPassed ? `Nilai ${score}%` : isWatched ? "Siap dikerjakan" : "Terkunci",
      scoreTier: isPassed ? scoreTier : null,
    },
    {
      key: "tuntas", label: "Modul tuntas",
      state: isPassed ? "done" : "locked",
      sub: isPassed ? "Selesai" : "Terkunci",
    },
  ];

  return (
    <article className="md-card" aria-label="Detail modul">
      {/* ── Header: kategori · status · simpan ── */}
      <div className="md-top">
        <div className="md-badges">
          {mod?.category && <span className="md-chip category">{mod.category}</span>}
          <span className={`md-chip ${status.cls}`}><i />{status.text}</span>
        </div>
        <button
          type="button"
          className={`md-save ${bookmarked ? "active" : ""}`}
          onClick={onToggleBookmark}
          aria-pressed={bookmarked}
          title={bookmarked ? "Hapus dari tersimpan" : "Simpan modul ini"}
        >
          <BookmarkIcon filled={bookmarked} />
          {bookmarked ? "Tersimpan" : "Simpan"}
        </button>
      </div>

      {/* ── Judul & deskripsi ── */}
      <div className="md-head">
        <div className="md-eyebrow">
          {position && (
            <>
              <span>Modul <b>{position}</b> dari {total}</span>
              <span className="md-track" aria-hidden="true">
                <span style={{ width: `${total ? (position / total) * 100 : 0}%` }} />
              </span>
            </>
          )}
          <span>{isDocument ? "Dokumen" : "Video"}</span>
        </div>
        <h1 className="md-title">{mod?.title}</h1>

        {summaryText && (
          <>
            <p className={`md-desc ${isLong && !expanded ? "clamped" : ""}`}>{summaryText}</p>
            {isLong && (
              <button
                type="button"
                className="md-more"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
              >
                {expanded ? "Tampilkan lebih sedikit" : "Baca selengkapnya"}
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Tujuan pembelajaran (dipisah dari ringkasan) ── */}
      {goal && (
        <div className="md-goal">
          <span className="md-goal-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
            </svg>
          </span>
          <div>
            <h4>Tujuan pembelajaran</h4>
            <p>{goal}</p>
          </div>
        </div>
      )}

      {/* ── Langkah belajar ── */}
      {!unavailable && (
        <ol className="md-steps" aria-label="Langkah belajar">
          {steps.map((s, i) => (
            <li
              key={s.key}
              className={`md-step ${s.state}`}
              aria-current={s.state === "current" ? "step" : undefined}
            >
              <span className="md-step-dot">
                {s.state === "done" ? <CheckIcon /> : s.state === "locked" ? <LockIcon /> : i + 1}
              </span>
              <span className="md-step-text">
                <b>{s.label}</b>
                <small className={s.scoreTier ? `md-score ${s.scoreTier}` : ""}>{s.sub}</small>
              </span>
            </li>
          ))}
        </ol>
      )}

      {/* ── Aksi utama + navigasi ── */}
      <div className="md-actions">
        {unavailable ? (
          <div className="md-cta locked" role="status">
            <LockIcon /> Modul tidak tersedia
          </div>
        ) : isWatched ? (
          <button
            type="button"
            className={`md-cta ${isPassed ? "outline" : "primary"}`}
            onClick={onStartQuiz}
          >
            {isPassed ? "Ulangi Kuis" : "Kerjakan Kuis Sekarang"}
            <ChevronRight />
          </button>
        ) : (
          <>
            <div className="md-cta locked" aria-disabled="true">
              <LockIcon /> Kuis terkunci
            </div>
            <p className="md-cta-hint">
              {isDocument
                ? "Selesaikan membaca dokumen di atas lalu konfirmasi untuk membuka kuis."
                : "Tonton video sampai selesai untuk membuka kuis."}
            </p>
          </>
        )}

        <div className="md-nav">
          <button type="button" className="md-nav-btn prev" onClick={onPrev} disabled={!hasPrev}>
            <span className="md-nav-icon"><ChevronLeft /></span>
            <span className="md-nav-text">
              <small>Sebelumnya</small>
              <b>{hasPrev ? prevTitle : "Modul pertama"}</b>
            </span>
          </button>
          <button type="button" className="md-nav-btn next" onClick={onNext} disabled={!hasNext}>
            <span className="md-nav-icon"><ChevronRight /></span>
            <span className="md-nav-text">
              <small>Berikutnya</small>
              <b>{hasNext ? nextTitle : "Modul terakhir"}</b>
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}


/* ══════════════════════════════════════════════════════════
   ADAPTER: passedQuizzes (Firebase) → history (QuizHistoryPage)
   ──────────────────────────────────────────────────────────
   QuizHistoryPage sengaja dibuat generik (lihat komentar di file
   itu) sehingga tidak tahu apa-apa soal bentuk data Firebase kita.
   Semua konversi format terjadi di sini, satu tempat, supaya kalau
   struktur passedQuizzes berubah di kemudian hari, cukup ubah
   fungsi ini saja.

   Bentuk data mentah per-entry `passedQuizzes` (dari handleQuizPass
   di bawah):
     {
       id:            "K-02-A",
       title:         "IKIGAI HRIS Kasir: Login & Dashboard",
       score:         90,
       date:          "5/8/2026",              // toLocaleDateString("id-ID") -> D/M/YYYY
       userAnswers:   [...],                   // hasil normalizeQuizAnswers()
       quizQuestions: [...],                   // snapshot currentVideo.quiz saat kuis dikerjakan,
                                               // field bahasa Indonesia: pertanyaan / pilihan / jawabanBenar
     }
   ══════════════════════════════════════════════════════════ */

// toLocaleDateString("id-ID") menghasilkan format "D/M/YYYY" (tanpa leading zero),
// yang TIDAK bisa diparse langsung oleh `new Date(...)` secara konsisten di semua
// browser. Fungsi ini mengonversinya ke ISO string supaya QuizHistoryPage
// (sort tanggal, grouping per-bulan) berjalan benar.
function parseIndoDateToISO(dateStr) {
  if (!dateStr) return new Date().toISOString();
  if (typeof dateStr !== "string") return new Date(dateStr).toISOString();

  const parts = dateStr.split("/");
  if (parts.length !== 3) {
    // Mungkin sudah ISO atau format lain — biarkan Date yang coba parse.
    const fallback = new Date(dateStr);
    return Number.isNaN(fallback.getTime()) ? new Date().toISOString() : fallback.toISOString();
  }

  const [day, month, year] = parts.map((p) => parseInt(p, 10));
  if (!day || !month || !year) return new Date().toISOString();

  const d = new Date(year, month - 1, day, 9, 0, 0);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

// Ambil teks jawaban user dari satu entri normalizeQuizAnswers(); toleran
// terhadap beberapa kemungkinan bentuk (string langsung, atau object
// { answer } / { userAnswer } / { pilihan }).
function extractUserAnswerText(ua) {
  if (ua == null) return undefined;
  if (typeof ua === "string") return ua;
  return ua.answer ?? ua.userAnswer ?? ua.pilihan ?? ua.jawaban ?? undefined;
}

function buildQuizHistory(passedQuizzes, filteredPlaylist) {
  if (!Array.isArray(passedQuizzes)) return [];

  return passedQuizzes.map((quiz) => {
    const moduleInfo = filteredPlaylist?.find((v) => v.id === quiz.id);
    const rawQuestions = Array.isArray(quiz.quizQuestions) ? quiz.quizQuestions : [];
    const rawAnswers   = Array.isArray(quiz.userAnswers) ? quiz.userAnswers : [];

    const questions = rawQuestions.map((q, i) => ({
      question:      q.pertanyaan ?? q.question ?? `Soal ${i + 1}`,
      options:       q.pilihan ?? q.options ?? [],
      correctAnswer: q.jawabanBenar ?? q.correctAnswer ?? q.answer,
      userAnswer:    extractUserAnswerText(rawAnswers[i]),
    }));

    const hasDetailedQuestions = questions.length > 0;
    const correctCount = hasDetailedQuestions
      ? questions.filter((q) => q.userAnswer === q.correctAnswer).length
      : Math.round(((quiz.score || 0) / 100) * (rawQuestions.length || 0));

    return {
      id:             quiz.id,
      moduleId:       quiz.id,
      title:          quiz.title || "Modul Kuis",
      category:       moduleInfo?.category || "User Guide",
      date:           parseIndoDateToISO(quiz.date),
      score:          quiz.score || 0,
      correctCount,
      totalQuestions: rawQuestions.length,
      questions:      hasDetailedQuestions ? questions : undefined,
    };
  });
}

function normalizeDynamicModule(mod) {
  if (!mod) return mod;
  const rawCategory = String(mod.category || "").trim();
  const category = rawCategory.toUpperCase() === "MODUL" ? "User Guide" : rawCategory;
  const isDocument = mod.type === "document" || !!mod.documentUrl;
  const rawMediaUrl = isDocument ? mod.documentUrl : (mod.url || mod.videoUrl);
  const mediaUrl = !isDocument && isGoogleDriveUrl(rawMediaUrl)
    ? toGoogleDrivePreviewUrl(rawMediaUrl)
    : rawMediaUrl;

  return {
    ...mod,
    category,
    desc: mod.desc || mod.description,
    type: isDocument ? "document" : "video",
    documentUrl: isDocument ? mediaUrl : mod.documentUrl,
    url: mediaUrl,
  };
}

function getDocumentType(item) {
  const explicit = String(item?.documentType || "").toLowerCase();
  if (explicit) return explicit;
  const url = String(item?.documentUrl || item?.url || "");
  const clean = url.split("?")[0].split("#")[0];
  return clean.includes(".") ? clean.split(".").pop().toLowerCase() : "pdf";
}

function getOfficePreviewUrl(url) {
  return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;
}

function isGoogleDriveUrl(url) {
  return /drive\.google\.com/i.test(String(url || ""));
}

function isOneDriveUrl(url) {
  try {
    const host = new URL(String(url || "")).hostname.toLowerCase();
    return host === "1drv.ms" || host.endsWith(".1drv.ms") ||
      host === "onedrive.live.com" || host.endsWith(".onedrive.live.com") ||
      host === "sharepoint.com" || host.endsWith(".sharepoint.com");
  } catch {
    return false;
  }
}

function toGoogleDrivePreviewUrl(url) {
  const raw = String(url || "").trim();
  if (!raw || !isGoogleDriveUrl(raw)) return raw;
  const fileIdMatch = raw.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || raw.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return fileIdMatch?.[1]
    ? `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`
    : raw;
}


const TrainingModule = () => {
  const { user, logout } = useAuth();
  const videoRef  = useRef(null);
  const mainRef   = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizKey,     setQuizKey]     = useState(0);

  // ── Views ──
  const [view, setView] = useState("dashboard");

  // ── Dialogs / overlays ──
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [achievement,       setAchievement]       = useState(null);   // { score, title }
  const [reviewRecord,      setReviewRecord]      = useState(null);   // quizRecord for QuizReviewModal
  const [showHelp,          setShowHelp]          = useState(false);

  // ── FAQ / Tanya Trainer per modul ──
  const [trainerQuestion, setTrainerQuestion] = useState("");

  // ── SOP Reader (dokumen non-video) ──
  const [docReadUnlocked, setDocReadUnlocked] = useState(false);

  /* ─── USER IDENTITY ─── */
  const targetUserKode = useMemo(() => {
    const saved  = localStorage.getItem("ikigai_user");
    let parsed = null;
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch {
        parsed = saved;
      }
    }
    return user?.kode || user?.id || parsed?.kode || parsed?.id || parsed || null;
  }, [user]);

  /* ─── HOOKS ─── */
  const { isOnline, isFirebaseConnected } = useOfflineStatus();
  const { saveResume, loadResume }        = useResumeProgress(targetUserKode);

  /* ─── MODUL DINAMIS DARI FIREBASE (termasuk PDF/video yang diupload Admin) ───
     AdminPanel.jsx menyimpan modul baru ke node "trainingModules" di Realtime
     Database. Supaya modul itu langsung muncul ke karyawan tanpa perlu deploy
     ulang, sisi karyawan juga harus mendengarkan node yang sama — persis
     seperti yang sudah dilakukan AdminPanel.jsx untuk dirinya sendiri. */
  const [dbModules, setDbModules] = useState([]);

  useEffect(() => {
    const modulesRef = ref(db, "trainingModules");
    return onValue(modulesRef, (snapshot) => {
      const data = snapshot.val();
      const modules = data
        ? Object.entries(data).map(([id, value]) => normalizeDynamicModule({ id, ...value }))
        : [];
      setDbModules(modules.reverse());
    }, (error) => {
      console.error("Gagal membaca materi:", error);
    });
  }, [user?.kode]);

  const combinedPlaylist = dbModules;

  /* ─── PLAYLIST FILTER ───
     Diurutkan berdasarkan field `order` yang diisi Admin di tab "Upload
     Konten"/"Kelola Modul" (Urutan Modul). Tanpa sort ini, urutan yang
     tampil ke karyawan mengikuti urutan key Firebase (dbModules.reverse()
     di atas, yaitu "terbaru diupload dulu"), sehingga modul dengan
     order=1 bisa muncul paling akhir kalau dia diupload paling awal. */
  const filteredPlaylist = useMemo(() => {
    if (!user || !combinedPlaylist?.length) return [];
    const userRole = user.role?.toUpperCase();
    return combinedPlaylist
      .filter(item => {
        if (userRole === "ADMIN") return true;
        return matchesModuleAudience(user, item);
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [user, combinedPlaylist]);

  // Status modul: field "status" (dipakai modul dinamis dari Firebase) diprioritaskan,
  // fallback ke isSoon/disabled untuk kompatibilitas modul statis lama di data.js.
  const isModulePlayable = (item) => {
    if (item.status) return item.status === "active";
    return !item.isSoon && !item.disabled;
  };

  const playablePlaylist = useMemo(
    () => filteredPlaylist.filter(isModulePlayable),
    [filteredPlaylist]
  );

  const modulList = useMemo(
    () => filteredPlaylist.filter(i => i.category === "User Guide" || String(i.category || "").toUpperCase() === "MODUL"),
    [filteredPlaylist]
  );
  const sopList = useMemo(
    () => filteredPlaylist.filter(i => i.category === "SOP"),
    [filteredPlaylist]
  );

  /* ─── CORE STATE ─── */
  const [activeTab,       setActiveTab]       = useState("SOP");
  const [currentVideo,    setCurrentVideo]    = useState(null);
  const [showQuiz,        setShowQuiz]        = useState(false);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [passedQuizzes,   setPassedQuizzes]   = useState([]);
  const [bookmarks,       setBookmarks]       = useState([]);
  const [moduleFilter,    setModuleFilter]    = useState("all");
  const [bookmarkSearch,         setBookmarkSearch]         = useState("");
  const [bookmarkCategoryFilter, setBookmarkCategoryFilter] = useState("Semua");

  useEffect(() => {
    if (user) {
      setCompletedVideos(user.completedVideos || []);
      setPassedQuizzes(user.passedQuizzes    || []);
      setBookmarks(user.bookmarks           || []);
    }
  }, [user]);

  /* ─── NOTIFIKASI (Pusat Notifikasi) ───
     Logika lengkap ada di useNotifications (atas file). Modul lama otomatis
     dianggap sudah dibaca saat pertama kali, jadi badge tidak menampilkan
     seluruh modul sebagai "baru". */
  const { notifications, markRead, markAllRead } = useNotifications({
    userKey: targetUserKode,
    modules: playablePlaylist,
    completedVideos,
    passedQuizzes,
  });

  /* ─── BOOKMARK / SIMPAN MODUL ─── */
  const bookmarkedModules = useMemo(
    () => filteredPlaylist.filter(v => bookmarks.includes(v.id)),
    [filteredPlaylist, bookmarks]
  );

  const toggleBookmark = useCallback(async (id) => {
    setBookmarks(prev => {
      const updated = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      if (targetUserKode) {
        update(ref(db, `users/${targetUserKode}`), { bookmarks: updated }).catch(e => {
          console.error("Sync Bookmark:", e);
        });
      }
      return updated;
    });
  }, [targetUserKode]);

  /* ─── TRANSKRIP EVALUASI (untuk QuizHistoryPage) ─── */
  const quizHistoryData = useMemo(
    () => buildQuizHistory(passedQuizzes, filteredPlaylist),
    [passedQuizzes, filteredPlaylist]
  );

  /* ─── GLOBAL PROGRESS ───
     Satu-satunya sumber kebenaran persentase progres training.
     Dipakai di SEMUA tempat (sidebar, Beranda, Sertifikat, Profil)
     supaya angkanya selalu konsisten — sebelumnya Sertifikat & Profil
     punya rumus sendiri (hanya berbasis kuis lulus) yang bisa beda
     dengan angka di sidebar (video + kuis). */
  const globalProgress = useMemo(() => {
    const total = playablePlaylist.length * 2;
    const vDone = completedVideos.filter(id =>
      playablePlaylist.some(v => v.id === id)
    ).length;
    const qDone = passedQuizzes.filter(q =>
      playablePlaylist.some(v => v.id === q.id)
    ).length;
    return total > 0
      ? Math.min(Math.round(((vDone + qDone) / total) * 100), 100)
      : 0;
  }, [completedVideos, passedQuizzes, playablePlaylist]);

  /* ─── REALTIME STATUS WATCHER ─── */
  useEffect(() => {
    if (!targetUserKode) return;
    const statusRef   = ref(db, `users/${targetUserKode}/status`);
    const unsubscribe = onValue(statusRef, snapshot => {
      if (snapshot.val() === "Inactive") logout();
    });
    return () => unsubscribe();
  }, [targetUserKode, logout]);

  /* ─── COMPLETED COUNT ─── */
  const completedCount = useMemo(
    () => passedQuizzes.filter(q =>
      filteredPlaylist.some(v => v.id === q.id)
    ).length,
    [passedQuizzes, filteredPlaylist]
  );

  /* ─── INIT: set video — prefer resume, fallback to first ─── */
  useEffect(() => {
    if (filteredPlaylist.length === 0) return;
    if (currentVideo) return; // already set

    (async () => {
      const lastId = await loadResume();
      const found  = lastId
        ? filteredPlaylist.find(v => v.id === lastId)
        : null;
      setCurrentVideo(found || filteredPlaylist[0]);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredPlaylist]);

  /* ─── VIDEO TIMESTAMP ─── */
  const { clearTimestamp } = useVideoTimestamp(videoRef, currentVideo?.id);

  const isDocumentModule = currentVideo?.type === "document" || !!currentVideo?.documentUrl;
  const currentMediaUrl = currentVideo?.url || currentVideo?.videoUrl || "";
  const currentDocumentType = getDocumentType(currentVideo);
  const isPdfDocument = isDocumentModule && currentDocumentType === "pdf";

  const isOneDriveVideo = !isDocumentModule && isOneDriveUrl(currentMediaUrl);
  const isOneDriveDocument = isDocumentModule && isOneDriveUrl(currentVideo?.documentUrl);
  // Retain the existing stream proxy for modules already stored in Google Drive.
  const DRIVE_PROXY_BASE = "https://drive-video-proxy.ikigai-training.workers.dev";
  const driveFileId = !isDocumentModule
    ? currentMediaUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1]
    : null;
  const playableVideoUrl = driveFileId
    ? `${DRIVE_PROXY_BASE}?id=${driveFileId}`
    : currentMediaUrl;

  // Dokumen (PDF/PPT/Word) sekarang juga link Google Drive — pakai proxy yang
  // sama supaya file mentah bisa diambil FlipbookDocViewer/Google gview tanpa
  // bergantung cookie/session Google.
  const documentDriveFileId = isDocumentModule
    ? currentVideo?.documentUrl?.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1]
    : null;
  const documentProxyUrl = documentDriveFileId
    ? `${DRIVE_PROXY_BASE}?id=${documentDriveFileId}`
    : currentVideo?.documentUrl || "";
  // Link Drive viewer biasa, dipakai khusus untuk tombol "Buka di Tab Baru"
  const documentOpenInNewTabUrl = documentDriveFileId
    ? `https://drive.google.com/file/d/${documentDriveFileId}/view`
    : currentVideo?.documentUrl || "";

  // Video sekarang pakai event onEnded asli (bukan timer manual 6 detik lagi),
  // jadi hanya dokumen (PDF/PPT/Word) yang masih butuh konfirmasi manual.
  const needsManualConfirm = isDocumentModule || isOneDriveVideo;

  useEffect(() => {
    setDocReadUnlocked(false);
    if (!needsManualConfirm) return;
    const t = setTimeout(() => setDocReadUnlocked(true), 6000);
    return () => clearTimeout(t);
  }, [currentVideo?.id, needsManualConfirm]);

  const handleDocumentConfirm = useCallback(async () => {
    if (!currentVideo || completedVideos.includes(currentVideo.id)) return;
    const updated = [...completedVideos, currentVideo.id];
    setCompletedVideos(updated);
    if (targetUserKode) {
      try {
        await update(ref(db, `users/${targetUserKode}`), {
          completedVideos: updated,
        });
      } catch (e) { console.error("Sync Document Read:", e); }
    }
  }, [currentVideo, completedVideos, targetUserKode]);

  /* ─── HELPERS ─── */
  const scrollTop = useCallback(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ─── VIDEO END ─── */
  const handleVideoEnd = useCallback(async () => {
    if (currentVideo && !completedVideos.includes(currentVideo.id)) {
      const updated = [...completedVideos, currentVideo.id];
      setCompletedVideos(updated);
      if (targetUserKode) {
        try {
          await update(ref(db, `users/${targetUserKode}`), {
            completedVideos: updated,
          });
        } catch (e) { console.error("Sync Video Progress:", e); }
      }
    }
    clearTimestamp(); // remove saved timestamp — video finished
  }, [currentVideo, completedVideos, targetUserKode, clearTimestamp]);

  /* ─── QUIZ PASS ─── */
  const handleQuizPass = useCallback(async (scoreResult, userAnswers = []) => {
    const vid = currentVideo?.id;
    setShowQuiz(false);

    setAchievement({ score: scoreResult || 0, title: currentVideo?.title || "" });

    if (!vid || !targetUserKode) return;

    const normalizedAnswers = normalizeQuizAnswers(userAnswers, currentVideo?.quiz);

    const entry = {
      id:            vid,
      title:         currentVideo?.title || "Untitled",
      score:         scoreResult         || 0,
      date:          new Date().toLocaleDateString("id-ID"),
      userAnswers:   normalizedAnswers,
      quizQuestions: currentVideo?.quiz || [],
    };

    const updated = [...passedQuizzes.filter(q => q.id !== vid), entry];
    setPassedQuizzes(updated);

    try {
      await update(ref(db, `users/${targetUserKode}`), {
        passedQuizzes: updated,
      });
    } catch (e) {
      console.error("Sync Quiz:", e);
    }
  }, [currentVideo, passedQuizzes, targetUserKode]);

  /* ─── SELECT VIDEO ─── */
  const handleSelectVideo = useCallback((item) => {
    setCurrentVideo(item);
    setShowQuiz(false);
    setSidebarOpen(false);
    setQuizKey(k => k + 1);
    scrollTop();
    saveResume(item.id);
  }, [scrollTop, saveResume]);

  /* ─── NOTIFIKASI: buka modul yang dipilih dari lonceng ─── */
  const handleNotificationSelect = useCallback((n) => {
    const target = filteredPlaylist.find(v => v.id === n.moduleId);
    if (!target) return;
    handleSelectVideo(target);
    setView("training");
  }, [filteredPlaylist, handleSelectVideo]);

  /* ─── NAV ─── */
  const handleNext = useCallback(() => {
    const idx = playablePlaylist.findIndex(v => v.id === currentVideo?.id);
    if (idx < playablePlaylist.length - 1) handleSelectVideo(playablePlaylist[idx + 1]);
  }, [currentVideo, playablePlaylist, handleSelectVideo]);

  const handlePrev = useCallback(() => {
    const idx = playablePlaylist.findIndex(v => v.id === currentVideo?.id);
    if (idx > 0) handleSelectVideo(playablePlaylist[idx - 1]);
  }, [currentVideo, playablePlaylist, handleSelectVideo]);

  // ── Search icon (Modul Tersimpan toolbar) ──
  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );

  // ── Layers icon (stat "Kategori Terbanyak") ──
  const LayersIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );

  // ── Clock icon (stat "Sedang Berjalan") ──
  const ClockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  );

  /* ─── RIWAYAT KUIS: buka & ulangi dari QuizHistoryPage ─── */
  // Halaman asal dicatat supaya tombol "Kembali" di Transkrip Evaluasi kembali ke
  // tempat pengguna datang (Beranda / Profil / Sertifikat), bukan selalu ke Profil.
  const [historyBackView, setHistoryBackView] = useState("profile");
  const goToHistory = useCallback(() => {
    setSidebarOpen(false);
    if (view !== "riwayat-kuis") setHistoryBackView(view);
    setView("riwayat-kuis");
  }, [view]);

  const handleRetryQuiz = useCallback((moduleId) => {
    const target = filteredPlaylist.find(v => v.id === moduleId);
    if (!target) return;
    handleSelectVideo(target);   // pilih video modul terkait, scroll ke atas, simpan resume
    setView("training");
    // Modul yang sudah pernah lulus kuisnya berarti videonya sudah pernah
    // ditandai selesai (isWatched === true), jadi kuis boleh langsung dibuka.
    setQuizKey(k => k + 1);
    setShowQuiz(true);
  }, [filteredPlaylist, handleSelectVideo]);

  /* ─── LOGOUT ─── */
  const handleLogoutRequest = useCallback(() => setShowLogoutConfirm(true), []);
  const handleLogoutConfirm = useCallback(() => { setShowLogoutConfirm(false); logout(); }, [logout]);
  const handleLogoutCancel  = useCallback(() => setShowLogoutConfirm(false), []);

  /* ─── FAQ / TANYA TRAINER: link WhatsApp berisi konteks modul + pertanyaan ─── */
  const trainerWaHref = useMemo(() => {
    const namaUser     = user?.nama || "Kandidat Karyawan";
    const moduleTitle  = currentVideo?.title || "Modul Training";
    const questionText = trainerQuestion.trim() || "(pertanyaan belum ditulis)";
    const msg =
`Halo Trainer IKIGAI,
Saya ${namaUser} ingin bertanya terkait materi "${moduleTitle}".

Pertanyaan saya:
${questionText}

Mohon bantuannya, terima kasih.`;
    return `https://wa.me/6285624892864?text=${encodeURIComponent(msg)}`;
  }, [user, currentVideo, trainerQuestion]);

  const handleSendTrainerQuestion = useCallback((e) => {
    if (!trainerQuestion.trim()) {
      e.preventDefault();
      alert("Tulis pertanyaan Anda dulu sebelum mengirim ke trainer.");
    }
  }, [trainerQuestion]);

  /* ─── DERIVED FLAGS ─── */
  const currentPlayableIdx = playablePlaylist.findIndex(v => v.id === currentVideo?.id);
  const isWatched  = currentVideo ? completedVideos.includes(currentVideo.id) : false;
  const isPassed   = currentVideo ? passedQuizzes.some(q => q.id === currentVideo.id) : false;
  const isDisabled = currentVideo?.disabled === true;
  const isSoon     = currentVideo?.isSoon   === true;
  const hasNext    = currentPlayableIdx >= 0 && currentPlayableIdx < playablePlaylist.length - 1;
  const hasPrev    = currentPlayableIdx > 0;
  const activeRawList = activeTab === "MODUL" ? modulList : sopList;
  const activeList = useMemo(() => {
    if (moduleFilter === "saved") {
      return activeRawList.filter(item => bookmarks.includes(item.id));
    }
    if (moduleFilter === "todo") {
      return activeRawList.filter(item => !passedQuizzes.some(q => q.id === item.id));
    }
    return activeRawList;
  }, [activeRawList, moduleFilter, bookmarks, passedQuizzes]);

  const allModulesPassed = playablePlaylist.length > 0 && completedCount >= playablePlaylist.length;
  const goToModules = () => setView("training");
  const goToDashboard = () => setView("dashboard");

  // Bottom Navigation untuk Akses Mobile
  const renderBottomNav = (active) => (
    <nav className="emerald-bottom-nav" aria-label="Navigasi Karyawan">
      <button className={active === "dashboard" ? "active" : ""} onClick={goToDashboard}>
        <span className="nav-bubble"><HomeIcon /></span>
        <span className="nav-label">Beranda</span>
      </button>
      <button className={active === "training" ? "active" : ""} onClick={goToModules}>
        <span className="nav-bubble"><BookIcon /></span>
        <span className="nav-label">Modul</span>
      </button>
      <button className={active === "certificate" ? "active" : ""} onClick={() => setView("certificate")}>
        <span className="nav-bubble"><CertIcon /></span>
        <span className="nav-label">Sertifikat</span>
      </button>
      <button className={active === "profile" ? "active" : ""} onClick={() => setView("profile")}>
        <span className="nav-bubble"><UserIcon /></span>
        <span className="nav-label">Profil</span>
      </button>
    </nav>
  );

  // Help Modal / Sheet (Emerald Luxury Architecture)
  const renderHelpSheet = () => showHelp && (
    <div className="emerald-modal-backdrop" onClick={() => setShowHelp(false)}>
      <section 
        className="emerald-help-sheet-card" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="sheet-handle-bar" />

        {/* Header Modal */}
        <div className="help-card-header">
          <div className="help-header-title">
            <div className="help-icon-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h3>Pusat Bantuan Training</h3>
              <p className="help-sub">Panduan penggunaan &amp; kontak HRD</p>
            </div>
          </div>

          <button 
            type="button" 
            className="close-btn-round" 
            onClick={() => setShowHelp(false)}
            aria-label="Tutup Pusat Bantuan"
          >
            <CloseIcon />
          </button>
        </div>

        {/* List Pertanyaan Sering Diajukan (FAQ) */}
        <div className="help-content-list">
          <div className="help-item-card">
            <div className="help-item-icon emerald">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div className="help-item-text">
              <strong>Bagaimana cara membuka kuis?</strong>
              <p>Tonton video modul sampai selesai terlebih dahulu. Tombol kuis akan otomatis aktif secara otomatis.</p>
            </div>
          </div>

          <div className="help-item-card">
            <div className="help-item-icon gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="help-item-text">
              <strong>Kendala akses atau lupa kode?</strong>
              <p>Silakan hubungi HRD / SPV outlet Anda untuk melakukan reset kode akses karyawan.</p>
            </div>
          </div>

          <div className="help-item-card">
            <div className="help-item-icon blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="help-item-text">
              <strong>Kapan sertifikat bisa diunduh?</strong>
              <p>Sertifikat resmi otomatis terbuka di menu "Sertifikat Saya" setelah seluruh modul dan kuis dinyatakan lulus.</p>
            </div>
          </div>
        </div>

        {/* Action Card Kontak HRD (WhatsApp Direct Link) */}
        <div className="help-contact-card">
          <div className="contact-info-wrap">
            <span className="contact-tag">BUTUH BANTUAN LANGSUNG?</span>
            <strong className="contact-name">Tim HRD &amp; Support IKIGAI</strong>
          </div>

          {/* Formulasi Pesan Dinamis & Encoded untuk WhatsApp */}
          {(() => {
            const namaUser = user?.nama || "Kandidat Karyawan";
            const cabangUser = user?.divisi || user?.cabang || "IKIGAI";
            
            const waMessage = 
        `Halo Tim HRD IKIGAI,
        Perkenalkan, saya ${namaUser}, kandidat karyawan baru yang akan bergabung di cabang ${cabangUser}.

        Mohon izin menghubungi Bapak/Ibu. Saat ini saya membutuhkan bantuan terkait akses pada portal IKIGAI Training Center. Saya mengalami kendala sehingga belum dapat mengakses/menggunakan portal tersebut dengan baik.

        Apabila berkenan, mohon bantuannya untuk pengecekan atau panduan lebih lanjut. Terima kasih atas waktu dan bantuannya.

        Salam hormat,
        ${namaUser}`;

            const waLink = `https://wa.me/6285624892864?text=${encodeURIComponent(waMessage)}`;

            return (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-action"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span>Hubungi via WhatsApp</span>
              </a>
            );
          })()}
        </div>
      </section>
    </div>
  );

  // Topbar Elegan
  const renderFriendlyTopbar = (title, active) => (
    <div className="emerald-topbar">
      <div className="topbar-left">
        <button className="topbar-menu-toggle" onClick={() => setSidebarOpen(s => !s)}>
          <MenuIcon />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <span className="topbar-progress-badge">
          {completedCount}/{playablePlaylist.length} Selesai
        </span>

        {/* 🔔 Pusat Notifikasi */}
        <NotificationCenter
          notifications={notifications}
          onSelect={handleNotificationSelect}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
        />

        <button type="button" className="topbar-help-btn" onClick={() => setShowHelp(true)} title="Bantuan">
          <HelpIcon />
        </button>
      </div>
      {renderBottomNav(active)}
    </div>
  );

  /* ─── LOADING STATE ─── */
  if (!currentVideo) {
    return (
      <div className="emerald-loading-screen">
        <div className="emerald-loading-content">

          {/* Brand */}
          <div className="emerald-loading-brand">
            <div className="emerald-loading-logo">I</div>
            <div>
              <span className="emerald-loading-brand-name">IKIGAI</span>
              <span className="emerald-loading-brand-subtitle">
                TRAINING CENTER
              </span>
            </div>
          </div>

          {/* Loading Indicator */}
          <div className="emerald-loading-indicator">
            <div className="emerald-spinner" />
          </div>

          {/* Status */}
          <div className="emerald-loading-status">
            <p className="emerald-loading-text">
              Menyiapkan modul training
            </p>
            <span className="emerald-loading-subtext">
              Mohon tunggu sebentar...
            </span>
          </div>

          {/* Progress Line */}
          <div className="emerald-loading-progress">
            <div className="emerald-loading-progress-bar" />
          </div>

        </div>
      </div>
    );
  }

  /* ─── SIDEBAR COMPONENT ─── */
  const renderSidebar = (isDashboard = false) => (
    <aside className={`emerald-sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-inner">
        
        {/* Brand Section */}
        <div className="sidebar-brand">
          <img
            src="/logo_ikigai.png"
            alt="IKIGAI Logo"
            className="brand-logo-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="brand-text-wrap">
            <span className="brand-name">IKIGAI</span>
            <span className="brand-sub">TRAINING CENTER</span>
          </div>
          <button className="sidebar-close-mobile" onClick={() => setSidebarOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        {/* User Card */}
        <div className="sidebar-user-card">
          <div className="avatar-circle">
            {user?.nama?.charAt(0)?.toUpperCase() || "I"}
          </div>
          <div className="user-info">
            <p className="user-name">{user?.nama || "Karyawan"}</p>
            <span className="user-role-badge">{user?.role || "MEMBER"}</span>
          </div>
        </div>

        {/* Overall Progress Block */}
        <div className="sidebar-progress-box">
          <div className="progress-label-row">
            <span>PROGRES TRAINING</span>
            <span className="percent-text">{globalProgress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${globalProgress}%` }}></div>
          </div>
        </div>

        {/* Category Tabs (jika di halaman Modul) */}
        {!isDashboard && (
          <>
            <div className="sidebar-tabs">
              <button
                className={`sidebar-tab ${activeTab === "SOP" ? "active" : ""}`}
                onClick={() => setActiveTab("SOP")}
              >
                SOP
              </button>
              <button
                className={`sidebar-tab ${activeTab === "MODUL" ? "active" : ""}`}
                onClick={() => setActiveTab("MODUL")}
              >
                MODUL
              </button>
            </div>

            <div className="module-filter-pills" aria-label="Filter daftar modul">
              <button
                type="button"
                className={moduleFilter === "all" ? "active" : ""}
                onClick={() => setModuleFilter("all")}
              >
                Semua
              </button>
              <button
                type="button"
                className={moduleFilter === "todo" ? "active" : ""}
                onClick={() => setModuleFilter("todo")}
              >
                Belum
              </button>
              <button
                type="button"
                className={moduleFilter === "saved" ? "active" : ""}
                onClick={() => setModuleFilter("saved")}
              >
                Tersimpan
              </button>
            </div>
          </>
        )}

        {/* Nav List */}
        <nav className="sidebar-playlist">
          <div
            className={`playlist-item ${isDashboard ? "active" : ""}`}
            onClick={() => { setView("dashboard"); setSidebarOpen(false); }}
          >
            <span className="item-icon"><HomeIcon /></span>
            <div className="item-info">
              <p className="item-title">Beranda Utama</p>
              <p className="item-sub">Ringkasan &amp; Progres</p>
            </div>
          </div>

          {isDashboard ? (
            <>
              <div className="playlist-item" onClick={() => { setView("training"); setSidebarOpen(false); }}>
                <span className="item-icon"><BookIcon /></span>
                <div className="item-info">
                  <p className="item-title">Daftar Modul</p>
                  <p className="item-sub">Materi &amp; Kuis</p>
                </div>
              </div>
              <div className="playlist-item" onClick={() => { setView("bookmarks"); setSidebarOpen(false); }}>
                <span className="item-icon"><BookmarkIcon /></span>
                <div className="item-info">
                  <p className="item-title">Modul Tersimpan</p>
                  <p className="item-sub">{bookmarks.length} modul dibookmark</p>
                </div>
              </div>
              <div className="playlist-item" onClick={goToHistory}>
                <span className="item-icon"><HistoryIcon /></span>
                <div className="item-info">
                  <p className="item-title">Transkrip Evaluasi</p>
                  <p className="item-sub">Riwayat Semua Kuis</p>
                </div>
              </div>
              <div className="playlist-item" onClick={() => { setView("certificate"); setSidebarOpen(false); }}>
                <span className="item-icon"><CertIcon /></span>
                <div className="item-info">
                  <p className="item-title">Sertifikat Kelulusan</p>
                  <p className="item-sub">Klaim Bukti Training</p>
                </div>
              </div>
              <div className="playlist-item" onClick={() => { setView("profile"); setSidebarOpen(false); }}>
                <span className="item-icon"><UserIcon /></span>
                <div className="item-info">
                  <p className="item-title">Profil Saya</p>
                  <p className="item-sub">Informasi Karyawan</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {activeList.length === 0 && (
                <div className="playlist-empty">
                  {moduleFilter === "saved"
                    ? "Belum ada modul tersimpan di kategori ini."
                    : moduleFilter === "todo"
                      ? "Semua modul di kategori ini sudah lulus."
                      : "Belum ada modul di kategori ini."}
                </div>
              )}

              {activeList.map((item, i) => {
                const itemPassed   = passedQuizzes.some(q => q.id === item.id);
                const itemDisabled = item.disabled === true;
                const itemSoon     = item.isSoon   === true;
                const isClickable  = !itemDisabled && !itemSoon;

                return (
                  <div
                    key={item.id}
                    className={[
                      "playlist-item",
                      currentVideo?.id === item.id ? "active" : "",
                      itemDisabled ? "disabled" : "",
                      itemSoon ? "soon" : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => isClickable && handleSelectVideo(item)}
                  >
                    <span className="item-index">{String(i + 1).padStart(2, "0")}</span>
                    <div className="item-info">
                      <p className="item-title">{item.title}</p>
                      <p className="item-sub">{item.category}</p>
                    </div>
                    <div className="item-badges-row">
                      {bookmarks.includes(item.id) && (
                        <span className="badge-bookmark" title="Tersimpan">
                          <BookmarkIcon filled />
                        </span>
                      )}
                      {itemSoon ? (
                        <span className="badge-soon">SOON</span>
                      ) : itemPassed ? (
                        <div className="badge-check"><CheckIcon /></div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogoutRequest}>
            <LogoutIcon />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </aside>
  );

/* ══════════════════════════════════════════════════════════
     RIWAYAT KUIS / TRANSKRIP EVALUASI (QuizHistoryPage)
  ══════════════════════════════════════════════════════════
     Halaman berdiri sendiri (full-screen, punya topbar & tombol
     kembali sendiri) — sesuai desain aslinya. Dibuka dari:
       - Profil > "Lihat Semua Riwayat"
       - Dashboard > "Lihat Semua" (Aktivitas & Kuis Terakhir)
       - Sidebar > "Transkrip Evaluasi"
  ══════════════════════════════════════════════════════════ */
  if (view === "riwayat-kuis") {
    return (
      <div className="emerald-app-wrapper">
        <OfflineBanner isOnline={isOnline} isFirebaseConnected={isFirebaseConnected} />
        <LogoutConfirmDialog show={showLogoutConfirm} onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />
        {renderHelpSheet()}

        <div className="emerald-layout">
          {sidebarOpen && <div className="emerald-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
          {renderSidebar(true)}
          <main className="emerald-main-content" ref={mainRef}>
            {renderFriendlyTopbar("Transkrip Evaluasi", "profile")}

            <section className="emerald-sheet-view qh-view">
              <QuizHistoryPage
                history={quizHistoryData}
                onBack={() => setView(historyBackView || "dashboard")}
                onRetryQuiz={handleRetryQuiz}
              />
            </section>
          </main>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     MODUL TERSIMPAN (Bookmark)
  ══════════════════════════════════════════════════════════ */
  if (view === "bookmarks") {

    // Palet warna kategori — dipilih otomatis & konsisten per nama kategori,
    // jadi tidak perlu tahu daftar kategori Anda di muka (SOP, User Guide, dst).
    const CATEGORY_PALETTE = [
      { bg: "#e3f4ee", text: "#0f6b4f", dot: "#16a37f" }, // emerald
      { bg: "#fbf1de", text: "#c9922d", dot: "#c9922d" }, // gold
      { bg: "#e8f1fc", text: "#3577c9", dot: "#3577c9" }, // sky
      { bg: "#efeafb", text: "#7c5cbf", dot: "#7c5cbf" }, // violet
      { bg: "#fbebe8", text: "#c4433a", dot: "#d05a4d" }, // coral
    ];
    const getCatStyle = (cat) => {
      if (!cat) return { bg: "#eef1f0", text: "#3d4f48", dot: "#8fa39a" };
      let hash = 0;
      for (let i = 0; i < cat.length; i++) hash = (hash * 31 + cat.charCodeAt(i)) >>> 0;
      return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
    };

    // Status per modul diturunkan dari data asli (completedVideos / passedQuizzes),
    // bukan field progress buatan — supaya selalu akurat.
    const getModuleStatus = (m) => {
      const passed  = passedQuizzes.some(q => q.id === m.id);
      const watched = completedVideos.includes(m.id);
      if (passed)  return { pct: 100, label: "Tuntas" };
      if (watched) return { pct: 50,  label: "Kuis Tertunda" };
      return { pct: 0, label: "Belum Ditonton" };
    };

    const categories = Array.from(
      new Set(bookmarkedModules.map((m) => m.category).filter(Boolean))
    );

    const filteredBookmarks = bookmarkedModules.filter((m) => {
      const matchesCategory = bookmarkCategoryFilter === "Semua" || m.category === bookmarkCategoryFilter;
      const matchesSearch = m.title.toLowerCase().includes(bookmarkSearch.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const totalCount = bookmarkedModules.length;
    const completeCount = bookmarkedModules.filter(m => passedQuizzes.some(q => q.id === m.id)).length;
    const inProgressCount = bookmarkedModules.filter(m => {
      const passed  = passedQuizzes.some(q => q.id === m.id);
      const watched = completedVideos.includes(m.id);
      return watched && !passed;
    }).length;

    // Kategori terbanyak di antara modul tersimpan
    const topCategory = (() => {
      if (categories.length === 0) return "—";
      const counts = {};
      bookmarkedModules.forEach(m => { if (m.category) counts[m.category] = (counts[m.category] || 0) + 1; });
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    })();

    return (
      <div className="emerald-app-wrapper">
        <OfflineBanner isOnline={isOnline} isFirebaseConnected={isFirebaseConnected} />
        <LogoutConfirmDialog show={showLogoutConfirm} onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />
        {renderHelpSheet()}

        <div className="emerald-layout">
          {renderSidebar(true)}
          <main className="emerald-main-content" ref={mainRef}>
            {renderFriendlyTopbar("Modul Tersimpan", "dashboard")}

            <section className="emerald-sheet-view p-bookmark-view">
              {totalCount === 0 ? (
                <div className="p-bookmark-empty">
                  <svg className="p-bookmark-empty-illust" width="88" height="88" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  <h3>Belum ada modul yang disimpan</h3>
                  <p>Bookmark modul favorit atau yang sering kamu perlukan supaya bisa dibuka lagi dengan cepat saat sedang bertugas di lapangan.</p>
                  <button type="button" className="p-bookmark-cta" onClick={() => setView("training")}>
                    <BookIcon /> Jelajahi Daftar Modul
                  </button>
                  <div className="p-bookmark-hint">
                    Tap ikon <BookmarkIcon /> di halaman modul untuk menyimpannya
                  </div>
                </div>
              ) : (
                <>
                  {/* Stat strip */}
                  <div className="p-bookmark-stats">
                    <div className="p-bookmark-stat-card">
                      <span className="p-bookmark-stat-icon emerald"><BookmarkIcon filled /></span>
                      <div>
                        <span className="p-bookmark-stat-num">{totalCount}</span>
                        <span className="p-bookmark-stat-label">Total Tersimpan</span>
                      </div>
                    </div>
                    <div className="p-bookmark-stat-card">
                      <span className="p-bookmark-stat-icon gold"><CheckIcon /></span>
                      <div>
                        <span className="p-bookmark-stat-num">{completeCount}</span>
                        <span className="p-bookmark-stat-label">Sudah Tuntas</span>
                      </div>
                    </div>
                    <div className="p-bookmark-stat-card">
                      <span className="p-bookmark-stat-icon sky"><ClockIcon /></span>
                      <div>
                        <span className="p-bookmark-stat-num">{inProgressCount}</span>
                        <span className="p-bookmark-stat-label">Sedang Berjalan</span>
                      </div>
                    </div>
                    <div className="p-bookmark-stat-card">
                      <span className="p-bookmark-stat-icon violet"><LayersIcon /></span>
                      <div>
                        <span className="p-bookmark-stat-num p-bookmark-stat-text">{topCategory}</span>
                        <span className="p-bookmark-stat-label">Kategori Terbanyak</span>
                      </div>
                    </div>
                  </div>

                  {/* Search + filter row */}
                  <div className="p-bookmark-toolbar">
                    <div className="p-bookmark-search-box">
                      <SearchIcon />
                      <input
                        type="text"
                        placeholder="Cari modul tersimpan…"
                        value={bookmarkSearch}
                        onChange={(e) => setBookmarkSearch(e.target.value)}
                      />
                    </div>
                    {categories.length > 0 && (
                      <div className="p-bookmark-chips">
                        <button
                          type="button"
                          className={`p-bookmark-chip ${bookmarkCategoryFilter === "Semua" ? "active" : ""}`}
                          onClick={() => setBookmarkCategoryFilter("Semua")}
                        >
                          Semua Kategori
                        </button>
                        {categories.map((cat) => {
                          const s = getCatStyle(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              className={`p-bookmark-chip ${bookmarkCategoryFilter === cat ? "active" : ""}`}
                              onClick={() => setBookmarkCategoryFilter(cat)}
                            >
                              <span className="p-bookmark-chip-dot" style={{ background: s.dot }} />
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Module grid */}
                  {filteredBookmarks.length === 0 ? (
                    <div className="p-empty-history">
                      <p>Tidak ada modul yang cocok.</p>
                      <small>Coba ubah kata kunci pencarian atau kategori filter.</small>
                    </div>
                  ) : (
                    <div className="p-bookmark-grid">
                      {filteredBookmarks.map((m) => {
                        const s = getCatStyle(m.category);
                        const { pct, label } = getModuleStatus(m);
                        return (
                          <div key={m.id} className="p-bookmark-card">
                            <div className="p-bookmark-card-accent" style={{ background: s.dot }} />
                            {pct === 100 && (
                              <span className="p-bookmark-complete-flag"><CheckIcon /> Tuntas</span>
                            )}
                            <div className="p-bookmark-card-body">
                              <div className="p-bookmark-card-top">
                                <span className="p-bookmark-cat-badge" style={{ background: s.bg, color: s.text }}>
                                  {m.category}
                                </span>
                                <button
                                  type="button"
                                  className="p-bookmark-toggle-btn"
                                  onClick={() => toggleBookmark(m.id)}
                                  title="Hapus dari tersimpan"
                                >
                                  <BookmarkIcon filled />
                                </button>
                              </div>

                              <h4 className="p-bookmark-title">{m.title}</h4>
                              <span className="p-bookmark-status-text">{label}</span>

                              <div className="p-bookmark-progress-row">
                                <div className="p-bookmark-progress-track">
                                  <div className="p-bookmark-progress-fill" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="p-bookmark-progress-pct">{pct}%</span>
                              </div>

                              <div className="p-bookmark-card-footer">
                                <button
                                  type="button"
                                  className="p-bookmark-open-btn"
                                  onClick={() => { handleSelectVideo(m); setView("training"); }}
                                >
                                  {pct === 100 ? "Buka Kembali" : pct === 50 ? "Lanjutkan" : "Mulai Modul"}
                                  <ChevronRight />
                                </button>
                                <button
                                  type="button"
                                  className="p-bookmark-remove-btn"
                                  onClick={() => toggleBookmark(m.id)}
                                  title="Hapus dari tersimpan"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </section>
          </main>
        </div>
      </div>
    );
  }

/* ══════════════════════════════════════════════════════════
     CERTIFICATE VIEW (OFFICIAL EMERALD & GOLD LUXURY — DETAILED)
  ══════════════════════════════════════════════════════════ */
  if (view === "certificate") {
    const totalModules = playablePlaylist?.length || 0;
    // Disamakan dengan globalProgress (sidebar/dashboard) — lihat catatan di atas.
    const progressPct = globalProgress;

    // Format Tanggal Kelulusan Resmi
    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // Generate Credential ID Unik (prefix "IKG-" pada kode karyawan dibuang agar tidak dobel)
    const certUserCode = String(user?.kode || "OFFICIAL").replace(/^IKG-/i, "");
    const certCredentialId = `IKG-CERT-${certUserCode}-${new Date().getFullYear()}`;

    // ── Rincian Pencapaian (dipakai di sertifikat & panel detail) ──
    const achievementList = [...quizHistoryData].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const avgCertScore = achievementList.length > 0
      ? Math.round(achievementList.reduce((acc, q) => acc + (q.score || 0), 0) / achievementList.length)
      : 0;
    const latestQuiz = achievementList[0];
    const completionDateStr = latestQuiz
      ? new Date(latestQuiz.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
      : todayStr;
    const getPredikat = (score) => {
      if (score >= 95) return "Predikat Istimewa";
      if (score >= 85) return "Sangat Memuaskan";
      if (score >= 75) return "Memuaskan";
      return "Baik";
    };
    const predikat = getPredikat(avgCertScore);

    // ── Modul yang belum tuntas (dipakai di tampilan terkunci) ──
    const remainingModules = playablePlaylist.filter(v => !passedQuizzes.some(q => q.id === v.id));

    const handleCopyCredential = () => {
      navigator.clipboard.writeText(certCredentialId);
      if (typeof showToast === "function") {
        showToast("ID Kredensial Sertifikat disalin!", "success");
      } else {
        alert("ID Kredensial Sertifikat disalin!");
      }
    };

    const handleShareCertificate = async () => {
      const shareText = `Saya baru saja menyelesaikan Training IKIGAI dan meraih sertifikat kelulusan resmi! ID Kredensial: ${certCredentialId}`;
      if (navigator.share) {
        try {
          await navigator.share({ title: "Sertifikat Kelulusan IKIGAI", text: shareText });
        } catch (e) { /* dibatalkan pengguna — abaikan */ }
      } else {
        navigator.clipboard.writeText(shareText);
        if (typeof showToast === "function") {
          showToast("Info sertifikat disalin, siap dibagikan!", "success");
        } else {
          alert("Info sertifikat disalin, siap dibagikan!");
        }
      }
    };

    return (
      <div className="emerald-app-wrapper print-wrapper">
        <OfflineBanner isOnline={isOnline} isFirebaseConnected={isFirebaseConnected} />
        <LogoutConfirmDialog show={showLogoutConfirm} onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />
        {renderHelpSheet()}

        <div className="emerald-layout">
          {renderSidebar(true)}
          <main className="emerald-main-content" ref={mainRef}>
            {renderFriendlyTopbar("Sertifikat", "certificate")}

            <section className="emerald-sheet-view cert-sheet-container">

              {allModulesPassed ? (
                /* ════════════════════════════════════════════════════
                   1. TAMPILAN TERBUKA (ALL MODULES PASSED)
                   ════════════════════════════════════════════════════ */
                <div className="cert-unlocked-wrapper">

                  {/* Action Bar Atas */}
                  <div className="cert-action-bar hide-on-print">
                    <div className="cert-status-info">
                      <span className="cert-verified-pill">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        TERVERIFIKASI RESMI
                      </span>
                      <p className="cert-subtext">
                        Sertifikat pelatihan internal resmi IKIGAI Training Center, diterbitkan secara digital dan dapat diverifikasi.
                      </p>
                    </div>

                    <div className="cert-btn-group">
                      <button type="button" className="btn-cert-copy" onClick={handleShareCertificate} title="Bagikan Sertifikat">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        <span>Bagikan</span>
                      </button>
                      <button type="button" className="btn-cert-copy" onClick={handleCopyCredential} title="Salin ID Kredensial">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>ID Kredensial</span>
                      </button>
                      <button
                        type="button"
                        className="btn-emerald-primary-pill btn-print-cert"
                        onClick={() => window.print()}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 6 2 18 2 18 9" />
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                          <rect x="6" y="14" width="12" height="8" />
                        </svg>
                        Cetak / Simpan PDF
                      </button>
                    </div>
                  </div>

                  {/* Ringkasan Cepat */}
                  <div className="cert-quick-stats hide-on-print">
                    <div className="cqs-item">
                      <span className="cqs-val">{completionDateStr}</span>
                      <span className="cqs-lbl">Tanggal Lulus</span>
                    </div>
                    <div className="cqs-item">
                      <span className="cqs-val">{completedCount}/{totalModules}</span>
                      <span className="cqs-lbl">Modul Diselesaikan</span>
                    </div>
                    <div className="cqs-item">
                      <span className="cqs-val">{avgCertScore}</span>
                      <span className="cqs-lbl">Rata-Rata Nilai</span>
                    </div>
                    <div className="cqs-item">
                      <span className="cqs-val">{predikat}</span>
                      <span className="cqs-lbl">Predikat</span>
                    </div>
                  </div>

                  {/* 📜 PRATINJAU SERTIFIKAT RESMI (A4 PRINTABLE FRAME) */}
                  <div className="official-certificate-frame" id="printable-certificate">
                    <div className="cert-border-outer">
                      <div className="cert-border-inner">

                        <span className="cert-corner tl" /><span className="cert-corner tr" />
                        <span className="cert-corner bl" /><span className="cert-corner br" />

                        <img
                          src="/logo_ikigai.png"
                          alt=""
                          aria-hidden="true"
                          className="cert-watermark-logo"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />

                        {/* Header Branding: logo + IKIGAI + tagline = satu paket, sejajar No. Sertifikat */}
                        <CertificateHeader credentialId={certCredentialId} />

                        {/* Certificate Title */}
                        <div className="cert-title-section">
                          <span className="cert-emblem">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#b87511" strokeWidth="1.4">
                              <circle cx="12" cy="12" r="10" fill="#fef3c7" />
                              <path d="M12 15l-3.5 2 1-4-3-3 4-.5L12 6l1.5 3.5 4 .5-3 3 1 4z" fill="#d97706" stroke="none" />
                            </svg>
                          </span>
                          <h1 className="cert-main-title">SERTIFIKAT KELULUSAN</h1>
                          <p className="cert-subtitle">CERTIFICATE OF COMPLETION</p>
                          <div className="cert-divider-line" />
                        </div>

                        {/* Recipient Details */}
                        <div className="cert-recipient-section">
                          <p className="cert-given-to">Dengan bangga diberikan kepada:</p>
                          <h2 className="cert-user-name">{user?.nama || "Nama Karyawan"}</h2>
                          <div className="cert-user-meta">
                            <span>Kode Karyawan: <strong>{user?.kode || user?.id || "-"}</strong></span>
                            <span className="dot">•</span>
                            <span>Outlet / Divisi: <strong>{user?.divisi || "Corporate"}</strong></span>
                          </div>
                        </div>

                        {/* Statement Body */}
                        <div className="cert-body-statement">
                          <p>
                            Atas keberhasilan dan dedikasinya dalam menyelesaikan seluruh rangkaian kurikulum pelatihan
                            internal standar mutu operasional <strong>{user?.role || "Karyawan"}</strong>, mencakup{" "}
                            {totalModules} modul materi dan evaluasi kompetensi, di IKIGAI Training Center.
                          </p>
                        </div>

                        {/* Grid Detail Kelulusan */}
                        <div className="cert-detail-grid">
                          <div className="cdg-item">
                            <span>Jabatan</span>
                            <strong>{user?.role || "Karyawan"}</strong>
                          </div>
                          <div className="cdg-item">
                            <span>Modul Diselesaikan</span>
                            <strong>{completedCount} / {totalModules}</strong>
                          </div>
                          <div className="cdg-item">
                            <span>Rata-rata Nilai Evaluasi</span>
                            <strong>{avgCertScore} / 100</strong>
                          </div>
                          <div className="cdg-item">
                            <span>Predikat Kelulusan</span>
                            <strong>{predikat}</strong>
                          </div>
                        </div>

                        {/* Footer Signatures & Metadata */}
                        <div className="cert-footer">
                          <div className="cert-meta-left">
                            <p className="cert-meta-label">Diterbitkan Pada</p>
                            <p className="cert-meta-val">{todayStr}</p>
                            <p className="cert-meta-label mt-2">Berlaku Sebagai</p>
                            <p className="cert-meta-val">Bukti Kompetensi Internal</p>
                          </div>

                          <div className="cert-seal-center">
                            <div className="cert-official-seal">
                              <span>IKIGAI</span>
                              <small>OFFICIAL SEAL</small>
                            </div>
                            <span className="cert-verify-hint">Cek ID untuk verifikasi</span>
                          </div>

                          <div className="cert-signature-right">
                            <div className="signature-line" />
                            <p className="signature-name">People &amp; Culture</p>
                            <p className="signature-corp">IKIGAI Hot Stone Massage &amp; Reflexology</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* 📋 Rincian Pencapaian / Transkrip Ringkas */}
                  <div className="cert-breakdown-card hide-on-print">
                    <div className="p-card-header">
                      <div className="p-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </div>
                      <h3>Rincian Pencapaian ({achievementList.length} Modul)</h3>
                      <button type="button" className="p-view-all-history-btn" onClick={goToHistory}>
                        <span>Lihat Transkrip Lengkap</span>
                        <HistoryIcon />
                      </button>
                    </div>

                    <div className="cert-breakdown-list">
                      {achievementList.slice(0, 6).map((q, i) => (
                        <div key={q.id || i} className="cert-breakdown-row">
                          <span className="cbr-index">{String(i + 1).padStart(2, "0")}</span>
                          <div className="cbr-info">
                            <strong>{q.title}</strong>
                            <span>
                              {q.category} • {new Date(q.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <span className={`p-score-pill ${q.score >= 80 ? "high" : q.score >= 70 ? "mid" : "low"}`}>
                            {q.score}/100
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="cert-verify-footnote hide-on-print">
                    Sertifikat ini diterbitkan secara digital oleh sistem IKIGAI Training Center dan sah tanpa tanda
                    tangan basah. Untuk verifikasi keaslian, sampaikan ID Kredensial <strong>{certCredentialId}</strong>{" "}
                    kepada Tim People &amp; Culture IKIGAI.
                  </p>

                </div>
              ) : (
                /* ════════════════════════════════════════════════════
                   2. TAMPILAN TERKUNCI (IN PROGRESS ROADMAP — DETAILED)
                   ════════════════════════════════════════════════════ */
                <div className="cert-locked-container">

                  {/* Lock Hero Card */}
                  <div className="cert-lock-hero">
                    <div className="lock-icon-circle">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>

                    <div className="lock-hero-content">
                      <span className="lock-tag">SERTIFIKAT BELUM TERSEDIA</span>
                      <h2>Selesaikan Modul Pelatihan Anda</h2>
                      <p>
                        Sertifikat resmi hanya diterbitkan setelah Anda menyelesaikan seluruh materi dan lulus kuis evaluasi.
                      </p>
                    </div>
                  </div>

                  {/* 🔒 Watermark Preview Sertifikat — pemacu motivasi */}
                  <div className="cert-preview-section">
                    <p className="cert-preview-label">PRATINJAU SERTIFIKAT ANDA</p>
                    <div className="cert-preview-blur-wrap">
                      <div className="cert-preview-blur-inner">
                        <div className="official-certificate-frame">
                          <div className="cert-border-outer">
                            <div className="cert-border-inner">
                              {/* Pratinjau memakai komponen header yang sama; nomor sertifikat sengaja disamarkan */}
                              <CertificateHeader credentialId="IKG-CERT-XXXX-XXXX" />
                              <div className="cert-title-section">
                                <h1 className="cert-main-title">SERTIFIKAT KELULUSAN</h1>
                                <p className="cert-subtitle">CERTIFICATE OF COMPLETION</p>
                                <div className="cert-divider-line" />
                              </div>
                              <div className="cert-recipient-section">
                                <p className="cert-given-to">Dengan bangga diberikan kepada:</p>
                                <h2 className="cert-user-name">{user?.nama || "Nama Karyawan"}</h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="cert-preview-overlay">
                        <LockIcon />
                        <span>PRATINJAU. SELESAIKAN SEMUA MODUL UNTUK MEMBUKA SERTIFIKAT ASLI</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Tracker Card */}
                  <div className="cert-progress-card">
                    <div className="p-card-header">
                      <div className="p-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="20" x2="12" y2="10" />
                          <line x1="18" y1="20" x2="18" y2="4" />
                          <line x1="6" y1="20" x2="6" y2="16" />
                        </svg>
                      </div>
                      <h3>Progres Menuju Kelulusan</h3>
                      <span className="progress-badge-pct">{progressPct}%</span>
                    </div>

                    <div className="p-progress-track large">
                      <div className="p-progress-fill" style={{ width: `${progressPct}%` }} />
                    </div>

                    <div className="p-modules-status-summary">
                      <div className="status-item count-done">
                        <span className="dot" />
                        <span>Selesai: <strong>{completedCount} Modul</strong></span>
                      </div>
                      <div className="status-item count-remain">
                        <span className="dot" />
                        <span>Sisa: <strong>{Math.max(totalModules - completedCount, 0)} Modul</strong></span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-emerald-primary-pill w-full flex-center gap-2 mt-4"
                      onClick={() => setView("training")}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      Lanjutkan Mengerjakan Modul
                    </button>
                  </div>

                  {/* 📝 Daftar Modul Yang Masih Tersisa */}
                  {remainingModules.length > 0 && (
                    <div className="cert-remaining-card">
                      <div className="p-card-header">
                        <div className="p-icon-box yellow">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                          </svg>
                        </div>
                        <h3>Modul yang Masih Perlu Diselesaikan</h3>
                        <span className="cert-remaining-count">{remainingModules.length} Modul</span>
                      </div>

                      <div className="cert-remaining-list">
                        {remainingModules.map((m, i) => {
                          const watched = completedVideos.includes(m.id);
                          return (
                            <button
                              type="button"
                              key={m.id}
                              className="cert-remaining-row"
                              onClick={() => { handleSelectVideo(m); setView("training"); }}
                            >
                              <span className={`crr-status-dot ${watched ? "half" : ""}`}>
                                {watched ? (
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4M12 16h.01" />
                                  </svg>
                                ) : (
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                  </svg>
                                )}
                              </span>

                              <div className="crr-info">
                                <strong>{m.title}</strong>
                                <div className="crr-meta-row">
                                  <span className="crr-cat">{m.category}</span>
                                  <span className={`crr-status-pill ${watched ? "half" : ""}`}>
                                    {watched ? "Kuis Tertunda" : "Belum Ditonton"}
                                  </span>
                                </div>
                              </div>

                              <span className="crr-chevron">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </section>
          </main>
        </div>
      </div>
    );
  }

/* ══════════════════════════════════════════════════════════
     PROFILE VIEW — isi halaman ada di komponen <ProfileView /> (atas file)
  ══════════════════════════════════════════════════════════ */
  if (view === "profile") {
    return (
      <div className="emerald-app-wrapper">
        <OfflineBanner isOnline={isOnline} isFirebaseConnected={isFirebaseConnected} />
        <LogoutConfirmDialog show={showLogoutConfirm} onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />
        {renderHelpSheet()}

        <div className="emerald-layout">
          {sidebarOpen && <div className="emerald-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
          {renderSidebar(true)}
          <main className="emerald-main-content" ref={mainRef}>
            {renderFriendlyTopbar("Profil Saya", "profile")}

            <section className="emerald-sheet-view pf-sheet">
              <ProfileView
                user={user}
                progressPct={globalProgress}
                playable={playablePlaylist}
                completedVideos={completedVideos}
                passedQuizzes={passedQuizzes}
                history={quizHistoryData}
                allPassed={allModulesPassed}
                onViewHistory={goToHistory}
                onViewCertificate={() => setView("certificate")}
                onOpenModule={(m) => { handleSelectVideo(m); setView("training"); }}
                onHelp={() => setShowHelp(true)}
                onLogout={handleLogoutRequest}
              />
            </section>
          </main>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     DASHBOARD VIEW
  ══════════════════════════════════════════════════════════ */
  if (view === "dashboard") {
    return (
      <div className="emerald-app-wrapper">
        <OfflineBanner isOnline={isOnline} isFirebaseConnected={isFirebaseConnected} />
        <LogoutConfirmDialog show={showLogoutConfirm} onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />
        <QuizReviewModal quizRecord={reviewRecord} onClose={() => setReviewRecord(null)} />
        {renderHelpSheet()}

        <div className="emerald-layout">
          {renderSidebar(true)}

          <main className="emerald-main-content" ref={mainRef}>
            {renderFriendlyTopbar("Beranda", "dashboard")}

            <CandidateDashboard
              user={user}
              completedVideos={completedVideos}
              passedQuizzes={passedQuizzes}
              playablePlaylist={playablePlaylist}
              onSelectVideo={(item) => { handleSelectVideo(item); setView("training"); }}
              onEnter={() => setView("training")}
              onReviewQuiz={(record) => setReviewRecord(record)}
              onViewAllHistory={goToHistory}
            />
          </main>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     TRAINING VIEW (VIDEO & QUIZ)
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="emerald-app-wrapper">
      <OfflineBanner isOnline={isOnline} isFirebaseConnected={isFirebaseConnected} />
      <LogoutConfirmDialog show={showLogoutConfirm} onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />
      <AchievementToast show={!!achievement} score={achievement?.score} title={achievement?.title} onDone={() => setAchievement(null)} />
      <QuizReviewModal quizRecord={reviewRecord} onClose={() => setReviewRecord(null)} />
      {renderHelpSheet()}

      <div className="emerald-layout">
        {/* Mobile Backdrop saat Sidebar Buka */}
        {sidebarOpen && <div className="emerald-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

        {renderSidebar(false)}

        <main className="emerald-main-content" ref={mainRef}>
          {renderFriendlyTopbar("Daftar Modul", "training")}

          <div className="emerald-sheet-view">
            {showQuiz ? (
              <div className="emerald-quiz-container">
                <Quiz
                  key={quizKey}
                  data={currentVideo.quiz}
                  onPass={handleQuizPass}
                  onCancel={() => setShowQuiz(false)}
                />
              </div>
            ) : (
              <div className="emerald-training-flow">
                {isDisabled && (
                  <div className="emerald-alert-notice danger">
                    <LockIcon />
                    <span>Modul ini sedang dinonaktifkan oleh Administrator.</span>
                  </div>
                )}

                <div className="training-content-grid">
                  <div className="training-main-column">

              {/* VIDEO / SOP */}
              {!isDisabled && !isSoon ? (
                isDocumentModule ? (
                  <div className="emerald-video-card sop-reader-card">
                    {isOneDriveDocument ? (
                      <div className="sop-office-viewer">
                        <div className="sop-office-header">
                          <DocumentIcon />
                          <div>
                            <strong>{currentVideo.title}</strong>
                            <span>{currentDocumentType.toUpperCase()} Document</span>
                          </div>
                        </div>
                        <iframe
                          title={currentVideo.title}
                          src={documentProxyUrl}
                          className="sop-office-frame"
                          allowFullScreen
                        />
                      </div>
                    ) : isPdfDocument ? (
                      <FlipbookDocViewer
                        url={documentProxyUrl}
                        title={currentVideo.title}
                        onFinishedReading={handleDocumentConfirm}
                      />
                    ) : (
                      <div className="sop-office-viewer">
                        <div className="sop-office-header">
                          <DocumentIcon />
                          <div>
                            <strong>{currentVideo.title}</strong>
                            <span>{currentDocumentType.toUpperCase()} Document</span>
                          </div>
                        </div>
                        <iframe
                          title={currentVideo.title}
                          src={getOfficePreviewUrl(documentProxyUrl)}
                          className="sop-office-frame"
                          allowFullScreen
                        />
                      </div>
                    )}

                    <div className="sop-reader-actions">
                      <a
                        href={documentOpenInNewTabUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sop-reader-openlink"
                      >
                        <DocumentIcon />
                        <span>Buka Dokumen di Tab Baru</span>
                      </a>

                      {!docReadUnlocked && !isWatched && (
                        <p className="sop-reader-hint">
                          Membaca dokumen... tombol konfirmasi aktif sebentar lagi.
                        </p>
                      )}

                      <button
                        type="button"
                        className={`btn-quiz-cta ${isWatched ? "completed" : "active"}`}
                        disabled={!docReadUnlocked || isWatched}
                        onClick={handleDocumentConfirm}
                      >
                        {isWatched
                          ? "✓ Sudah Dikonfirmasi Dibaca"
                          : "Saya Telah Membaca & Memahami"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="emerald-video-card">
                    {isOneDriveVideo ? (
                      <>
                        <iframe
                          key={playableVideoUrl}
                          title={currentVideo.title}
                          src={playableVideoUrl}
                          className="cloud-embed-frame"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        />
                        <div className="sop-reader-actions">
                          <a href={playableVideoUrl} target="_blank" rel="noopener noreferrer" className="sop-reader-openlink">
                            <DocumentIcon />
                            <span>Buka Video di Tab Baru</span>
                          </a>
                          {!docReadUnlocked && !isWatched && (
                            <p className="sop-reader-hint">Tombol konfirmasi aktif sebentar lagi.</p>
                          )}
                          <button
                            type="button"
                            className={`btn-quiz-cta ${isWatched ? "completed" : "active"}`}
                            disabled={!docReadUnlocked || isWatched}
                            onClick={handleDocumentConfirm}
                          >
                            {isWatched ? "✓ Video Selesai" : "Saya Telah Menonton Video"}
                          </button>
                        </div>
                      </>
                    ) : <video
                      key={playableVideoUrl}
                      ref={videoRef}
                      controls
                      playsInline
                      onEnded={handleVideoEnd}
                      className="emerald-video-player"
                    >
                      <source
                        src={playableVideoUrl}
                        type="video/mp4"
                      />
                      Browser Anda tidak mendukung pemutar video.
                    </video>}
                  </div>
                )
              ) : null}

                    {/* COMING SOON */}
                    {isSoon && !isDisabled && (
                      <div className="emerald-video-placeholder">
                        <span className="placeholder-tag">SOON</span>
                        <p className="placeholder-text">
                          Modul Ini Sedang Dalam Pengembangan
                        </p>
                      </div>
                    )}

                    {/* ═══════════════════════════════════════════
                        DETAIL MODUL
                    ═══════════════════════════════════════════ */}
                    <ModuleDetailCard
                      module={currentVideo}
                      index={currentPlayableIdx}
                      total={playablePlaylist.length}
                      isDocument={isDocumentModule}
                      isWatched={isWatched}
                      isPassed={isPassed}
                      score={passedQuizzes.find(q => q.id === currentVideo.id)?.score ?? 100}
                      isDisabled={isDisabled}
                      isSoon={isSoon}
                      bookmarked={bookmarks.includes(currentVideo.id)}
                      onToggleBookmark={() => toggleBookmark(currentVideo.id)}
                      hasPrev={hasPrev}
                      hasNext={hasNext}
                      prevTitle={playablePlaylist[currentPlayableIdx - 1]?.title}
                      nextTitle={playablePlaylist[currentPlayableIdx + 1]?.title}
                      onPrev={handlePrev}
                      onNext={handleNext}
                      onStartQuiz={() => {
                        setQuizKey(k => k + 1);
                        setShowQuiz(true);
                        scrollTop();
                      }}
                    />
                  </div>

                  <aside className="training-support-column">
                    <div className="module-faq-box">
                      {/* HEADER */}
                      <div className="faq-header">
                        <div className="faq-header-icon">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                            <path d="M8 10h8" />
                            <path d="M8 14h5" />
                          </svg>
                        </div>
                        <div className="faq-header-content">
                          <h3 className="faq-title">
                            Butuh Bantuan dengan Materi?
                          </h3>
                          <p className="faq-subtitle">
                            Temukan jawaban atau tanyakan langsung kepada trainer.
                          </p>
                        </div>
                      </div>

                      {/* FAQ */}
                      {Array.isArray(currentVideo.faq) &&
                        currentVideo.faq.length > 0 && (
                        <div className="faq-section">
                          <div className="faq-section-label">
                            Pertanyaan yang Sering Ditanyakan
                          </div>
                          <div className="faq-list">
                            {currentVideo.faq.map((f, i) => (
                              <details
                                key={i}
                                className="faq-item"
                              >
                                <summary>
                                  <span>{f.q}</span>
                                  <svg
                                    className="faq-chevron"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="m6 9 6 6 6-6" />
                                  </svg>
                                </summary>
                                <p>{f.a}</p>
                              </details>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="faq-divider" />
                      <div className="trainer-question-section">
                        <div className="trainer-question-heading">
                          <h4>
                            Masih belum menemukan jawabannya?
                          </h4>

                          <p>
                            Sampaikan pertanyaan Anda kepada trainer
                            terkait materi ini.
                          </p>
                        </div>
                        <div className="trainer-recipient">
                          <div className="trainer-recipient-icon">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 21a8 8 0 0 0-16 0" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>

                          <div className="trainer-recipient-info">
                            <span className="trainer-recipient-label">
                              Pertanyaan akan dikirim kepada
                            </span>
                            <strong className="trainer-recipient-name">
                              Trainer IKIGAI
                            </strong>
                          </div>
                          <span className="trainer-recipient-status">
                            Training Support
                          </span>
                        </div>

                        {/* INPUT */}
                        <div className="trainer-question-form">
                          <label htmlFor="trainer-question">
                            Pertanyaan Anda
                          </label>
                          <textarea
                            id="trainer-question"
                            className="faq-question-input"
                            placeholder="Contoh: Saya masih kurang memahami bagian..."
                            rows={4}
                            value={trainerQuestion}
                            onChange={(e) =>
                              setTrainerQuestion(e.target.value)
                            }
                          />

                          <div className="trainer-question-footer">
                            <span className="question-hint">
                              Pertanyaan akan dibuka melalui WhatsApp.
                            </span>
                            <a
                              href={trainerWaHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-whatsapp-action faq-send-btn"
                              onClick={handleSendTrainerQuestion}
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                              </svg>
                              <span>
                                Tanyakan kepada Trainer
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrainingModule;