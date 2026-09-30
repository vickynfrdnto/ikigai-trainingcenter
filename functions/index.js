import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { createHash } from "node:crypto";
import { HttpsError, onCall } from "firebase-functions/v2/https";

initializeApp();

const database = getDatabase();
const FUNCTION_OPTIONS = { region: "asia-southeast1", cors: true, maxInstances: 10 };

function fail(code, message) {
  throw new HttpsError(code, message);
}

function normalizeAssignments(user = {}) {
  if (Array.isArray(user.organizationAssignments) && user.organizationAssignments.length) {
    return user.organizationAssignments;
  }
  const role = String(user.role || "").toUpperCase();
  const jobRoleId = role === "OPERASIONAL" ? "tim-ops" : role.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return jobRoleId ? [{
    unitId: role === "HEAD OFFICE" ? "head-office" : "operasional",
    departmentId: null,
    jobRoleId,
    outletId: user.outletId || user.divisi || null,
    primary: true,
  }] : [];
}

function getRoles(user, rolesData = {}) {
  return (user.accessRoleIds || []).map((id) => ({ id, ...rolesData[id] }))
    .filter((role) => role.name && role.active !== false);
}

function getAuthorization(user, rolesData = {}) {
  if (String(user.role || "").toUpperCase() === "ADMIN") {
    return {
      isAdmin: true,
      permissions: ["manageOrganization", "manageUsers", "manageModules", "createAssessments", "reviewAssessments", "viewReports"],
      scopes: [{ type: "all", id: null }],
    };
  }
  const roles = getRoles(user, rolesData);
  return {
    isAdmin: false,
    permissions: [...new Set(roles.flatMap((role) => role.permissions || []))],
    scopes: roles.map((role) => role.scope || { type: "all", id: null }),
  };
}

function matchesScope(record, scopes = []) {
  return scopes.some((scope) => {
    if (scope.type === "all") return true;
    if (scope.type === "unit") return normalizeAssignments(record).some((item) => item.unitId === scope.id) || record.unitId === scope.id;
    if (scope.type === "department") return normalizeAssignments(record).some((item) => item.departmentId === scope.id) || record.departmentId === scope.id;
    if (scope.type === "outlet") return normalizeAssignments(record).some((item) => item.outletId === scope.id) || record.divisi === scope.id;
    return false;
  });
}

function userForRequest(request) {
  if (!request.auth) fail("unauthenticated", "Silakan masuk kembali.");
  const code = request.auth.token.userCode;
  if (!code) fail("unauthenticated", "Sesi login tidak valid.");
  return database.ref(`users/${code}`).get().then((snapshot) => {
    const user = snapshot.val();
    if (!user || user.status === "Inactive" || user.authUid !== request.auth.uid) {
      fail("unauthenticated", "Akun tidak aktif. Silakan masuk kembali.");
    }
    return user;
  });
}

async function authorizationFor(user) {
  const rolesSnapshot = await database.ref("accessRoles").get();
  return getAuthorization(user, rolesSnapshot.val() || {});
}

async function requirePermission(request, permission) {
  const user = await userForRequest(request);
  const authorization = await authorizationFor(user);
  if (!authorization.isAdmin && !authorization.permissions.includes(permission)) {
    fail("permission-denied", "Anda tidak memiliki hak untuk melakukan tindakan ini.");
  }
  return { user, authorization };
}

function moduleMatchesUser(module, user) {
  if (String(user.role || "").toUpperCase() === "ADMIN") return true;
  const audience = module.audience;
  const assignments = normalizeAssignments(user);
  if (audience?.allCompany) return true;
  if (audience?.assignments?.length) {
    return audience.assignments.some((target) => assignments.some((assignment) =>
      assignment.unitId === target.unitId &&
      (!target.departmentId || assignment.departmentId === target.departmentId) &&
      (!target.jobRoleId || assignment.jobRoleId === target.jobRoleId)
    ));
  }
  const legacyRoles = Array.isArray(module.roleAccess) ? module.roleAccess : [module.roleAccess];
  return legacyRoles.some((role) => String(role || "").toUpperCase() === String(user.role || "").toUpperCase());
}

