import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserHome from "./components/User/UserHome";
import VerifyEmail from "./components/Auth/VerifyEmail";
import VerifyToken from "./components/Auth/VerifyToken";
import VerifyExpired from "./components/Auth/VerifyExpired";





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify/:token" element={<VerifyToken />} />
        <Route path="/verify-expired" element={<VerifyExpired />} />
      </Routes>
    </Router>
  );
}

export default App;
