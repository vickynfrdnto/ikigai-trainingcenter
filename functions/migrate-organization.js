import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import process from "node:process";

const mode = process.argv[2] || "--dry-run";
const backupPath = resolve(process.argv[3] || `database-backups/organization-${new Date().toISOString().replaceAll(":", "-")}.json`);
const databaseURL = process.env.FIREBASE_DATABASE_URL;
if (!databaseURL) throw new Error("Set FIREBASE_DATABASE_URL. Authenticate with Application Default Credentials first.");
initializeApp({ databaseURL });
const db = getDatabase();

const defaults = {
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
const legacyRoleMap = { KASIR: "kasir", SUPERVISOR: "supervisor", OPERASIONAL: "tim-ops", TERAPIS: "terapis", "HEAD OFFICE": null };
const organizationFields = ["unitId", "departmentId", "jobRoleId", "organizationAssignments", "migrationVersion"];

if (mode === "--rollback") {
  const journal = JSON.parse(await readFile(backupPath, "utf8"));
  if (journal.applied !== true) throw new Error("Backup ini tidak mencatat migrasi yang berhasil diaplikasikan.");
  for (const [path, expected] of Object.entries(journal.after)) {
    const current = await db.ref(path).get();
    if (JSON.stringify(current.val() ?? null) !== JSON.stringify(expected)) {
      throw new Error(`Rollback dihentikan: ${path} berubah setelah migrasi. Backup disimpan utuh.`);
    }
  }
  const updates = {};
  for (const [path, before] of Object.entries(journal.before)) updates[path] = before;
  if (Object.keys(updates).length) await db.ref().update(updates);
  console.log(`Rollback selesai untuk ${journal.touchedProfiles} profil. Kolom progres tidak disentuh.`);
  process.exit(0);
}
if (!["--dry-run", "--apply"].includes(mode)) throw new Error("Gunakan --dry-run, --apply, atau --rollback <backup.json>.");

const snapshots = await Promise.all([
  db.ref("users").get(),
  ...Object.keys(defaults).map((collection) => db.ref(collection).get()),
]);
const users = snapshots[0].val() || {};
const updates = {};
const before = {};
const skipped = [];
const touched = [];
for (const [collection, records] of Object.entries(defaults)) {
  const existing = snapshots[Object.keys(defaults).indexOf(collection) + 1].val() || {};
  for (const [id, value] of Object.entries(records)) {
    if (!existing[id]) updates[`${collection}/${id}`] = { ...value, active: true, createdAt: Date.now(), migrationId: "organization-v1" };
  }
}
for (const [code, user] of Object.entries(users)) {
  if (!user?.nama || user.migrationVersion === 1) continue;
  const normalizedRole = String(user.role || "").trim().toUpperCase();
  const jobRoleId = legacyRoleMap[normalizedRole];
  if (normalizedRole === "HEAD OFFICE") {
    skipped.push({ code, reason: "Head Office membutuhkan pemetaan departemen secara manual." });
    continue;
  }
  if (!jobRoleId) {
    skipped.push({ code, reason: `Jabatan legacy belum dipetakan: ${normalizedRole || "kosong"}.` });
    continue;
  }
  const fields = {
    unitId: "operasional",
    departmentId: null,
    jobRoleId,
    organizationAssignments: [{ unitId: "operasional", departmentId: null, jobRoleId, outletId: user.outletId || user.divisi || null, primary: true }],
    migrationVersion: 1,
  };
  for (const field of organizationFields) before[`users/${code}/${field}`] = user[field] ?? null;
  for (const [field, value] of Object.entries(fields)) updates[`users/${code}/${field}`] = value;
  touched.push(code);
}

const report = { mode, profilesToMigrate: touched.length, defaultsToCreate: Object.keys(updates).filter((path) => !path.startsWith("users/")).length, skippedProfiles: skipped, backupPath: mode === "--apply" ? backupPath : null };
console.log(JSON.stringify(report, null, 2));
if (mode === "--dry-run" || !Object.keys(updates).length) process.exit(0);

const journal = {
  id: randomUUID(), createdAt: new Date().toISOString(), applied: false, touchedProfiles: touched.length,
  before: { ...before }, after: { ...updates }, createdRecords: Object.keys(updates).filter((path) => !path.startsWith("users/")),
};
for (const path of journal.createdRecords) journal.before[path] = null;
await mkdir(dirname(backupPath), { recursive: true });
await writeFile(backupPath, JSON.stringify(journal, null, 2), { flag: "wx" });
try {
  await db.ref().update(updates);
  journal.applied = true;
  await writeFile(backupPath, JSON.stringify(journal, null, 2));
  console.log(`Migrasi berhasil. Backup: ${backupPath}`);
} catch (error) {
  const rollback = Object.fromEntries(Object.entries(journal.before));
  await db.ref().update(rollback);
  throw error;
}
