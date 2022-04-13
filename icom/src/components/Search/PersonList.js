import React from "react";
import { useSelector } from "react-redux";
// import groupAvatar from "../../images/group.png";
import "./search.css";

import SearchService from "./searchService.js";
import * as AiIcons from "react-icons/ai";
import Avatar from "./Avatar";

function PersonList() {
  const chatObj = useSelector((state) => state.chatRedu);
  const { userSearchList, addUserInGroup } = chatObj;

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const { ClickPerson, ClickAddPersonInGroup, CloseChannelOptions } =
    SearchService(user.userId);

  const handleClickPerson = (UserName, PersonID, thisName) => {
    if (addUserInGroup !== "") {
      ClickAddPersonInGroup(addUserInGroup, PersonID);
    } else {
      ClickPerson(UserName, PersonID, thisName);
    }
  };

  const handleCloseChannelOptions = () => {
    CloseChannelOptions();
  };
  return (
    <>
      <div
        className="RoomDelimiter"
        style={{ display: userSearchList.length ? "flex" : "none" }}
      >
        <div className="close-person-list">
          <AiIcons.AiOutlineCloseCircle
            className="symbol"
            onClick={handleCloseChannelOptions}
          />
        </div>
        <p>{addUserInGroup === "" ? "Persons" : "Participants"}</p>
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
            <Avatar
              userID={userSearchList.userId}
              roomID={null}
              atuhUser={user.userId}
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
