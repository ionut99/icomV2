const { path } = require("express/lib/application");
const mysql = require("mysql");

const { DataBaseConfig } = require("../../config/dataBase");

function InsertNewFileDataBase(
  fileId,
  type,
  fileName,
  folderId,
  createdTime,
  userId,
  size
) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO file (fileId, type, fileName, folderId, createdTime, userId, size) VALUES ('${fileId}', '${type}', '${fileName}', '${folderId}', '${createdTime}', '${userId}', '${size}')`,
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

function InsertNewFileRelationDataBase(fileId, userId, roomId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO filesusers (ID, fileResourceId, userBeneficiaryId, roomBeneficiaryId) VALUES (NULL, '${fileId}', '${userId}', '${roomId}')`,
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

// all file that have relation with user in fileusers !!!
function GetSharedPrivateFiles(folderId, userId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT file.fileId, file.fileName, file.folderId, file.createdTime, file.userId, file.type, file.size FROM file INNER JOIN filesusers ON file.fileId = filesusers.fileResourceId WHERE file.folderId = '${folderId}' and filesusers.userBeneficiaryId = '${userId}'  AND filesusers.roomBeneficiaryId = 'NULL'`,
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

function GetSharedGroupFiles(folderId, userId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT DISTINCT file.fileId, file.fileName, file.folderId, file.createdTime, file.userId, file.type, file.size FROM file INNER JOIN filesusers ON file.fileId = filesusers.fileResourceId INNER JOIN participants ON filesusers.roomBeneficiaryId = participants.RoomID WHERE file.folderId = '${folderId}' AND participants.UserID = '${userId}'`,
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

function GetDocumentContentService(fileId, userId) {
  // if (fileId == null) {
  //   return "fileId IS NULL";
  // } else {
  //   return "Content de la document...";
  // }
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * from file`, (err, result) => {
      if (err) {
        return resolve("fileId IS NULL");
      }
      return resolve("Content de la document...");
    });
    connection.end();
  });
}

module.exports = {
  InsertNewFileDataBase,
  InsertNewFileRelationDataBase,
  GetSharedPrivateFiles,
  GetSharedGroupFiles,
  GetDocumentContentService,
};
