// ──────────── utils/normalizeQuizAnswers.js ───────────────────────────────
//
// KONTEKS SISTEM:
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  Quiz.jsx (fixed)                                                       │
// │    answersRef.current = Array(data.length).fill(null)                   │
// │    answersRef.current[i] = selectedOption   ← string teks opsi asli     │
// │    onPass(finalPercentage, answersRef.current)                          │
// │      → arg ke-2: ["Teks opsi A", null, "Teks opsi C", null, ...]        │
// │         (string jika dijawab, null jika soal tidak terjawab)            │
// │                                                                         │
// │  playlistData[x].quiz = Array<{ q, options, a }>                        │
// │    q       : string  — teks soal                                        │
// │    options : string[] — teks pilihan                                    │
// │    a       : string  — teks jawaban benar (BUKAN index)                 │
// │                                                                         │
// │  normalizeQuizAnswers(rawAnswers, currentVideo.quiz)                    │
// │    → entry.userAnswers   disimpan ke Firebase                           │
// │    → dibaca oleh QuizReviewModal  (user dashboard)                      │
// │    → dibaca oleh Admin Inspect    (adminpanel)                          │
// └─────────────────────────────────────────────────────────────────────────┘
//
// OUTPUT FORMAT — Shape A (canonical):
//   Array<{
//     question : string   — teks soal
//     options  : string[] — semua pilihan jawaban
//     chosen   : string   — teks pilihan user (atau "" jika tidak menjawab)
//     correct  : string   — teks jawaban benar
//   }>
//
// Panjang output SELALU = panjang quizData (tidak ada soal yang hilang).
//
// KENAPA SHAPE A BUKAN FLAT STRING ARRAY:
//   Flat array hanya menyimpan "apa yang dipilih", tidak menyimpan konteks soal.
//   Shape A menyimpan semua informasi yang dibutuhkan untuk render review
//   tanpa perlu lookup tambahan ke playlistData — penting karena playlistData
//   bisa berubah setelah user mengerjakan quiz.
//
// SHAPE INPUT YANG DIDUKUNG:
//   Shape 1 (Quiz.jsx fixed)  : flat array string/null/undefined
//   Shape 2 (legacy Shape A)  : [{question, chosen, correct, options}]
//   Shape 3 (legacy Shape B)  : [{questionIndex, chosenIndex}]
//   Shape 4 (legacy Shape D)  : [{userAnswer, correctAnswer, text, options}]
//   Shape 5 (kosong/invalid)  : null, [], undefined → semua soal "tidak dijawab"
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalize rawAnswers dari Quiz.jsx onPass() ke Shape A canonical.
 *
 * @param  {any}   rawAnswers  — arg ke-2 dari onPass(), bisa format apapun
 * @param  {Array} quizData    — currentVideo.quiz: Array<{q, options, a}>
 * @returns {Array<{question:string, options:string[], chosen:string, correct:string}>}
 */
export function normalizeQuizAnswers(rawAnswers, quizData) {

  // ── 1. Resolve quizData ke array soal ────────────────────────────────────
  const questions = resolveQuizData(quizData);

  // ── 2. Handle rawAnswers kosong / tidak valid ─────────────────────────────
  if (!rawAnswers || !Array.isArray(rawAnswers) || rawAnswers.length === 0) {
    return buildEmptyResult(questions);
  }

  // ── 3. Deteksi shape input dan dispatch ke normalizer yang sesuai ─────────
  const first = rawAnswers[0];

  // Shape 2 — sudah canonical: elemen pertama punya {question, chosen}
  if (isPlainObject(first) && "question" in first && "chosen" in first) {
    return normalizeShapeA(rawAnswers, questions);
  }

  // Shape 3 — [{questionIndex, chosenIndex}]
  if (isPlainObject(first) && "questionIndex" in first) {
    return normalizeShapeB(rawAnswers, questions);
  }

  // Shape 4 — [{userAnswer, correctAnswer, ...}]
  if (isPlainObject(first) && ("userAnswer" in first || "correctAnswer" in first)) {
    return normalizeShapeD(rawAnswers, questions);
  }

  // Shape 1 — flat array string/null/undefined (output Quiz.jsx fixed)
  // first bisa null (Array.fill(null)) atau string — bukan object
  return normalizeShape1(rawAnswers, questions);
}


// ═════════════════════════════════════════════════════════════════════════════
// INTERNAL HELPERS
// ═════════════════════════════════════════════════════════════════════════════

/** Resolve quizData ke array soal apapun format awalnya */
function resolveQuizData(quizData) {
  if (!quizData) return [];
  if (Array.isArray(quizData))              return quizData;          // format utama
  if (Array.isArray(quizData.questions))    return quizData.questions;
  if (Array.isArray(quizData.soal))         return quizData.soal;
  if (Array.isArray(quizData.items))        return quizData.items;
  return [];
}

