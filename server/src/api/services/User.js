const mysql = require("mysql");

const { DataBaseConfig } = require("../../config/dataBase");

function GetAllUsersDataBase() {
  const db = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM IUsers", (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

function GetSearchUsersList(search_box_text, userId) {
  const db = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM iusers WHERE ( Email LIKE N'%${search_box_text}%' or Name LIKE N'%${search_box_text}%' or Surname LIKE N'%${search_box_text}%') and NOT userId = ${userId}`,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
}

function GetUserRoomsList(userId) {
  const db = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT room.Name as conversationName from room inner join participants on room.ID = participants.RoomID inner join iusers on iusers.userId = participants.UserID where participants.UserID = ${userId}`,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
}

module.exports = {
  GetAllUsersDataBase,
  GetSearchUsersList,
  GetUserRoomsList,
};
