// return messages from a room
const { NULL } = require("mysql/lib/protocol/constants/types");
var uui = require("uuid");

const { handleResponse } = require("../helpers/utils");

const {
  InsertFolderUserRelationDataBase,
  InsertNewFolderDataBase,
  GetFolderDetails,
  GetChildFolderListService,
  GetSharedPrivateFolders,
  GetSharedGroupFolders,
} = require("../services/Folders");

async function AddNewFolder(req, res) {
  const name = req.body.name;
  const parentId = req.body.parentId;
  const userId = req.body.userId;
  const path = req.body.path;
  const createdAt = new Date();

  //   console.log("Se va introduce un nou folder:");
  //   console.log(name);
  //   console.log(parentId);
  //   console.log(userId);
  // console.log(typeof path);
  // console.log(path.length);

  if (name === undefined || userId === undefined)
    return handleResponse(req, res, 410, "Invalid Request Parameters ");

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

  // de adaugat si roomId pentru folderele care sunt create la comun
  // adica verificam parentId
  if (parentId !== null && typeof path === "object" && path.length > 0) {
    const parentFolder = await GetFolderDetails(parentId);
    if (parentFolder === "FAILED") {
      console.log("Error get details about folder!");
      return handleResponse(req, res, 412, " DataBase Error ");
    }

    console.log(parentFolder[0].userIdBeneficiary);
    console.log(parentFolder[0].RoomIdBeneficiary);
    if (parentFolder[0].RoomIdBeneficiary !== null) {
      console.log("inseram");
      result = await InsertFolderUserRelationDataBase(
        folderId,
        userId,
        parentFolder[0].RoomIdBeneficiary
      );
      if (result === "FAILED") {
        console.log("Error storage folder configuration!");
        return handleResponse(req, res, 412, " DataBase Error ");
      }
    }
  } else {
    result = await InsertFolderUserRelationDataBase(folderId, userId, null);
    if (result === "FAILED") {
      console.log("Error storage folder configuration!");
      return handleResponse(req, res, 412, " DataBase Error ");
    }
  }

  return handleResponse(req, res, 200, "Add New Private User Folder Succed");
}

// Get Folder
async function GetFolderDataBase(req, res) {
  const folderId = req.body.folderId;
  const userId = req.body.userId;

  if (folderId === undefined || userId === undefined)
    return handleResponse(req, res, 410, "Invalid Request Parameters ");

  var folderObject = await GetFolderDetails(folderId);

  if (folderObject === "FAILED") {
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  return handleResponse(req, res, 200, { folderObject });
}

// Get Child Folder List
async function GetChildFolderList(req, res) {
  const parentId = req.body.parentId;
  const userId = req.body.userId;

  // verificare parametrii
  if (parentId === undefined || userId === undefined) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  var userFolderList = [];

  //lista cu toate folderele curente ale utilizatorului
  var userFolderList = await GetChildFolderListService(parentId, userId);
  //console.log(userFolderList);
  if (userFolderList === "FAILED") {
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  var sharedGroupFoldersList = await GetSharedGroupFolders(userId, parentId);
  console.log(sharedGroupFoldersList);
  if (sharedGroupFoldersList === "FAILED") {
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  sharedGroupFoldersList.map((x) => {
    const sharedGroupFolder = { ...x };
    // sharedFolder.parentID = null;
    // sharedFolder.path = "[]";
    if (userFolderList.indexOf(sharedGroupFolder) === -1) {
      userFolderList.push(sharedGroupFolder);
      //console.log(sharedGroupFolder);
    }
  });
  
  // var sharedPrivateFoldersList = await GetSharedPrivateFolders(userId);

  // //console.log(sharedPrivateFoldersList);
  // if (sharedPrivateFoldersList === "FAILED") {
  //   return handleResponse(req, res, 412, " DataBase Error ");
  // }

  // sharedPrivateFoldersList.map((x) => {
  //   const sharedFolder = { ...x };
  //   sharedFolder.parentID = null;
  //   sharedFolder.path = "[]";
  //   //userFolderList.push(sharedFolder);
  // });

  return handleResponse(req, res, 200, { userFolderList });
}

module.exports = {
  AddNewFolder,
  GetFolderDataBase,
  GetChildFolderList,
};
