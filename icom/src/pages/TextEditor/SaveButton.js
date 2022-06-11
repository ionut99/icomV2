import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";

//
import date from "date-and-time";
//

function SaveButton(props) {
  //
  const { fileId, folderId, saveDocumentState } = props;
  //
  // const dispatch = useDispatch();
  //

  //
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  //
  const [open, setOpen] = useState(false);
  const [fileName, setfileName] = useState("");
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
    //
    saveDocumentState(user.userId, fileId, folderId, fileName, createdTime);
    closeModal();
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
                value={fileName}
                onChange={(e) => setfileName(e.target.value)}
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
