// return messages from a room
const { NULL } = require("mysql/lib/protocol/constants/types");
var uui = require("uuid");

const { handleResponse } = require("../helpers/utils");

const {
  InsertFolderUserRelationDataBase,
  InsertNewFolderDataBase,
  GetFolderDetails,
  GetSharedPrivateFolders,
  GetSharedGroupFolders,
} = require("../services/Folders");

const { GetUserByID } = require("../services/Auth");

async function AddNewFolder(req, res) {
  const name = req.body.name;
  const parentId = req.body.parentId;
  const userId = req.body.userId;
  const path = req.body.path;
  const createdAt = new Date();

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
    } else {
      result = await InsertFolderUserRelationDataBase(folderId, userId, null);
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

  var userDetails = await GetUserByID(userId);
  var userName = userDetails[0].Surname + " " + userDetails[0].Name;

  if (parentId === undefined || userId === undefined) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  var userFolderList = [];

  var sharedGroupFoldersList = await GetSharedGroupFolders(userId, parentId);
  if (sharedGroupFoldersList === "FAILED") {
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  sharedGroupFoldersList.map((x) => {
    const sharedGroupFolder = { ...x };

    sharedGroupFolder.Name = sharedGroupFolder.Name.replace(userName, "");
    sharedGroupFolder.Name = sharedGroupFolder.Name.replace("#", "");

    userFolderList.push(sharedGroupFolder);
  });

  // private folders
  var userPrivateFolderList = await GetSharedPrivateFolders(userId, parentId);
  if (userPrivateFolderList === "FAILED") {
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  userPrivateFolderList.map((x) => {
    const sharedFolder = { ...x };
    userFolderList.push(sharedFolder);
  });

  return handleResponse(req, res, 200, { userFolderList });
}

module.exports = {
  AddNewFolder,
  GetFolderDataBase,
  GetChildFolderList,
};
