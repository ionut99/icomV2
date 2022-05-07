const { path } = require("express/lib/application");
const mysql = require("mysql");

const { DataBaseConfig } = require("../../config/dataBase");

function InsertNewFileDataBase(
  fileId,
  fileName,
  folderId,
  createdTime,
  userId
) {
  const connection = new mysql.createConnection(DataBaseConfig);
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
      `SELECT file.fileId, file.fileName, file.folderId, file.createdTime, file.userId FROM file INNER JOIN filesusers ON file.fileId = filesusers.fileResourceId WHERE file.folderId = '${folderId}' and filesusers.userBeneficiaryId = '${userId}'`,
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
};