/** Buat result di mana semua soal dianggap tidak dijawab */
function buildEmptyResult(questions) {
  return questions.map((q, i) => ({
    question: resolveQuestionText(q, i),
    options:  resolveOptions(q),
    chosen:   "",
    correct:  resolveCorrectAnswer(q),
  }));
}

/** Ambil teks soal — prioritaskan q.q (format playlistData utama) */
function resolveQuestionText(q, i = -1) {
  const fallback = i >= 0 ? `Pertanyaan ${i + 1}` : "Pertanyaan";
  if (!q || typeof q !== "object") return fallback;
  return q.q || q.question || q.soal || q.text || q.pertanyaan || fallback;
}

/** Ambil array opsi jawaban */
function resolveOptions(q) {
  if (!q || typeof q !== "object") return [];
  return q.options || q.pilihan || q.choices || [];
}

/**
 * Ambil teks jawaban benar.
 * playlistData: q.a = string teks jawaban benar (bukan index).
 * Legacy fallback: q.answer / q.jawaban bisa index (number) atau teks (string).
 */
function resolveCorrectAnswer(q) {
  if (!q || typeof q !== "object") return "";

  // Format utama: q.a adalah teks jawaban langsung
  if (typeof q.a === "string" && q.a !== "") return q.a;

  const opts = resolveOptions(q);
  const raw  = q.answer ?? q.jawaban ?? q.correctAnswer;

  if (raw == null) return "";
  if (typeof raw === "number") return opts[raw] ?? "";
  if (typeof raw === "string") return raw;
  return String(raw);
}

function isPlainObject(val) {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}


// ─── Shape 1: flat array string/null/undefined ────────────────────────────────
// Output langsung dari answersRef.current di Quiz.jsx (sudah difix):
//   [null, "Opsi B", null, "Opsi D", ...]
//   → null  = soal belum sempat dijawab (Array.fill(null) awal)
//   → string = jawaban user (teks opsi asli)
//
// Iterasi dari questions (source of truth) bukan dari rawAnswers,
// supaya soal yang terlewat (array lebih pendek) tetap muncul sebagai "".
function normalizeShape1(rawAnswers, questions) {
  return questions.map((q, i) => {
    const raw    = rawAnswers[i];                              // bisa null/string
    const chosen = (typeof raw === "string" && raw.trim()) ? raw.trim() : "";
    return {
      question: resolveQuestionText(q, i),
      options:  resolveOptions(q),
      chosen,
      correct:  resolveCorrectAnswer(q),
    };
  });
}


// ─── Shape 2: sudah canonical [{question, chosen, correct, options}] ──────────
// Re-merge dengan questions sebagai source of truth untuk field soal.
function normalizeShapeA(rawAnswers, questions) {
  return questions.map((q, i) => {
    const raw = rawAnswers[i];
    if (!raw) {
      return { question: resolveQuestionText(q, i), options: resolveOptions(q), chosen: "", correct: resolveCorrectAnswer(q) };
    }
    const opts = resolveOptions(q);
    return {
      question: resolveQuestionText(q, i) || raw.question || "",
      options:  opts.length ? opts : (raw.options || []),
      chosen:   typeof raw.chosen === "string" ? raw.chosen : String(raw.chosen ?? ""),
      correct:  resolveCorrectAnswer(q) || raw.correct || "",
    };
  });
}


// ─── Shape 3: [{questionIndex, chosenIndex}] ──────────────────────────────────
function normalizeShapeB(rawAnswers, questions) {
  const map = {};
  rawAnswers.forEach(({ questionIndex, chosenIndex }) => {
    if (questionIndex !== undefined) map[questionIndex] = chosenIndex;
  });
  return questions.map((q, i) => {
    const opts        = resolveOptions(q);
    const idx         = map[i];
    const chosen      = (idx !== undefined && opts[idx] !== undefined) ? opts[idx] : "";
    return { question: resolveQuestionText(q, i), options: opts, chosen, correct: resolveCorrectAnswer(q) };
  });
}


// ─── Shape 4: [{userAnswer, correctAnswer, text?, options?}] ──────────────────
function normalizeShapeD(rawAnswers, questions) {
  return questions.map((q, i) => {
    const raw  = rawAnswers[i];
    const opts = resolveOptions(q);
    return {
      question: resolveQuestionText(q, i) || raw?.text || raw?.question || "",
      options:  opts.length ? opts : (raw?.options || raw?.pilihan || []),
      chosen:   typeof raw?.userAnswer === "string" ? raw.userAnswer : String(raw?.userAnswer ?? raw?.chosen ?? ""),
      correct:  resolveCorrectAnswer(q) || raw?.correctAnswer || raw?.correct || "",
    };
  });
}