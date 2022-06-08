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
    const resultList = await getSearchRoomService(search_box_content, userId);

    if (resultList.error) {
      dispatch(verifyTokenEnd());
      if (
        resultList.response &&
        [401, 403].includes(resultList.response.status)
      )
        dispatch(userLogout());
      return;
    }

    dispatch(setRoomList(resultList.data["search_results"]));
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
export const userAddNewPersonInGroup = (roomId, userId) => async (dispatch) => {
  const Personresult = await getPersonToAddInGroup(roomId, userId);

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
export const updateChannelDetails = (channelId, userId) => async (dispatch) => {
  if (channelId == null) {
    return [];
  }
  const channelData = await getChannelDetailsService(channelId, userId);

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

  dispatch(updateCurrentChannel(channelId, currentChannelName, roomFolderID));
};

export const createNewConversation =
  (roomName, type, userSearchListId, userId, uuidRoom) => async (dispatch) => {
    const result = await createNewRoomService(
      roomName,
      type,
      userSearchListId,
      userId,
      uuidRoom
    );

    if (result.status === 200) {
      dispatch(updateChannelDetails(uuidRoom, userId));
    }
    dispatch(userSetRoomListAsync("", userId));
    // TO DO - display message
  };

//

export const deleteConversation = (roomId, userId) => async (dispatch) => {
  const varVerify = await deleteRoomService(roomId);

  dispatch(userSetRoomListAsync("", userId));
  // TO DO - display message
  console.log(varVerify);
};
//

// Create new group
export const createNewGroup =
  (newGroupName, type, userId, uuiRoom) => async (dispatch) => {
    const varVerify = await createNewGroupService(
      newGroupName,
      type,
      userId,
      uuiRoom
    );

    // TO DO - display message
    console.log(varVerify);
    dispatch(userSetRoomListAsync("", userId));
  };

// handle add new member in a group
export const addNewMemberInGroup =
  (roomId, userSearchListID) => async (dispatch) => {
    const varVerify = await addNewMemberInRoomService(roomId, userSearchListID);
    // TO DO - display message
    console.log(varVerify);
  };

// get participants from room list
export const getParticipantList = (roomId) => async (dispatch) => {
  const result = await getParticipantsListService(roomId);
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
  (surname, name, email, currentPassword, newPassword, userId) =>
  async (dispatch) => {
    const varVerify = await editUserAccountService(
      surname,
      name,
      email,
      currentPassword,
      newPassword,
      userId
    );
    // TO DO - display message
    console.log(varVerify);
  };

export const getMessageListTime =
  (channelId, lastMessageTime, position) => async (dispatch) => {
    const result = await getRoomMessagesWithTime(
      channelId,
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
