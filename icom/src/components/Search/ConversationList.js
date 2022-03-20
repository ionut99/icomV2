import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import groupAvatar from "../../images/group.png";
import "./search.css";

import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";

import {
  setPersonSearchList,
  setUserSearchBoxContent,
  updateCurrentChannel,
} from "../../actions/userActions";

import {
  updateChannelDetails,
  DeleteConversation,
  userSetRoomListAsync,
} from "../../asyncActions/userAsyncActions";

import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

function ClickHandler(roomID, userID, selectedRoomName, dispatch) {
  dispatch(updateChannelDetails(roomID, selectedRoomName));

  dispatch(userSetRoomListAsync(" ", userID));
  dispatch(setUserSearchBoxContent(""));
  dispatch(setPersonSearchList([]));
}

function ConversationList() {
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const dispatch = useDispatch();

  const chatObj = useSelector((state) => state.chatRedu);
  const { RoomSearchList } = chatObj;

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  // delete room function -- start
  const onDelete = (RoomID) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    dispatch(DeleteConversation(RoomID, user.userId));
    dispatch(updateCurrentChannel(null, "", []));
  };
  // delete room function --end
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
                  <div className="dropdown">
                    <MoreHorizIcon
                      sx={{ fontSize: 30, color: "green" }}
                      className="MoreHorizIcon"
                    ></MoreHorizIcon>

                    <div className="dropdown-content">
                      <div
                        className="dropdown-instrument"
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: "Are you sure to delete this record?",
                            subTitle: "You can't undo this operation",
                            onConfirm: () => {
                              onDelete(RoomSearchList.RoomID);
                            },
                          });
                        }}
                      >
                        <MdIcons.MdDeleteOutline size={20} />
                        <p>Delete Channel</p>
                      </div>
                      <div className="dropdown-instrument">
                        <AiIcons.AiOutlinePushpin size={20} />
                        <p>Pin</p>
                      </div>
                    </div>
                  </div>
                  <div className="conversation-last-seen">19:00</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}

export default ConversationList;
