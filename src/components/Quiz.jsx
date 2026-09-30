import React, { useState, useRef } from "react";

// ─── Quiz.jsx (IKIGAI EMERALD LUXURY EDITION) ─────────────────────────────────
// Fixes & Features:
//   ✓ Stale closure bug: score dihitung dari scoreRef (sinkron)
//   ✓ userAnswers selalu array lengkap (panjang = data.length) tanpa sparse holes
//   ✓ finalPercentage dihitung secara presisi
//   ✓ Desain Glassmorphic Emerald Luxury (#064e3b, #34d399, #fbbf24)
// ──────────────────────────────────────────────────────────────────────────────

const Quiz = ({ data = [], onPass, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // ── Use ref for score to avoid stale-closure bug ──
  const scoreRef = useRef(0);
  const answersRef = useRef(Array(data?.length || 0).fill(null));

  if (!data || data.length === 0) {
    return (
      <div style={overlayStyle}>
        <div style={cardStyle}>
          <p style={{ color: "#a7f3d0", textAlign: "center", margin: 0 }}>
            Tidak ada data kuis yang tersedia untuk modul ini.
          </p>
          <button
            type="button"
            onClick={onCancel}
            style={{ ...primaryBtnStyle, marginTop: "20px", width: "100%" }}
          >
            Kembali ke Modul
          </button>
        </div>
      </div>
    );
  }

  const currentQuiz = data[currentStep];

  const handleCheckAnswer = () => {
    if (!selectedOption || isSubmitted) return;

    const correct = selectedOption === currentQuiz.a;
    setIsCorrect(correct);
    setIsSubmitted(true);

    // ── Tulis jawaban ke ref (sinkron, tidak ada stale closure) ──
    answersRef.current[currentStep] = selectedOption;
    if (correct) scoreRef.current += 1;

    setTimeout(() => {
      if (currentStep >= data.length - 1) {
        // Quiz selesai — tampilkan result
        setShowResult(true);
      } else {
        setCurrentStep((prev) => prev + 1);
        setSelectedOption(null);
        setIsSubmitted(false);
        setIsCorrect(null);
      }
    }, 1200);
  };

  // ── Hitung final dari ref (nilai pasti sinkron) ──
  const finalScore = scoreRef.current;
  const finalPercentage = Math.round((finalScore / data.length) * 100);
  const isPassed = finalPercentage >= 60;

  // 🏆 RESULT SCREEN (TAMPILAN HASIL AKHIR)
  if (showResult) {
    return (
      <div style={overlayStyle}>
        <style>{scopedStyles}</style>
        <div
          style={{
            ...cardStyle,
            borderColor: isPassed ? "rgba(52, 211, 153, 0.4)" : "rgba(248, 113, 113, 0.4)",
            boxShadow: isPassed
              ? "0 24px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(52, 211, 153, 0.25)"
              : "0 24px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(239, 68, 68, 0.25)",
          }}
        >
          {/* Top Accent Line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: isPassed
                ? "linear-gradient(90deg, #059669 0%, #34d399 50%, #fbbf24 100%)"
                : "linear-gradient(90deg, #dc2626 0%, #f87171 100%)",
            }}
          />

          {/* Header Status Result */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                margin: "0 auto 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                background: isPassed ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                border: `1px solid ${isPassed ? "rgba(52, 211, 153, 0.3)" : "rgba(248, 113, 113, 0.3)"}`,
                boxShadow: isPassed ? "0 0 20px rgba(52, 211, 153, 0.2)" : "0 0 20px rgba(239, 68, 68, 0.2)",
              }}
            >
              {isPassed ? "🏆" : "⚠️"}
            </div>

            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: "800",
                letterSpacing: "1.5px",
                color: isPassed ? "#fbbf24" : "#f87171",
                textTransform: "uppercase",
                background: isPassed ? "rgba(251, 191, 36, 0.12)" : "rgba(239, 68, 68, 0.12)",
                padding: "3px 12px",
                borderRadius: "20px",
                border: `1px solid ${isPassed ? "rgba(251, 191, 36, 0.25)" : "rgba(239, 68, 68, 0.25)"}`,
              }}
            >
              {isPassed ? "LULUS EVALUASI" : "BELUM LULUS"}
            </span>

            <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#ffffff", margin: "10px 0 0 0" }}>
              {isPassed ? "Kuis Selesai dengan Baik" : "Evaluasi Belum Memenuhi Syarat"}
            </h2>
          </div>

          {/* Stat Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              background: "rgba(0, 0, 0, 0.25)",
              padding: "16px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              marginBottom: "20px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "0.68rem", color: "#a7f3d0", fontWeight: "700", display: "block" }}>
                SKOR AKHIR
              </span>
              <span
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "900",
                  color: isPassed ? "#fbbf24" : "#f87171",
                  lineHeight: "1.2",
                }}
              >
                {finalPercentage}%
              </span>
            </div>

            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "0.68rem", color: "#a7f3d0", fontWeight: "700", display: "block" }}>
                AKURASI JAWABAN
              </span>
              <span style={{ fontSize: "1.8rem", fontWeight: "900", color: "#ffffff", lineHeight: "1.2" }}>
                {finalScore}/{data.length}
              </span>
            </div>
          </div>

          {/* Pesan Keterangan */}
          <p style={{ fontSize: "0.8rem", color: "#a7f3d0", lineHeight: "1.5", textAlign: "center", margin: "0 0 24px 0" }}>
            {isPassed
              ? "Selamat! Nilai evaluasi Anda telah memenuhi standar minimum (60%) dan siap disimpan."
              : "Nilai minimum kelulusan adalah 60%. Silakan tonton kembali video modul dan coba ulang kuis."}
          </p>

          {/* Tombol Aksi Result */}
          <div>
            {isPassed ? (
              <button
                type="button"
                className="ik-btn-hover"
                style={{ ...primaryBtnStyle, width: "100%" }}
                onClick={() => onPass(finalPercentage, answersRef.current)}
              >
                Simpan Progres Kelulusan
              </button>
            ) : (
              <button
                type="button"
                className="ik-btn-hover"
                style={{ ...ghostBtnStyle, width: "100%", borderColor: "#f87171", color: "#f87171" }}
                onClick={onCancel}
              >
                Kembali ke Pelajaran Modul
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 📝 MAIN QUIZ INTERFACE
  return (
    <div style={overlayStyle}>
      <style>{scopedStyles}</style>

      <div
        style={{
          ...cardStyle,
          borderColor: isSubmitted
            ? isCorrect
              ? "rgba(52, 211, 153, 0.5)"
              : "rgba(248, 113, 113, 0.5)"
            : "rgba(167, 243, 208, 0.25)",
        }}
      >
        {/* Top Accent Gold Glow Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #059669 0%, #34d399 50%, #fbbf24 100%)",
            pointerEvents: "none",
          }}
        />

        {/* TOP HUD / PROGRESS BAR */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.725rem", fontWeight: "800", color: "#a7f3d0", letterSpacing: "1px" }}>
              KUIS: {String(currentStep + 1).padStart(2, "0")} / {String(data.length).padStart(2, "0")}
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: "800",
                color: "#fbbf24",
                background: "rgba(251, 191, 36, 0.15)",
                border: "1px solid rgba(251, 191, 36, 0.3)",
                padding: "2px 8px",
                borderRadius: "12px",
                textTransform: "uppercase",
              }}
            >
              Evaluasi Modul
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "6px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "9999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${((currentStep + 1) / data.length) * 100}%`,
                background: "linear-gradient(90deg, #059669, #34d399)",
                borderRadius: "9999px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* QUESTION HEADER */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#ffffff", lineHeight: "1.45", margin: 0 }}>
            {currentQuiz.q}
          </h2>
        </div>

        {/* OPTIONS GRID */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          {currentQuiz.options.map((opt, index) => {
            const isSelected = selectedOption === opt;
            const isCorrectAnswer = opt === currentQuiz.a;

            let borderClr = "rgba(255, 255, 255, 0.12)";
            let bgClr = "rgba(255, 255, 255, 0.04)";
            let txtClr = "#cbd5e1";

            if (isSelected) {
              borderClr = "#fbbf24";
              bgClr = "rgba(251, 191, 36, 0.15)";
              txtClr = "#ffffff";
            }

            if (isSubmitted) {
              if (isCorrectAnswer) {
                borderClr = "#34d399";
                bgClr = "rgba(16, 185, 129, 0.2)";
                txtClr = "#34d399";
              } else if (isSelected && !isCorrectAnswer) {
                borderClr = "#f87171";
                bgClr = "rgba(239, 68, 68, 0.2)";
                txtClr = "#f87171";
              }
            }

            return (
              <button
                key={index}
                disabled={isSubmitted}
                onClick={() => setSelectedOption(opt)}
                className="ik-option-node"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  background: bgClr,
                  border: `1px solid ${borderClr}`,
                  color: txtClr,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  textAlign: "left",
                  fontSize: "0.85rem",
                  fontWeight: isSelected || (isSubmitted && isCorrectAnswer) ? "700" : "500",
                  cursor: isSubmitted ? "default" : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Option Badge (A, B, C, D) */}
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: `1px solid ${borderClr}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "800",
                    flexShrink: 0,
                    background: isSelected ? "#fbbf24" : "rgba(255, 255, 255, 0.05)",
                    color: isSelected ? "#042f2e" : txtClr,
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                <span style={{ flex: 1, lineHeight: "1.35" }}>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* CONTROLS & FEEDBACK FOOTER */}
        <div>
          {isSubmitted ? (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "14px",
                background: isCorrect ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                border: `1px solid ${isCorrect ? "rgba(52, 211, 153, 0.4)" : "rgba(248, 113, 113, 0.4)"}`,
                color: isCorrect ? "#34d399" : "#f87171",
                fontSize: "0.8rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>{isCorrect ? "✓" : "✗"}</span>
              <span>
                {isCorrect
                  ? "Jawaban benar! Memproses ke soal berikutnya…"
                  : `Belum tepat. Jawaban benar: ${currentQuiz.a}`}
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" onClick={onCancel} style={{ ...ghostBtnStyle, flex: "0 0 90px" }}>
                Batal
              </button>

              <button
                type="button"
                disabled={!selectedOption}
                onClick={handleCheckAnswer}
                style={{
                  ...primaryBtnStyle,
                  flex: 1,
                  opacity: selectedOption ? 1 : 0.5,
                  cursor: selectedOption ? "pointer" : "not-allowed",
                }}
              >
                Cek Jawaban
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── INLINE STYLES FOR REUSABILITY ──
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(2, 44, 34, 0.85)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  zIndex: 99998,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px",
  animation: "fadeOverlayQuiz 0.25s ease forwards",
};

const cardStyle = {
  background: "linear-gradient(160deg, #042f2e 0%, #064e3b 100%)",
  border: "1px solid rgba(167, 243, 208, 0.25)",
  borderRadius: "24px",
  padding: "24px 22px",
  maxWidth: "480px",
  width: "100%",
  boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(5, 150, 105, 0.2)",
  position: "relative",
  overflow: "hidden",
  color: "#ffffff",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  animation: "slideModalQuiz 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
};

const primaryBtnStyle = {
  height: "46px",
  background: "#059669",
  border: "1px solid #34d399",
  borderRadius: "9999px",
  color: "#ffffff",
  fontSize: "0.825rem",
  fontWeight: "800",
  letterSpacing: "0.5px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const ghostBtnStyle = {
  height: "46px",
  background: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderRadius: "9999px",
  color: "#a7f3d0",
  fontSize: "0.825rem",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const scopedStyles = `
  @keyframes fadeOverlayQuiz {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideModalQuiz {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .ik-option-node:not(:disabled):hover {
    border-color: #34d399 !important;
    background: rgba(16, 185, 129, 0.12) !important;
  }
  .ik-btn-hover:hover {
    box-shadow: 0 4px 20px rgba(5, 150, 105, 0.4) !important;
    transform: translateY(-1px);
  }
`;

export default Quiz;