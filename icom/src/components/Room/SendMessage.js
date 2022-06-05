import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Textarea from "react-expanding-textarea";
import { Modal, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { handleReturnFileIcon } from "../../helpers/FileIcons";
import { UploadFileForStoring } from "../../asyncActions/fileAsyncActions";
import { handleReturnHumanDateFormat } from "../../helpers/FileIcons";
//
import { SocketContext } from "../../context/socket";

//
import { v4 as uuidv4 } from "uuid";
import date from "date-and-time";

import Secure from "../../helpers/Secure";

function SendMessage() {
  //
  const dispatch = useDispatch();
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
  const { channelID, channelFolderId, currentChannelName } = chatObj;
  //
  const { GenerateDiffieHelmanKeys, getPublicKey, generateSharedKey } =
    Secure();
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
  const [preview, setPreview] = useState(false);
  //
  const [newMessage, setNewMessage] = useState("");
  //
  const [open, setOpen] = useState(false);

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
      handleSendMessage("text", undefined);
    }
  }

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

  function handleSubmit(e) {
    e.preventDefault();
    // send file to server
    const createdTime = date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS");
    const fileId = uuidv4();

    dispatch(
      UploadFileForStoring(
        channelFolderId,
        user.userId,
        createdTime,
        fileId,
        fileToSendInfo.file
      )
    );
    // to do, verify if upload succed...
    handleSendMessage(fileToSendInfo.type, fileId);
    closeModal();
  }

  const handleSendMessage = (messageType, fileId) => {
    if (newMessage === "" || newMessage === " ") return;
    if (socketRef.current === null) return;
    //

    GenerateDiffieHelmanKeys();
    const pket = getPublicKey();
    console.log("cheie publica: ");
    console.log(pket);

    var dataToSend = {
      ID_message: uuidv4(),
      senderID: user.userId,
      senderName: user.surname + " " + user.name,
      roomID: channelID,
      messageBody: newMessage,
      type: messageType,
      fileId: fileId,
      createdTime: date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS"),
    };

    socketRef.current.emit("send chat message", dataToSend);
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
      <Modal show={open} onHide={closeModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Send file to {currentChannelName}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div
              className="file_icon"
              style={{
                display: !preview ? "flex" : "none",
              }}
            >
              <FontAwesomeIcon
                icon={handleReturnFileIcon(fileToSendInfo.type)}
                className="icon"
                style={{
                  color: "#0969da",
                }}
              />
            </div>
            <div
              className="picture_preview"
              style={{
                display: preview ? "flex" : "none",
              }}
            >
              <img src={fileToSendInfo.previewImage} alt="userAvatar jmecher" />
            </div>
            <div className="file_details">
              <div className="prop">
                <div className="key">Name: </div>
                <div className="value">
                  <p>{fileToSendInfo.name}</p>
                </div>
              </div>

              <div className="prop">
                <div className="key">Creation Date: </div>
                <div className="value">
                  <p>{fileToSendInfo.lastModified}</p>
                </div>
              </div>

              <div className="prop">
                <div className="key">Size: </div>
                <div className="value">
                  <p>{fileToSendInfo.size} Bytes</p>
                </div>
              </div>

              <div className="prop">
                <div className="key">Type: </div>
                <div className="value">
                  <p>{fileToSendInfo.type}</p>
                </div>
              </div>
            </div>
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
