const { path } = require("express/lib/application");
const mysql = require("mysql");
const { NULL } = require("mysql/lib/protocol/constants/types");

const { DataBaseConfig } = require("../../config/dataBase");

function InsertNewFileDataBase(
  fileId,
  type,
  fileName,
  folderId,
  createdTime,
  userId,
  size,
  systemPath
) {
  const connection = new mysql.createConnection(DataBaseConfig);
  const fileId_escaped = mysql.escape(fileId);
  const type_escaped = mysql.escape(type);
  const fileName_escaped = mysql.escape(fileName);
  const folderId_escaped = mysql.escape(folderId);
  const createdTime_escaped = mysql.escape(createdTime);
  const userId_escaped = mysql.escape(userId);
  const size_escaped = mysql.escape(size);
  const systemPath_escaped = mysql.escape(systemPath);

  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO file (fileId, type, fileName, folderId, createdTime, userId, size, systemPath) VALUES (${fileId_escaped}, ${type_escaped}, ${fileName_escaped}, ${folderId_escaped}, ${createdTime_escaped}, ${userId_escaped}, ${size_escaped}, ${systemPath_escaped})`,
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

function GetFileDetailsFromDataBase(fileId, userId) {
  const connection = new mysql.createConnection(DataBaseConfig);
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM file WHERE file.fileId = '${fileId}'`,
      // to verify if user have acces at that file
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
  InsertNewFileDataBase,
  InsertNewFileRelationDataBase,
  GetSharedPrivateFiles,
  GetSharedGroupFiles,
  GetDocumentContentService,
  GetFileDetailsFromDataBase,
};
