import React, { useState } from "react";
import { useSelector } from "react-redux";

import ReactScrollableFeed from "react-scrollable-feed";
import classNames from "classnames";

import * as MdIcons from "react-icons/md";
import * as IoIcons from "react-icons/io";
import * as BsIcons from "react-icons/bs";

import UserAvatar from "../../images/userAvatar.png";
import groupAvatar from "../../images/group.png";
import useChat from "../useChat";

import "./room.css";

function Room() {
  //const dispatch = useDispatch();
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID } = chatObj;
  console.log("canalul este + ", channelID);
  const { messages, sendMessage } = useChat(
    channelID,
    user.userId,
    user.name + " " + user.surname
  );
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
      <div className="right-section">
        <div className="conversation-details">
          <img
            className="conversation-picture"
            src={groupAvatar}
            alt="poza din user details"
          />
          <div className="room-name">
            <p>Popescul Alexandru</p>
          </div>
        </div>
        <div className="test-scrollbar">
          <div className="messages">
            <ReactScrollableFeed>
              {messages.map((messages, index) => {
                return (
                  <div
                    key={index}
                    className={classNames("one_message", {
                      me: messages.ownedByCurrentUser,
                    })}
                  >
                    <img src={UserAvatar} alt="" />

                    <div className="message_body">
                      <div className="message_author">
                        {messages.ownedByCurrentUser
                          ? "Aici punem data "
                          : messages.AuthorName}
                      </div>
                      <div className="message_text">
                        <p>{messages.body}</p>
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
            <div className="instrument">
              <MdIcons.MdTextFormat />
            </div>
            <div className="instrument">
              <IoIcons.IoIosAttach />
            </div>
            <div className="instrument">
              <BsIcons.BsEmojiSmile />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Room;
