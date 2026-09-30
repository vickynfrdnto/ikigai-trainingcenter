// App.jsx — wrap with ThemeProvider so all components can use useTheme()
import React, { useState } from "react";
import { useAuth }     from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import Login          from "./components/Login";
import AdminPanel     from "./components/AdminPanel";
import TrainingModule from "./components/TrainingModule";
import Loader3D       from "./components/Loader3D";

function AppContent() {
  const { user, loading } = useAuth();
  const [booting, setBooting] = useState(true);
  const canManageTraining = user?.isAdmin || ["manageOrganization", "manageUsers", "manageModules", "createAssessments", "reviewAssessments", "viewReports"].some((permission) => user?.permissions?.includes(permission));

  if (booting) {
    return <Loader3D onFinish={() => setBooting(false)} />;
  }

  if (loading) {
    return (
      <div className="login-page fade-in">
        <div className="spinner-container">
          <div className="spinner-glow"></div>
          <div className="spinner-inner"></div>
        </div>
        <p className="loading-text">SYNCING IKIGAI CORE...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div
      className={`app-shell ${canManageTraining ? "admin-bg" : "training-bg"} fade-in`}
      style={{ minHeight: "100vh", minHeight: "-webkit-fill-available" }}
    >
      <main className="main-content-area">
        {canManageTraining ? <AdminPanel /> : <TrainingModule />}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
