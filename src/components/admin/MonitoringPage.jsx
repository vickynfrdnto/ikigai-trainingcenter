// CSS khusus tabel monitoring (semua class berawalan "mon-")
const MON_CSS = `
.mon-tw {
  --mon-ink: #0c122d;
  --mon-muted: #5e6782;
  --mon-line: rgba(148, 163, 184, 0.32);
  --mon-soft: #f1f5f9;
  --mon-accent: #00bca2;
  --mon-accent-deep: #047857;
  --mon-high: #059669;
  --mon-low: #dc2626;
  margin-top: 14px;
  border: 1px solid var(--mon-line);
  border-radius: 14px;
  background: #fff;
  overflow-x: auto;
}
.mon-table { width: 100%; border-collapse: collapse; min-width: 720px; }
.mon-table thead th {
  padding: 12px 16px;
  background: var(--mon-soft);
  border-bottom: 1px solid var(--mon-line);
  font-size: 11.5px;
  font-weight: 800;
  text-align: left;
  color: var(--mon-muted);
  white-space: nowrap;
}
.mon-table tbody td { padding: 12px 16px; border-bottom: 1px solid rgba(148, 163, 184, 0.2); vertical-align: middle; }
.mon-table tbody tr:last-child td { border-bottom: 0; }
.mon-table tbody tr:hover { background: #f8fafc; }
.mon-table .is-right { text-align: right; }

.mon-user { display: flex; align-items: center; gap: 12px; min-width: 0; }
.mon-avatar {
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #059669, #047857);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
}
.mon-user-name { font-size: 13.5px; font-weight: 800; color: var(--mon-ink); }
.mon-user-meta { font-size: 12px; color: var(--mon-muted); }

.mon-code {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid var(--mon-line);
  border-radius: 8px;
  background: var(--mon-soft);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  font-weight: 700;
  color: var(--mon-ink);
  cursor: pointer;
}
.mon-code svg { width: 14px; height: 14px; color: var(--mon-muted); }
.mon-code:hover { border-color: var(--mon-accent); }

.mon-progress { display: flex; align-items: center; gap: 10px; min-width: 140px; }
.mon-track { flex: 1; height: 6px; border-radius: 999px; background: rgba(148, 163, 184, 0.25); overflow: hidden; }
.mon-fill { height: 100%; border-radius: 999px; background: var(--mon-high); }
.mon-fill.mid { background: #f59e0b; }
.mon-fill.low { background: var(--mon-low); }
.mon-pct { min-width: 36px; font-size: 12.5px; font-weight: 800; color: var(--mon-ink); text-align: right; }

.mon-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px; border-radius: 999px; font-size: 11.5px; font-weight: 800; white-space: nowrap; }
.mon-badge::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.mon-badge.on { background: #d1fae5; color: #047857; }
.mon-badge.off { background: #fee2e2; color: #b91c1c; }

.mon-actions { display: inline-flex; gap: 6px; }
.mon-icon-btn {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid var(--mon-line);
  border-radius: 10px;
  background: #fff;
  color: var(--mon-ink);
  cursor: pointer;
}
.mon-icon-btn svg { width: 16px; height: 16px; }
.mon-icon-btn:hover { filter: brightness(0.96); }
.mon-icon-btn.off { color: #dc2626; background: #fff5f5; border-color: #fecaca; }
.mon-icon-btn.on { color: var(--mon-accent-deep); background: #f0fdfa; border-color: rgba(0, 188, 162, 0.5); }
.mon-icon-btn.reset { color: #b45309; background: #fffbeb; border-color: #fde68a; }
.mon-code:focus-visible, .mon-icon-btn:focus-visible { outline: 2px solid var(--mon-accent); outline-offset: 2px; }

.mon-empty-row td { padding: 40px 16px; text-align: center; color: var(--mon-muted); font-size: 13.5px; }

/* ── Mobile: baris tabel jadi kartu ── */
@media (max-width: 720px) {
  .mon-tw { border: 0; background: transparent; overflow: visible; }
  .mon-table { min-width: 0; display: block; }
  .mon-table thead { display: none; }
  .mon-table tbody { display: flex; flex-direction: column; gap: 10px; }
  .mon-table tbody tr {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "user   status"
      "code   code"
      "prog   prog"
      "action action";
    gap: 10px 12px;
    padding: 14px;
    background: #fff;
    border: 1px solid var(--mon-line);
    border-radius: 14px;
  }
  .mon-table tbody td { display: block; padding: 0; border: 0; }
  .mon-c-user { grid-area: user; }
  .mon-c-status { grid-area: status; align-self: start; }
  .mon-c-code { grid-area: code; }
  .mon-c-prog { grid-area: prog; }
  .mon-c-action { grid-area: action; }
  .mon-table .is-right { text-align: left; }
  .mon-actions { width: 100%; }
  .mon-icon-btn { flex: 1; width: auto; height: 40px; }
  .mon-table tbody tr.mon-empty-row { display: block; }
}
`;

const PowerIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v10" />
    <path d="M5.6 5.6a9 9 0 1 0 12.8 0" />
  </svg>
);

const progressTone = (p) => (p >= 70 ? "" : p >= 30 ? "mid" : "low");

const MonitoringPage = (props) => {
  const { IconCopy, IconEdit, IconExcel, IconKey, IconPdf, IconSearch, IconUpload, IconUserPlus, MONITOR_PAGE_SIZE, Pagination, accessRoles, activeCount, availableRoles, avgProgress, canManageUsers, copyToClipboard, departmentFilter, departments, downloadImportTemplate, exportToExcel, exportToPDF, filteredUsers, getUserProgress, handleCreateUser, handleImportFileChange, importFile, isImporting, jobRoles, makeRecordId, monitorPage, monitorTotalPages, newAccessRoleIds, newAssignmentPaths, newDepartmentId, newDivisi, newName, newRole, newUnitId, orgUnitFilter, orgUnits, paginatedUsers, processBulkImport, quizTotal, regenerateAccessCode, roleFilter, search, setDepartmentFilter, setMonitorPage, setNewAccessRoleIds, setNewAssignmentPaths, setNewDepartmentId, setNewDivisi, setNewName, setNewRole, setNewUnitId, setOrgUnitFilter, setRoleFilter, setSearch, setSelectedEmployee, toggleStatus, users } = props;
  return (
<>
            <style>{MON_CSS}</style>

            {/* Quick Metrics Bar (2x2 Grid di HP) */}
            <div className="m-metrics-grid">
              <div className="m-metric-card">
                <span className="m-met-label">TOTAL USERS</span>
                <span className="m-met-value">{users.length}</span>
                <span className="m-met-sub">Karyawan Terdaftar</span>
              </div>

              <div className="m-metric-card highlight-emerald">
                <span className="m-met-label">AKUN AKTIF</span>
                <span className="m-met-value text-emerald">{activeCount}</span>
                <span className="m-met-sub">Bisa Akses Modul</span>
              </div>

              <div className="m-metric-card">
                <span className="m-met-label">RATA PROGRES</span>
                <span className="m-met-value text-gold">{avgProgress}%</span>
                <span className="m-met-sub">Seluruh Modul</span>
              </div>

              <div className="m-metric-card">
                <span className="m-met-label">KUIS LULUS</span>
                <span className="m-met-value text-emerald">{quizTotal}</span>
                <span className="m-met-sub">Evaluasi Selesai</span>
              </div>
            </div>

            {/* Layout Main Sections */}
            <div className="m-layout-grid">

              {/* Form Tambah Karyawan */}
              {canManageUsers && <section className="m-card form-section">
                <div className="m-card-title-box">
                  <div className="m-title-icon"><IconUserPlus /></div>
                  <div>
                    <h2 className="m-card-h2">Registrasi Karyawan</h2>
                    <p className="m-card-p">Buat kode akses baru secara otomatis</p>
                  </div>
                </div>

                <form onSubmit={handleCreateUser} className="m-form-stack">
                  <div className="m-input-group">
                    <label className="m-label">NAMA LENGKAP</label>
                    <input
                      className="m-input-pill"
                      type="text"
                      placeholder="Masukkan nama karyawan..."
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                    />
                  </div>

                  <div className="m-input-group">
                    <label className="m-label">UNIT</label>
                    <select className="m-select-pill" value={newUnitId} onChange={e => { setNewUnitId(e.target.value); setNewDepartmentId(""); setNewRole(""); }} required>
                      <option value="">Pilih unit</option>
                      {orgUnits.map(unit => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
                    </select>
                  </div>

                  {orgUnits.find(unit => unit.id === newUnitId)?.requiresDepartment && (
                    <div className="m-input-group">
                      <label className="m-label">DEPARTEMEN</label>
                      <select className="m-select-pill" value={newDepartmentId} onChange={e => { setNewDepartmentId(e.target.value); setNewRole(""); }} required>
                        <option value="">Pilih departemen</option>
                        {departments.filter(item => item.unitId === newUnitId).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                      </select>
                    </div>
                  )}

                  {newUnitId === "operasional" && (
                    <div className="m-input-group">
                      <label className="m-label">OUTLET / LOKASI</label>
                      <input className="m-input-pill" type="text" placeholder="Contoh: Bintaro / Alam Sutera" value={newDivisi} onChange={e => setNewDivisi(e.target.value)} />
                    </div>
                  )}

                  <div className="m-input-group">
                    <label className="m-label">ROLE / JABATAN UTAMA</label>
                    <select className="m-select-pill" value={newRole} onChange={e => setNewRole(e.target.value)} required>
                      <option value="">Pilih jabatan</option>
                      {jobRoles.filter(item => item.unitId === newUnitId && (!item.departmentId || item.departmentId === newDepartmentId)).map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
                      {jobRoles.length === 0 && availableRoles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>

                  {newAssignmentPaths.length > 0 && <p className="m-card-p">Jalur tambahan: {newAssignmentPaths.map(path => `${orgUnits.find(unit => unit.id === path.unitId)?.name || path.unitId} / ${jobRoles.find(role => role.id === path.jobRoleId)?.name || path.jobRoleId}`).join(" · ")}</p>}
                  {newRole && <button type="button" className="m-btn-export excel" onClick={() => {
                    const role = jobRoles.find(item => item.name === newRole && item.unitId === newUnitId && (item.departmentId || "") === newDepartmentId);
                    const extra = { unitId: newUnitId, departmentId: newDepartmentId || null, jobRoleId: role?.id || makeRecordId(newRole), outletId: newDivisi.trim() || null };
                    setNewAssignmentPaths(paths => [...paths, extra]);
                    setNewRole("");
                  }}>Tambah Jalur Lain</button>}

                  {accessRoles.length > 0 && (
                    <div className="m-input-group">
                      <label className="m-label">ROLE HAK AKSES</label>
                      <div className="m-role-pill-group">
                        {accessRoles.map((accessRole) => (
                          <label className="m-role-pill" key={accessRole.id}>
                            <input type="checkbox" checked={newAccessRoleIds.includes(accessRole.id)} onChange={(event) => setNewAccessRoleIds((current) => event.target.checked ? [...current, accessRole.id] : current.filter((id) => id !== accessRole.id))} />
                            {accessRole.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <button type="submit" className="m-btn-primary-emerald">
                    <IconUserPlus /> Generate Kode Akses Baru
                  </button>
                </form>

                {/* 📥 Bulk Import Karyawan */}
                <div className="m-export-box">
                  <span className="m-export-title">IMPORT KARYAWAN MASSAL (EXCEL/CSV):</span>
                  <p className="m-card-p" style={{ marginTop: 2, marginBottom: 8 }}>
                    Kolom: <strong>Nama</strong>, <strong>Unit</strong>, <strong>Departemen</strong>, <strong>Jabatan</strong>, dan <strong>Outlet</strong>. Kolom lama tetap diterima.
                  </p>
                  <div className="m-export-btn-group">
                    <button type="button" className="m-btn-export excel" onClick={downloadImportTemplate}>
                      <IconExcel /> Unduh Template
                    </button>
                    <label className="m-btn-export pdf" style={{ cursor: "pointer" }}>
                      <IconUpload /> {importFile ? importFile.name : "Pilih File"}
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleImportFileChange}
                        hidden
                      />
                    </label>
                  </div>
                  {importFile && (
                    <button
                      type="button"
                      className="m-btn-primary-emerald"
                      style={{ marginTop: 10 }}
                      disabled={isImporting}
                      onClick={processBulkImport}
                    >
                      {isImporting ? "Mengimpor..." : `Proses Import (${importFile.name})`}
                    </button>
                  )}
                </div>

                <div className="m-export-box">
                  <span className="m-export-title">EXPORT REKAP DATA:</span>
                  <div className="m-export-btn-group">
                    <button className="m-btn-export excel" onClick={exportToExcel}>
                      <IconExcel /> Export Excel
                    </button>
                    <button className="m-btn-export pdf" onClick={exportToPDF}>
                      <IconPdf /> Export PDF
                    </button>
                  </div>
                </div>
              </section>}

              {/* Tabel / Cards Monitoring User */}
              <section className="m-card table-section">
                <div className="m-filter-bar">
                  <div className="m-search-pill">
                    <IconSearch />
                    <input
                      type="text"
                      placeholder="Cari nama atau kode..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>

                  <select
                    className="m-filter-select"
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                  >
                    <option value="ALL">SEMUA ROLE</option>
                    {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <select className="m-filter-select" value={orgUnitFilter} onChange={e => setOrgUnitFilter(e.target.value)}>
                    <option value="ALL">SEMUA UNIT</option>
                    {orgUnits.map(unit => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
                  </select>
                  <select className="m-filter-select" value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
                    <option value="ALL">SEMUA DEPARTEMEN</option>
                    {departments.filter(item => orgUnitFilter === "ALL" || item.unitId === orgUnitFilter).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </div>

                {/* Tabel monitoring karyawan (dirapikan) */}
                <div className="mon-tw">
                  <table className="mon-table">
                    <thead>
                      <tr>
                        <th>Karyawan</th>
                        <th>Kode akses</th>
                        <th>Progres</th>
                        <th>Status</th>
                        {canManageUsers && <th>Aksi</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr className="mon-empty-row">
                          <td colSpan={canManageUsers ? 5 : 4}>Tidak ada karyawan ditemukan.</td>
                        </tr>
                      ) : (
                        paginatedUsers.map(u => {
                          const userProgress = getUserProgress(u);
                          const isActive = u.status === "Active";
                          return (
                            <tr key={u.id}>
                              <td className="mon-c-user">
                                <div className="mon-user">
                                  <div className="mon-avatar">{u.nama?.[0]?.toUpperCase() || "U"}</div>
                                  <div>
                                    <div className="mon-user-name">{u.nama}</div>
                                    <div className="mon-user-meta">{u.divisi || "Outlet"} • {u.role}</div>
                                  </div>
                                </div>
                              </td>

                              <td className="mon-c-code">
                                <button
                                  type="button"
                                  className="mon-code"
                                  onClick={() => copyToClipboard(u.kode || u.id)}
                                  title="Klik untuk salin kode"
                                  aria-label={`Salin kode akses ${u.nama}`}
                                >
                                  <span>{u.kode || u.id}</span>
                                  <IconCopy />
                                </button>
                              </td>

                              <td className="mon-c-prog">
                                <div className="mon-progress">
                                  <div className="mon-track" aria-hidden="true">
                                    <div
                                      className={`mon-fill ${progressTone(userProgress)}`}
                                      style={{ width: `${Math.min(100, Math.max(0, userProgress))}%` }}
                                    />
                                  </div>
                                  <span className="mon-pct">{userProgress}%</span>
                                </div>
                              </td>

                              <td className="mon-c-status">
                                <span className={`mon-badge ${isActive ? "on" : "off"}`}>
                                  {isActive ? "Aktif" : "Nonaktif"}
                                </span>
                              </td>

                              {canManageUsers && (
                                <td className="mon-c-action">
                                  <div className="mon-actions">
                                    <button type="button" className="mon-icon-btn" onClick={() => setSelectedEmployee(u)} aria-label={`Edit profil ${u.nama}`} title="Edit profil">
                                      <IconEdit />
                                    </button>
                                    <button
                                      type="button"
                                      className={`mon-icon-btn ${isActive ? "off" : "on"}`}
                                      onClick={() => toggleStatus(u)}
                                      aria-label={`${isActive ? "Matikan" : "Aktifkan"} akses ${u.nama}`}
                                      title={isActive ? "Matikan akses" : "Aktifkan akses"}
                                    >
                                      <PowerIcon />
                                    </button>
                                    <button
                                      type="button"
                                      className="mon-icon-btn reset"
                                      onClick={() => regenerateAccessCode(u)}
                                      title="Reset kode akses karyawan ini"
                                      aria-label={`Reset kode akses ${u.nama}`}
                                    >
                                      <IconKey />
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  page={monitorPage}
                  totalPages={monitorTotalPages}
                  onPrev={() => setMonitorPage(p => Math.max(1, p - 1))}
                  onNext={() => setMonitorPage(p => Math.min(monitorTotalPages, p + 1))}
                  totalItems={filteredUsers.length}
                  pageSize={MONITOR_PAGE_SIZE}
                />
              </section>

            </div>
          </>
  );
};

export default MonitoringPage;