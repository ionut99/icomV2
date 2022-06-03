import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useRef, useContext } from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
// import socketIOClient from "socket.io-client";

import { verifyTokenAsync } from "../../asyncActions/authAsyncActions";
import {
  setUserSearchBoxContent,
  UpdateAddUserInGroup,
  setPersonSearchList,
  InsertNewMessageLocal,
  UpdateLastMessage,
} from "../../actions/userActions";
import { setAuthToken } from "../../services/auth";
import Navbar from "../../components/Navbar/Navbar";

import moment from "moment";

import {
  userSetRoomListAsync,
  userSearchPersonListAsync,
  CreateNewGroup,
} from "../../asyncActions/userAsyncActions";

import { getActiveRoomsService } from "../../services/user";

import ConversationList from "../../components/Search/ConversationList";
import PersonList from "../../components/Search/PersonList";
import Room from "../../components/Room/Room";

import * as BsIcons from "react-icons/bs";
import * as AiIcons from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

import { SocketContext } from "../../context/socket";

import "./chat.css";

function setSearchBoxContent(search_box_content, dispatch) {
  dispatch(setUserSearchBoxContent(search_box_content));
}

// const { REACT_APP_API_URL } = process.env;

// export socket for use in SendMessage.js
// export const socket = socketIOClient(REACT_APP_API_URL);
//

function Chat() {
  const dispatch = useDispatch();

  const socket = useContext(SocketContext);
  //
  const [newGroup, SetnewGroup] = useState(false);
  const [groupName, SetgroupName] = useState("");
  //
  const authObj = useSelector((state) => state.auth);
  const { user, expiredAt, token } = authObj;
  //
  const [loaded, setLoaded] = useState(false);
  //
  const [receiveNewMessage, setReceiveNewMessage] = useState(false);

  const chatObj = useSelector((state) => state.chatRedu);
  const { search_box_content, addUserInGroup, channelID } = chatObj;

  const handleCloseChannelOptions = () => {
    dispatch(UpdateAddUserInGroup(""));
    dispatch(setPersonSearchList([]));
    dispatch(setUserSearchBoxContent(""));
    dispatch(userSetRoomListAsync("", user.userId));
  };
  function SearchEnter(event) {
    if (event.key === "Enter") {
      getSearchUserList();
    }
  }

  const getSearchUserList = async () => {
    dispatch(userSetRoomListAsync(search_box_content, user.userId));
    dispatch(userSearchPersonListAsync(search_box_content, user.userId));
  };

  function closeModal() {
    // delete old data
    SetgroupName("");
    SetnewGroup(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    //
    dispatch(CreateNewGroup(groupName, 0, user.userId, uuidv4()));
    closeModal();
  }
  //
  const SearchPerson = (event) => {
    setSearchBoxContent(event.target.value, dispatch);
  };
  // set timer to renew token
  useEffect(() => {
    setAuthToken(token);
    const verifyTokenTimer = setTimeout(() => {
      dispatch(verifyTokenAsync(true));
    }, moment(expiredAt).diff() - 10 * 1000);
    return () => {
      clearTimeout(verifyTokenTimer);
    };
  }, [expiredAt, token, dispatch]);

  // get user list on page load
  useEffect(() => {
    getSearchUserList();
  }, [search_box_content]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // // do link with socket ..
  // useEffect(() => {
  //   console.log("incarca chat page!");
  //   //
  //   const getConnections = async (userId) => {
  //     const channelsList = await getActiveRoomsService(userId);
  //     return channelsList.data["activeRoomConnections"];
  //   };

  //   getConnections(user.userId).then((activeConnections) => {
  //     for (let i = 0; i < activeConnections.length; i++) {
  //       if (
  //         activeConnections[i].RoomID === undefined ||
  //         activeConnections[i].RoomID === ""
  //       )
  //         continue;
  //       const request = {
  //         userID: user.userId,
  //         roomID: activeConnections[i].RoomID,
  //         type: "chat",
  //       };
  //       //
  //       console.log("alerta...");
  //       socket.emit("join chat room", request, (error) => {
  //         if (error) {
  //           alert(error);
  //         }
  //       });
  //     }
  //   });
  //   //
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [socket]);

  //
  // receive message from socket and insert in local messages list
  useEffect(() => {
    if (channelID === null) return;
    if (socket === null) return;

    socket.on("send chat message", (message) => {
      if (message.roomID != null) {
        dispatch(UpdateLastMessage(message.messageBody, message.roomID));
        if (message.roomID === channelID) {
          dispatch(InsertNewMessageLocal(message));
          setReceiveNewMessage(true);
        }
      }
    });
  }, [channelID]);
  // receive message
  //

  return (
    <div className="page">
      <Navbar />
      <div className="chat-page">
        <div className="left-section">
          <div className="search-section">
            <input
              className="search-box"
              type="text"
              placeholder="  Search.."
              value={search_box_content}
              onChange={SearchPerson}
              onKeyDown={SearchEnter}
            />
            <div className="conversation-options-button-icon">
              <AiIcons.AiOutlineSearch
                className="symbol"
                onClick={getSearchUserList}
              />
            </div>
            <div className="conversation-options-button-icon">
              <BsIcons.BsPlusCircle
                className="symbol"
                onClick={() => {
                  SetnewGroup(true);
                }}
              />
            </div>
          </div>
          <div className="chat-persons">
            <Button
              className="back-button"
              onClick={() => handleCloseChannelOptions()}
              variant="outline-success"
              style={{
                display: addUserInGroup !== "" ? "block" : "none",
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-100 h-100" />
            </Button>
            <Modal show={newGroup} onHide={closeModal}>
              <Form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group>
                    <Form.Label>Enter New Channel Name:</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={groupName}
                      onChange={(event) => SetgroupName(event.target.value)}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={closeModal}>
                    Close
                  </Button>
                  <Button variant="success" type="submit">
                    Create New Group
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
            {loaded ? <ConversationList /> : <Spinner animation="border" />}
            {loaded ? <PersonList /> : <Spinner animation="border" />}
          </div>
        </div>
        <Room
          receiveNewMessage={receiveNewMessage}
          setReceiveNewMessage={setReceiveNewMessage}
        />
      </div>
    </div>
  );
}

export default Chat;
