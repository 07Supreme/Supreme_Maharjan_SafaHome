const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRouter = require("./router/auth-router");
const adminRouter = require("./router/admin-routes");

require("dotenv").config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
