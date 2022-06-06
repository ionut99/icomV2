import { AddNewFolderInDataBase, getFolderByID } from "../services/folder";
import { addChildFolder } from "../actions/folderActions";

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

// handle search folder
export const GetFolder = (folderId, userId) => async (dispatch) => {
  const folderObject = await getFolderByID(folderId, userId);

  // console.log("Rezultatul intors la cautarea folderului este: ");
  // console.log(folderObject);

  return folderObject;
};
