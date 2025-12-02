import React, { useState } from "react";
import { verifyCode, resendVerification } from "../../services/api";
import backgroundImage from "./Assets/clean.jpeg";
import Loader from "./Loader";

function VerifyEmail() {
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email") || "";

  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Email is required");
      return;
    }
    if (!verificationCode || verificationCode.length !== 6) {
      setMessage("Please enter a valid 6-digit code");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await verifyCode({ email, code: verificationCode });
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

  const resendEmail = async () => {
    if (!email) {
      setMessage("Email is required");
      return;
    }
    setResendLoading(true);
    setMessage("");

    try {
      await resendVerification({ email });
      setMessage("Verification code resent! Check your inbox.");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to resend. Try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "rgba(239,245,210,0.95)",
          padding: "40px",
          borderRadius: "12px",
          width: "420px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#556B2F" }}>Verify Your Email</h2>

        <p style={{ color: "#556B2F" }}>
          A verification code has been sent to:
          <br />
          <b>{email}</b>
        </p>

        <form onSubmit={handleVerifyCode} style={{ marginTop: 20 }}>
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
              width: "100%",
              padding: "14px 12px",
              margin: "10px 0",
              border: "1px solid #C6D870",
              borderRadius: "8px",
              fontSize: 24,
              letterSpacing: 8,
              fontWeight: "bold",
              textAlign: "center",
              boxSizing: "border-box",
            }}
            maxLength={6}
            required
          />

          <p style={{ 
            marginTop: "10px", 
            color: message.includes("✅") ? "#8FA31E" : message ? "#d32f2f" : "transparent",
            minHeight: 24,
            fontSize: 14,
          }}>
            {message}
          </p>

          <button
            type="submit"
            disabled={loading || verificationCode.length !== 6}
            style={{
              backgroundColor: "#556B2F",
              color: "white",
              padding: "12px",
              width: "100%",
              borderRadius: "8px",
              marginTop: "10px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            {loading ? <Loader size={18} /> : "Verify Code"}
          </button>
        </form>

        <button
          onClick={resendEmail}
          disabled={resendLoading}
          style={{
            backgroundColor: "transparent",
            color: "#556B2F",
            border: "1px solid #556B2F",
            padding: "12px",
            width: "100%",
            borderRadius: "8px",
            marginTop: "10px",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          {resendLoading ? <Loader size={18} /> : "Resend Code"}
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;
