import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";

function SaveButton() {
  // const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [fileName, setfileName] = useState("");
  function openModal() {
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // send request for save created document !
    // dispatch(AddNewUserAccount(userSurname, userName, email, isAdmin));
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
              SAVE
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default SaveButton;
