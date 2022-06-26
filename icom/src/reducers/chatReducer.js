import {
  USER_UPDATE_CHAT,
  USER_MESSAGES_LIST_CHAT,
  USER_SET_SEARCH_BOX_CONTENT,
  USER_SET_PERSON_SEARCH_LIST,
  USER_SET_ROOM_LIST,
  USER_ADD_NEW_MESSAGE,
  UPDATE_ADD_USER_IN_GROUP,
  UPDATE_LAST_MESSAGE,
} from "../actions/actionTypes";

const ChannelState = {
  //
  channelId: null,
  currentChannelName: "",
  roomMessages: [],
  channelFolderId: null,

  search_box_content: "",
  addUserInGroup: "",
  userSearchList: [],
  roomSearchList: [],
};

const chatRedu = (state = ChannelState, action) => {
  switch (action.type) {
    // update chat room ID
    case USER_UPDATE_CHAT:
      const { channelId, currentChannelName, channelFolderId } = action.payload;
      return {
        ...state,
        channelId,
        currentChannelName,
        channelFolderId,
      };

    // set Chat search box content
    case USER_SET_SEARCH_BOX_CONTENT:
      const { search_box_content } = action.payload;
      return {
        ...state,
        search_box_content,
      };

    // set Search Person List
    case USER_SET_PERSON_SEARCH_LIST:
      const { userSearchList } = action.payload;
      return {
        ...state,
        userSearchList,
      };

    // set ROOM Person List
    case USER_SET_ROOM_LIST:
      const { roomSearchList } = action.payload;
      return {
        ...state,
        roomSearchList,
      };

    // update user status
    case UPDATE_ADD_USER_IN_GROUP:
      const { addUserInGroup } = action.payload;
      return {
        ...state,
        addUserInGroup: addUserInGroup,
      };

    case USER_MESSAGES_LIST_CHAT:
      const { roomMessages, position } = action.payload;
      if (roomMessages.length === 1 && state.roomMessages.length === 0) {
        return {
          ...state,
          roomMessages,
        };
      }
      if (roomMessages.length === 1 && state.roomMessages.length > 0) {
        return state;
      }
      if (position === "top" && state.roomMessages.length > 10) {
        // append top

        // list for append
        const appList = state.roomMessages.slice(1, 20);

        for (let j = 0; j < roomMessages.length; j++) {
          for (let i = 0; i < appList.length; i++) {
            if (appList[i].ID_message === roomMessages[j].ID_message) {
              appList.splice(i, 1);
              i--;
            }
          }
        }
        const newList = roomMessages.concat(appList);
        //
        return {
          ...state,
          roomMessages: newList,
        };
      } else if (position === "bottom" && state.roomMessages.length > 10) {
        //append bottom

        //
        const appList = roomMessages;

        for (let j = 0; j < state.roomMessages.length; j++) {
          for (let i = 0; i < appList.length; i++) {
            if (appList[i].ID_message === state.roomMessages[j].ID_message) {
              appList.splice(i, 1);
              i--;
            }
          }
        }
        //

        const newList = state.roomMessages.slice(-20, -1).concat(appList);

        return {
          ...state,
          roomMessages: newList,
        };
      } else {
        return {
          ...state,
          roomMessages,
        };
      }

    case USER_ADD_NEW_MESSAGE:
      const {
        ID_message,
        roomId,
        senderId,
        senderName,
        body,
        type,
        fileId,
        createdTime,
      } = action.payload;
      return {
        ...state,
        roomMessages: [
          ...state.roomMessages,
          {
            ID_message: ID_message,
            roomId: roomId,
            senderId: senderId,
            senderName: senderName,
            body: body,
            type: type,
            fileId: fileId,
            createdTime: createdTime,
          },
        ],
      };

    case UPDATE_LAST_MESSAGE:
      const { LastMessage, ID } = action.payload;
      for (let i = 0; i < state.roomSearchList.length; i++) {
        if (state.roomSearchList[i].roomId === ID) {
          state.roomSearchList[i].LastMessage = LastMessage;
        }
      }
      return {
        ...state,
        roomSearchList: state.roomSearchList,
      };

    default:
      return state;
  }
};

export default chatRedu;
