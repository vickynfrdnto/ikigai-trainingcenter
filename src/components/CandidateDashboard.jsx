// CandidatDashboard.jsx
import { useMemo } from "react";

// Perbaikan CSS kecil untuk bagian yang belum punya style di CSS global.
// Struktur, posisi, dan font tetap memakai class bawaan (tidak diubah).
const DASH_FIX_CSS = `
/* Kartu statistik: 3 kartu membagi lebar penuh (desktop/tablet) */
@media (min-width: 700px) {
  .emerald-dashboard-wrapper .stats-grid-mobile {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Kartu "Seluruh Modul Telah Selesai": satu baris di desktop (ikon | teks | tombol), menumpuk di HP */
.emerald-dashboard-wrapper .completed-hero-card {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  grid-template-areas:
    "icon title btn"
    "icon desc  btn";
  column-gap: 16px;
  row-gap: 2px;
  align-items: center;
  margin: 0 0 18px;
  padding: 18px 22px;
  background: #f0fdfa;
  border: 1px solid rgba(0, 188, 162, 0.4);
  border-radius: 18px;
}
.emerald-dashboard-wrapper .completed-icon-wrap {
  grid-area: icon;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #d1fae5;
  color: #047857;
}
.emerald-dashboard-wrapper .completed-hero-card h2 {
  grid-area: title;
  align-self: end;
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.3;
  color: #0c122d;
}
.emerald-dashboard-wrapper .completed-hero-card p {
  grid-area: desc;
  align-self: start;
  margin: 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: #5e6782;
}
.emerald-dashboard-wrapper .completed-hero-card .btn-emerald-outline-pill { grid-area: btn; }
@media (max-width: 699px) {
  .emerald-dashboard-wrapper .completed-hero-card {
    grid-template-columns: 44px minmax(0, 1fr);
    grid-template-areas:
      "icon title"
      "icon desc"
      "btn  btn";
    row-gap: 4px;
  }
  .emerald-dashboard-wrapper .completed-hero-card .btn-emerald-outline-pill { margin-top: 12px; width: 100%; }
}
.emerald-dashboard-wrapper .btn-emerald-outline-pill {
  min-height: 44px;
  padding: 0 22px;
  border: 1.5px solid #059669;
  border-radius: 999px;
  background: #fff;
  font: inherit;
  font-size: 13.5px;
  font-weight: 800;
  color: #047857;
  cursor: pointer;
}
.emerald-dashboard-wrapper .btn-emerald-outline-pill:hover { background: #ecfdf5; }
.emerald-dashboard-wrapper .btn-emerald-outline-pill:focus-visible { outline: 2px solid #00bca2; outline-offset: 2px; }
`;

