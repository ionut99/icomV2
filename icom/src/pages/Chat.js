import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { verifyTokenAsync } from "./../asyncActions/authAsyncActions";
import { setUserSearchBoxContent } from "./../actions/userActions";
import { setAuthToken } from "./../services/auth";
import moment from "moment";

import {
  userSetRoomListAsync,
  userSearchPersonListAsync,
} from "../asyncActions/userAsyncActions";

import ConversationList from "../components/Search/ConversationList";
import PersonList from "../components/Search/PersonList";
import Room from "../components/Room/Room";
import Navbar from "../components/Navbar";

import SearchIcon from "@mui/icons-material/Search";
import "../cssFiles/chat.css";

function setSearchBoxContent(search_box_content, dispatch) {
  dispatch(setUserSearchBoxContent(search_box_content));
}

function Chat() {
  const dispatch = useDispatch();
  const authObj = useSelector((state) => state.auth);
  const { user, expiredAt, token } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { search_box_content } = chatObj;

  function SearchEnter(event) {
    if (event.key === "Enter") {
      getSearchUserList();
    }
  }
  const getSearchUserList = async () => {
    dispatch(userSetRoomListAsync(search_box_content, user.userId));
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
        <Room />
      </div>
    </div>
  );
}

export default Chat;
