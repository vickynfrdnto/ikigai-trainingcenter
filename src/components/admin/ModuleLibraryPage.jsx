import { useEffect, useMemo, useState } from "react";

const DESC_LIMIT = 150; // karakter sebelum deskripsi dipotong
const ROLE_PREVIEW = 3; // jumlah role yang tampil sebelum "+N"

// CSS halaman ini disatukan di file JSX (semua class berawalan "mlib-")
const MLIB_CSS = `
/* ============ Kelola Modul & SOP (mlib) — tempel di akhir AdminPanel.css ============ */
.mlib {
  --mlib-ink: #0c122d;
  --mlib-muted: #5e6782;
  --mlib-line: rgba(148, 163, 184, 0.32);
  --mlib-accent: #00bca2;
  --mlib-accent-deep: #047857;
  --mlib-active: #059669;
  --mlib-draft: #b45309;
  --mlib-archived: #64748b;
}

/* ── Ringkasan status ── */
.mlib-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 4px 0 16px;
}
.mlib-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid var(--mlib-line);
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  font: inherit;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}
.mlib-stat:hover { border-color: var(--mlib-accent); }
.mlib-stat-num { font-size: 22px; font-weight: 800; line-height: 1.1; color: var(--mlib-ink); }
.mlib-stat-label { font-size: 12px; font-weight: 600; color: var(--mlib-muted); }
.mlib-stat.is-active {
  background: var(--mlib-ink);
  border-color: var(--mlib-ink);
  box-shadow: 0 6px 16px rgba(12, 18, 45, 0.18);
}
.mlib-stat.is-active .mlib-stat-num { color: var(--mlib-accent); }
.mlib-stat.is-active .mlib-stat-label { color: #cbd5e1; }

/* ── Toolbar ── */
.mlib-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.mlib-search { flex: 1 1 260px; min-width: 0; }
.mlib-role-select { flex: 0 1 180px; }

.mlib-seg {
  display: inline-flex;
  padding: 3px;
  background: rgba(148, 163, 184, 0.16);
  border-radius: 999px;
}
.mlib-seg button {
  border: 0;
  background: transparent;
  padding: 8px 14px;
  border-radius: 999px;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--mlib-muted);
  cursor: pointer;
  white-space: nowrap;
}
.mlib-seg button.is-active {
  background: #fff;
  color: var(--mlib-ink);
  box-shadow: 0 1px 4px rgba(12, 18, 45, 0.15);
}

.mlib-resultbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 14px 2px 12px;
  font-size: 12.5px;
  color: var(--mlib-muted);
}
.mlib-resultbar strong { color: var(--mlib-ink); }
.mlib-link {
  border: 0;
  background: none;
  padding: 0;
  font: inherit;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--mlib-accent-deep);
  cursor: pointer;
}
.mlib-link:hover { text-decoration: underline; }

/* ── Daftar kartu ── */
.mlib-list { display: flex; flex-direction: column; gap: 12px; }

.mlib-card {
  position: relative;
  display: flex;
  gap: 14px;
  padding: 16px 16px 14px 18px;
  background: #fff;
  border: 1px solid var(--mlib-line);
  border-radius: 16px;
  overflow: hidden;
  transition: box-shadow 0.15s, border-color 0.15s;
}
.mlib-card::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: var(--mlib-active);
}
.mlib-card.mlib-status-draft::before { background: #f59e0b; }
.mlib-card.mlib-status-archived::before { background: #94a3b8; }
.mlib-card.mlib-status-archived { background: #fafbfc; }
.mlib-card.mlib-status-archived .mlib-title { color: var(--mlib-muted); }
.mlib-card:hover { box-shadow: 0 8px 22px rgba(12, 18, 45, 0.08); border-color: rgba(0, 188, 162, 0.45); }

.mlib-type {
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
}
.mlib-type.is-video { background: #e0ecff; color: #2563eb; }
.mlib-type.is-doc { background: #d9f7ee; color: #047857; }

.mlib-main { flex: 1; min-width: 0; }

.mlib-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.mlib-badges { display: flex; flex-wrap: wrap; gap: 6px; }
.mlib-badge {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid transparent;
}
.mlib-badge-active { background: #d1fae5; color: #047857; }
.mlib-badge-draft { background: #fef3c7; color: #92400e; }
.mlib-badge-archived { background: #e2e8f0; color: #475569; }
.mlib-badge-kind { background: #fff; border-color: var(--mlib-line); color: var(--mlib-ink); }
.mlib-badge-cat { background: transparent; border-color: var(--mlib-line); color: var(--mlib-muted); }

.mlib-edit {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 7px 12px;
  background: #fff;
  border: 1px solid var(--mlib-line);
  border-radius: 10px;
  font: inherit;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--mlib-ink);
  cursor: pointer;
}
.mlib-edit:hover { border-color: var(--mlib-accent); color: var(--mlib-accent-deep); }

.mlib-title {
  margin: 8px 0 4px;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.3;
  color: var(--mlib-ink);
  overflow-wrap: anywhere;
}
.mlib-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--mlib-muted);
  max-width: 78ch;
}
.mlib-desc.is-clamped {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.mlib-main > .mlib-link { display: inline-block; margin-top: 4px; }

/* ── Meta ── */
.mlib-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 0;
  padding: 0;
}
.mlib-meta > div {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(148, 163, 184, 0.12);
  border-radius: 10px;
  min-width: 0;
}
.mlib-meta dt { margin: 0; font-size: 11px; font-weight: 600; color: var(--mlib-muted); }
.mlib-meta dd {
  margin: 0;
  font-size: 12.5px;
  font-weight: 800;
  color: var(--mlib-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mlib-meta-wide { flex: 1 1 200px; }

/* ── Footer: role + status ── */
.mlib-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--mlib-line);
}
.mlib-roles { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
.mlib-foot-label { font-size: 11px; font-weight: 700; color: var(--mlib-muted); margin-right: 2px; }
.mlib-role {
  padding: 4px 10px;
  border: 1px solid var(--mlib-accent);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  color: var(--mlib-accent-deep);
  background: #f0fdfa;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.mlib-role-more { border-style: dashed; background: #fff; cursor: help; }
.mlib-role-all { background: var(--mlib-ink); border-color: var(--mlib-ink); color: var(--mlib-accent); text-transform: none; }
.mlib-muted { font-size: 12px; color: var(--mlib-muted); }

.mlib-status-switch {
  display: inline-flex;
  padding: 3px;
  background: rgba(148, 163, 184, 0.16);
  border-radius: 999px;
}
.mlib-status-switch button {
  border: 0;
  background: transparent;
  padding: 6px 13px;
  border-radius: 999px;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  color: var(--mlib-muted);
  cursor: pointer;
}
.mlib-status-switch button:not(:disabled):hover { color: var(--mlib-ink); background: rgba(255, 255, 255, 0.7); }
.mlib-status-switch button.is-current { cursor: default; color: #fff; }
.mlib-status-switch button.is-current.tone-active { background: var(--mlib-active); }
.mlib-status-switch button.is-current.tone-draft { background: #d97706; }
.mlib-status-switch button.is-current.tone-archived { background: var(--mlib-archived); }

/* ── Empty state ── */
.mlib-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 40px 20px;
  text-align: center;
  border: 1px dashed var(--mlib-line);
  border-radius: 16px;
  color: var(--mlib-muted);
}
.mlib-empty strong { color: var(--mlib-ink); font-size: 15px; }
.mlib-empty p { margin: 0 0 8px; font-size: 13px; max-width: 46ch; }
.mlib-empty-icon {
  width: 46px; height: 46px; display: grid; place-items: center;
  border-radius: 14px; background: #d9f7ee; color: var(--mlib-accent-deep);
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .mlib-stats { grid-template-columns: repeat(2, 1fr); }
  .mlib-toolbar { flex-direction: column; align-items: stretch; }
  .mlib-search,
  .mlib-role-select { flex: 0 0 auto; width: 100%; }
  .mlib-seg { display: flex; }
  .mlib-seg button { flex: 1; padding: 8px 6px; }

  .mlib-card { padding: 14px 14px 12px 16px; gap: 12px; }
  .mlib-type { flex-basis: 38px; width: 38px; height: 38px; border-radius: 10px; }
  .mlib-edit span { display: none; }   /* tombol edit jadi ikon saja */
  .mlib-edit { padding: 8px; }

  .mlib-meta > div { flex: 1 1 calc(50% - 8px); justify-content: space-between; }
  .mlib-foot { flex-direction: column; align-items: stretch; }
  .mlib-status-switch { display: flex; }
  .mlib-status-switch button { flex: 1; }
}
`;

