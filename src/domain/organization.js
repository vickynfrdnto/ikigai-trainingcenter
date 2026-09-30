export const PERMISSION_CATALOG = [
  { id: "manageOrganization", label: "Kelola struktur organisasi" },
  { id: "manageUsers", label: "Kelola karyawan" },
  { id: "manageModules", label: "Kelola materi" },
  { id: "createAssessments", label: "Buat assessment" },
  { id: "reviewAssessments", label: "Nilai assessment" },
  { id: "viewReports", label: "Lihat laporan" },
];

export const SCOPE_TYPES = ["all", "unit", "department", "outlet"];

export const INITIAL_ORG_UNITS = [
  { id: "operasional", name: "Operasional", requiresDepartment: false },
  { id: "head-office", name: "Head Office", requiresDepartment: true },
];

export const INITIAL_DEPARTMENTS = [
  { id: "marketing", unitId: "head-office", name: "Marketing" },
  { id: "finance", unitId: "head-office", name: "Finance" },
  { id: "hr", unitId: "head-office", name: "HR" },
];

export const INITIAL_JOB_ROLES = [
  { id: "kasir", unitId: "operasional", name: "KASIR" },
  { id: "supervisor", unitId: "operasional", name: "SUPERVISOR" },
  { id: "tim-ops", unitId: "operasional", name: "OPERASIONAL" },
  { id: "terapis", unitId: "operasional", name: "TERAPIS" },
];

export function makeRecordId(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeAssignments(user) {
  if (Array.isArray(user?.organizationAssignments) && user.organizationAssignments.length) {
    return user.organizationAssignments;
  }

  const legacyRole = makeRecordId(user?.role);
  const roleMap = {
    "tim-ops": "tim-ops",
    operasional: "tim-ops",
  };
  const jobRoleId = roleMap[legacyRole] || legacyRole;
  if (!jobRoleId) return [];

  return [{
    unitId: user?.role?.toUpperCase() === "HEAD OFFICE" ? "head-office" : "operasional",
    departmentId: user?.role?.toUpperCase() === "HEAD OFFICE" ? null : null,
    jobRoleId,
    outletId: user?.outletId || user?.divisi || null,
    primary: true,
    legacy: true,
  }];
}

export function matchesModuleAudience(user, module) {
  const audience = module?.audience;
  if (!audience) {
    const legacyRoles = Array.isArray(module?.roleAccess)
      ? module.roleAccess
      : [module?.roleAccess];
    return legacyRoles.some((role) => String(role || "").toUpperCase() === String(user?.role || "").toUpperCase());
  }
  if (audience.allCompany) return true;

  const assignments = normalizeAssignments(user);
  return (audience.assignments || []).some((target) => assignments.some((assignment) =>
    assignment.unitId === target.unitId &&
    (!target.departmentId || assignment.departmentId === target.departmentId) &&
    (!target.jobRoleId || assignment.jobRoleId === target.jobRoleId)
  ));
}

export function audienceFromLegacyRoles(module, jobRoles) {
  if (module?.audience) return module.audience;
  const legacyRoles = Array.isArray(module?.roleAccess) ? module.roleAccess : [module?.roleAccess];
  const assignments = legacyRoles.filter(Boolean).map((role) => {
    const match = jobRoles.find((item) => item.name?.toUpperCase() === String(role).toUpperCase());
    if (match) return { unitId: match.unitId, departmentId: match.departmentId || null, jobRoleId: match.id };
    const isHeadOffice = String(role).toUpperCase() === "HEAD OFFICE";
    const jobRoleId = String(role).toUpperCase() === "OPERASIONAL" ? "tim-ops" : makeRecordId(role);
    return { unitId: isHeadOffice ? "head-office" : "operasional", departmentId: null, jobRoleId: isHeadOffice ? null : jobRoleId };
  });
  return { allCompany: false, assignments };
}

export function rolesForAudience(audience, jobRoles, fallbackRoles = []) {
  if (audience?.allCompany) return fallbackRoles;
  const names = audience?.assignments?.flatMap((target) => jobRoles
    .filter((role) => role.unitId === target.unitId &&
      (!target.departmentId || role.departmentId === target.departmentId) &&
      (!target.jobRoleId || role.id === target.jobRoleId))
    .map((role) => role.name)) || [];
  return [...new Set(names)];
}

export function getAuthorization(user, accessRoles = []) {
  if (user?.role === "ADMIN" || user?.isAdmin === true) {
    return { permissions: PERMISSION_CATALOG.map((item) => item.id), scopes: [{ type: "all", id: null }] };
  }
  const assigned = new Set(user?.accessRoleIds || []);
  const roles = accessRoles.filter((role) => assigned.has(role.id) && role.active !== false);
  return {
    permissions: [...new Set(roles.flatMap((role) => role.permissions || []))],
    scopes: roles.map((role) => role.scope || { type: "all", id: null }),
  };
}

export function hasPermission(user, permissionId, accessRoles = []) {
  return getAuthorization(user, accessRoles).permissions.includes(permissionId);
}

export function isWithinScope(record, scopes = []) {
  return scopes.some((scope) => {
    if (scope.type === "all") return true;
    if (scope.type === "unit") return record.unitId === scope.id;
    if (scope.type === "department") return record.departmentId === scope.id;
    if (scope.type === "outlet") return record.outletId === scope.id || record.divisi === scope.id;
    return false;
  });
}
