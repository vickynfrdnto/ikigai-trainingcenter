// ─── components/QuizReviewModal.jsx ──────────────────────────────────────────
//
// IKIGAI EMERALD LUXURY EDITION (FIXED & PRODUCTION READY)
//
// ─────────────────────────────────────────────────────────────────────────────

import React, { useMemo } from "react";

export default function QuizReviewModal({ quizRecord, onClose }) {
  // ── Hooks HARUS di atas early return (Rules of Hooks) ───────────────────
  const answers = useMemo(() => extractAnswers(quizRecord), [quizRecord]);

  if (!quizRecord) return null;

  const title = quizRecord.title || "Modul Evaluasi Kuis";
  const score = Number(quizRecord.score ?? 0);
  const date  = quizRecord.date || "";

  // ── Stats ──
  const correctCount = answers.filter(a => a.chosen && a.chosen === a.correct).length;
  const total = answers.length;

  // Color Coding Skor Emerald Luxury
  const gradeColor =
    score >= 80 ? "#fbbf24" : // Luxury Gold
    score >= 70 ? "#34d399" : // Mint Emerald
                  "#f87171";  // Coral Red

  return (
    <>
      <style>{`
        @keyframes fadeOverlayQR {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideModalQR {
          from { opacity: 0; transform: translate(-50%, -46%) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1);    }
        }
        
        /* Hidden Scrollbar (Instagram Style) */
        .qr-scroll {
          flex: 1 1 0;
          overflow-y: auto;
          overflow-x: hidden;
          min-height: 0;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          -webkit-overflow-scrolling: touch;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .qr-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        /* Option Item Card Styling */
        .qr-opt {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.825rem;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          color: #cbd5e1;
          line-height: 1.45;
          transition: all 0.2s ease;
        }
        
        /* Jawaban Benar */
        .qr-opt.is-correct {
          background: rgba(16, 185, 129, 0.12);
          border-color: rgba(52, 211, 153, 0.4);
          color: #34d399;
          font-weight: 700;
        }

        /* Jawaban Salah */
        .qr-opt.is-wrong {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(248, 113, 113, 0.4);
          color: #f87171;
          font-weight: 700;
        }

        .qr-close-btn:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          color: #ffffff !important;
        }

        .qr-footer-btn:hover {
          background: #059669 !important;
          border-color: #34d399 !important;
          box-shadow: 0 4px 20px rgba(5, 150, 105, 0.4) !important;
        }
      `}</style>

      {/* ── BACKDROP GLASSMORPHISM ── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(2, 44, 34, 0.82)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 9995,
          animation: "fadeOverlayQR 0.25s ease forwards",
        }}
      />

      {/* ── MODAL CONTAINER ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9996,
          width: "min(660px, calc(100vw - 24px))",
          height: "min(86vh, 720px)",
          background: "linear-gradient(160deg, #042f2e 0%, #064e3b 100%)",
          border: "1px solid rgba(167, 243, 208, 0.25)",
          borderRadius: "24px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(5, 150, 105, 0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          color: "#ffffff",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          animation: "slideModalQR 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Top Accent Gold Glow Line */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #059669 0%, #34d399 50%, #fbbf24 100%)",
          pointerEvents: "none",
        }} />

        {/* ── HEADER ── */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          flexShrink: 0,
          background: "rgba(0, 0, 0, 0.15)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: "0.68rem",
                fontWeight: "800",
                letterSpacing: "1.5px",
                color: "#a7f3d0",
                marginBottom: "6px",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}>
                <span style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#34d399",
                  boxShadow: "0 0 8px #34d399"
                }} />
                EVALUASI JAWABAN KARYAWAN
              </div>

              <div style={{
                fontSize: "1.1rem",
                fontWeight: "800",
                color: "#ffffff",
                lineHeight: "1.3",
                marginBottom: "8px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}>
                {title}
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.75rem", color: "#a7f3d0" }}>
                  {date || "Tanggal Selesai"}
                </span>

                {total > 0 && (
                  <span style={{
                    fontSize: "0.725rem",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                    color: correctCount === total ? "#fbbf24" : "#a7f3d0",
                    padding: "3px 10px",
                    background: correctCount === total
                      ? "rgba(251, 191, 36, 0.15)"
                      : "rgba(255, 255, 255, 0.08)",
                    border: `1px solid ${correctCount === total
                      ? "rgba(251, 191, 36, 0.3)"
                      : "rgba(255, 255, 255, 0.12)"}`,
                    borderRadius: "20px",
                  }}>
                    {correctCount} dari {total} Soal Benar
                  </span>
                )}
              </div>
            </div>

            {/* Score Display & Close Top Button */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "8px",
              flexShrink: 0,
            }}>
              <div style={{
                fontSize: "1.8rem",
                fontWeight: "900",
                color: gradeColor,
                lineHeight: 1,
                textShadow: `0 0 16px ${gradeColor}40`,
              }}>
                {score}%
              </div>

              <button
                type="button"
                className="qr-close-btn"
                onClick={onClose}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "9999px",
                  color: "#a7f3d0",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  padding: "5px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                ✕ TUTUP
              </button>
            </div>

          </div>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="qr-scroll">

          {answers.length === 0 ? (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "40px 20px", textAlign: "center",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.5 }}>📋</div>
              <div style={{
                fontSize: "0.9rem",
                fontWeight: "800",
                color: "#ffffff",
                letterSpacing: "1px",
                marginBottom: "6px",
              }}>
                DETAIL JAWABAN TIDAK TERSEDIA
              </div>
              <div style={{
                fontSize: "0.775rem",
                color: "#a7f3d0",
                lineHeight: "1.5",
                maxWidth: "320px",
              }}>
                Skor Anda <strong style={{ color: gradeColor }}>{score}%</strong> telah tersimpan di sistem, namun rincian opsi kuis tidak dapat dimuat untuk sesi ini.
              </div>
            </div>

          ) : (
            answers.map((ans, i) => {
              const notAnswered = !ans.chosen || ans.chosen === "";
              const isRight     = !notAnswered && ans.chosen === ans.correct;
              const isWrong     = !notAnswered && !isRight; // Fix: Deklarasi isWrong di sini!

              const stripeColor = notAnswered ? "rgba(255, 255, 255, 0.2)"
                                : isRight     ? "#34d399"
                                :               "#f87171";

              const statusIcon  = notAnswered ? "—" : isRight ? "✓" : "✗";
              const statusBadgeText = notAnswered ? "TIDAK DIJAWAB" : isRight ? "BENAR" : "SALAH";
              const statusColor = notAnswered ? "#94a3b8"
                                : isRight     ? "#34d399"
                                :               "#f87171";

              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    padding: "16px 16px 16px 20px",
                    position: "relative",
                  }}
                >
                  {/* Left status indicator stripe */}
                  <div style={{
                    position: "absolute",
                    left: 0, top: 0, bottom: 0,
                    width: "4px",
                    background: stripeColor,
                    borderRadius: "16px 0 0 16px",
                  }} />

                  {/* ── Header Soal ── */}
                  <div style={{
                    display: "flex", gap: "10px", marginBottom: "12px", alignItems: "flex-start",
                  }}>
                    <span style={{
                      fontSize: "0.725rem",
                      fontWeight: "800",
                      color: "#a7f3d0",
                      flexShrink: 0,
                      paddingTop: "2px",
                      minWidth: "24px",
                    }}>
                      {String(i + 1).padStart(2, "0")}.
                    </span>

                    <span style={{
                      flex: 1,
                      fontSize: "0.9rem",
                      fontWeight: "700",
                      color: "#ffffff",
                      lineHeight: "1.45",
                    }}>
                      {ans.question}
                    </span>

                    <span style={{
                      flexShrink: 0,
                      fontSize: "0.68rem",
                      fontWeight: "800",
                      color: statusColor,
                      padding: "2px 8px",
                      background: `${statusColor}18`,
                      border: `1px solid ${statusColor}30`,
                      borderRadius: "12px",
                      letterSpacing: "0.5px",
                    }}>
                      {statusIcon} {statusBadgeText}
                    </span>
                  </div>

                  {/* ── Opsi Jawaban ── */}
                  {ans.options && ans.options.length > 0 ? (
                    <div style={{
                      display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "34px",
                    }}>
                      {ans.options.map((opt, oi) => {
                        const optIsCorrect = opt === ans.correct;
                        const optIsChosen  = opt === ans.chosen;
                        const optIsWrong   = optIsChosen && !optIsCorrect;

                        let className = "qr-opt";
                        if (optIsCorrect) className += " is-correct";
                        if (optIsWrong)   className += " is-wrong";

                        const iconBg = optIsCorrect ? "rgba(16, 185, 129, 0.2)"
                                     : optIsWrong   ? "rgba(239, 68, 68, 0.2)"
                                     :                "rgba(255, 255, 255, 0.05)";

                        const iconBdr = optIsCorrect ? "#34d399"
                                      : optIsWrong   ? "#f87171"
                                      :                "rgba(255, 255, 255, 0.2)";

                        const iconChar = optIsCorrect ? "✓"
                                       : optIsWrong   ? "✗"
                                       :                String.fromCharCode(65 + oi);

                        return (
                          <div key={oi} className={className}>
                            <span style={{
                              width: "22px", height: "22px", borderRadius: "50%",
                              border: `1px solid ${iconBdr}`, background: iconBg,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "0.7rem", fontWeight: "800", flexShrink: 0,
                            }}>
                              {iconChar}
                            </span>

                            <span style={{ flex: 1 }}>{opt}</span>

                            {/* Label Kanan: Pilihan User / Jawaban Benar */}
                            {optIsCorrect && optIsChosen && (
                              <span style={{
                                fontSize: "0.68rem", fontWeight: "800",
                                color: "#34d399", flexShrink: 0,
                              }}>
                                ← Pilihanmu ✓
                              </span>
                            )}
                            {optIsCorrect && !optIsChosen && isWrong && (
                              <span style={{
                                fontSize: "0.68rem", fontWeight: "800",
                                color: "#34d399", flexShrink: 0,
                              }}>
                                ← Jawaban Benar
                              </span>
                            )}
                            {optIsWrong && (
                              <span style={{
                                fontSize: "0.68rem", fontWeight: "800",
                                color: "#f87171", flexShrink: 0,
                              }}>
                                ← Pilihanmu ✗
                              </span>
                            )}
                          </div>
                        );
                      })}

                      {notAnswered && (
                        <div style={{
                          fontSize: "0.725rem",
                          color: "#94a3b8",
                          fontStyle: "italic",
                          paddingTop: "4px",
                        }}>
                          ℹ Soal ini tidak dijawab saat pengerjaan kuis.
                        </div>
                      )}
                    </div>

                  ) : (
                    /* Fallback: Kuis tanpa pilihan ganda */
                    <div style={{
                      paddingLeft: "34px", display: "flex", flexDirection: "column", gap: "6px",
                    }}>
                      <div style={{
                        padding: "10px 14px", borderRadius: "10px",
                        background: notAnswered ? "rgba(255, 255, 255, 0.05)"
                                  : isRight     ? "rgba(16, 185, 129, 0.12)"
                                  :               "rgba(239, 68, 68, 0.12)",
                        border: `1px solid ${
                          notAnswered ? "rgba(255, 255, 255, 0.1)"
                          : isRight   ? "rgba(52, 211, 153, 0.3)"
                          :             "rgba(248, 113, 113, 0.3)"
                        }`,
                        fontSize: "0.825rem",
                        color: notAnswered ? "#a7f3d0"
                             : isRight     ? "#34d399"
                             :               "#f87171",
                        fontWeight: "700",
                      }}>
                        <span style={{
                          fontSize: "0.65rem", color: "#a7f3d0", letterSpacing: "1px",
                          display: "block", marginBottom: "2px", fontWeight: "800",
                        }}>
                          JAWABAN ANDA:
                        </span>
                        {ans.chosen || "— (Tidak dijawab)"}
                      </div>

                      {(isWrong || (notAnswered && ans.correct)) && ans.correct && (
                        <div style={{
                          padding: "10px 14px", borderRadius: "10px",
                          background: "rgba(16, 185, 129, 0.12)",
                          border: "1px solid rgba(52, 211, 153, 0.3)",
                          fontSize: "0.825rem",
                          color: "#34d399",
                          fontWeight: "700",
                        }}>
                          <span style={{
                            fontSize: "0.65rem", color: "#a7f3d0", letterSpacing: "1px",
                            display: "block", marginBottom: "2px", fontWeight: "800",
                          }}>
                            JAWABAN BENAR:
                          </span>
                          {ans.correct}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          padding: "14px 20px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          flexShrink: 0,
          background: "rgba(0, 0, 0, 0.2)",
        }}>
          <button
            type="button"
            className="qr-footer-btn"
            onClick={onClose}
            style={{
              width: "100%",
              height: "46px",
              background: "#064e3b",
              border: "1px solid #34d399",
              borderRadius: "9999px",
              color: "#ffffff",
              fontSize: "0.825rem",
              letterSpacing: "1px",
              cursor: "pointer",
              fontWeight: "800",
              transition: "all 0.2s ease",
              textTransform: "uppercase",
            }}
          >
            Tutup Review Jawaban
          </button>
        </div>

      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS — DEFENSIVE DATA EXTRACTION
// ═════════════════════════════════════════════════════════════════════════════

function extractAnswers(record) {
  if (!record) return [];

  const raw =
       record?.userAnswers
    ?? record?.answers
    ?? record?.results
    ?? record?.userAnswer
    ?? [];

  let quizQuestions =
       record?.quiz?.questions
    ?? record?.quizData?.questions
    ?? record?.questions
    ?? record?.quiz
    ?? [];
  if (!Array.isArray(quizQuestions)) quizQuestions = [];

  if (!Array.isArray(raw)) return [];

  return raw.map((a, i) => {
    const q = quizQuestions[i] || {};

    const question = String(
         a?.question ?? a?.text ?? a?.q
      ?? q?.question ?? q?.text ?? q?.q
      ?? `Soal ${i + 1}`
    ).trim();

    let options =
         a?.options
      ?? a?.choices
      ?? a?.opts
      ?? q?.options
      ?? q?.choices
      ?? q?.opts
      ?? [];
    if (!Array.isArray(options)) options = [];
    options = options
      .map(o => {
        if (o === null || o === undefined) return "";
        if (typeof o === "object") return String(o.text || o.label || o.value || "");
        return String(o);
      })
      .filter(o => o.length > 0);

    const rawChosen =
         a?.chosen
      ?? a?.selected
      ?? a?.userAnswer
      ?? a?.answer
      ?? a?.choice
      ?? "";
    const chosen = resolveAnswer(rawChosen, options);

    const rawCorrect =
         a?.correct
      ?? a?.correctAnswer
      ?? q?.correct
      ?? q?.correctAnswer
      ?? q?.answer
      ?? "";
    const correct = resolveAnswer(rawCorrect, options);

    return { question, options, chosen, correct };
  });
}

function resolveAnswer(value, options) {
  if (value === null || value === undefined || value === "") return "";

  if (typeof value === "number") {
    if (Number.isInteger(value) && value >= 0 && value < options.length) {
      return options[value];
    }
    return String(value);
  }

  if (typeof value === "object") {
    return String(value.text || value.label || value.value || "").trim();
  }

  const s = String(value).trim();
  if (!s) return "";

  if (/^[A-Za-z]$/.test(s)) {
    const idx = s.toUpperCase().charCodeAt(0) - 65;
    if (idx >= 0 && idx < options.length) {
      return options[idx];
    }
  }

  if (/^\d+$/.test(s)) {
    const idx = parseInt(s, 10);
    if (idx >= 0 && idx < options.length) {
      return options[idx];
    }
  }

  return s;
}