import { useState, useEffect, useRef } from "react";
import { db } from "../firebase-config";
import { ref, onValue } from "firebase/database";
import { useAuth } from "../context/AuthContext";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase-config";
import OrganizationSettings from "./OrganizationSettings";
import AudienceTargetEditor from "./AudienceTargetEditor";
import EmployeeEditor from "./EmployeeEditor";
import { audienceFromLegacyRoles, makeRecordId, matchesModuleAudience, normalizeAssignments, rolesForAudience } from "../domain/organization";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../AdminPanel.css";
import OrganizationPage from "./admin/OrganizationSettingsPage";
import MonitoringPage from "./admin/MonitoringPage";
import ContentUploadPage from "./admin/ContentUploadPage";
import ModuleLibraryPage from "./admin/ModuleLibraryPage";
import QuestionBankPage from "./admin/QuestionBankPage";
import AnalyticsPage from "./admin/AnalyticsPage";

/* ── Inline SVG Icons (Optimal untuk Mobile Performance) ── */
const IconMonitor = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const IconAnalytics = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IconUserPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const IconExcel = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h8" />
    <path d="M8 17h8" />
  </svg>
);

const IconPdf = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconUpload = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconVideo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconLibrary = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconBank = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="21" x2="21" y2="21" />
    <line x1="5" y1="21" x2="5" y2="10" />
    <line x1="19" y1="21" x2="19" y2="10" />
    <polygon points="12 2 21 8 3 8" />
  </svg>
);

const IconKey = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3" />
  </svg>
);

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconChevronUp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconOrg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="6" rx="1" />
    <rect x="2" y="16" width="6" height="6" rx="1" />
    <rect x="16" y="16" width="6" height="6" rx="1" />
    <path d="M12 8v4M5 16v-2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2" />
  </svg>
);

// ── Komponen Pagination reusable (Prev/Next + info halaman) ──
// Dipakai di Monitoring User, Kelola Modul, dan Laporan Evaluasi.
const Pagination = ({ page, totalPages, onPrev, onNext, totalItems, pageSize }) => {
  if (totalPages <= 1) return null;
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  const wrapStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 16,
    paddingTop: 14,
    borderTop: "1px solid rgba(148, 163, 184, 0.25)",
  };
  const btnStyle = (disabled) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid rgba(148, 163, 184, 0.35)",
    background: disabled ? "rgba(148, 163, 184, 0.12)" : "#0c122d",
    color: disabled ? "#94a3b8" : "#00bca2",
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  });
  const infoStyle = {
    fontSize: 12.5,
    color: "#5e6782",
    fontWeight: 500,
  };

  return (
    <div className="m-pagination" style={wrapStyle}>
      <button
        type="button"
        className="m-btn-page"
        onClick={onPrev}
        disabled={page <= 1}
        style={btnStyle(page <= 1)}
      >
        <IconChevronLeft /> <span>Sebelumnya</span>
      </button>
      <span className="m-pagination-info" style={infoStyle}>
        {startItem}–{endItem} dari {totalItems} · Hal. {page}/{totalPages}
      </span>
      <button
        type="button"
        className="m-btn-page"
        onClick={onNext}
        disabled={page >= totalPages}
        style={btnStyle(page >= totalPages)}
      >
        <span>Berikutnya</span> <IconChevronRight />
      </button>
    </div>
  );
};

const MODULE_STATUS = { DRAFT: "draft", ACTIVE: "active", ARCHIVED: "archived" };

const getModuleStatus = (item) => {
  if (item.status) return item.status;
  if (item.isSoon) return MODULE_STATUS.DRAFT;
  if (item.disabled) return MODULE_STATUS.ARCHIVED;
  return MODULE_STATUS.ACTIVE;
};

const STATUS_LABEL = {
  [MODULE_STATUS.DRAFT]: "Draft",
  [MODULE_STATUS.ACTIVE]: "Aktif",
  [MODULE_STATUS.ARCHIVED]: "Diarsipkan",
};

// Helper terpusat: apakah sebuah modul bertipe dokumen (PDF/flipbook) atau video.
// Dipakai konsisten di form upload, kartu library, dan modal edit.
const isDocumentContent = (mod) => !!mod && (mod.type === "document" || !!mod.documentUrl);
const DOCUMENT_TYPE_OPTIONS = ["pdf", "ppt", "pptx", "doc", "docx"];

const isOneDriveUrl = (link) =>
  /(^|\.)((1drv\.ms)|(onedrive\.live\.com)|(sharepoint\.com))$/i.test(
    String(link || "").trim().match(/^https?:\/\/([^/:]+)/i)?.[1] || ""
  );

const isGoogleDriveUrl = (link) => {
  try {
    return new URL(String(link || "")).hostname.toLowerCase() === "drive.google.com";
  } catch {
    return false;
  }
};

const isSupportedCloudUrl = (link) => isOneDriveUrl(link) || isGoogleDriveUrl(link);

// Retain the existing Google Drive conversion while accepting OneDrive share/embed URLs.
const normalizeCloudUrl = (link) => {
  const raw = String(link || "").trim();
  if (!raw || !isGoogleDriveUrl(raw)) return raw;

  const fileIdMatch = raw.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || raw.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
  }
  return raw;
};

