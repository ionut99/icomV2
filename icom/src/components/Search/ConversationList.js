import React, { useState } from "react";
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

function ClickHandler(roomID, userThatWantID, selectedRoomName, dispatch) {
  dispatch(updateChannelDetails(roomID, selectedRoomName));
  dispatch(userResetRoomListAsync(" ", userThatWantID));

  dispatch(resetUserSearchBoxContent());
  dispatch(resetPersonSearchList());
}

function ConversationList() {
  const dispatch = useDispatch();

  const chatObj = useSelector((state) => state.chatRedu);
  const { RoomSearchList } = chatObj;

  console.log("Lista de convorbiri:");
  console.log(RoomSearchList);

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const [dropdownMenu, setdropdownMenu] = useState(false);

  const showdropdownMenu = () => setdropdownMenu(!dropdownMenu);

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
          <>
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
                      onClick={showdropdownMenu}
                    ></MoreHorizIcon>
                    <div className="conversation-last-seen">19:00</div>
                  </div>
                </div>
              </div>
            </div>
            <nav className={dropdownMenu ? "room-menu active" : "room-menu"}>
              <ul className="drop-down-menu-items">
                <div className="dropdown-options">Profile</div>

                <div className="dropdown-options">
                  <div>
                    <input type="button" value="Delete" />
                  </div>
                </div>
              </ul>
            </nav>
          </>
        );
      })}
    </>
  );
}

export default ConversationList;
