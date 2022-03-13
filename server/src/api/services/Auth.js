const mysql = require("mysql");

const { DataBaseConfig } = require("../../config/dataBase");

function GetUserFromDataBase(email, password) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM IUsers WHERE email = ? AND password = ?",
      [email, password],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
    connection.end();
  });
}

function GetUserByID(userId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM IUsers WHERE userId = ?",
      [userId],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
    connection.end();
  });
}
module.exports = {
  GetUserFromDataBase,
  GetUserByID,
};
