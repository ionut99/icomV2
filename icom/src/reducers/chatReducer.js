import {
  USER_UPDATE_CHAT,
  USER_SET_SEARCH_BOX_CONTENT,
  USER_SET_PERSON_SEARCH_LIST,
  USER_RESET_PERSON_SEARCH_LIST,
  USER_SET_ROOM_LIST,
  USER_RESET_ROOM_LIST,
  USER_ADD_NEW_MESSAGE,
} from "../actions/actionTypes";

const ChannelState = {
  channelID: null,
  currentChannelName: "",
  RoomMessages: [],

  search_box_content: "",
  userSearchList: [],
  RoomSearchList: [],
};

const chatRedu = (state = ChannelState, action) => {
  switch (action.type) {
    // update chat room ID
    case USER_UPDATE_CHAT:
      const { channelID, currentChannelName, RoomMessages } = action.payload;
      return {
        ...state,
        channelID,
        currentChannelName,
        RoomMessages,
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

    case USER_ADD_NEW_MESSAGE:
      const { ID_message, RoomID, senderID, Body } = action.payload;
      return {
        ...state,
        RoomMessages: [
          ...state.RoomMessages,
          {
            ID_message: ID_message,
            RoomID: RoomID,
            senderID: senderID,
            Body: Body,
          },
        ],
      };

    default:
      return state;
  }
};

export default chatRedu;
