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
      `SELECT CONCAT(iusers.Surname, ' ', iusers.Name) as UserName, iusers.userId FROM iusers WHERE ( Email LIKE N'%${search_box_text}%' or Name LIKE N'%${search_box_text}%' or Surname LIKE N'%${search_box_text}%') and NOT userId = ${userId}`,
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
}

function GetUserRoomsList(search_box_text, userId) {
  const db = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT room.ID as RoomID, room.Name as RoomName from room INNER JOIN participants ON room.ID = participants.RoomID WHERE participants.UserID = ${userId} AND room.Name LIKE N'%${search_box_text}%'`,
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
