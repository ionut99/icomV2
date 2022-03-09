import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import groupAvatar from "../images/group.png";
import "../cssFiles/chat.css";

import { updateChannelID, resetPersonSearchList } from "./../actions/userActions";

function ClickHandler(ID, dispatch) {
  console.log("Button Click " + ID);
  dispatch(updateChannelID(ID));
  dispatch(resetPersonSearchList());
}

function ConversationList() {
  const dispatch = useDispatch();

  const chatObj = useSelector((state) => state.chatRedu);
  const { RoomSearchList } = chatObj;

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
            onClick={() => ClickHandler(RoomSearchList.RoomID, dispatch)}
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
