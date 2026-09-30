// components/LogoutConfirmDialog.jsx

import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

/* =========================================================
   TONES — tambah varian baru cukup dengan menambah entri di sini
========================================================= */

const TONES = {
  danger: {
    icon: "#dc2626",
    iconBg: "#fef2f2",
    iconRing: "#fecaca",
    button: "#dc2626",
    buttonHover: "#b91c1c",
    buttonShadow: "rgba(220, 38, 38, 0.28)",
  },
  warning: {
    icon: "#b45309",
    iconBg: "#fffbeb",
    iconRing: "#fde68a",
    button: "#d97706",
    buttonHover: "#b45309",
    buttonShadow: "rgba(217, 119, 6, 0.28)",
  },
  primary: {
    icon: "#0f6b4f",
    iconBg: "#ecfdf5",
    iconRing: "#a7f3d0",
    button: "#0f6b4f",
    buttonHover: "#0b5a43",
    buttonShadow: "rgba(15, 107, 79, 0.28)",
  },
};

/* =========================================================
   STYLES
   Dirender langsung di dalam dialog (bukan disisipkan ke <head>),
   jadi gaya selalu ada selama dialog tampil dan tidak bisa hilang
   ketika komponen lain di-unmount.
   Semua selector diawali ".lcd-overlay" agar menang atas CSS global
   (mis. aturan button/h2/p milik aplikasi).
========================================================= */

