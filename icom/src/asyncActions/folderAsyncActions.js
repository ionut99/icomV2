import { AddNewFolderInDataBase, getFolderByID } from "../services/folder";

// handle add new folder in system
export const AddNewFolder =
  (name, parentId, userId, path) => async (dispatch) => {
    const varVerify = await AddNewFolderInDataBase(
      name,
      parentId,
      userId,
      path
    );
    // TO DO - display message
    //console.log(varVerify);
  };

// handle search folder
export const GetFolder = (folderId, userId) => async (dispatch) => {
  const folderObject = await getFolderByID(folderId, userId);

  console.log("Rezultatul intors la cautarea folderului este: ");
  console.log(folderObject);

  return folderObject;
};
