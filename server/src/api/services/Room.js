const mysql = require("mysql");
var sqlPool = require("./sql.js");

function InsertNewRoomData(RoomName, Private, uuidRoom) {
  let insertQuery = "INSERT INTO ?? (??, ??, ??, ??) VALUES (?, ?, ?, NULL)";
  let query = mysql.format(insertQuery, [
    "room",
    "ID",
    "Name",
    "Private",
    "Avatar",
    uuidRoom,
    RoomName,
    Private,
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

function InsertParticipantData(uuidRoom, userID) {
  let insertQuery = "INSERT INTO ?? (ID, ??, ??) VALUES (NULL, ?, ?)";
  let query = mysql.format(insertQuery, [
    "participants",
    "UserID",
    "RoomID",
    userID,
    uuidRoom,
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

function DeleteAllMessageFromRoom(RoomID) {
  return new Promise((resolve) => {
    sqlPool.pool.query(
      `DELETE FROM messages WHERE messages.RoomID = '${RoomID}'`,
      (err, result) => {
        if (err) {
          return resolve("FAILED");
        }
        return resolve(result);
      }
    );
  });
}

function DeleteAllParticipantsFromRoom(RoomID) {
  return new Promise((resolve) => {
    sqlPool.pool.query(
      `DELETE FROM participants WHERE participants.RoomID = '${RoomID}'`,
      (err, result) => {
        if (err) {
          return resolve("FAILED");
        }
        return resolve(result);
      }
    );
  });
}

function DeleteRoomData(RoomID) {
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(
      `DELETE FROM room WHERE room.ID = '${RoomID}'`,
      (err, result) => {
        if (err) {
          //   return resolve("FAILED");
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
}

function GetRoomMessagesData(ChannelID, time, messagesPosition) {
  var selectQuery = "";

  if (messagesPosition === "top")
    selectQuery =
      "SELECT * FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ? AND ?? <= ? ORDER BY ?? DESC LIMIT 10";
  else
    selectQuery =
      "SELECT * FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ? AND ?? >= ? ORDER BY ?? ASC LIMIT 10";
  let query = mysql.format(selectQuery, [
    "messages",
    "room",
    "messages.RoomID",
    "room.ID",
    "room.ID",
    ChannelID,
    "messages.createdTime",
    time,
    "messages.createdTime",
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

function GetRoomFolderID(ChannelID) {
  let selectQuery =
    "SELECT ?? FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ? AND ?? = 'root'";
  let query = mysql.format(selectQuery, [
    "folders.folderId",
    "folders",
    "foldersusers",
    "folders.folderId",
    "foldersusers.folderIdResource",
    "foldersusers.RoomIdBeneficiary",
    ChannelID,
    "folders.parentID",
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

function GetPartListData(ChannelID) {
  let selectQuery = "SELECT * FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ?";
  let query = mysql.format(selectQuery, [
    "participants",
    "iusers",
    "participants.UserID",
    "iusers.userId",
    "RoomID",
    ChannelID,
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

function GetNOTPartListData(ChannelID, userId) {
  return new Promise((resolve) => {
    sqlPool.pool.query(
      `SELECT DISTINCT CONCAT(iusers.Surname, ' ', iusers.Name) as UserName, iusers.userId FROM iusers INNER JOIN participants ON iusers.userId = participants.UserID WHERE participants.RoomID != '${ChannelID}' AND iusers.userId != '${userId}'`,
      (err, result) => {
        if (err) {
          return resolve("FAILED");
        }
        return resolve(result);
      }
    );
  });
}

module.exports = {
  InsertNewRoomData,
  InsertParticipantData,
  DeleteAllMessageFromRoom,
  DeleteAllParticipantsFromRoom,
  DeleteRoomData,
  GetRoomMessagesData,
  GetRoomFolderID,
  GetPartListData,
  GetNOTPartListData,
};
