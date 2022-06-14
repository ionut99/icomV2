const mysql = require("mysql");
var sqlPool = require("./sql.js");

function InsertNewRoomData(roomName, private, uuidRoom) {
  let insertQuery = "INSERT INTO ?? (??, ??, ??, ??) VALUES (?, ?, ?, NULL)";
  let query = mysql.format(insertQuery, [
    "room",
    "ID",
    "name",
    "private",
    "avatar",
    uuidRoom,
    roomName,
    private,
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

function InsertParticipantData(uuidRoom, userId) {
  let insertQuery = "INSERT INTO ?? (ID, ??, ??) VALUES (NULL, ?, ?)";
  let query = mysql.format(insertQuery, [
    "participants",
    "userId",
    "roomId",
    userId,
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

function DeleteAllMessageFromRoom(roomId) {
  let deletQuery = "DELETE FROM ?? WHERE ?? = ?";
  let query = mysql.format(deletQuery, ["messages", "messages.roomId", roomId]);
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

function DeleteAllParticipantsFromRoom(roomId) {
  let deletQuery = "DELETE FROM ?? WHERE ?? = ?";
  let query = mysql.format(deletQuery, [
    "participants",
    "participants.roomId",
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

function DeleteRoomData(roomId) {
  let deletQuery = "DELETE FROM ?? WHERE ?? = ?";
  let query = mysql.format(deletQuery, ["room", "room.ID", roomId]);
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

function GetRoomMessagesData(roomId, messageTime, messagesPosition, number) {
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
    "messages.roomId",
    "room.ID",
    "room.ID",
    roomId,
    "messages.createdTime",
    messageTime,
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

function GetRoomFolderID(channelId) {
  let selectQuery =
    "SELECT ?? FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ? AND ?? = 'root'";
  let query = mysql.format(selectQuery, [
    "folders.folderId",
    "folders",
    "foldersusers",
    "folders.folderId",
    "foldersusers.folderIdResource",
    "foldersusers.roomIdBeneficiary",
    channelId,
    "folders.parentId",
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

function GetPartListData(channelId) {
  let selectQuery = "SELECT * FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ?";
  let query = mysql.format(selectQuery, [
    "participants",
    "iusers",
    "participants.userId",
    "iusers.userId",
    "roomId",
    channelId,
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

function GetRoomDetailsData(roomId) {
  let selectQuery = "SELECT * FROM ?? WHERE ?? = ?";
  let query = mysql.format(selectQuery, ["room", "room.ID", roomId]);
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

function GetAllRoomsDetailsData() {
  let selectQuery = "SELECT * FROM ??";
  let query = mysql.format(selectQuery, ["room"]);
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

function GetNumberOfParticipantsOfRoom(roomId) {
  let selectQuery = "SELECT * FROM ?? WHERE ?? = ?";
  let query = mysql.format(selectQuery, [
    "participants",
    "participants.roomId",
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
  InsertNewRoomData,
  InsertParticipantData,
  DeleteAllMessageFromRoom,
  DeleteAllParticipantsFromRoom,
  DeleteRoomData,
  GetRoomMessagesData,
  GetRoomFolderID,
  GetPartListData,
  GetRoomDetailsData,
  GetAllRoomsDetailsData,
  GetNumberOfParticipantsOfRoom,
};
