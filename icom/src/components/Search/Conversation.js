import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import "./search.css";

import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";

import SearchService from "./searchService.js";

import Avatar from "../Search/Avatar";

function Conversation(props) {
  const ref = useRef();

  const dispatch = useDispatch();

  const { channel, setOpen, setCurrentChannel } = props;
  const [optionButton, setOptionButton] = useState(false);

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const CreateMessageDate = new Date(Date.parse(channel.LastMessageTime));

  console.log(channel.LastMessageTime);
  const { ClickChannel, onAddUser, ShowParticipants } = SearchService(
    user.userId
  );

  const handleAddUserInGroup = (RoomID) => {
    onAddUser(RoomID);
  };

  const handleShowParticipants = (RoomID) => {
    ShowParticipants(RoomID);
  };

  const handleDeleteChannel = (channelName, channelId) => {
    setCurrentChannel({
      name: channelName,
      id: channelId,
    });
    setOpen(true);
  };

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
      onClick={() => ClickChannel(channel.RoomID, dispatch)}
      ref={ref}
    >
      <div className="user_picture">
        <Avatar userId={user.userId} roomId={channel.RoomID} />
      </div>

      <div className="conversation-user-details">
        <div className="name">
          <p>{channel.RoomName}</p>
        </div>
        <div className="last-message">
          <p>Last: {channel.LastMessage}</p>
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
                handleDeleteChannel(channel.RoomName, channel.RoomID);
              }}
            >
              <MdIcons.MdDeleteOutline size={20} />
              <p>Delete Channel</p>
            </div>
            <div
              className="dropdown-instrument"
              style={{
                display: channel.Type ? "none" : "flex",
              }}
              onClick={() => handleAddUserInGroup(channel.RoomID)}
            >
              <AiIcons.AiOutlineUserAdd size={20} />
              <p>Add User</p>
            </div>
            <div
              className="dropdown-instrument"
              style={{
                display: channel.Type ? "none" : "flex",
              }}
              onClick={() => handleShowParticipants(channel.RoomID)}
            >
              <BsIcons.BsPeople size={20} />
              <p>Participants</p>
            </div>
            <div className="dropdown-instrument">
              <AiIcons.AiOutlinePushpin size={20} />
              <p>Pin</p>
            </div>
          </div>
        </div>
        <div className="conversation-last-seen">
          {channel.LastMessageTime !== undefined ? (
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
