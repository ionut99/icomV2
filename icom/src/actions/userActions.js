import {
  USER_UPDATE_CHAT,
  USER_SET_SEARCH_BOX_CONTENT,
  USER_SET_PERSON_SEARCH_LIST,
  USER_SET_ROOM_LIST,
  USER_RESET_ROOM_LIST,
  USER_ADD_NEW_MESSAGE,
  UPDATE_FILE_DELTA,
  UPDATE_ADD_USER_IN_GROUP,
  UPDATE_DOCUMENT_DATA
} from "./actionTypes";

export const updateCurrentChannel = (
  channelID,
  currentChannelName,
  RoomMessages
) => {
  return {
    type: USER_UPDATE_CHAT,
    payload: {
      channelID,
      currentChannelName,
      RoomMessages,
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

export const InsertNewMessageLocal = (ID_message, RoomID, senderID, Body) => {
  return {
    type: USER_ADD_NEW_MESSAGE,
    payload: { ID_message, RoomID, senderID, Body },
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
