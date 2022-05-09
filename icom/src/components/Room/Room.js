import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ReactScrollableFeed from "react-scrollable-feed";
import classNames from "classnames";

import * as BsIcons from "react-icons/bs";
import * as IoIcons2 from "react-icons/io5";
import * as AiIcons from "react-icons/ai";

import Avatar from "../Search/Avatar";

import SendMessage from "./SendMessage";

import "./room.css";

function Room() {
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID, currentChannelName, RoomMessages } = chatObj;

  return (
    <>
      <div
        className="right-section-empty"
        style={{ display: channelID ? "none" : "block" }}
      >
        <p>Choose a channel or create a new one</p>
      </div>
      <div
        className="right-section"
        style={{ display: channelID ? "block" : "none" }}
      >
        <div className="conversation-details">
          <Avatar userID={null} roomID={channelID} atuhUser={user.userId} />
          <div className="room-name">
            <p>{currentChannelName}</p>
          </div>
          <div className="room-instrument">
            <Link to={`/newdocument/${channelID}`}>
              {<AiIcons.AiOutlineEdit />}
            </Link>
          </div>
          <div className="room-instrument">
            <BsIcons.BsCameraVideo />
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
                    <Avatar
                      userID={RoomMessages.senderID}
                      roomID={null}
                      atuhUser={user.userId}
                    />
                    <div className="message_body">
                      <div className="message_author">
                        {RoomMessages.senderID === user.userId
                          ? "Aici punem data "
                          : RoomMessages.senderID}
                      </div>
                      <div className="message_text">
                        <p>{RoomMessages.Body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ReactScrollableFeed>
          </div>
        </div>
        <SendMessage />
      </div>
    </>
  );
}

export default Room;