const STYLES = `
.lcd-overlay {
  --lcd-text: #14302a;
  --lcd-text-2: #5a6e67;
  --lcd-text-3: #8a9994;
  --lcd-line: #e3eae7;
  --lcd-line-strong: #cbd8d2;

  position: fixed;
  inset: 0;
  z-index: 99997;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(8, 20, 17, 0.55);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  animation: lcd-fade 160ms ease-out;
}
.lcd-overlay *,
.lcd-overlay *::before,
.lcd-overlay *::after { box-sizing: border-box; }

/* ── Dialog ── */
.lcd-overlay .lcd-dialog {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 26px 24px 22px;
  background: #fff;
  color: var(--lcd-text);
  text-align: left;
  border: 1px solid var(--lcd-line);
  border-radius: 24px;
  box-shadow: 0 30px 70px rgba(8, 20, 17, 0.28), 0 6px 18px rgba(8, 20, 17, 0.1);
  font-family: inherit;
  animation: lcd-pop 220ms cubic-bezier(.16, 1, .3, 1);
}

.lcd-overlay .lcd-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--lcd-text-3);
  cursor: pointer;
  transition: background .15s, color .15s;
}
.lcd-overlay .lcd-close:hover { background: #f1f5f3; color: var(--lcd-text); }

/* ── Header ── */
.lcd-overlay .lcd-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding-right: 30px;
}
.lcd-overlay .lcd-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: var(--lcd-icon-bg);
  color: var(--lcd-icon);
  box-shadow: 0 0 0 6px var(--lcd-icon-ring);
  margin: 6px 6px 4px;
}
.lcd-overlay .lcd-title {
  margin: 0;
  font-size: 20px;
  line-height: 1.3;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--lcd-text);
}
.lcd-overlay .lcd-desc {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.55;
  font-weight: 400;
  color: var(--lcd-text-2);
}

/* ── Catatan ── */
.lcd-overlay .lcd-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 20px 0 0;
  padding: 12px 14px;
  border: 1px solid #d6ebe2;
  border-radius: 14px;
  background: #f3fbf7;
  color: #3f5c52;
  font-size: 12.5px;
  line-height: 1.55;
}
.lcd-overlay .lcd-note svg { flex: 0 0 auto; margin-top: 1px; color: #13906e; }
.lcd-overlay .lcd-note p { margin: 0; font-size: inherit; line-height: inherit; color: inherit; }

/* ── Tombol ── */
.lcd-overlay .lcd-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 22px;
}
.lcd-overlay .lcd-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  margin: 0;
  padding: 0 18px;
  border-radius: 14px;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: background .15s, border-color .15s, box-shadow .15s, transform .1s, opacity .15s;
}
.lcd-overlay .lcd-btn:active:not(:disabled) { transform: scale(0.98); }
.lcd-overlay .lcd-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.lcd-overlay .lcd-btn-secondary {
  background: #fff;
  color: #3d524b;
  border: 1px solid var(--lcd-line-strong);
}
.lcd-overlay .lcd-btn-secondary:hover:not(:disabled) { background: #f6f9f8; border-color: #aec2b9; }

.lcd-overlay .lcd-btn-confirm {
  background: var(--lcd-btn);
  color: #fff;
  border: 1px solid transparent;
  box-shadow: 0 6px 16px var(--lcd-btn-shadow);
}
.lcd-overlay .lcd-btn-confirm:hover:not(:disabled) { background: var(--lcd-btn-hover); }

.lcd-overlay .lcd-spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: lcd-spin 0.7s linear infinite;
}

.lcd-overlay .lcd-hint {
  margin: 14px 0 0;
  text-align: center;
  font-size: 11.5px;
  color: var(--lcd-text-3);
}

/* ── Fokus ── */
.lcd-overlay button:focus-visible { outline: 2px solid #16a37f; outline-offset: 2px; }
.lcd-overlay button:focus:not(:focus-visible) { outline: none; }

/* ── Animasi ── */
@keyframes lcd-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes lcd-pop {
  from { opacity: 0; transform: translateY(10px) scale(0.97); }
  to   { opacity: 1; transform: none; }
}
@keyframes lcd-sheet {
  from { transform: translateY(100%); }
  to   { transform: none; }
}
@keyframes lcd-spin { to { transform: rotate(360deg); } }

/* ── Mobile: bottom sheet ── */
@media (max-width: 520px) {
  .lcd-overlay { align-items: flex-end; padding: 0; }
  .lcd-overlay .lcd-dialog {
    max-width: none;
    padding: 10px 20px calc(20px + env(safe-area-inset-bottom, 0px));
    border-radius: 26px 26px 0 0;
    border-width: 1px 0 0;
    animation: lcd-sheet 260ms cubic-bezier(.16, 1, .3, 1);
  }
  .lcd-overlay .lcd-dialog::before {
    content: "";
    display: block;
    width: 40px;
    height: 4px;
    margin: 0 auto 18px;
    border-radius: 999px;
    background: #d5dfda;
  }
  .lcd-overlay .lcd-close { top: 18px; right: 14px; }
  .lcd-overlay .lcd-header { flex-direction: row; align-items: flex-start; gap: 14px; }
  .lcd-overlay .lcd-icon { flex: 0 0 46px; width: 46px; height: 46px; border-radius: 14px; margin: 3px 3px 0; box-shadow: 0 0 0 4px var(--lcd-icon-ring); }
  .lcd-overlay .lcd-title { font-size: 18px; }
  .lcd-overlay .lcd-desc { font-size: 13.5px; }
  .lcd-overlay .lcd-actions { grid-template-columns: 1fr; }
  .lcd-overlay .lcd-btn-confirm { order: 1; min-height: 50px; }
  .lcd-overlay .lcd-btn-secondary { order: 2; min-height: 48px; }
  .lcd-overlay .lcd-hint { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .lcd-overlay,
  .lcd-overlay .lcd-dialog,
  .lcd-overlay .lcd-spinner { animation: none; }
  .lcd-overlay .lcd-btn,
  .lcd-overlay .lcd-close { transition: none; }
}
`;

/* =========================================================
   ICONS
========================================================= */

const svgProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const LogoutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" {...svgProps}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...svgProps}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...svgProps}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* =========================================================
   SCROLL LOCK — aman bila ada lebih dari satu dialog terbuka
========================================================= */

let lockCount = 0;
let savedOverflow = "";
let savedPaddingRight = "";

