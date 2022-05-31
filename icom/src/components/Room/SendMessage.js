import React, { useState, useCallback, useEffect, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";
import Textarea from "react-expanding-textarea";
import socketIOClient from "socket.io-client";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPaperPlane,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import { InsertNewMessageLocal } from "../../actions/userActions";

import date from "date-and-time";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const { REACT_APP_API_URL } = process.env;

function SendMessage(props) {
  const { setReceiveNewMessage } = props;
  //
  const dispatch = useDispatch();
  const socketRef = useRef();
  const textareaRef = useRef(null);

  const [newMessage, setNewMessage] = useState("");
  const [send, setSend] = useState(false);

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID } = chatObj;

  const handleSendMessage = () => {
    setSend(true);
  };

  const handleChange = useCallback((e) => {
    if (e.key !== "Enter") setNewMessage(e.target.value.replace("\n", ""));
  }, []);

  function SendEnter(event) {
    if (event.key === "Enter") {
      handleSendMessage();
    }
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

  // send new message
  useEffect(() => {
    if (send === false || newMessage === "" || newMessage === " ") return;

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

    setSend(false);
    setNewMessage("");
  }, [send, newMessage]);

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

  return (
    <div className="messenger_input">
      <div className="text_input">
        <div className="actions">
          <Button variant="outline-light">
            <FontAwesomeIcon
              icon={faPaperclip}
              size="5x"
              className="folder-icon"
              style={{
                color: "#6f6f6f",
              }}
            />
          </Button>
        </div>
        <div className="actions">
          <Button variant="outline-light">
            <FontAwesomeIcon
              icon={faImage}
              size="5x"
              className="folder-icon"
              style={{
                color: "#6f6f6f",
              }}
            />
          </Button>
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
    </div>
  );
}

export default SendMessage;
