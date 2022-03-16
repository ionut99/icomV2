const mysql = require("mysql");

const { DataBaseConfig } = require("../../config/dataBase");

function GetAllUsersDataBase() {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM IUsers", (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
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
      `SELECT room.ID as RoomID, room.Name as RoomName from room INNER JOIN participants ON room.ID = participants.RoomID WHERE participants.UserID = ${userId} AND room.Name LIKE N'%${search_box_text}%'`,
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
      `SELECT * FROM messages INNER JOIN room ON messages.RoomID = room.ID WHERE room.ID = ${ChannelID}`,
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

// function GetLastIDMessage() {
//   const connection = new mysql.createConnection(DataBaseConfig);
//   return new Promise((resolve, reject) => {
//     connection.query(
//       `SELECT MAX(ID_message) from messages`,
//       (err, result) => {
//         if (err) {
//           return reject(err);
//         }
//         return resolve(result);
//       }
//     );
//     connection.end();
//   });
// }

//SELECT MAX(ID_message) from messages

module.exports = {
  GetAllUsersDataBase,
  GetSearchUsersList,
  GetUserRoomsList,
  GetRoomMessagesData,
  InsertNewMessageData,
};
