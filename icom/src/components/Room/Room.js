import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ReactScrollableFeed from "react-scrollable-feed";
import classNames from "classnames";

import * as BsIcons from "react-icons/bs";
import * as IoIcons2 from "react-icons/io5";
import * as AiIcons from "react-icons/ai";

import Avatar from "../Search/Avatar";

import SendMessage from "./SendMessage";
import Message from "./Message";

import "./room.css";

function Room() {
  const [openConference, setOpenConference] = useState(false);
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID, currentChannelName, RoomMessages, channelFolderId } =
    chatObj;

  // const openVideoCall = () => {
  //   console.log("deschide apelul video ! ");
  //   setOpenConference(true);
  // };

  return (
    <>
      <div
        className="right-section-empty"
        style={{ display: channelID ? "none" : "block" }}
      >
        {/* <p>Choose a channel or create a new one</p> */}
      </div>
      <div
        className="right-section"
        style={{ display: channelID ? "block" : "none" }}
      >
        <div className="conversation-details">
          <div className="user_picture">
            <Avatar userId={user.userId} roomId={channelID} />
          </div>
          <div className="room-name">
            <p>{currentChannelName}</p>
          </div>
          <div className="room-instrument">
            {/* <Link to={`/newdocument/${channelID}`}> */}
            <Link to={`/storage/folder/${channelFolderId}`}>
              {<AiIcons.AiOutlineFile />}
            </Link>
          </div>
          <div className="room-instrument">
            <Link to={`/roomcall/${channelID}`}>
              <BsIcons.BsCameraVideo />
            </Link>
          </div>
          <div className="room-instrument">
            <IoIcons2.IoCallOutline />
          </div>
        </div>
        <div className="test-scrollbar">
          <div className="messages">
            <ReactScrollableFeed>
              {RoomMessages.map((RoomMessages, index) => {
                return (
                  <div
                    key={index}
                    className={classNames("one_message", {
                      me: RoomMessages.senderID === user.userId,
                    })}
                  >
                    <Message RoomMessages={RoomMessages} />
                  </div>
                );
              })}
            </ReactScrollableFeed>
          </div>
        </div>
        <SendMessage />
      </div>
      {/* {openConference && (
        <VideoRoom
          open_conference_open={openConference}
          close_conference={setOpenConference}
        />
      )} */}
    </>
  );
}

export default Room;
