import { React, useState } from "react";
import Navbar from "../components/Navbar";
import "../cssFiles/chat.css";
import UserAvatar from "../images/userAvatar.png";
import SearchIcon from "../images/Search_Icon.png";

import groupAvatar from "../images/group.png";

import classNames from "classnames";

function Chat() {
  let isMe = true;

  const [
    newMsg = {
      author: `Author`,
      body: ``,
      avatar: UserAvatar,
      me: isMe,
    },
    UpdateMessage,
  ] = useState({
    author: `Author`,
    body: ``,
    avatar: UserAvatar,
    me: isMe,
  });

  const [messages, addMessages] = useState([]);

  function SendMessage() {
    addMessages((messages) => [...messages, newMsg]);
  }

  function GetMessageText(event) {
    UpdateMessage((newMsg) => ({...newMsg, body: event.target.value}))
  }

  return (
    <div className="page-content">
      <Navbar />
      <div className="chat-page">
        <div className="left-section">
          <div className="search-section">
            <input
              className="search-box"
              type="text"
              placeholder="  Search.."
            />

            <img
              className="search-button-icon"
              src={SearchIcon}
              alt="search button jmecher"
            />
          </div>
          <div className="chat-persons">
            <div className="conversation">
              <img
                className="conversation-picture"
                src={groupAvatar}
                alt="userAvatar jmecher"
              />
              <div className="conversation-details-left">
                <div className="conversation-header">
                  <div className="conversation-user-name">
                    <p>
                      Team 2 - Elaborare Proiect Diplomaaaaaaaaaaaabbbbbbbbb
                    </p>
                  </div>
                  <div className="conversation-last-seen">19:00</div>
                </div>
                <div className="last-message">
                  <p>
                    How are
                    youuuuuuuuuuuuuuuuuudddddddddddddddddddddddddddddddd?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right-section">
          <div className="messages-coversation">
            <div className="conversation-details"></div>
            <div className="messages-content">
              <div className="messages">
                {messages.map((messages, index) => {
                  return (
                    <div
                      key={index}
                      className={classNames("one_message", { me: messages.me })}
                    >
                      <div className="image_user_message">
                        <img src={messages.avatar} alt="" />
                      </div>
                      <div className="message_body">
                        <div className="message_author">
                          {messages.me ? "You " : messages.author} says:
                        </div>
                        <div className="message_text">
                          <p>{messages.body}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="messenger_input">
              <div className="text_input">
                <textarea
                  value={newMsg.body}
                  onChange={GetMessageText}
                  placeholder=" Write your message..."
                />
              </div>
              <div className="actions" onClick={SendMessage}>
                <button>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
