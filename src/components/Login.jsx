import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import JarvisAssistant from "../components/JarvisAssistant";
import ikigaiLobbyImg from "../assets/ikigai-lobby.png";

// Jika gambar disimpan di folder src/assets, Anda bisa un-comment baris bawah ini:
// import ikigaiLobbyImg from "../assets/ikigai-lobby.png";

// Inline Icons (Minimalis & Elegan)
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const Login = () => {
  const { login } = useAuth();

  const [inputCode, setInputCode]   = useState("");
  const [showCode, setShowCode]     = useState(false);
  const [error, setError]           = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanUser, setScanUser]     = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanCode = inputCode.trim().toUpperCase();

    if (!cleanCode) {
      setError("Masukkan kode akses Anda.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Login divalidasi oleh Cloud Function sebelum token sesi diterbitkan.
      const freshUser = await login({ kode: cleanCode });

      // Tampilkan overlay verifikasi akun.
      setScanUser(freshUser);
      setIsLoading(false);
      setIsScanning(true);

      setTimeout(() => {
        // ── FIX: Hentikan suara Ikibot/Jarvis sebelum berpindah halaman.
        // Ini pengaman kedua di luar cleanup useEffect di JarvisAssistant —
        // memastikan suara benar-benar berhenti tepat saat proses redirect
        // dimulai, tidak menunggu unmount React selesai diproses.
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        setIsScanning(false);
      }, 3200);

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      const knownMessages = {
        "Akun tidak ditemukan."                          : "Kode akses tidak terdaftar.",
        "Akun kamu telah dinonaktifkan. Hubungi admin." : "Akun dinonaktifkan. Silakan hubungi HRD.",
        "Data user tidak valid."                        : "Data akun tidak valid.",
      };

      setError(knownMessages[err.message] || "Gagal terhubung. Coba beberapa saat lagi.");
      setIsLoading(false);
      setIsScanning(false);
      setScanUser(null);
    }
  };

  return (
    <div className="login-page">
    <div className="ikigai-login-wrapper">
      {/* Visual Header Atas dengan Background Image Lobby IKIGAI Transparan 35% */}
      <div 
        className="login-hero-header"
        style={{
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Gambar Interior IKIGAI (Transparansi 35%) */}
        <img
          src={ikigaiLobbyImg} // Ganti path ini sesuai posisi simpan gambar Anda (misal: /ikigai-lobby.jpg di public folder)
          alt="IKIGAI Lobby Header"
          className="hero-bg-image"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 0.15, // Transparansi 35% (Rentang 30% - 40%)
            zIndex: 0,
            pointerEvents: "none"
          }}
        />

        {/* Dynamic Dark Gradient Overlay */}
        <div 
          className="hero-overlay"
          style={{
            position: "relative",
            zIndex: 1
          }}
        ></div>

        {/* Content Header */}
        <div 
          className="hero-content"
          style={{
            position: "relative",
            zIndex: 2
          }}
        >
          <span className="brand-tag">IKIGAI TRAINING CENTER</span>
          <h1 className="hero-title">Selamat Datang</h1>
          <p className="hero-subtitle">
            Masukkan kode akses Anda untuk masuk ke dalam portal training.
          </p>
        </div>
      </div>

      {/* Sheet Form Melengkung */}
      <div className="login-sheet-card">
        <form onSubmit={handleLogin} className="ikigai-form">
          <div className="form-group">
            <label htmlFor="kodeKaryawan" className="input-label">
              Kode Akses
            </label>
            
            <div className="pill-input-container">
              <input
                id="kodeKaryawan"
                type={showCode ? "text" : "password"}
                placeholder="Masukkan kode akses"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value.toUpperCase());
                  if (error) setError("");
                }}
                autoComplete="off"
                disabled={isLoading || isScanning}
                className="pill-input"
              />
              <button
                type="button"
                className="pill-toggle-btn"
                onClick={() => setShowCode(!showCode)}
                disabled={isLoading || isScanning}
                tabIndex="-1"
              >
                {showCode ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {error && <p className="error-message">{error}</p>}
          </div>

          {/* Tombol Utama (Solid Emerald Pill) */}
          <button
            type="submit"
            className="btn-emerald-primary"
            disabled={isLoading || isScanning}
          >
            {isLoading ? (
              <span className="btn-loading flex-center">
                <span className="spinner-emerald"></span> Memverifikasi...
              </span>
            ) : (
              "Masuk"
            )}
          </button>

          {/* Tombol Sekunder (Outline Emerald Pill) */}
          <a
            href="https://wa.me/6285624892864?text=Halo%20HRD%20IKIGAI%2C%20saya%20butuh%20bantuan%20untuk%20mendapatkan%20kode%20akses%20portal%20training."
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-emerald-outline ${
              isLoading || isScanning ? "btn-disabled-link" : ""
            }`}
            onClick={(e) => {
              if (isLoading || isScanning) {
                e.preventDefault();
              }
            }}
          >
            Hubungi HR Team
          </a>

          {/* Footer Info & Versi App */}
          <div className="login-footer-info">
            <p className="app-version">Versi Portal 2.4.0 (IKIGAI System)</p>
            <p className="terms-text">
              Dengan masuk, Anda menyetujui ketentuan penggunaan sistem training internal IKIGAI.
            </p>
          </div>
        </form>
      </div>

      {/* Overlay Scanning / Verifikasi Elegan (Luxury Emerald) */}
      {isScanning && scanUser && (
        <div className="emerald-overlay">
          <div className="emerald-hud-card">
            <div className="user-avatar-circle">
              {scanUser?.nama?.charAt(0)?.toUpperCase() || "I"}
            </div>
            
            <span className="verifying-tag">AKUN TERVERIFIKASI</span>
            <h3 className="user-welcome-name">{scanUser?.nama || "Karyawan IKIGAI"}</h3>
            <p className="user-sub-info">{scanUser?.divisi || "Outlet IKIGAI"} • {scanUser?.role || "Team"}</p>

            <div className="emerald-progress-track">
              <div className="emerald-progress-bar"></div>
            </div>
            <p className="status-text-overlay">Menyiapkan modul training Anda...</p>
          </div>
        </div>
      )}

      <JarvisAssistant />
    </div>
    </div>
  );
};

export default Login;
