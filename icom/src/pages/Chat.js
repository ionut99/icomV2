import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import { verifyTokenAsync } from "./../asyncActions/authAsyncActions";
import { setUserSearchBoxContent } from "./../actions/userActions";
import { setAuthToken } from "./../services/auth";
import moment from "moment";

import {
  userSetRoomListAsync,
  userSearchPersonListAsync,
  CreateNewGroup,
} from "../asyncActions/userAsyncActions";

import ConversationList from "../components/Search/ConversationList";
import PersonList from "../components/Search/PersonList";
import Room from "../components/Room/Room";
import Navbar from "../components/Navbar";

import * as BsIcons from "react-icons/bs";
import * as AiIcons from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

import "../cssFiles/chat.css";

function setSearchBoxContent(search_box_content, dispatch) {
  dispatch(setUserSearchBoxContent(search_box_content));
}

function Chat() {
  const [newGroup, SetnewGroup] = useState(false);
  const [groupName, SetgroupName] = useState("");
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

  function CreateEnter(event) {
    if (event.key === "Enter") {
      CreateNewRoom();
    }
  }

  const CreateNewRoom = async () => {
    //e.preventDefault(); // help to prevent reload component
    if (groupName === "") {
      console.log("Nu s-a introdus niciun nume pentru noul grup!");
    }
    if (groupName !== "" && newGroup === true) {
      SetgroupName("");
      SetnewGroup(!newGroup);
      dispatch(CreateNewGroup(groupName, 0, user.userId, uuidv4()));
    }
  };

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
  }, [search_box_content]);

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
            <div className="conversation-options-button-icon">
              <AiIcons.AiOutlineSearch
                className="symbol"
                onClick={getSearchUserList}
              />
            </div>
            <div className="conversation-options-button-icon">
              <BsIcons.BsPlusCircle
                className="symbol"
                onClick={() => {
                  SetnewGroup(!newGroup);
                }}
              />
            </div>
          </div>
          <div className="chat-persons">
            <div
              className="new-group-name"
              style={{ display: newGroup ? "block" : "none" }}
            >
              <p>Enter New Channel Name:</p>
              <div className="input-section">
                <input
                  type="text"
                  value={groupName}
                  onChange={(event) => SetgroupName(event.target.value)}
                  onKeyDown={CreateEnter}
                />
                <button onClick={CreateNewRoom}>New</button>
              </div>
            </div>
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
