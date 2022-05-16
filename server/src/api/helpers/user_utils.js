var sha512 = require("js-sha512");

const Characters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-=+";

function generateRandomSalt(length) {
  let salt = "";
  for (let i = 0; i < length; i++) {
    salt += Characters.charAt(Math.floor(Math.random() * Characters.length));
  }
  return salt;
}

function generateOfuscatedPassword(plainText, salt) {
  const pepper = "VSNDJNCOSDICIODNCSNVSFOokewjre8j9ewjc9w!@#($)#";
  const salt_length = 64;

  let hash = sha512(salt + plainText + pepper);
  for (let i = 0; i < 100; i++) {
    hash = sha512(hash);
  }

  return hash;
}

module.exports = {
  generateRandomSalt,
  generateOfuscatedPassword,
};
