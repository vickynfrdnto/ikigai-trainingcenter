import test from "node:test";
import assert from "node:assert/strict";
import {
  getAuthorization,
  hasPermission,
  isWithinScope,
  matchesModuleAudience,
  normalizeAssignments,
} from "./organization.js";

test("legacy employees map to operational job roles without losing outlet", () => {
  const assignments = normalizeAssignments({ role: "OPERASIONAL", divisi: "Bintaro" });
  assert.deepEqual(assignments[0], {
    unitId: "operasional",
    departmentId: null,
    jobRoleId: "tim-ops",
    outletId: "Bintaro",
    primary: true,
    legacy: true,
  });
});

test("employee matches any of their multiple learning-path assignments", () => {
  const employee = {
    organizationAssignments: [
      { unitId: "operasional", jobRoleId: "kasir" },
      { unitId: "head-office", departmentId: "hr", jobRoleId: "hr-junior" },
    ],
  };
  assert.equal(matchesModuleAudience(employee, { audience: { assignments: [{ unitId: "head-office", departmentId: "hr" }] } }), true);
  assert.equal(matchesModuleAudience(employee, { audience: { assignments: [{ unitId: "head-office", departmentId: "finance" }] } }), false);
  assert.equal(matchesModuleAudience(employee, { audience: { allCompany: true } }), true);
});

test("legacy roleAccess remains a fallback until material targeting is migrated", () => {
  assert.equal(matchesModuleAudience({ role: "KASIR" }, { roleAccess: ["KASIR", "SUPERVISOR"] }), true);
  assert.equal(matchesModuleAudience({ role: "HR" }, { roleAccess: ["KASIR", "SUPERVISOR"] }), false);
});

test("access roles combine permissions and enforce unit, department, and outlet scope", () => {
  const employee = { accessRoleIds: ["hr-trainer"] };
  const roles = [{ id: "hr-trainer", permissions: ["reviewAssessments"], scope: { type: "department", id: "hr" } }];
  assert.equal(hasPermission(employee, "reviewAssessments", roles), true);
  assert.equal(hasPermission(employee, "manageUsers", roles), false);
  assert.deepEqual(getAuthorization(employee, roles).scopes, [{ type: "department", id: "hr" }]);
  assert.equal(isWithinScope({ departmentId: "hr" }, getAuthorization(employee, roles).scopes), true);
  assert.equal(isWithinScope({ departmentId: "finance" }, getAuthorization(employee, roles).scopes), false);
  assert.equal(isWithinScope({ outletId: "Bintaro" }, [{ type: "outlet", id: "Bintaro" }]), true);
  assert.equal(isWithinScope({}, [{ type: "team", id: "team-1" }]), false);
});
