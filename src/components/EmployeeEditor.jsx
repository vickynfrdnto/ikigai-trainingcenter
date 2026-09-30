import { useMemo, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase-config";
import { normalizeAssignments } from "../domain/organization";

export default function EmployeeEditor({ employee, units, departments, jobRoles, accessRoles, onClose, showToast }) {
  const currentAssignments = normalizeAssignments(employee);
  const primary = currentAssignments.find((item) => item.primary) || currentAssignments[0] || {};
  const [name, setName] = useState(employee.nama || "");
  const [unitId, setUnitId] = useState(primary.unitId || "operasional");
  const [departmentId, setDepartmentId] = useState(primary.departmentId || "");
  const [jobRoleId, setJobRoleId] = useState(primary.jobRoleId || "");
  const [outletId, setOutletId] = useState(primary.outletId || employee.divisi || "");
  const [accessRoleIds, setAccessRoleIds] = useState(employee.accessRoleIds || []);
  const [extraUnitId, setExtraUnitId] = useState("");
  const [extraDepartmentId, setExtraDepartmentId] = useState("");
  const [extraJobRoleId, setExtraJobRoleId] = useState("");
  const [extraOutletId, setExtraOutletId] = useState("");
  const [additionalAssignments, setAdditionalAssignments] = useState(currentAssignments.filter((item) => item !== primary));
  const [saving, setSaving] = useState(false);

  const unit = units.find((item) => item.id === unitId);
  const roles = useMemo(() => jobRoles.filter((item) => item.unitId === unitId && (!item.departmentId || item.departmentId === departmentId)), [jobRoles, unitId, departmentId]);
  const extraUnit = units.find((item) => item.id === extraUnitId);
  const extraRoles = jobRoles.filter((item) => item.unitId === extraUnitId && (!item.departmentId || item.departmentId === extraDepartmentId));

  const save = async (event) => {
    event.preventDefault();
    if (!name.trim() || !jobRoleId || (unit?.requiresDepartment && !departmentId)) {
      showToast("Lengkapi nama, departemen, dan jabatan.", "error");
      return;
    }
    const selectedRole = roles.find((item) => item.id === jobRoleId);
    const nextPrimary = { unitId, departmentId: departmentId || null, jobRoleId, outletId: outletId.trim() || null, primary: true };
    const nextAssignments = [nextPrimary, ...additionalAssignments.map((item) => ({ ...item, primary: false }))];
    const patch = {
      nama: name.trim(),
      role: selectedRole?.name || employee.role,
      divisi: outletId.trim(),
      unitId,
      departmentId: departmentId || null,
      jobRoleId,
      organizationAssignments: nextAssignments,
      accessRoleIds,
    };
    setSaving(true);
    try {
      await httpsCallable(functions, "saveEmployee")({ code: employee.id, patch });
      showToast("Profil karyawan berhasil diperbarui.", "success");
      onClose();
    } catch (error) {
      console.error("UPDATE EMPLOYEE ERROR:", error);
      showToast("Gagal memperbarui profil karyawan.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="m-modal-backdrop" onClick={onClose}>
      <section className="m-bottom-sheet-modal" role="dialog" aria-modal="true" aria-labelledby="employee-editor-title" onClick={(event) => event.stopPropagation()}>
        <div className="m-sheet-header">
          <div className="m-sheet-handle-bar" />
          <div className="m-sheet-title-wrap">
            <div><h3 className="m-sheet-h3" id="employee-editor-title">Edit Karyawan</h3><p className="m-sheet-sub">{employee.nama}</p></div>
            <button type="button" className="m-sheet-close" onClick={onClose} aria-label="Tutup">×</button>
          </div>
        </div>
        <form className="m-sheet-body m-form-stack" onSubmit={save}>
          <div className="m-input-group"><label className="m-label">NAMA</label><input className="m-input-pill" value={name} onChange={(event) => setName(event.target.value)} required /></div>
          <div className="m-input-group"><label className="m-label">UNIT</label><select className="m-select-pill" value={unitId} onChange={(event) => { setUnitId(event.target.value); setDepartmentId(""); setJobRoleId(""); }} required>{units.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
          {unit?.requiresDepartment && <div className="m-input-group"><label className="m-label">DEPARTEMEN</label><select className="m-select-pill" value={departmentId} onChange={(event) => { setDepartmentId(event.target.value); setJobRoleId(""); }} required><option value="">Pilih departemen</option>{departments.filter((item) => item.unitId === unitId).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>}
          {unitId === "operasional" && <div className="m-input-group"><label className="m-label">OUTLET</label><input className="m-input-pill" value={outletId} onChange={(event) => setOutletId(event.target.value)} /></div>}
          <div className="m-input-group"><label className="m-label">JABATAN UTAMA</label><select className="m-select-pill" value={jobRoleId} onChange={(event) => setJobRoleId(event.target.value)} required><option value="">Pilih jabatan</option>{roles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
          <div className="m-input-group">
            <label className="m-label">JALUR TAMBAHAN</label>
            {additionalAssignments.map((assignment, index) => <div className="m-organization-row" key={`${assignment.unitId}-${assignment.departmentId}-${assignment.jobRoleId}`}><span>{units.find((item) => item.id === assignment.unitId)?.name || assignment.unitId} · {jobRoles.find((item) => item.id === assignment.jobRoleId)?.name || assignment.jobRoleId}</span><button type="button" className="m-btn-action-sm off" onClick={() => setAdditionalAssignments((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Hapus</button></div>)}
            <select className="m-select-pill" value={extraUnitId} onChange={(event) => { setExtraUnitId(event.target.value); setExtraDepartmentId(""); setExtraJobRoleId(""); }}><option value="">Pilih unit jalur tambahan</option>{units.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
            {extraUnit?.requiresDepartment && <select className="m-select-pill" value={extraDepartmentId} onChange={(event) => { setExtraDepartmentId(event.target.value); setExtraJobRoleId(""); }}><option value="">Pilih departemen</option>{departments.filter((item) => item.unitId === extraUnitId).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>}
            {extraUnitId && <select className="m-select-pill" value={extraJobRoleId} onChange={(event) => setExtraJobRoleId(event.target.value)}><option value="">Pilih jabatan</option>{extraRoles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>}
            {extraUnitId === "operasional" && <input className="m-input-pill" value={extraOutletId} onChange={(event) => setExtraOutletId(event.target.value)} placeholder="Outlet (jika berlaku)" />}
            <button type="button" className="m-btn-action-sm" disabled={!extraUnitId || !extraJobRoleId || (extraUnit?.requiresDepartment && !extraDepartmentId)} onClick={() => {
              const next = { unitId: extraUnitId, departmentId: extraDepartmentId || null, jobRoleId: extraJobRoleId, outletId: extraOutletId.trim() || null };
              if (additionalAssignments.some((item) => item.unitId === next.unitId && item.departmentId === next.departmentId && item.jobRoleId === next.jobRoleId) || (unitId === next.unitId && departmentId === next.departmentId && jobRoleId === next.jobRoleId)) return;
              setAdditionalAssignments((current) => [...current, next]);
              setExtraUnitId(""); setExtraDepartmentId(""); setExtraJobRoleId(""); setExtraOutletId("");
            }}>Tambah Jalur</button>
          </div>
          {accessRoles.length > 0 && <div className="m-input-group"><label className="m-label">ROLE HAK AKSES</label><div className="m-role-pill-group">{accessRoles.filter((item) => item.active !== false).map((item) => <label className="m-role-pill" key={item.id}><input type="checkbox" checked={accessRoleIds.includes(item.id)} onChange={(event) => setAccessRoleIds((current) => event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))} />{item.name}</label>)}</div></div>}
          <div className="m-label-row"><button type="button" className="m-btn-link" onClick={onClose}>Batal</button><button type="submit" className="m-btn-primary-emerald" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Perubahan"}</button></div>
        </form>
      </section>
    </div>
  );
}
