import { userLogout, verifyTokenEnd } from "./../actions/authActions";
import {
  getSearchRoomService,
  getSearchPersonService,
  getRoomMessages,
  InsertNewMessageDataBase,
} from "../services/user";

import {
  setRoomList,
  setPersonSearchList,
  setNewRoomID,
  updateCurrentChannel,
} from "./../actions/userActions";

// handle RoomList Search
export const userResetRoomListAsync =
  (search_box_content, userId) => async (dispatch) => {
    const Roomresult = await getSearchRoomService(search_box_content, userId);

    if (Roomresult.error) {
      dispatch(verifyTokenEnd());
      if (
        Roomresult.response &&
        [401, 403].includes(Roomresult.response.status)
      )
        dispatch(userLogout());
      return;
    }

    dispatch(setRoomList(Roomresult.data["list"]));

    if (search_box_content === "") {
      dispatch(setNewRoomID(Roomresult.data["list"].length + 1));
    }
  };

// handle Person Search
export const userSearchPersonListAsync =
  (search_box_content, userId) => async (dispatch) => {
    const Personresult = await getSearchPersonService(
      search_box_content,
      userId
    );

    if (Personresult.error) {
      dispatch(verifyTokenEnd());
      if (
        Personresult.response &&
        [401, 403].includes(Personresult.response.status)
      )
        dispatch(userLogout());
      return;
    }
    if (search_box_content !== "") {
      dispatch(setPersonSearchList(Personresult.data["list"]));
    } else {
      dispatch(setPersonSearchList([]));
    }
  };

// handle to select channel and fetch messages from data-base
export const updateChannelDetails =
  (channelID, currentChannelName) => async (dispatch) => {
    if (channelID == null) {
      return [];
    }
    const messageList = await getRoomMessages(channelID);

    if (messageList.error) {
      dispatch(verifyTokenEnd());
      if (
        messageList.response &&
        [401, 403].includes(messageList.response.status)
      )
        dispatch(userLogout());
      return;
    }

    dispatch(
      updateCurrentChannel(
        channelID,
        currentChannelName,
        messageList.data["messageRoomList"]
      )
    );
  };

// handle insert new message in database
export const InsertNewMessage =
  (ID_message, senderID, roomID, messageBody) => async (dispatch) => {
    const varVerify = await InsertNewMessageDataBase(
      ID_message,
      senderID,
      roomID,
      messageBody
    );

    // tratare raspuns de la server dupa inserare

    // console.log("verificare de la server: ");
    // console.log(varVerify);
  };
