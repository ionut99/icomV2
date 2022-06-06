import { addChildFolder } from "../actions/folderActions";

import {
  AddNewFolderInDataBase,
  getChildFolders,
  getFolderByID,
} from "../services/folder";

import {
  setChildFolderList,
  setChildFileList,
  updateFolder,
} from "./../actions/folderActions";

import { getFileList } from "../services/file";

import { ROOT_FOLDER } from "../reducers/folderReducer";

// handle add new folder in system
export const AddNewFolder =
  (name, parentId, userId, path) => async (dispatch) => {
    const res_addFolder = await AddNewFolderInDataBase(
      name,
      parentId,
      userId,
      path
    );
    // if folder addded with succes then add it to folderList
    if (res_addFolder.status === 200) {
      dispatch(
        addChildFolder(
          res_addFolder.data["folderId"],
          name,
          res_addFolder.data["createdTime"],
          parentId,
          path,
          userId
        )
      );
    }
    // console.log(res_addFolder.data["AddNewFolder"]);
    // de adaugat noul folder in lista
  };

// // handle search folder
// export const GetFolder = (folderId, userId) => async (dispatch) => {
//   const folderObject = await getFolderByID(folderId, userId);

//   // console.log("Rezultatul intors la cautarea folderului este: ");
//   // console.log(folderObject);

//   return folderObject;
// };

//
export const userGetFolderDetails = (folderId, userId) => async (dispatch) => {
  if (
    folderId === "root" ||
    folderId === null ||
    folderId === undefined ||
    userId === null ||
    userId === undefined
  ) {
    return dispatch(updateFolder(ROOT_FOLDER));
  }

  const result = await getFolderByID(folderId, userId);

  if (result.data !== undefined) {
    const formattedDoc = {
      Name: result.data["folderObject"][0].Name,
      createdTime: result.data["folderObject"][0].createdTime,
      folderId: result.data["folderObject"][0].folderId,
      parentID: result.data["folderObject"][0].parentID,
      path: JSON.parse(result.data["folderObject"][0].path),
      userID: result.data["folderObject"][0].userID,
    };

    dispatch(updateFolder(formattedDoc));
  }
};

//
export const userSetFolderList = (folderId, userId) => async (dispatch) => {
  if (
    folderId === null ||
    folderId === undefined ||
    userId === null ||
    userId === undefined
  ) {
    return dispatch(updateFolder(ROOT_FOLDER));
  }

  const result = await getChildFolders(folderId, userId);

  const orderList = result.data["userFolderList"].sort(function (a, b) {
    return new Date(b.createdTime) - new Date(a.createdTime);
  });

  dispatch(setChildFolderList(orderList));
};

///
export const userSetFileList = (folderId, userId) => async (dispatch) => {
  if (
    folderId === null ||
    folderId === undefined ||
    userId === null ||
    userId === undefined
  ) {
    return dispatch(updateFolder(ROOT_FOLDER));
  }

  const result = await getFileList(folderId, userId);

  const orderList = result.data["userFileList"].sort(function (a, b) {
    return new Date(b.createdTime) - new Date(a.createdTime);
  });

  dispatch(setChildFileList(orderList));
};
