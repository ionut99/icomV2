const { path } = require("express/lib/application");
const mysql = require("mysql");

const { DataBaseConfig } = require("../../config/dataBase");

function InsertNewFolderDataBase(
  folderID,
  name,
  parentId,
  userId,
  path,
  createdAt
) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `INSERT INTO folders (folderID, Name, parentID, userID, path, createdTime) VALUES ('${folderID}', '${name}', '${parentId}', '${userId}', '${path}', '${createdAt}')`,
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

//Get FolderDetails
function GetFolderDetails(folderId, userId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM folders WHERE folderID = '${folderId}' AND userID = '${userId}'`,
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
  InsertNewFolderDataBase,
  GetFolderDetails,
};
