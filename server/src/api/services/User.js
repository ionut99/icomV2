const mysql = require("mysql");

const { DataBaseConfig } = require("../../config/dataBase");

function GetAllUsersDataBase() {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT CONCAT(iusers.Surname, ' ', iusers.Name) as UserName, iusers.userId FROM iusers",
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

function GetSearchUsersList(search_box_text, userId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT CONCAT(iusers.Surname, ' ', iusers.Name) as UserName, iusers.userId FROM iusers WHERE ( Email LIKE N'%${search_box_text}%' or Name LIKE N'%${search_box_text}%' or Surname LIKE N'%${search_box_text}%') and NOT userId = ${userId}`,
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

function GetUserRoomsList(search_box_text, userId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT room.ID as RoomID, room.Name as RoomName, room.Private as Type from room INNER JOIN participants ON room.ID = participants.RoomID WHERE participants.UserID = '${userId}' AND room.Name LIKE N'%${search_box_text}%'`,
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

function GetRoomMessagesData(ChannelID) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM messages INNER JOIN room ON messages.RoomID = room.ID WHERE room.ID = '${ChannelID}'`,
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

function InsertNewMessageData(ID_message, senderID, roomID, messageBody) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO messages (ID_message, RoomID, senderID, Body) VALUES ('${ID_message}', '${roomID}', '${senderID}', '${messageBody}');`,
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

function InsertNewRoomData(RoomName, Private, uuidRoom) {
  const connection = new mysql.createConnection(DataBaseConfig);

  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO room (ID, Name, Private) VALUES ('${uuidRoom}', '${RoomName}', '${Private}');`,
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

function InsertParticipantData(uuidRoom, userID) {
  const connection = new mysql.createConnection(DataBaseConfig);

  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO participants (ID, UserID, RoomID) VALUES (NULL, '${userID}', '${uuidRoom}');`,
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

function DeleteAllMessageFromRoom(RoomID) {
  const connection = new mysql.createConnection(DataBaseConfig);

  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM messages WHERE messages.RoomID = '${RoomID}'`,
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

function DeleteAllParticipantsFromRoom(RoomID) {
  const connection = new mysql.createConnection(DataBaseConfig);

  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM participants WHERE participants.RoomID = '${RoomID}'`,
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

function DeleteRoomData(RoomID) {
  const connection = new mysql.createConnection(DataBaseConfig);

  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM room WHERE room.ID = '${RoomID}'`,
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

function AddNewMemberInGroupData(roomID, userSearchListID) {
  console.log(
    "se introduce in camera : " + roomID + " utilizatorul : " + userSearchListID
  );
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO participants (ID, UserID, RoomID) VALUES (NULL, '${userSearchListID}', '${roomID}');`,
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

function GetPartListData(ChannelID) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT CONCAT(iusers.Surname, ' ', iusers.Name) as UserName, iusers.userId FROM participants INNER JOIN iusers ON participants.UserID = iusers.userId WHERE RoomID = '${ChannelID}'`,
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
  GetAllUsersDataBase,
  GetSearchUsersList,
  GetUserRoomsList,
  GetRoomMessagesData,
  InsertNewMessageData,
  InsertNewRoomData,
  InsertParticipantData,
  DeleteRoomData,
  DeleteAllMessageFromRoom,
  DeleteAllParticipantsFromRoom,
  AddNewMemberInGroupData,
  GetPartListData,
};
