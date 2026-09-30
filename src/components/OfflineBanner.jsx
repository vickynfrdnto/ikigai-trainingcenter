// components/OfflineBanner.jsx
// IKIGAI EMERALD LUXURY EDITION (STICKY OFFLINE BANNER)

import React from "react";

export default function OfflineBanner({ isOnline, isFirebaseConnected }) {
  const show = !isOnline || !isFirebaseConnected;
  if (!show) return null;

  const isOffline = !isOnline;
  const message = isOffline
    ? "Tidak ada koneksi internet. Progres kuis & modul tidak akan tersimpan."
    : "Koneksi ke server IKIGAI terputus. Mencoba menghubungkan kembali…";

  // Tema warna dinamis: Merah Coral untuk Offline, Emas/Amber untuk Reconnecting
  const themeColor = isOffline ? "#f87171" : "#fbbf24";
  const themeBg = isOffline ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)";
  const themeBorder = isOffline ? "rgba(248, 113, 113, 0.35)" : "rgba(251, 191, 36, 0.35)";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100000,
        background: "rgba(2, 44, 34, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${themeBorder}`,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        boxShadow: "0 6px 24px rgba(0, 0, 0, 0.4)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        animation: "slideDownOB 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      <style>{`
        @keyframes slideDownOB {
          from { transform: translateY(-100%); }
          to   { transform: translateY(0); }
        }
        @keyframes spinSlowOB {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* Badge Icon (Wi-Fi Off atau Spinner Reconnecting) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          background: themeBg,
          border: `1px solid ${themeBorder}`,
          color: themeColor,
          flexShrink: 0,
        }}
      >
        {isOffline ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: "spinSlowOB 1.2s linear infinite" }}
          >
            <path d="M21.5 2v6h-6" />
            <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        )}
      </div>

      {/* Label Status & Pesan Informatif */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        <span
          style={{
            fontSize: "0.68rem",
            fontWeight: "800",
            letterSpacing: "0.8px",
            color: themeColor,
            textTransform: "uppercase",
            background: themeBg,
            padding: "2px 8px",
            borderRadius: "12px",
            border: `1px solid ${themeBorder}`,
          }}
        >
          {isOffline ? "OFFLINE" : "RECONNECTING"}
        </span>

        <span
          style={{
            fontSize: "0.775rem",
            fontWeight: "600",
            color: "#ffffff",
            lineHeight: "1.3",
            textAlign: "center",
          }}
        >
          {message}
        </span>
      </div>
    </div>
  );
}