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
  let deletQuery = "DELETE FROM ?? WHERE ?? = ?";
  let query = mysql.format(deletQuery, ["messages", "messages.RoomID", RoomID]);
  return new Promise((resolve) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return resolve("FAILED");
      }
      return resolve(result);
    });
  });
}

function DeleteAllParticipantsFromRoom(RoomID) {
  let deletQuery = "DELETE FROM ?? WHERE ?? = ?";
  let query = mysql.format(deletQuery, [
    "participants",
    "participants.RoomID",
    RoomID,
  ]);
  return new Promise((resolve) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return resolve("FAILED");
      }
      return resolve(result);
    });
  });
}

function DeleteRoomData(RoomID) {
  let deletQuery = "DELETE FROM ?? WHERE ?? = ?";
  let query = mysql.format(deletQuery, ["room", "room.ID", RoomID]);
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

function GetRoomMessagesData(ChannelID, time, messagesPosition, number) {
  var selectQuery = "";

  if (messagesPosition === "top")
    selectQuery =
      "SELECT * FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ? AND ?? <= ? ORDER BY ?? DESC LIMIT ?";
  else
    selectQuery =
      "SELECT * FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ? AND ?? >= ? ORDER BY ?? ASC LIMIT ?";
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
    number,
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

function GetRoomDetailsData(roomID) {
  let selectQuery = "SELECT * FROM ?? WHERE ?? = ?";
  let query = mysql.format(selectQuery, ["room", "room.ID", roomID]);
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
  InsertNewRoomData,
  InsertParticipantData,
  DeleteAllMessageFromRoom,
  DeleteAllParticipantsFromRoom,
  DeleteRoomData,
  GetRoomMessagesData,
  GetRoomFolderID,
  GetPartListData,
  GetRoomDetailsData,
};