const AdminPanel = () => {
  const { logout, user: currentUser, loading: authLoading } = useAuth();

  // 🔐 AUTH

  // 📊 DATA
  const [users, setUsers] = useState([]);
  const [view, setView] = useState(() => currentUser?.isAdmin || currentUser?.permissions?.includes("viewReports") ? "monitor" : "content");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // 🔍 FILTER
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [orgUnitFilter, setOrgUnitFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [exportUser, setExportUser] = useState("ALL");
  const [exportDate, setExportDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [analyticsSearch, setAnalyticsSearch] = useState("");
  const PASSING_SCORE = 60;

  // 📄 PAGINATION (Prev/Next) — Monitoring User: 15/hal, Kelola Modul: 10/hal, Laporan Evaluasi: 10/hal
  const MONITOR_PAGE_SIZE = 15;
  const LIBRARY_PAGE_SIZE = 10;
  const ANALYTICS_PAGE_SIZE = 10;
  const [monitorPage, setMonitorPage] = useState(1);
  const [libraryPage, setLibraryPage] = useState(1);
  const [analyticsPage, setAnalyticsPage] = useState(1);

  // ➕ CREATE
  const [newName, setNewName] = useState("");
  const [newDivisi, setNewDivisi] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newUnitId, setNewUnitId] = useState("operasional");
  const [newDepartmentId, setNewDepartmentId] = useState("");
  const [newAssignmentPaths, setNewAssignmentPaths] = useState([]);
  const [newAccessRoleIds, setNewAccessRoleIds] = useState([]);

  // 📥 BULK IMPORT KARYAWAN (Excel/CSV)
  const [importFile, setImportFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  // 🎬 UPLOAD KONTEN BARU (Video / SOP / Modul)
  const [modules, setModules] = useState([]); // konten dinamis dari Firebase
  const [jobRoles, setJobRoles] = useState([]);
  const [orgUnits, setOrgUnits] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [accessRoles, setAccessRoles] = useState([]);
  const [newModTitle, setNewModTitle] = useState("");
  const [newModCategory, setNewModCategory] = useState("Modul"); // "Modul" | "SOP"
  const [newModContentType, setNewModContentType] = useState("video"); // "video" | "document"
  const [newModDesc, setNewModDesc] = useState("");
  const [newModAudience, setNewModAudience] = useState({ allCompany: false, assignments: [] });
  const [newModOrder, setNewModOrder] = useState(0);
  const [newModPrereq, setNewModPrereq] = useState("");
  const [newModKKM, setNewModKKM] = useState(70);
  const [newModMaxAttempt, setNewModMaxAttempt] = useState(0); // 0 = tanpa batas
  const [newModVideoLink, setNewModVideoLink] = useState("");
  const [newModDocumentLink, setNewModDocumentLink] = useState("");
  const [newModDocumentType, setNewModDocumentType] = useState("pdf"); // pdf/ppt/pptx/doc/docx
  const [isUploading, setIsUploading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([
    { question: "", options: ["", ""], correctIndex: 0, weight: 1 },
  ]);

  // 📚 MODULE LIBRARY (kelola modul yang sudah ada)
  const [libraryRoleFilter, setLibraryRoleFilter] = useState("ALL");
  const [librarySearch, setLibrarySearch] = useState("");
  const [editingModule, setEditingModule] = useState(null); // object modul yang sedang diedit
  const [editQuizQuestions, setEditQuizQuestions] = useState([]); // soal quiz modul yang sedang diedit

  // 🏦 BANK SOAL
  const [bankQuestions, setBankQuestions] = useState([]);
  const [bankSearch, setBankSearch] = useState("");
  const [bankForm, setBankForm] = useState({
    question: "", options: ["", ""], correctIndex: 0, weight: 1, category: "",
  });
  const [editingBankId, setEditingBankId] = useState(null);

  // 🔔 UI
  const [toast, setToast] = useState(null);
  const toastRef = useRef(null);
  const isAdministrator = currentUser?.isAdmin === true;
  const canManageUsers = isAdministrator || currentUser?.permissions?.includes("manageUsers");
  const canManageModules = isAdministrator || currentUser?.permissions?.includes("manageModules");
  const canCreateAssessments = isAdministrator || currentUser?.permissions?.includes("createAssessments");
  const canViewReports = isAdministrator || currentUser?.permissions?.includes("viewReports");
  const canManageOrganization = isAdministrator || currentUser?.permissions?.includes("manageOrganization");
  const visibleViews = [
    ...((canManageUsers || canViewReports) ? ["monitor"] : []),
    ...(canManageModules ? ["content", "library"] : []),
    ...((isAdministrator || canCreateAssessments) ? ["bank"] : []),
    ...(canViewReports ? ["analytics"] : []),
    ...(canManageOrganization ? ["organization"] : []),
  ];
  const visibleViewKey = visibleViews.join("|");

  useEffect(() => {
    const allowedViews = visibleViewKey.split("|").filter(Boolean);
    if (!allowedViews.includes(view)) setView(allowedViews[0] || "content");
  }, [view, visibleViewKey]);

  useEffect(() => {
    const listeners = [
      ["jobRoles", setJobRoles],
      ["orgUnits", setOrgUnits],
      ["departments", setDepartments],
      ["accessRoles", setAccessRoles],
    ].map(([path, setter]) => onValue(ref(db, path), (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, value]) => ({ id, ...value }));
      console.log(`[org] ${path}: ${list.length} data, ${list.filter((i) => i.active !== false).length} aktif`);
      setter(list.filter((item) => item.active !== false));
    }, (error) => {
      console.error(`[org] Gagal membaca ${path}:`, error);
    }));
    return () => listeners.forEach((unsubscribe) => unsubscribe());
  }, []);

  // ===============================
  // 🎬 FETCH TRAINING MODULES (Realtime, dinamis)
  // ===============================
  useEffect(() => {
    if (!currentUser) return undefined;
    if (!canManageModules) { setModules([]); return undefined; }
    if (!isAdministrator) {
      let active = true;
      const loadScopedModules = async () => {
        try {
          const result = await httpsCallable(functions, "getScopedTrainingModules")();
          if (active) setModules((result.data || []).reverse());
        } catch (error) {
          console.error("Gagal memuat materi sesuai cakupan:", error);
        }
      };
      loadScopedModules();
      const interval = setInterval(loadScopedModules, 60_000);
      return () => { active = false; clearInterval(interval); };
    }
    const modulesRef = ref(db, "trainingModules");
    const unsubscribe = onValue(modulesRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const list = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
          setModules(list.reverse());
        } else {
          setModules([]);
        }
      } catch (err) {
        console.error("Modules processing error:", err);
      }
    }, (error) => {
      console.error("Firebase Modules Read Error:", error);
    });

    return () => unsubscribe();
  }, [currentUser?.kode, canManageModules, isAdministrator]);

  // ===============================
  // 🏦 FETCH BANK SOAL (Realtime)
  // ===============================
  useEffect(() => {
    if (!isAdministrator && !canCreateAssessments) { setBankQuestions([]); return undefined; }
    const unsubscribe = onValue(ref(db, "questionBank"), (snapshot) => {
      const data = snapshot.val();
      const questions = data
        ? Object.entries(data).map(([id, question]) => ({ id, ...question }))
        : [];
      setBankQuestions(questions.reverse());
    }, (error) => {
      console.error("Question bank processing error:", error);
    });
    return () => unsubscribe();
  }, [isAdministrator, canCreateAssessments]);

  const combinedPlaylist = modules;

  const availableRoles = [...new Set([
    ...jobRoles.map((item) => item.name),
    ...users.map((item) => item.role),
    ...combinedPlaylist.flatMap(item =>
      Array.isArray(item.roleAccess) ? item.roleAccess : [item.roleAccess]
    ),
  ])].filter(Boolean);

  // ===============================
  // 📊 FETCH USERS (Realtime)
  // ===============================
  useEffect(() => {
    if (!currentUser || (!canManageUsers && !canViewReports)) { setUsers([]); return undefined; }
    if (!isAdministrator) {
      let active = true;
      const loadScopedUsers = async () => {
        try {
          const result = await httpsCallable(functions, "getScopedUsers")();
          if (active) setUsers((result.data || []).filter((item) => item.nama).reverse());
        } catch (error) {
          console.error("Gagal memuat karyawan sesuai cakupan:", error);
        }
      };
      loadScopedUsers();
      const interval = setInterval(loadScopedUsers, 60_000);
      return () => { active = false; clearInterval(interval); };
    }
    const usersRef = ref(db, "users");

    const unsubscribe = onValue(usersRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const userList = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
          }));
          const validUsers = userList.filter(u => u.nama);
          setUsers(validUsers.reverse());
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("Data processing error:", err);
      }
    }, (error) => {
      console.error("Firebase Read Error:", error);
      showToast("Akses Ditolak: Cek Firebase Rules", "error");
    });

    return () => unsubscribe();
  }, [currentUser?.kode, canManageUsers, canViewReports, isAdministrator]);

  // ===============================
  // 🔔 TOAST HELPER
  // ===============================
  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 3200);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast(`Kode ${text} berhasil disalin!`, "success");
  };

  // ===============================
  // ➕ CREATE USER
  // ===============================
  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!newName || !newRole || !jobRoles.some((role) => role.name === newRole && role.unitId === newUnitId && (role.departmentId || "") === newDepartmentId) || (orgUnits.find((unit) => unit.id === newUnitId)?.requiresDepartment && !newDepartmentId)) {
      showToast("Lengkapi semua bidang formulir!", "error");
      return;
    }

    const code = "IKG-" + Math.random().toString(36).substring(2, 7).toUpperCase();

    const selectedRole = jobRoles.find((item) => item.name === newRole && item.unitId === newUnitId && (item.departmentId || "") === newDepartmentId);
    const currentAssignment = {
      unitId: newUnitId,
      departmentId: newDepartmentId || null,
      jobRoleId: selectedRole?.id || makeRecordId(newRole),
      outletId: newDivisi.trim() || null,
    };
    const organizationAssignments = [...newAssignmentPaths, currentAssignment]
      .filter((assignment, index, all) => all.findIndex((candidate) => candidate.unitId === assignment.unitId && candidate.departmentId === assignment.departmentId && candidate.jobRoleId === assignment.jobRoleId) === index)
      .map((assignment, index) => ({ ...assignment, primary: index === 0 }));

    const newUser = {
      nama: newName,
      divisi: newDivisi.trim(),
      role: newRole,
      unitId: currentAssignment.unitId,
      departmentId: currentAssignment.departmentId,
      jobRoleId: currentAssignment.jobRoleId,
      organizationAssignments,
      accessRoleIds: newAccessRoleIds,
      kode: code,
      progress: 0,
      completedVideos: [],
      passedQuizzes: [],
      lastActive: "Never",
      createdAt: new Date().toLocaleDateString("id-ID"),
      status: "Active"
    };

    try {
      await httpsCallable(functions, "saveEmployee")({ code, mode: "create", patch: newUser });
      showToast(`BERHASIL DIBUAT: ${code}`, "success");
      setNewName("");
      setNewDivisi("");
      setNewRole("");
      setNewDepartmentId("");
      setNewAssignmentPaths([]);
      setNewAccessRoleIds([]);
      setSearch("");
    } catch (err) {
      console.error("CREATE USER ERROR:", err);
      showToast("Gagal menyimpan ke Firebase!", "error");
    }
  };

  // ===============================
  // 📥 BULK IMPORT KARYAWAN (Excel/CSV)
  // Format kolom yang diterima: Nama, Outlet, Role
  // (case-insensitive; "Divisi" juga diterima sebagai alias "Outlet")
  // ===============================
  const downloadImportTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ["Nama", "Unit", "Departemen", "Jabatan", "Outlet"],
      ["Contoh Nama Karyawan", "Operasional", "", "Kasir", "Bintaro"],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Template_Import_Karyawan.xlsx");
  };

  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportFile(file);
  };

  const processBulkImport = async () => {
    if (!importFile) {
      showToast("Pilih file Excel/CSV terlebih dahulu!", "error");
      return;
    }

    setIsImporting(true);
    try {
      const buffer = await importFile.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

      if (rows.length === 0) {
        showToast("File kosong atau format tidak terbaca!", "error");
        return;
      }

      const records = [];
      const createdCodes = [];
      let skippedRows = 0;

      rows.forEach((row) => {
        const nama = String(row.Nama ?? row.nama ?? "").trim();
        const divisi = String(row.Outlet ?? row.outlet ?? row.Divisi ?? row.divisi ?? "").trim();
        const role = String(row.Jabatan ?? row.jabatan ?? row.Role ?? row.role ?? "").trim();
        const unitName = String(row.Unit ?? row.unit ?? "Operasional").trim();
        const departmentName = String(row.Departemen ?? row.departemen ?? row.Department ?? "").trim();
        const unit = orgUnits.find((item) => item.id === makeRecordId(unitName) || item.name?.toLowerCase() === unitName.toLowerCase());
        const department = departmentName ? departments.find((item) => item.id === makeRecordId(departmentName) || item.name?.toLowerCase() === departmentName.toLowerCase()) : null;
        const jobRole = jobRoles.find((item) => item.name?.toLowerCase() === role.toLowerCase() && item.unitId === unit?.id && (!item.departmentId || item.departmentId === department?.id));
        if (!nama || !role || !unit || !jobRole || (unit.requiresDepartment && !department) || (departmentName && !department)) {
          skippedRows += 1;
          return;
        }

        const code = "IKG-" + Math.random().toString(36).substring(2, 7).toUpperCase();
        records.push({ code, user: {
          nama,
          divisi,
          role,
          unitId: unit.id,
          departmentId: department?.id || null,
          jobRoleId: jobRole.id,
          organizationAssignments: [{ unitId: unit.id, departmentId: department?.id || null, jobRoleId: jobRole.id, outletId: divisi || null, primary: true }],
          accessRoleIds: [],
          kode: code,
          progress: 0,
          completedVideos: [],
          passedQuizzes: [],
          lastActive: "Never",
          createdAt: new Date().toLocaleDateString("id-ID"),
          status: "Active",
        } });
        createdCodes.push(code);
      });

      if (createdCodes.length === 0) {
        showToast("Tidak ada baris valid. Cek kolom Nama & Role.", "error");
        return;
      }

      await httpsCallable(functions, "bulkImportEmployees")({ records });
      showToast(`${createdCodes.length} karyawan diimpor${skippedRows ? `, ${skippedRows} baris dilewati karena unit/departemen tidak cocok` : ""}.`, skippedRows ? "info" : "success");
      setImportFile(null);
    } catch (err) {
      console.error("BULK IMPORT ERROR:", err);
      showToast("Gagal memproses file impor. Cek format kolom.", "error");
    } finally {
      setIsImporting(false);
    }
  };

  // ===============================
  // 🔁 TOGGLE STATUS
  // ===============================
  const toggleStatus = async (userData) => {
    const nextStatus = userData.status === "Active" ? "Inactive" : "Active";
    try {
      await httpsCallable(functions, "saveEmployee")({ code: userData.id, patch: { status: nextStatus } });
      showToast(`${userData.nama} → ${nextStatus === "Active" ? "Aktif" : "Nonaktif"}`, "success");
    } catch {
      showToast("Gagal memperbarui status", "error");
    }
  };

  // ===============================
  // 🔑 RESET / REGENERATE KODE AKSES
  // Karena "kode" adalah primary key node user di Firebase, reset kode
  // berarti pindah node: tulis data ke key baru, lalu hapus key lama.
  // ===============================
  const regenerateAccessCode = async (userData) => {
    const confirmed = window.confirm(
      `Reset kode akses untuk "${userData.nama}"? Kode lama (${userData.kode || userData.id}) akan mati dan tidak bisa dipakai login lagi.`
    );
    if (!confirmed) return;

    const newCode = "IKG-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    try {
      await httpsCallable(functions, "moveEmployeeAccessCode")({ oldCode: userData.id, newCode });
      showToast(`Kode akses baru untuk ${userData.nama}: ${newCode}`, "success");
    } catch (err) {
      console.error("RESET KODE ERROR:", err);
      showToast("Gagal reset kode akses!", "error");
    }
  };

  // ===============================
  // 🎯 PROGRESS CALCULATION
  // ===============================
  const getUserProgress = (u) => {
    if (!u) return 0;
    const userRole = String(u.role || "").toUpperCase();

    const userPlaylist = combinedPlaylist
      .filter(item => {
        if (userRole === "ADMIN") return true;
        return matchesModuleAudience(u, item);
      })
      .filter(v => getModuleStatus(v) === MODULE_STATUS.ACTIVE);

    const total = userPlaylist.length * 2;
    if (total === 0) return 0;

    const completed = Array.isArray(u.completedVideos) ? u.completedVideos : [];
    const passed    = Array.isArray(u.passedQuizzes)   ? u.passedQuizzes   : [];

    const vDone = completed.filter(id => userPlaylist.some(v => v.id === id)).length;
    const qDone = passed.filter(q => userPlaylist.some(v => v.id === q.id)).length;

    return Math.min(Math.round(((vDone + qDone) / total) * 100), 100);
  };

  // ===============================
  // 🔍 FILTER LOGIC
  // ===============================
  const filteredUsers = users.filter(u => {
    const s = search.toLowerCase();
    const kodeUser = (u.kode || u.id || "").toLowerCase();
    const matchSearch = (u.nama?.toLowerCase().includes(s)) || kodeUser.includes(s);
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const assignments = normalizeAssignments(u);
    const matchUnit = orgUnitFilter === "ALL" || assignments.some((assignment) => assignment.unitId === orgUnitFilter);
    const matchDepartment = departmentFilter === "ALL" || assignments.some((assignment) => assignment.departmentId === departmentFilter);
    return matchSearch && matchRole && matchUnit && matchDepartment;
  });

  const activeCount = users.filter(u => u.status === "Active").length;
  const avgProgress = users.length
    ? Math.round(users.reduce((a, u) => a + getUserProgress(u), 0) / users.length)
    : 0;
  const quizTotal = users.reduce((a, u) => a + (u.passedQuizzes?.length || 0), 0);

  // Reset ke halaman 1 setiap kali pencarian/filter Monitoring User berubah
  useEffect(() => {
    setMonitorPage(1);
  }, [search, roleFilter, orgUnitFilter, departmentFilter]);

  const monitorTotalPages = Math.max(1, Math.ceil(filteredUsers.length / MONITOR_PAGE_SIZE));

  // Jaga-jaga: kalau data berubah (mis. karyawan dihapus) dan halaman aktif
  // jadi melebihi total halaman yang tersedia, mundurkan ke halaman terakhir.
  useEffect(() => {
    if (monitorPage > monitorTotalPages) setMonitorPage(monitorTotalPages);
  }, [monitorTotalPages]);

  const paginatedUsers = filteredUsers.slice(
    (monitorPage - 1) * MONITOR_PAGE_SIZE,
    monitorPage * MONITOR_PAGE_SIZE
  );

  const scoreClass = (s) => s >= 80 ? "high" : s >= 60 ? "mid" : "low";

  const getExportData = () => {
    return users.filter(u => {
      if (exportUser !== "ALL" && u.kode !== exportUser) return false;
      if (exportDate) {
        const [y, m, d] = exportDate.split("-");
        const dateStr = `${parseInt(d)}/${parseInt(m)}/${y}`;
        if (!u.passedQuizzes?.some(q => q.date === dateStr)) return false;
      }
      return true;
    });
  };

  // ===============================
  // 🧩 HELPER: buildQuizRows
  // ===============================
  const buildQuizRows = (savedAnswers, quizTitle) => {
    const raw = Array.isArray(savedAnswers) ? savedAnswers : [];
    const mod   = combinedPlaylist.find(p => p.title === quizTitle);
    const pquiz = Array.isArray(mod?.quiz) ? mod.quiz : [];

    const len = Math.max(raw.length, pquiz.length);
    if (len === 0) return [];

    return Array.from({ length: len }, (_, i) => {
      const r  = raw[i];
      const pq = pquiz[i] || {};

      if (r && typeof r === "object" && !Array.isArray(r)) {
        return {
          question: r.question || pq.q || `Pertanyaan ${i + 1}`,
          options:  (Array.isArray(r.options) && r.options.length)
                      ? r.options
                      : (pq.options || []),
          chosen:   typeof r.chosen === "string" ? r.chosen : "",
          correct:  r.correct || pq.a || "",
        };
      }

      return {
        question: pq.q || `Pertanyaan ${i + 1}`,
        options:  pq.options || [],
        chosen:   typeof r === "string" ? r : "",
        correct:  pq.a || "",
      };
    });
  };

  // ===============================
  // 🎬 QUIZ BUILDER HANDLERS (Upload Konten)
  // ===============================
  const addQuizQuestion = () => {
    setQuizQuestions(prev => [...prev, { question: "", options: ["", ""], correctIndex: 0, weight: 1 }]);
  };

  const removeQuizQuestion = (qIdx) => {
    setQuizQuestions(prev => prev.filter((_, i) => i !== qIdx));
  };

  const updateQuestionText = (qIdx, text) => {
    setQuizQuestions(prev => prev.map((q, i) => (i === qIdx ? { ...q, question: text } : q)));
  };

  const updateQuestionWeight = (qIdx, weight) => {
    setQuizQuestions(prev => prev.map((q, i) => (i === qIdx ? { ...q, weight: Number(weight) || 1 } : q)));
  };

  const addOption = (qIdx) => {
    setQuizQuestions(prev => prev.map((q, i) =>
      i === qIdx ? { ...q, options: [...q.options, ""] } : q
    ));
  };

  const removeOption = (qIdx, oIdx) => {
    setQuizQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      if (q.options.length <= 2) return q; // minimal 2 opsi
      const newOptions = q.options.filter((_, j) => j !== oIdx);
      let newCorrect = q.correctIndex;
      if (oIdx === q.correctIndex) newCorrect = 0;
      else if (oIdx < q.correctIndex) newCorrect = q.correctIndex - 1;
      return { ...q, options: newOptions, correctIndex: newCorrect };
    }));
  };

  const updateOptionText = (qIdx, oIdx, text) => {
    setQuizQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      return { ...q, options: q.options.map((opt, j) => (j === oIdx ? text : opt)) };
    }));
  };

  const setCorrectOption = (qIdx, oIdx) => {
    setQuizQuestions(prev => prev.map((q, i) => (i === qIdx ? { ...q, correctIndex: oIdx } : q)));
  };

  // ── Handler yang sama persis tapi untuk quiz builder di modal EDIT MODUL ──
  const addEditQuizQuestion = () => {
    setEditQuizQuestions(prev => [...prev, { question: "", options: ["", ""], correctIndex: 0, weight: 1 }]);
  };

  const removeEditQuizQuestion = (qIdx) => {
    setEditQuizQuestions(prev => prev.filter((_, i) => i !== qIdx));
  };

  const updateEditQuestionText = (qIdx, text) => {
    setEditQuizQuestions(prev => prev.map((q, i) => (i === qIdx ? { ...q, question: text } : q)));
  };

  const updateEditQuestionWeight = (qIdx, weight) => {
    setEditQuizQuestions(prev => prev.map((q, i) => (i === qIdx ? { ...q, weight: Number(weight) || 1 } : q)));
  };

  const addEditOption = (qIdx) => {
    setEditQuizQuestions(prev => prev.map((q, i) =>
      i === qIdx ? { ...q, options: [...q.options, ""] } : q
    ));
  };

  const removeEditOption = (qIdx, oIdx) => {
    setEditQuizQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      if (q.options.length <= 2) return q;
      const newOptions = q.options.filter((_, j) => j !== oIdx);
      let newCorrect = q.correctIndex;
      if (oIdx === q.correctIndex) newCorrect = 0;
      else if (oIdx < q.correctIndex) newCorrect = q.correctIndex - 1;
      return { ...q, options: newOptions, correctIndex: newCorrect };
    }));
  };

  const updateEditOptionText = (qIdx, oIdx, text) => {
    setEditQuizQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      return { ...q, options: q.options.map((opt, j) => (j === oIdx ? text : opt)) };
    }));
  };

  const setEditCorrectOption = (qIdx, oIdx) => {
    setEditQuizQuestions(prev => prev.map((q, i) => (i === qIdx ? { ...q, correctIndex: oIdx } : q)));
  };

  // Validasi generik dipakai baik untuk quiz modul baru maupun quiz yang diedit
  const validateQuizQuestionsList = (list) => {
    for (let i = 0; i < list.length; i++) {
      const q = list[i];
      if (!q.question.trim()) return `Pertanyaan #${i + 1} belum diisi!`;
      const filled = q.options.filter(o => o.trim());
      if (filled.length < 2) return `Pertanyaan #${i + 1} minimal butuh 2 opsi jawaban!`;
      if (!q.options[q.correctIndex]?.trim()) return `Pertanyaan #${i + 1}: tandai jawaban yang benar!`;
    }
    return null;
  };

  // ===============================
  // 🏦 BANK SOAL: CRUD
  // Soal di bank bisa dipakai ulang lintas modul lewat tombol
  // "Ambil dari Bank Soal" di form Upload Konten.
  // ===============================
  const updateBankOptionText = (oIdx, text) => {
    setBankForm(prev => ({
      ...prev,
      options: prev.options.map((opt, j) => (j === oIdx ? text : opt)),
    }));
  };

  const addBankOption = () => {
    setBankForm(prev => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeBankOption = (oIdx) => {
    setBankForm(prev => {
      if (prev.options.length <= 2) return prev;
      const options = prev.options.filter((_, j) => j !== oIdx);
      let correctIndex = prev.correctIndex;
      if (oIdx === prev.correctIndex) correctIndex = 0;
      else if (oIdx < prev.correctIndex) correctIndex = prev.correctIndex - 1;
      return { ...prev, options, correctIndex };
    });
  };

  const resetBankForm = () => {
    setBankForm({ question: "", options: ["", ""], correctIndex: 0, weight: 1, category: "" });
    setEditingBankId(null);
  };

  // Muat soal yang sudah ada ke form untuk diedit
  const startEditBankQuestion = (bq) => {
    setBankForm({
      question: bq.q || "",
      options: Array.isArray(bq.options) && bq.options.length ? [...bq.options] : ["", ""],
      correctIndex: Math.max(0, (bq.options || []).indexOf(bq.a)),
      weight: bq.weight || 1,
      category: bq.category || "",
    });
    setEditingBankId(bq.id);
  };

  const cancelEditBankQuestion = () => {
    resetBankForm();
  };

  const saveBankQuestion = async () => {
    if (!bankForm.question.trim()) {
      showToast("Pertanyaan wajib diisi!", "error");
      return;
    }
    const filled = bankForm.options.map(o => o.trim()).filter(Boolean);
    if (filled.length < 2) {
      showToast("Minimal 2 opsi jawaban!", "error");
      return;
    }
    const correctText = bankForm.options[bankForm.correctIndex]?.trim();
    if (!correctText) {
      showToast("Tandai jawaban yang benar!", "error");
      return;
    }

    const payload = {
      q: bankForm.question.trim(),
      options: filled,
      a: correctText,
      weight: Number(bankForm.weight) || 1,
      category: bankForm.category.trim() || "Umum",
      createdAt: new Date().toLocaleDateString("id-ID"),
    };

    try {
      if (editingBankId) {
        // Mode edit: update entri yang sudah ada, tidak ganti createdAt
        await httpsCallable(functions, "saveQuestionBankItem")({ id: editingBankId, question: payload });
        showToast("Soal di Bank Soal berhasil diperbarui!", "success");
      } else {
        // Mode tambah baru
        const id = `Q-${Date.now()}`;
        await httpsCallable(functions, "saveQuestionBankItem")({ id, question: payload });
        showToast("Soal ditambahkan ke Bank Soal!", "success");
      }
      resetBankForm();
    } catch (err) {
      console.error("SAVE BANK QUESTION ERROR:", err);
      showToast("Gagal menyimpan soal ke bank!", "error");
    }
  };

  const deleteBankQuestion = async (id) => {
    const confirmed = window.confirm("Hapus soal ini dari Bank Soal? Modul yang sudah memakainya tidak akan berubah.");
    if (!confirmed) return;
    try {
      await httpsCallable(functions, "deleteQuestionBankItem")({ id });
      showToast("Soal dihapus dari bank.", "success");
    } catch {
      showToast("Gagal menghapus soal.", "error");
    }
  };

  // Menarik satu soal dari Bank Soal ke form quiz modul yang sedang dibuat
  const importFromBank = (bq) => {
    const correctIndex = Math.max(0, bq.options.indexOf(bq.a));
    setQuizQuestions(prev => [
      ...prev,
      { question: bq.q, options: [...bq.options], correctIndex, weight: bq.weight || 1 },
    ]);
    showToast("Soal dari bank ditambahkan ke quiz modul.", "success");
  };

  // Sama seperti di atas, tapi menambahkan ke quiz modul yang sedang DIEDIT
  const importFromBankToEdit = (bq) => {
    const correctIndex = Math.max(0, bq.options.indexOf(bq.a));
    setEditQuizQuestions(prev => [
      ...prev,
      { question: bq.q, options: [...bq.options], correctIndex, weight: bq.weight || 1 },
    ]);
    showToast("Soal dari bank ditambahkan ke quiz modul.", "success");
  };

  const filteredBankQuestions = bankQuestions.filter(bq => {
    const s = bankSearch.toLowerCase();
    return bq.q?.toLowerCase().includes(s) || bq.category?.toLowerCase().includes(s);
  });

  const resetModuleForm = () => {
    setNewModTitle("");
    setNewModCategory("Modul");
    setNewModContentType("video");
    setNewModDesc("");
    setNewModAudience({ allCompany: false, assignments: [] });
    setNewModOrder(0);
    setNewModPrereq("");
    setNewModKKM(70);
    setNewModMaxAttempt(0);
    setNewModVideoLink("");
    setNewModDocumentLink("");
    setNewModDocumentType("pdf");
    setQuizQuestions([{ question: "", options: ["", ""], correctIndex: 0, weight: 1 }]);
  };

  const validateModuleForm = () => {
    if (!newModTitle.trim()) return "Judul konten wajib diisi!";

    if (newModContentType === "document") {
      if (!newModDocumentLink.trim()) return "Link OneDrive dokumen wajib diisi!";
      if (!/^https?:\/\//i.test(newModDocumentLink.trim()) || !isSupportedCloudUrl(newModDocumentLink)) return "Gunakan link OneDrive yang valid.";
    } else {
      if (!newModVideoLink.trim()) return "Link OneDrive video wajib diisi!";
      if (!/^https?:\/\//i.test(newModVideoLink.trim()) || !isSupportedCloudUrl(newModVideoLink)) return "Gunakan link OneDrive yang valid.";
    }

    if (!newModAudience.allCompany && newModAudience.assignments.length === 0) return "Pilih minimal satu target unit/departemen/jabatan.";

    for (let i = 0; i < quizQuestions.length; i++) {
      const q = quizQuestions[i];
      if (!q.question.trim()) return `Pertanyaan #${i + 1} belum diisi!`;
      const filled = q.options.filter(o => o.trim());
      if (filled.length < 2) return `Pertanyaan #${i + 1} minimal butuh 2 opsi jawaban!`;
      if (!q.options[q.correctIndex]?.trim()) return `Pertanyaan #${i + 1}: tandai jawaban yang benar!`;
    }
    return null;
  };

  const handleUploadModule = async (e) => {
    e.preventDefault();
    const errorMsg = validateModuleForm();
    if (errorMsg) {
      showToast(errorMsg, "error");
      return;
    }

    setIsUploading(true);

    try {
      const uploadedFileUrl = newModContentType === "document"
        ? normalizeCloudUrl(newModDocumentLink)
        : normalizeCloudUrl(newModVideoLink);
      const cloudSource = isOneDriveUrl(uploadedFileUrl) ? "onedrive" : "gdrive";

      const quizPayload = quizQuestions.map(q => ({
        q: q.question.trim(),
        options: q.options.map(o => o.trim()).filter(Boolean),
        a: q.options[q.correctIndex].trim(),
        weight: Number(q.weight) || 1,
      }));

      const moduleId = `${newModCategory.toUpperCase()}-${Date.now()}`;

      const newModule = {
        title: newModTitle.trim(),
        category: newModCategory === "Modul" ? "User Guide" : newModCategory,
        description: newModDesc.trim(),
        audience: newModAudience,
        roleAccess: rolesForAudience(newModAudience, jobRoles, availableRoles),
        quiz: quizPayload,
        status: MODULE_STATUS.ACTIVE,
        order: Number(newModOrder) || 0,
        prerequisiteId: newModPrereq || null,
        passingGrade: Number(newModKKM) || 70,
        maxAttempts: Number(newModMaxAttempt) || 0,
        isSoon: false,
        disabled: false,
        createdAt: new Date().toLocaleDateString("id-ID"),
        ...(newModContentType === "document"
          ? { type: "document", documentUrl: uploadedFileUrl, documentType: newModDocumentType, documentSource: cloudSource }
          : { type: "video", url: uploadedFileUrl, videoUrl: uploadedFileUrl, videoSource: cloudSource }),
      };

      await httpsCallable(functions, "saveTrainingModule")({ id: moduleId, module: newModule });

      showToast(`Konten "${newModTitle}" berhasil diupload!`, "success");
      resetModuleForm();
    } catch (err) {
      console.error("UPLOAD MODULE ERROR:", err);
      showToast("Gagal mengupload konten. Coba lagi.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // ===============================
  // 📚 MODULE LIBRARY: status, edit, replace dokumen / ganti link video
  // Catatan: hanya modul dinamis dari Firebase (trainingModules) yang bisa
  // dikelola di sini. Konten statis dari data.js tidak tersimpan di DB
  // sehingga tidak bisa diubah lewat panel ini.
  // ===============================
  const updateModuleStatus = async (moduleId, status) => {
    try {
      await httpsCallable(functions, "setTrainingModuleStatus")({ id: moduleId, status });
      showToast(`Status modul diubah ke "${STATUS_LABEL[status]}"`, "success");
    } catch (err) {
      console.error("UPDATE MODULE STATUS ERROR:", err);
      showToast("Gagal mengubah status modul", "error");
    }
  };

  const openEditModule = (mod) => {
    console.log("legacy:", mod.roleAccess, "audience:", audienceFromLegacyRoles(mod, jobRoles), "jobRoles:", jobRoles);
    setEditingModule({
      ...mod,
      roleAccess: Array.isArray(mod.roleAccess) ? mod.roleAccess : [mod.roleAccess].filter(Boolean),
      audience: audienceFromLegacyRoles(mod, jobRoles),
      order: mod.order ?? 0,
      prerequisiteId: mod.prerequisiteId || "",
      passingGrade: mod.passingGrade ?? 70,
      maxAttempts: mod.maxAttempts ?? 0,
      url: mod.url || mod.videoUrl || "",
      documentUrl: mod.documentUrl || "",
      documentType: mod.documentType || "pdf",
    });

    // Konversi format quiz tersimpan ({q, options, a, weight}) ke format builder UI
    // ({question, options, correctIndex, weight}) supaya bisa langsung diedit.
    const existingQuiz = Array.isArray(mod.quiz) ? mod.quiz : [];
    setEditQuizQuestions(
      existingQuiz.length > 0
        ? existingQuiz.map(q => ({
            question: q.q || "",
            options: Array.isArray(q.options) && q.options.length ? [...q.options] : ["", ""],
            correctIndex: Math.max(0, (q.options || []).indexOf(q.a)),
            weight: q.weight || 1,
          }))
        : [{ question: "", options: ["", ""], correctIndex: 0, weight: 1 }]
    );
  };

  const saveModuleEdit = async () => {
    if (!editingModule) return;
    if (!editingModule.title?.trim()) {
      showToast("Judul modul tidak boleh kosong!", "error");
      return;
    }
    if (!editingModule.audience?.allCompany && !(editingModule.audience?.assignments || []).length) {
      showToast("Pilih minimal satu target unit/departemen/jabatan.", "error");
      return;
    }

    const quizError = validateQuizQuestionsList(editQuizQuestions);
    if (quizError) {
      showToast(quizError, "error");
      return;
    }

    const editingIsDocument = isDocumentContent(editingModule);
    const editingLinkField = editingIsDocument ? editingModule.documentUrl : editingModule.url;

    if (!String(editingLinkField || "").trim()) {
      showToast(editingIsDocument ? "Link OneDrive dokumen wajib diisi!" : "Link OneDrive video wajib diisi!", "error");
      return;
    }
    if (!isSupportedCloudUrl(editingLinkField)) {
      showToast("Gunakan link OneDrive yang valid.", "error");
      return;
    }

    try {
      const fileUrl = normalizeCloudUrl(editingLinkField);
      const cloudSource = isOneDriveUrl(fileUrl) ? "onedrive" : "gdrive";

      const quizPayload = editQuizQuestions.map(q => ({
        q: q.question.trim(),
        options: q.options.map(o => o.trim()).filter(Boolean),
        a: q.options[q.correctIndex].trim(),
        weight: Number(q.weight) || 1,
      }));

      const patch = {
        title: editingModule.title.trim(),
        description: (editingModule.description || "").trim(),
        audience: editingModule.audience,
        roleAccess: rolesForAudience(editingModule.audience, jobRoles, availableRoles).length
          ? rolesForAudience(editingModule.audience, jobRoles, availableRoles)
          : editingModule.roleAccess,
        order: Number(editingModule.order) || 0,
        prerequisiteId: editingModule.prerequisiteId || null,
        passingGrade: Number(editingModule.passingGrade) || 70,
        maxAttempts: Number(editingModule.maxAttempts) || 0,
        quiz: quizPayload,
        ...(editingIsDocument
          ? { documentUrl: fileUrl, documentType: editingModule.documentType || "pdf", documentSource: cloudSource }
          : { url: fileUrl, videoUrl: fileUrl, videoSource: cloudSource }),
      };

      await httpsCallable(functions, "saveTrainingModule")({ id: editingModule.id, module: patch });
      showToast("Perubahan modul & quiz berhasil disimpan!", "success");
      setEditingModule(null);
    } catch (err) {
      console.error("SAVE MODULE EDIT ERROR:", err);
      showToast("Gagal menyimpan perubahan modul", "error");
    }
  };

  const libraryModules = modules
    .filter(m => libraryRoleFilter === "ALL" || (Array.isArray(m.roleAccess) ? m.roleAccess : [m.roleAccess]).includes(libraryRoleFilter))
    .filter(m => {
      const s = librarySearch.trim().toLowerCase();
      if (!s) return true;
      const title = (m.title || "").toLowerCase();
      const desc = (m.description || m.desc || "").toLowerCase();
      const category = (m.category || "").toLowerCase();
      return title.includes(s) || desc.includes(s) || category.includes(s);
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Reset ke halaman 1 setiap kali pencarian/filter Kelola Modul berubah
  useEffect(() => {
    setLibraryPage(1);
  }, [librarySearch, libraryRoleFilter]);

  const libraryTotalPages = Math.max(1, Math.ceil(libraryModules.length / LIBRARY_PAGE_SIZE));

  useEffect(() => {
    if (libraryPage > libraryTotalPages) setLibraryPage(libraryTotalPages);
  }, [libraryTotalPages]);

  const paginatedLibraryModules = libraryModules.slice(
    (libraryPage - 1) * LIBRARY_PAGE_SIZE,
    libraryPage * LIBRARY_PAGE_SIZE
  );

  // ===============================
  // 📊 EXPORT TO EXCEL
  // ===============================
  const exportToExcel = () => {
    const exportList = getExportData();
    const wb = XLSX.utils.book_new();

    const getGrade   = (s) => s >= 100 ? "A" : s >= 80 ? "B" : s >= 60 ? "C" : s >= 40 ? "D" : "E";
    const getStatus = (s) => s >= 60 ? "LULUS" : "TIDAK LULUS";

    const parseIDDate = (str) => {
      if (!str || str === "-") return null;
      const parts = String(str).split("/");
      if (parts.length !== 3) return null;
      const [d, m, y] = parts.map(p => parseInt(p, 10));
      if (!d || !m || !y) return null;
      const dt = new Date(y, m - 1, d);
      return isNaN(dt.getTime()) ? null : dt;
    };

    const dayNames   = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    const monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

    const allQuizzes = exportList.flatMap(u => u.passedQuizzes || []);
    const avgScore   = allQuizzes.length
      ? Math.round(allQuizzes.reduce((a, q) => a + (q.score || 0), 0) / allQuizzes.length)
      : 0;
    const passCount  = allQuizzes.filter(q => q.score >= 70).length;
    const passRate   = allQuizzes.length ? Math.round((passCount / allQuizzes.length) * 100) : 0;

    const overviewAOA = [
      ["IKIGAI CORE SYSTEM"],
      ["LAPORAN EVALUASI MONITORING TRAINING"],
      [`Digenerate: ${new Date().toLocaleString("id-ID")}`],
      [],
      ["RINGKASAN UTAMA"],
      ["TOTAL KARYAWAN", "TOTAL EVALUASI", "RATA-RATA SKOR", "TINGKAT KELULUSAN"],
      [exportList.length, allQuizzes.length, avgScore, `${passRate}%`],
    ];

    const wsOverview = XLSX.utils.aoa_to_sheet(overviewAOA);
    XLSX.utils.book_append_sheet(wb, wsOverview, "🏠 Ringkasan");

    const dbHeaders = [
      "No", "Nama", "Kode", "Outlet", "Role", "Status Akun",
      "Modul", "Skor", "Grade", "Status", "Tanggal", "Hari", "Bulan", "Tahun"
    ];

    let dbNo = 1;
    const dbBody = exportList.flatMap(u =>
      (u.passedQuizzes || []).map(q => {
        const dt = parseIDDate(q.date);
        return [
          dbNo++,
          u.nama || "-",
          u.kode || "-",
          u.divisi || "-",
          u.role || "-",
          u.status || "-",
          q.title || "-",
          Number(q.score) || 0,
          getGrade(q.score),
          getStatus(q.score),
          dt || q.date || "-",
          dt ? dayNames[dt.getDay()] : "-",
          dt ? monthNames[dt.getMonth()] : "-",
          dt ? dt.getFullYear() : "-",
        ];
      })
    );

    const wsDb = XLSX.utils.aoa_to_sheet([dbHeaders, ...dbBody]);
    XLSX.utils.book_append_sheet(wb, wsDb, "💾 Database Kuis");

    XLSX.writeFile(wb, `IKIGAI_Report_${Date.now()}.xlsx`);
    showToast("File Excel berhasil diunduh!", "success");
  };

  // ===============================
  // 📕 EXPORT TO PDF (REVISI FINAL - fix overflow teks soal/opsi)
  // ===============================
  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const exportList = getExportData();
    const W  = doc.internal.pageSize.getWidth();
    const H  = doc.internal.pageSize.getHeight();
    const ML = 14;
    const MR = 14;
    const CW = W - ML - MR;

    const C = {
      navy:       [12,  18,  45],
      teal:       [0,   188, 162],
      white:      [255, 255, 255],
      slate:      [94,  103, 130],
      slateLight: [220, 225, 238],
      bgLight:    [247, 249, 252],
      green:      [16,  185, 129],
      amber:      [245, 158, 11],
      red:        [239, 68,  68],
      greenBg:    [209, 250, 229],
      redBg:      [254, 226, 226],
      amberBg:    [254, 243, 199],
      ink:        [22,  28,  55],
      gold:       [217, 164, 65],
      silver:     [165, 173, 188],
      bronze:     [184, 124, 70],
    };

    const setFill   = (arr) => doc.setFillColor(arr[0], arr[1], arr[2]);
    const setStroke = (arr) => doc.setDrawColor(arr[0], arr[1], arr[2]);
    const setTxt    = (arr) => doc.setTextColor(arr[0], arr[1], arr[2]);

    const rect = (x, y, w, h, color, r = 0) => {
      setFill(color);
      r > 0 ? doc.roundedRect(x, y, w, h, r, r, "F") : doc.rect(x, y, w, h, "F");
    };
    const line = (x1, y1, x2, y2, color, lw = 0.3) => {
      setStroke(color);
      doc.setLineWidth(lw);
      doc.line(x1, y1, x2, y2);
    };
    const txt = (text, x, y, opts = {}) => {
      const { size = 9, font = "helvetica", style = "normal", color = C.ink, align = "left", maxW } = opts;
      doc.setFont(font, style);
      doc.setFontSize(size);
      setTxt(color);
      if (maxW) {
        const lines = doc.splitTextToSize(String(text), maxW);
        doc.text(lines, x, y, { align });
        return lines.length;
      }
      doc.text(String(text), x, y, { align });
      return 1;
    };

    // ── FIX: helper hitung tinggi baris teks secara AKURAT dari jsPDF,
    // bukan angka tebakan hardcode. Ini yang menghilangkan bug teks
    // "keluar"/terpotong dari area kotak hijau/merah/abu saat wrap 2+ baris.
    const getLineHeightMM = (fontSizePt) => {
      const scaleFactor = doc.internal.scaleFactor; // ~2.8346 untuk unit "mm"
      const lineHeightFactor = doc.getLineHeightFactor ? doc.getLineHeightFactor() : 1.15;
      return (fontSizePt / scaleFactor) * lineHeightFactor;
    };

    const drawStatusIcon = (cx, cy, type) => {
      const r = 2;
      if (type === "correct") {
        setFill(C.green); doc.circle(cx, cy, r, "F");
        setStroke(C.white); doc.setLineWidth(0.55);
        doc.line(cx - 1.0, cy + 0.1, cx - 0.2, cy + 0.9);
        doc.line(cx - 0.2, cy + 0.9, cx + 1.1, cy - 0.7);
      } else if (type === "wrong") {
        setFill(C.red); doc.circle(cx, cy, r, "F");
        setStroke(C.white); doc.setLineWidth(0.55);
        doc.line(cx - 0.9, cy - 0.9, cx + 0.9, cy + 0.9);
        doc.line(cx + 0.9, cy - 0.9, cx - 0.9, cy + 0.9);
      } else {
        setFill(C.slateLight); doc.circle(cx, cy, r, "F");
        setStroke(C.slate); doc.setLineWidth(0.4);
        doc.line(cx - 0.9, cy, cx + 0.9, cy);
      }
    };

    const pageHeader = () => {
      rect(0, 0, W, 14, C.navy);
      rect(0, 14, W, 1.5, C.teal);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      setTxt(C.teal);
      doc.text("IKIGAI", ML, 9.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setTxt([180, 185, 200]);
      doc.text(" CORE", ML + 13, 9.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      setTxt([160, 165, 185]);
      const now = new Date().toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric" });
      doc.text(now, W - MR, 9.5, { align: "right" });
    };

    const pageFooter = (pageNum, totalPages) => {
      line(ML, H - 10, W - MR, H - 10, C.slateLight, 0.3);
      txt("IKIGAI TRAINING CENTER", ML, H - 5.5, { size: 7, color: C.slate });
      txt(`${pageNum} / ${totalPages}`, W - MR, H - 5.5, { size: 7, color: C.slate, align: "right" });
    };

    const totalUsers   = exportList.length;
    const totalQuizzes = exportList.reduce((a, u) => a + (u.passedQuizzes?.length || 0), 0);
    const allScores    = exportList.flatMap(u => (u.passedQuizzes || []).map(q => q.score || 0));
    const avgScore     = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
    const passRate     = allScores.length ? Math.round((allScores.filter(s => s >= 60).length / allScores.length) * 100) : 0;

    const topPerformers = exportList
      .map((u) => {
        const quizzes = u.passedQuizzes || [];
        const total = quizzes.length;
        const avg = total > 0 ? Math.round(quizzes.reduce((a, q) => a + (q.score || 0), 0) / total) : 0;
        const passCount = quizzes.filter((q) => q.score >= 60).length;
        return { ...u, avg, total, passCount };
      })
      .filter((u) => u.total > 0)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);

    // PAGE 1 — COVER
    pageHeader();

    rect(0, 15.5, W, 78, C.bgLight);
    rect(ML, 28, 2.5, 42, C.teal, 1.25);

    setFill(C.teal);
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 8; c++) {
        doc.circle(W - MR - 28 + c * 3.5, 30 + r * 3.5, 0.5, "F");
      }
    }

    txt("LAPORAN HASIL QUIZ", ML + 10, 42, { size: 24, style: "bold", color: C.navy });
    txt("User Performance Executive Summary", ML + 10, 52, { size: 11, color: C.slate });

    const fullDate = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    txt(fullDate, ML + 10, 61, { size: 9, color: C.slate });

    rect(ML + 10, 67, 36, 7, C.teal, 3.5);
    txt("OFFICIAL REPORT", ML + 28, 71.8, { size: 7, style: "bold", color: C.white, align: "center" });

    line(ML, 98, W - MR, 98, C.teal, 0.6);

    const statItems = [
      { label: "TOTAL USER",     value: totalUsers,     accent: C.teal  },
      { label: "TOTAL QUIZ",     value: totalQuizzes,   accent: C.green },
      { label: "RATA-RATA SKOR", value: avgScore,       accent: C.amber },
      { label: "PASS RATE",      value: `${passRate}%`, accent: C.navy  },
    ];

    const boxW = (CW - 9) / 4;
    const boxY = 105;
    const boxH = 34;

    statItems.forEach((s, i) => {
      const bx = ML + i * (boxW + 3);
      rect(bx, boxY, boxW, boxH, C.white, 2);
      setStroke(C.slateLight);
      doc.setLineWidth(0.2);
      doc.roundedRect(bx, boxY, boxW, boxH, 2, 2, "S");
      rect(bx, boxY, boxW, 2, s.accent, 1);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      setTxt(s.accent);
      doc.text(String(s.value), bx + boxW / 2, boxY + 20, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      setTxt(C.slate);
      doc.text(s.label, bx + boxW / 2, boxY + 28, { align: "center" });
    });

    const dist = [
      { range: "Sangat Baik", sub: "90 - 100", count: allScores.filter(s => s >= 90).length, color: C.green },
      { range: "Baik",        sub: "75 - 89",  count: allScores.filter(s => s >= 75 && s < 90).length, color: C.teal  },
      { range: "Cukup",       sub: "60 - 74",  count: allScores.filter(s => s >= 60 && s < 75).length, color: C.amber },
      { range: "Kurang",      sub: "< 60",     count: allScores.filter(s => s < 60).length, color: C.red   },
    ];

    let y = 155;
    line(ML, y - 5, W - MR, y - 5, C.teal, 0.6);
    txt("DISTRIBUSI SKOR", ML, y, { size: 10, style: "bold", color: C.navy });
    txt(`Analisis persebaran nilai dari ${allScores.length} aktivitas quiz.`, ML, y + 4.5, { size: 7.5, color: C.slate });

    y += 10;
    const barH = 8;
    const totalDists = allScores.length || 1;

    doc.saveGraphicsState();
    doc.roundedRect(ML, y, CW, barH, 1.5, 1.5, null);
    doc.clip();
    if (typeof doc.discardPath === "function") doc.discardPath();

    if (allScores.length === 0) {
      rect(ML, y, CW, barH, C.slateLight, 0);
    } else {
      let currentX = ML;
      dist.forEach((seg) => {
        const segW = (seg.count / totalDists) * CW;
        if (segW > 0) {
          setFill(seg.color);
          doc.rect(currentX, y, segW + 0.4, barH, "F");
          currentX += segW;
        }
      });
    }
    doc.restoreGraphicsState();

    y += barH + 6;
    const colW = CW / 4;
    dist.forEach((seg, i) => {
      const lx = ML + i * colW;
      setFill(seg.color);
      doc.circle(lx + 2, y + 2, 1.2, "F");
      txt(seg.range, lx + 6, y + 3, { size: 7.5, style: "bold", color: C.ink });
      txt(seg.sub, lx + 6, y + 7, { size: 6.5, color: C.slate });
      const pct = allScores.length ? Math.round((seg.count / totalDists) * 100) : 0;
      txt(`${seg.count} (${pct}%)`, lx + 6, y + 12, { size: 9, style: "bold", color: seg.color });
      if (i < 3) line(lx + colW - 2, y, lx + colW - 2, y + 13, C.slateLight, 0.3);
    });

    y += 18;
    line(ML, y, W - MR, y, C.teal, 0.6);

    y += 8;
    txt("TOP PERFORMERS", ML, y, { size: 10, style: "bold", color: C.navy });
    txt("Karyawan dengan performa terbaik berdasarkan rata-rata skor.", ML, y + 4.5, { size: 7.5, color: C.slate });

    y += 8;

    if (topPerformers.length === 0) {
      rect(ML, y, CW, 15, C.bgLight, 2);
      txt("Belum ada data performa yang tersedia.", ML + CW / 2, y + 9, { align: "center", style: "italic", color: C.slate });
    } else {
      topPerformers.forEach((p, i) => {
        const rowH = 13;
        if (i % 2 === 0) rect(ML, y, CW, rowH, C.bgLight, 1.5);

        const rankColor = i === 0 ? C.gold : i === 1 ? C.silver : i === 2 ? C.bronze : C.slate;
        setFill(rankColor);
        doc.circle(ML + 6, y + rowH / 2, 3.5, "F");
        txt(String(i + 1), ML + 6, y + rowH / 2 + 1.2, { size: 8, style: "bold", color: C.white, align: "center" });

        txt(String(p.nama).toUpperCase(), ML + 13, y + 5.5, { size: 8.5, style: "bold", color: C.ink });
        txt(`${p.role}  |  ${p.divisi || "-"}`, ML + 13, y + 9.5, { size: 6.5, color: C.slate });

        const barX = ML + 90;
        const barWMini = 45;
        rect(barX, y + 5.5, barWMini, 2, C.slateLight, 1);
        const scoreW = (p.avg / 100) * barWMini;
        const scoreCol = p.avg >= 85 ? C.green : p.avg >= 70 ? C.teal : C.amber;
        rect(barX, y + 5.5, scoreW, 2, scoreCol, 1);

        txt(String(p.avg), ML + 145, y + 6.5, { size: 12, style: "bold", color: scoreCol, align: "right" });
        txt("AVG SCORE", ML + 145, y + 10, { size: 5, color: C.slate, align: "right" });

        txt(`${p.passCount}/${p.total}`, ML + 172, y + 6.5, { size: 10, style: "bold", color: C.navy, align: "right" });
        txt("QUIZ PASSED", ML + 172, y + 10, { size: 5, color: C.slate, align: "right" });

        y += rowH + 1.5;
      });
    }

    const footerY = H - 20;
    line(ML, footerY, W - MR, footerY, C.slateLight, 0.3);
    txt("PERIODE LAPORAN:", ML, footerY + 5, { size: 7, style: "bold" });
    txt(exportDate || "Seluruh Waktu", ML + 25, footerY + 5, { size: 7 });
    txt("DOKUMEN:", W - MR - 50, footerY + 5, { size: 7, style: "bold" });
    txt("Confidential / Ikigai Core System", W - MR - 35, footerY + 5, { size: 7 });

    // PAGE 2 — RINGKASAN TABEL
    doc.addPage();
    pageHeader();

    y = 26;
    rect(ML, y, CW, 8, C.navy, 2);
    txt("RINGKASAN SEMUA HASIL QUIZ", ML + 4, y + 5.5, { size: 9, style: "bold", color: C.teal });
    y += 12;

    const summaryRows = exportList.flatMap(u =>
      (u.passedQuizzes || []).map(q => [u.nama, u.kode, u.divisi || "-", u.role, q.title, q.score, q.date])
    );

    autoTable(doc, {
      head: [["Nama", "Kode", "Cabang", "Role", "Modul", "Skor", "Tanggal"]],
      body: summaryRows,
      startY: y,
      styles: { fontSize: 8, cellPadding: { top: 3, bottom: 3, left: 3, right: 3 }, font: "helvetica", textColor: C.ink, lineColor: C.slateLight, lineWidth: 0.2 },
      headStyles: { fillColor: C.navy, textColor: C.teal, fontStyle: "bold", fontSize: 8 },
      alternateRowStyles: { fillColor: C.bgLight },
      columnStyles: {
        0: { cellWidth: 30 }, 1: { cellWidth: 20 }, 2: { cellWidth: 24 },
        3: { cellWidth: 18 }, 4: { cellWidth: 52 },
        5: { cellWidth: 14, halign: "center", fontStyle: "bold" }, 6: { cellWidth: 24, halign: "center" },
      },
      margin: { left: ML, right: MR },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 5) {
          const score = Number(data.cell.raw);
          if (score >= 80)      data.cell.styles.textColor = C.green;
          else if (score >= 60) data.cell.styles.textColor = C.amber;
          else                  data.cell.styles.textColor = C.red;
        }
      },
    });

    // PAGES 3+ — DETAIL PER USER PER QUIZ
    exportList.forEach((u) => {
      (u.passedQuizzes || []).forEach((quiz) => {
        doc.addPage();
        pageHeader();

        let y = 22;

        rect(ML, y, CW, 26, C.bgLight, 3);
        rect(ML, y, 3, 26, C.teal, 1.5);

        const av = u.nama?.[0]?.toUpperCase() || "?";
        rect(ML + 7, y + 4, 14, 14, C.navy, 7);
        doc.setFont("helvetica", "bold"); doc.setFontSize(9); setTxt(C.teal);
        doc.text(av, ML + 14, y + 13, { align: "center" });

        txt(u.nama, ML + 25, y + 10, { size: 11, style: "bold", color: C.ink });
        txt(`${u.kode}  ·  ${u.role}  ·  ${u.divisi || "-"}`, ML + 25, y + 16.5, { size: 7.5, color: C.slate });
        txt(`Tanggal Quiz: ${quiz.date}`, ML + 25, y + 22, { size: 7.5, color: C.slate });

        const sc      = quiz.score;
        const scColor = sc >= 80 ? C.green   : sc >= 60 ? C.amber   : C.red;
        const scBg    = sc >= 80 ? C.greenBg : sc >= 60 ? C.amberBg : C.redBg;
        rect(W - MR - 28, y + 3, 24, 20, scBg, 3);
        doc.setFont("helvetica", "bold"); doc.setFontSize(18); setTxt(scColor);
        doc.text(String(sc), W - MR - 16, y + 16, { align: "center" });
        doc.setFont("helvetica", "normal"); doc.setFontSize(7); setTxt(C.slate);
        doc.text("/ 100", W - MR - 16, y + 21, { align: "center" });

        y += 30;

        rect(ML, y, CW, 9, C.navy, 2);
        rect(ML + 3, y + 2.5, 4, 4, C.teal, 1);
        doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); setTxt(C.teal);
        doc.text(String(quiz.title), ML + 10, y + 6.2);
        y += 13;

        const rows = buildQuizRows(quiz.userAnswers, quiz.title);
        let correct = 0;

        // ── FIX: konstanta ukuran teks. Line-height TIDAK di-hardcode lagi,
        // melainkan dihitung dari jsPDF via getLineHeightMM() di atas, supaya
        // tinggi box (qBoxH/rowH) SELALU sinkron dengan tinggi teks asli
        // yang dirender jsPDF. Ini yang menyelesaikan bug "teks keluar dari
        // area hijau/merah" ketika soal atau opsi jawaban wrap ke 2+ baris.
        const Q_FS      = 8;
        const Q_PAD_V   = 3.5;   // padding atas+bawah kotak soal
        const Q_MIN_H   = 7.5;   // tinggi minimum kotak soal (1 baris)

        const OPT_FS     = 7;
        const OPT_PAD_V  = 3.6;  // padding atas+bawah kotak opsi
        const OPT_MIN_H  = 6.5;  // tinggi minimum kotak opsi (1 baris)

        const Q_LINE_H   = getLineHeightMM(Q_FS);     // dinamis, bukan 4.3 hardcode
        const OPT_LINE_H = getLineHeightMM(OPT_FS);   // dinamis, bukan 3.3 hardcode

        rows.forEach((row, i) => {
          const ua        = row.chosen;
          const isCorrect = !!ua && ua === row.correct;
          if (isCorrect) correct++;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(Q_FS);
          const soalLines = doc.splitTextToSize(row.question, CW - 22);
          // + buffer kecil (0.5mm/baris) sbg jaga-jaga ekstra anti-terpotong
          const qBoxH = Math.max(Q_MIN_H, Q_PAD_V + soalLines.length * (Q_LINE_H + 0.5));

          if (y + qBoxH > H - 42) { doc.addPage(); pageHeader(); y = 22; }

          const qBg = !ua ? C.slateLight : isCorrect ? C.greenBg : C.redBg;
          rect(ML, y, CW, qBoxH, qBg, 2);

          const statusType = !ua ? "notAnswered" : isCorrect ? "correct" : "wrong";
          drawStatusIcon(ML + 4, y + qBoxH / 2, statusType);

          doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); setTxt(C.slate);
          doc.text(`${String(i + 1).padStart(2, "0")}`, ML + 9, y + qBoxH / 2 + 1.1);

          // FIX: teks soal di-vertical-center di dalam box (bukan mentok atas),
          // supaya box yang lebih tinggi dari kebutuhan (karena Q_MIN_H) tetap
          // terlihat rapi, dan box yang pas tetap tidak memotong baris terakhir.
          const soalBlockH = soalLines.length * Q_LINE_H;
          const soalStartY = y + (qBoxH - soalBlockH) / 2 + Q_LINE_H * 0.75;

          doc.setFont("helvetica", "normal"); doc.setFontSize(Q_FS); setTxt(C.ink);
          doc.text(soalLines, ML + 17, soalStartY);

          y += qBoxH;

          const halfW = (CW - 4) / 2;
          const opts  = Array.isArray(row.options) ? row.options : [];

          for (let j = 0; j < opts.length; j += 2) {
            const pairIdx  = [j, j + 1].filter((idx) => idx < opts.length);
            const pairOpts = pairIdx.map((idx) => opts[idx]);
            const wrapped  = pairOpts.map((opt) => doc.splitTextToSize(String(opt), halfW - 12));
            const maxLines = Math.max(...wrapped.map((w) => w.length), 1);
            const rowH     = Math.max(OPT_MIN_H, OPT_PAD_V + maxLines * (OPT_LINE_H + 0.4));

            if (y + rowH > H - 30) { doc.addPage(); pageHeader(); y = 22; }

            pairOpts.forEach((opt, k) => {
              const ox      = ML + k * (halfW + 4);
              const isRight = opt === row.correct;
              const isUser  = opt === ua;

              let optBg  = C.white;
              let optTxt = C.ink;
              let border = C.slateLight;

              if (isRight)     { optBg = C.greenBg; optTxt = C.green; border = C.green; }
              else if (isUser) { optBg = C.redBg;   optTxt = C.red;   border = C.red;   }

              setFill(optBg); setStroke(border); doc.setLineWidth(0.25);
              doc.roundedRect(ox, y, halfW, rowH, 1.5, 1.5, "FD");

              doc.setFont("helvetica", "bold"); doc.setFontSize(OPT_FS); setTxt(optTxt);
              doc.text(String.fromCharCode(65 + pairIdx[k]) + ".", ox + 2.5, y + 4.0);

              // FIX: teks opsi juga di-vertical-center di dalam box-nya
              const optBlockH = wrapped[k].length * OPT_LINE_H;
              const optStartY = y + (rowH - optBlockH) / 2 + OPT_LINE_H * 0.75;

              doc.setFont("helvetica", isRight || isUser ? "bold" : "normal");
              doc.setFontSize(OPT_FS); setTxt(optTxt);
              doc.text(wrapped[k], ox + 8, optStartY);
            });

            y += rowH + 1.2;
          }

          if (ua && !isCorrect) {
            const correctLine = doc.splitTextToSize(`Jawaban benar: ${row.correct}`, CW - 6);
            const hintH = Math.max(6.5, 3 + correctLine.length * (getLineHeightMM(7) + 0.4));
            if (y + hintH > H - 20) { doc.addPage(); pageHeader(); y = 22; }
            rect(ML, y, CW, hintH, [255, 241, 241], 1.5);
            doc.setFont("helvetica", "normal"); doc.setFontSize(7); setTxt(C.green);
            doc.text(correctLine, ML + 3, y + 4.5);
            y += hintH + 1.5;
          } else if (!ua) {
            if (y > H - 16) { doc.addPage(); pageHeader(); y = 22; }
            rect(ML, y, CW, 5.5, [245, 245, 250], 1.5);
            doc.setFont("helvetica", "italic"); doc.setFontSize(7); setTxt(C.slate);
            doc.text("Tidak ada jawaban tercatat", ML + 3, y + 4);
            y += 7;
          }

          y += 3;
        });

        if (y > H - 32) { doc.addPage(); pageHeader(); y = 22; }
        y += 2;
        line(ML, y, W - MR, y, C.slateLight, 0.4);
        y += 5;

        rect(ML, y, CW, 18, C.navy, 3);

        const cols3 = [
          { label: "BENAR",      value: correct,                color: C.green },
          { label: "SALAH",      value: rows.length - correct,  color: C.red   },
          { label: "SKOR AKHIR", value: `${quiz.score} / 100`,  color: C.teal  },
        ];
        const cw3 = CW / 3;
        cols3.forEach((c3, i) => {
          const cx = ML + i * cw3 + cw3 / 2;
          doc.setFont("helvetica", "bold"); doc.setFontSize(14); setTxt(c3.color);
          doc.text(String(c3.value), cx, y + 10, { align: "center" });
          doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); setTxt([170, 180, 200]);
          doc.text(c3.label, cx, y + 15.5, { align: "center" });

          if (i < 2) {
            setStroke([40, 50, 90]); doc.setLineWidth(0.3);
            doc.line(ML + (i + 1) * cw3, y + 3, ML + (i + 1) * cw3, y + 15);
          }
        });
      });
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      pageFooter(p, totalPages);
    }

    doc.save(`IKIGAI_DetailReport_${Date.now()}.pdf`);
    showToast("Laporan PDF berhasil diekspor!", "success");
  };

  // ===============================
  // 📋 ANALYTICS ROWS (Riwayat & Evaluasi Kuis)
  // Dihitung di sini (bukan di dalam JSX) supaya bisa dipaginasi.
  // ===============================
  const analyticsRows = (() => {
    const exportUsersList = getExportData();
    const s = analyticsSearch.trim().toLowerCase();
    return exportUsersList
      .flatMap(u =>
        (u.passedQuizzes || []).map((quiz, idx) => ({ user: u, quiz, key: `${u.id}-${idx}` }))
      )
      .filter(({ quiz }) => {
        const isPass = (quiz.score || 0) >= PASSING_SCORE;
        if (statusFilter === "PASS") return isPass;
        if (statusFilter === "FAIL") return !isPass;
        return true;
      })
      .filter(({ user, quiz }) => {
        if (!s) return true;
        const nama = (user.nama || "").toLowerCase();
        const role = (user.role || "").toLowerCase();
        const modul = (quiz.title || "").toLowerCase();
        const kode = (user.kode || user.id || "").toLowerCase();
        return nama.includes(s) || role.includes(s) || modul.includes(s) || kode.includes(s);
      });
  })();

  // Reset ke halaman 1 setiap kali pencarian/filter Laporan Evaluasi berubah
  useEffect(() => {
    setAnalyticsPage(1);
  }, [analyticsSearch, exportUser, exportDate, statusFilter]);

  const analyticsTotalPages = Math.max(1, Math.ceil(analyticsRows.length / ANALYTICS_PAGE_SIZE));

  useEffect(() => {
    if (analyticsPage > analyticsTotalPages) setAnalyticsPage(analyticsTotalPages);
  }, [analyticsTotalPages]);

  const paginatedAnalyticsRows = analyticsRows.slice(
    (analyticsPage - 1) * ANALYTICS_PAGE_SIZE,
    analyticsPage * ANALYTICS_PAGE_SIZE
  );

  // ===============================
  // ⬆️⬇️ SCROLL HELPERS (dipakai tombol scroll-to-top/bottom di semua halaman)
  // ===============================
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    window.scrollTo({ top: scrollHeight, behavior: "smooth" });
  };

  if (authLoading) return null;

  const pageProps = {
    ANALYTICS_PAGE_SIZE, AudienceTargetEditor, DOCUMENT_TYPE_OPTIONS, IconBank, IconCheck, IconCopy, IconEdit, IconExcel,
    IconKey, IconLibrary, IconPdf, IconPlus, IconSearch, IconTrash, IconUpload, IconUserPlus,
    IconVideo, LIBRARY_PAGE_SIZE, MODULE_STATUS, MONITOR_PAGE_SIZE, OrganizationSettings, PASSING_SCORE, Pagination, STATUS_LABEL,
    accessRoles, activeCount, addBankOption, addOption, addQuizQuestion, analyticsPage, analyticsRows, analyticsSearch,
    analyticsTotalPages, availableRoles, avgProgress, bankForm, bankQuestions, bankSearch, canManageUsers, cancelEditBankQuestion,
    copyToClipboard, deleteBankQuestion, departmentFilter, departments, downloadImportTemplate, editingBankId, exportDate, exportToExcel,
    exportToPDF, exportUser, filteredBankQuestions, filteredUsers, getModuleStatus, getUserProgress, handleCreateUser, handleImportFileChange,
    handleUploadModule, importFile, importFromBank, isDocumentContent, isImporting, isUploading, jobRoles, libraryModules,
    libraryPage, libraryRoleFilter, librarySearch, libraryTotalPages, makeRecordId, modules, monitorPage, monitorTotalPages,
    newAccessRoleIds, newAssignmentPaths, newDepartmentId, newDivisi, newModAudience, newModCategory, newModContentType, newModDesc,
    newModDocumentLink, newModDocumentType, newModKKM, newModMaxAttempt, newModOrder, newModPrereq, newModTitle, newModVideoLink,
    newName, newRole, newUnitId, openEditModule, orgUnitFilter, orgUnits, paginatedAnalyticsRows, paginatedLibraryModules,
    paginatedUsers, processBulkImport, quizQuestions, quizTotal, regenerateAccessCode, removeBankOption, removeOption, removeQuizQuestion,
    roleFilter, saveBankQuestion, scoreClass, search, setAnalyticsPage, setAnalyticsSearch, setBankForm, setBankSearch,
    setCorrectOption, setDepartmentFilter, setExportDate, setExportUser, setLibraryPage, setLibraryRoleFilter, setLibrarySearch, setMonitorPage,
    setNewAccessRoleIds, setNewAssignmentPaths, setNewDepartmentId, setNewDivisi, setNewModAudience, setNewModCategory, setNewModContentType, setNewModDesc,
    setNewModDocumentLink, setNewModDocumentType, setNewModKKM, setNewModMaxAttempt, setNewModOrder, setNewModPrereq, setNewModTitle, setNewModVideoLink,
    setNewName, setNewRole, setNewUnitId, setOrgUnitFilter, setRoleFilter, setSearch, setSelectedEmployee, setSelectedUser,
    setStatusFilter, showToast, startEditBankQuestion, statusFilter, toggleStatus, updateBankOptionText, updateModuleStatus, updateOptionText,
    updateQuestionText, updateQuestionWeight, users,
  };

  // Daftar tab topbar. Di HP hanya ikon yang tampil (label disembunyikan via CSS).
  const NAV_TABS = [
    { key: "monitor",      label: "Monitoring User",     Icon: IconMonitor,   show: canManageUsers || canViewReports },
    { key: "content",      label: "Upload Konten",       Icon: IconUpload,    show: canManageModules },
    { key: "library",      label: "Kelola Modul",        Icon: IconLibrary,   show: canManageModules },
    { key: "bank",         label: "Bank Soal",           Icon: IconBank,      show: isAdministrator || canCreateAssessments },
    { key: "analytics",    label: "Laporan Evaluasi",    Icon: IconAnalytics, show: canViewReports },
    { key: "organization", label: "Struktur Organisasi", Icon: IconOrg,       show: canManageOrganization },
  ];

  return (
    <div className="emerald-admin-root">
      {/* Toast Alert floating */}
      {toast && <div className={`m-toast ${toast.type}`}>{toast.msg}</div>}

      {/* Modern Mobile-First Header */}
      <header className="m-admin-header">
        <div className="m-header-top">
          <div className="m-brand">
            <div className="m-brand-icon"><IconShield /></div>
            <div>
              <h1 className="m-brand-title">IKIGAI</h1>
              <span className="m-brand-sub">ADMIN MANAGEMENT</span>
            </div>
          </div>
          <button className="m-btn-logout" onClick={logout} title="Keluar Akun" aria-label="Keluar Akun">
            <IconLogout /> <span className="hide-on-mobile">Keluar</span>
          </button>
        </div>

        {/* Sticky Mobile Segmented Tab Control */}
        <nav className="m-tab-segmented" aria-label="Navigasi admin">
          {NAV_TABS.filter((tab) => tab.show).map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              className={`m-tab-btn ${view === key ? "active" : ""}`}
              onClick={() => setView(key)}
              title={label}
              aria-label={label}
              aria-current={view === key ? "page" : undefined}
            >
              <Icon />
              <span className="m-tab-label">{label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Main Container */}
      <main className="m-admin-content">

        {view === "organization" && <OrganizationPage {...pageProps} />}

        {view === "monitor" && (
          <MonitoringPage {...pageProps} />
        )}

        {view === "content" && (
          <ContentUploadPage {...pageProps} />
        )}

        {view === "library" && (
          <ModuleLibraryPage {...pageProps} />
        )}

        {view === "bank" && (
          <QuestionBankPage {...pageProps} />
        )}

        {view === "analytics" && (
          /* View Analytics Logs */
          <AnalyticsPage {...pageProps} />
        )}

      </main>

      {/* ⬆️⬇️ Tombol Scroll ke Atas/Bawah — tampil di semua tab/halaman */}
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 20,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 60,
        }}
      >
        <button
          type="button"
          onClick={scrollToTop}
          title="Scroll ke paling atas"
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0c122d",
            color: "#00bca2",
            boxShadow: "0 4px 14px rgba(12, 18, 45, 0.35)",
            cursor: "pointer",
          }}
        >
          <IconChevronUp />
        </button>
        <button
          type="button"
          onClick={scrollToBottom}
          title="Scroll ke paling bawah"
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0c122d",
            color: "#00bca2",
            boxShadow: "0 4px 14px rgba(12, 18, 45, 0.35)",
            cursor: "pointer",
          }}
        >
          <IconChevronDown />
        </button>
      </div>

      {/* Mobile Bottom Sheet Modal Inspect */}
      {selectedEmployee && (
        <EmployeeEditor
          employee={selectedEmployee}
          units={orgUnits}
          departments={departments}
          jobRoles={jobRoles}
          accessRoles={accessRoles}
          showToast={showToast}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {selectedUser && (
        <div className="m-modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="m-bottom-sheet-modal" onClick={e => e.stopPropagation()}>
            <div className="m-sheet-header">
              <div className="m-sheet-handle-bar" />
              <div className="m-sheet-title-wrap">
                <div>
                  <h3 className="m-sheet-h3">{selectedUser.quiz.title}</h3>
                  <p className="m-sheet-sub">Evaluasi: {selectedUser.user.nama}</p>
                </div>
                <button
                  type="button"
                  className="m-sheet-close"
                  onClick={() => setSelectedUser(null)}
                >
                  <IconClose />
                </button>
              </div>
            </div>

            <div className="m-sheet-body">
              {(() => {
                const rows = buildQuizRows(selectedUser.quiz.userAnswers, selectedUser.quiz.title);
                if (rows.length === 0) return <div className="m-empty-td">Tidak ada data detail jawaban.</div>;

                return rows.map((row, i) => {
                  const notAnswered = !row.chosen;
                  const isCorrect   = !notAnswered && row.chosen === row.correct;

                  return (
                    <div
                      key={i}
                      className={`m-question-card ${notAnswered ? "pending" : isCorrect ? "pass" : "fail"}`}
                    >
                      <p className="m-q-text">{i + 1}. {row.question}</p>

                      <div className="m-opt-stack">
                        {row.options.map((opt, j) => (
                          <div
                            key={j}
                            className={`m-opt-item ${opt === row.correct ? "right" : ""} ${opt === row.chosen && opt !== row.correct ? "wrong" : ""}`}
                          >
                            <span className="m-opt-prefix">{String.fromCharCode(65 + j)}.</span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>

                      <div className="m-hint-footer">
                        {notAnswered ? (
                          <span className="m-text-muted">Jawaban tidak tercatat oleh sistem</span>
                        ) : (
                          <span>
                            Jawaban Karyawan: <strong>{row.chosen}</strong>
                            {!isCorrect && <span className="m-correct-hint"> → Benar: {row.correct}</span>}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 📚 Bottom Sheet Modal: Edit Modul (Library) */}
      {editingModule && (
        <div className="m-modal-backdrop" onClick={() => setEditingModule(null)}>
          <div className="m-bottom-sheet-modal" onClick={e => e.stopPropagation()}>
            <div className="m-sheet-header">
              <div className="m-sheet-handle-bar" />
              <div className="m-sheet-title-wrap">
                <div>
                  <h3 className="m-sheet-h3">Edit Modul</h3>
                  <p className="m-sheet-sub">
                    {editingModule.title}
                    {" · "}
                    {isDocumentContent(editingModule) ? "Dokumen (PDF)" : "Video"}
                  </p>
                </div>
                <button type="button" className="m-sheet-close" onClick={() => setEditingModule(null)}>
                  <IconClose />
                </button>
              </div>
            </div>

            <div className="m-sheet-body">
              <div className="m-form-stack">
                <div className="m-input-group">
                  <label className="m-label">JUDUL</label>
                  <input
                    className="m-input-pill"
                    type="text"
                    value={editingModule.title}
                    onChange={e => setEditingModule(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="m-input-group">
                  <label className="m-label">KETERANGAN</label>
                  <textarea
                    className="m-textarea-pill"
                    rows={3}
                    value={editingModule.description || ""}
                    onChange={e => setEditingModule(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="m-input-row-2">
                  <div className="m-input-group">
                    <label className="m-label">URUTAN MODUL</label>
                    <input
                      className="m-input-pill"
                      type="number"
                      min="0"
                      value={editingModule.order}
                      onChange={e => setEditingModule(prev => ({ ...prev, order: e.target.value }))}
                    />
                  </div>
                  <div className="m-input-group">
                    <label className="m-label">MODUL PRASYARAT</label>
                    <select
                      className="m-select-pill"
                      value={editingModule.prerequisiteId}
                      onChange={e => setEditingModule(prev => ({ ...prev, prerequisiteId: e.target.value }))}
                    >
                      <option value="">— Tidak ada —</option>
                      {modules.filter(m => m.id !== editingModule.id).map(m => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="m-input-row-2">
                  <div className="m-input-group">
                    <label className="m-label">KKM</label>
                    <input
                      className="m-input-pill"
                      type="number"
                      min="0"
                      max="100"
                      value={editingModule.passingGrade}
                      onChange={e => setEditingModule(prev => ({ ...prev, passingGrade: e.target.value }))}
                    />
                  </div>
                  <div className="m-input-group">
                    <label className="m-label">BATAS PERCOBAAN ULANG</label>
                    <input
                      className="m-input-pill"
                      type="number"
                      min="0"
                      value={editingModule.maxAttempts}
                      onChange={e => setEditingModule(prev => ({ ...prev, maxAttempts: e.target.value }))}
                    />
                  </div>
                </div>

                <AudienceTargetEditor
                  units={orgUnits}
                  departments={departments}
                  jobRoles={jobRoles}
                  value={editingModule.audience}
                  onChange={(audience) => setEditingModule((previous) => ({ ...previous, audience }))}
                />

                {isDocumentContent(editingModule) ? (
                  <>
                    <div className="m-input-group">
                      <label className="m-label">LINK DOKUMEN ONEDRIVE</label>
                      <input
                        className="m-input-pill"
                        type="url"
                        placeholder="https://1drv.ms/... atau https://...sharepoint.com/..."
                        value={editingModule.documentUrl || ""}
                        onChange={e => setEditingModule(prev => ({ ...prev, documentUrl: e.target.value }))}
                      />
                      <p className="m-card-p" style={{ marginTop: 6 }}>
                        Gunakan tautan embed/berbagi OneDrive dan pastikan karyawan memiliki izin membuka file.
                      </p>
                    </div>
                    <div className="m-input-group">
                      <label className="m-label">JENIS DOKUMEN</label>
                      <select
                        className="m-select-pill"
                        value={editingModule.documentType || "pdf"}
                        onChange={e => setEditingModule(prev => ({ ...prev, documentType: e.target.value }))}
                      >
                        {DOCUMENT_TYPE_OPTIONS.map(ext => (
                          <option key={ext} value={ext}>{ext.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="m-input-group">
                    <label className="m-label">LINK VIDEO ONEDRIVE</label>
                    <input
                      className="m-input-pill"
                      type="url"
                      placeholder="https://1drv.ms/... atau https://...sharepoint.com/..."
                      value={editingModule.url || ""}
                      onChange={e => setEditingModule(prev => ({ ...prev, url: e.target.value }))}
                    />
                    <p className="m-card-p" style={{ marginTop: 6 }}>
                      Gunakan tautan embed/berbagi OneDrive dan pastikan karyawan memiliki izin menonton file.
                    </p>
                  </div>
                )}

                {/* Quiz Builder — bisa tambah/hapus/edit soal & tandai jawaban benar */}
                <div className="m-quiz-builder">
                  <div className="m-label-row">
                    <label className="m-label">QUIZ EVALUASI</label>
                    <button type="button" className="m-btn-add-question" onClick={addEditQuizQuestion}>
                      <IconPlus /> Tambah Soal
                    </button>
                  </div>

                  {bankQuestions.length > 0 && (
                    <div className="m-bank-picker">
                      <span className="m-label">AMBIL DARI BANK SOAL:</span>
                      <div className="m-bank-picker-list">
                        {bankQuestions.slice(0, 8).map(bq => (
                          <button
                            type="button"
                            key={bq.id}
                            className="m-bank-picker-item"
                            onClick={() => importFromBankToEdit(bq)}
                            title="Tambahkan soal ini ke quiz"
                          >
                            <IconPlus /> {bq.q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {editQuizQuestions.map((q, qIdx) => (
                    <div className="m-quiz-question-card" key={qIdx}>
                      <div className="m-quiz-question-head">
                        <span className="m-quiz-question-num">Soal {qIdx + 1}</span>
                        {editQuizQuestions.length > 1 && (
                          <button
                            type="button"
                            className="m-btn-icon-danger"
                            onClick={() => removeEditQuizQuestion(qIdx)}
                            title="Hapus soal ini"
                          >
                            <IconTrash />
                          </button>
                        )}
                      </div>

                      <input
                        className="m-input-pill"
                        type="text"
                        placeholder="Tulis pertanyaan..."
                        value={q.question}
                        onChange={e => updateEditQuestionText(qIdx, e.target.value)}
                      />

                      <div className="m-input-group" style={{ maxWidth: 160 }}>
                        <label className="m-label">BOBOT NILAI</label>
                        <input
                          className="m-input-pill"
                          type="number"
                          min="1"
                          value={q.weight ?? 1}
                          onChange={e => updateEditQuestionWeight(qIdx, e.target.value)}
                        />
                      </div>

                      <div className="m-quiz-options-list">
                        {q.options.map((opt, oIdx) => (
                          <div className="m-quiz-option-row" key={oIdx}>
                            <button
                              type="button"
                              className={`m-radio-correct ${q.correctIndex === oIdx ? "active" : ""}`}
                              onClick={() => setEditCorrectOption(qIdx, oIdx)}
                              title="Tandai sebagai jawaban benar"
                            >
                              {q.correctIndex === oIdx && <IconCheck />}
                            </button>
                            <input
                              className="m-input-option"
                              type="text"
                              placeholder={`Opsi ${String.fromCharCode(65 + oIdx)}`}
                              value={opt}
                              onChange={e => updateEditOptionText(qIdx, oIdx, e.target.value)}
                            />
                            {q.options.length > 2 && (
                              <button
                                type="button"
                                className="m-btn-icon-danger"
                                onClick={() => removeEditOption(qIdx, oIdx)}
                                title="Hapus opsi ini"
                              >
                                <IconTrash />
                              </button>
                            )}
                          </div>
                        ))}

                        <button type="button" className="m-btn-add-option" onClick={() => addEditOption(qIdx)}>
                          <IconPlus /> Tambah Opsi
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="button" className="m-btn-primary-emerald" onClick={saveModuleEdit} disabled={isUploading}>
                  {isUploading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;