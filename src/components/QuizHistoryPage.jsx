import React, { useEffect, useMemo, useState } from "react";

/* ============================================================================
   QuizHistoryPage — "Transkrip Evaluasi"
   ----------------------------------------------------------------------------
   Sekarang komponen ini HANYA berisi konten halaman (tanpa topbar/layar penuh
   sendiri). Ia dirender di dalam layout utama aplikasi oleh TrainingModule.jsx
   (sidebar + topbar + bottom-nav yang sama dengan Beranda/Profil/Sertifikat),
   sehingga tema, font, dan navigasinya otomatis konsisten.

   PROPS
     history       : array riwayat (lihat bentuk data di bawah)
     onBack        : () => void          — tombol "Kembali"
     onRetryQuiz   : (moduleId) => void  — tombol "Ulangi Kuis"
     loading       : boolean             — tampilkan skeleton

   Bentuk data satu entri riwayat (hanya id/title/date/score yang wajib):
     {
       id, moduleId, title, category,
       date: "2026-08-05T09:24:00",   // ISO string
       score: 90,                      // 0-100
       correctCount: 9, totalQuestions: 10,
       durationSeconds: 312,           // opsional
       passThreshold: 70,              // opsional, default 70
       questions: [{ question, options[], correctAnswer, userAnswer }]  // opsional
     }

   Komponen ini tidak tahu apa-apa soal Firebase (konversi ada di adapter
   buildQuizHistory() di TrainingModule.jsx). Semua CSS memakai prefix "qh-"
   dan disuntikkan sekali ke <head>.
   ============================================================================ */

const PAGE_SIZE = 15;
const DEFAULT_PASS = 70;

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const FILTERS = [
  { key: "all", label: "Semua" },
  { key: "passed", label: "Lulus" },
  { key: "failed", label: "Perlu Diulang" },
];

const SORTS = [
  { key: "newest", label: "Terbaru" },
  { key: "oldest", label: "Terlama" },
  { key: "highest", label: "Skor tertinggi" },
  { key: "lowest", label: "Skor terendah" },
];

/* ── helpers ── */
const validDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};
function formatDateShort(iso) {
  const d = validDate(iso);
  return d ? `${d.getDate()} ${MONTHS_ID[d.getMonth()].slice(0, 3)} ${d.getFullYear()}` : "-";
}
function monthGroupKey(iso) {
  const d = validDate(iso);
  return d ? `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}` : "unknown";
}
function monthGroupLabel(iso) {
  const d = validDate(iso);
  return d ? `${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}` : "Tanggal tidak diketahui";
}
function formatDuration(sec) {
  if (sec == null) return null;
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}
// Ambang warna disamakan dengan Profil/Sertifikat: >=80 hijau, >=70 kuning, sisanya merah
const scoreTier = (s) => (s >= 80 ? "high" : s >= 70 ? "mid" : "low");
const passOf = (r) => r.passThreshold ?? DEFAULT_PASS;

/* ── ikon ── */
const ico = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" };
const IconBack   = () => <svg width="16" height="16" {...ico}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>;
const IconSearch = () => <svg width="16" height="16" {...ico}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const IconChevron = ({ open }) => (
  <svg width="18" height="18" {...ico} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s ease" }}><polyline points="6 9 12 15 18 9" /></svg>
);
const IconCheck  = ({ s = 16 }) => <svg width={s} height={s} {...ico} strokeWidth="2.6"><polyline points="20 6 9 17 4 12" /></svg>;
const IconX      = ({ s = 16 }) => <svg width={s} height={s} {...ico} strokeWidth="2.6"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconRedo   = () => <svg width="16" height="16" {...ico}><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>;
const IconClock  = () => <svg width="12" height="12" {...ico}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconList   = () => <svg width="18" height="18" {...ico}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3.5" cy="6" r="1" /><circle cx="3.5" cy="12" r="1" /><circle cx="3.5" cy="18" r="1" /></svg>;
const IconChart  = () => <svg width="18" height="18" {...ico}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
const IconStar   = () => <svg width="18" height="18" {...ico}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
const IconShield = () => <svg width="18" height="18" {...ico}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>;
const IconDoc    = () => <svg width="40" height="40" {...ico} strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="14" x2="15" y2="14" /><line x1="9" y1="17.5" x2="12.5" y2="17.5" /></svg>;

