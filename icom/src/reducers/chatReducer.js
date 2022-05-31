import {
  USER_UPDATE_CHAT,
  USER_MESSAGES_LIST_CHAT,
  USER_SET_SEARCH_BOX_CONTENT,
  USER_SET_PERSON_SEARCH_LIST,
  USER_RESET_PERSON_SEARCH_LIST,
  USER_SET_ROOM_LIST,
  USER_RESET_ROOM_LIST,
  USER_ADD_NEW_MESSAGE,
  UPDATE_ADD_USER_IN_GROUP,
} from "../actions/actionTypes";

const ChannelState = {
  channelID: null,
  currentChannelName: "",
  RoomMessages: [],
  channelFolderId: null,

  search_box_content: "",
  addUserInGroup: "",
  userSearchList: [],
  RoomSearchList: [],
};

const chatRedu = (state = ChannelState, action) => {
  switch (action.type) {
    // update chat room ID
    case USER_UPDATE_CHAT:
      const { channelID, currentChannelName, channelFolderId } = action.payload;
      return {
        ...state,
        channelID,
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
    // reset Search Person list
    case USER_RESET_PERSON_SEARCH_LIST:
      return {
        ...state,
        userSearchList: [],
      };

    // set ROOM Person List
    case USER_SET_ROOM_LIST:
      const { RoomSearchList } = action.payload;
      return {
        ...state,
        RoomSearchList,
      };
    // reset ROMM Person list
    case USER_RESET_ROOM_LIST:
      return {
        ...state,
        RoomSearchList: [],
      };

    // update user status
    case UPDATE_ADD_USER_IN_GROUP:
      const { addUserInGroup } = action.payload;
      return {
        ...state,
        addUserInGroup: addUserInGroup,
      };

    case USER_MESSAGES_LIST_CHAT:
      const { RoomMessages, position } = action.payload;
      if (RoomMessages.length === 1 && state.RoomMessages.length === 0) {
        return {
          ...state,
          RoomMessages,
        };
      }
      if (RoomMessages.length === 1 && state.RoomMessages.length > 0) {
        return state;
      }
      if (position === "top" && state.RoomMessages.length > 7) {
        // append top
        const newList = RoomMessages.concat(state.RoomMessages.slice(1, 5));
        return {
          ...state,
          RoomMessages: newList,
        };
      } else if (position === "bottom" && state.RoomMessages.length > 7) {
        //append bottom
        const newList = state.RoomMessages.slice(-5, -1).concat(RoomMessages);
        return {
          ...state,
          RoomMessages: newList,
        };
      } else {
        return {
          ...state,
          RoomMessages,
        };
      }

    case USER_ADD_NEW_MESSAGE:
      const { ID_message, RoomID, senderID, senderName, Body, createdTime } =
        action.payload;
      return {
        ...state,
        RoomMessages: [
          ...state.RoomMessages,
          {
            ID_message: ID_message,
            RoomID: RoomID,
            senderID: senderID,
            senderName: senderName,
            Body: Body,
            createdTime: createdTime,
          },
        ],
      };

    default:
      return state;
  }
};

export default chatRedu;
