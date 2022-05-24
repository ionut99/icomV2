const mysql = require("mysql");
var sqlPool = require("./sql.js");

function GetAllUsersDataBase(userId) {
  let selectQuery = "SELECT * FROM ?? WHERE ?? != ?";
  let query = mysql.format(selectQuery, ["iusers", "iusers.userId", userId]);
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

function GetUserRoomsList(search_box_text, userId) {
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(
      `SELECT room.ID as RoomID, room.Name as RoomName, room.Private as Type from room INNER JOIN participants ON room.ID = participants.RoomID WHERE participants.UserID = '${userId}' AND room.Name LIKE N'%${search_box_text}%'`,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
}

function InsertNewMessageData(
  ID_message,
  senderID,
  roomID,
  messageBody,
  createdTime
) {
  return new Promise((resolve) => {
    sqlPool.pool.query(
      `INSERT INTO messages (ID_message, RoomID, senderID, Body, createdTime) VALUES ('${ID_message}', '${roomID}', '${senderID}', '${messageBody}', '${createdTime}');`,
      (err, result) => {
        if (err) {
          return resolve("FAILED");
        }
        return resolve(result);
      }
    );
  });
}

function AddNewMemberInGroupData(roomID, userSearchListID) {
  // console.log(
  //   "se introduce in camera : " + roomID + " utilizatorul : " + userSearchListID
  // );
  return new Promise((resolve) => {
    sqlPool.pool.query(
      `INSERT INTO participants (ID, UserID, RoomID) VALUES (NULL, '${userSearchListID}', '${roomID}');`,
      (err, result) => {
        if (err) {
          return resolve("FAILED");
        }
        return resolve(result);
      }
    );
  });
}

// Update User Avatar
function UpdateAvatarPathData(UserID, Path) {
  return new Promise((resolve) => {
    sqlPool.pool.query(
      `UPDATE iusers SET  Avatar = '${Path}' WHERE userId = '${UserID}'`,
      (err, result) => {
        if (err) {
          return resolve("FAILED");
        }
        return resolve(result);
      }
    );
  });
}

//Get Room's Avatar Details
function GetRoomDetails(RoomID) {
  return new Promise((resolve) => {
    sqlPool.pool.query(
      `SELECT * FROM room WHERE ID = '${RoomID}'`,
      (err, result) => {
        if (err) {
          return resolve("FAILED");
        }
        return resolve(result);
      }
    );
  });
}

//Get Other User Details from Rpivate Room
function GetParticipantFromPrivateConversation(roomId, userId) {
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(
      `SELECT iusers.userId FROM participants INNER JOIN iusers ON participants.UserID = iusers.userId WHERE participants.RoomID = '${roomId}' AND participants.UserID != '${userId}'`,
      (err, result) => {
        if (err) {
          return resolve("FAILED");
        }
        return resolve(result);
      }
    );
  });
}

//Get Other User Details from Rpivate Room
function GetUserDetailsData(userId) {
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

// Insert New User Account
function InsertNewUserAccountData(
  userId,
  userSurname,
  userName,
  email,
  password,
  salt,
  isAdmin
) {
  return new Promise((resolve) => {
    sqlPool.pool.query(
      `INSERT INTO iusers (userId, Surname, Name, Email, Salt, Password, IsAdmin, Avatar) VALUES ('${userId}', '${userSurname}', '${userName}', '${email}','${salt}', '${password}', '${isAdmin}', NULL)`,
      (err, result) => {
        if (err) {
          return resolve("FAILED");
        }
        return resolve(result);
      }
    );
  });
}

// Edit New User Account
function EditUserAccountDataBase(
  userSurname,
  userName,
  email,
  password,
  salt,
  userId
) {
  let updateQuery =
    "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
  let query = mysql.format(updateQuery, [
    "iusers",
    "Surname",
    userSurname,
    "Name",
    userName,
    "Email",
    email,
    "Password",
    password,
    "Salt",
    salt,
    "userId",
    userId,
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

module.exports = {
  GetAllUsersDataBase,
  GetUserRoomsList,
  InsertNewMessageData,
  AddNewMemberInGroupData,
  UpdateAvatarPathData,
  GetRoomDetails,
  GetParticipantFromPrivateConversation,
  GetUserDetailsData,
  InsertNewUserAccountData,
  EditUserAccountDataBase,
};
