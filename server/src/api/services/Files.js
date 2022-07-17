const mysql = require("mysql");
var sqlPool = require("./sql.js");

function InsertNewFileDataBase(
  fileId,
  type,
  fileName,
  folderId,
  createdTime,
  userId,
  size,
  systemPath,
  IV
) {
  let insertQuery =
    "INSERT INTO ?? (??,??,??,??,??,??,??,??, ??) VALUES (?,?,?,?,?,?,?,?, ?)";
  let query = mysql.format(insertQuery, [
    "file",
    "fileId",
    "type",
    "fileName",
    "folderId",
    "createdTime",
    "userId",
    "size",
    "systemPath",
    "IV",
    fileId,
    type,
    fileName,
    folderId,
    createdTime,
    userId,
    size,
    systemPath,
    IV,
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

function InsertNewFileRelationDataBase(fileId, userId, roomId) {
  let insertQuery = "INSERT INTO ?? (ID,??,??,??) VALUES (NULL,?,?,?)";
  let query = mysql.format(insertQuery, [
    "filesusers",
    "fileResourceId",
    "userBeneficiaryId",
    "roomBeneficiaryId",
    fileId,
    userId,
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

// all file that have relation with user in fileusers !!!
function GetSharedPrivateFiles(folderId, userId) {
  let selectQuery =
    "SELECT ??, ??, ??, ??, ??, ??, ?? FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ? and ?? = ?  AND ?? IS NULL";
  let query = mysql.format(selectQuery, [
    "file.fileId",
    "file.fileName",
    "file.folderId",
    "file.createdTime",
    "file.userId",
    "file.type",
    "file.size",
    "file",
    "filesusers",
    "file.fileId",
    "filesusers.fileResourceId",
    "file.folderId",
    folderId,
    "filesusers.userBeneficiaryId",
    userId,
    "filesusers.roomBeneficiaryId",
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

function GetSharedGroupFiles(folderId, userId) {
  let selectQuery =
    "SELECT DISTINCT ??, ??, ??, ??, ??, ??, ?? FROM ?? INNER JOIN ?? ON ?? = ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ? AND ?? = ?";
  let query = mysql.format(selectQuery, [
    "file.fileId",
    "file.fileName",
    "file.folderId",
    "file.createdTime",
    "file.userId",
    "file.type",
    "file.size",
    "file",
    "filesusers",
    "file.fileId",
    "filesusers.fileResourceId",
    "participants",
    "filesusers.roomBeneficiaryId",
    "participants.roomId",
    "file.folderId",
    folderId,
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

function GetFileDetailsFromDataBase(fileId, userId) {
  let selectQuery = "SELECT * FROM ?? WHERE ?? = ?";
  let query = mysql.format(selectQuery, ["file", "file.fileId", fileId]);
  return new Promise((resolve, reject) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

//
function VerifyIfExist(fileName, fileId, folderId, userId) {
  //
  let selectQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ? AND ?? != ?";
  let query = "";
  if (folderId === "root") {
    query = mysql.format(selectQuery, [
      "file",
      "file.fileName",
      fileName,
      "file.userId",
      userId,
      "file.fileId",
      fileId,
    ]);
  } else {
    query = mysql.format(selectQuery, [
      "file",
      "file.fileName",
      fileName,
      "file.folderId",
      folderId,
      "file.fileId",
      fileId,
    ]);
  }

  return new Promise((resolve, reject) => {
    sqlPool.pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

function UpdateFileDetails(fileId, fileName, userId, fileSize, createdTime) {
  let updateQuery = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
  let query = mysql.format(updateQuery, [
    "file",
    "fileName",
    fileName,
    "userId",
    userId,
    "size",
    fileSize,
    "createdTime",
    createdTime,
    "file.fileId",
    fileId,
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
  InsertNewFileDataBase,
  InsertNewFileRelationDataBase,
  GetSharedPrivateFiles,
  GetSharedGroupFiles,
  GetFileDetailsFromDataBase,
  VerifyIfExist,
  UpdateFileDetails,
};
