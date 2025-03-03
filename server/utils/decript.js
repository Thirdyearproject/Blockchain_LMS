async function decryptPrivateKey(encryptedData, password) {
  const [saltHex, ivHex, encrypted] = encryptedData.split("::");
  const salt = Buffer.from(saltHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const key = crypto.pbkdf2Sync(password, salt, 10000, 32, "sha256");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = decryptPrivateKey;
