import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../Auth/Assets/clean.jpeg";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="landing-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay">
        <header className="navbar">
          <h1 className="logo">
            <span className="logo-icon">🏠</span>
            SafaHome
          </h1>
          <nav>
            <button onClick={() => navigate("/login")} className="nav-btn">
              Login
            </button>
            <button onClick={() => navigate("/signup")} className="nav-btn filled">
              Sign Up
            </button>
          </nav>
        </header>

        <main className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Trusted Home Services, Just a Click Away</h1>
            <p className="hero-subtitle">
              Book skilled professionals for cleaning, plumbing, electrical
              repair, and more — anytime, anywhere.
            </p>
            <div className="hero-buttons">
              <button
                onClick={() => navigate("/signup")}
                className="cta-button primary"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="cta-button secondary"
              >
                Sign In
              </button>
            </div>
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Verified Professionals</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>24/7 Availability</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Affordable Pricing</span>
              </div>
            </div>
          </div>
        </main>

        <section className="services">
          <div className="services-header">
            <h3>Our Popular Services</h3>
            <p className="services-subtitle">Choose from a wide range of professional home services</p>
          </div>
          <div className="service-grid">
            <div className="service-card">
              <div className="service-icon">🧹</div>
              <h4>Home Cleaning</h4>
              <p>Professional deep cleaning for your entire home. Sparkling clean results guaranteed.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🔧</div>
              <h4>Plumbing</h4>
              <p>Expert plumbers for any kind of household fix. Quick and reliable service.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">💡</div>
              <h4>Electrical</h4>
              <p>Certified electricians for repairs and installations. Safety first approach.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🖌️</div>
              <h4>Painting</h4>
              <p>Custom wall painting indoor or outdoor. Quality finishes that last.</p>
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

export default LandingPage;
