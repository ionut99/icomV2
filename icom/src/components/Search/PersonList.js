import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../Avatar/Avatar";
import "./search.css";
import { Spinner } from "react-bootstrap";

import {
  setPersonSearchList,
  setUserSearchBoxContent,
  UpdateAddUserInGroup,
} from "../../actions/userActions";

import {
  updateChannelDetails,
  createNewConversation,
  addNewMemberInGroup,
} from "../../asyncActions/userAsyncActions";

import { v4 as uuidv4 } from "uuid";

function PersonList() {
  const dispatch = useDispatch();
  const chatObj = useSelector((state) => state.chatRedu);
  const { userSearchList, addUserInGroup, RoomSearchList } = chatObj;

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const [loaded, setLoaded] = useState(false);

  const handleClickPerson = (UserName, PersonID, thisName) => {
    if (addUserInGroup !== "") {
      ClickAddPersonInGroup(addUserInGroup, PersonID);
    } else {
      ClickPerson(UserName, PersonID, thisName);
    }
  };

  const ClickPerson = (userSearchListName, userSearchListID, userName) => {
    for (let i = 0; i < RoomSearchList.length; i++) {
      if (RoomSearchList[i]["RoomName"].includes(userSearchListName)) {
        dispatch(
          updateChannelDetails(RoomSearchList[i]["RoomID"], user.userId)
        );
        dispatch(setUserSearchBoxContent(""));
        dispatch(setPersonSearchList([]));
        return;
      }
    }

    dispatch(
      createNewConversation(
        userSearchListName + " # " + userName,
        1,
        userSearchListID,
        user.userId,
        uuidv4()
      )
    );
    // we don't update chanel right now because it s not created
    dispatch(setUserSearchBoxContent(""));
    dispatch(setPersonSearchList([]));
  };

  const ClickAddPersonInGroup = (RoomID, userSearchListID) => {
    dispatch(addNewMemberInGroup(RoomID, userSearchListID));
    dispatch(setPersonSearchList([]));
    dispatch(UpdateAddUserInGroup(""));
  };

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <div
        className="RoomDelimiter"
        style={{ display: userSearchList.length ? "flex" : "none" }}
      >
        <p>{addUserInGroup === "" ? "Persons" : "Participants"}</p>
      </div>
      {loaded ? (
        userSearchList.map((userSearchList, index) => {
          return (
            <div
              className="conversation"
              key={index}
              onClick={() =>
                handleClickPerson(
                  userSearchList.UserName,
                  userSearchList.userId,
                  user.surname + " " + user.name
                )
              }
            >
              <div className="user_picture">
                <Avatar userId={userSearchList.userId} roomId={null} />
              </div>
              <div className="conversation-details-left">
                <div className="conversation-header">
                  <div className="conversation-user-details">
                    <p>{userSearchList.UserName}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <Spinner animation="border" />
      )}
    </>
  );
}

export default PersonList;
