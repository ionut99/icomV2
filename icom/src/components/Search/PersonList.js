import React from "react";
import { useSelector } from "react-redux";
import SearchService from "./searchService.js";
import Avatar from "./Avatar";
import "./search.css";

function PersonList() {
  const chatObj = useSelector((state) => state.chatRedu);
  const { userSearchList, addUserInGroup } = chatObj;

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const { ClickPerson, ClickAddPersonInGroup } = SearchService(user.userId);

  const handleClickPerson = (UserName, PersonID, thisName) => {
    if (addUserInGroup !== "") {
      ClickAddPersonInGroup(addUserInGroup, PersonID);
    } else {
      ClickPerson(UserName, PersonID, thisName);
    }
  };

  return (
    <>
      <div
        className="RoomDelimiter"
        style={{ display: userSearchList.length ? "flex" : "none" }}
      >
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
      })}
    </>
  );
}

export default PersonList;
