import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { Button, Modal, Form } from "react-bootstrap";

//
import date from "date-and-time";
//

function SaveButton(props) {
  let history = useHistory();
  //
  const { fileId, folderId, docName, setDocName, saveDocumentState } = props;

  //
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  //
  const [open, setOpen] = useState(false);
  //
  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    //
    const createdTime = date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS");

    if (docName != "")
      saveDocumentState(user.userId, fileId, folderId, docName, createdTime);
    else alert("File name empty, please choose one!");

    //
    closeModal();
    history.goBack();
  }

  return (
    <div className="save-doc-state">
      <Button
        variant="success"
        size="lg"
        onClick={() => {
          openModal();
        }}
        className="save-button"
      >
        Save
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>File Name </Form.Label>
              <Form.Control
                type="text"
                required
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={closeModal}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default SaveButton;