function moduleWithinScope(module, scopes) {
  if (module.audience?.allCompany) return scopes.some((scope) => scope.type === "all");
  const targets = module.audience?.assignments || [];
  if (!targets.length) return false;
  return targets.every((target) => scopes.some((scope) =>
    scope.type === "all" ||
    (scope.type === "unit" && scope.id === target.unitId) ||
    (scope.type === "department" && scope.id === target.departmentId)
  ));
}

async function issueLoginToken(code, ip) {
  const normalizedCode = String(code || "").trim().toUpperCase();
  if (!/^IKG-(?:[A-Z0-9]{5}|ADMIN-[A-Z0-9]{2})$/.test(normalizedCode)) fail("invalid-argument", "Format kode akses tidak valid.");

  const bucket = Math.floor(Date.now() / (15 * 60 * 1000));
  const limiterId = createHash("sha256").update(`${ip || "unknown"}:${bucket}`).digest("hex").slice(0, 32);
  const limiterRef = database.ref(`security/loginAttempts/${limiterId}`);
  const limiter = await limiterRef.transaction((value) => ({ count: (value?.count || 0) + 1, bucket }));
  if ((limiter.snapshot.val()?.count || 0) > 10) fail("resource-exhausted", "Terlalu banyak percobaan. Coba lagi 15 menit kemudian.");

  const userRef = database.ref(`users/${normalizedCode}`);
  const snapshot = await userRef.get();
  const user = snapshot.val();
  if (!user) fail("not-found", "Akun tidak ditemukan.");
  if (user.status === "Inactive") fail("permission-denied", "Akun kamu telah dinonaktifkan. Hubungi admin.");

  const rolesSnapshot = await database.ref("accessRoles").get();
  const authorization = getAuthorization(user, rolesSnapshot.val() || {});
  const uid = user.authUid || `ikg_${normalizedCode.toLowerCase()}`;
  await userRef.update({ authUid: uid });
  await database.ref(`authz/${uid}`).set({
    userCode: normalizedCode,
    isAdmin: authorization.isAdmin,
    permissions: Object.fromEntries(authorization.permissions.map((permission) => [permission, true])),
    scopes: authorization.scopes,
    updatedAt: Date.now(),
  });

  const customToken = await getAuth().createCustomToken(uid, {
    userCode: normalizedCode,
    isAdmin: authorization.isAdmin,
    permissions: authorization.permissions,
    scopes: authorization.scopes,
  });
  return { token: customToken };
}

export const loginWithAccessCode = onCall(FUNCTION_OPTIONS, async (request) => {
  return issueLoginToken(request.data?.code, request.rawRequest.ip);
});

export const getAccessibleTrainingModules = onCall(FUNCTION_OPTIONS, async (request) => {
  const user = await userForRequest(request);
  const snapshot = await database.ref("trainingModules").get();
  const modules = snapshot.val() || {};
  return Object.entries(modules)
    .map(([id, value]) => ({ id, ...value }))
    .filter((module) => (module.status ? module.status === "active" : !module.disabled && !module.isSoon) && moduleMatchesUser(module, user));
});

export const getScopedUsers = onCall(FUNCTION_OPTIONS, async (request) => {
  const user = await userForRequest(request);
  const authorization = await authorizationFor(user);
  if (!authorization.isAdmin && !authorization.permissions.some((permission) => ["viewReports", "manageUsers"].includes(permission))) {
    fail("permission-denied", "Anda tidak memiliki akses melihat karyawan.");
  }
  const snapshot = await database.ref("users").get();
  return Object.entries(snapshot.val() || {})
    .map(([id, user]) => ({ id, ...user }))
    .filter((user) => matchesScope(user, authorization.scopes));
});

export const getScopedTrainingModules = onCall(FUNCTION_OPTIONS, async (request) => {
  const { authorization } = await requirePermission(request, "manageModules");
  const snapshot = await database.ref("trainingModules").get();
  return Object.entries(snapshot.val() || {})
    .map(([id, module]) => ({ id, ...module }))
    .filter((module) => moduleWithinScope(module, authorization.scopes));
});

