const mysql = require("mysql");

const { DataBaseConfig } = require("../../config/dataBase");

function GetUserFromDataBase(email) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM IUsers WHERE email = ?",
      [email],
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

function GetParticipantByID(participantId, roomID) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM participants WHERE UserID = ? AND RoomID = ?`,
      [participantId],
      [roomID],
      (err, result) => {
        if (err) {
          return resolve("FAILED");
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
  GetParticipantByID,
};
