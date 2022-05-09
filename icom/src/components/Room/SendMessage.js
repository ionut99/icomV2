import React, { useState, useCallback, useEffect, useRef } from "react";

import { useSelector } from "react-redux";
import Textarea from "react-expanding-textarea";

import * as MdIcons from "react-icons/md";
import * as IoIcons from "react-icons/io";
import * as BsIcons from "react-icons/bs";
import { Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPaperPlane,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import Comunication from "../../services/comunication";

function SendMessage() {
  const textareaRef = useRef(null);

  // redux information
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID } = chatObj;

  // send message function
  const { sendMessage } = Comunication(channelID, user.userId);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage !== "") {
      sendMessage(newMessage);
    }
    setNewMessage("");
  };

  const handleChange = useCallback((e) => {
    if (e.key !== "Enter") setNewMessage(e.target.value.replace("\n", ""));
  }, []);

  function SendEnter(event) {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  }

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
      {/* <div className="toolbar-send">
          <div className="write-instrument">
            <MdIcons.MdTextFormat />
          </div>
          <div className="write-instrument">
            <IoIcons.IoIosAttach />
          </div>
          <div className="write-instrument">
            <BsIcons.BsEmojiSmile />
          </div>
        </div> */}
    </div>
  );
}

export default SendMessage;
