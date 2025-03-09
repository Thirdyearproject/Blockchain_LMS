const crypto = require("crypto");

async function encryptPrivateKey(privateKey, password) {
  const algorithm = "aes-256-cbc";
  const key = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64")
    .substr(0, 32); // Ensure key is 32 bytes
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedData = cipher.update(privateKey, "utf8", "hex");
  encryptedData += cipher.final("hex");
  return { encryptedData, iv: iv.toString("hex") };
}

module.exports = encryptPrivateKey;
