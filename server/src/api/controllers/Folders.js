var uui = require("uuid");

const { handleResponse } = require("../helpers/utils");

const {
  InsertFolderUserRelationDataBase,
  InsertNewFolderDataBase,
  GetFolderDetailsService,
  GetSharedPrivateFolders,
  GetSharedGroupFolders,
} = require("../services/Folders");

const {
  GetSharedPrivateFiles,
  GetSharedGroupFiles,
} = require("../services/Files");

const { GetUserByID } = require("../services/Auth");

async function AddNewFolder(req, res) {
  try {
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
    if (parentId !== "root" && typeof path === "object" && path.length > 0) {
      const parentFolder = await GetFolderDetailsService(parentId);
      if (parentFolder === "FAILED") {
        console.log("Error get details about folder!");
        return handleResponse(req, res, 412, " DataBase Error ");
      }

      if (parentFolder[0].RoomIdBeneficiary !== null) {
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

    return handleResponse(req, res, 200, {
      AddNewFolder: "SUCCESS",
      folderId: folderId,
      createdTime: createdAt,
    });
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 412, {
      AddNewFolder: "FAILED",
      folderId: null,
      createdTime: null,
    });
  }
}

// Get Folder
async function GetFolderDetails(req, res) {
  try {
    const folderId = req.body.folderId;
    const userId = req.body.userId;

    if (folderId === undefined || userId === undefined)
      return handleResponse(req, res, 410, "Invalid Request Parameters ");

    var folderObject = await GetFolderDetailsService(folderId)
      .then(function (result) {
        if (result.length > 0) return result[0];
        else return undefined;
      })
      .catch((err) => {
        throw err;
      });

    if (folderObject === undefined) {
      return handleResponse(req, res, 412, " GET Folder Details Error ");
    }

    return handleResponse(req, res, 200, { folderObject });
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 412, " Failed to get folder details! ");
  }
}

// Get Child Folder List
async function GetChildFolderList(req, res) {
  try {
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

      sharedGroupFolder.name = sharedGroupFolder.name.replace(userName, "");
      sharedGroupFolder.name = sharedGroupFolder.name.replace("#", "");

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
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 412, " Failed to fetch child folder list ");
  }
}

// Get Child Folder List
async function GetChildFilesList(req, res) {
  try {
    const folderId = req.body.folderId;
    const userId = req.body.userId;

    var userFileList = [];

    // group files

    var sharedGroupFileList = await GetSharedGroupFiles(folderId, userId);
    if (sharedGroupFileList === "FAILED") {
      return handleResponse(req, res, 412, " DataBase Error ");
    }

    sharedGroupFileList.map((x) => {
      const sharedGroupFile = { ...x };

      userFileList.push(sharedGroupFile);
    });

    // private files
    var userPrivateFileList = await GetSharedPrivateFiles(folderId, userId);
    if (userPrivateFileList === "FAILED") {
      return handleResponse(req, res, 412, " DataBase Error ");
    }

    userPrivateFileList.map((x) => {
      const file = { ...x };
      userFileList.push(file);
    });

    return handleResponse(req, res, 200, { userFileList });
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 412, " Failed to fetch child file list! ");
  }
}

module.exports = {
  AddNewFolder,
  GetFolderDetails,
  GetChildFolderList,
  GetChildFilesList,
};
