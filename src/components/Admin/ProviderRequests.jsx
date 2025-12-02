import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProviderRequests.css";

function ProviderRequests() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/api/admin/providers");
      setProviders(res.data);
    } catch (err) {
      console.error("Error fetching providers:", err);
      setError("Failed to load providers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const approveProvider = async (id) => {
    try {
      setActionLoading(id);
      const prices = {
        cleaning: 0,
        plumbing: 0,
        painting: 0,
        electrical: 0,
      };

      await axios.put(`http://localhost:5000/api/admin/approve/${id}`, prices);
      await fetchProviders();
      alert("Provider approved successfully!");
    } catch (err) {
      console.error("Error approving provider:", err);
      alert(err.response?.data?.message || "Failed to approve provider");
    } finally {
      setActionLoading(null);
    }
  };

  const rejectProvider = async (id) => {
    if (!window.confirm("Are you sure you want to reject this provider?")) {
      return;
    }

    try {
      setActionLoading(id);
      await axios.put(`http://localhost:5000/api/admin/reject/${id}`);
      await fetchProviders();
      alert("Provider rejected successfully!");
    } catch (err) {
      console.error("Error rejecting provider:", err);
      alert(err.response?.data?.message || "Failed to reject provider");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingProviders = providers.filter(
    (p) => p.providerDetails && (p.providerDetails.status === "pending" || !p.providerDetails.status)
  );

  if (loading) {
    return (
      <div className="provider-requests">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading providers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="provider-requests">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchProviders} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-requests">
      <div className="provider-header">
        <h2>Provider Requests</h2>
        <p className="provider-count">
          {pendingProviders.length} pending request{pendingProviders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {pendingProviders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <p>No pending provider requests</p>
          <p className="empty-subtitle">All provider applications have been processed</p>
        </div>
      ) : (
        <div className="providers-grid">
          {pendingProviders.map((p) => (
            <div key={p._id} className="provider-card">
              <div className="provider-info">
                <h3>{p.name}</h3>
                <div className="provider-details">
                  <div className="detail-item">
                    <span className="detail-label">📧 Email:</span>
                    <span>{p.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">📞 Phone:</span>
                    <span>{p.phone || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">🔧 Service:</span>
                    <span className="service-badge">
                      {p.providerDetails?.serviceType
                        ? p.providerDetails.serviceType.charAt(0).toUpperCase() +
                          p.providerDetails.serviceType.slice(1)
                        : "N/A"}
                    </span>
                  </div>
                  {p.providerDetails?.experience && (
                    <div className="detail-item">
                      <span className="detail-label">⭐ Experience:</span>
                      <span>{p.providerDetails.experience} years</span>
                    </div>
                  )}
                  {p.providerDetails?.address && (
                    <div className="detail-item">
                      <span className="detail-label">📍 Address/Skills:</span>
                      <span>{p.providerDetails.address}</span>
                    </div>
                  )}
                  {p.providerDetails?.citizenship && (
                    <div className="detail-item">
                      <span className="detail-label">📄 Citizenship:</span>
                      <span className="citizenship-link">{p.providerDetails.citizenship}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="provider-actions">
                <button
                  onClick={() => approveProvider(p._id)}
                  disabled={actionLoading === p._id}
                  className="approve-btn"
                >
                  {actionLoading === p._id ? "Processing..." : "✓ Approve"}
                </button>
                <button
                  onClick={() => rejectProvider(p._id)}
                  disabled={actionLoading === p._id}
                  className="reject-btn"
                >
                  {actionLoading === p._id ? "Processing..." : "✗ Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProviderRequests;