/* ── CSS (disuntikkan sekali) ── */
const QH_STYLES = `
.qh-root{--qh-ink:#12332a;--qh-muted:#5f746c;--qh-line:#e4ece8;--qh-emerald:#0f6b4f;--qh-green:#16a37f;--qh-emerald-bg:#e3f4ee;--qh-gold:#a97416;--qh-gold-bg:#fbf1de;--qh-red:#c4433a;--qh-red-bg:#fbebe8;--qh-sky:#3577c9;--qh-sky-bg:#e8f1fc;font-family:inherit;color:var(--qh-ink);display:flex;flex-direction:column;gap:16px;width:100%;max-width:980px;margin:0 auto}
.qh-root *{box-sizing:border-box}
.qh-root button{font-family:inherit}
.qh-root button:focus-visible,.qh-root input:focus-visible,.qh-root select:focus-visible{outline:2px solid var(--qh-green);outline-offset:2px}

.qh-intro{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.qh-back{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--qh-line);border-radius:999px;padding:8px 14px 8px 12px;font-size:13px;font-weight:700;color:var(--qh-emerald);cursor:pointer;transition:background .15s}
.qh-back:hover{background:var(--qh-emerald-bg)}
.qh-intro-text{margin:0;font-size:13px;color:var(--qh-muted)}

.qh-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.qh-stat{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--qh-line);border-radius:16px;padding:14px 16px;min-width:0}
.qh-stat-icon{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center}
.qh-stat-icon.emerald{background:var(--qh-emerald-bg);color:var(--qh-emerald)}
.qh-stat-icon.sky{background:var(--qh-sky-bg);color:var(--qh-sky)}
.qh-stat-icon.gold{background:var(--qh-gold-bg);color:var(--qh-gold)}
.qh-stat-num{display:block;font-size:22px;font-weight:800;line-height:1.1;letter-spacing:-.01em}
.qh-stat-label{display:block;margin-top:2px;font-size:12px;color:var(--qh-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.qh-toolbar{background:#fff;border:1px solid var(--qh-line);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:12px}
.qh-toolbar-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.qh-search{flex:1 1 240px;display:flex;align-items:center;gap:8px;background:#f6faf8;border:1px solid var(--qh-line);border-radius:12px;padding:0 12px;height:42px;color:var(--qh-muted)}
.qh-search input{flex:1;min-width:0;border:0;outline:0;background:transparent;font:inherit;font-size:14px;color:var(--qh-ink)}
.qh-search input::placeholder{color:#8fa39a}
.qh-search:focus-within{border-color:var(--qh-green);background:#fff}
.qh-clear{border:0;background:none;color:var(--qh-muted);cursor:pointer;display:grid;place-items:center;padding:2px;border-radius:6px}
.qh-select{height:42px;border:1px solid var(--qh-line);background:#fff;border-radius:12px;padding:0 10px;font:inherit;font-size:13px;font-weight:600;color:var(--qh-ink);cursor:pointer;max-width:100%}
.qh-chips{display:flex;gap:8px;flex-wrap:wrap}
.qh-chip{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--qh-line);background:#fff;color:var(--qh-muted);font-size:13px;font-weight:700;padding:7px 14px;border-radius:999px;cursor:pointer;transition:background .15s,color .15s,border-color .15s}
.qh-chip:hover:not(.active){background:#f6faf8}
.qh-chip.active{background:var(--qh-emerald);border-color:var(--qh-emerald);color:#fff}
.qh-chip em{font-style:normal;font-size:11.5px;font-weight:700;padding:1px 7px;border-radius:999px;background:#eef1f0;color:var(--qh-muted)}
.qh-chip.active em{background:rgba(255,255,255,.22);color:#fff}
.qh-result-count{margin-left:auto;font-size:12.5px;color:var(--qh-muted)}

.qh-group-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin:6px 4px 8px}
.qh-group-head h3{margin:0;font-size:15px;font-weight:800}
.qh-group-head span{font-size:12.5px;color:var(--qh-muted)}
.qh-list{background:#fff;border:1px solid var(--qh-line);border-radius:16px;overflow:hidden}
.qh-row{border-bottom:1px solid var(--qh-line)}
.qh-row:last-child{border-bottom:0}
.qh-row.open{background:#f8fcfa}
.qh-row-head{width:100%;display:grid;grid-template-columns:40px minmax(0,1fr) auto 20px;align-items:center;gap:14px;padding:14px 18px;background:none;border:0;text-align:left;cursor:pointer;color:inherit;transition:background .15s}
.qh-row-head:hover{background:#f6faf8}
.qh-status{width:40px;height:40px;border-radius:12px;display:grid;place-items:center}
.qh-status.pass{background:var(--qh-emerald-bg);color:var(--qh-emerald)}
.qh-status.fail{background:var(--qh-red-bg);color:var(--qh-red)}
.qh-main{min-width:0;display:flex;flex-direction:column;gap:5px}
.qh-title{margin:0;font-size:14.5px;font-weight:700;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.qh-meta{display:flex;align-items:center;flex-wrap:wrap;gap:4px 10px;font-size:12px;color:var(--qh-muted)}
.qh-tag{font-weight:700;padding:2px 9px;border-radius:999px;background:var(--qh-emerald-bg);color:var(--qh-emerald)}
.qh-tag.danger{background:var(--qh-red-bg);color:var(--qh-red)}
.qh-meta-item{display:inline-flex;align-items:center;gap:4px}
.qh-score{display:flex;flex-direction:column;align-items:flex-end;gap:5px;min-width:74px}
.qh-score-num{font-size:19px;font-weight:800;line-height:1;letter-spacing:-.01em}
.qh-score-num small{font-size:11.5px;font-weight:600;color:var(--qh-muted);margin-left:2px}
.qh-score.high .qh-score-num{color:var(--qh-emerald)}
.qh-score.mid .qh-score-num{color:var(--qh-gold)}
.qh-score.low .qh-score-num{color:var(--qh-red)}
.qh-bar{width:74px;height:4px;border-radius:4px;background:#e9eff0;overflow:hidden}
.qh-bar span{display:block;height:100%;border-radius:4px}
.qh-score.high .qh-bar span{background:var(--qh-green)}
.qh-score.mid .qh-bar span{background:#d9a23a}
.qh-score.low .qh-bar span{background:var(--qh-red)}
.qh-chev{color:#8fa39a;display:grid;place-items:center}

.qh-detail{padding:2px 18px 18px 72px;display:flex;flex-direction:column;gap:14px}
.qh-detail-top{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.qh-detail-sum{margin:0;font-size:13.5px;color:#33473f}
.qh-detail-sum b{color:var(--qh-ink)}
.qh-detail-note{margin:0;font-size:12.5px;color:var(--qh-muted)}
.qh-toggle{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;color:var(--qh-muted);cursor:pointer;user-select:none}
.qh-toggle input{accent-color:var(--qh-emerald);width:16px;height:16px}
.qh-review{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
.qh-q{background:#fff;border:1px solid var(--qh-line);border-radius:14px;padding:14px}
.qh-q-head{display:flex;gap:10px;align-items:flex-start;margin-bottom:10px}
.qh-q-mark{flex:none;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:800}
.qh-q-mark.ok{background:var(--qh-emerald-bg);color:var(--qh-emerald)}
.qh-q-mark.bad{background:var(--qh-red-bg);color:var(--qh-red)}
.qh-q-mark.unknown{background:#eef1f0;color:var(--qh-muted)}
.qh-q-text{margin:0;font-size:13.5px;font-weight:700;line-height:1.5}
.qh-opts{display:flex;flex-direction:column;gap:6px;padding-left:34px}
.qh-opt{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:13px;color:#3d4f48;background:#f6faf8;border:1px solid var(--qh-line);border-radius:10px;padding:8px 12px}
.qh-opt.correct{background:#eefaf4;border-color:#bfe3d3;color:var(--qh-emerald);font-weight:700}
.qh-opt.wrong{background:var(--qh-red-bg);border-color:#f2c9c4;color:var(--qh-red);font-weight:700}
.qh-opt-tag{flex:none;font-size:11px;font-weight:800}
.qh-q-unknown{margin:8px 0 0 34px;font-size:12px;color:var(--qh-muted)}
.qh-actions{display:flex;gap:10px;flex-wrap:wrap}
.qh-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:42px;padding:0 20px;border-radius:12px;font-size:13.5px;font-weight:700;cursor:pointer;border:1px solid transparent;transition:background .15s,box-shadow .15s}
.qh-btn.primary{background:linear-gradient(135deg,#0f6b4f,#16a37f);color:#fff;box-shadow:0 6px 16px rgba(15,107,79,.2)}
.qh-btn.primary:hover{box-shadow:0 8px 20px rgba(15,107,79,.28)}
.qh-btn.ghost{background:#fff;color:var(--qh-muted);border-color:var(--qh-line)}
.qh-btn.ghost:hover{background:#f6faf8}

.qh-more{display:flex;align-items:baseline;justify-content:center;gap:8px;width:100%;padding:12px;background:#fff;border:1px dashed #b9dccf;border-radius:14px;font-size:13.5px;font-weight:700;color:var(--qh-emerald);cursor:pointer}
.qh-more small{font-size:12px;font-weight:500;color:var(--qh-muted)}
.qh-more:hover{background:var(--qh-emerald-bg)}

.qh-empty{background:#fff;border:1px solid var(--qh-line);border-radius:16px;padding:48px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;color:var(--qh-muted)}
.qh-empty svg{color:#a9c2b8}
.qh-empty h3{margin:6px 0 0;font-size:16px;color:var(--qh-ink)}
.qh-empty p{margin:0;font-size:13.5px;max-width:320px;line-height:1.55}
.qh-empty .qh-btn{margin-top:10px}

.qh-skel{display:flex;flex-direction:column;gap:1px;background:#fff;border:1px solid var(--qh-line);border-radius:16px;overflow:hidden}
.qh-skel i{display:block;height:70px;background:linear-gradient(90deg,#f1f5f4 25%,#e8eeec 37%,#f1f5f4 63%);background-size:400% 100%;animation:qh-shimmer 1.4s ease infinite}
@keyframes qh-shimmer{0%{background-position:100% 0}100%{background-position:0 0}}

@media (max-width:820px){.qh-stats{grid-template-columns:repeat(2,1fr)}}
@media (max-width:600px){
.qh-row-head{grid-template-columns:36px minmax(0,1fr) auto;gap:12px;padding:12px 14px}
.qh-status{width:36px;height:36px}
.qh-chev{display:none}
.qh-score{min-width:0}
.qh-bar{width:56px}
.qh-detail{padding:0 14px 16px}
.qh-opts{padding-left:0}
.qh-q-unknown{margin-left:0}
.qh-btn{flex:1}
.qh-result-count{margin-left:0;width:100%}
}
@media (prefers-reduced-motion:reduce){.qh-skel i{animation:none}.qh-chip,.qh-row-head,.qh-btn{transition:none}}
`;

