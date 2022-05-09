const { path } = require("express/lib/application");
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
      `SELECT CONCAT(iusers.Surname, ' ', iusers.Name) as UserName, iusers.userId FROM iusers WHERE ( Email LIKE N'%${search_box_text}%' or Name LIKE N'%${search_box_text}%' or Surname LIKE N'%${search_box_text}%') and NOT userId = '${userId}'`,
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

function InsertNewMessageData(
  ID_message,
  senderID,
  roomID,
  messageBody,
  createdTime
) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `INSERT INTO messages (ID_message, RoomID, senderID, Body, createdTime) VALUES ('${ID_message}', '${roomID}', '${senderID}', '${messageBody}', '${createdTime}');`,
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

function AddNewMemberInGroupData(roomID, userSearchListID) {
  // console.log(
  //   "se introduce in camera : " + roomID + " utilizatorul : " + userSearchListID
  // );
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `INSERT INTO participants (ID, UserID, RoomID) VALUES (NULL, '${userSearchListID}', '${roomID}');`,
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
      `SELECT CONCAT(iusers.Surname, ' ', iusers.Name) as UserName, iusers.userId FROM iusers WHERE iusers.userId != '${userId}'`,
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

// Update User Avatar
function UpdateAvatarPathData(UserID, Path) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `UPDATE iusers SET  Avatar = '${Path}' WHERE userId = '${UserID}'`,
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

//Get Room's Avatar Details
function GetRoomDetails(RoomID) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM room WHERE ID = '${RoomID}'`,
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

//Get Other User Details from Rpivate Room
function GetPrivateRoomOtherUserDetails(RoomID, atuhUser) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM participants INNER JOIN room ON room.ID = participants.RoomID WHERE RoomID = '${RoomID}' and room.Private = 1 and participants.UserID != '${atuhUser}'`,
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

//Get Other User Details from Rpivate Room
function GetUserDetailsData(userId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `SELECT iusers.Surname, iusers.Name, iusers.Email, iusers.IsAdmin, iusers.Avatar FROM iusers WHERE userId = '${userId}'`,
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

// Insert New User Account
function InsertNewUserAccountData(
  userId,
  userSurname,
  userName,
  email,
  password,
  isAdmin
) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `INSERT INTO iusers (userId, Surname, Name, Email, Password, IsAdmin, Avatar) VALUES ('${userId}', '${userSurname}', '${userName}', '${email}', '${password}', '${isAdmin}', NULL)`,
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
  GetAllUsersDataBase,
  GetSearchUsersList,
  GetUserRoomsList,
  GetRoomMessagesData,
  InsertNewMessageData,
  AddNewMemberInGroupData,
  GetPartListData,
  GetNOTPartListData,
  UpdateAvatarPathData,
  GetRoomDetails,
  GetPrivateRoomOtherUserDetails,
  GetUserDetailsData,
  InsertNewUserAccountData,
};
