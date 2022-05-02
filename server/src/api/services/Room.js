const { path } = require("express/lib/application");
const mysql = require("mysql");

const { DataBaseConfig } = require("../../config/dataBase");

function InsertNewRoomData(RoomName, Private, uuidRoom) {
  const connection = new mysql.createConnection(DataBaseConfig);

  return new Promise((resolve) => {
    connection.query(
      `INSERT INTO room (ID, Name, Private) VALUES ('${uuidRoom}', '${RoomName}', '${Private}');`,
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

module.exports = {
  InsertNewRoomData,
  InsertParticipantData,
};
