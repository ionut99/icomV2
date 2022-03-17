import {
  USER_UPDATE_CHAT,
  USER_SET_SEARCH_BOX_CONTENT,
  USER_SET_PERSON_SEARCH_LIST,
  USER_SET_ROOM_LIST,
  USER_RESET_ROOM_LIST,
  USER_ADD_NEW_MESSAGE,
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
