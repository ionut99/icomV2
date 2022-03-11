import {
  USER_UPDATE_CHAT,
  USER_SET_SEARCH_BOX_CONTENT,
  USER_RESET_SEARCH_BOX_CONTENT,
  USER_SET_PERSON_SEARCH_LIST,
  USER_RESET_PERSON_SEARCH_LIST,
  USER_SET_ROOM_LIST,
  USER_RESET_ROOM_LIST,
  USER_SET_ROOM_NAME,
  SET_NEW_ROOM_ID,
  RESET_NEW_ROOM_ITEMS,
} from "./actionTypes";

// de vazut partea asta cu {channelID} de ce nu a functionat cu {}
export const updateChannelID = (channelID) => {
  console.log("Canalul de comunicatie este : ", channelID);
  return {
    type: USER_UPDATE_CHAT,
    payload: {
      channelID,
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

export const resetUserSearchBoxContent = () => {
  return {
    type: USER_RESET_SEARCH_BOX_CONTENT,
    payload: {},
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

export const resetPersonSearchList = () => {
  return {
    type: USER_RESET_PERSON_SEARCH_LIST,
    payload: {},
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

// retine dimensiunea listei de conversatii
export const setNewRoomID = (newRoomID) => {
  return {
    type: SET_NEW_ROOM_ID,
    payload: {
      newRoomID,
    },
  };
};

export const setNewRoomInList = (RoomName, personSelectedID) => {
  return {
    type: USER_SET_ROOM_NAME,
    payload: { RoomName, personSelectedID },
  };
};
export const resetNewRoomActions = () => {
  return {
    type: RESET_NEW_ROOM_ITEMS,
    payload: {},
  };
};