const STATUS_ORDER = ["active", "draft", "archived"];
const STATUS_SHORT = { active: "Aktif", draft: "Draft", archived: "Arsip" };

const ModuleLibraryPage = (props) => {
  const {
    IconEdit, IconLibrary, IconPdf, IconSearch, IconVideo,
    LIBRARY_PAGE_SIZE, MODULE_STATUS, Pagination, STATUS_LABEL,
    availableRoles, getModuleStatus, isDocumentContent,
    libraryModules, libraryRoleFilter, librarySearch,
    modules, openEditModule,
    setLibraryRoleFilter, setLibrarySearch, updateModuleStatus,
  } = props;

  // Filter tambahan (status & tipe) + pagination dikelola lokal di halaman ini,
  // supaya jumlah halaman selalu cocok dengan hasil filter yang terlihat.
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(() => new Set());

  const toggleExpanded = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // Hitungan per status dari hasil pencarian/filter role yang sudah aktif di parent
  const counts = useMemo(() => {
    const c = { ALL: libraryModules.length, active: 0, draft: 0, archived: 0 };
    libraryModules.forEach((m) => {
      const s = getModuleStatus(m);
      if (c[s] !== undefined) c[s] += 1;
    });
    return c;
  }, [libraryModules, getModuleStatus]);

  const filtered = useMemo(
    () =>
      libraryModules.filter((m) => {
        if (statusFilter !== "ALL" && getModuleStatus(m) !== statusFilter) return false;
        if (typeFilter === "video" && isDocumentContent(m)) return false;
        if (typeFilter === "document" && !isDocumentContent(m)) return false;
        return true;
      }),
    [libraryModules, statusFilter, typeFilter, getModuleStatus, isDocumentContent]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIBRARY_PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [statusFilter, typeFilter, librarySearch, libraryRoleFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = filtered.slice((page - 1) * LIBRARY_PAGE_SIZE, page * LIBRARY_PAGE_SIZE);

  const hasActiveFilter =
    statusFilter !== "ALL" || typeFilter !== "ALL" || librarySearch.trim() !== "" || libraryRoleFilter !== "ALL";

  const resetFilters = () => {
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setLibrarySearch("");
    setLibraryRoleFilter("ALL");
  };

  const statTabs = [
    { key: "ALL", label: "Semua", tone: "all" },
    { key: "active", label: "Aktif", tone: "active" },
    { key: "draft", label: "Draft", tone: "draft" },
    { key: "archived", label: "Diarsipkan", tone: "archived" },
  ];

  const typeTabs = [
    { key: "ALL", label: "Semua tipe" },
    { key: "video", label: "Video" },
    { key: "document", label: "Dokumen" },
  ];

  const renderRoles = (mod) => {
    if (mod.audience?.allCompany) {
      return <span className="mlib-role mlib-role-all">Seluruh karyawan</span>;
    }
    const roles = (Array.isArray(mod.roleAccess) ? mod.roleAccess : [mod.roleAccess]).filter(Boolean);
    if (roles.length === 0) return <span className="mlib-muted">Belum ditentukan</span>;
    const shown = roles.slice(0, ROLE_PREVIEW);
    const rest = roles.length - shown.length;
    return (
      <>
        {shown.map((r) => (
          <span className="mlib-role" key={r}>{r}</span>
        ))}
        {rest > 0 && (
          <span className="mlib-role mlib-role-more" title={roles.slice(ROLE_PREVIEW).join(", ")}>
            +{rest}
          </span>
        )}
      </>
    );
  };

  return (
    <section className="m-card content-upload-section mlib">
      <style>{MLIB_CSS}</style>
      <div className="m-card-title-box">
        <div className="m-title-icon"><IconLibrary /></div>
        <div>
          <h2 className="m-card-h2">Kelola Modul & SOP</h2>
          <p className="m-card-p">Atur status, urutan, prasyarat, target peserta, dan file materi</p>
        </div>
      </div>

      {/* Ringkasan status — sekaligus jadi filter cepat */}
      <div className="mlib-stats" role="tablist" aria-label="Filter status modul">
        {statTabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={statusFilter === t.key}
            className={`mlib-stat mlib-stat-${t.tone} ${statusFilter === t.key ? "is-active" : ""}`}
            onClick={() => setStatusFilter(t.key)}
          >
            <span className="mlib-stat-num">{counts[t.key]}</span>
            <span className="mlib-stat-label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Toolbar pencarian & filter */}
      <div className="mlib-toolbar">
        <div className="m-search-pill mlib-search">
          <IconSearch />
          <input
            type="text"
            placeholder="Cari judul, deskripsi, atau kategori..."
            value={librarySearch}
            onChange={(e) => setLibrarySearch(e.target.value)}
          />
        </div>

        <select
          className="m-filter-select mlib-role-select"
          value={libraryRoleFilter}
          onChange={(e) => setLibraryRoleFilter(e.target.value)}
          aria-label="Filter role"
        >
          <option value="ALL">Semua role</option>
          {availableRoles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>

        <div className="mlib-seg" role="group" aria-label="Filter tipe konten">
          {typeTabs.map((t) => (
            <button
              key={t.key}
              type="button"
              className={typeFilter === t.key ? "is-active" : ""}
              onClick={() => setTypeFilter(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mlib-resultbar">
        <span>
          Menampilkan <strong>{filtered.length}</strong> dari {modules.length} modul
        </span>
        {hasActiveFilter && (
          <button type="button" className="mlib-link" onClick={resetFilters}>
            Reset filter
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mlib-empty">
          <div className="mlib-empty-icon"><IconLibrary /></div>
          <strong>
            {modules.length === 0 ? "Belum ada modul" : "Tidak ada modul yang cocok"}
          </strong>
          <p>
            {modules.length === 0
              ? 'Konten statis dari data.js tidak bisa dikelola di sini. Tambahkan modul baru lewat tab "Upload Konten".'
              : "Coba ubah kata kunci atau reset filter."}
          </p>
          {modules.length > 0 && hasActiveFilter && (
            <button type="button" className="m-btn-action-sm on" onClick={resetFilters}>
              Reset filter
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mlib-list">
            {pageItems.map((mod) => {
              const status = getModuleStatus(mod);
              const isDoc = isDocumentContent(mod);
              const prereqTitle = modules.find((m) => m.id === mod.prerequisiteId)?.title;
              const desc = mod.description || mod.desc || "";
              const isLong = desc.length > DESC_LIMIT;
              const isOpen = expanded.has(mod.id);
              const attempts = mod.maxAttempts ? `${mod.maxAttempts}x` : "Tanpa batas";

              return (
                <article className={`mlib-card mlib-status-${status}`} key={mod.id}>
                  <div className={`mlib-type ${isDoc ? "is-doc" : "is-video"}`} aria-hidden="true">
                    {isDoc ? <IconPdf /> : <IconVideo />}
                  </div>

                  <div className="mlib-main">
                    <div className="mlib-head">
                      <div className="mlib-badges">
                        <span className={`mlib-badge mlib-badge-${status}`}>{STATUS_LABEL[status]}</span>
                        <span className="mlib-badge mlib-badge-kind">{isDoc ? "Dokumen" : "Video"}</span>
                        {mod.category && <span className="mlib-badge mlib-badge-cat">{mod.category}</span>}
                      </div>
                      <button
                        type="button"
                        className="mlib-edit"
                        onClick={() => openEditModule(mod)}
                        title="Edit modul"
                        aria-label={`Edit modul ${mod.title}`}
                      >
                        <IconEdit /> <span>Edit</span>
                      </button>
                    </div>

                    <h3 className="mlib-title">{mod.title}</h3>

                    <p className={`mlib-desc ${isLong && !isOpen ? "is-clamped" : ""}`}>
                      {desc || "Belum ada deskripsi modul."}
                    </p>
                    {isLong && (
                      <button type="button" className="mlib-link" onClick={() => toggleExpanded(mod.id)}>
                        {isOpen ? "Ringkas" : "Selengkapnya"}
                      </button>
                    )}

                    <dl className="mlib-meta">
                      <div><dt>Urutan</dt><dd>{mod.order ?? 0}</dd></div>
                      <div><dt>KKM</dt><dd>{mod.passingGrade ?? 70}</dd></div>
                      <div><dt>Batas ulang</dt><dd>{attempts}</dd></div>
                      <div className="mlib-meta-wide">
                        <dt>Prasyarat</dt>
                        <dd title={prereqTitle || ""}>{prereqTitle || "Tidak ada"}</dd>
                      </div>
                    </dl>

                    <div className="mlib-foot">
                      <div className="mlib-roles">
                        <span className="mlib-foot-label">Akses</span>
                        {renderRoles(mod)}
                      </div>

                      <div className="mlib-status-switch" role="group" aria-label="Ubah status modul">
                        {STATUS_ORDER.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`${status === s ? "is-current" : ""} tone-${s}`}
                            disabled={status === s}
                            aria-pressed={status === s}
                            onClick={() => updateModuleStatus(mod.id, MODULE_STATUS[s.toUpperCase()])}
                          >
                            {STATUS_SHORT[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            totalItems={filtered.length}
            pageSize={LIBRARY_PAGE_SIZE}
          />
        </>
      )}
    </section>
  );
};

export default ModuleLibraryPage;