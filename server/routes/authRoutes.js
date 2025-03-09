const express = require("express");
const router = express.Router();
const encryptPrivateKey = require("../utils/encript");
const decryptPrivateKey = require("../utils/decript");
const bcrypt = require("bcrypt");
const { db } = require("../config/database");

// Sign up route
router.post("/signup", async (req, res) => {
  console.log("Received signup request:", req.body);
  const { userName, password, accounts } = req.body;

  if (!userName || !password || !accounts || !accounts.length) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (userName, password) VALUES (?, ?)",
      [userName, hashedPassword],
      function (err) {
        if (err) {
          if (err.code === "SQLITE_CONSTRAINT") {
            return res.status(409).json({ error: "userName already exists" });
          }
          console.error("Database error during signup:", err.message);
          return res
            .status(500)
            .json({ error: "Database error during signup" });
        }

        const userId = this.lastID;
        const stmt = db.prepare(
          "INSERT INTO user_accounts (user_id, account_name, encryptedPrivateKey) VALUES (?, ?, ?)"
        );

        (async () => {
          try {
            for (const account of accounts) {
              if (!account.account_name || !account.privateKey) {
                console.error("Missing account details:", account);
                return res.status(400).json({
                  error:
                    "Invalid account data. Account name and private key are required.",
                });
              }

              const { encryptedData } = await encryptPrivateKey(
                account.privateKey,
                password
              );

              stmt.run(userId, account.account_name, encryptedData);
            }
            stmt.finalize();

            console.log(`User signed up successfully with ID: ${userId}`);
            res.status(201).json({ id: userId });
          } catch (encryptionError) {
            console.error("Encryption error:", encryptionError);
            res.status(500).json({ error: "Encryption failed" });
          }
        })();
      }
    );
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "An error occurred during signup" });
  }
});

// Login route
router.post("/login", (req, res) => {
  console.log("Received login request:", req.body);
  const { userName, password } = req.body;

  db.get("SELECT * FROM users WHERE userName = ?", [userName], (err, user) => {
    if (err) {
      console.error("Database error during login:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    db.all(
      "SELECT * FROM user_accounts WHERE user_id = ?",
      [user.id],
      (err, accounts) => {
        if (err) {
          console.error("Error retrieving user accounts:", err.message);
          return res.status(500).json({ error: "Database error" });
        }

        try {
          // Include the account name and decrypted private key in the response
          const decryptedAccounts = accounts.map((account) => ({
            account_name: account.account_name,
            privateKey: decryptPrivateKey(
              account.encryptedPrivateKey,
              password
            ), // Decrypt the private key
          }));

          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });
          console.log(`User ${userName} logged in successfully`);
          res.json({ token, accounts: decryptedAccounts }); // Send account name and private key
        } catch (decryptionError) {
          console.error("Decryption error:", decryptionError);
          res.status(500).json({ error: "Decryption error" });
        }
      }
    );
  });
});

// Protected route (requires a valid JWT)
router.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden - Invalid token" });
    }
    req.user = user;
    res.json({ message: `Hello, User ${user.id}! This is protected content.` });
  });
});

module.exports = router;
