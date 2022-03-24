import React from "react";
import { useSelector } from "react-redux";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import groupAvatar from "../../images/group.png";
import "./search.css";

import SearchService from "./searchService.js";

function PersonList() {
  const chatObj = useSelector((state) => state.chatRedu);
  const { userSearchList, addUserInGroup } = chatObj;

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const { ClickPerson, ClickAddPersonInGroup } = SearchService(user.userId);

  const handleClickPerson = (UserName, PersonID, thisName) => {
    if (addUserInGroup === "") {
      ClickPerson(UserName, PersonID, thisName);
    } else {
      ClickAddPersonInGroup(addUserInGroup, PersonID);
    }
  };
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
              handleClickPerson(
                userSearchList.UserName,
                userSearchList.userId,
                user.surname + " " + user.name
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