// Inline SVG Icons untuk tampilan elegan & cepat tanpa plugin tambahan
const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const BookOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const AwardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const VideoCamIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const CandidateDashboard = ({
  user,
  completedVideos = [],
  passedQuizzes = [],
  playablePlaylist = [],
  onSelectVideo,
  onEnter,
  onReviewQuiz,
  onViewAllHistory, // NEW — buka halaman Transkrip Evaluasi (QuizHistoryPage) via TrainingModule
}) => {
  const totalModules = playablePlaylist.length;
  
  const watchedCount = completedVideos.filter((id) =>
    playablePlaylist.some((v) => v.id === id)
  ).length;

  const passedCount = passedQuizzes.filter((q) =>
    playablePlaylist.some((v) => v.id === q.id)
  ).length;

  const globalProgress =
    totalModules > 0
      ? Math.min(Math.round(((watchedCount + passedCount) / (totalModules * 2)) * 100), 100)
      : 0;

  const nextModule = useMemo(
    () => playablePlaylist.find((v) => !passedQuizzes.some((q) => q.id === v.id)),
    [playablePlaylist, passedQuizzes]
  );

  const nextModuleIndex = useMemo(() => {
    if (!nextModule) return -1;
    return playablePlaylist.findIndex((m) => m.id === nextModule.id);
  }, [playablePlaylist, nextModule]);

  const recentActivity = useMemo(
    () => [...passedQuizzes].reverse().slice(0, 4),
    [passedQuizzes]
  );

  // "Lihat Semua" harus tetap berfungsi meski parent lama belum meneruskan
  // prop onViewAllHistory — fallback ke onEnter (daftar modul) supaya tidak patah.
  const handleViewAllHistory = onViewAllHistory || onEnter;

  const firstName = user?.nama?.split(" ")[0] || "Karyawan";
  const userInitials = user?.nama
    ? user.nama.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "IK";

  return (
    <div className="emerald-dashboard-wrapper">
      <style>{DASH_FIX_CSS}</style>

      {/* 1. Header Banner IKIGAI (Deep Emerald Ambient) */}
      <header className="dash-hero-header">
        <div className="dash-hero-ambient"></div>
        <div className="dash-header-top">
          <div className="user-profile-badge">
            <div className="avatar-emerald">{userInitials}</div>
            <div className="user-details">
              <span className="user-greeting">Selamat Datang,</span>
              <h1 className="user-name">{firstName}</h1>
            </div>
          </div>
          <span className="outlet-pill-badge">{user?.divisi || "IKIGAI Outlet"}</span>
        </div>

        {/* Banner Insight */}
        <div className="dash-status-card">
          <div className="status-info-left">
            <span className="dash-eyebrow">PORTAL TRAINING KARYAWAN</span>
            <p className="status-desc">
              {globalProgress === 100 
                ? "Selamat! Semua modul training telah berhasil Anda selesaikan." 
                : "Tingkatkan keahlian Anda. Lanjutkan modul berikutnya."}
            </p>
          </div>
          <div className="progress-radial-badge">
            <span className="radial-percent">{globalProgress}%</span>
            <span className="radial-label">Selesai</span>
          </div>
        </div>
      </header>

      {/* 2. Sheet Card Area (Cream / Light Off-White Background) */}
      <main className="dash-sheet-content">
        
        {/* Metric Cards Grid (Sangat Detail di Mobile) */}
        <section className="stats-grid-mobile">
          <div className="stat-card">
            <div className="stat-icon-box emerald-bg">
              <BookOpenIcon />
            </div>
            <div className="stat-info">
              <span className="stat-number">{totalModules}</span>
              <span className="stat-label">Total Modul</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box blue-bg">
              <VideoCamIcon />
            </div>
            <div className="stat-info">
              <span className="stat-number">{watchedCount}</span>
              <span className="stat-label">Video Selesai</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box gold-bg">
              <AwardIcon />
            </div>
            <div className="stat-info">
              <span className="stat-number">{passedCount}</span>
              <span className="stat-label">Kuis Lulus</span>
            </div>
          </div>
        </section>

        {/* Global Progress Bar */}
        <section className="dashboard-section-card">
          <div className="section-card-header">
            <div className="title-with-icon">
              <span className="dot-indicator"></span>
              <h3>Progres Training Keseluruhan</h3>
            </div>
            <span className="progress-fraction">{passedCount} dari {totalModules} Modul Lulus</span>
          </div>
          <div className="emerald-track">
            <div className="emerald-fill" style={{ width: `${globalProgress}%` }}></div>
          </div>
        </section>

        {/* Featured Card: Modul Selanjutnya */}
        {nextModule ? (
          <section className="next-module-hero-card">
            <div className="hero-card-tag">
              <PlayIcon />
              <span>MODUL SELANJUTNYA</span>
            </div>
            <h2 className="next-module-title">{nextModule.title}</h2>
            
            <div className="next-module-meta">
              <span className="meta-badge">
                Modul {nextModuleIndex + 1} dari {totalModules}
              </span>
              {nextModule.quiz?.length ? (
                <span className="meta-badge quiz-tag">
                  {nextModule.quiz.length} Soal Evaluasi
                </span>
              ) : null}
            </div>

            <button
              type="button"
              className="btn-emerald-pill-cta"
              onClick={() => {
                onSelectVideo(nextModule);
                onEnter();
              }}
            >
              <span>Mulai Belajar Modul Ini</span>
              <ChevronRightIcon />
            </button>
          </section>
        ) : (
          <section className="completed-hero-card">
            <div className="completed-icon-wrap">
              <CheckCircleIcon />
            </div>
            <h2>Seluruh Modul Telah Selesai</h2>
            <p>Sertifikat kompetensi Anda dapat diklaim melalui menu Sertifikat.</p>
            <button type="button" className="btn-emerald-outline-pill" onClick={onEnter}>
              Ulas Kembali Modul
            </button>
          </section>
        )}

        {/* Quick Action Navigation */}
        <div className="quick-actions-bar">
          <button type="button" className="action-tile" onClick={onEnter}>
            <div className="tile-icon"><BookOpenIcon /></div>
            <span>Daftar Modul</span>
          </button>
          <button type="button" className="action-tile" onClick={onEnter}>
            <div className="tile-icon"><AwardIcon /></div>
            <span>Sertifikat Saya</span>
          </button>
        </div>

        {/* Aktivitas Terakhir */}
        <section className="dashboard-section-card margin-top">
          <div className="section-card-header">
            <h3>Aktivitas & Kuis Terakhir</h3>
            <button type="button" className="text-link-btn" onClick={handleViewAllHistory}>
              Lihat Semua
            </button>
          </div>

          <div className="activity-list">
            {recentActivity.length === 0 ? (
              <div className="empty-activity-state">
                <p className="empty-title">Belum ada riwayat kuis</p>
                <p className="empty-sub">Selesaikan video pertama dan kerjakan kuisnya untuk melihat riwayat di sini.</p>
              </div>
            ) : (
              recentActivity.map((q) => (
                <div className="activity-item-card" key={`${q.id}-${q.date}`}>
                  <div className="activity-left">
                    <div className="status-check-badge">
                      <CheckCircleIcon />
                    </div>
                    <div className="activity-info">
                      <h4 className="activity-title">{q.title}</h4>
                      <span className="activity-date">{q.date}</span>
                    </div>
                  </div>

                  <div className="activity-right">
                    <span className="score-badge">Score {q.score}/100</span>
                    {q.userAnswers && onReviewQuiz && (
                      <button
                        type="button"
                        className="btn-review-sm"
                        onClick={() => onReviewQuiz(q)}
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default CandidateDashboard;