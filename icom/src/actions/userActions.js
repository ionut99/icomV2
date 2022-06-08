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
  channelId,
  currentChannelName,
  channelFolderId
) => {
  return {
    type: USER_UPDATE_CHAT,
    payload: {
      channelId,
      currentChannelName,
      channelFolderId,
    },
  };
};

export const updateMessageChannelList = (roomMessages, position) => {
  return {
    type: USER_MESSAGES_LIST_CHAT,
    payload: {
      roomMessages,
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

export const setRoomList = (roomSearchList) => {
  return {
    type: USER_SET_ROOM_LIST,
    payload: {
      roomSearchList,
    },
  };
};

export const InsertNewMessageLocal = (message) => {
  return {
    type: USER_ADD_NEW_MESSAGE,
    payload: {
      ID_message: message.ID_message,
      roomId: message.roomId,
      senderId: message.senderId,
      senderName: message.senderName,
      body: message.body,
      type: message.type,
      fileId: message.fileId,
      createdTime: message.createdTime,
    },
  };
};

export const UpdateLastMessage = (lastMessage, Id) => {
  return {
    type: UPDATE_LAST_MESSAGE,
    payload: { lastMessage, Id },
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
