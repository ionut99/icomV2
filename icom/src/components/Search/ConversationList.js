import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import groupAvatar from "../../images/group.png";
import "./search.css";

import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";

import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import SearchService from "./searchService.js";

const ConversationList = () => {
  const dispatch = useDispatch();

  const chatObj = useSelector((state) => state.chatRedu);
  const { RoomSearchList, addUserInGroup } = chatObj;

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const { 
    ClickChannel,
    onAddUser,
    onDelete,
    setConfirmDialog,
    ShowParticipants,
    confirmDialog,
  } = SearchService(user.userId);

  const handleAddUserInGroup = (RoomID) => {
    onAddUser(RoomID);
  };
  const handleDeleteUser = (RoomID) => {
    onDelete(RoomID);
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
                              handleDeleteUser(RoomSearchList.RoomID);
                            },
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
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
};

export default ConversationList;
