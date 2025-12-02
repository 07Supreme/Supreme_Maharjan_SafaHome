import React, { useState } from "react";
import { signup, resendVerification, verifyCode } from "../../services/api";
import backgroundImage from "./Assets/clean.jpeg";
import Loader from "./Loader";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    serviceType: "",
    experience: "",
    address: "",
    citizenship: "",
  });

  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileUpload = (e) => setForm({ ...form, citizenship: e.target.files[0]?.name || "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResendMsg("");

    try {
      // Structure the data properly for backend
      const signupData = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
      };

      // If provider, include providerDetails with status
      if (form.role === "provider") {
        signupData.providerDetails = {
          serviceType: form.serviceType,
          experience: form.experience,
          address: form.address,
          citizenship: form.citizenship,
          status: "pending", // Set initial status
        };
      }

      await signup(signupData);
      // Show verification pending state (combined UI)
      setPendingEmail(form.email);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setResendLoading(true);
    setResendMsg("");
    setVerifyMsg("");
    try {
      await resendVerification({ email: pendingEmail });
      setResendMsg("Verification code resent. Check your inbox.");
    } catch (err) {
      console.error(err);
      setResendMsg(err.response?.data?.message || "Failed to resend. Try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      setVerifyMsg("Please enter a valid 6-digit code");
      return;
    }
    setVerifying(true);
    setVerifyMsg("");
    try {
      await verifyCode({ email: pendingEmail, code: verificationCode });
      setVerifyMsg("✅ Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      console.error(err);
      setVerifyMsg(err.response?.data?.message || "Invalid or expired code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  // If pendingEmail is set, show verify panel instead of form (combined UI)
  if (pendingEmail) {
    return (
      <div style={pageStyle(backgroundImage)}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Verify Your Email</h2>

          <p style={{ color: "#556B2F" }}>
            A verification code has been sent to:
            <br />
            <b>{pendingEmail}</b>
          </p>

          <form onSubmit={handleVerifyCode} style={{ marginTop: 20 }}>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setVerificationCode(value);
                setVerifyMsg("");
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

            <p style={{ color: verifyMsg.includes("✅") ? "#8FA31E" : "#d32f2f", minHeight: 24, fontSize: 14, marginTop: 8 }}>
              {verifyMsg || resendMsg}
            </p>

            <button
              type="submit"
              disabled={verifying || verificationCode.length !== 6}
              style={{ ...buttonStyle, width: "100%", marginTop: 10 }}
            >
              {verifying ? <Loader size={18} /> : "Verify Code"}
            </button>
          </form>

          <button
            onClick={handleResend}
            disabled={resendLoading}
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

          <p style={{ marginTop: 12, color: "#556B2F", fontSize: 13 }}>
            After verifying, you will be able to log in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle(backgroundImage)}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Join SafaHome</h2>

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name"
            value={form.name} onChange={handleChange} style={inputStyle} required />

          <input type="email" name="email" placeholder="Email"
            value={form.email} onChange={handleChange} style={inputStyle} required />

          <input type="password" name="password" placeholder="Password"
            value={form.password} onChange={handleChange} style={inputStyle} required />

          <input type="text" name="phone" placeholder="Phone Number"
            value={form.phone} onChange={handleChange} style={inputStyle} required />

          <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
            <option value="user">User</option>
            <option value="provider">Service Provider</option>
          </select>

          {form.role === "provider" && (
            <>
              <select name="serviceType" value={form.serviceType}
                onChange={handleChange} style={inputStyle}>
                <option value="">Select Service Type</option>
                <option value="cleaning">Cleaning</option>
                <option value="plumbing">Plumbing</option>
                <option value="painting">Painting</option>
                <option value="electrical">Electrical</option>
              </select>

              <input type="text" name="experience" placeholder="Years of Experience"
                value={form.experience} onChange={handleChange} style={inputStyle} />

              <textarea
                name="address"
                placeholder="Address / Skills"
                value={form.address}
                onChange={handleChange}
                style={{ ...inputStyle, height: "60px" }}
              ></textarea>

              <label style={{ display: "block", textAlign: "left", color: "#556B2F", marginTop: 6 }}>Upload Citizenship:</label>
              <input type="file" onChange={handleFileUpload} style={inputStyle} />
            </>
          )}

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? <Loader size={18} /> : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* Styles (matched to your screenshot) */
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
  background: "rgba(242, 247, 203, 0.95)", // light translucent cream/green similar to screenshot
  padding: "40px",
  borderRadius: "12px",
  maxWidth: "640px",
  width: "560px",
  textAlign: "center",
  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
};

const titleStyle = { color: "#556B2F", marginBottom: 20, fontSize: 26, fontWeight: "700" };

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
  width: "100%",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  marginTop: 8,
};

export default Signup;
