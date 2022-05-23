const mysql = require("mysql");
var sqlPool = require("./sql.js");

function GetUserFromDataBase(email) {
  let selectQuery = "SELECT * FROM ?? WHERE ?? = ?";
  let query = mysql.format(selectQuery, ["iusers", "email", email]);
  return new Promise((resolve, reject) => {
    //
    sqlPool.pool.getConnection((err, connection) => {
      connection.query(query, [email], (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
      connection.release();
      //
    });
  });
}

function GetUserByID(userId) {
  let selectQuery = "SELECT * FROM ?? WHERE ?? = ?";
  let query = mysql.format(selectQuery, ["iusers", "userId", userId]);
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(query, [userId], (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

function GetParticipantByID(participantId, roomID) {
  let selectQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
  let query = mysql.format(selectQuery, [
    "participants",
    "UserID",
    userId,
    "RoomID",
    roomID,
  ]);
  return new Promise((resolve) => {
    sqlPool.query(query, [participantId], [roomID], (err, result) => {
      if (err) {
        return resolve("FAILED");
      }
      return resolve(result);
    });
  });
}

module.exports = {
  GetUserFromDataBase,
  GetUserByID,
  GetParticipantByID,
};
