import {
  USER_UPDATE_CHAT,
  USER_SET_NEW_PERSON_CONVERSATION,
  USER_SET_SEARCH_BOX_CONTENT,
  USER_RESET_SEARCH_BOX_CONTENT,
  USER_SET_PERSON_SEARCH_LIST,
  USER_RESET_PERSON_SEARCH_LIST,
  USER_SET_ROOM_LIST,
  USER_RESET_ROOM_LIST,
} from "./actionTypes";

// de vazut partea asta cu {channelID} de ce nu a functionat cu {}
export const updateChannelID = (channelID) => {
  console.log("salut din userActions.js channel ID este " + channelID);
  return {
    type: USER_UPDATE_CHAT,
    payload: {
      channelID,
    },
  };
};

export const updateNewPersonIDConversation = (PersonID) => {
  console.log(
    "salut, pentru ID Persoane de data asta, userActions.js channel ID este " +
      PersonID
  );
  return {
    type: USER_SET_NEW_PERSON_CONVERSATION,
    payload: {
      PersonID,
    },
  };
};

export const setUserSearchBoxContent = (search_box_content) => {
  console.log(
    "salut, tocmai cauti o persoana/conversatie in lista de contacte dupa " +
      search_box_content
  );
  return {
    type: USER_SET_SEARCH_BOX_CONTENT,
    payload: {
      search_box_content,
    },
  };
};

export const resetUserSearchBoxContent = () => {
  console.log("salut, tocmai a fost resetatt search box ul content ");
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
