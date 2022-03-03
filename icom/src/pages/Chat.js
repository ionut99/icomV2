import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { userLogout, verifyTokenEnd } from "./../actions/authActions";
import { getSearchPersonService } from "./../services/user";
import classNames from "classnames";

import useChat from "../components/useChat";
import Navbar from "../components/Navbar";

import SearchIcon from "@mui/icons-material/Search";
import UserAvatar from "../images/userAvatar.png";
import groupAvatar from "../images/group.png";
import "../cssFiles/chat.css";

// import SearchIcon from "../images/Search_Icon.png";

function Chat() {
  const roomId = 1;
  let userName = "ionut";

  const dispatch = useDispatch();

  const [search_box_content, Set_search_content] = React.useState("");
  const [err_messages, Set_err_messages] = React.useState("");

  const [userSearchList, setUserSearchList] = useState([]);
  const { messages, sendMessage } = useChat(roomId, userName);
  const [newMessage, setNewMessage] = React.useState("");


  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  // get user SEARCH list
  const getSearchUserList = async () => {
    const result = await getSearchPersonService(search_box_content, user.userId);
    Set_search_content("");
    if (result.error) {
      dispatch(verifyTokenEnd());
      if (result.response && [401, 403].includes(result.response.status))
        dispatch(userLogout());
      if (result.response && [400].includes(result.response.status))
        //Set_err_messages(result.data);
        setUserSearchList([]); // TO DO - modify in error div 
      Set_search_content("");
      return;
    }
    console.log(result.data);
    setUserSearchList(result.data);
  };

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
            <pre>{JSON.stringify(userSearchList, null, 2)}</pre>
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