export const saveTrainingModule = onCall(FUNCTION_OPTIONS, async (request) => {
  const { authorization } = await requirePermission(request, "manageModules");
  const id = String(request.data?.id || "").trim();
  const module = request.data?.module;
  if (!/^[A-Za-z0-9_-]{1,120}$/.test(id) || !module || typeof module !== "object") fail("invalid-argument", "Data materi tidak valid.");
  if (!authorization.isAdmin && !moduleWithinScope(module, authorization.scopes)) fail("permission-denied", "Target materi berada di luar cakupan Anda.");
  const existing = await database.ref(`trainingModules/${id}`).get();
  if (existing.exists() && !authorization.isAdmin && !moduleWithinScope(existing.val(), authorization.scopes)) fail("permission-denied", "Materi berada di luar cakupan Anda.");
  await database.ref(`trainingModules/${id}`).update(module);
  return { id };
});

export const setTrainingModuleStatus = onCall(FUNCTION_OPTIONS, async (request) => {
  const { authorization } = await requirePermission(request, "manageModules");
  const id = String(request.data?.id || "").trim();
  const status = request.data?.status;
  if (!/^[A-Za-z0-9_-]{1,120}$/.test(id) || !["draft", "active", "archived"].includes(status)) fail("invalid-argument", "Status materi tidak valid.");
  const module = await database.ref(`trainingModules/${id}`).get();
  if (!module.exists()) fail("not-found", "Materi tidak ditemukan.");
  if (!authorization.isAdmin && !moduleWithinScope(module.val(), authorization.scopes)) fail("permission-denied", "Materi berada di luar cakupan Anda.");
  await database.ref(`trainingModules/${id}`).update({ status });
  return { id, status };
});

export const saveOrganizationRecord = onCall(FUNCTION_OPTIONS, async (request) => {
  const { authorization } = await requirePermission(request, "manageOrganization");
  const collection = request.data?.collection;
  const id = String(request.data?.id || "").trim();
  const record = request.data?.record;
  if (!["orgUnits", "departments", "jobRoles", "accessRoles"].includes(collection) || !/^[A-Za-z0-9_-]{1,120}$/.test(id) || !record || typeof record !== "object") fail("invalid-argument", "Data organisasi tidak valid.");
  if (collection === "accessRoles") {
    if (!authorization.isAdmin) fail("permission-denied", "Hanya admin yang dapat membuat role hak akses.");
    const allowedPermissions = ["manageOrganization", "manageUsers", "manageModules", "createAssessments", "reviewAssessments", "viewReports"];
    const validScopes = ["all", "unit", "department", "outlet"];
    if (!Array.isArray(record.permissions) || record.permissions.some((permission) => !allowedPermissions.includes(permission)) || !validScopes.includes(record.scope?.type || "all")) fail("invalid-argument", "Hak akses atau cakupan tidak valid.");
  }
  if (!authorization.isAdmin && collection !== "accessRoles" && !matchesScope(record, authorization.scopes)) fail("permission-denied", "Data organisasi berada di luar cakupan Anda.");
  await database.ref(`${collection}/${id}`).update(record);
  return { id };
});

export const deactivateOrganizationRecord = onCall(FUNCTION_OPTIONS, async (request) => {
  const { authorization } = await requirePermission(request, "manageOrganization");
  const collection = request.data?.collection;
  const id = String(request.data?.id || "").trim();
  if (!["orgUnits", "departments", "jobRoles", "accessRoles"].includes(collection) || !/^[A-Za-z0-9_-]{1,120}$/.test(id)) fail("invalid-argument", "Data organisasi tidak valid.");
  if (collection === "accessRoles" && !authorization.isAdmin) fail("permission-denied", "Hanya admin yang dapat menonaktifkan role hak akses.");
  const [recordSnapshot, usersSnapshot, modulesSnapshot, departmentsSnapshot, jobRolesSnapshot] = await Promise.all([
    database.ref(`${collection}/${id}`).get(), database.ref("users").get(), database.ref("trainingModules").get(),
    database.ref("departments").get(), database.ref("jobRoles").get(),
  ]);
  if (!recordSnapshot.exists()) fail("not-found", "Data organisasi tidak ditemukan.");
  const record = recordSnapshot.val();
  if (!authorization.isAdmin && !matchesScope({ ...record, id, unitId: record.unitId || id }, authorization.scopes)) fail("permission-denied", "Data berada di luar cakupan Anda.");
  const users = usersSnapshot.val() || {};
  const modules = modulesSnapshot.val() || {};
  const usedByUser = Object.values(users).some((user) => {
    if (collection === "accessRoles") return (user.accessRoleIds || []).includes(id);
    const assignments = normalizeAssignments(user);
    return assignments.some((assignment) => (collection === "orgUnits" && assignment.unitId === id) ||
      (collection === "departments" && assignment.departmentId === id) || (collection === "jobRoles" && assignment.jobRoleId === id));
  });
  const usedByModule = collection !== "accessRoles" && Object.values(modules).some((module) =>
    (module.audience?.assignments || []).some((target) => (collection === "orgUnits" && target.unitId === id) ||
      (collection === "departments" && target.departmentId === id) || (collection === "jobRoles" && target.jobRoleId === id)));
  const usedByChild = collection === "orgUnits"
    ? Object.values(departmentsSnapshot.val() || {}).some((item) => item.unitId === id) || Object.values(jobRolesSnapshot.val() || {}).some((item) => item.unitId === id)
    : collection === "departments" && Object.values(jobRolesSnapshot.val() || {}).some((item) => item.departmentId === id);
  if (usedByUser || usedByModule || usedByChild) fail("failed-precondition", "Pindahkan relasi karyawan, materi, atau struktur turunan sebelum menonaktifkan item ini.");
  await database.ref(`${collection}/${id}`).update({ active: false, updatedAt: Date.now() });
  return { id, active: false };
});

