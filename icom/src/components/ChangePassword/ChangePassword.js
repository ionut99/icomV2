import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";

import { editUserAccountInfo } from "../../asyncActions/userAsyncActions";

function ChangePassword(props) {
  const dispatch = useDispatch();

  const { Surname, Name, Email } = props;

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const [open, setOpen] = useState(false);
  const [userSurname, setUserSurname] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  //password
  const [currentPassword, setcurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function openModal() {
    setOpen(true);
    setUserSurname(Surname);
    setUserName(Name);
    setEmail(Email);
  }
  function closeModal() {
    setUserSurname("");
    setUserName("");
    setEmail("");
    setcurrentPassword("");
    setNewPassword("");
    setOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // send data for edit user details
    dispatch(
      editUserAccountInfo(
        userSurname,
        userName,
        email,
        currentPassword,
        newPassword,
        user.userId
      )
    );

    closeModal();
  }
  return (
    <div>
      <Button
        className="user-menu-button"
        variant="btn btn-outline-primary btn-sm"
        onClick={openModal}
      >
        Edit Profile
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

              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setcurrentPassword(e.target.value)}
              />

              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ChangePassword;
