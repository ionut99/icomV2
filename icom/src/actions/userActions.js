import {
  USER_UPDATE_CHAT,
  USER_MESSAGES_LIST_CHAT,
  USER_SET_SEARCH_BOX_CONTENT,
  USER_SET_PERSON_SEARCH_LIST,
  USER_SET_ROOM_LIST,
  USER_RESET_ROOM_LIST,
  USER_ADD_NEW_MESSAGE,
  UPDATE_FILE_DELTA,
  UPDATE_ADD_USER_IN_GROUP,
  UPDATE_DOCUMENT_DATA,
  SELECT_FOLDER,
  UPDATE_FOLDER,
  SET_CHILD_FOLDERS,
  SET_CHILD_FILES,
  ADD_CHILD_FOLDER,
  ADD_CHILD_FILE,
  UPDATE_LAST_MESSAGE,
} from "./actionTypes";

//file system

export const addChildFolder = (
  folderID,
  folderName,
  createdAt,
  parentID,
  path,
  userID
) => {
  return {
    type: ADD_CHILD_FOLDER,
    payload: {
      folderID,
      folderName,
      createdAt,
      parentID,
      path,
      userID,
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

export const selectFolder = (folderId, folder) => {
  return {
    type: SELECT_FOLDER,
    payload: {
      folderId,
      folder,
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

// finish file system part

export const updateCurrentChannel = (
  channelID,
  currentChannelName,
  channelFolderId
) => {
  return {
    type: USER_UPDATE_CHAT,
    payload: {
      channelID,
      currentChannelName,
      channelFolderId,
    },
  };
};

export const updateMessageChannelList = (RoomMessages, position) => {
  return {
    type: USER_MESSAGES_LIST_CHAT,
    payload: {
      RoomMessages,
      position,
    },
  };
};

export const setUserSearchBoxContent = (search_box_content) => {
  return {
    type: USER_SET_SEARCH_BOX_CONTENT,
    payload: {
      search_box_content,
    },
  };
};

export const setPersonSearchList = (userSearchList) => {
  return {
    type: USER_SET_PERSON_SEARCH_LIST,
    payload: {
      userSearchList,
    },
  };
};

export const setRoomList = (RoomSearchList) => {
  return {
    type: USER_SET_ROOM_LIST,
    payload: {
      RoomSearchList,
    },
  };
};

export const resetRoomList = () => {
  return {
    type: USER_RESET_ROOM_LIST,
    payload: {},
  };
};

export const InsertNewMessageLocal = (message) => {
  return {
    type: USER_ADD_NEW_MESSAGE,
    payload: {
      ID_message: message.ID_message,
      RoomID: message.roomID,
      senderID: message.senderID,
      senderName: message.senderName,
      Body: message.messageBody,
      type: message.type,
      fileId: message.fileId,
      createdTime: message.createdTime,
    },
  };
};

export const UpdateLastMessage = (LastMessage, ID) => {
  return {
    type: UPDATE_LAST_MESSAGE,
    payload: { LastMessage, ID },
  };
};

// file DELTA document update
export const UpdateDeltaFile = (delta, senderID) => {
  return {
    type: UPDATE_FILE_DELTA,
    payload: { delta, senderID },
  };
};

export const UpdateAddUserInGroup = (addUserInGroup) => {
  return {
    type: UPDATE_ADD_USER_IN_GROUP,
    payload: { addUserInGroup },
  };
};

// file DATA document update -- LOADING...
export const GetFileDocument = (documentData) => {
  return {
    type: UPDATE_DOCUMENT_DATA,
    payload: { documentData },
  };
};