export const seedOrganizationDefaults = onCall(FUNCTION_OPTIONS, async (request) => {
  const { authorization } = await requirePermission(request, "manageOrganization");
  if (!authorization.isAdmin) fail("permission-denied", "Hanya admin dapat membuat struktur awal.");
  const initial = {
    orgUnits: {
      operasional: { name: "Operasional", requiresDepartment: false },
      "head-office": { name: "Head Office", requiresDepartment: true },
    },
    departments: {
      marketing: { name: "Marketing", unitId: "head-office" },
      finance: { name: "Finance", unitId: "head-office" },
      hr: { name: "HR", unitId: "head-office" },
    },
    jobRoles: {
      kasir: { name: "KASIR", unitId: "operasional", departmentId: null },
      supervisor: { name: "SUPERVISOR", unitId: "operasional", departmentId: null },
      "tim-ops": { name: "OPERASIONAL", unitId: "operasional", departmentId: null },
      terapis: { name: "TERAPIS", unitId: "operasional", departmentId: null },
    },
  };
  const updates = {};
  for (const [collection, items] of Object.entries(initial)) {
    for (const [id, value] of Object.entries(items)) {
      const current = await database.ref(`${collection}/${id}`).get();
      if (!current.exists()) updates[`${collection}/${id}`] = { ...value, active: true, createdAt: Date.now() };
    }
  }
  if (Object.keys(updates).length) await database.ref().update(updates);
  return { created: Object.keys(updates).length };
});

export const getQuestionBank = onCall(FUNCTION_OPTIONS, async (request) => {
  await requirePermission(request, "createAssessments");
  const snapshot = await database.ref("questionBank").get();
  return Object.entries(snapshot.val() || {}).map(([id, question]) => ({ id, ...question }));
});

export const saveQuestionBankItem = onCall(FUNCTION_OPTIONS, async (request) => {
  await requirePermission(request, "createAssessments");
  const id = String(request.data?.id || "").trim();
  const question = request.data?.question;
  if (!/^Q-[A-Za-z0-9_-]{1,120}$/.test(id) || !question?.q || !Array.isArray(question.options) || question.options.length < 2 || !question.options.includes(question.a)) fail("invalid-argument", "Data soal tidak valid.");
  await database.ref(`questionBank/${id}`).update(question);
  return { id };
});

export const deleteQuestionBankItem = onCall(FUNCTION_OPTIONS, async (request) => {
  await requirePermission(request, "createAssessments");
  const id = String(request.data?.id || "").trim();
  if (!/^Q-[A-Za-z0-9_-]{1,120}$/.test(id)) fail("invalid-argument", "ID soal tidak valid.");
  await database.ref(`questionBank/${id}`).remove();
  return { id };
});

