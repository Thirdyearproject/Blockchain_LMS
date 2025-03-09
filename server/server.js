require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectWithDB } = require("./config/database");
const AppError = require("./utils/appError");

const app = express();
const PORT = process.env.PORT || 5678;

// Database connection

connectWithDB();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/v1/auth", require("./routes/authRoutes"));

// 404 handler
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