const lockScroll = () => {
  if (lockCount === 0) {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    savedOverflow = document.body.style.overflow;
    savedPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
  }
  lockCount += 1;
};

const unlockScroll = () => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow;
    document.body.style.paddingRight = savedPaddingRight;
  }
};

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* =========================================================
   COMPONENT
========================================================= */

export default function LogoutConfirmDialog({
  show,
  onConfirm,
  onCancel,

  title = "Keluar dari akun?",
  description = "Sesi training di perangkat ini akan diakhiri.",
  note = "Progres modul dan riwayat kuis Anda sudah tersimpan. Anda dapat kembali kapan saja.",

  confirmLabel = "Ya, Keluar",
  cancelLabel = "Batal",

  tone = "danger",
  Icon = LogoutIcon,

  loading = false, // true: tombol dikunci + spinner (mis. saat proses logout)
  closeOnOverlay = true, // klik area gelap untuk menutup
  showClose = true, // tampilkan tombol X
  initialFocus = "cancel", // "cancel" (aman untuk aksi destruktif) | "confirm"
}) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);

  // Simpan callback & status terbaru di ref supaya efek di bawah TIDAK
  // dijalankan ulang tiap render (onCancel inline = referensi baru setiap render,
  // yang sebelumnya membuat fokus dan scroll-lock di-reset terus).
  const onCancelRef = useRef(onCancel);
  const loadingRef = useRef(loading);
  onCancelRef.current = onCancel;
  loadingRef.current = loading;

  const theme = TONES[tone] || TONES.danger;

  useEffect(() => {
    if (!show) return undefined;

    const previousFocus = document.activeElement;
    lockScroll();

    const raf = requestAnimationFrame(() => {
      (initialFocus === "confirm" ? confirmRef : cancelRef).current?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (loadingRef.current) return;
        event.preventDefault();
        onCancelRef.current?.();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const items = dialogRef.current.querySelectorAll(FOCUSABLE);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", handleKeyDown);
      unlockScroll();
      previousFocus?.focus?.();
    };
  }, [show, initialFocus]);

  if (!show || typeof document === "undefined") return null;

  const handleOverlayMouseDown = (event) => {
    if (closeOnOverlay && !loading && event.target === event.currentTarget) {
      onCancel?.();
    }
  };

  return createPortal(
    <div className="lcd-overlay" onMouseDown={handleOverlayMouseDown}>
      <style>{STYLES}</style>

      <section
        ref={dialogRef}
        className="lcd-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        aria-busy={loading || undefined}
        style={{
          "--lcd-icon": theme.icon,
          "--lcd-icon-bg": theme.iconBg,
          "--lcd-icon-ring": theme.iconRing,
          "--lcd-btn": theme.button,
          "--lcd-btn-hover": theme.buttonHover,
          "--lcd-btn-shadow": theme.buttonShadow,
        }}
      >
        {showClose && (
          <button
            type="button"
            className="lcd-close"
            onClick={onCancel}
            disabled={loading}
            aria-label="Tutup dialog"
          >
            <CloseIcon />
          </button>
        )}

        <div className="lcd-header">
          <div className="lcd-icon" aria-hidden="true">
            <Icon />
          </div>
          <div>
            <h2 id={titleId} className="lcd-title">{title}</h2>
            <p id={descId} className="lcd-desc">{description}</p>
          </div>
        </div>

        {note && (
          <div className="lcd-note">
            <InfoIcon />
            <p>{note}</p>
          </div>
        )}

        <div className="lcd-actions">
          <button
            ref={cancelRef}
            type="button"
            className="lcd-btn lcd-btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className="lcd-btn lcd-btn-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <span className="lcd-spinner" aria-hidden="true" />}
            {loading ? "Memproses..." : confirmLabel}
          </button>
        </div>

        <p className="lcd-hint">Tekan Esc untuk membatalkan</p>
      </section>
    </div>,
    document.body
  );
}