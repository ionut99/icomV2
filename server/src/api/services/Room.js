const { path } = require("express/lib/application");
const mysql = require("mysql");

const { DataBaseConfig } = require("../../config/dataBase");

function InsertNewRoomData(RoomName, Private, uuidRoom) {
  const connection = new mysql.createConnection(DataBaseConfig);

  return new Promise((resolve) => {
    connection.query(
      `INSERT INTO room (ID, Name, Private, Avatar) VALUES ('${uuidRoom}', '${RoomName}', '${Private}', NULL);`,
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

function InsertParticipantData(uuidRoom, userID) {
  const connection = new mysql.createConnection(DataBaseConfig);

  return new Promise((resolve) => {
    connection.query(
      `INSERT INTO participants (ID, UserID, RoomID) VALUES (NULL, '${userID}', '${uuidRoom}');`,
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

function DeleteAllMessageFromRoom(RoomID) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `DELETE FROM messages WHERE messages.RoomID = '${RoomID}'`,
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

function DeleteAllParticipantsFromRoom(RoomID) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `DELETE FROM participants WHERE participants.RoomID = '${RoomID}'`,
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

function DeleteRoomData(RoomID) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM room WHERE room.ID = '${RoomID}'`,
      (err, result) => {
        if (err) {
          //   return resolve("FAILED");
          return reject(err);
        }
        return resolve(result);
      }
    );
    connection.end();
  });
}

function GetRoomMessagesData(ChannelID) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM messages INNER JOIN room ON messages.RoomID = room.ID WHERE room.ID = '${ChannelID}'`,
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

function GetRoomFolderID(ChannelID) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT folders.folderId FROM folders INNER JOIN foldersusers ON folders.folderId = foldersusers.folderIdResource WHERE foldersusers.RoomIdBeneficiary = '${ChannelID}' AND folders.parentID = 'root'`,
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

function GetPartListData(ChannelID) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `SELECT CONCAT(iusers.Surname, ' ', iusers.Name) as UserName, iusers.userId FROM participants INNER JOIN iusers ON participants.UserID = iusers.userId WHERE RoomID = '${ChannelID}'`,
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

function GetNOTPartListData(ChannelID, userId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `SELECT DISTINCT CONCAT(iusers.Surname, ' ', iusers.Name) as UserName, iusers.userId FROM iusers INNER JOIN participants ON iusers.userId = participants.UserID WHERE participants.RoomID != '${ChannelID}' AND iusers.userId != '${userId}'`,
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
