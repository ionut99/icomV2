import {
  SELECT_FOLDER,
  UPDATE_FOLDER,
  SET_CHILD_FOLDERS,
  SET_CHILD_FILES,
  ADD_CHILD_FOLDER,
  ADD_CHILD_FILE,
} from "./actionTypes";

export const addChildFolder = (
  folderId,
  folderName,
  createdAt,
  parentId,
  path,
  userId
) => {
  return {
    type: ADD_CHILD_FOLDER,
    payload: {
      folderId,
      folderName,
      createdAt,
      parentId,
      path,
      userId,
    },
  };
};

export const selectFolder = (folderId, folder) => {
  return {
    type: SELECT_FOLDER,
    payload: {
      folderId,
      folder,
    },
  };
};

export const setChildFolderList = (folderList) => {
  return {
    type: SET_CHILD_FOLDERS,
    payload: {
      folderList,
    },
  };
};

export const setChildFileList = (fileList) => {
  return {
    type: SET_CHILD_FILES,
    payload: {
      fileList,
    },
  };
};

export const addChildFile = (
  fileId,
  fileName,
  createdAtFile,
  folderIdFile,
  type,
  userIdFile,
  sizeFile
) => {
  return {
    type: ADD_CHILD_FILE,
    payload: {
      fileId,
      fileName,
      createdAtFile,
      folderIdFile,
      type,
      userIdFile,
      sizeFile,
    },
  };
};

export const updateFolder = (newfolder) => {
  return {
    type: UPDATE_FOLDER,
    payload: {
      newfolder,
    },
  };
};
