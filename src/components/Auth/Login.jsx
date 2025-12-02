import React, { useState } from "react";
import { login } from "../../services/api";
import backgroundImage from "./Assets/clean.jpeg";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form);

      if (!res.data.user.verified) {
        alert("Your email is not verified.");
        window.location.href = "/verify-email?email=" + form.email;
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Login successful!");

      window.location.href =
        res.data.user.role === "admin"
          ? "/admin-dashboard"
          : "/user-home";
    } catch {
      alert("Invalid credentials");
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
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#556B2F" }}>Welcome Back to SafaHome</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>Login</button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  border: "1px solid #C6D870",
  borderRadius: "8px",
};

const buttonStyle = {
  backgroundColor: "#556B2F",
  color: "#fff",
  padding: "10px",
  width: "100%",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default Login;
