// return messages from a room
var uui = require("uuid");

const { handleResponse } = require("../helpers/utils");

const {
  InsertNewFolderDataBase,
  GetFolderDetails,
  GetChildFolderListService,
} = require("../services/Folders");

async function AddNewFolder(req, res) {
  const name = req.body.name;
  const parentId = req.body.parentId;
  const userId = req.body.userId;
  const path = req.body.path;
  const createdAt = req.body.createdAt;

  // TO DO: - verify req param to be different from null/undefined

  //   console.log("Se va introduce un nou folder:");
  //   console.log(name);
  //   console.log(parentId);
  //   console.log(userId);
  //   console.log(path);
  //   console.log(createdAt);

  const folderId = uui.v4();

  var result = await InsertNewFolderDataBase(
    folderId,
    name,
    parentId,
    userId,
    path,
    createdAt
  );
  if (result === "FAILED") {
    console.log("Error storage folder configuration!");
    return handleResponse(req, res, 412, " DataBase Error ");
  }
}

// Get Folder
async function GetFolderDataBase(req, res) {
  const folderId = req.body.folderId;
  const userId = req.body.userId;

  //   console.log("cautam folderul cu caracteristicile:");
  //   console.log(folderId);
  //   console.log(userId);

  // verificare parametrii

  var folderObject = await GetFolderDetails(folderId, userId);

  console.log(folderObject);

  if (folderObject === "FAILED") {
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  return handleResponse(req, res, 200, { folderObject });

  //   var messageRoomList = await GetRoomMessagesData(roomID);
  //   return handleResponse(req, res, 200, { messageRoomList });
}

// Get Child Folder List
async function GetChildFolderList(req, res) {
  const parentId = req.body.parentId;
  const userId = req.body.userId;

  // verificare parametrii

  var folderList = await GetChildFolderListService(parentId, userId);

  if (folderList === "FAILED") {
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  return handleResponse(req, res, 200, { folderList });
}

module.exports = {
  AddNewFolder,
  GetFolderDataBase,
  GetChildFolderList,
};
