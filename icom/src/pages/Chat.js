import React from "react";
import Navbar from "../components/Navbar";
import "../cssFiles/chat.css";
import UserAvatar from "../images/userAvatar.png";
import SearchIcon from "../images/Search_Icon.png";

function Chat() {
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
                className="search-button"
                src={SearchIcon}
                alt="search button jmecher jmecher"
              />
          </div>
          <div className="chat-persons">
            <div className="conversation">
              <img
                className="conversation-picture"
                src={UserAvatar}
                alt="userAvatar jmecher"
              />
              <div className="conversation-details-left">
                <div className="conversation-user-name">
                  Mihai Alexandru
                  <div className="conversation-last-seen">19:00</div>
                </div>
                <div className="last-message">How are you?</div>
              </div>
            </div>
            <div className="conversation">
              <img
                className="conversation-picture"
                src={UserAvatar}
                alt="userAvatar jmecher"
              />
            </div>
            <div className="conversation">
              <img
                className="conversation-picture"
                src={UserAvatar}
                alt="userAvatar jmecher"
              />
            </div>
            <div className="conversation">
              <img
                className="conversation-picture"
                src={UserAvatar}
                alt="userAvatar jmecher"
              />
            </div>
          </div>
        </div>
        <div className="right-section">
          <div className="conversation-details"></div>
          <div className="messages-coversation"></div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
