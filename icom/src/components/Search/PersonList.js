import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import groupAvatar from "../../images/group.png";
import "./search.css";

import {
  CreateNewConversation,
  updateChannelDetails,
} from "../../asyncActions/userAsyncActions";

import {
  setUserSearchBoxContent,
  setPersonSearchList,
} from "../../actions/userActions";

import { v4 as uuidv4 } from "uuid";

function ClickHandler(
  userSearchListName,
  userSearchListID,
  userName,
  userID,
  dispatch
) {
  var uuidRoom = uuidv4(); // pentru coduri unice
  dispatch(
    CreateNewConversation(
      userSearchListName + " # " + userName,
      1,
      userSearchListID,
      userID,
      uuidRoom
    )
  );
  dispatch(updateChannelDetails(uuidRoom, userSearchListName));
  dispatch(setUserSearchBoxContent(""));
  dispatch(setPersonSearchList([]));
}

function PersonList() {
  const dispatch = useDispatch();

  const chatObj = useSelector((state) => state.chatRedu);
  const { userSearchList } = chatObj;

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  return (
    <>
      <div
        className="RoomDelimiter"
        style={{ display: userSearchList.length ? "flex" : "none" }}
      >
        <p>Persons</p>
      </div>
      {userSearchList.map((userSearchList, index) => {
        return (
          <div
            className="conversation"
            key={index}
            onClick={() =>
              ClickHandler(
                userSearchList.UserName,
                userSearchList.userId,
                user.surname + " " + user.name,
                user.userId,
                dispatch
              )
            }
          >
            <img
              className="conversation-picture"
              src={groupAvatar}
              alt="userAvatar jmecher"
            />
            <div className="conversation-details-left">
              <div className="conversation-header">
                <div className="conversation-user-details">
                  <p>{userSearchList.UserName}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default PersonList;
