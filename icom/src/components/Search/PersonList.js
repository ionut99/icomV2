import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import groupAvatar from "../../images/group.png";
import "./search.css";

import {
  resetUserSearchBoxContent,
  resetPersonSearchList,
  setNewRoomInList,
  updateChannelID,
} from "../../actions/userActions";

import { userResetRoomListAsync } from "../../asyncActions/userAsyncActions";

function ClickHandler(
  wantedUserID,
  wantedUserName,
  userThatWantID,
  ChannelID,
  dispatch
) {
  dispatch(userResetRoomListAsync(" ", userThatWantID));

  dispatch(setNewRoomInList(wantedUserName, wantedUserID));

  dispatch(updateChannelID(ChannelID));

  dispatch(resetUserSearchBoxContent());
  dispatch(resetPersonSearchList());
}

function PersonList() {
  const dispatch = useDispatch();

  const chatObj = useSelector((state) => state.chatRedu);
  const { userSearchList, newRoomID } = chatObj;

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
                userSearchList.userId,
                userSearchList.UserName,
                user.userId,
                newRoomID,
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
                  <div className="last-message">
                    <p>
                      How are
                      youuuuuuuuuuuuuuuuuudddddddddddddddddddddddddddddddd?
                    </p>
                  </div>
                </div>
                <div className="more_options">
                  <MoreHorizIcon
                    sx={{ fontSize: 30, color: "green" }}
                    className="MoreHorizIcon"
                  ></MoreHorizIcon>
                  <div className="conversation-last-seen">19:00</div>
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
