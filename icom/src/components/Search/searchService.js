import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

  const chatObj = useSelector((state) => state.chatRedu);
  const { RoomSearchList } = chatObj;

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const onAddUser = async (RoomID) => {
    dispatch(UpdateAddUserInGroup(RoomID));
    dispatch(userSearchPersonListAsync("Z2V0QGxsVXNlcnM=", userID));
  };

  const ClickChannel = async (roomID, selectedRoomName, dispatch) => {
    dispatch(updateChannelDetails(roomID, selectedRoomName));

    dispatch(userSetRoomListAsync("", userID));
    dispatch(setUserSearchBoxContent(""));
    dispatch(setPersonSearchList([]));
  };

  // when click on person tab
  const ClickPerson = (userSearchListName, userSearchListID, userName) => {
    for (let i = 0; i < RoomSearchList.length; i++) {
      if (RoomSearchList[i]["RoomName"].includes(userSearchListName)) {
        dispatch(
          updateChannelDetails(RoomSearchList[i]["RoomID"], userSearchListName)
        );
        dispatch(setUserSearchBoxContent(""));
        dispatch(setPersonSearchList([]));
        return;
      }
    }
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
    dispatch(getParticipantList(RoomID));
    dispatch(UpdateAddUserInGroup(RoomID));
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

  const CloseChannelOptions = () => {
    dispatch(UpdateAddUserInGroup(""));
    dispatch(setPersonSearchList([]));
    dispatch(setUserSearchBoxContent(""));
    dispatch(userSetRoomListAsync("", userID));
  };

  return {
    ClickChannel,
    onAddUser,
    onDelete,
    setConfirmDialog,
    ClickPerson,
    ClickAddPersonInGroup,
    ShowParticipants,
    CloseChannelOptions,
    confirmDialog,
  };
};

export default SearchService;