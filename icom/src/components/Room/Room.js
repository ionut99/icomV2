import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ReactScrollableFeed from "react-scrollable-feed";
import classNames from "classnames";

import * as MdIcons from "react-icons/md";
import * as IoIcons from "react-icons/io";
import * as BsIcons from "react-icons/bs";
import * as IoIcons2 from "react-icons/io5";
import * as AiIcons from "react-icons/ai";

import UserAvatar from "../../images/userAvatar.png";
import groupAvatar from "../../images/group.png";
import Comunication from "../../services/comunication";

import "./room.css";

function Room() {
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID, currentChannelName, RoomMessages } = chatObj;

  const { sendMessage } = Comunication(channelID, user.userId);
  const [newMessage, setNewMessage] = useState("");

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage !== "") {
      sendMessage(newMessage);
    }
    setNewMessage("");
  };

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
          <img
            className="conversation-picture"
            src={groupAvatar}
            alt="poza din user details"
          />
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
                    <img src={UserAvatar} alt="" />

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
        <div className="messenger_input">
          <div className="text_input">
            {/* <TextareaAutosize
                cacheMeasurements
                onHeightChange={(height) => console.log(height)}
              /> */}
            <textarea
              // value={newMsg.body}
              // onChange={GetMessageText}
              value={newMessage}
              onChange={handleNewMessageChange}
              placeholder=" Write your message..."
            />
            <div className="actions" onClick={handleSendMessage}>
              <button>Send</button>
            </div>
          </div>
          <div className="toolbar-send">
            <div className="write-instrument">
              <MdIcons.MdTextFormat />
            </div>
            <div className="write-instrument">
              <IoIcons.IoIosAttach />
            </div>
            <div className="write-instrument">
              <BsIcons.BsEmojiSmile />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Room;