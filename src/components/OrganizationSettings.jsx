import { useEffect, useMemo, useRef, useState } from "react";
import { onValue, ref } from "firebase/database";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../firebase-config";
import { makeRecordId, PERMISSION_CATALOG, SCOPE_TYPES } from "../domain/organization";

const emptyForm = { name: "", unitId: "", departmentId: "", requiresDepartment: false };
const emptyAccessForm = { name: "", permissions: [], scopeType: "all", scopeId: "" };

// CSS halaman ini disatukan di file JSX (semua class berawalan "org-")
const ORG_CSS = `
.org {
  --org-ink: #0c122d;
  --org-muted: #5e6782;
  --org-line: rgba(148, 163, 184, 0.32);
  --org-soft: #f1f5f9;
  --org-accent: #00bca2;
  --org-accent-deep: #047857;
  --org-low: #dc2626;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Header ── */
.org-head { display: flex; align-items: center; gap: 12px; }
.org-head-icon {
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #f0fdfa;
  color: var(--org-accent-deep);
}
.org-head-icon svg { width: 22px; height: 22px; }
.org-title { margin: 0; font-size: 20px; font-weight: 800; color: var(--org-ink); }
.org-sub { margin: 2px 0 0; font-size: 13px; color: var(--org-muted); }

/* ── Tombol ── */
.org-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid var(--org-line);
  background: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  color: var(--org-ink);
  cursor: pointer;
  white-space: nowrap;
}
.org-btn:hover { filter: brightness(0.97); }
.org-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.org-btn.is-primary { background: #064e3b; border-color: #064e3b; color: #fff; }
.org-btn.is-block { width: 100%; }
.org-btn:focus-visible, .org-tab:focus-visible, .org-mini:focus-visible { outline: 2px solid var(--org-accent); outline-offset: 2px; }

/* ── Callout struktur awal ── */
.org-callout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px 18px;
  border: 1px dashed rgba(0, 188, 162, 0.6);
  border-radius: 16px;
  background: #f0fdfa;
}
.org-callout strong { display: block; font-size: 14px; color: var(--org-ink); }
.org-callout p { margin: 2px 0 0; font-size: 13px; color: var(--org-muted); max-width: 60ch; }

/* ── Tab ── */
.org-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: rgba(148, 163, 184, 0.16);
  border-radius: 999px;
  overflow-x: auto;
}
.org-tab {
  flex: 1 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  background: transparent;
  padding: 10px 18px;
  border-radius: 999px;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  color: var(--org-muted);
  cursor: pointer;
  white-space: nowrap;
}
.org-tab.is-active { background: #fff; color: var(--org-ink); box-shadow: 0 1px 4px rgba(12, 18, 45, 0.15); }
.org-count {
  min-width: 22px;
  padding: 1px 7px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.25);
  font-size: 11.5px;
  font-weight: 800;
  text-align: center;
}
.org-tab.is-active .org-count { background: #d1fae5; color: var(--org-accent-deep); }

/* ── Layout ── */
.org-grid { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 16px; align-items: start; }
.org-card { background: #fff; border: 1px solid var(--org-line); border-radius: 18px; padding: 16px; }
.org-form-card { position: sticky; top: 16px; }
.org-card-title { margin: 0; font-size: 15px; font-weight: 800; color: var(--org-ink); }
.org-card-note { margin: 2px 0 0; font-size: 12.5px; color: var(--org-muted); line-height: 1.5; }

/* ── Daftar ── */
.org-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.org-search {
  flex: 1 1 220px;
  min-height: 42px;
  box-sizing: border-box;
  padding: 0 16px;
  border: 1px solid var(--org-line);
  border-radius: 999px;
  background: #fff;
  font: inherit;
  font-size: 13.5px;
  color: var(--org-ink);
}
.org-search:focus { outline: 0; border-color: var(--org-accent); box-shadow: 0 0 0 3px rgba(0, 188, 162, 0.18); }
.org-total { font-size: 12.5px; color: var(--org-muted); white-space: nowrap; }
.org-total strong { color: var(--org-ink); }

.org-group + .org-group { margin-top: 14px; }
.org-group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 6px;
  padding: 0 4px;
  font-size: 12.5px;
  font-weight: 800;
  color: var(--org-muted);
}

.org-list { border: 1px solid var(--org-line); border-radius: 14px; overflow: hidden; }
.org-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  background: #fff;
}
.org-row:last-child { border-bottom: 0; }
.org-row:hover { background: #f8fafc; }
.org-row.is-editing { background: #f0fdfa; box-shadow: inset 3px 0 0 var(--org-accent); }
.org-row-main { min-width: 0; }
.org-row-name { font-size: 13.5px; font-weight: 800; color: var(--org-ink); }
.org-row-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 4px; font-size: 12px; color: var(--org-muted); }
.org-row-actions { display: flex; gap: 6px; flex: 0 0 auto; }
.org-mini {
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid var(--org-line);
  border-radius: 10px;
  background: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  color: var(--org-ink);
  cursor: pointer;
}
.org-mini:hover { border-color: var(--org-accent); color: var(--org-accent-deep); }
.org-mini.is-danger { color: var(--org-low); }
.org-mini.is-danger:hover { border-color: #fecaca; background: #fff5f5; color: var(--org-low); }

.org-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 999px;
  background: var(--org-soft);
  font-size: 11.5px;
  font-weight: 700;
  color: var(--org-muted);
}
.org-tag.is-accent { background: #d1fae5; color: var(--org-accent-deep); }
.org-tag.is-scope { background: #eef2ff; color: #4338ca; }

.org-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 36px 20px;
  text-align: center;
  border: 1px dashed var(--org-line);
  border-radius: 14px;
  color: var(--org-muted);
}
.org-empty strong { color: var(--org-ink); font-size: 14.5px; }
.org-empty p { margin: 0; font-size: 13px; max-width: 44ch; }

/* ── Form ── */
.org-form { display: flex; flex-direction: column; gap: 14px; margin-top: 14px; }
.org-field { display: flex; flex-direction: column; gap: 6px; }
.org-label { font-size: 12.5px; font-weight: 700; color: var(--org-ink); }
.org-label small { font-weight: 600; color: var(--org-muted); }
.org-hint { margin: 0; font-size: 12px; color: var(--org-muted); line-height: 1.5; }
.org .org-control {
  width: 100%;
  box-sizing: border-box;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid var(--org-line);
  border-radius: 12px;
  background: #fff;
  font: inherit;
  font-size: 13.5px;
  color: var(--org-ink);
}
.org .org-control:focus { outline: 0; border-color: var(--org-accent); box-shadow: 0 0 0 3px rgba(0, 188, 162, 0.18); }

.org-switch {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid var(--org-line);
  border-radius: 12px;
  cursor: pointer;
}
.org-switch input { margin-top: 3px; accent-color: #059669; }
.org-switch strong { display: block; font-size: 13px; color: var(--org-ink); }
.org-switch span { font-size: 12px; color: var(--org-muted); line-height: 1.5; }
.org-switch:has(input:checked) { background: #f0fdfa; border-color: var(--org-accent); }

.org-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.org-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid var(--org-line);
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--org-ink);
  cursor: pointer;
}
.org-pill input { accent-color: #059669; }
.org-pill:has(input:checked) { background: #f0fdfa; border-color: var(--org-accent); color: var(--org-accent-deep); }

.org-form-actions { display: flex; flex-direction: column; gap: 8px; }

/* ── Responsif ── */
@media (max-width: 900px) {
  .org-grid { grid-template-columns: 1fr; }
  .org-form-card { position: static; order: -1; }
  .org-callout .org-btn { width: 100%; }
}
@media (max-width: 560px) {
  .org-row { flex-direction: column; align-items: stretch; }
  .org-row-actions { width: 100%; }
  .org-row-actions .org-mini { flex: 1; min-height: 38px; }
}
`;

