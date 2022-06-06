import {
  USER_UPDATE_CHAT,
  USER_MESSAGES_LIST_CHAT,
  USER_SET_SEARCH_BOX_CONTENT,
  USER_SET_PERSON_SEARCH_LIST,
  USER_SET_ROOM_LIST,
  USER_ADD_NEW_MESSAGE,
  UPDATE_ADD_USER_IN_GROUP,
  UPDATE_LAST_MESSAGE,
} from "./actionTypes";

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

export const UpdateAddUserInGroup = (addUserInGroup) => {
  return {
    type: UPDATE_ADD_USER_IN_GROUP,
    payload: { addUserInGroup },
  };
};

export const setSocketConnectionStatus = (status) => {
  return {
    type: "SET_SOCKET_STATUS",
    payload: {
      status,
    },
  };
};
