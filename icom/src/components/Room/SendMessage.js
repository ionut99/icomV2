import React, { useState, useCallback, useEffect, useRef } from "react";

import { useSelector } from "react-redux";
import Textarea from "react-expanding-textarea";

import * as MdIcons from "react-icons/md";
import * as IoIcons from "react-icons/io";
import * as BsIcons from "react-icons/bs";

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

  //   const handleNewMessageChange = (event) => {
  //     setNewMessage(event.target.value);
  //   };

  const handleSendMessage = () => {
    if (newMessage !== "") {
      sendMessage(newMessage);
    }
    setNewMessage("");
  };

  const handleChange = useCallback((e) => {
    console.log("Changed value to: ", e.target.value);
  }, []);

  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  return (
    <div className="messenger_input">
      <div className="text_input">
        <div className="actions" onClick={() => {}}>
          <button>fis</button>
        </div>

        <div className="actions" onClick={() => {}}>
          <button>Img</button>
        </div>
        <Textarea
          // value={newMsg.body}
          // onChange={GetMessageText}
          // value={newMessage}
          className="custom-textarea"
          onChange={handleChange}
          defaultValue=" Write your message..."
          ref={textareaRef}
        />
        <div className="actions" onClick={handleSendMessage}>
          <button>Send</button>
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
