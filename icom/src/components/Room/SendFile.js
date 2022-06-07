import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
//
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPaperclip } from "@fortawesome/free-solid-svg-icons";
//
import { Modal, Form, Button } from "react-bootstrap";
import { handleReturnFileIcon } from "../../helpers/FileIcons";
import { UploadFileForStoring } from "../../asyncActions/fileAsyncActions";
import { handleReturnHumanDateFormat } from "../../helpers/FileIcons";
//

import date from "date-and-time";
import { v4 as uuidv4 } from "uuid";

export default function SendFile(props) {
  const { handleSendMessage, setNewMessage } = props;
  const dispatch = useDispatch();

  //
  const [sendDoc, setsendDoc] = useState(false);
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

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelFolderId, currentChannelName } = chatObj;

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
    setsendDoc(false);
  }

  //
  const handleAtacheFile = (event) => {
    console.log("Vreau sa trimit doceument");
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
    setsendDoc(true);
  };

  function handleSubmit(event) {
    event.preventDefault();
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

  return (
    <>
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
          <Form.Control type="file" onChange={handleAtacheFile} />
        </Form.Group>
      </div>
      <Modal
        show={sendDoc}
        onHide={closeModal}
        backdrop="static"
        keyboard={false}
        controlid="modalSend"
      >
        <Modal.Header closeButton>
          <Modal.Title>Send file to {currentChannelName}?</Modal.Title>
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
    </>
  );
}
