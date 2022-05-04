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

function InsertFolderUserRelationDataBase(folderId, userId, uuidRoom) {
  const connection = new mysql.createConnection(DataBaseConfig);
  if (uuidRoom === null) {
    return new Promise((resolve) => {
      connection.query(
        `INSERT INTO foldersusers (ID, folderIdResource, userIdBeneficiary, RoomIdBeneficiary) VALUES (NULL, '${folderId}', '${userId}', NULL)`,
        (err, result) => {
          if (err) {
            console.error(err);
            return resolve("FAILED");
          }
          return resolve(result);
        }
      );
      connection.end();
    });
  } else if (userId === null) {
    return new Promise((resolve) => {
      connection.query(
        `INSERT INTO foldersusers (ID, folderIdResource, userIdBeneficiary, RoomIdBeneficiary) VALUES (NULL, '${folderId}', NULL, '${uuidRoom}')`,
        (err, result) => {
          if (err) {
            console.error(err);
            return resolve("FAILED");
          }
          return resolve(result);
        }
      );
      connection.end();
    });
  } else if (userId !== null && uuidRoom !== null) {
    return new Promise((resolve) => {
      connection.query(
        `INSERT INTO foldersusers (ID, folderIdResource, userIdBeneficiary, RoomIdBeneficiary) VALUES (NULL, '${folderId}', '${userId}', '${uuidRoom}')`,
        (err, result) => {
          if (err) {
            console.error(err);
            return resolve("FAILED");
          }
          return resolve(result);
        }
      );
      connection.end();
    });
  }
}

//Get FolderDetails
function GetFolderDetails(folderId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM folders INNER JOIN foldersusers ON folders.folderId = foldersusers.folderIdResource WHERE folders.folderId = '${folderId}'`,
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

//Get SharedPrivateFolders
function GetSharedPrivateFolders(userId, parentId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `SELECT folders.folderId, folders.Name, folders.parentID, folders.userID, folders.createdTime, folders.path FROM folders INNER JOIN foldersusers ON folders.folderId = foldersusers.folderIdResource INNER JOIN iusers ON iusers.userId = foldersusers.userIdBeneficiary WHERE foldersusers.userIdBeneficiary = '${userId}' AND folders.parentID = '${parentId}' AND foldersusers.RoomIdBeneficiary IS NULL`,
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

//Get SharedGroupFolders
function GetSharedGroupFolders(userId, parentId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  if (parentId === null) {
    return new Promise((resolve) => {
      connection.query(
        `SELECT DISTINCT folders.folderId, folders.Name, folders.parentID, folders.userID, folders.createdTime, folders.path FROM iusers INNER JOIN participants ON iusers.userId = participants.UserID INNER JOIN foldersusers ON participants.RoomID = foldersusers.RoomIdBeneficiary INNER JOIN folders ON foldersusers.folderIdResource = folders.folderId WHERE folders.parentId = 'NULL' AND iusers.userId = '${userId}'`,
        (err, result) => {
          if (err) {
            return resolve("FAILED");
          }
          return resolve(result);
        }
      );
      connection.end();
    });
  } else {
    return new Promise((resolve) => {
      connection.query(
        `SELECT DISTINCT folders.folderId, folders.Name, folders.parentID, folders.userID, folders.createdTime, folders.path FROM iusers INNER JOIN participants ON iusers.userId = participants.UserID INNER JOIN foldersusers ON participants.RoomID = foldersusers.RoomIdBeneficiary INNER JOIN folders ON foldersusers.folderIdResource = folders.folderId WHERE folders.parentID = '${parentId}' AND iusers.userId = '${userId}'`,
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
}

//Delete Room Folder Relation
function DeleteFolderUserRelation(roomID) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve) => {
    connection.query(
      `DELETE FROM foldersusers WHERE RoomIdBeneficiary = '${roomID}'`,
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

// Delete Folder
function DeleteRoomFolderAndUserRelation(roomID) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE folders, foldersusers FROM folders INNER JOIN foldersusers ON folders.folderId=foldersusers.folderIdResource WHERE foldersusers.RoomIdBeneficiary = '${roomID}'`,
      (err, result) => {
        if (err) {
          return reject(result);
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
  InsertFolderUserRelationDataBase,
  GetSharedPrivateFolders,
  GetSharedGroupFolders,
  DeleteFolderUserRelation,
  DeleteRoomFolderAndUserRelation,
};