/* ── Detail per-sesi ── */
function QuizDetailPanel({ record, onRetry, onClose }) {
  const [wrongOnly, setWrongOnly] = useState(false);

  const graded = useMemo(
    () => (Array.isArray(record.questions) ? record.questions : []).map((q, i) => ({
      ...q,
      no: i + 1,
      state: q.userAnswer == null ? "unknown" : q.userAnswer === q.correctAnswer ? "ok" : "bad",
    })),
    [record.questions]
  );
  const wrongCount = graded.filter((q) => q.state === "bad").length;
  const shown = wrongOnly ? graded.filter((q) => q.state === "bad") : graded;

  return (
    <div className="qh-detail">
      <div className="qh-detail-top">
        <p className="qh-detail-sum">
          Menjawab benar <b>{record.correctCount}</b> dari <b>{record.totalQuestions}</b> soal
          {graded.length > 0 && wrongCount === 0 && " — tidak ada jawaban yang salah."}
        </p>
        {wrongCount > 0 && (
          <label className="qh-toggle">
            <input type="checkbox" checked={wrongOnly} onChange={(e) => setWrongOnly(e.target.checked)} />
            Hanya yang salah ({wrongCount})
          </label>
        )}
      </div>

      {graded.length === 0 ? (
        <p className="qh-detail-note">Rincian per-soal tidak tersedia untuk sesi kuis ini.</p>
      ) : (
        <ol className="qh-review">
          {shown.map((q) => (
            <li key={q.no} className="qh-q">
              <div className="qh-q-head">
                <span className={`qh-q-mark ${q.state}`}>
                  {q.state === "ok" ? <IconCheck s={13} /> : q.state === "bad" ? <IconX s={13} /> : q.no}
                </span>
                <p className="qh-q-text">{q.question}</p>
              </div>
              <div className="qh-opts">
                {(q.options || []).map((opt, oi) => {
                  const isAnswer = opt === q.correctAnswer;
                  const isPicked = opt === q.userAnswer;
                  const cls = ["qh-opt", isAnswer ? "correct" : "", isPicked && !isAnswer ? "wrong" : ""].filter(Boolean).join(" ");
                  return (
                    <div key={oi} className={cls}>
                      <span>{opt}</span>
                      {isPicked && <span className="qh-opt-tag">Jawaban Anda</span>}
                      {isAnswer && !isPicked && <span className="qh-opt-tag">Jawaban benar</span>}
                    </div>
                  );
                })}
              </div>
              {q.state === "unknown" && <p className="qh-q-unknown">Jawaban Anda untuk soal ini tidak tercatat.</p>}
            </li>
          ))}
        </ol>
      )}

      <div className="qh-actions">
        <button type="button" className="qh-btn primary" onClick={onRetry}><IconRedo /> Ulangi Kuis</button>
        <button type="button" className="qh-btn ghost" onClick={onClose}>Tutup</button>
      </div>
    </div>
  );
}

