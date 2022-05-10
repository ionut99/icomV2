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
  getPersonToAddInGroup,
  // UploadNewStoringFile,
} from "../services/user";

import {
  setRoomList,
  setPersonSearchList,
  updateCurrentChannel,
  // GetFileDocument,
} from "./../actions/userActions";

import { AddUserAccountDataBase } from "../services/user";
import { getChildFolders, getFolderByID } from "../services/folder";
import { getFileList } from "../services/file";
import {
  setChildFolderList,
  setChildFileList,
  updateFolder,
} from "./../actions/userActions";

import { ROOT_FOLDER } from "../reducers/folderReducer";

// handle get ChildFolderList
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

//

// handle get ChildFolderList
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

// handle get ChildFolderList
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
        messageList.data["messageRoomList"],
        messageList.data["folderId"]
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
    //console.log(varVerify);
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
  // console.log(result);
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
