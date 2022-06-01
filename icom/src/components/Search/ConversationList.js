import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import "./search.css";
import { Spinner } from "react-bootstrap";
import { Button, Modal, Form } from "react-bootstrap";

import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import SearchService from "./searchService.js";

import Conversation from "./Conversation";

const ConversationList = () => {
  const chatObj = useSelector((state) => state.chatRedu);
  const { RoomSearchList, addUserInGroup } = chatObj;

  const [open, setOpen] = useState(false);
  const [currentChannel, setCurrentChannel] = useState({
    name: undefined,
    id: undefined,
  });
  const [loaded, setLoaded] = useState(false);
  //

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const { onDelete } = SearchService(user.userId);

  function handleSubmit(e) {
    e.preventDefault();
    if (currentChannel.name === undefined || currentChannel.id === undefined)
      return;
    onDelete(currentChannel.id);
    closeModal();
  }

  function closeModal() {
    // delete old data
    setCurrentChannel({
      name: undefined,
      id: undefined,
    });
    setOpen(false);
  }

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      style={{
        display:
          addUserInGroup === "" && RoomSearchList.length ? "block" : "none",
      }}
    >
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            Delete Conversation with {currentChannel.name}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              No
            </Button>
            <Button variant="outline-danger" type="submit">
              Delete
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <div className="RoomDelimiter">
        <p>Conversations</p>
      </div>

      {loaded ? (
        RoomSearchList.map((channel, index) => {
          return (
            <Conversation
              key={index}
              channel={channel}
              setOpen={setOpen}
              setCurrentChannel={setCurrentChannel}
            />
          );
        })
      ) : (
        <Spinner animation="border" />
      )}
    </div>
  );
};

export default ConversationList;
