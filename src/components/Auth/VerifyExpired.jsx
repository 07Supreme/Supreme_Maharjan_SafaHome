import React, { useState } from "react";
import { resendVerification, verifyCode } from "../../services/api";
import backgroundImage from "./Assets/clean.jpeg";
import Loader from "./Loader";

function VerifyExpired() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [info, setInfo] = useState("");

  const handleResend = async () => {
    if (!email) return setInfo("Enter your email");
    setLoading(true);
    setInfo("");
    try {
      await resendVerification({ email });
      setInfo("Verification code resent. Check your inbox.");
    } catch (err) {
      console.error(err);
      setInfo(err.response?.data?.message || "Failed to resend.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!email) return setInfo("Enter your email");
    if (!verificationCode || verificationCode.length !== 6) {
      setInfo("Please enter a valid 6-digit code");
      return;
    }
    setVerifying(true);
    setInfo("");
    try {
      await verifyCode({ email, code: verificationCode });
      setInfo("✅ Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      console.error(err);
      setInfo(err.response?.data?.message || "Invalid or expired code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={pageStyle(backgroundImage)}>
      <div style={cardStyle}>
        <h2 style={{ color: "#556B2F" }}>Code Expired</h2>
        <p style={{ color: "#556B2F" }}>Your verification code has expired or is invalid.</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setInfo("");
          }}
          style={inputStyle}
        />

        {email && (
          <form onSubmit={handleVerifyCode}>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setVerificationCode(value);
                setInfo("");
              }}
              style={{
                ...inputStyle,
                textAlign: "center",
                fontSize: 24,
                letterSpacing: 8,
                fontWeight: "bold",
              }}
              maxLength={6}
              required
            />

            <button type="submit" style={buttonStyle} disabled={verifying || verificationCode.length !== 6}>
              {verifying ? <Loader size={18} /> : "Verify Code"}
            </button>
          </form>
        )}

        <button 
          onClick={handleResend} 
          style={{
            ...buttonStyle,
            backgroundColor: "transparent",
            color: "#556B2F",
            border: "1px solid #556B2F",
            marginTop: email ? 10 : 0,
          }} 
          disabled={loading || !email}
        >
          {loading ? <Loader size={18} /> : "Resend Code"}
        </button>

        <p style={{ 
          color: info.includes("✅") ? "#8FA31E" : info ? "#d32f2f" : "transparent", 
          marginTop: 10,
          minHeight: 24,
          fontSize: 14,
        }}>
          {info}
        </p>
      </div>
    </div>
  );
}

/* reuse similar styles as signup */
const pageStyle = (bg) => ({
  backgroundImage: `url(${bg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const cardStyle = {
  background: "rgba(242,247,203,0.95)",
  padding: "36px",
  borderRadius: "12px",
  width: 480,
  textAlign: "center",
  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  border: "1px solid #C6D870",
  borderRadius: "8px",
};

const buttonStyle = {
  backgroundColor: "#556B2F",
  color: "#fff",
  padding: "12px",
  width: "100%",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  marginTop: 8,
};

export default VerifyExpired;
