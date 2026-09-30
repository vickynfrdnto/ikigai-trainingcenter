import { useMemo, useState } from "react";

// CSS halaman ini disatukan di file JSX (semua class berawalan "ana-")
const ANA_CSS = `
.ana {
  --ana-ink: #0c122d;
  --ana-muted: #5e6782;
  --ana-line: rgba(148, 163, 184, 0.32);
  --ana-accent: #00bca2;
  --ana-accent-deep: #047857;
  --ana-high: #059669;
  --ana-mid: #d97706;
  --ana-low: #dc2626;
}

.ana-head { margin-bottom: 16px; }

/* ── Ringkasan ── */
.ana-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}
.ana-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid var(--ana-line);
  border-radius: 14px;
}
.ana-stat-num { font-size: 22px; font-weight: 800; line-height: 1.15; color: var(--ana-ink); }
.ana-stat-num small { font-size: 12px; font-weight: 700; color: var(--ana-muted); margin-left: 2px; }
.ana-stat-label { font-size: 12px; font-weight: 600; color: var(--ana-muted); }
.ana-stat.is-primary { background: var(--ana-ink); border-color: var(--ana-ink); }
.ana-stat.is-primary .ana-stat-num { color: var(--ana-accent); }
.ana-stat.is-primary .ana-stat-label { color: #cbd5e1; }

/* ── Filter ── */
.ana-filters { display: flex; flex-direction: column; gap: 10px; }

/* Kolom pencarian (dibuat khusus agar tidak bergantung pada CSS global) */
.ana .ana-search {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  min-height: 46px;
  padding: 0 16px;
  background: #fff;
  border: 1px solid var(--ana-line);
  border-radius: 999px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.ana .ana-search:focus-within {
  border-color: var(--ana-accent);
  box-shadow: 0 0 0 3px rgba(0, 188, 162, 0.18);
}
.ana .ana-search svg {
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  color: var(--ana-muted);
}
.ana .ana-search input {
  flex: 1;
  min-width: 0;
  height: 44px;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  font-size: 13.5px;
  color: var(--ana-ink);
}
.ana .ana-search input::placeholder { color: var(--ana-muted); }

.ana-filter-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.ana-filter-row .m-filter-select { flex: 1 1 200px; min-width: 0; }
.ana-filter-row .m-date-input { flex: 0 1 170px; min-width: 0; }

/* Filter tanggal & periode (dari - sampai) */
.ana-field { display: flex; flex: 0 1 220px; align-items: center; gap: 8px; min-width: 0; }
.ana-field span { font-size: 12px; font-weight: 700; color: var(--ana-muted); white-space: nowrap; }
.ana-field .m-date-input { flex: 1 1 auto; width: 100%; min-width: 0; }
.ana-range { display: flex; flex: 1 1 380px; align-items: center; gap: 8px; min-width: 0; }
.ana-range .ana-field { flex: 1 1 0; }

.ana-seg {
  display: inline-flex;
  padding: 3px;
  background: rgba(148, 163, 184, 0.16);
  border-radius: 999px;
}
.ana-seg button {
  border: 0;
  background: transparent;
  padding: 8px 14px;
  border-radius: 999px;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ana-muted);
  cursor: pointer;
  white-space: nowrap;
}
.ana-seg button.is-active { background: #fff; color: var(--ana-ink); box-shadow: 0 1px 4px rgba(12, 18, 45, 0.15); }
.ana-seg button.is-active.tone-pass { color: var(--ana-high); }
.ana-seg button.is-active.tone-fail { color: var(--ana-low); }

.ana-export { display: inline-flex; gap: 8px; margin-left: auto; }
.ana-export button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--ana-line);
  background: #fff;
  font: inherit;
  font-size: 12.5px;
  font-weight: 800;
  cursor: pointer;
}
.ana-export .is-excel { color: var(--ana-accent-deep); background: #f0fdfa; border-color: rgba(0, 188, 162, 0.5); }
.ana-export .is-pdf { color: #dc2626; background: #fff5f5; border-color: #fecaca; }
.ana-export button:hover { filter: brightness(0.97); }

.ana-resultbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 14px 2px 10px;
  font-size: 12.5px;
  color: var(--ana-muted);
}
.ana-resultbar strong { color: var(--ana-ink); }
.ana-link {
  border: 0;
  background: none;
  padding: 0;
  font: inherit;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ana-accent-deep);
  cursor: pointer;
}
.ana-link:hover { text-decoration: underline; }

/* ── Tabel (desktop) ── */
.ana-table-wrap {
  border: 1px solid var(--ana-line);
  border-radius: 16px;
  background: #fff;
  overflow-x: auto;
}
.ana-table { width: 100%; border-collapse: collapse; min-width: 720px; }
.ana-table thead th {
  position: sticky;
  top: 0;
  padding: 12px 14px;
  background: #f1f5f9;
  border-bottom: 1px solid var(--ana-line);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-align: left;
  color: var(--ana-muted);
  white-space: nowrap;
}
.ana-table tbody td { padding: 12px 14px; border-bottom: 1px solid rgba(148, 163, 184, 0.2); vertical-align: middle; }
.ana-table tbody tr:last-child td { border-bottom: 0; }
.ana-table tbody tr:hover { background: #f8fafc; }

.ana-user { display: flex; align-items: center; gap: 10px; min-width: 0; }
.ana-avatar {
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #059669, #047857);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
}
.ana-user-name { font-size: 13px; font-weight: 800; color: var(--ana-ink); }
.ana-user-role { font-size: 11px; font-weight: 700; color: var(--ana-muted); text-transform: uppercase; letter-spacing: 0.02em; }
.ana-modul { font-size: 13px; font-weight: 700; color: var(--ana-ink); line-height: 1.4; }
.ana-date { font-size: 12.5px; color: var(--ana-muted); white-space: nowrap; }

.ana-score { display: flex; align-items: center; gap: 8px; min-width: 110px; }
.ana-score-num { font-size: 13px; font-weight: 800; min-width: 28px; }
.ana-score-num.high { color: var(--ana-high); }
.ana-score-num.mid { color: var(--ana-mid); }
.ana-score-num.low { color: var(--ana-low); }
.ana-bar { flex: 1; height: 6px; border-radius: 999px; background: rgba(148, 163, 184, 0.25); overflow: hidden; }
.ana-bar i { display: block; height: 100%; border-radius: 999px; }
.ana-bar i.high { background: var(--ana-high); }
.ana-bar i.mid { background: #f59e0b; }
.ana-bar i.low { background: var(--ana-low); }

.ana-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 11px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 800;
  white-space: nowrap;
}
.ana-badge::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.ana-badge.pass { background: #d1fae5; color: #047857; }
.ana-badge.fail { background: #fee2e2; color: #b91c1c; }

.ana-inspect {
  padding: 7px 14px;
  border: 1px solid var(--ana-line);
  border-radius: 10px;
  background: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  color: var(--ana-ink);
  cursor: pointer;
  white-space: nowrap;
}
.ana-inspect:hover { border-color: var(--ana-accent); color: var(--ana-accent-deep); }

/* ── Empty ── */
.ana-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 40px 20px;
  text-align: center;
  border: 1px dashed var(--ana-line);
  border-radius: 16px;
  color: var(--ana-muted);
}
.ana-empty strong { color: var(--ana-ink); font-size: 15px; }
.ana-empty p { margin: 0 0 8px; font-size: 13px; max-width: 46ch; }

/* ── Mobile: baris tabel jadi kartu ── */
@media (max-width: 720px) {
  .ana-filter-row { display: grid; grid-template-columns: 1fr; }
  .ana-filter-row .m-filter-select,
  .ana-filter-row .m-date-input { flex: none; width: 100%; }
  .ana-field { flex: none; width: 100%; }
  .ana-range { display: grid; grid-template-columns: 1fr; }
  .ana-seg { display: flex; }
  .ana-seg button { flex: 1; padding: 8px 6px; }
  .ana-export { margin-left: 0; display: grid; grid-template-columns: 1fr 1fr; }
  .ana-export button { justify-content: center; }

  .ana-table-wrap { border: 0; background: transparent; overflow: visible; }
  .ana-table { min-width: 0; display: block; }
  .ana-table thead { display: none; }
  .ana-table tbody { display: flex; flex-direction: column; gap: 10px; }
  .ana-table tbody tr {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "user   status"
      "modul  modul"
      "score  date"
      "action action";
    gap: 10px 12px;
    padding: 14px;
    background: #fff;
    border: 1px solid var(--ana-line);
    border-radius: 14px;
  }
  .ana-table tbody td { display: block; padding: 0; border: 0; }
  .ana-c-user { grid-area: user; }
  .ana-c-status { grid-area: status; align-self: start; }
  .ana-c-modul { grid-area: modul; }
  .ana-c-score { grid-area: score; }
  .ana-c-date { grid-area: date; align-self: center; }
  .ana-c-action { grid-area: action; }
  .ana-inspect { width: 100%; padding: 10px; }
}
`;

