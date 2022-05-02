// return messages from a room
var uui = require("uuid");

const { handleResponse } = require("../helpers/utils");

const {
  InsertFolderUserRelationDataBase,
  InsertNewFolderDataBase,
  GetFolderDetails,
  GetChildFolderListService,
  GetSharedFolders,
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

  result = await InsertFolderUserRelationDataBase(folderId, userId);
  if (result === "FAILED") {
    console.log("Error storage folder configuration!");
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  return handleResponse(req, res, 200, "Add New Private User Folder Succed");
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

  // console.log(folderObject);

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
  if (parentId === undefined || userId === undefined) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  //lista cu toate folderele curente ale utilizatorului
  var userFolderList = await GetChildFolderListService(parentId, userId);

  //console.log(userFolderList);
  if (userFolderList === "FAILED") {
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  // lista cu folderele share-uite de alti utilizatori cu utilizatorul curent
  if (parentId == null) {
    // aici returnam lista..
    var sharedFoldersList = await GetSharedFolders(userId);

    if (sharedFoldersList === "FAILED") {
      return handleResponse(req, res, 412, " DataBase Error ");
    }

    sharedFoldersList.map((x) => {
      const sharedFolder = { ...x };
      sharedFolder.parentID = null;
      sharedFolder.path = "[]";
      userFolderList.push(sharedFolder);
    });
  }

  // aici se va returna lista finala a folderelor
  // console.log(userFolderList);
  return handleResponse(req, res, 200, { userFolderList });
}

module.exports = {
  AddNewFolder,
  GetFolderDataBase,
  GetChildFolderList,
};
