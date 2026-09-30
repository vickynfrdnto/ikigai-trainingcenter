import { useState } from "react";

// CSS komponen ini disatukan di file JSX (semua class berawalan "aud-")
const AUD_CSS = `
.aud {
  --aud-ink: #0c122d;
  --aud-muted: #5e6782;
  --aud-line: rgba(148, 163, 184, 0.4);
  --aud-accent: #00bca2;
  --aud-accent-deep: #047857;
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 6px 0 4px;
}
.aud-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  background: rgba(148, 163, 184, 0.08);
  border: 1px solid var(--aud-line);
  border-radius: 16px;
}

/* ── Toggle "Semua karyawan" ── */
.aud-all {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid var(--aud-line);
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.aud-all:hover { border-color: var(--aud-accent); }
.aud-all.is-on { background: #f0fdfa; border-color: var(--aud-accent); }
.aud-all input {
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  margin: 0;
  accent-color: var(--aud-accent-deep);
  cursor: pointer;
}
.aud-all-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.aud-all-title { font-size: 13.5px; font-weight: 700; color: var(--aud-ink); }
.aud-all-sub { font-size: 11.5px; color: var(--aud-muted); line-height: 1.4; }

/* ── Form pilih target ── */
.aud-form { display: flex; flex-direction: column; gap: 10px; transition: opacity 0.15s; }
.aud-form.is-off { opacity: 0.45; pointer-events: none; }
.aud-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.aud-field { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.aud-field:first-child { grid-column: 1 / -1; }
.aud-field-label { font-size: 11px; font-weight: 700; color: var(--aud-muted); padding-left: 4px; }
.aud-field select { width: 100%; }

@container (min-width: 480px) {
  .aud-grid { grid-template-columns: repeat(3, 1fr); }
  .aud-field:first-child { grid-column: auto; }
}

.aud-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  min-height: 42px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  background: var(--aud-ink);
  color: var(--aud-accent);
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.1s, opacity 0.15s;
}
.aud-add:hover:not(:disabled) { transform: translateY(-1px); }
.aud-add:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Daftar target terpilih ── */
.aud-list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  color: var(--aud-muted);
  padding: 0 4px;
}
.aud-count {
  padding: 2px 9px;
  border-radius: 999px;
  background: var(--aud-ink);
  color: var(--aud-accent);
  font-size: 11px;
  font-weight: 800;
}
.aud-list { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }
.aud-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid var(--aud-line);
  border-left: 4px solid var(--aud-accent);
  border-radius: 12px;
}
.aud-item-text { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; min-width: 0; font-size: 12.5px; font-weight: 700; color: var(--aud-ink); }
.aud-sep { color: var(--aud-muted); font-weight: 400; }
.aud-remove {
  flex-shrink: 0;
  padding: 6px 12px;
  border: 1px solid #fecaca;
  border-radius: 999px;
  background: #fff5f5;
  color: #dc2626;
  font: inherit;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
}
.aud-remove:hover { background: #fee2e2; }

.aud-empty {
  padding: 14px;
  border: 1px dashed var(--aud-line);
  border-radius: 12px;
  text-align: center;
  font-size: 12px;
  color: var(--aud-muted);
}
`;

export default function AudienceTargetEditor({ units, departments, jobRoles, value, onChange }) {
  const [unitId, setUnitId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [jobRoleId, setJobRoleId] = useState("");
  const audience = value || { allCompany: false, assignments: [] };

  const addTarget = () => {
    if (!unitId) return;
    const target = { unitId, departmentId: departmentId || null, jobRoleId: jobRoleId || null };
    const exists = audience.assignments.some((item) => item.unitId === target.unitId && item.departmentId === target.departmentId && item.jobRoleId === target.jobRoleId);
    if (!exists) onChange({ allCompany: false, assignments: [...audience.assignments, target] });
    setUnitId("");
    setDepartmentId("");
    setJobRoleId("");
  };

  const describeTarget = (target) => {
    const unit = units.find((item) => item.id === target.unitId)?.name || target.unitId;
    const department = departments.find((item) => item.id === target.departmentId)?.name;
    const role = jobRoles.find((item) => item.id === target.jobRoleId)?.name;
    return [unit, department, role].filter(Boolean);
  };

  const allCompany = !!audience.allCompany;

  return (
    <div className="m-input-group aud">
      <style>{AUD_CSS}</style>
      <label className="m-label">TARGET MATERI</label>

      <div className="aud-panel">
        <label className={`aud-all ${allCompany ? "is-on" : ""}`}>
          <input
            type="checkbox"
            checked={allCompany}
            onChange={(event) => onChange({ allCompany: event.target.checked, assignments: event.target.checked ? [] : audience.assignments })}
          />
          <span className="aud-all-text">
            <span className="aud-all-title">Semua karyawan</span>
            <span className="aud-all-sub">
              {allCompany
                ? "Materi ini tampil untuk seluruh karyawan."
                : "Atau pilih unit, departemen, dan jabatan tertentu di bawah."}
            </span>
          </span>
        </label>

        {!allCompany && (
          <>
            <div className="aud-form">
              <div className="aud-grid">
                <div className="aud-field">
                  <span className="aud-field-label">Unit</span>
                  <select
                    className="m-select-pill"
                    value={unitId}
                    onChange={(event) => { setUnitId(event.target.value); setDepartmentId(""); setJobRoleId(""); }}
                  >
                    <option value="">Pilih unit</option>
                    {units.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </div>
                <div className="aud-field">
                  <span className="aud-field-label">Departemen</span>
                  <select
                    className="m-select-pill"
                    value={departmentId}
                    onChange={(event) => { setDepartmentId(event.target.value); setJobRoleId(""); }}
                    disabled={!unitId}
                  >
                    <option value="">Semua departemen</option>
                    {departments.filter((item) => item.unitId === unitId).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </div>
                <div className="aud-field">
                  <span className="aud-field-label">Jabatan</span>
                  <select
                    className="m-select-pill"
                    value={jobRoleId}
                    onChange={(event) => setJobRoleId(event.target.value)}
                    disabled={!unitId}
                  >
                    <option value="">Semua jabatan</option>
                    {jobRoles.filter((item) => item.unitId === unitId && (!item.departmentId || !departmentId || item.departmentId === departmentId)).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </div>
              </div>

              <button type="button" className="aud-add" onClick={addTarget} disabled={!unitId}>
                + Tambah Target
              </button>
            </div>

            <div>
              <div className="aud-list-head">
                <span>Target terpilih</span>
                <span className="aud-count">{audience.assignments.length}</span>
              </div>
              {audience.assignments.length === 0 ? (
                <div className="aud-empty" style={{ marginTop: 8 }}>
                  Belum ada target. Pilih unit lalu tekan "Tambah Target".
                </div>
              ) : (
                <ul className="aud-list" style={{ marginTop: 8 }}>
                  {audience.assignments.map((target, index) => (
                    <li className="aud-item" key={`${target.unitId}-${target.departmentId}-${target.jobRoleId}-${index}`}>
                      <span className="aud-item-text">
                        {describeTarget(target).map((part, i) => (
                          <span key={i}>
                            {i > 0 && <span className="aud-sep">· </span>}
                            {part}
                          </span>
                        ))}
                      </span>
                      <button
                        type="button"
                        className="aud-remove"
                        onClick={() => onChange({ allCompany: false, assignments: audience.assignments.filter((_, itemIndex) => itemIndex !== index) })}
                        aria-label={`Hapus target ${describeTarget(target).join(" ")}`}
                      >
                        Hapus
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}