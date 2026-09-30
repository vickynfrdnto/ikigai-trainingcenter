import { useEffect, useState, useRef } from "react";

const FULL_TEXT =
  "Halo, selamat datang di Ikigai Training Center. Perkenalkan aku Ikibot, Virtual Assistant Ikigai. Silahkan masukkan kode akses yang sudah dibagikan oleh Ibu Muty.";

/* ── Inline SVG Icons ── */
const IconBot = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" strokeWidth="3" />
    <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" />
  </svg>
);

const IconVolume = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const IconVolumeMute = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const IconRefresh = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IkibotAssistant = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isAwake, setIsAwake] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const typingInterval = useRef(null);
  const hasStarted = useRef(false);
  const indexRef = useRef(0);
  const synth = useRef(window.speechSynthesis);

  const bootSound = useRef(null);
  const humSound = useRef(null);

  useEffect(() => {
    bootSound.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");
    humSound.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3");
    humSound.current.loop = true;
    humSound.current.volume = 0.12;
  }, []);

  // ── FIX: Cleanup saat komponen ini di-unmount (misalnya setelah login
  // sukses dan parent berpindah dari <Login/> ke halaman lain). Tanpa ini,
  // window.speechSynthesis dan objek Audio() tetap berjalan di background
  // karena keduanya adalah Web API global yang TIDAK otomatis berhenti
  // hanya karena komponen React-nya hilang dari tree.
  useEffect(() => {
    return () => {
      synth.current?.cancel();

      humSound.current?.pause();
      if (humSound.current) humSound.current.currentTime = 0;

      bootSound.current?.pause();
      if (bootSound.current) bootSound.current.currentTime = 0;

      if (typingInterval.current) clearInterval(typingInterval.current);
    };
  }, []);

  const startTyping = () => {
    if (typingInterval.current) clearInterval(typingInterval.current);
    indexRef.current = 0;
    setDisplayedText("");

    const speed = 55;
    typingInterval.current = setInterval(() => {
      indexRef.current++;
      setDisplayedText(FULL_TEXT.slice(0, indexRef.current));
      if (indexRef.current >= FULL_TEXT.length) clearInterval(typingInterval.current);
    }, speed);
  };

  const speak = (force = false) => {
    if (hasStarted.current && !force) return;
    hasStarted.current = true;

    synth.current.cancel();
    if (isMuted) {
      startTyping();
      return;
    }

    const msg = new SpeechSynthesisUtterance(FULL_TEXT);
    const voices = synth.current.getVoices();
    const idVoice = voices.find((v) => v.lang.includes("id"));

    if (idVoice) msg.voice = idVoice;
    msg.lang = "id-ID";
    msg.rate = 1.0;
    msg.pitch = 1.25;

    msg.onstart = () => {
      setSpeaking(true);
      if (!isMuted) humSound.current?.play().catch(() => {});
      startTyping();
    };

    msg.onend = () => {
      setSpeaking(false);
      humSound.current?.pause();
    };

    synth.current.speak(msg);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (isMuted) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
      synth.current.cancel();
      humSound.current?.pause();
      setSpeaking(false);
    }
  };

  const replaySpeech = (e) => {
    e.stopPropagation();
    setIsMinimized(false);
    speak(true);
  };

  useEffect(() => {
    const startSystem = () => {
      setIsAwake(true);
      bootSound.current?.play().catch(() => {});
      setTimeout(() => speak(), 800);
      window.removeEventListener("click", startSystem);
      window.removeEventListener("touchstart", startSystem);
    };

    window.addEventListener("click", startSystem);
    window.addEventListener("touchstart", startSystem);

    return () => {
      if (typingInterval.current) clearInterval(typingInterval.current);
      window.removeEventListener("click", startSystem);
      window.removeEventListener("touchstart", startSystem);
    };
  }, [isMuted]);

  useEffect(() => {
    const move = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setCursor({
        x: (clientX / window.innerWidth - 0.5) * 10,
        y: (clientY / window.innerHeight - 0.5) * 8,
      });
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);

    const blinkCycle = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 4200);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      clearInterval(blinkCycle);
    };
  }, []);

  return (
    <div className={`ikibot-emerald-anchor ${isAwake ? "is-awake" : ""}`}>
      <style>{`
        /* ==========================================================================
           IKIBOT ASSISTANT (EMERALD LUXURY MOBILE & DESKTOP STYLES)
           ========================================================================== */

        .ikibot-emerald-anchor {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9995;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          max-width: calc(100vw - 32px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Card Dialogue Glassmorphism */
        .ikibot-dialog-card {
          width: 320px;
          max-width: 88vw;
          background: linear-gradient(165deg, rgba(6, 78, 59, 0.95) 0%, rgba(4, 47, 46, 0.96) 100%);
          border: 1px solid rgba(167, 243, 208, 0.3);
          border-radius: 20px;
          padding: 16px;
          color: #ffffff;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(5, 150, 105, 0.2);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: bottom right;
          overflow: hidden;
        }

        .ikibot-dialog-card.minimized {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
          pointer-events: none;
          height: 0;
          padding: 0;
          margin: 0;
          border: none;
        }

        /* Header Card */
        .ikibot-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          margin-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .ikibot-badge-status {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot-emerald {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px #10b981;
        }

        .status-dot-emerald.transmitting {
          animation: pulseEmerald 1.2s ease-in-out infinite;
          background: #34d399;
        }

        .status-title-text {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #a7f3d0;
          text-transform: uppercase;
        }

        .ikibot-action-tools {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tool-icon-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #d1fae5;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tool-icon-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        /* Text Body */
        .ikibot-card-body {
          font-size: 0.825rem;
          line-height: 1.5;
          color: #f0fdf4;
          margin-bottom: 10px;
          min-height: 48px;
        }

        .typed-cursor {
          display: inline-block;
          font-weight: 800;
          color: #34d399;
          animation: blinkCursor 0.8s infinite;
          margin-left: 2px;
        }

        /* Voice Waves Equalizer */
        .ikibot-sound-wave {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 14px;
        }

        .wave-bar-emerald {
          width: 3px;
          height: 100%;
          background: #34d399;
          border-radius: 4px;
        }

        .wave-bar-emerald.animating {
          animation: waveBounce 0.8s ease-in-out infinite alternate;
        }

        .wave-bar-emerald:nth-child(1) { animation-delay: 0.1s; }
        .wave-bar-emerald:nth-child(2) { animation-delay: 0.3s; }
        .wave-bar-emerald:nth-child(3) { animation-delay: 0.2s; }
        .wave-bar-emerald:nth-child(4) { animation-delay: 0.4s; }

        /* Floating Avatar Circle Button */
        .ikibot-avatar-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #064e3b 0%, #042f2e 100%);
          border: 1.5px solid rgba(167, 243, 208, 0.4);
          border-radius: 9999px;
          padding: 6px 14px 6px 6px;
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.3),
            0 0 15px rgba(16, 185, 129, 0.25);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .ikibot-avatar-trigger:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 14px 30px rgba(0, 0, 0, 0.4),
            0 0 22px rgba(16, 185, 129, 0.4);
        }

        .avatar-eye-unit {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(2, 44, 34, 0.9);
          border: 1.5px solid #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          color: #a7f3d0;
          overflow: hidden;
        }

        .bot-pupils {
          display: flex;
          gap: 5px;
          align-items: center;
        }

        .bot-pupil-dot {
          width: 5px;
          height: 5px;
          background: #34d399;
          border-radius: 50%;
          box-shadow: 0 0 6px #34d399;
          transition: transform 0.1s ease-out, height 0.1s ease;
        }

        .bot-pupil-dot.blinking {
          height: 1px;
        }

        .trigger-label-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .trigger-name {
          font-size: 0.775rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }

        .trigger-sub {
          font-size: 0.65rem;
          color: #a7f3d0;
          font-weight: 600;
          margin-top: 2px;
        }

        /* Animations */
        @keyframes pulseEmerald {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        @keyframes waveBounce {
          0% { height: 20%; }
          100% { height: 100%; }
        }

        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Mobile Adjustments */
        @media (max-width: 480px) {
          .ikibot-emerald-anchor {
            bottom: 16px;
            right: 16px;
          }

          .ikibot-dialog-card {
            width: calc(100vw - 32px);
          }
        }
      `}</style>

      {/* Bubble Dialogue Box */}
      <div className={`ikibot-dialog-card ${isMinimized ? "minimized" : ""}`}>
        <div className="ikibot-card-header">
          <div className="ikibot-badge-status">
            <div className={`status-dot-emerald ${speaking ? "transmitting" : ""}`} />
            <span className="status-title-text">
              {speaking ? "Ikibot Berbicara..." : "IKIBOT ASSISTANT"}
            </span>
          </div>

          <div className="ikibot-action-tools">
            {speaking && (
              <div className="ikibot-sound-wave" style={{ marginRight: 6 }}>
                <div className="wave-bar-emerald animating" />
                <div className="wave-bar-emerald animating" />
                <div className="wave-bar-emerald animating" />
                <div className="wave-bar-emerald animating" />
              </div>
            )}

            <button
              type="button"
              className="tool-icon-btn"
              onClick={replaySpeech}
              title="Ulangi Suara"
            >
              <IconRefresh />
            </button>

            <button
              type="button"
              className="tool-icon-btn"
              onClick={toggleMute}
              title={isMuted ? "Aktifkan Suara" : "Mute Suara"}
            >
              {isMuted ? <IconVolumeMute /> : <IconVolume />}
            </button>

            <button
              type="button"
              className="tool-icon-btn"
              onClick={() => setIsMinimized(true)}
              title="Sembunyikan"
            >
              <IconChevronDown />
            </button>
          </div>
        </div>

        <div className="ikibot-card-body">
          {displayedText}
          <span className="typed-cursor">|</span>
        </div>
      </div>

      {/* Floating Trigger Circle */}
      <div
        className="ikibot-avatar-trigger"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="avatar-eye-unit">
          <div className="bot-pupils">
            <div
              className={`bot-pupil-dot ${isBlinking ? "blinking" : ""}`}
              style={{ transform: `translate(${cursor.x * 0.4}px, ${cursor.y * 0.4}px)` }}
            />
            <div
              className={`bot-pupil-dot ${isBlinking ? "blinking" : ""}`}
              style={{ transform: `translate(${cursor.x * 0.4}px, ${cursor.y * 0.4}px)` }}
            />
          </div>
        </div>

        <div className="trigger-label-wrap">
          <span className="trigger-name">IKIBOT AI</span>
          <span className="trigger-sub">
            {isMinimized ? "Buka Asisten" : "Sembunyikan"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IkibotAssistant;