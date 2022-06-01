import { userLogout, verifyTokenEnd } from "./../actions/authActions";
import {
  getSearchRoomService,
  newChatPersonService,
  getChannelDetails,
  CreateNewRoomDataBase,
  DeleteRoomDataBase,
  CreateNewGroupDataBase,
  AddNewMemberInRoomDataBase,
  getParticipantsListService,
  GetDocumentFileData,
  UpdateProfilePictureData,
  getPersonToAddInGroup,
  getUserDetails,
  getUserAdminList,
  getRoomMessagesWithTime,
} from "../services/user";

import {
  setRoomList,
  setPersonSearchList,
  updateCurrentChannel,
  updateMessageChannelList,
} from "./../actions/userActions";

import {
  AddUserAccountDataBase,
  EditUserAccountDataBase,
} from "../services/user";

import { getChildFolders, getFolderByID } from "../services/folder";
import { getFileList } from "../services/file";
import {
  setChildFolderList,
  setChildFileList,
  updateFolder,
} from "./../actions/userActions";

import { ROOT_FOLDER } from "../reducers/folderReducer";

//
export const userGetFolderDetails = (folderId, userId) => async (dispatch) => {
  if (
    folderId === "root" ||
    folderId === null ||
    folderId === undefined ||
    userId === null ||
    userId === undefined
  ) {
    return dispatch(updateFolder(ROOT_FOLDER));
  }

  const result = await getFolderByID(folderId, userId);

  if (result.data !== undefined) {
    const formattedDoc = {
      Name: result.data["folderObject"][0].Name,
      createdTime: result.data["folderObject"][0].createdTime,
      folderId: result.data["folderObject"][0].folderId,
      parentID: result.data["folderObject"][0].parentID,
      path: JSON.parse(result.data["folderObject"][0].path),
      userID: result.data["folderObject"][0].userID,
    };

    dispatch(updateFolder(formattedDoc));
  }
};

export const getUserDetailsAsync = async (userId) => {
  const result = await getUserDetails(userId);

  if (result.status === 200) return result.data["userDetails"][0];
  else return null;
};

//
export const userSetFolderList = (folderId, userId) => async (dispatch) => {
  if (
    folderId === null ||
    folderId === undefined ||
    userId === null ||
    userId === undefined
  ) {
    return dispatch(updateFolder(ROOT_FOLDER));
  }

  const result = await getChildFolders(folderId, userId);

  const orderList = result.data["userFolderList"].sort(function (a, b) {
    return new Date(b.createdTime) - new Date(a.createdTime);
  });

  dispatch(setChildFolderList(orderList));
};

//

//
export const userSetFileList = (folderId, userId) => async (dispatch) => {
  if (
    folderId === null ||
    folderId === undefined ||
    userId === null ||
    userId === undefined
  ) {
    return dispatch(updateFolder(ROOT_FOLDER));
  }

  const result = await getFileList(folderId, userId);

  const orderList = result.data["userFileList"].sort(function (a, b) {
    return new Date(b.createdTime) - new Date(a.createdTime);
  });

  dispatch(setChildFileList(orderList));
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
  const channelData = await getChannelDetails(channelID, userId);

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

export const CreateNewConversation =
  (RoomName, Private, userSearchListID, userID, uuidRoom) =>
  async (dispatch) => {
    const result = await CreateNewRoomDataBase(
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
  // console.log(result.data);
  dispatch(setPersonSearchList(result.data["participantsRoomList"]));
};

// handle getDocument
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

export const AddNewUserAccount =
  (userSurname, userName, email, isAdmin) => async (dispatch) => {
    const varVerify = await AddUserAccountDataBase(
      userSurname,
      userName,
      email,
      isAdmin
    );
    // TO DO - display message
    console.log(varVerify);
  };

export const EditUserAccountInfor =
  (userSurname, userName, email, currentPassword, newPassword, userId) =>
  async (dispatch) => {
    const varVerify = await EditUserAccountDataBase(
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
