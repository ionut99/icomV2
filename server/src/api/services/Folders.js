const mysql = require("mysql");
var sqlPool = require("./sql.js");

function InsertNewFolderDataBase(
  folderId,
  name,
  parentId,
  userId,
  path,
  createdAt
) {
  let stringPath = JSON.stringify(path);

  let insertQuery =
    "INSERT INTO ?? (??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?)";
  let query = mysql.format(insertQuery, [
    "folders",
    "folderId",
    "name",
    "parentId",
    "userId",
    "path",
    "createdTime",
    folderId,
    name,
    parentId,
    userId,
    stringPath,
    createdAt,
  ]);
  //
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

// TO DO: verify system logic, re write queryes
function InsertFolderUserRelationDataBase(folderId, userId, uuidRoom) {
  if (uuidRoom === null) {
    return new Promise((resolve) => {
      sqlPool.pool.query(
        `INSERT INTO foldersusers (ID, folderIdResource, userIdBeneficiary, roomIdBeneficiary) VALUES (NULL, '${folderId}', '${userId}', NULL)`,
        (err, result) => {
          if (err) {
            console.error(err);
            return resolve("FAILED");
          }
          return resolve(result);
        }
      );
    });
  } else if (userId === null) {
    return new Promise((resolve) => {
      sqlPool.pool.query(
        `INSERT INTO foldersusers (ID, folderIdResource, userIdBeneficiary, roomIdBeneficiary) VALUES (NULL, '${folderId}', NULL, '${uuidRoom}')`,
        (err, result) => {
          if (err) {
            console.error(err);
            return resolve("FAILED");
          }
          return resolve(result);
        }
      );
    });
  } else if (userId !== null && uuidRoom !== null) {
    return new Promise((resolve) => {
      sqlPool.pool.query(
        `INSERT INTO foldersusers (ID, folderIdResource, userIdBeneficiary, roomIdBeneficiary) VALUES (NULL, '${folderId}', '${userId}', '${uuidRoom}')`,
        (err, result) => {
          if (err) {
            console.error(err);
            return resolve("FAILED");
          }
          return resolve(result);
        }
      );
    });
  }
}

function GetFolderDetailsService(folderId) {
  let selectQuery = "SELECT * FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ?";
  let query = mysql.format(selectQuery, [
    "folders",
    "foldersusers",
    "folders.folderId",
    "foldersusers.folderIdResource",
    "folders.folderId",
    folderId,
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

function GetSharedPrivateFolders(userId, parentId) {
  let selectQuery =
    "SELECT ??, ??, ??, ??, ??, ?? FROM ?? INNER JOIN ?? ON ?? = ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ? AND ?? = ? AND ?? IS NULL";
  let query = mysql.format(selectQuery, [
    "folders.folderId",
    "folders.name",
    "folders.parentId",
    "folders.userId",
    "folders.createdTime",
    "folders.path",
    "folders",
    "foldersusers",
    "folders.folderId",
    "foldersusers.folderIdResource",
    "iusers",
    "iusers.userId",
    "foldersusers.userIdBeneficiary",
    "foldersusers.userIdBeneficiary",
    userId,
    "folders.parentId",
    parentId,
    "foldersusers.RoomIdBeneficiary",
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

function GetSharedGroupFolders(userId, parentId) {
  let selectQuery =
    "SELECT DISTINCT ??, ??, ??, ??, ??, ?? FROM ?? INNER JOIN ?? ON ?? = ?? INNER JOIN ?? ON ?? = ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ? AND ?? = ?";
  let query = mysql.format(selectQuery, [
    "folders.folderId",
    "folders.name",
    "folders.parentId",
    "folders.userId",
    "folders.createdTime",
    "folders.path",
    "iusers",
    "participants",
    "iusers.userId",
    "participants.userId",
    "foldersusers",
    "participants.roomId",
    "foldersusers.roomIdBeneficiary",
    "folders",
    "foldersusers.folderIdResource",
    "folders.folderId",
    "folders.parentId",
    parentId,
    "iusers.userId",
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

function DeleteFolderUserRelation(roomID) {
  let deleteQuery = "DELETE FROM ?? WHERE ?? = ?";
  let query = mysql.format(deleteQuery, [
    "foldersusers",
    "roomIdBeneficiary",
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

function DeleteRoomFolderAndUserRelation(roomId) {
  let deleteQuery =
    "DELETE ??, ?? FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ?";
  let query = mysql.format(deleteQuery, [
    "folders",
    "foldersusers",
    "folders",
    "foldersusers",
    "folders.folderId",
    "foldersusers.folderIdResource",
    "foldersusers.roomIdBeneficiary",
    roomId,
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

module.exports = {
  InsertNewFolderDataBase,
  GetFolderDetailsService,
  InsertFolderUserRelationDataBase,
  GetSharedPrivateFolders,
  GetSharedGroupFolders,
  DeleteFolderUserRelation,
  DeleteRoomFolderAndUserRelation,
};
