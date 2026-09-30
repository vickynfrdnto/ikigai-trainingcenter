import { useState, useEffect, useMemo } from "react";
import { db } from "../firebase-config";
import { ref, onValue, set, update } from "firebase/database";
import { useAuth } from "../context/AuthContext";
import { playlistData } from "../data"; 
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminPanel = () => {
  // --- CORE STATES ---
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("monitor"); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [exporting, setExporting] = useState(false);

  // --- FORM & FILTER STATES ---
  const [newName, setNewName] = useState("");
  const [newDivisi, setNewDivisi] = useState("");
  const [newRole, setNewRole] = useState(""); 
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [exportUser, setExportUser] = useState("ALL");
  const [exportDate, setExportDate] = useState("");

  // --- DERIVED DATA ---
  const availableRoles = useMemo(() => [
    ...new Set(playlistData.flatMap(item => 
      Array.isArray(item.roleAccess) ? item.roleAccess : [item.roleAccess]
    ))
  ], []);

  // --- REAL-TIME DATA FETCHING ---
  useEffect(() => {
    const usersRef = ref(db, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.keys(data)
          .map(key => ({ 
            id: key, 
            ...data[key],
            status: data[key].status || "Active" // Default status jika belum ada
          }))
          .filter(u => u.role !== "ADMIN"); 
        setUsers(userList);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- UTILITIES ---
  const formatDateToMatch = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${parseInt(day)}/${parseInt(month)}/${year}`;
  };

  // --- TOGGLE ACCESS FEATURE ---
  const handleToggleAccess = async (userId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Disabled" : "Active";
    try {
      await update(ref(db, `users/${userId}`), { status: newStatus });
    } catch (err) {
      console.error("Failed to update access:", err);
      alert("Gagal merubah status akses!");
    }
  };

  // --- EXPORT EXCEL LOGIC ---
  const handleExportExcel = () => {
    if (filteredUsers.length === 0) {
      alert("Tidak ada data untuk diexport!");
      return;
    }

    setExporting(true);

    setTimeout(() => {
      const today = new Date().toLocaleDateString("id-ID");
      const totalUsers = filteredUsers.length;
      const avgProgress = filteredUsers.reduce((acc, u) => acc + (u.progress || 0), 0) / totalUsers;

      // SHEET 1: Master Data
      const exportData = filteredUsers.map(user => ({
        "ID/Kode": user.kode,
        "Nama Lengkap": user.nama,
        "Outlet/Divisi": user.divisi,
        "Role": user.role,
        "Progress (%)": user.progress,
        "Status Akses": user.status,
        "Aktivitas Terakhir": user.lastActive
      }));

      const wsData = XLSX.utils.json_to_sheet(exportData);

      // SHEET 2: Executive Summary
      const summaryData = [
        ["IKIGAI TRAINING CENTER - REPORT"],
        ["Tanggal Cetak:", today],
        ["Total Peserta:", totalUsers],
        ["Rata-rata Progress:", `${avgProgress.toFixed(1)}%`],
        ["Status Sistem:", "Verified"]
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsData, "Database Intern");
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary Report");

      XLSX.writeFile(wb, `IKIGAI_MASTER_REPORT_${new Date().getTime()}.xlsx`);
      setExporting(false);
    }, 800);
  };

  const handleExportPDF = () => {
    if (filteredUsers.length === 0) {
      alert("Tidak ada data untuk diexport!");
      return;
    }

    setExporting(true);

    setTimeout(() => {
      const doc = new jsPDF();
      const today = new Date().toISOString().split("T")[0];

      const totalUsers = filteredUsers.length;
      const avgProgress = (
        filteredUsers.reduce((acc, u) => acc + (u.progress || 0), 0) /
        totalUsers
      ).toFixed(1);

      /* =====================
        WATERMARK
      ======================*/
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(50);
      doc.text("CONFIDENTIAL", 35, 150, { angle: 45 });

      doc.setTextColor(0, 0, 0);

      /* =====================
        KOP SURAT
      ======================*/
      doc.setFontSize(16);
      doc.text("IKIGAI TRAINING CENTER", 14, 20);
      doc.setFontSize(10);
      doc.text("Corporate Training & Development Platform", 14, 26);
      doc.line(14, 30, 196, 30);

      /* =====================
        SUMMARY
      ======================*/
      doc.setFontSize(11);
      doc.text(`Report Date : ${today}`, 14, 40);
      doc.text(`Total Users : ${totalUsers}`, 14, 46);
      doc.text(`Avg Progress: ${avgProgress}%`, 14, 52);

      /* =====================
        TABLE
      ======================*/
      const tableColumn = [
        "Nama",
        "Divisi",
        "Role",
        "Progress"
      ];

      const tableRows = filteredUsers.map(user => [
        user.nama,
        user.divisi,
        user.role,
        `${user.progress}%`
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [0, 150, 136] }
      });

      /* =====================
        SIMPLE BAR CHART
      ======================*/
      const finalY = doc.lastAutoTable?.finalY || 70;
      let chartStartY = finalY + 15;

      doc.text("Progress Overview", 14, chartStartY);

      chartStartY += 10;

      filteredUsers.forEach((user, index) => {
        const barWidth = (user.progress / 100) * 150;

        doc.rect(14, chartStartY + index * 8, barWidth, 5, "F");
        doc.text(user.nama, 170, chartStartY + index * 8 + 4);
      });

      doc.save(`IKIGAI_User_Report_${today}.pdf`);

      setExporting(false);
    }, 800);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newName || !newDivisi || !newRole) {
      alert("Lengkapi data dulu, Bestie! ✨");
      return;
    }
    
    const createdAt = new Date().toLocaleString("id-ID");
    const generatedCode = "IKG-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    
    try {
      // Gunakan async/await agar data tidak hilang saat proses reset state
      await set(ref(db, `users/${generatedCode}`), {
        nama: newName,
        divisi: newDivisi,
        role: newRole,
        kode: generatedCode,
        progress: 0,
        completedVideos: [],
        passedQuizzes: [], 
        lastActive: "Belum login",
        createdAt: createdAt,
        status: "Active"
      });

      alert(`🔥 USER CREATED!\nNama: ${newName}\nKode: ${generatedCode}`);
      
      // Reset form SETELAH sukses
      setNewName("");
      setNewDivisi("");
      setNewRole("");
    } catch (err) {
      console.error(err);
      alert("Waduh, gagal save ke database!");
    }
  };

  const getFilteredExportData = () => {
    const formattedDate = formatDateToMatch(exportDate);

    return users.filter(u => {
      const matchUser = exportUser === "ALL" || u.kode === exportUser;

      const matchDate = !exportDate || (
        u.passedQuizzes?.some(q =>
          q.date === formattedDate
        )
      );

      return matchUser && matchDate;
    });
  };

  const calculateModuleStats = (usersData) => {
    const moduleStats = {};

    usersData.forEach(user => {
      (user.passedQuizzes || []).forEach(q => {
        if (!moduleStats[q.title]) {
          moduleStats[q.title] = {
            totalScore: 0,
            count: 0
          };
        }

        moduleStats[q.title].totalScore += q.score;
        moduleStats[q.title].count += 1;
      });
    });

    return Object.keys(moduleStats).map(module => {
      const total = moduleStats[module].totalScore;
      const count = moduleStats[module].count;
      const avg = count ? total / count : 0;

      return {
        module,
        total,
        avg: avg.toFixed(1),
        percentage: (avg).toFixed(1) + "%"
      };
    });
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.nama?.toLowerCase().includes(search.toLowerCase()) || u.kode?.includes(search.toUpperCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesDate = !dateFilter || (u.createdAt && u.createdAt.includes(dateFilter.split('-').reverse().join('/')));
    return matchesSearch && matchesRole && matchesDate;
  });

  const handleExportQuizDetailExcel = () => {
    const today = new Date().toISOString().split("T")[0];
    const exportUsers = getFilteredExportData();

    const rows = [];

    exportUsers.forEach(user => {
      (user.passedQuizzes || []).forEach(q => {
        const module = playlistData.find(p => p.title === q.title);
        const questions = module?.quiz || [];

        questions.forEach((question, i) => {
          rows.push({
            Nama: user.nama,
            Module: q.title,
            Soal: question.q,
            "Jawaban Benar": question.a,
            Score: q.score,
            Tanggal: q.date
          });
        });
      });
    });

    /* =========================
      SHEET 1 - DETAIL
    ==========================*/
    const wsDetail = XLSX.utils.json_to_sheet(rows);

    /* =========================
      SHEET 2 - SUMMARY MODULE
    ==========================*/
    const stats = calculateModuleStats(exportUsers);

    const summarySheet = [
      ["MODULE SUMMARY"],
      ["Module", "Total Score", "Average", "Percentage"],
      ...stats.map(s => [s.module, s.total, s.avg, s.percentage])
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summarySheet);

    /* =========================
      SHEET 3 - GLOBAL SUMMARY
    ==========================*/
    const totalUsers = exportUsers.length;
    const avgProgress = (
      exportUsers.reduce((acc, u) => acc + (u.progress || 0), 0) / totalUsers || 0
    ).toFixed(1);

    const globalSummary = [
      ["IKIGAI TRAINING REPORT"],
      [""],
      ["Total Users", totalUsers],
      ["Average Progress", avgProgress + "%"],
      ["Export Date", today]
    ];

    const wsGlobal = XLSX.utils.aoa_to_sheet(globalSummary);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, wsDetail, "Detail Quiz");
    XLSX.utils.book_append_sheet(wb, wsSummary, "Module Summary");
    XLSX.utils.book_append_sheet(wb, wsGlobal, "Global Summary");

    XLSX.writeFile(wb, `QUIZ_REPORT_${today}.xlsx`);
  };

  const handleExportQuizDetailPDF = () => {
    const doc = new jsPDF();
    const today = new Date().toISOString().split("T")[0];
    const exportUsers = getFilteredExportData();

    let y = 20;

    /* HEADER */
    doc.setFontSize(18);
    doc.text("IKIGAI TRAINING REPORT", 105, y, { align: "center" });

    y += 8;

    doc.setFontSize(10);
    doc.text(`Generated: ${today}`, 105, y, { align: "center" });

    y += 10;

    /* SUMMARY MODULE */
    const stats = calculateModuleStats(exportUsers);

    doc.setFontSize(12);
    doc.text("Module Performance Summary", 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [["Module", "Total Score", "Average", "%"]],
      body: stats.map(s => [s.module, s.total, s.avg, s.percentage]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 150, 136] }
    });

    y = doc.lastAutoTable.finalY + 10;

    /* DETAIL PER USER */
    exportUsers.forEach(user => {
      doc.setFontSize(11);
      doc.text(`User: ${user.nama} (${user.role})`, 14, y);
      y += 5;

      (user.passedQuizzes || []).forEach(q => {
        doc.setFontSize(10);
        doc.text(`Module: ${q.title} | Score: ${q.score}`, 14, y);
        y += 4;

        const module = playlistData.find(p => p.title === q.title);
        const questions = module?.quiz || [];

        autoTable(doc, {
          startY: y,
          head: [["No", "Question", "Correct Answer"]],
          body: questions.map((ques, i) => [
            i + 1,
            ques.q,
            ques.a
          ]),
          styles: { fontSize: 7 }
        });

        y = doc.lastAutoTable.finalY + 8;
      });

      y += 5;

      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`QUIZ_REPORT_${today}.pdf`);
  };

  return (
     <div className="admin-container fade-in">
      <div className="bg-blur-dot dot-1"></div>
      <div className="bg-blur-dot dot-2"></div>

      {/* HEADER: Diubah menjadi flex-wrap untuk mobile */}
      <header className="admin-header-flex mobile-stack">
        <div className="header-left">
          <div className="admin-badge">CMD / ROOT</div>
          <h1 className="brand-title">IKIGAI <span>CORE</span></h1>
        </div>
        
        <nav className="admin-nav-center mobile-scroll">
          <button className={view === 'monitor' ? 'nav-active' : ''} onClick={() => setView('monitor')}>
            <span className="nav-icon">📊</span> Monitoring
          </button>
          <button className={view === 'quiz-details' ? 'nav-active' : ''} onClick={() => setView('quiz-details')}>
            <span className="nav-icon">📜</span> Analytics
          </button>
        </nav>

        <button onClick={logout} className="btn-logout-premium mobile-hide-text">
          <span className="btn-text">LOG OUT</span>
          <span className="btn-icon">⚡</span>
        </button>
      </header>

      {view === "monitor" ? (
        <main className="admin-main-content">
          {/* STATS ROW: Sekarang stack secara vertical di mobile */}
          <div className="top-stats-row mobile-grid">
            <div className="stat-box-modern">
              <p>ACTIVE INTERNS</p>
              <h2>{users.length} <span>Users</span></h2>
            </div>
            <div className="stat-box-modern">
              <p>QUICK EXPORT</p>
              <div className="btn-group-export">
                <button onClick={handleExportExcel} className="btn-mini-glass">EXCEL</button>
                <button onClick={handleExportPDF} className="btn-mini-glass">PDF</button>
              </div>
            </div>
          </div>

          <div className="admin-grid-layout">
            {/* FORM CREATE */}
            <aside className="glass-card registration-panel">
              <div className="card-header">
                <h3>REGISTER NEW USER</h3>
                <p>Assign access codes to new members</p>
              </div>
              <form onSubmit={handleCreateUser} className="modern-form">
                <div className="input-field-neon">
                  <label>FULL NAME</label>
                  <input type="text" placeholder="John Doe" value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div className="input-field-neon">
                  <label>OUTLET</label>
                  <input type="text" placeholder="e.g. Bintaro" value={newDivisi} onChange={(e) => setNewDivisi(e.target.value)} />
                </div>
                <div className="input-field-neon">
                  <label>ACCESS ROLE</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="modern-select">
                    <option value="">-- SELECT ROLE --</option>
                    {availableRoles.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn-execute-neon">GENERATE ACCESS</button>
              </form>
            </aside>

            {/* TABLE MONITORING */}
            <section className="glass-card table-panel">
              <div className="table-controls mobile-stack">
                <div className="search-neon">
                  <span className="search-icon">🔍</span>
                  <input type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="filter-group">
                  <select onChange={(e) => setRoleFilter(e.target.value)} className="mini-select">
                    <option value="ALL">ALL ROLES</option>
                    {availableRoles.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
              </div>

              {/* TABLE CONTAINER: Menambahkan class untuk mobile view */}
              <div className="custom-scroll responsive-table-wrapper">
                <table className="neon-table">
                  <thead className="mobile-hidden">
                    <tr>
                      <th>INTERN</th>
                      <th>CODE</th>
                      <th>PROGRESS</th>
                      <th className="tablet-hidden">LAST ACTIVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="row-interactive mobile-card-row">
                        <td data-label="INTERN">
                          <div className="user-profile-cell">
                            <div className="avatar-mini">{user.nama[0]}</div>
                            <div>
                              <p className="u-name">{user.nama}</p>
                              <p className="u-role">{user.role}</p>
                            </div>
                          </div>
                        </td>
                        <td data-label="CODE"><code className="code-tag">{user.kode}</code></td>
                        <td data-label="PROGRESS">
                          <div className="progress-neon-container">
                            <div className="progress-neon-bar" style={{width: `${user.progress}%`}}></div>
                            <span className="progress-text">{user.progress}%</span>
                          </div>
                        </td>
                        <td data-label="ACTIVE" className="time-cell tablet-hidden">{user.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      ) : (
        
      <section className="glass-card full-view fade-in">
        <div className="analytics-header">
          <div className="header-text">
            <h3>QUIZ PERFORMANCE LOGS</h3>
            <p>Detailed breakdown of questions and answers by user</p>
          </div>

          {/* Wrapper Baru untuk merapikan baris filter dan tombol */}
          <div className="analytics-controls-row">
            <div className="filter-inputs">
              <select 
                value={exportUser} 
                onChange={(e) => setExportUser(e.target.value)}
                className="mini-select"
              >
                <option value="ALL">ALL USERS</option>
                {users.map(u => (
                  <option key={u.kode} value={u.kode}>
                    {u.nama}
                  </option>
                ))}
              </select>

              <input 
                type="date" 
                value={exportDate}
                onChange={(e) => setExportDate(e.target.value)}
                className="mini-date"
              />
            </div>

            <div className="action-buttons">
              <button onClick={handleExportQuizDetailExcel} className="btn-mini-glass excel">
                <span className="icon">📊</span> EXCEL
              </button>
              <button onClick={handleExportQuizDetailPDF} className="btn-mini-glass pdf">
                <span className="icon">📕</span> PDF
              </button>
            </div>
          </div>
        </div>
          
          <div className="analytics-table-wrapper custom-scroll">
            <table className="neon-table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>MODULE</th>
                  <th>SCORE</th>
                  <th>TIMESTAMP</th>
                  <th>REVIEW</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  user.passedQuizzes?.map((quiz, idx) => (
                    <tr key={`${user.id}-${idx}`}>
                      <td><strong>{user.nama}</strong></td>
                      <td>{quiz.title}</td>
                      <td>
                        <div className={`score-badge ${quiz.score >= 80 ? 'high' : quiz.score >= 60 ? 'mid' : 'low'}`}>
                          {quiz.score} / 100
                        </div>
                      </td>
                      <td>{quiz.date}</td>
                      <td>
                        <button className="btn-inspect" onClick={() => setSelectedUser({user, quiz})}>
                          INSPECT
                        </button>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* MODAL DETAIL QUIZ (POPUPS) */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-glass-content mobile-full">
          <div className="modal-glass-content" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <h4>REVIEW: {selectedUser.quiz.title}</h4>
              <button className="close-x" onClick={() => setSelectedUser(null)}>×</button>
            </header>
            <div className="modal-body">
              <p className="inspected-user">Inspecting: <span>{selectedUser.user.nama}</span></p>
              <div className="question-logs">
                <div className="quiz-review-container">
              {(() => {
                const quizData = selectedUser.quiz;

                // 🔥 ambil module dari playlist
                const module = playlistData.find(p => p.title === quizData.title);

                // 🔥 struktur asli dari Quiz.jsx
                const questions = module?.quiz || [];

                // 🔥 kalau suatu saat ada userAnswers, tetap support
                const userAnswers = quizData.userAnswers || [];

                if (questions.length === 0) {
                  return <p style={{ opacity: 0.6 }}>No quiz data available</p>;
                }

                return questions.map((q, i) => {
                  const userAnswer = userAnswers[i];
                  const isCorrect = userAnswer === q.a;

                  return (
                    <div
                      key={i}
                      className={`log-item ${
                        userAnswer
                          ? isCorrect
                            ? "correct"
                            : "wrong"
                          : ""
                      }`}
                    >
                      {/* ✅ SOAL */}
                      <p className="q-text">
                        {i + 1}. {q.q}
                      </p>

                      {/* ✅ OPTIONS */}
                      <div className="option-list">
                        {q.options.map((opt, idx) => (
                          <p
                            key={idx}
                            className={`option-item 
                              ${opt === q.a ? "correct-answer" : ""}
                              ${opt === userAnswer && opt !== q.a ? "wrong-answer" : ""}
                            `}
                          >
                            {String.fromCharCode(65 + idx)}. {opt}
                          </p>
                        ))}
                      </div>

                      {/* ✅ USER ANSWER */}
                      <p className="a-text">
                      {userAnswer
                        ? `${isCorrect ? "✅" : "❌"} User Answer: ${userAnswer}`
                        : "ℹ️ Answer data not recorded"}
                      </p>

                      {/* ✅ CORRECT ANSWER */}
                      {userAnswer && !isCorrect && (
                        <p className="correct-hint">
                          Correct Answer: {q.a}
                        </p>
                      )}
                    </div>
                  );
                });
              })()}
              </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
