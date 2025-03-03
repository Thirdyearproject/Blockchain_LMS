require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const crypto = require("crypto");
const connectWithDB = require("./config/database");
const encryptPrivateKey = require("./utils/encript");
const decryptPrivateKey = require("./");

const app = express();
const PORT = process.env.PORT || 5678;

// Database connection

const db = connectWithDB()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Database connection error:", err));

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));

// 404 handler
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
