import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import groupAvatar from "../../images/group.png";
import "./search.css";

import {
  resetPersonSearchList,
  resetUserSearchBoxContent,
} from "../../actions/userActions";

import {
  userResetRoomListAsync,
  updateChannelDetails,
} from "../../asyncActions/userAsyncActions";

function ClickHandler(ID, userThatWantID, selectedRoomName, dispatch) {
  dispatch(updateChannelDetails(ID, selectedRoomName));
  //dispatch(updateCurrentChannel(ID, selectedRoomName));
  // de modificat!!!!
  dispatch(userResetRoomListAsync(" ", userThatWantID));

  dispatch(resetUserSearchBoxContent());
  dispatch(resetPersonSearchList());
}

function ConversationList() {
  const dispatch = useDispatch();

  const chatObj = useSelector((state) => state.chatRedu);
  const { RoomSearchList, newRoomID, newRoomName, personSelectedID } = chatObj;

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  var ok = true;
  for (let i = 0; i < RoomSearchList.length; i++) {
    if (RoomSearchList[i].RoomName === newRoomName) {
      ok = false;
    }
  }
  if (ok && newRoomName !== "" && personSelectedID !== null) {
    RoomSearchList.push({ RoomID: newRoomID, RoomName: newRoomName });
  }

  return (
    <>
      <div
        className="RoomDelimiter"
        style={{ display: RoomSearchList.length ? "flex" : "none" }}
      >
        <p>Conversations</p>
      </div>
      {RoomSearchList.map((RoomSearchList, index) => {
        return (
          <div
            className="conversation"
            key={index}
            onClick={() =>
              ClickHandler(
                RoomSearchList.RoomID,
                user.userId,
                RoomSearchList.RoomName,
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
                  <p>{RoomSearchList.RoomName}</p>
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

export default ConversationList;
