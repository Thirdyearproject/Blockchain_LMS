const crypto = require("crypto");

function decryptPrivateKey(encryptedPrivateKey, password, iv) {
  const algorithm = "aes-256-cbc";
  const key = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64")
    .substr(0, 32); // Ensure key is 32 bytes
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );
  let decryptedData = decipher.update(encryptedPrivateKey, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}

module.exports = decryptPrivateKey;
