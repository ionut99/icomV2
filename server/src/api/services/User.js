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

function GetUserRoomsList(userId) {
  let selectQuery =
    "SELECT ?? as ??, ?? as ??, ?? as ?? from ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ?";
  let query = mysql.format(selectQuery, [
    "room.ID",
    "roomId",
    "room.name",
    "roomName",
    "room.private",
    "type",
    "room",
    "participants",
    "room.ID",
    "participants.roomId",
    "participants.userId",
    userId,
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

function InsertNewMessageData(
  ID_message,
  senderId,
  roomId,
  body,
  type,
  fileId,
  createdTime
) {
  let insertQuery =
    "INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?);";
  let query = mysql.format(insertQuery, [
    "messages",
    "ID_message",
    "roomId",
    "senderId",
    "body",
    "type",
    "fileId",
    "createdTime",
    ID_message,
    roomId,
    senderId,
    body,
    type,
    fileId,
    createdTime,
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

function AddNewMemberInGroupData(roomID, userSearchListID) {
  let insertQuery = "INSERT INTO ?? (ID, ??, ??) VALUES (NULL, ?, ?)";
  let query = mysql.format(insertQuery, [
    "participants",
    "UserID",
    "RoomID",
    userSearchListID,
    roomID,
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
  let selectQuery = "SELECT * FROM ?? WHERE ?? = ?";
  let query = mysql.format(selectQuery, ["room", "room.ID", RoomID]);
  return new Promise((resolve) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return resolve("FAILED");
      }
      return resolve(result);
    });
  });
}

//Get Other User Details from Rpivate Room
function GetParticipantFromPrivateConversation(roomId, userId) {
  let selectQuery =
    "SELECT ?? FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ? AND ?? != ?";
  let query = mysql.format(selectQuery, [
    "iusers.userId",
    "participants",
    "iusers",
    "participants.UserID",
    "iusers.userId",
    "participants.RoomID",
    roomId,
    "participants.UserID",
    userId,
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
  //
  let insertQuery =
    "INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)";
  let query = mysql.format(insertQuery, [
    "iusers",
    "userId",
    "Surname",
    "Name",
    "Email",
    "Salt",
    "Password",
    "IsAdmin",
    "Avatar",
    userId,
    userSurname,
    userName,
    email,
    salt,
    password,
    isAdmin,
  ]);
  //

  return new Promise((resolve) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return resolve("FAILED");
      }
      return resolve(result);
    });
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
