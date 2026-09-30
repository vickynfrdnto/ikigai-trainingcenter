// components/AchievementToast.jsx
// Shown for ~4.5 seconds after a quiz is passed.
// Self-contained: manages its own confetti canvas and auto-dismiss timer.

import { useEffect, useRef } from "react";

/* ── Confetti Engine (IKIGAI Emerald & Gold Luxury Palette) ── */
function spawnConfetti(canvas) {
  const ctx    = canvas.getContext("2d");
  const W      = canvas.width  = window.innerWidth;
  const H      = canvas.height = window.innerHeight;
  
  // Palette warna khas IKIGAI: Deep Emerald, Mint, Luxury Gold, & Cream White
  const COLORS = ["#059669", "#10b981", "#34d399", "#a7f3d0", "#f59e0b", "#fbbf24", "#ffffff"];
  const COUNT  = 130;

  const particles = Array.from({ length: COUNT }, () => ({
    x:    Math.random() * W,
    y:    Math.random() * H * 0.35 - 20,
    r:    Math.random() * 6 + 3,
    d:    Math.random() * COUNT,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    tilt:  Math.random() * 10 - 10,
    tiltAngle: 0,
    tiltAngleIncremental: Math.random() * 0.07 + 0.05,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 2.2 + 1.2,
    alpha: 1,
  }));

  let raf;
  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.ellipse(p.x, p.y, p.r, p.r / 2, p.tilt, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function update() {
    frame++;
    particles.forEach((p) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.x  += p.vx + Math.cos(frame / 20) * 0.5;
      p.y  += p.vy;
      p.tilt = Math.sin(p.tiltAngle) * 12;
      if (frame > 70) p.alpha -= 0.012;
    });
  }

  function loop() {
    draw();
    update();
    if (frame < 170) {
      raf = requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  }

  loop();
  return () => cancelAnimationFrame(raf);
}

/* ── Grade Helper ── */
function getGrade(score) {
  if (score >= 90) {
    return {
      label: "A+",
      title: "SEMPURNA!",
      subtitle: "Kinerja Luar Biasa",
      color: "#10b981",
      badgeBg: "rgba(16, 185, 129, 0.15)",
    };
  }
  if (score >= 80) {
    return {
      label: "A",
      title: "LUAR BIASA!",
      subtitle: "Sangat Memuaskan",
      color: "#059669",
      badgeBg: "rgba(5, 150, 105, 0.15)",
    };
  }
  if (score >= 70) {
    return {
      label: "B",
      title: "SANGAT BAGUS!",
      subtitle: "Lulus Evaluasi Modul",
      color: "#0284c7",
      badgeBg: "rgba(2, 132, 199, 0.15)",
    };
  }
  return {
    label: "C",
    title: "LULUS!",
    subtitle: "Kompeten dalam Materi",
    color: "#d97706",
    badgeBg: "rgba(217, 119, 6, 0.15)",
  };
}

/* ── Inline SVG Icons ── */
const TrophyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function AchievementToast({ show, score = 100, title = "", onDone }) {
  const canvasRef = useRef(null);
  const timerRef  = useRef(null);

  useEffect(() => {
    if (!show) return;

    let stopConfetti;
    if (canvasRef.current) {
      stopConfetti = spawnConfetti(canvasRef.current);
    }

    /* Auto dismiss after 4.5 seconds */
    timerRef.current = setTimeout(() => {
      onDone?.();
    }, 4500);

    return () => {
      stopConfetti?.();
      clearTimeout(timerRef.current);
    };
  }, [show, onDone]);

  if (!show) return null;

  const grade = getGrade(score);

  return (
    <>
      {/* Full-screen Confetti Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />

      {/* Mobile-Friendly Backdrop */}
      <div
        className="emerald-achievement-backdrop"
        onClick={() => onDone?.()}
      >
        <style>{`
          .emerald-achievement-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(2, 44, 34, 0.72);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.3s ease-out forwards;
          }

          .emerald-achievement-card {
            position: relative;
            width: 100%;
            max-width: 360px;
            background: linear-gradient(165deg, #064e3b 0%, #042f2e 100%);
            border: 1px solid rgba(167, 243, 208, 0.25);
            border-radius: 28px;
            padding: 32px 24px 24px;
            box-shadow: 
              0 25px 50px -12px rgba(0, 0, 0, 0.5),
              0 0 30px rgba(5, 150, 105, 0.25);
            text-align: center;
            color: #ffffff;
            overflow: hidden;
            animation: cardPopIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-sizing: border-box;
          }

          .card-top-shine {
            position: absolute;
            top: 0;
            left: 10%;
            right: 10%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #34d399, #fbbf24, transparent);
          }

          .achievement-header-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 5px 14px;
            border-radius: 20px;
            font-size: 0.725rem;
            font-weight: 700;
            color: #a7f3d0;
            letter-spacing: 0.5px;
            margin-bottom: 20px;
          }

          .grade-circle-container {
            position: relative;
            width: 90px;
            height: 90px;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .grade-circle-bg {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border: 2.5px solid ${grade.color};
            background: ${grade.badgeBg};
            box-shadow: 0 0 20px ${grade.color}40;
            animation: pulseGlow 2s ease-in-out infinite;
          }

          .grade-text {
            font-size: 2.5rem;
            font-weight: 800;
            color: #ffffff;
            position: relative;
            z-index: 2;
            line-height: 1;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
          }

          .achievement-title-text {
            font-size: 1.25rem;
            font-weight: 800;
            color: #ffffff;
            margin: 0 0 2px 0;
            letter-spacing: -0.2px;
          }

          .achievement-subtitle-text {
            font-size: 0.8rem;
            color: #a7f3d0;
            font-weight: 600;
            margin: 0 0 16px 0;
          }

          .score-detail-box {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 12px 16px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .score-box-left {
            text-align: left;
            min-width: 0;
            padding-right: 12px;
          }

          .module-title-sub {
            font-size: 0.775rem;
            color: #d1fae5;
            font-weight: 600;
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 190px;
          }

          .eval-label {
            font-size: 0.68rem;
            color: rgba(255, 255, 255, 0.6);
            margin: 2px 0 0 0;
          }

          .score-number-pill {
            background: ${grade.color};
            color: #ffffff;
            font-size: 1.1rem;
            font-weight: 800;
            padding: 6px 12px;
            border-radius: 12px;
            box-shadow: 0 2px 8px ${grade.color}50;
            flex-shrink: 0;
          }

          .btn-achievement-continue {
            width: 100%;
            height: 48px;
            background: #ffffff;
            color: #064e3b;
            border: none;
            border-radius: 9999px;
            font-size: 0.925rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
          }

          .btn-achievement-continue:hover {
            background: #ecfdf5;
            transform: translateY(-1px);
          }

          .dismiss-hint {
            font-size: 0.725rem;
            color: rgba(255, 255, 255, 0.5);
            margin-top: 12px;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes cardPopIn {
            from { opacity: 0; transform: scale(0.85) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }

          @keyframes pulseGlow {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.05); opacity: 1; }
          }
        `}</style>

        <div
          className="emerald-achievement-card"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="card-top-shine"></div>

          {/* Top Header Badge */}
          <div className="achievement-header-pill">
            <TrophyIcon />
            <span>MODUL EVALUATION PASSED</span>
          </div>

          {/* Grade Circle */}
          <div className="grade-circle-container">
            <div className="grade-circle-bg"></div>
            <span className="grade-text">{grade.label}</span>
          </div>

          {/* Title & Subtitle */}
          <h2 className="achievement-title-text">{grade.title}</h2>
          <p className="achievement-subtitle-text">{grade.subtitle}</p>

          {/* Module Detail & Score Box */}
          <div className="score-detail-box">
            <div className="score-box-left">
              <p className="module-title-sub">{title || "Modul Training"}</p>
              <p className="eval-label">Evaluasi Kuis Lulus</p>
            </div>
            <div className="score-number-pill">
              {score}%
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            type="button"
            className="btn-achievement-continue"
            onClick={() => onDone?.()}
          >
            <span>Lanjutkan Belajar</span>
            <ArrowRightIcon />
          </button>

          <p className="dismiss-hint">Otomatis menutup dalam beberapa detik...</p>
        </div>
      </div>
    </>
  );
}