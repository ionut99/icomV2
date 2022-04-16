import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";

import { AddNewFolder } from "../../asyncActions/folderAsyncActions";

export default function AddFolderButton({ currentFolder }) {
  const dispatch = useDispatch();
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (currentFolder == null) {
      return;
    }

    // Create a folder in the data base

    // const path = [...currentFolder.path];
    // if (currentFolder !== ROOT_FOLDER) {
    //   path.push({ name: currentFolder.name, id: currentFolder.id });
    // }

    // database.folders.add({
    //   name: name,
    //   parentId: currentFolder.id,
    //   userId: currentUser.uid,
    //   path: path,
    //   createdAt: database.getCurrentTimestamp(),
    // });
    // create a sql date object so we can use it in our INSERT statement
    const time = new Date().toLocaleString();

    dispatch(AddNewFolder(name, currentFolder.id, user.userId, null, time));

    setName("");
    closeModal();
  }
  return (
    <>
      <Button onClick={openModal} variant="outline-success" size="sm">
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Folder Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Add Folder
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
