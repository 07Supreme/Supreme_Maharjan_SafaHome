import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StaffManagement.css";

function StaffManagement() {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceFilter, setServiceFilter] = useState("all");

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [serviceFilter, providers]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/api/admin/service-providers");
      setProviders(res.data);
    } catch (err) {
      console.error("Error fetching providers:", err);
      setError("Failed to load service providers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterProviders = () => {
    if (serviceFilter === "all") {
      setFilteredProviders(providers);
    } else {
      setFilteredProviders(
        providers.filter(
          (p) => p.providerDetails?.serviceType === serviceFilter
        )
      );
    }
  };

  const getServiceType = (providerDetails) => {
    if (!providerDetails?.serviceType) return null;
    return providerDetails.serviceType.charAt(0).toUpperCase() + 
           providerDetails.serviceType.slice(1);
  };

  if (loading) {
    return (
      <div className="staff-management">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading service providers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-management">
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
    <div className="staff-management">
      <div className="staff-header">
        <h2>Service Provider Management</h2>
        <p className="staff-subtitle">
          View and manage all service providers
        </p>
        <div className="header-controls">
          <div className="staff-count">
            {filteredProviders.length} provider{filteredProviders.length !== 1 ? "s" : ""}
            {serviceFilter !== "all" && ` (${serviceFilter})`}
          </div>
          <div className="filter-section">
            <label className="filter-label">Filter by Service:</label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="service-filter"
            >
              <option value="all">All Services</option>
              <option value="cleaning">🧹 Cleaning</option>
              <option value="plumbing">🔧 Plumbing</option>
              <option value="painting">🖌️ Painting</option>
              <option value="electrical">⚡ Electrical</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProviders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👷</div>
          <p>
            {serviceFilter === "all"
              ? "No service providers found"
              : `No ${serviceFilter} providers found`}
          </p>
          <p className="empty-subtitle">
            {serviceFilter === "all"
              ? "Service providers will appear here once they register"
              : "Try selecting a different service type"}
          </p>
        </div>
      ) : (
        <div className="staff-grid">
          {filteredProviders.map((provider) => {
            const serviceType = getServiceType(provider.providerDetails);
            
            return (
              <div key={provider._id} className="staff-card provider-card">
                <div className="staff-card-header">
                  <div className="staff-avatar provider-avatar">
                    {serviceType === "Cleaning" && "🧹"}
                    {serviceType === "Plumbing" && "🔧"}
                    {serviceType === "Painting" && "🖌️"}
                    {serviceType === "Electrical" && "⚡"}
                    {!serviceType && "👷"}
                  </div>
                  <div className="staff-name-section">
                    <h3>{provider.name}</h3>
                    <span className="role-badge provider-badge">
                      Service Provider
                    </span>
                  </div>
                </div>

                <div className="staff-details">
                  <div className="detail-row">
                    <span className="detail-icon">📧</span>
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{provider.email}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">📞</span>
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{provider.phone || "N/A"}</span>
                  </div>

                  {serviceType && (
                    <div className="detail-row">
                      <span className="detail-icon">🔧</span>
                      <span className="detail-label">Service:</span>
                      <span className="service-badge">{serviceType}</span>
                    </div>
                  )}

                  {provider.providerDetails?.experience && (
                    <div className="detail-row">
                      <span className="detail-icon">⭐</span>
                      <span className="detail-label">Experience:</span>
                      <span className="detail-value">
                        {provider.providerDetails.experience} years
                      </span>
                    </div>
                  )}

                  {provider.providerDetails?.address && (
                    <div className="detail-row">
                      <span className="detail-icon">📍</span>
                      <span className="detail-label">Address/Skills:</span>
                      <span className="detail-value">{provider.providerDetails.address}</span>
                    </div>
                  )}

                  {provider.providerDetails?.status && (
                    <div className="detail-row">
                      <span className="detail-icon">📋</span>
                      <span className="detail-label">Status:</span>
                      <span
                        className={`status-badge ${
                          provider.providerDetails.status === "approved"
                            ? "approved"
                            : provider.providerDetails.status === "pending"
                            ? "pending"
                            : "rejected"
                        }`}
                      >
                        {provider.providerDetails.status.charAt(0).toUpperCase() +
                          provider.providerDetails.status.slice(1)}
                      </span>
                    </div>
                  )}

                  {provider.providerDetails?.pricing && (
                    <div className="detail-row pricing-row">
                      <span className="detail-icon">💰</span>
                      <span className="detail-label">Pricing:</span>
                      <div className="pricing-details">
                        {provider.providerDetails.pricing.cleaning > 0 && (
                          <span className="price-item">
                            Cleaning: Rs. {provider.providerDetails.pricing.cleaning}
                          </span>
                        )}
                        {provider.providerDetails.pricing.plumbing > 0 && (
                          <span className="price-item">
                            Plumbing: Rs. {provider.providerDetails.pricing.plumbing}
                          </span>
                        )}
                        {provider.providerDetails.pricing.painting > 0 && (
                          <span className="price-item">
                            Painting: Rs. {provider.providerDetails.pricing.painting}
                          </span>
                        )}
                        {provider.providerDetails.pricing.electrical > 0 && (
                          <span className="price-item">
                            Electrical: Rs. {provider.providerDetails.pricing.electrical}
                          </span>
                        )}
                        {provider.providerDetails.pricing.cleaning === 0 &&
                          provider.providerDetails.pricing.plumbing === 0 &&
                          provider.providerDetails.pricing.painting === 0 &&
                          provider.providerDetails.pricing.electrical === 0 && (
                            <span className="price-item">Not set</span>
                          )}
                      </div>
                    </div>
                  )}

                  <div className="detail-row">
                    <span className="detail-icon">✓</span>
                    <span className="detail-label">Verified:</span>
                    <span
                      className={`status-badge ${
                        provider.verified ? "verified" : "unverified"
                      }`}
                    >
                      {provider.verified ? "Yes" : "No"}
                    </span>
                  </div>

                  {provider.createdAt && (
                    <div className="detail-row">
                      <span className="detail-icon">📅</span>
                      <span className="detail-label">Joined:</span>
                      <span className="detail-value">
                        {new Date(provider.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StaffManagement;
