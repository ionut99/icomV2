const crypto = require("crypto");

const ALGORITHM_NAME = "aes-128-gcm";
const ALGORITHM_NONCE_SIZE = 12;
const ALGORITHM_TAG_SIZE = 16;
const ALGORITHM_KEY_SIZE = 16;
const PBKDF2_NAME = "sha256";
const PBKDF2_SALT_SIZE = 16;
const PBKDF2_ITERATIONS = 32767;

const ALGO = "aes-256-gcm";

//
const encryptString = (str) => {
  const key = "vOVH6sdmpNWjRRIqvOVH6sdmpNWjRRIq";
  try {
    const salt = crypto.randomBytes(64);
    const iv = crypto.randomBytes(32);
    let derivedkey = crypto.pbkdf2Sync(key, salt, 55000, 32, "sha512");
    const cipher = crypto.createCipheriv(ALGO, derivedkey, iv);
    let encrypted = Buffer.concat([cipher.update(str), cipher.final()]);
    const tag = cipher.getAuthTag();
    let buffer = Buffer.concat([salt, iv, encrypted]);
    encrypted = {
      tag: tag,
      buffer: buffer,
    };
    return encrypted;
  } catch (e) {
    console.log(e);
  }
};

//
const decryptString = (data, authTag) => {
  const key = "vOVH6sdmpNWjRRIqvOVH6sdmpNWjRRIq";
  try {
    const salt = data.slice(0, 64);
    const iv = data.slice(64, 96);
    const text = data.slice(96, data.length);
    authTag = new Buffer.from(authTag, "base64");
    let derivedkey = crypto.pbkdf2Sync(key, salt, 55000, 32, "sha512");
    let decipher = crypto.createDecipheriv(ALGO, derivedkey, iv);
    decipher.setAuthTag(authTag);
    let decrypted = Buffer.concat([decipher.update(text), decipher.final()]);
    return decrypted;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  encryptString,
  decryptString,
};
