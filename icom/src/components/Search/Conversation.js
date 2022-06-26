import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import {
  setPersonSearchList,
  setUserSearchBoxContent,
  UpdateAddUserInGroup,
  updateMessageChannelList,
} from "../../actions/userActions";

import {
  updateChannelDetails,
  userSetRoomListAsync,
  getParticipantList,
  userAddNewPersonInGroup,
} from "../../asyncActions/userAsyncActions";

import "./search.css";

import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";

import Avatar from "../Avatar/Avatar";
import ChangeAvatar from "../ChangeAvatar/ChangeAvatar";

function Conversation(props) {
  const ref = useRef();

  const dispatch = useDispatch();

  const { channel, setChannelToDelete } = props;
  //
  const [optionButton, setOptionButton] = useState(false);
  //

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelId } = chatObj;

  const CreateMessageDate = new Date(Date.parse(channel.lastMessageTime));

  const selectChannel = (roomId) => {
    // works if select different channel
    if (roomId !== channelId) {
      dispatch(updateChannelDetails(roomId, user.userId));
      dispatch(updateMessageChannelList([], "top"));
      dispatch(updateMessageChannelList([], "bottom"));
    }
    //
    dispatch(userSetRoomListAsync("", user.userId));
    dispatch(setUserSearchBoxContent(""));
    dispatch(setPersonSearchList([]));
  };

  const handleAddUserInGroup = (roomId) => {
    dispatch(UpdateAddUserInGroup(roomId));
    dispatch(userAddNewPersonInGroup(roomId, user.userId));
  };

  const handleShowParticipants = (roomId) => {
    dispatch(getParticipantList(roomId));
    dispatch(UpdateAddUserInGroup(roomId));
  };

  const handleDeleteChannel = (channelName, channelId) => {
    setChannelToDelete({
      id: channelId,
      name: channelName,
      openModal: true,
    });
  };

  const handleChangeGroupPicture = (roomId, userId) => {};

  useEffect(() => {
    let isMounted = true;
    const checkIfClickedOutside = (e) => {
      if (
        isMounted &&
        optionButton &&
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setOptionButton(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      isMounted = false;
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [optionButton]);

  return (
    <div
      className="conversation"
      onClick={() => selectChannel(channel.roomId)}
      ref={ref}
    >
      <div className="user_picture">
        <Avatar userId={user.userId} roomId={channel.roomId} />
      </div>

      <div className="conversation-user-details">
        <div className="name">
          <p>{channel.roomName}</p>
        </div>
        <div className="last-message">
          <p>Last: {channel.lastMessage}</p>
        </div>
      </div>

      <div className="more_options">
        <div
          className="dropdown"
          onClick={() => {
            setOptionButton(!optionButton);
          }}
        >
          <MoreHorizIcon
            sx={{ fontSize: 30, color: "green" }}
            className="MoreHorizIcon"
          ></MoreHorizIcon>

          <div
            className="dropdown-content"
            style={{ display: optionButton ? "block" : "none" }}
          >
            <div
              className="dropdown-instrument"
              onClick={() => {
                handleDeleteChannel(channel.roomName, channel.roomId);
              }}
            >
              <MdIcons.MdDeleteOutline size={20} />
              <p>Delete Channel</p>
            </div>
            <div
              className="dropdown-instrument"
              style={{
                display: channel.type ? "none" : "flex",
              }}
              onClick={() => handleAddUserInGroup(channel.roomId)}
            >
              <AiIcons.AiOutlineUserAdd size={20} />
              <p>Add User</p>
            </div>
            <div
              className="dropdown-instrument"
              style={{
                display: channel.type ? "none" : "flex",
              }}
              onClick={() => handleShowParticipants(channel.roomId)}
            >
              <BsIcons.BsPeople size={20} />
              <p>Participants</p>
            </div>
            <div
              style={{
                display: channel.type ? "none" : "flex",
              }}
            >
              <ChangeAvatar
                userId={user.userId}
                roomId={channel.roomId}
                group={true}
              />
            </div>
          </div>
        </div>
        <div className="conversation-last-seen">
          {channel.lastMessageTime !== undefined ? (
            <>{` ${
              CreateMessageDate.getHours() +
              ":" +
              CreateMessageDate.getMinutes()
            }`}</>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Conversation;
