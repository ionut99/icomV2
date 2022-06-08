import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";

import { addNewUserAccount } from "../../asyncActions/userAsyncActions";

function AddUser() {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [userSurname, setUserSurname] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  function openModal() {
    setOpen(true);
  }
  function closeModal() {
    setUserSurname("");
    setUserName("");
    setEmail("");
    setIsAdmin(false);
    setOpen(false);
  }

  const toggleAdminValue = () => setIsAdmin(!isAdmin);

  function handleSubmit(e) {
    e.preventDefault();

    dispatch(addNewUserAccount(userSurname, userName, email, isAdmin));
    closeModal();
  }
  return (
    <>
      <Button
        className="add-user-button"
        variant="btn btn-primary btn-sm"
        onClick={openModal}
      >
        Add New User
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                required
                value={userSurname}
                onChange={(e) => setUserSurname(e.target.value)}
              />

              <Form.Label className="custom-form-label">Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />

              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="form-check">
                <Form.Check
                  type="checkbox"
                  checked={isAdmin}
                  onChange={toggleAdminValue}
                />
                <Form.Label>Will this user be admin?</Form.Label>
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Add New User
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default AddUser;
