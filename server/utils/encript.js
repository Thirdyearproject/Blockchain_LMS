const crypto = require("crypto");

async function encryptPrivateKey(privateKey, password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, 10000, 32, "sha256");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    encryptedData: `${salt.toString("hex")}::${iv.toString(
      "hex"
    )}::${encrypted}`,
  };
}

module.exports = encryptPrivateKey;
