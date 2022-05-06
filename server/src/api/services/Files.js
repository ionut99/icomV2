const { path } = require("express/lib/application");
const mysql = require("mysql");

const { DataBaseConfig } = require("../../config/dataBase");

function InsertNewFolderDataBase(
  folderId,
  name,
  parentId,
  userId,
  path,
  createdAt
) {
  let stringPath = JSON.stringify(path);
  // console.log("Path ul pentru insert este (JSON format): ");
  // console.log(stringPath);
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO folders (folderId, Name, parentID, userID, path, createdTime) VALUES ('${folderId}', '${name}', '${parentId}', '${userId}', '${stringPath}', '${createdAt}')`,
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

function InsertNewFileDataBase(
  fileId,
  fileName,
  folderId,
  createdTime,
  userId
) {
  const connection = new mysql.createConnection(DataBaseConfig);
  if (folderId === null) {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO file (fileId, fIleName, folderId, createdTime, userId) VALUES ('${fileId}', '${fileName}', NULL, '${createdTime}', '${userId}')`,
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve(result);
        }
      );
      connection.end();
    });
  } else {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO file (fileId, fIleName, folderId, createdTime, userId) VALUES ('${fileId}', '${fileName}', '${folderId}', '${createdTime}', '${userId}')`,
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
}

module.exports = {
  InsertNewFileDataBase,
};
