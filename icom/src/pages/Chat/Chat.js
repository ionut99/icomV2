import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, Form, Spinner } from "react-bootstrap";

import {
  setUserSearchBoxContent,
  UpdateAddUserInGroup,
  setPersonSearchList,
} from "../../actions/userActions";

import Navbar from "../../components/Navbar/Navbar";

import {
  userSetRoomListAsync,
  userSearchPersonListAsync,
  createNewGroup,
} from "../../asyncActions/userAsyncActions";

import ConversationList from "../../components/Search/ConversationList";
import PersonList from "../../components/Search/PersonList";
import Room from "../../components/Room/Room";

import * as BsIcons from "react-icons/bs";
import * as AiIcons from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

import "./chat.css";

function setSearchBoxContent(search_box_content, dispatch) {
  dispatch(setUserSearchBoxContent(search_box_content));
}

function Chat() {
  const dispatch = useDispatch();
  //
  const [newGroup, SetnewGroup] = useState(false);
  const [groupName, SetgroupName] = useState("");
  //
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  //
  const [loaded, setLoaded] = useState(false);
  //
  const [receiveNewMessage, setReceiveNewMessage] = useState(false);

  const chatObj = useSelector((state) => state.chatRedu);
  const { search_box_content, addUserInGroup } = chatObj;

  const handleCloseChannelOptions = () => {
    dispatch(UpdateAddUserInGroup(""));
    dispatch(setPersonSearchList([]));
    dispatch(setUserSearchBoxContent(""));
    dispatch(userSetRoomListAsync("", user.userId));
  };
  //
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
    dispatch(createNewGroup(groupName, 0, user.userId, uuidv4()));
    closeModal();
  }
  //
  const SearchPerson = (event) => {
    setSearchBoxContent(event.target.value, dispatch);
  };

  // get user list on page load
  useEffect(() => {
    getSearchUserList();
  }, [search_box_content]);

  useEffect(() => {
    setLoaded(true);
  }, []);

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
