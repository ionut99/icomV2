import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import { useSelector } from "react-redux";
import Textarea from "react-expanding-textarea";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
//
//
import { v4 as uuidv4 } from "uuid";
import date from "date-and-time";

import { SocketContext } from "../../context/socket";
// import Secure from "../../helpers/Secure";
import SendFile from "./SendFile";

function SendMessage() {
  //
  const textareaRef = useRef(null);
  //
  // const socket = useContext(SocketContext);
  //
  const socketRef = useRef();
  socketRef.current = useContext(SocketContext);
  //
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  //
  const chatObj = useSelector((state) => state.chatRedu);
  const { channelId } = chatObj;
  //
  // const { GenerateDiffieHelmanKeys, getPublicKey, generateSharedKey } =
  //   Secure();
  //

  //
  const [newMessage, setNewMessage] = useState("");
  //

  const handleChange = useCallback((e) => {
    if (e.key !== "Enter") {
      setNewMessage(e.target.value.replace("\n", ""));
      const request = {
        userName: user.name,
        roomId: channelId,
        userId: user.userId,
      };
      //
      socketRef.current.emit("typing chat message", request);
    }
  }, []);

  function SendEnter(event) {
    if (event.key === "Enter") {
      handleSendMessage("text", undefined);
    }
  }

  const handleSendMessage = (messageType, fileId) => {
    if (newMessage === "" || newMessage === " ") return;
    if (socketRef.current === null) return;
    //

    // GenerateDiffieHelmanKeys();
    // getPublicKey();

    var request = {
      ID_message: uuidv4(),
      senderId: user.userId,
      senderName: user.surname + " " + user.name,
      roomId: channelId,
      body: newMessage,
      type: messageType,
      fileId: fileId,
      createdTime: date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS"),
    };

    socketRef.current.emit("send chat message", request);
    setNewMessage("");
  };

  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  return (
    <div className="messenger_input">
      <div className="text_input">
        <SendFile
          handleSendMessage={handleSendMessage}
          setNewMessage={setNewMessage}
        />
        <Textarea
          className="custom-textarea"
          onChange={handleChange}
          onKeyDown={SendEnter}
          value={newMessage}
          placeholder=" Write your message..."
          ref={textareaRef}
        />
        <div
          className="actions"
          onClick={() => handleSendMessage("text", undefined)}
        >
          <Button variant="outline-light">
            <FontAwesomeIcon
              icon={faPaperPlane}
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
