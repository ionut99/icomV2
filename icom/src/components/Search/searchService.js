import { useState } from "react";
import { useDispatch } from "react-redux";

import {
  setPersonSearchList,
  setUserSearchBoxContent,
  updateCurrentChannel,
  UpdateAddUserInGroup,
} from "../../actions/userActions";

import {
  updateChannelDetails,
  DeleteConversation,
  userSetRoomListAsync,
  userSearchPersonListAsync,
  CreateNewConversation,
  AddNewMemberInGroup,
  getParticipantList,
} from "../../asyncActions/userAsyncActions";

import { v4 as uuidv4 } from "uuid";

const SearchService = (userID) => {
  const dispatch = useDispatch();

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const onAddUser = async (RoomID) => {
    console.log(
      "Am nevoie de toate persoanele pentru a le adauga in grup" + userID
    );
    dispatch(UpdateAddUserInGroup(RoomID));
    dispatch(userSearchPersonListAsync("Z2V0QGxsVXNlcnM=", userID));
  };

  const ClickChannel = async (roomID, selectedRoomName, dispatch) => {
    dispatch(updateChannelDetails(roomID, selectedRoomName));

    dispatch(userSetRoomListAsync("", userID));
    dispatch(setUserSearchBoxContent(""));
    dispatch(setPersonSearchList([]));
  };

  const ClickPerson = (userSearchListName, userSearchListID, userName) => {
    var uuidRoom = uuidv4(); // pentru coduri unice
    dispatch(
      CreateNewConversation(
        userSearchListName + " # " + userName,
        1,
        userSearchListID,
        userID,
        uuidRoom
      )
    );
    dispatch(updateChannelDetails(uuidRoom, userSearchListName));
    dispatch(setUserSearchBoxContent(""));
    dispatch(setPersonSearchList([]));
  };

  const ClickAddPersonInGroup = (RoomID, userSearchListID) => {
    dispatch(AddNewMemberInGroup(RoomID, userSearchListID));
    dispatch(setPersonSearchList([]));
    dispatch(UpdateAddUserInGroup(""));
  };

  const ShowParticipants = (RoomID) => {
    // de intors lista cu participanti
    dispatch(getParticipantList(RoomID));
  };

  // delete room function -- start
  const onDelete = (RoomID) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    dispatch(DeleteConversation(RoomID, userID));
    dispatch(updateCurrentChannel(null, "", []));
  };
  // delete room function --end

  return {
    ClickChannel,
    onAddUser,
    onDelete,
    setConfirmDialog,
    ClickPerson,
    ClickAddPersonInGroup,
    ShowParticipants,
    confirmDialog,
  };
};

export default SearchService;
