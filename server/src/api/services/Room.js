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

function GetRoomMessagesData(ChannelID) {
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(
      `SELECT * FROM messages INNER JOIN room ON messages.RoomID = room.ID WHERE room.ID = '${ChannelID}'`,
      (err, result) => {
        if (err) {
          return resolve("FAILED");
        }
        return resolve(result);
      }
    );
  });
}

function GetRoomFolderID(ChannelID) {
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(
      `SELECT folders.folderId FROM folders INNER JOIN foldersusers ON folders.folderId = foldersusers.folderIdResource WHERE foldersusers.RoomIdBeneficiary = '${ChannelID}' AND folders.parentID = 'root'`,
      (err, result) => {
        if (err) {
          return resolve("FAILED");
        }
        return resolve(result);
      }
    );
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
