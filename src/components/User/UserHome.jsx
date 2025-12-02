import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../Auth/Assets/clean.jpeg";
import "./UserHome.css";

function UserHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [providers, setProviders] = useState([]);
  const [selectedService, setSelectedService] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserData();
    fetchProviders();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      // Get user data from localStorage (set during login)
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser({ name: "User", email: "user@example.com" });
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/service-providers");
      // Filter only approved providers
      const approvedProviders = res.data.filter(
        (p) => p.providerDetails?.status === "approved"
      );
      setProviders(approvedProviders);
    } catch (err) {
      console.error("Error fetching providers:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredProviders = selectedService === "all"
    ? providers
    : providers.filter((p) => p.providerDetails?.serviceType === selectedService);

  if (loading) {
    return (
      <div className="user-home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="overlay">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="user-home-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay">
        <header className="navbar">
          <h1 className="logo">
            <span className="logo-icon">🏠</span>
            SafaHome
          </h1>
          <nav>
            <span className="user-greeting">Welcome, {user?.name || "User"}!</span>
            <button onClick={handleLogout} className="nav-btn logout-btn">
              Logout
            </button>
          </nav>
        </header>

        <main className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Welcome Back to SafaHome</h1>
            <p className="hero-subtitle">
              Book skilled professionals for your home services. Choose from verified providers below.
            </p>
          </div>
        </main>

        <section className="services-section">
          <div className="services-header">
            <h3>Available Services</h3>
            <p className="services-subtitle">Select a service to view available providers</p>
          </div>

          <div className="service-filter-tabs">
            <button
              className={`filter-tab ${selectedService === "all" ? "active" : ""}`}
              onClick={() => setSelectedService("all")}
            >
              All Services
            </button>
            <button
              className={`filter-tab ${selectedService === "cleaning" ? "active" : ""}`}
              onClick={() => setSelectedService("cleaning")}
            >
              🧹 Cleaning
            </button>
            <button
              className={`filter-tab ${selectedService === "plumbing" ? "active" : ""}`}
              onClick={() => setSelectedService("plumbing")}
            >
              🔧 Plumbing
            </button>
            <button
              className={`filter-tab ${selectedService === "painting" ? "active" : ""}`}
              onClick={() => setSelectedService("painting")}
            >
              🖌️ Painting
            </button>
            <button
              className={`filter-tab ${selectedService === "electrical" ? "active" : ""}`}
              onClick={() => setSelectedService("electrical")}
            >
              ⚡ Electrical
            </button>
          </div>

          {filteredProviders.length === 0 ? (
            <div className="no-providers">
              <div className="empty-icon">👷</div>
              <p>No providers available for this service</p>
              <p className="empty-subtitle">Check back later or try a different service</p>
            </div>
          ) : (
            <div className="providers-grid">
              {filteredProviders.map((provider) => {
                const serviceType = provider.providerDetails?.serviceType
                  ? provider.providerDetails.serviceType.charAt(0).toUpperCase() +
                    provider.providerDetails.serviceType.slice(1)
                  : "N/A";

                const pricing = provider.providerDetails?.pricing || {};
                const servicePrice =
                  pricing[provider.providerDetails?.serviceType] || 0;

                return (
                  <div key={provider._id} className="provider-card">
                    <div className="provider-card-header">
                      <div className="provider-avatar">
                        {serviceType === "Cleaning" && "🧹"}
                        {serviceType === "Plumbing" && "🔧"}
                        {serviceType === "Painting" && "🖌️"}
                        {serviceType === "Electrical" && "⚡"}
                      </div>
                      <div className="provider-info">
                        <h4>{provider.name}</h4>
                        <span className="service-badge">{serviceType}</span>
                      </div>
                    </div>

                    <div className="provider-details">
                      <div className="detail-item">
                        <span className="detail-icon">📧</span>
                        <span>{provider.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📞</span>
                        <span>{provider.phone || "N/A"}</span>
                      </div>
                      {provider.providerDetails?.experience && (
                        <div className="detail-item">
                          <span className="detail-icon">⭐</span>
                          <span>{provider.providerDetails.experience} years experience</span>
                        </div>
                      )}
                      {servicePrice > 0 && (
                        <div className="price-display">
                          <span className="price-label">Starting from:</span>
                          <span className="price-value">Rs. {servicePrice}</span>
                        </div>
                      )}
                    </div>

                    <button className="book-btn">
                      Book Now
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="info-section">
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">✓</div>
              <h4>Verified Professionals</h4>
              <p>All providers are verified and background checked</p>
            </div>
            <div className="info-card">
              <div className="info-icon">⏱️</div>
              <h4>Quick Booking</h4>
              <p>Book services instantly with just a few clicks</p>
            </div>
            <div className="info-card">
              <div className="info-icon">💰</div>
              <h4>Transparent Pricing</h4>
              <p>See prices upfront with no hidden charges</p>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <p>© 2025 SafaHome | Bringing cleanliness and comfort to every home</p>
            <div className="footer-links">
              <a href="#about">About</a>
              <a href="#services">Services</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default UserHome;

