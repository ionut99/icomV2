import React, { useState, useCallback, useEffect, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";
import Textarea from "react-expanding-textarea";
import socketIOClient from "socket.io-client";
import { Modal, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faImage,
  faPaperPlane,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import {
  InsertNewMessageLocal,
  UpdateLastMessage,
} from "../../actions/userActions";

import { UploadFileForStoring } from "../../asyncActions/fileAsyncActions";
import date from "date-and-time";
const dayjs = require("dayjs");

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const { REACT_APP_API_URL } = process.env;

function SendMessage(props) {
  const { setReceiveNewMessage } = props;
  //
  const dispatch = useDispatch();
  const socketRef = useRef();
  const textareaRef = useRef(null);
  //
  //
  const [fileToSendInfo, setFileToSendInfo] = useState({
    currentFile: undefined,
    previewImage: undefined,
    name: "",
    size: 0,
    lastModified: "",
    type: "",
    progress: 0,
    message: "",
    fileInfos: [],
  });
  //

  const [newMessage, setNewMessage] = useState("");
  //
  const [open, setOpen] = useState(false);
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID, channelFolderId, currentChannelName } = chatObj;

  //
  function closeModal() {
    // delete old data
    setNewMessage("");
    setFileToSendInfo({
      currentFile: undefined,
      previewImage: undefined,
      name: "",
      size: 0,
      lastModified: "",
      type: "",
      progress: 0,
      message: "",
      fileInfos: [],
    });
    setOpen(false);
  }

  const handleChange = useCallback((e) => {
    if (e.key !== "Enter") setNewMessage(e.target.value.replace("\n", ""));
  }, []);

  function SendEnter(event) {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  }

  const handleInputChange = (event) => {
    // const imageFilname = event.target.files[0].name;
    // console.log(imageFilname);
    console.log("Structura fisier:");
    console.log(event.target.files[0]);
    //
    setFileToSendInfo({
      file: event.target.files[0],
      previewImage: URL.createObjectURL(event.target.files[0]),
      name: event.target.files[0].name,
      size: event.target.files[0].size,
      lastModified: event.target.files[0].lastModified,
      type: event.target.files[0].type,
      progress: 0,
      message: "",
    });

    setNewMessage(event.target.files[0].name);
    setOpen(true);
  };

  function handleSubmit(e) {
    e.preventDefault();
    // upload file here

    const createdTime = dayjs();

    dispatch(
      UploadFileForStoring(
        channelFolderId,
        user.userId,
        createdTime,
        fileToSendInfo.file
      )
    );
    handleSendMessage();
    closeModal();
  }

  // do link with socket ..
  useEffect(() => {
    if (channelID === null || channelID === undefined) return;
    socketRef.current = socketIOClient(REACT_APP_API_URL, {
      query: { channelID },
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [channelID]);

  // receive message from socket and insert in local messages list
  useEffect(() => {
    if (channelID === null) return;
    if (socketRef.current === null) return;

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      if (message.roomID != null) {
        setReceiveNewMessage(true);
        dispatch(
          InsertNewMessageLocal(
            message.ID_message,
            message.senderID,
            message.senderName,
            message.roomID,
            message.messageBody,
            message.createdTime
          )
        );
        dispatch(UpdateLastMessage(message.messageBody, message.roomID));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [channelID]);
  // receive message

  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  const handleSendMessage = () => {
    if (newMessage === "" || newMessage === " ") return;
    if (socketRef.current === null) return;
    //
    var dataToSend = {
      ID_message: uuidv4(),
      senderID: user.userId,
      senderName: user.surname + " " + user.name,
      roomID: channelID,
      messageBody: newMessage,
      createdTime: date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS"),
    };

    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, dataToSend);
    setNewMessage("");
  };

  return (
    <div className="messenger_input">
      <div className="text_input">
        <div className="actions">
          <Form.Group controlId="formFile">
            <Form.Label variant="outline-light" className="send_file">
              <FontAwesomeIcon
                icon={faPaperclip}
                size="5x"
                className="folder-icon"
                style={{
                  color: "#6f6f6f",
                }}
              ></FontAwesomeIcon>
            </Form.Label>
            <Form.Control type="file" onChange={handleInputChange} />
          </Form.Group>
        </div>
        <Textarea
          className="custom-textarea"
          onChange={handleChange}
          onKeyDown={SendEnter}
          value={newMessage}
          placeholder=" Write your message..."
          ref={textareaRef}
        />
        <div className="actions" onClick={handleSendMessage}>
          <Button variant="outline-light">
            <FontAwesomeIcon
              icon={faPaperPlane}
              size="5x"
              className="folder-icon"
              style={{
                color: "#0969da",
              }}
            />
          </Button>
        </div>
      </div>
      <Modal show={open} onHide={closeModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Send file to {currentChannelName}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <p>Name: {fileToSendInfo.name}</p>
            <p>Creation Date: {fileToSendInfo.lastModified}</p>
            <p>Size: {fileToSendInfo.size} Bytes</p>
            <p>Type: {fileToSendInfo.type}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={closeModal}>
              Discard
            </Button>
            <Button variant="outline-light" type="submit">
              <FontAwesomeIcon
                icon={faPaperPlane}
                size="5x"
                className="folder-icon"
                style={{
                  color: "#0969da",
                }}
              />
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default SendMessage;
