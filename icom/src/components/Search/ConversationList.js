import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import groupAvatar from "../../images/group.png";
import "./search.css";

import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";

import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import SearchService from "./searchService.js";

import Avatar from "../Search/Avatar";

const ConversationList = () => {
  const dispatch = useDispatch();

  // const [exist, setExist] = useState(false);

  const chatObj = useSelector((state) => state.chatRedu);
  const { RoomSearchList, addUserInGroup, channelID } = chatObj;

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const {
    ClickChannel,
    onAddUser,
    onDelete,
    setConfirmDialog,
    ShowParticipants,
    // CloseChannelOptions,
    confirmDialog,
  } = SearchService(user.userId);

  const handleAddUserInGroup = (RoomID) => {
    onAddUser(RoomID);
  };
  const handleDeleteUser = () => {
    onDelete(channelID);
  };

  const handleShowParticipants = (RoomID) => {
    ShowParticipants(RoomID);
  };

  return (
    <div
      style={{
        display:
          addUserInGroup === "" && RoomSearchList.length ? "block" : "none",
      }}
    >
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
        confirmAction={handleDeleteUser}
      />
      <div className="RoomDelimiter">
        <p>Conversations</p>
      </div>
      {RoomSearchList.map((RoomSearchList, index) => {
        return (
          <div
            className="conversation"
            key={index}
            onClick={() =>
              ClickChannel(
                RoomSearchList.RoomID,
                RoomSearchList.RoomName,
                dispatch
              )
            }
          >
            <div className="user_picture">
              <Avatar userId={user.userId} roomId={RoomSearchList.RoomID} />
            </div>

            <div className="conversation-details-left">
              <div className="conversation-header">
                <div className="conversation-user-details">
                  <div className="name">
                    <p>{RoomSearchList.RoomName}</p>
                  </div>
                  <div className="last-message">
                    <p>
                      Laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaast
                      Messageeeeeeeeeeeee
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
                          });
                        }}
                      >
                        <MdIcons.MdDeleteOutline size={20} />
                        <p>Delete Channel</p>
                      </div>
                      <div
                        className="dropdown-instrument"
                        style={{
                          display: RoomSearchList.Type ? "none" : "flex",
                        }}
                        onClick={() =>
                          handleAddUserInGroup(RoomSearchList.RoomID)
                        }
                      >
                        <AiIcons.AiOutlineUserAdd size={20} />
                        <p>Add User</p>
                      </div>
                      <div
                        className="dropdown-instrument"
                        style={{
                          display: RoomSearchList.Type ? "none" : "flex",
                        }}
                        onClick={() =>
                          handleShowParticipants(RoomSearchList.RoomID)
                        }
                      >
                        <BsIcons.BsPeople size={20} />
                        <p>Participants</p>
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
    </div>
  );
};

export default ConversationList;
