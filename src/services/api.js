import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const signup = (data) => API.post("/auth/signup", data); // ✅ Capital 'S'
export const login = (data) => API.post("/auth/login", data);
export const getProviders = () => API.get("/admin/providers");
export const approveProvider = (id) => API.put(`/admin/approve/${id}`);
export const resendVerification = (data) => API.post("/auth/resend-verification", data);
export const verifyCode = (data) => API.post("/auth/verify-code", data);

export default API;
