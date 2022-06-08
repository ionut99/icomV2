const mysql = require("mysql");
var sqlPool = require("./sql.js");

function GetUserFromDataBase(email) {
  let selectQuery = "SELECT * FROM ?? WHERE ?? = ?";
  let query = mysql.format(selectQuery, ["iusers", "email", email]);
  return new Promise((resolve, reject) => {
    //
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
    //
  });
}

function GetUserByID(userId) {
  let selectQuery = "SELECT * FROM ?? WHERE ?? = ?";
  let query = mysql.format(selectQuery, ["iusers", "userId", userId]);
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

function GetParticipantByID(participantId, roomId) {
  let selectQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
  let query = mysql.format(selectQuery, [
    "participants",
    "userId",
    participantId,
    "roomId",
    roomId,
  ]);
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
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
