import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";

import { AddNewFolder } from "../../asyncActions/folderAsyncActions";

import { ACTIONS } from "../../reducers/folderReducer";
import { getFolderByID, getChildFolders } from "../../services/folder";

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

    const time = new Date().toLocaleString();
    const path_proba = null; // TO DO de updatat
    dispatch(
      AddNewFolder(name, currentFolder.folderId, user.userId, path_proba, time)
    );

    // dispatch({
    //   type: ACTIONS.ADD_CHILD_FOLDER,
    //   payload: {
    //     folderID: null,
    //     name: name,
    //     parentId: currentFolder.folderID,
    //     userId: user.userId,
    //     path: path_proba,
    //     createdAt: time,
    //   },
    // });

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
