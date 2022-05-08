import {
  SELECT_FOLDER,
  UPDATE_FOLDER,
  SET_CHILD_FOLDERS,
  ADD_CHILD_FOLDER,
  SET_CHILD_FILES,
  ADD_CHILD_FILE,
} from "../actions/actionTypes";

export const ROOT_FOLDER = { Name: "My Drive", folderId: "root", path: [] };

const SystemState = {
  folderId: "root",
  folder: ROOT_FOLDER,
  childFolders: [],
  childFiles: [],
};

const folderRedu = (state = SystemState, action) => {
  switch (action.type) {
    case SELECT_FOLDER:
      const { folderId, folder } = action.payload;
      return {
        ...state,
        folderId,
        folder,
      };

    case UPDATE_FOLDER:
      const { newfolder } = action.payload;
      return {
        ...state,
        folder: newfolder,
      };

    case SET_CHILD_FOLDERS:
      const { folderList } = action.payload;
      return {
        ...state,
        childFolders: folderList,
      };

    case SET_CHILD_FILES:
      const { fileList } = action.payload;
      return {
        ...state,
        childFiles: fileList,
      };
    case ADD_CHILD_FOLDER:
      const { folderID, folderName, createdAt, parentID, path, userID } =
        action.payload;
      return {
        ...state,
        childFolders: [
          ...state.childFolders,
          {
            Name: folderName,
            createdTime: createdAt,
            folderId: folderID,
            parentID: parentID,
            path: path,
            userID: userID,
          },
        ],
      };
    case ADD_CHILD_FILE:
      const {
        fileId,
        fileName,
        createdAtFile,
        folderIdFile,
        type,
        userIdFile,
        sizeFile,
      } = action.payload;
      return {
        ...state,
        childFiles: [
          ...state.childFiles,
          {
            createdTime: createdAtFile,
            fileId: fileId,
            fileName: fileName,
            folderId: folderIdFile,
            size: sizeFile,
            type: type,
            userId: userIdFile,
          },
        ],
      };
    default:
      return state;
  }
};

export default folderRedu;