export const saveEmployee = onCall(FUNCTION_OPTIONS, async (request) => {
  const { authorization } = await requirePermission(request, "manageUsers");
  const code = String(request.data?.code || "").trim().toUpperCase();
  const patch = request.data?.patch;
  if (!/^IKG-[A-Z0-9]{5}$/.test(code) || !patch || typeof patch !== "object" || Array.isArray(patch)) fail("invalid-argument", "Data karyawan tidak valid.");
  if (!authorization.isAdmin) fail("permission-denied", "Pengelolaan karyawan hanya tersedia untuk admin pada tahap ini.");
  const userRef = database.ref(`users/${code}`);
  const current = await userRef.get();
  if (request.data?.mode === "create") {
    if (current.exists()) fail("already-exists", "Kode karyawan sudah digunakan.");
    const [units, departments, roles] = await Promise.all([database.ref("orgUnits").get(), database.ref("departments").get(), database.ref("jobRoles").get()]);
    const assignment = patch.organizationAssignments?.[0];
    if (!assignment || !units.child(assignment.unitId).exists() || !roles.child(assignment.jobRoleId).exists() ||
        (units.child(assignment.unitId).val()?.requiresDepartment && !departments.child(assignment.departmentId).exists())) fail("invalid-argument", "Penempatan karyawan tidak valid.");
    await userRef.set(patch);
  } else {
    if (!current.exists()) fail("not-found", "Karyawan tidak ditemukan.");
    await userRef.update(patch);
  }
  return { code };
});

export const bulkImportEmployees = onCall(FUNCTION_OPTIONS, async (request) => {
  const { authorization } = await requirePermission(request, "manageUsers");
  if (!authorization.isAdmin) fail("permission-denied", "Import karyawan hanya tersedia untuk admin.");
  const records = request.data?.records;
  if (!Array.isArray(records) || records.length > 500) fail("invalid-argument", "File import harus berisi maksimal 500 karyawan.");
  const [unitsSnapshot, departmentsSnapshot, rolesSnapshot] = await Promise.all([
    database.ref("orgUnits").get(), database.ref("departments").get(), database.ref("jobRoles").get(),
  ]);
  const units = unitsSnapshot.val() || {};
  const departments = departmentsSnapshot.val() || {};
  const jobRoles = rolesSnapshot.val() || {};
  const updates = {};
  for (const item of records) {
    const code = String(item?.code || "").toUpperCase();
    const user = item?.user;
    if (!/^IKG-[A-Z0-9]{5}$/.test(code) || !user?.nama || !user?.unitId || !user?.jobRoleId) fail("invalid-argument", "Ada baris karyawan yang belum lengkap.");
    const unit = units[user.unitId];
    const role = jobRoles[user.jobRoleId];
    if (!unit || unit.active === false || !role || role.active === false || role.unitId !== user.unitId) fail("invalid-argument", `Unit atau jabatan pada ${user.nama} tidak dikenal.`);
    if (unit.requiresDepartment && (!user.departmentId || !departments[user.departmentId] || departments[user.departmentId].unitId !== user.unitId)) fail("invalid-argument", `Departemen pada ${user.nama} wajib dan harus sesuai dengan unit.`);
    updates[`users/${code}`] = user;
  }
  if (Object.keys(updates).length) await database.ref().update(updates);
  return { imported: Object.keys(updates).length };
});

export const moveEmployeeAccessCode = onCall(FUNCTION_OPTIONS, async (request) => {
  const { authorization } = await requirePermission(request, "manageUsers");
  if (!authorization.isAdmin) fail("permission-denied", "Reset kode akses hanya tersedia untuk admin.");
  const oldCode = String(request.data?.oldCode || "").toUpperCase();
  const newCode = String(request.data?.newCode || "").toUpperCase();
  if (!/^IKG-[A-Z0-9]{5}$/.test(oldCode) || !/^IKG-[A-Z0-9]{5}$/.test(newCode) || oldCode === newCode) fail("invalid-argument", "Kode akses tidak valid.");
  const [oldSnapshot, newSnapshot] = await Promise.all([
    database.ref(`users/${oldCode}`).get(), database.ref(`users/${newCode}`).get(),
  ]);
  if (!oldSnapshot.exists() || newSnapshot.exists()) fail("already-exists", "Karyawan tidak ditemukan atau kode baru sudah digunakan.");
  const user = { ...oldSnapshot.val(), kode: newCode };
  await database.ref().update({ [`users/${newCode}`]: user, [`users/${oldCode}`]: null });
  return { code: newCode };
});
