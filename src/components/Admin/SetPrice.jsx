import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SetPrice.css";

function SetPrice() {
  const [providers, setProviders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [prices, setPrices] = useState({
    cleaning: "",
    plumbing: "",
    painting: "",
    electrical: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    if (selected) {
      const provider = providers.find((p) => p._id === selected);
      setSelectedProvider(provider);
      if (provider?.providerDetails?.pricing) {
        setPrices({
          cleaning: provider.providerDetails.pricing.cleaning || "",
          plumbing: provider.providerDetails.pricing.plumbing || "",
          painting: provider.providerDetails.pricing.painting || "",
          electrical: provider.providerDetails.pricing.electrical || "",
        });
      } else {
        setPrices({ cleaning: "", plumbing: "", painting: "", electrical: "" });
      }
    } else {
      setSelectedProvider(null);
      setPrices({ cleaning: "", plumbing: "", painting: "", electrical: "" });
    }
  }, [selected, providers]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      setMessage("");
      const res = await axios.get("http://localhost:5000/api/admin/providers");
      setProviders(res.data.filter((p) => p.providerDetails?.status === "approved"));
    } catch (err) {
      console.error("Error loading providers:", err);
      setMessage("Failed to load providers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updatePricing = async (e) => {
    e.preventDefault();
    if (!selected) {
      setMessage("Please select a provider");
      return;
    }

    try {
      setUpdating(true);
      setMessage("");
      await axios.put(`http://localhost:5000/api/admin/approve/${selected}`, prices);
      setMessage("✅ Pricing updated successfully!");
      await loadProviders();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating pricing:", err);
      setMessage(err.response?.data?.message || "Failed to update pricing. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="set-price">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="set-price">
      <div className="price-header">
        <h2>Set Provider Pricing</h2>
        <p className="price-subtitle">Update pricing for approved service providers</p>
      </div>

      {providers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No approved providers found</p>
          <p className="empty-subtitle">Approve providers first to set their pricing</p>
        </div>
      ) : (
        <>
          <div className="provider-select-section">
            <label className="select-label">Select Provider</label>
            <select
              value={selected || ""}
              onChange={(e) => setSelected(e.target.value)}
              className="provider-select"
            >
              <option value="" disabled>
                Choose a provider...
              </option>
              {providers.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} - {p.providerDetails?.serviceType
                    ? p.providerDetails.serviceType.charAt(0).toUpperCase() +
                      p.providerDetails.serviceType.slice(1)
                    : "N/A"}
                </option>
              ))}
            </select>
          </div>

          {selectedProvider && (
            <div className="price-form-container">
              <div className="provider-info-card">
                <h3>Provider Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">👤 Name:</span>
                    <span>{selectedProvider.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📧 Email:</span>
                    <span>{selectedProvider.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📞 Phone:</span>
                    <span>{selectedProvider.phone || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🔧 Service:</span>
                    <span className="service-tag">
                      {selectedProvider.providerDetails?.serviceType
                        ? selectedProvider.providerDetails.serviceType
                            .charAt(0)
                            .toUpperCase() +
                          selectedProvider.providerDetails.serviceType.slice(1)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={updatePricing} className="price-form">
                <h3>Set Service Prices</h3>
                <div className="price-inputs">
                  <div className="price-input-group">
                    <label>🧹 Cleaning Service</label>
                    <div className="input-wrapper">
                      <span className="currency">Rs.</span>
                      <input
                        type="number"
                        placeholder="Enter price"
                        value={prices.cleaning}
                        onChange={(e) =>
                          setPrices({ ...prices, cleaning: e.target.value })
                        }
                        min="0"
                        className="price-input"
                      />
                    </div>
                  </div>

                  <div className="price-input-group">
                    <label>🔧 Plumbing Service</label>
                    <div className="input-wrapper">
                      <span className="currency">Rs.</span>
                      <input
                        type="number"
                        placeholder="Enter price"
                        value={prices.plumbing}
                        onChange={(e) =>
                          setPrices({ ...prices, plumbing: e.target.value })
                        }
                        min="0"
                        className="price-input"
                      />
                    </div>
                  </div>

                  <div className="price-input-group">
                    <label>🖌️ Painting Service</label>
                    <div className="input-wrapper">
                      <span className="currency">Rs.</span>
                      <input
                        type="number"
                        placeholder="Enter price"
                        value={prices.painting}
                        onChange={(e) =>
                          setPrices({ ...prices, painting: e.target.value })
                        }
                        min="0"
                        className="price-input"
                      />
                    </div>
                  </div>

                  <div className="price-input-group">
                    <label>⚡ Electrical Service</label>
                    <div className="input-wrapper">
                      <span className="currency">Rs.</span>
                      <input
                        type="number"
                        placeholder="Enter price"
                        value={prices.electrical}
                        onChange={(e) =>
                          setPrices({ ...prices, electrical: e.target.value })
                        }
                        min="0"
                        className="price-input"
                      />
                    </div>
                  </div>
                </div>

                {message && (
                  <p
                    className={`message ${
                      message.includes("✅") ? "success" : "error"
                    }`}
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={updating}
                  className="update-btn"
                >
                  {updating ? "Updating..." : "💾 Update Pricing"}
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SetPrice;
