import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./search.css";
import { Spinner } from "react-bootstrap";
import { Button, Modal, Form } from "react-bootstrap";

import { deleteConversation } from "../../asyncActions/userAsyncActions";
import { updateCurrentChannel } from "../../actions/userActions";
import Conversation from "./Conversation";

const ConversationList = () => {
  const dispatch = useDispatch();

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

  function handleSubmitDeleteGroup(e) {
    e.preventDefault();
    if (currentChannel.name === undefined || currentChannel.id === undefined)
      return;

    dispatch(deleteConversation(currentChannel.id, user.userId));
    dispatch(updateCurrentChannel(null, "", []));
    closeModal();
  }

  function closeModal() {
    // clean data
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
        <Form onSubmit={handleSubmitDeleteGroup}>
          <Modal.Header closeButton>
            <Modal.Title>
              Delete Conversation with {currentChannel.name}?
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={closeModal}>
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
