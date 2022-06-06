import { userLogout, verifyTokenEnd } from "./../actions/authActions";
import {
  getSearchRoomService,
  newChatPersonService,
  getChannelDetailsService,
  createNewRoomService,
  deleteRoomService,
  createNewGroupService,
  addNewMemberInRoomService,
  getParticipantsListService,
  getPersonToAddInGroup,
  getUserDetails,
  getUserAdminList,
  getRoomMessagesWithTime,
} from "../services/user";

import {
  addUserAccountService,
  editUserAccountService,
} from "../services/user";
//
import {
  setRoomList,
  setPersonSearchList,
  updateCurrentChannel,
  updateMessageChannelList,
} from "./../actions/userActions";

export const getUserDetailsAsync = async (userId) => {
  const result = await getUserDetails(userId);

  if (result.status === 200) return result.data["userDetails"][0];
  else return null;
};
//

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
    const Personresult = await newChatPersonService(search_box_content, userId);

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

// handle List Person to add in group
export const userAddNewPersonInGroup = (RoomID, userId) => async (dispatch) => {
  const Personresult = await getPersonToAddInGroup(RoomID, userId);

  if (Personresult.error) {
    dispatch(verifyTokenEnd());
    if (
      Personresult.response &&
      [401, 403].includes(Personresult.response.status)
    )
      dispatch(userLogout());
    return;
  }
  if (Personresult.data["NOTparticipantsRoomList"].length > 0) {
    dispatch(setPersonSearchList(Personresult.data["NOTparticipantsRoomList"]));
  } else {
    dispatch(setPersonSearchList([]));
  }
};

// handle to select channel and fetch messages from data-base
export const updateChannelDetails = (channelID, userId) => async (dispatch) => {
  if (channelID == null) {
    return [];
  }
  const channelData = await getChannelDetailsService(channelID, userId);

  if (channelData.error) {
    dispatch(verifyTokenEnd());
    if (
      channelData.response &&
      [401, 403].includes(channelData.response.status)
    )
      dispatch(userLogout());
    return;
  }

  const roomFolderID = channelData.data["folderId"];
  const currentChannelName = channelData.data["roomName"];

  dispatch(updateCurrentChannel(channelID, currentChannelName, roomFolderID));
};

export const createNewConversation =
  (RoomName, Private, userSearchListID, userID, uuidRoom) =>
  async (dispatch) => {
    const result = await createNewRoomService(
      RoomName,
      Private,
      userSearchListID,
      userID,
      uuidRoom
    );

    if (result.status === 200) {
      dispatch(updateChannelDetails(uuidRoom, userID));
    }
    dispatch(userSetRoomListAsync("", userID));
    // TO DO - display message
    // console.log(varVerify);
  };
//

//
export const deleteConversation = (RoomID, userID) => async (dispatch) => {
  const varVerify = await deleteRoomService(RoomID);

  dispatch(userSetRoomListAsync("", userID));
  // TO DO - display message
  console.log(varVerify);
};
//

// Create new group
export const createNewGroup =
  (NewGroupName, Type, userID, uuiRoom) => async (dispatch) => {
    const varVerify = await createNewGroupService(
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
export const addNewMemberInGroup =
  (RoomID, userSearchListID) => async (dispatch) => {
    const varVerify = await addNewMemberInRoomService(RoomID, userSearchListID);
    // TO DO - display message
    console.log(varVerify);
  };

// get participants from room list
export const getParticipantList = (RoomID) => async (dispatch) => {
  const result = await getParticipantsListService(RoomID);
  // TO DO - display message
  // console.log(result.data);
  dispatch(setPersonSearchList(result.data["participantsRoomList"]));
};

export const addNewUserAccount =
  (userSurname, userName, email, isAdmin) => async (dispatch) => {
    const varVerify = await addUserAccountService(
      userSurname,
      userName,
      email,
      isAdmin
    );
    // TO DO - display message
    console.log(varVerify);
  };

export const editUserAccountInfo =
  (userSurname, userName, email, currentPassword, newPassword, userId) =>
  async (dispatch) => {
    const varVerify = await editUserAccountService(
      userSurname,
      userName,
      email,
      currentPassword,
      newPassword,
      userId
    );
    // TO DO - display message
    console.log(varVerify);
  };

//admin search user function
export const adminSearchList = async (search_text, userId) => {
  const result = await getUserAdminList(search_text, userId);

  if (result.status === 200) return result.data["admin_user_list"];
  else return null;
};

export const getMessageListTime =
  (channelID, lastMessageTime, position) => async (dispatch) => {
    const result = await getRoomMessagesWithTime(
      channelID,
      lastMessageTime,
      position
    ).then((result) => {
      return result;
    });
    if (result.status !== 200) {
      console.log("Error fetch message list");
      return;
    }
    dispatch(
      updateMessageChannelList(result.data["messageRoomList"], position)
    );
    //return result.data["messageRoomList"];
  };
