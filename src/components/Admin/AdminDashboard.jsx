import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProviderRequests from "./ProviderRequests";
import SetPrice from "./SetPrice";
import StaffManagement from "./StaffManagement";
import JobTracking from "./JobTracking";
import "./admin.css";

function AdminDashboard() {
  const [page, setPage] = useState("providers");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-wrapper">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <h1 className="dashboard-title">
              <span className="dashboard-icon">⚙️</span>
              SafaHome Admin Dashboard
            </h1>
            <p className="dashboard-subtitle">Manage your platform efficiently</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${page === "providers" ? "active" : ""}`}
          onClick={() => setPage("providers")}
        >
          <span className="tab-icon">👥</span>
          Provider Requests
        </button>

        <button
          className={`tab-btn ${page === "pricing" ? "active" : ""}`}
          onClick={() => setPage("pricing")}
        >
          <span className="tab-icon">💰</span>
          Set Pricing
        </button>

        <button
          className={`tab-btn ${page === "staff" ? "active" : ""}`}
          onClick={() => setPage("staff")}
        >
          <span className="tab-icon">👨‍💼</span>
          Staff Management
        </button>

        <button
          className={`tab-btn ${page === "jobs" ? "active" : ""}`}
          onClick={() => setPage("jobs")}
        >
          <span className="tab-icon">📋</span>
          Job Tracking
        </button>
      </div>

      {/* Page Content */}
      <div className="admin-section">
        {page === "providers" && <ProviderRequests />}
        {page === "pricing" && <SetPrice />}
        {page === "staff" && <StaffManagement />}
        {page === "jobs" && <JobTracking />}
      </div>
    </div>
  );
}

export default AdminDashboard;
