import React from "react";
import { useSelector, useDispatch } from "react-redux";
//
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
//
import { Modal, Form, Button } from "react-bootstrap";
import { handleReturnFileIcon } from "../../helpers/FileIcons";
import { UploadFileForStoring } from "../../asyncActions/fileAsyncActions";

import date from "date-and-time";
import { v4 as uuidv4 } from "uuid";

export default function SendFile(props) {
  const {
    open,
    setOpen,
    setFileToSendInfo,
    fileToSendInfo,
    handleSendMessage,
    setNewMessage,
    preview,
  } = props;
  const dispatch = useDispatch();

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
    setOpen(false);
  }

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
    </>
  );
}