// ── Helper filter periode ──
const dayStart = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

// Baca tanggal dari input <input type="date"> (yyyy-mm-dd) sebagai awal hari lokal
const parseInputDate = (value) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).getTime() : null;
};

// Baca quiz.date: mendukung d/m/yyyy (tampilan id-ID), yyyy-mm-dd / ISO, Date, dan timestamp
const parseQuizDate = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : dayStart(value);
  if (typeof value === "number") return dayStart(new Date(value));
  const str = String(value).trim();
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(str);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])).getTime();
  const dmy = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/.exec(str);
  if (dmy) return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1])).getTime();
  const fallback = new Date(str);
  return Number.isNaN(fallback.getTime()) ? null : dayStart(fallback);
};

const AnalyticsPage = (props) => {
  const {
    ANALYTICS_PAGE_SIZE, IconExcel, IconPdf, IconSearch, PASSING_SCORE, Pagination,
    analyticsPage, analyticsRows, analyticsSearch, analyticsTotalPages,
    exportDate, exportToExcel, exportToPDF, exportUser, paginatedAnalyticsRows,
    scoreClass, setAnalyticsPage, setAnalyticsSearch, setExportDate, setExportUser,
    setSelectedUser, setStatusFilter, statusFilter, users,
  } = props;

  // Filter periode dijalankan di halaman ini, di atas hasil yang sudah difilter oleh induk
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");

  // Periode: [awal, akhir] dalam ms (salah satunya boleh kosong), atau null jika tidak diisi
  const periodRange = useMemo(() => {
    const start = parseInputDate(rangeFrom);
    const end = parseInputDate(rangeTo);
    return start === null && end === null ? null : [start, end];
  }, [rangeFrom, rangeTo]);
  const periodActive = periodRange !== null;

  const rows = useMemo(() => {
    if (!periodRange) return analyticsRows;
    const [start, end] = periodRange;
    return analyticsRows.filter(({ quiz }) => {
      const t = parseQuizDate(quiz.date);
      if (t === null) return false;
      return (start === null || t >= start) && (end === null || t <= end);
    });
  }, [analyticsRows, periodRange]);

  // Tanpa filter periode, pagination tetap memakai hasil dari induk
  const totalPages = periodActive ? Math.max(1, Math.ceil(rows.length / ANALYTICS_PAGE_SIZE)) : analyticsTotalPages;
  const page = periodActive ? Math.min(analyticsPage, totalPages) : analyticsPage;
  const visibleRows = periodActive
    ? rows.slice((page - 1) * ANALYTICS_PAGE_SIZE, page * ANALYTICS_PAGE_SIZE)
    : paginatedAnalyticsRows;

  const changeFrom = (value) => {
    setRangeFrom(value);
    setAnalyticsPage(1);
  };
  const changeTo = (value) => {
    setRangeTo(value);
    setAnalyticsPage(1);
  };

  // Ringkasan dihitung dari hasil yang sedang tampil (mengikuti pencarian & filter)
  const summary = useMemo(() => {
    const total = rows.length;
    if (total === 0) return { total: 0, avg: 0, passRate: 0, people: 0 };
    const scores = rows.map(({ quiz }) => Number(quiz.score) || 0);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / total);
    const pass = scores.filter((s) => s >= PASSING_SCORE).length;
    const people = new Set(rows.map(({ user }) => user.id)).size;
    return { total, avg, passRate: Math.round((pass / total) * 100), people };
  }, [rows, PASSING_SCORE]);

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => String(a.nama || "").localeCompare(String(b.nama || ""), "id")),
    [users]
  );

  const hasFilter =
    analyticsSearch.trim() !== "" || exportUser !== "ALL" || exportDate !== "" || statusFilter !== "ALL" || rangeFrom !== "" || rangeTo !== "";

  const resetFilters = () => {
    setAnalyticsSearch("");
    setExportUser("ALL");
    setExportDate("");
    setStatusFilter("ALL");
    setRangeFrom("");
    setRangeTo("");
    setAnalyticsPage(1);
  };

  const rangeStart = rows.length === 0 ? 0 : (page - 1) * ANALYTICS_PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * ANALYTICS_PAGE_SIZE, rows.length);

  const statusTabs = [
    { key: "ALL", label: "Semua", tone: "" },
    { key: "PASS", label: "Lulus", tone: "tone-pass" },
    { key: "FAIL", label: "Tidak lulus", tone: "tone-fail" },
  ];

  return (
    <section className="m-card analytics-section ana">
      <style>{ANA_CSS}</style>

      <div className="ana-head">
        <h2 className="m-card-h2">Riwayat & Evaluasi Kuis</h2>
        <p className="m-card-p">Laporan pengerjaan materi kuis oleh karyawan</p>
      </div>

      {/* Ringkasan hasil */}
      <div className="ana-stats">
        <div className="ana-stat is-primary">
          <span className="ana-stat-num">{summary.total}</span>
          <span className="ana-stat-label">Total evaluasi</span>
        </div>
        <div className="ana-stat">
          <span className="ana-stat-num">{summary.avg}<small>/ 100</small></span>
          <span className="ana-stat-label">Rata-rata skor</span>
        </div>
        <div className="ana-stat">
          <span className="ana-stat-num">{summary.passRate}<small>%</small></span>
          <span className="ana-stat-label">Tingkat kelulusan</span>
        </div>
        <div className="ana-stat">
          <span className="ana-stat-num">{summary.people}</span>
          <span className="ana-stat-label">Karyawan</span>
        </div>
      </div>

      {/* Filter */}
      <div className="ana-filters">
        <div className="ana-search">
          <IconSearch />
          <input
            type="text"
            placeholder="Cari nama karyawan, role, atau modul..."
            value={analyticsSearch}
            onChange={(e) => setAnalyticsSearch(e.target.value)}
            aria-label="Cari nama karyawan, role, atau modul"
          />
        </div>

        <div className="ana-filter-row">
          <select
            className="m-filter-select"
            value={exportUser}
            onChange={(e) => setExportUser(e.target.value)}
            aria-label="Filter karyawan"
          >
            <option value="ALL">Semua karyawan</option>
            {sortedUsers.map((u) => <option key={u.id} value={u.kode}>{u.nama}</option>)}
          </select>

          <label className="ana-field">
            <span>Tanggal</span>
            <input
              type="date"
              className="m-date-input"
              value={exportDate}
              onChange={(e) => setExportDate(e.target.value)}
              aria-label="Filter tanggal"
            />
          </label>

          <div className="ana-range" role="group" aria-label="Filter periode">
            <label className="ana-field">
              <span>Periode</span>
              <input
                type="date"
                className="m-date-input"
                value={rangeFrom}
                max={rangeTo || undefined}
                onChange={(e) => changeFrom(e.target.value)}
                aria-label="Periode dari tanggal"
              />
            </label>
            <label className="ana-field">
              <span>s/d</span>
              <input
                type="date"
                className="m-date-input"
                value={rangeTo}
                min={rangeFrom || undefined}
                onChange={(e) => changeTo(e.target.value)}
                aria-label="Periode sampai tanggal"
              />
            </label>
          </div>

          <div className="ana-seg" role="group" aria-label="Filter status kelulusan">
            {statusTabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`${statusFilter === t.key ? "is-active" : ""} ${t.tone}`}
                onClick={() => setStatusFilter(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="ana-export">
            <button type="button" className="is-excel" onClick={exportToExcel} title="Ekspor sesuai filter karyawan & tanggal">
              <IconExcel /> Excel
            </button>
            <button type="button" className="is-pdf" onClick={exportToPDF} title="Ekspor sesuai filter karyawan & tanggal">
              <IconPdf /> PDF
            </button>
          </div>
        </div>
      </div>

      <div className="ana-resultbar">
        <span>
          {rows.length === 0
            ? "Tidak ada hasil"
            : <>Menampilkan <strong>{rangeStart}–{rangeEnd}</strong> dari {rows.length} hasil</>}
        </span>
        {hasFilter && (
          <button type="button" className="ana-link" onClick={resetFilters}>Reset filter</button>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="ana-empty">
          <strong>{hasFilter ? "Tidak ada hasil yang cocok" : "Belum ada riwayat kuis"}</strong>
          <p>
            {hasFilter
              ? "Coba ubah kata kunci, periode, atau status kelulusan."
              : "Hasil kuis akan muncul di sini setelah karyawan menyelesaikan materi."}
          </p>
          {hasFilter && (
            <button type="button" className="m-btn-action-sm on" onClick={resetFilters}>Reset filter</button>
          )}
        </div>
      ) : (
        <div className="ana-table-wrap">
          <table className="ana-table">
            <thead>
              <tr>
                <th>Karyawan</th>
                <th>Modul training</th>
                <th>Skor</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th aria-label="Aksi" />
              </tr>
            </thead>
            <tbody>
              {visibleRows.map(({ user, quiz, key }) => {
                const score = Number(quiz.score) || 0;
                const isPass = score >= PASSING_SCORE;
                const tone = scoreClass(score);
                return (
                  <tr key={key}>
                    <td className="ana-c-user">
                      <div className="ana-user">
                        <div className="ana-avatar">{user.nama?.[0]?.toUpperCase() || "U"}</div>
                        <div>
                          <div className="ana-user-name">{user.nama}</div>
                          <div className="ana-user-role">{user.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="ana-c-modul"><span className="ana-modul">{quiz.title}</span></td>
                    <td className="ana-c-score">
                      <div className="ana-score">
                        <span className={`ana-score-num ${tone}`}>{score}</span>
                        <span className="ana-bar" aria-hidden="true">
                          <i className={tone} style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
                        </span>
                      </div>
                    </td>
                    <td className="ana-c-status">
                      <span className={`ana-badge ${isPass ? "pass" : "fail"}`}>
                        {isPass ? "Lulus" : "Tidak lulus"}
                      </span>
                    </td>
                    <td className="ana-c-date"><span className="ana-date">{quiz.date}</span></td>
                    <td className="ana-c-action">
                      <button
                        type="button"
                        className="ana-inspect"
                        onClick={() => setSelectedUser({ user, quiz })}
                        aria-label={`Lihat jawaban ${user.nama} untuk ${quiz.title}`}
                      >
                        Lihat jawaban
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setAnalyticsPage(Math.max(1, page - 1))}
        onNext={() => setAnalyticsPage(Math.min(totalPages, page + 1))}
        totalItems={rows.length}
        pageSize={ANALYTICS_PAGE_SIZE}
      />
    </section>
  );
};

export default AnalyticsPage;