const SECTIONS = [
  { id: "units", label: "Unit", singular: "unit", placeholder: "Contoh: Operasional" },
  { id: "departments", label: "Departemen", singular: "departemen", placeholder: "Contoh: Finance" },
  { id: "jobRoles", label: "Jabatan", singular: "jabatan", placeholder: "Contoh: Kasir" },
  { id: "accessRoles", label: "Hak Akses", singular: "role hak akses", placeholder: "Contoh: Admin Outlet" },
];

const scopeLabel = (scope) =>
  scope === "all" ? "Semua data" : scope === "unit" ? "Per unit" : scope === "department" ? "Per departemen" : "Per outlet";

const OrgIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="2" width="6" height="6" rx="1" />
    <rect x="2" y="16" width="6" height="6" rx="1" />
    <rect x="16" y="16" width="6" height="6" rx="1" />
    <path d="M12 8v4M5 16v-2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2" />
  </svg>
);

export default function OrganizationSettings({ showToast }) {
  const [units, setUnits] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [accessRoles, setAccessRoles] = useState([]);
  const [section, setSection] = useState("units");
  const [form, setForm] = useState(emptyForm);
  const [editingMasterId, setEditingMasterId] = useState(null);
  const [accessForm, setAccessForm] = useState(emptyAccessForm);
  const [editingAccessId, setEditingAccessId] = useState(null);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const refs = ["orgUnits", "departments", "jobRoles", "accessRoles"];
    const setters = [setUnits, setDepartments, setJobRoles, setAccessRoles];
    const unsubscribers = refs.map((path, index) => onValue(ref(db, path), (snapshot) => {
      const data = snapshot.val() || {};
      setters[index](Object.entries(data).map(([id, value]) => ({ id, ...value })));
    }));
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  const activeUnits = useMemo(() => units.filter((item) => item.active !== false), [units]);
  const activeDepartments = useMemo(() => departments.filter((item) => item.active !== false), [departments]);
  const activeJobRoles = useMemo(() => jobRoles.filter((item) => item.active !== false), [jobRoles]);
  const activeAccessRoles = useMemo(() => accessRoles.filter((item) => item.active !== false), [accessRoles]);

  const unitName = (id) => units.find((unit) => unit.id === id)?.name || "Unit tidak ditemukan";
  const departmentName = (id) => departments.find((department) => department.id === id)?.name || "Departemen";

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const resetMasterForm = () => {
    setForm(emptyForm);
    setEditingMasterId(null);
  };

  const resetAccessForm = () => {
    setAccessForm(emptyAccessForm);
    setEditingAccessId(null);
  };

  const changeSection = (id) => {
    setSection(id);
    setQuery("");
    resetMasterForm();
    resetAccessForm();
  };

  const saveMasterRecord = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const baseId = makeRecordId(name);
    if (!baseId) return showToast("Masukkan nama terlebih dahulu.", "error");
    const id = editingMasterId || (section === "units" ? baseId : section === "departments"
      ? `${form.unitId}-${baseId}`
      : `${form.unitId}-${form.departmentId || "all"}-${baseId}`);
    const collection = section === "units" ? units : section === "departments" ? departments : jobRoles;
    const duplicate = collection.some((item) => item.id !== id && item.name?.toLowerCase() === name.toLowerCase() &&
      (section === "units" || (item.unitId === form.unitId && (section !== "jobRoles" || item.departmentId === (form.departmentId || null)))));
    if (duplicate) return showToast("Nama sudah digunakan pada struktur tersebut.", "error");

    const record = section === "units"
      ? { name, requiresDepartment: !!form.requiresDepartment, active: true, updatedAt: Date.now() }
      : section === "departments"
        ? { name, unitId: form.unitId, active: true, updatedAt: Date.now() }
        : { name, unitId: form.unitId, departmentId: form.departmentId || null, active: true, updatedAt: Date.now() };
    if (section !== "units" && !record.unitId) return showToast("Pilih unit terlebih dahulu.", "error");
    if (section === "departments" && !units.find((unit) => unit.id === form.unitId)?.requiresDepartment) {
      return showToast("Departemen hanya dibuat pada unit yang memerlukannya.", "error");
    }

    setSaving(true);
    try {
      await httpsCallable(functions, "saveOrganizationRecord")({ collection: section === "units" ? "orgUnits" : section, id, record });
      resetMasterForm();
      showToast("Data organisasi berhasil disimpan.", "success");
    } catch (error) {
      console.error("SAVE ORGANIZATION ERROR:", error);
      showToast("Gagal menyimpan data organisasi.", "error");
    } finally {
      setSaving(false);
    }
  };

  const deactivateRecord = async (collection, item) => {
    const path = collection === "units" ? "orgUnits" : collection;
    const uses = collection === "units"
      ? [...departments.filter((entry) => entry.unitId === item.id), ...jobRoles.filter((entry) => entry.unitId === item.id)]
      : collection === "departments"
        ? jobRoles.filter((entry) => entry.departmentId === item.id)
        : [];
    if (uses.length) return showToast("Pindahkan data terkait sebelum menonaktifkan item ini.", "error");
    if (!window.confirm(`Nonaktifkan "${item.name}"?`)) return undefined;

    try {
      await httpsCallable(functions, "deactivateOrganizationRecord")({ collection: path, id: item.id });
      if (editingMasterId === item.id) resetMasterForm();
      showToast("Data berhasil dinonaktifkan.", "success");
    } catch (error) {
      console.error("DEACTIVATE ORGANIZATION ERROR:", error);
      showToast("Gagal menonaktifkan data.", "error");
    }
    return undefined;
  };

  const saveAccessRole = async (event) => {
    event.preventDefault();
    const name = accessForm.name.trim();
    const id = editingAccessId || makeRecordId(name);
    if (!id) return showToast("Masukkan nama role akses.", "error");
    if (!accessForm.permissions.length) return showToast("Pilih minimal satu hak akses.", "error");
    const scopeId = accessForm.scopeType === "all" ? null : accessForm.scopeId;
    if (accessForm.scopeType !== "all" && !scopeId) return showToast("Pilih cakupan data.", "error");

    setSaving(true);
    try {
      await httpsCallable(functions, "saveOrganizationRecord")({ collection: "accessRoles", id, record: { name, permissions: accessForm.permissions, scope: { type: accessForm.scopeType, id: scopeId }, active: true, updatedAt: Date.now() } });
      resetAccessForm();
      showToast("Role hak akses berhasil disimpan.", "success");
    } catch (error) {
      console.error("SAVE ACCESS ROLE ERROR:", error);
      showToast("Gagal menyimpan role hak akses.", "error");
    } finally {
      setSaving(false);
    }
    return undefined;
  };

  const deactivateAccessRole = async (item) => {
    if (!window.confirm(`Nonaktifkan role "${item.name}"?`)) return;
    try {
      await httpsCallable(functions, "deactivateOrganizationRecord")({ collection: "accessRoles", id: item.id });
      if (editingAccessId === item.id) resetAccessForm();
      showToast("Role hak akses berhasil dinonaktifkan.", "success");
    } catch (error) {
      console.error("DEACTIVATE ACCESS ROLE ERROR:", error);
      showToast("Gagal menonaktifkan role hak akses.", "error");
    }
  };

  const seedInitialStructure = async () => {
    if (units.length) return showToast("Struktur unit sudah tersedia.", "info");
    try {
      await httpsCallable(functions, "seedOrganizationDefaults")();
      showToast("Struktur awal Operasional dan Head Office berhasil dibuat.", "success");
    } catch (error) {
      console.error("SEED ORGANIZATION ERROR:", error);
      showToast("Gagal membuat struktur awal.", "error");
    }
    return undefined;
  };

  const startEditMaster = (item) => {
    setEditingMasterId(item.id);
    setForm({ name: item.name, unitId: item.unitId || "", departmentId: item.departmentId || "", requiresDepartment: !!item.requiresDepartment });
    scrollToForm();
  };

  const startEditAccess = (item) => {
    setEditingAccessId(item.id);
    setAccessForm({ name: item.name, permissions: item.permissions || [], scopeType: item.scope?.type || "all", scopeId: item.scope?.id || "" });
    scrollToForm();
  };

  const isAccess = section === "accessRoles";
  const current = SECTIONS.find((item) => item.id === section);
  const editing = isAccess ? !!editingAccessId : !!editingMasterId;

  const counts = {
    units: activeUnits.length,
    departments: activeDepartments.length,
    jobRoles: activeJobRoles.length,
    accessRoles: activeAccessRoles.length,
  };

  const masterItems = section === "units" ? activeUnits : section === "departments" ? activeDepartments : activeJobRoles;
  const listItems = isAccess ? activeAccessRoles : masterItems;
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? listItems.filter((item) => String(item.name || "").toLowerCase().includes(q)) : listItems;
  }, [listItems, query]);

  // Departemen & jabatan dikelompokkan per unit supaya tetap rapi saat datanya banyak
  const groups = useMemo(() => {
    if (section === "units" || isAccess) return [{ key: "all", title: null, items: filteredItems }];
    const byUnit = new Map();
    filteredItems.forEach((item) => {
      const key = item.unitId || "-";
      if (!byUnit.has(key)) byUnit.set(key, []);
      byUnit.get(key).push(item);
    });
    const ordered = [];
    activeUnits.forEach((unit) => {
      if (byUnit.has(unit.id)) {
        ordered.push({ key: unit.id, title: unit.name, items: byUnit.get(unit.id) });
        byUnit.delete(unit.id);
      }
    });
    byUnit.forEach((items, key) => ordered.push({ key, title: "Unit tidak ditemukan", items }));
    return ordered;
  }, [section, isAccess, filteredItems, activeUnits]);

  const selectableScope = accessForm.scopeType === "unit" ? activeUnits
    : accessForm.scopeType === "department" ? activeDepartments : [];

  // Departemen hanya bisa dibuat pada unit yang mewajibkannya
  const unitOptions = section === "departments"
    ? activeUnits.filter((unit) => unit.requiresDepartment || unit.id === form.unitId)
    : activeUnits;
  const noUnitNeedsDepartment = section === "departments" && !activeUnits.some((unit) => unit.requiresDepartment);

  const renderRowMeta = (item) => {
    if (section === "units") {
      const deptCount = activeDepartments.filter((entry) => entry.unitId === item.id).length;
      const roleCount = activeJobRoles.filter((entry) => entry.unitId === item.id).length;
      return (
        <>
          <span className={`org-tag ${item.requiresDepartment ? "is-accent" : ""}`}>
            {item.requiresDepartment ? "Departemen wajib" : "Departemen opsional"}
          </span>
          <span>{deptCount} departemen · {roleCount} jabatan</span>
        </>
      );
    }
    if (section === "departments") {
      const roleCount = activeJobRoles.filter((entry) => entry.departmentId === item.id).length;
      return <span>{roleCount} jabatan</span>;
    }
    return (
      <span className="org-tag">
        {item.departmentId ? departmentName(item.departmentId) : "Semua departemen"}
      </span>
    );
  };

  return (
    <div className="org">
      <style>{ORG_CSS}</style>

      <div className="org-head">
        <div className="org-head-icon"><OrgIcon /></div>
        <div>
          <h2 className="org-title">Struktur organisasi</h2>
          <p className="org-sub">Atur unit, departemen, jabatan, dan hak akses karyawan.</p>
        </div>
      </div>

      {!units.length && (
        <div className="org-callout">
          <div>
            <strong>Belum ada struktur organisasi</strong>
            <p>Mulai cepat dengan struktur awal Operasional dan Head Office, atau buat unit pertama Anda secara manual.</p>
          </div>
          <button type="button" className="org-btn is-primary" onClick={seedInitialStructure}>
            Buat struktur awal
          </button>
        </div>
      )}

      <div className="org-tabs" role="tablist" aria-label="Kategori struktur organisasi">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={section === id}
            className={`org-tab ${section === id ? "is-active" : ""}`}
            onClick={() => changeSection(id)}
          >
            {label}
            <span className="org-count">{counts[id]}</span>
          </button>
        ))}
      </div>

      <div className="org-grid">
        {/* Daftar */}
        <section className="org-card">
          <div className="org-toolbar">
            <input
              className="org-search"
              type="text"
              placeholder={`Cari ${current.singular}...`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label={`Cari ${current.singular}`}
            />
            <span className="org-total"><strong>{filteredItems.length}</strong> {current.singular}</span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="org-empty">
              <strong>{query ? "Tidak ada yang cocok" : `Belum ada ${current.singular}`}</strong>
              <p>
                {query
                  ? "Coba kata kunci lain."
                  : "Tambahkan lewat formulir di samping, datanya akan muncul di sini."}
              </p>
              {query && <button type="button" className="org-btn" onClick={() => setQuery("")}>Hapus pencarian</button>}
            </div>
          ) : (
            groups.map((group) => (
              <div className="org-group" key={group.key}>
                {group.title && <h3 className="org-group-title">{group.title} <span className="org-count">{group.items.length}</span></h3>}
                <div className="org-list">
                  {group.items.map((item) => {
                    const isEditing = isAccess ? editingAccessId === item.id : editingMasterId === item.id;
                    return (
                      <div className={`org-row ${isEditing ? "is-editing" : ""}`} key={item.id}>
                        <div className="org-row-main">
                          <div className="org-row-name">{item.name}</div>
                          <div className="org-row-meta">
                            {isAccess ? (
                              <>
                                {(item.permissions || []).map((id) => (
                                  <span className="org-tag is-accent" key={id}>
                                    {PERMISSION_CATALOG.find((entry) => entry.id === id)?.label || id}
                                  </span>
                                ))}
                                <span className="org-tag is-scope">Cakupan: {scopeLabel(item.scope?.type || "all")}</span>
                              </>
                            ) : renderRowMeta(item)}
                          </div>
                        </div>
                        <div className="org-row-actions">
                          <button type="button" className="org-mini" onClick={() => (isAccess ? startEditAccess(item) : startEditMaster(item))}>
                            Ubah
                          </button>
                          <button
                            type="button"
                            className="org-mini is-danger"
                            onClick={() => (isAccess ? deactivateAccessRole(item) : deactivateRecord(section === "units" ? "units" : section, item))}
                          >
                            Nonaktifkan
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Formulir */}
        <section className="org-card org-form-card" ref={formRef}>
          <h3 className="org-card-title">{editing ? `Ubah ${current.singular}` : `Tambah ${current.singular}`}</h3>
          <p className="org-card-note">
            {isAccess
              ? "Tentukan apa yang boleh dilakukan dan data mana yang boleh dilihat."
              : editing
                ? "Simpan perubahan, atau batalkan untuk kembali menambah data baru."
                : `Data baru langsung muncul di daftar ${current.singular}.`}
          </p>

          {!isAccess ? (
            <form className="org-form" onSubmit={saveMasterRecord}>
              <div className="org-field">
                <label className="org-label" htmlFor="org-name">Nama {current.singular}</label>
                <input
                  id="org-name"
                  className="org-control"
                  placeholder={current.placeholder}
                  value={form.name}
                  onChange={(event) => setForm((c) => ({ ...c, name: event.target.value }))}
                  required
                />
              </div>

              {section !== "units" && (
                <div className="org-field">
                  <label className="org-label" htmlFor="org-unit">Unit</label>
                  <select
                    id="org-unit"
                    className="org-control"
                    value={form.unitId}
                    onChange={(event) => setForm((c) => ({ ...c, unitId: event.target.value, departmentId: "" }))}
                    required
                  >
                    <option value="">Pilih unit</option>
                    {unitOptions.map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
                  </select>
                  {noUnitNeedsDepartment && (
                    <p className="org-hint">Belum ada unit yang mewajibkan departemen. Aktifkan opsi tersebut di tab Unit terlebih dahulu.</p>
                  )}
                </div>
              )}

              {section === "jobRoles" && activeDepartments.some((item) => item.unitId === form.unitId) && (
                <div className="org-field">
                  <label className="org-label" htmlFor="org-dept">Departemen <small>(opsional)</small></label>
                  <select
                    id="org-dept"
                    className="org-control"
                    value={form.departmentId}
                    onChange={(event) => setForm((c) => ({ ...c, departmentId: event.target.value }))}
                  >
                    <option value="">Semua departemen pada unit</option>
                    {activeDepartments.filter((item) => item.unitId === form.unitId).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </div>
              )}

              {section === "units" && (
                <label className="org-switch">
                  <input
                    type="checkbox"
                    checked={form.requiresDepartment}
                    onChange={(event) => setForm((c) => ({ ...c, requiresDepartment: event.target.checked }))}
                  />
                  <div>
                    <strong>Unit ini mewajibkan departemen</strong>
                    <span>Karyawan di unit ini harus dipilihkan departemen saat didaftarkan.</span>
                  </div>
                </label>
              )}

              <div className="org-form-actions">
                <button className="org-btn is-primary is-block" type="submit" disabled={saving}>
                  {saving ? "Menyimpan..." : editing ? "Simpan perubahan" : `Simpan ${current.singular}`}
                </button>
                {editing && <button type="button" className="org-btn is-block" onClick={resetMasterForm}>Batal</button>}
              </div>
            </form>
          ) : (
            <form className="org-form" onSubmit={saveAccessRole}>
              <div className="org-field">
                <label className="org-label" htmlFor="org-role-name">Nama role hak akses</label>
                <input
                  id="org-role-name"
                  className="org-control"
                  placeholder={current.placeholder}
                  value={accessForm.name}
                  onChange={(event) => setAccessForm((c) => ({ ...c, name: event.target.value }))}
                  required
                />
              </div>

              <div className="org-field">
                <span className="org-label">Hak akses</span>
                <div className="org-pills">
                  {PERMISSION_CATALOG.map((permission) => (
                    <label className="org-pill" key={permission.id}>
                      <input
                        type="checkbox"
                        checked={accessForm.permissions.includes(permission.id)}
                        onChange={(event) => setAccessForm((c) => ({
                          ...c,
                          permissions: event.target.checked
                            ? [...c.permissions, permission.id]
                            : c.permissions.filter((id) => id !== permission.id),
                        }))}
                      />
                      {permission.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="org-field">
                <label className="org-label" htmlFor="org-scope">Cakupan data</label>
                <select
                  id="org-scope"
                  className="org-control"
                  value={accessForm.scopeType}
                  onChange={(event) => setAccessForm((c) => ({ ...c, scopeType: event.target.value, scopeId: "" }))}
                >
                  {SCOPE_TYPES.map((scope) => <option key={scope} value={scope}>{scopeLabel(scope)}</option>)}
                </select>
              </div>

              {accessForm.scopeType !== "all" && (
                <div className="org-field">
                  <label className="org-label" htmlFor="org-scope-id">Pilih cakupan</label>
                  {accessForm.scopeType === "outlet" ? (
                    <input
                      id="org-scope-id"
                      className="org-control"
                      value={accessForm.scopeId}
                      placeholder="Nama outlet"
                      onChange={(event) => setAccessForm((c) => ({ ...c, scopeId: event.target.value }))}
                      required
                    />
                  ) : (
                    <select
                      id="org-scope-id"
                      className="org-control"
                      value={accessForm.scopeId}
                      onChange={(event) => setAccessForm((c) => ({ ...c, scopeId: event.target.value }))}
                      required
                    >
                      <option value="">Pilih cakupan</option>
                      {selectableScope.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                  )}
                </div>
              )}

              <div className="org-form-actions">
                <button className="org-btn is-primary is-block" type="submit" disabled={saving}>
                  {saving ? "Menyimpan..." : editing ? "Simpan perubahan" : "Simpan role hak akses"}
                </button>
                {editing && <button type="button" className="org-btn is-block" onClick={resetAccessForm}>Batal</button>}
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}