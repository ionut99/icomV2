import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { userLogout, verifyTokenEnd } from "./../actions/authActions";
import {
  getSearchPersonService,
  getSearchRoomService,
} from "./../services/user";
import { verifyTokenAsync } from "./../asyncActions/authAsyncActions";
import { setAuthToken } from "./../services/auth";
import moment from "moment";

import classNames from "classnames";

import useChat from "../components/useChat";
import Navbar from "../components/Navbar";

import SearchIcon from "@mui/icons-material/Search";
import UserAvatar from "../images/userAvatar.png";
import groupAvatar from "../images/group.png";
import "../cssFiles/chat.css";

function Chat() {
  const roomId = 1;
  let userName = "ionut";

  const dispatch = useDispatch();
  const authObj = useSelector((state) => state.auth);
  const { user, expiredAt, token } = authObj;

  const [search_box_content, Set_search_content] = useState("");

  const [userSearchList, setUserSearchList] = useState([]);
  const [RoomSearchList, setRoomSearchList] = useState([]);

  const { messages, sendMessage } = useChat(roomId, userName);
  const [newMessage, setNewMessage] = useState("");

  function SearchEnter(event) {
    if (event.key === "Enter") {
      getSearchUserList();
    }
  }
  // get user SEARCH list
  const getSearchUserList = async () => {
    const Roomresult = await getSearchRoomService(
      search_box_content,
      user.userId
    );
    const result = await getSearchPersonService(
      search_box_content,
      user.userId
    );
    if (result.error || Roomresult.error) {
      dispatch(verifyTokenEnd());
      if (result.response && [401, 403].includes(result.response.status))
        dispatch(userLogout());
      return;
    }
    setUserSearchList([]);
    setRoomSearchList([]);
    if (search_box_content !== "") {
      setUserSearchList(result.data["list"]);
    }

    setRoomSearchList(Roomresult.data["list"]);
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
    Set_search_content(event.target.value);
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
            <div
              className="RoomDelimiter"
              style={{ display: RoomSearchList.length ? "flex" : "none" }}
            >
              <p>Conversations</p>
            </div>
            {RoomSearchList.map((RoomSearchList, index) => {
              return (
                <div className="conversation" key={index}>
                  <img
                    className="conversation-picture"
                    src={groupAvatar}
                    alt="userAvatar jmecher"
                  />
                  <div className="conversation-details-left">
                    <div className="conversation-header">
                      <div className="conversation-user-name">
                        <p>{RoomSearchList.RoomName}</p>
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
              );
            })}
            <div
              className="RoomDelimiter"
              style={{ display: userSearchList.length ? "flex" : "none" }}
            >
              <p>Persons</p>
            </div>
            {userSearchList.map((userSearchList, index) => {
              return (
                <div className="conversation" key={index}>
                  <img
                    className="conversation-picture"
                    src={groupAvatar}
                    alt="userAvatar jmecher"
                  />
                  <div className="conversation-details-left">
                    <div className="conversation-header">
                      <div className="conversation-user-name">
                        <p>{userSearchList.UserName}</p>
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
              );
            })}
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
                      // className={classNames("one_message", { me: messages.me })}
                      className={classNames("one_message", { me: true })}
                    >
                      <div className="image_user_message">
                        <img src={UserAvatar} alt="" />
                      </div>
                      <div className="message_body">
                        <div className="message_author">
                          {/* {messages.me ? "You " : messages.author} says: */}
                          {true ? "You " : messages.author} says:
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
