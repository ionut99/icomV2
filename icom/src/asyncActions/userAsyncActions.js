import { userLogout, verifyTokenEnd } from "./../actions/authActions";
import {
  getSearchRoomService,
  getSearchPersonService,
  getRoomMessages,
  InsertNewMessageDataBase,
  CreateNewRoomDataBase,
  DeleteRoomDataBase,
  CreateNewGroupDataBase,
  AddNewMemberInRoomDataBase,
  getParticipantsListService,
  GetDocumentFileData,
  UpdateProfilePictureData,
} from "../services/user";

import {
  setRoomList,
  setPersonSearchList,
  updateCurrentChannel,
  GetFileDocument,
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
    //TO DO:
    // tratare raspuns de la server
  };

export const DeleteConversation = (RoomID, userID) => async (dispatch) => {
  console.log("Camera care se sterge este: ");
  console.log(RoomID);
  const varverify = await DeleteRoomDataBase(RoomID);

  dispatch(userSetRoomListAsync("", userID));
  //TO DO:
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
    //TO DO:
    // tratare raspuns de la server
  };

// handle add new member in a group
export const AddNewMemberInGroup =
  (RoomID, userSearchListID) => async (dispatch) => {
    const varVerify = await AddNewMemberInRoomDataBase(
      RoomID,
      userSearchListID
    );
  };

// get participants from room list
export const getParticipantList = (RoomID) => async (dispatch) => {
  const result = await getParticipantsListService(RoomID);
  // if (result.error) {
  //   dispatch(verifyTokenEnd());
  //   if (result.response && [401, 403].includes(result.response.status))
  //     dispatch(userLogout());
  //   return;
  // }
  dispatch(setPersonSearchList(result.data["participantsRoomList"]));
};

// handle insert new message in database
export const GetDocumentFile = (FileName, FilePath) => async (dispatch) => {
  const documentData = await GetDocumentFileData(FileName, FilePath);
  // aici avem nevoie de verificari...
  const string = documentData.data;
  //dispatch(GetFileDocument(string));
  return string;
};

export const UpdateProfilePicture =
  (userID, NewPicture) => async (dispatch) => {
    console.log("hai cu tata");
    console.log(NewPicture);
    const varVerify = await UpdateProfilePictureData(userID, NewPicture);
  };
