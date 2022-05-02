import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";

import { AddNewFolder } from "../../asyncActions/folderAsyncActions";

import { ROOT_FOLDER } from "../../reducers/folderReducer";

// import { ACTIONS } from "../../reducers/folderReducer";
// import { getFolderByID, getChildFolders } from "../../services/folder";

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

    const path = [...currentFolder.path];

    // console.log("calea din Root folder: ");
    // console.log(path);

    if (currentFolder !== ROOT_FOLDER) {
      path.push({ Name: currentFolder.Name, folderId: currentFolder.folderId });
    }

    dispatch(AddNewFolder(name, currentFolder.folderId, user.userId, path));

    setName("");
    closeModal();
  }
  return (
    <div className="drive-button">
      <Button onClick={openModal} variant="outline-success">
        <div className="button-icon">
          <FontAwesomeIcon icon={faFolderPlus} className="w-100 h-100" />
        </div>
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
    </div>
  );
}
