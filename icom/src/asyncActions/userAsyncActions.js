import { userLogout, verifyTokenEnd } from "./../actions/authActions";
import {
  getSearchRoomService,
  getSearchPersonService,
  getRoomMessages,
  InsertNewMessageDataBase,
  CreateNewRoomDataBase,
  DeleteRoomDataBase,
  CreateNewGroupDataBase,
} from "../services/user";

import {
  setRoomList,
  setPersonSearchList,
  updateCurrentChannel,
} from "./../actions/userActions";

// handle RoomList Search
export const userSetRoomListAsync =
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

    console.log("Afisare roomList");
    console.log(Roomresult.data["list"]);
    dispatch(setRoomList(Roomresult.data["list"]));
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
  };

export const CreateNewConversation =
  (RoomName, Private, userSearchListID, userID, uuidRoom) =>
  async (dispatch) => {
    const varverify = await CreateNewRoomDataBase(
      RoomName,
      Private,
      userSearchListID,
      userID,
      uuidRoom
    );

    dispatch(userSetRoomListAsync("", userID));
    // tratare raspuns de la server
  };

export const DeleteConversation = (RoomID, userID) => async (dispatch) => {
  console.log("Camera care se sterge este: ");
  console.log(RoomID);
  const varverify = await DeleteRoomDataBase(RoomID);

  dispatch(userSetRoomListAsync("", userID));
  // tratare raspuns de la server
};

// functie pentru adaugare grup nou
export const CreateNewGroup =
  (NewGroupName, Type, userID, uuiRoom) => async (dispatch) => {
    console.log("Facem un nou grup: ");
    console.log(NewGroupName, Type, userID, uuiRoom);

    const varverify = await CreateNewGroupDataBase(
      NewGroupName,
      Type,
      userID,
      uuiRoom
    );

    dispatch(userSetRoomListAsync("", userID));
    // tratare raspuns de la server
  };
