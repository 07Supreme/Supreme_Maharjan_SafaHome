import React, { useState } from "react";
import { verifyCode, resendVerification } from "../../services/api";
import backgroundImage from "./Assets/clean.jpeg";
import Loader from "./Loader";

function VerifyToken() {
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email") || "";
  
  const [verificationCode, setVerificationCode] = useState("");
  const [emailInput, setEmailInput] = useState(email);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!emailInput) {
      setMessage("Please enter your email");
      return;
    }
    if (!verificationCode || verificationCode.length !== 6) {
      setMessage("Please enter a valid 6-digit code");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await verifyCode({ email: emailInput, code: verificationCode });
      setMessage("✅ Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!emailInput) {
      setMessage("Please enter your email");
      return;
    }
    setResendLoading(true);
    setMessage("");
    try {
      await resendVerification({ email: emailInput });
      setMessage("Verification code resent! Check your inbox.");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to resend. Try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={pageStyle(backgroundImage)}>
      <div style={smallCard}>
        <h3 style={{ color: "#556B2F", marginBottom: 12 }}>Email Verification</h3>
        
        {!email && (
          <input
            type="email"
            placeholder="Enter your email"
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
              setMessage("");
            }}
            style={inputStyle}
          />
        )}

        {email && (
          <p style={{ color: "#556B2F", marginBottom: 12 }}>
            Verification code sent to: <b>{email}</b>
          </p>
        )}

        <form onSubmit={handleVerifyCode}>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setVerificationCode(value);
              setMessage("");
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

          <p style={{ 
            color: message.includes("✅") ? "#8FA31E" : message ? "#d32f2f" : "transparent", 
            minHeight: 24, 
            fontSize: 14, 
            marginTop: 8 
          }}>
            {message}
          </p>

          <button
            type="submit"
            disabled={loading || verificationCode.length !== 6 || !emailInput}
            style={{ ...buttonStyle, width: "100%", marginTop: 10 }}
          >
            {loading ? <Loader size={18} /> : "Verify Code"}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={resendLoading || !emailInput}
          style={{
            ...buttonStyle,
            width: "100%",
            backgroundColor: "transparent",
            color: "#556B2F",
            border: "1px solid #556B2F",
            marginTop: 10,
          }}
        >
          {resendLoading ? <Loader size={18} /> : "Resend Code"}
        </button>
      </div>
    </div>
  );
}

const pageStyle = (bg) => ({
  backgroundImage: `url(${bg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const smallCard = {
  background: "rgba(242,247,203,0.95)",
  padding: 28,
  borderRadius: 12,
  width: 420,
  textAlign: "center",
  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
};

const inputStyle = {
  width: "100%",
  padding: "14px 12px",
  margin: "10px 0",
  border: "1px solid #C6D870",
  borderRadius: "8px",
  fontSize: 14,
  boxSizing: "border-box",
};

const buttonStyle = {
  backgroundColor: "#556B2F",
  color: "#fff",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
};

export default VerifyToken;