/* ── Halaman ── */
export default function QuizHistoryPage({
  history = [],
  onBack = () => {},
  onRetryQuiz = () => {},
  loading = false,
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [expandedId, setExpandedId] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);

  // Suntik CSS sekali saja
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("qh-styles")) return;
    const el = document.createElement("style");
    el.id = "qh-styles";
    el.textContent = QH_STYLES;
    document.head.appendChild(el);
  }, []);

  // Ubah filter -> kembali ke halaman pertama & tutup detail
  useEffect(() => { setLimit(PAGE_SIZE); setExpandedId(null); }, [query, filter, category, sort]);

  const stats = useMemo(() => {
    const total = history.length;
    if (!total) return { total: 0, avg: 0, best: 0, passRate: 0, passed: 0, failed: 0 };
    const passed = history.filter((r) => r.score >= passOf(r)).length;
    return {
      total,
      avg: Math.round(history.reduce((s, r) => s + r.score, 0) / total),
      best: Math.max(...history.map((r) => r.score)),
      passRate: Math.round((passed / total) * 100),
      passed,
      failed: total - passed,
    };
  }, [history]);

  const categories = useMemo(
    () => Array.from(new Set(history.map((r) => r.category).filter(Boolean))).sort(),
    [history]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = history.filter((r) => {
      const passed = r.score >= passOf(r);
      return (
        (!q || r.title.toLowerCase().includes(q) || (r.category || "").toLowerCase().includes(q)) &&
        (filter === "all" || (filter === "passed" ? passed : !passed)) &&
        (category === "all" || r.category === category)
      );
    });
    return list.sort((a, b) => {
      if (sort === "oldest")  return new Date(a.date) - new Date(b.date);
      if (sort === "highest") return b.score - a.score;
      if (sort === "lowest")  return a.score - b.score;
      return new Date(b.date) - new Date(a.date);
    });
  }, [history, query, filter, category, sort]);

  const visible = filtered.slice(0, limit);
  const remaining = filtered.length - visible.length;

  // Kelompok per bulan hanya bila diurutkan berdasarkan tanggal
  const byDate = sort === "newest" || sort === "oldest";
  const groups = useMemo(() => {
    if (!byDate) return [{ key: "all", label: "Diurutkan berdasarkan skor", items: visible }];
    const map = new Map();
    visible.forEach((r) => {
      const key = monthGroupKey(r.date);
      if (!map.has(key)) map.set(key, { key, label: monthGroupLabel(r.date), items: [] });
      map.get(key).items.push(r);
    });
    return Array.from(map.values());
  }, [visible, byDate]);

  const hasActiveFilter = query || filter !== "all" || category !== "all";
  const resetFilters = () => { setQuery(""); setFilter("all"); setCategory("all"); };

  const renderRecord = (r) => {
    const open = expandedId === r.id;
    const passed = r.score >= passOf(r);
    const tier = scoreTier(r.score);
    const duration = formatDuration(r.durationSeconds);
    return (
      <div key={r.id} className={`qh-row ${open ? "open" : ""}`}>
        <button
          type="button"
          className="qh-row-head"
          onClick={() => setExpandedId(open ? null : r.id)}
          aria-expanded={open}
        >
          <span className={`qh-status ${passed ? "pass" : "fail"}`} aria-hidden="true">
            {passed ? <IconCheck /> : <IconRedo />}
          </span>

          <span className="qh-main">
            <span className="qh-title">{r.title}</span>
            <span className="qh-meta">
              {r.category && <span className="qh-tag">{r.category}</span>}
              {!passed && <span className="qh-tag danger">Perlu diulang</span>}
              <span className="qh-meta-item"><IconClock />{formatDateShort(r.date)}{duration ? ` · ${duration}` : ""}</span>
              {r.totalQuestions > 0 && <span className="qh-meta-item">{r.correctCount}/{r.totalQuestions} benar</span>}
            </span>
          </span>

          <span className={`qh-score ${tier}`}>
            <span className="qh-score-num">{r.score}<small>/100</small></span>
            <span className="qh-bar" aria-hidden="true"><span style={{ width: `${Math.min(r.score, 100)}%` }} /></span>
          </span>

          <span className="qh-chev"><IconChevron open={open} /></span>
        </button>

        {open && (
          <QuizDetailPanel
            record={r}
            onRetry={() => onRetryQuiz(r.moduleId)}
            onClose={() => setExpandedId(null)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="qh-root">
      {/* Kembali + keterangan */}
      <div className="qh-intro">
        <button type="button" className="qh-back" onClick={onBack}><IconBack /> Kembali</button>
        <p className="qh-intro-text">Riwayat lengkap kuis yang sudah Anda kerjakan.</p>
      </div>

      {/* Ringkasan */}
      <div className="qh-stats">
        <div className="qh-stat">
          <span className="qh-stat-icon emerald"><IconList /></span>
          <div><span className="qh-stat-num">{stats.total}</span><span className="qh-stat-label">Total Kuis</span></div>
        </div>
        <div className="qh-stat">
          <span className="qh-stat-icon sky"><IconChart /></span>
          <div><span className="qh-stat-num">{stats.avg}</span><span className="qh-stat-label">Rata-rata Skor</span></div>
        </div>
        <div className="qh-stat">
          <span className="qh-stat-icon gold"><IconStar /></span>
          <div><span className="qh-stat-num">{stats.best}</span><span className="qh-stat-label">Skor Tertinggi</span></div>
        </div>
        <div className="qh-stat">
          <span className="qh-stat-icon emerald"><IconShield /></span>
          <div><span className="qh-stat-num">{stats.passRate}%</span><span className="qh-stat-label">Tingkat Lulus</span></div>
        </div>
      </div>

      {/* Cari · filter · urutkan */}
      <div className="qh-toolbar">
        <div className="qh-toolbar-row">
          <label className="qh-search">
            <IconSearch />
            <input
              type="text"
              placeholder="Cari nama modul atau kategori…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Cari riwayat kuis"
            />
            {query && (
              <button type="button" className="qh-clear" onClick={() => setQuery("")} aria-label="Hapus pencarian"><IconX s={14} /></button>
            )}
          </label>
          {categories.length > 1 && (
            <select className="qh-select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter kategori">
              <option value="all">Semua kategori</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          <select className="qh-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Urutkan">
            {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>

        <div className="qh-toolbar-row">
          <div className="qh-chips" role="group" aria-label="Filter status">
            {FILTERS.map((f) => {
              const count = f.key === "all" ? stats.total : f.key === "passed" ? stats.passed : stats.failed;
              return (
                <button
                  key={f.key}
                  type="button"
                  className={`qh-chip ${filter === f.key ? "active" : ""}`}
                  onClick={() => setFilter(f.key)}
                  aria-pressed={filter === f.key}
                >
                  {f.label} <em>{count}</em>
                </button>
              );
            })}
          </div>
          <span className="qh-result-count">
            {loading ? "Memuat…" : `Menampilkan ${visible.length} dari ${filtered.length} sesi`}
          </span>
        </div>
      </div>

      {/* Daftar */}
      {loading ? (
        <div className="qh-skel" aria-hidden="true">{[1, 2, 3, 4, 5].map((i) => <i key={i} />)}</div>
      ) : history.length === 0 ? (
        <div className="qh-empty">
          <IconDoc />
          <h3>Belum ada riwayat kuis</h3>
          <p>Selesaikan kuis pada salah satu modul, dan hasilnya akan tercatat di sini.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="qh-empty">
          <IconDoc />
          <h3>Tidak ada riwayat yang cocok</h3>
          <p>Coba ubah kata kunci pencarian atau filter yang digunakan.</p>
          {hasActiveFilter && <button type="button" className="qh-btn ghost" onClick={resetFilters}>Reset filter</button>}
        </div>
      ) : (
        <>
          {groups.map((g) => (
            <section key={g.key}>
              <div className="qh-group-head">
                <h3>{g.label}</h3>
                <span>
                  {g.items.length} sesi · rata-rata {Math.round(g.items.reduce((s, r) => s + r.score, 0) / g.items.length)}
                </span>
              </div>
              <div className="qh-list">{g.items.map(renderRecord)}</div>
            </section>
          ))}

          {remaining > 0 && (
            <button type="button" className="qh-more" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
              Tampilkan {Math.min(remaining, PAGE_SIZE)} lagi <small>{remaining} tersisa</small>
            </button>
          )}
        </>
      )}
    </div>
  );
}