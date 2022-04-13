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

    dispatch(setRoomList(Roomresult.data["search_results"]));
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
      dispatch(setPersonSearchList(Personresult.data["search_results"]));
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

    // TO DO - display message
    console.log(varVerify);
  };

export const CreateNewConversation =
  (RoomName, Private, userSearchListID, userID, uuidRoom) =>
  async (dispatch) => {
    const varVerify = await CreateNewRoomDataBase(
      RoomName,
      Private,
      userSearchListID,
      userID,
      uuidRoom
    );

    dispatch(userSetRoomListAsync("", userID));
    // TO DO - display message
    console.log(varVerify);
  };

export const DeleteConversation = (RoomID, userID) => async (dispatch) => {
  console.log("Delete Room: ");
  console.log(RoomID);
  const varVerify = await DeleteRoomDataBase(RoomID);

  dispatch(userSetRoomListAsync("", userID));
  // TO DO - display message
  console.log(varVerify);
};

// Create new group
export const CreateNewGroup =
  (NewGroupName, Type, userID, uuiRoom) => async (dispatch) => {
    console.log("Create new Group: ");
    console.log(NewGroupName, Type, userID, uuiRoom);

    const varVerify = await CreateNewGroupDataBase(
      NewGroupName,
      Type,
      userID,
      uuiRoom
    );

    // TO DO - display message
    console.log(varVerify);
    dispatch(userSetRoomListAsync("", userID));
  };

// handle add new member in a group
export const AddNewMemberInGroup =
  (RoomID, userSearchListID) => async (dispatch) => {
    const varVerify = await AddNewMemberInRoomDataBase(
      RoomID,
      userSearchListID
    );
    // TO DO - display message
    console.log(varVerify);
  };

// get participants from room list
export const getParticipantList = (RoomID) => async (dispatch) => {
  const result = await getParticipantsListService(RoomID);
  // TO DO - display message
  console.log(result);
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
    const varVerify = await UpdateProfilePictureData(userID, NewPicture);
    // TO DO - display message
    console.log(varVerify);
  };
