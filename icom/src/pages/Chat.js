import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { verifyTokenAsync } from "./../asyncActions/authAsyncActions";
import { setAuthToken } from "./../services/auth";
import moment from "moment";

import classNames from "classnames";

import useChat from "../components/useChat";
import Navbar from "../components/Navbar";
import ConversationList from "../components/ConversationList";

import SearchIcon from "@mui/icons-material/Search";

import UserAvatar from "../images/userAvatar.png";
import "../cssFiles/chat.css";
import PersonList from "../components/PersonList";

import { setUserSearchBoxContent } from "./../actions/userActions";

import {
  userResetRoomListAsync,
  userSearchPersonListAsync,
} from "../asyncActions/userAsyncActions";

function setSearchBoxContent(search_box_content, dispatch) {
  dispatch(setUserSearchBoxContent(search_box_content));
}

function Chat() {
  const dispatch = useDispatch();
  const authObj = useSelector((state) => state.auth);
  const { user, expiredAt, token } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID, search_box_content } = chatObj;
  console.log("canalul este + ", channelID);
  const { messages, sendMessage } = useChat(channelID, user.userId, user.name + " " + user.surname);
  const [newMessage, setNewMessage] = useState("");

  function SearchEnter(event) {
    if (event.key === "Enter") {
      getSearchUserList();
    }
  }
  const getSearchUserList = async () => {
    dispatch(userResetRoomListAsync(search_box_content, user.userId));
    dispatch(userSearchPersonListAsync(search_box_content, user.userId));
  };

  // set timer to renew token
  useEffect(() => {
    setAuthToken(token);
    const verifyTokenTimer = setTimeout(() => {
      dispatch(verifyTokenAsync(true));
    }, moment(expiredAt).diff() - 10 * 1000);
    return () => {
      clearTimeout(verifyTokenTimer);
    };
  }, [expiredAt, token, dispatch]);

  // get user list on page load
  useEffect(() => {
    getSearchUserList();
  }, []);

  const SearchPerson = (event) => {
    setSearchBoxContent(event.target.value, dispatch);
  };

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
    <div className="page-content">
      <Navbar />
      <div className="chat-page">
        <div className="left-section">
          <div className="search-section">
            <input
              className="search-box"
              type="text"
              placeholder="  Search.."
              value={search_box_content}
              onChange={SearchPerson}
              onKeyDown={SearchEnter}
            />
            <div className="search-button-icon">
              <SearchIcon
                className="search-button-icon"
                alt="search button jmecher"
                onClick={getSearchUserList}
              ></SearchIcon>
            </div>
          </div>
          <div className="chat-persons">
            {/* <pre>{JSON.stringify(userSearchList, null, 2)}</pre>
            <pre>{JSON.stringify(RoomSearchList, null, 2)}</pre> */}
            {/* <ConversationList RoomSearchList={RoomSearchList} /> exemplu pentru trimitere de argumente */}
            <ConversationList />
            <PersonList />
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
                      className={classNames("one_message", { 'me': messages.ownedByCurrentUser })}
                    >
                      <div className="image_user_message">
                        <img src={UserAvatar} alt="" />
                      </div>
                      <div className="message_body">
                        <div className="message_author">
                        {messages.ownedByCurrentUser ? 'Aici punem data ' : messages.AuthorName}
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
                  // value={newMsg.body}
                  // onChange={GetMessageText}
                  value={newMessage}
                  onChange={handleNewMessageChange}
                  placeholder=" Write your message..."
                />
              </div>
              <div className="actions" onClick={handleSendMessage}>
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
