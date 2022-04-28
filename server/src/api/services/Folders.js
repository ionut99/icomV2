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
  console.log("Path ul pentru insert este (JSON format): ");
  let stringPath = JSON.stringify(path);
  console.log(stringPath);
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

function InsertFolderUserRelationDataBase(folderId, userId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO foldersusers (ID, folderIdResource, userIdBeneficiary) VALUES (NULL, '${folderId}', '${userId}')`,
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

//Get FolderDetails
function GetFolderDetails(folderId, userId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM folders WHERE folderId = '${folderId}'`,
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

//Get ChildFolders
function GetChildFolderListService(parentId, userId) {
  console.log(parentId);
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM folders WHERE parentID = '${parentId}' AND userID = '${userId}'`,
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

//Get SharedFolders
function GetSharedFolders(userId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `SELECT folders.folderId, folders.Name, folders.parentID, folders.userID, folders.createdTime, folders.path FROM folders INNER JOIN foldersusers ON folders.folderId = foldersusers.folderIdResource WHERE folders.userID != foldersusers.userIdBeneficiary AND foldersusers.userIdBeneficiary = '${userId}'`,
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
  GetChildFolderListService,
  InsertFolderUserRelationDataBase,
  GetSharedFolders,
};
