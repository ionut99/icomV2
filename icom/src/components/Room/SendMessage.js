import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import { useSelector } from "react-redux";
import Textarea from "react-expanding-textarea";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { handleReturnHumanDateFormat } from "../../helpers/FileIcons";
//
//
import { v4 as uuidv4 } from "uuid";
import date from "date-and-time";

import { SocketContext } from "../../context/socket";
import Secure from "../../helpers/Secure";
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
  const { channelID } = chatObj;
  //
  const { GenerateDiffieHelmanKeys, getPublicKey, generateSharedKey } =
    Secure();
  //

  //
  const [newMessage, setNewMessage] = useState("");
  //
  const [open, setOpen] = useState(false);
  //
  const [preview, setPreview] = useState(false);
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

  const handleChange = useCallback((e) => {
    if (e.key !== "Enter") {
      setNewMessage(e.target.value.replace("\n", ""));
      const request = {
        roomID: channelID,
        userID: user.userId,
        userName: user.name,
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

  //
  const handleInputChange = (event) => {
    if (event.target.files[0].name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|gif)$/))
      setPreview(true);
    else setPreview(false);
    //
    setFileToSendInfo({
      file: event.target.files[0],
      previewImage: URL.createObjectURL(event.target.files[0]),
      name: event.target.files[0].name,
      size: event.target.files[0].size,
      lastModified: handleReturnHumanDateFormat(
        event.target.files[0].lastModified
      ),
      type: event.target.files[0].type,
      progress: 0,
      message: "",
    });

    setNewMessage(event.target.files[0].name);
    setOpen(true);
  };

  const handleSendMessage = (messageType, fileId) => {
    if (newMessage === "" || newMessage === " ") return;
    if (socketRef.current === null) return;
    //

    // GenerateDiffieHelmanKeys();
    // getPublicKey();

    var request = {
      ID_message: uuidv4(),
      senderID: user.userId,
      senderName: user.surname + " " + user.name,
      roomID: channelID,
      messageBody: newMessage,
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
      <SendFile
        open={open}
        preview={preview}
        fileToSendInfo={fileToSendInfo}
        setOpen={setOpen}
        handleSendMessage={handleSendMessage}
        setNewMessage={setNewMessage}
        setFileToSendInfo={setFileToSendInfo}
      />
    </div>
  );
}

export default SendMessage;
