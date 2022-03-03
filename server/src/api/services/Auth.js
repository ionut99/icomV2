const mysql = require("mysql");

const { DataBaseConfig } = require("../../config/dataBase");

function GetUserFromDataBase(email, password) {
  const db = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM IUsers WHERE email = ? AND password = ?",
      [email, password],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
}

function GetUserByID(userId) {
  const db = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM IUsers WHERE userId = ?",
      [userId],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
}
module.exports = {
  GetUserFromDataBase,
  GetUserByID,
};
