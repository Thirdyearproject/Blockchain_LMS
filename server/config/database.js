require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./mydb.sqlite", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to the SQLite database.");

    // Create the users table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        username TEXT UNIQUE NOT NULL, 
        password TEXT NOT NULL,
        accountType TEXT NOT NULL
    )`);

    // Create the user_accounts table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS user_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        user_id INTEGER NOT NULL, 
        account_name TEXT NOT NULL, 
        encryptedPrivateKey TEXT NOT NULL, 
        iv TEXT NOT NULL,  -- Added the IV column
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
  }
});

async function connectWithDB() {
  try {
    console.log("Initializing database connection...");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

module.exports = { connectWithDB, db };
