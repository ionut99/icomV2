import React from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { deleteConversation } from "../../asyncActions/userAsyncActions";

function DeleteChannel(props) {
  const dispatch = useDispatch();

  const { channelToDelete, setChannelToDelete, userId } = props;

  function closeModal() {
    setChannelToDelete({
      id: undefined,
      name: undefined,
      openModal: false,
    });
  }

  function handleSubmitDeleteGroup(event) {
    event.preventDefault();
    if (channelToDelete.id === undefined) return;
    //
    dispatch(deleteConversation(channelToDelete.id, userId));
    closeModal();
  }

  return (
    <>
      <Modal show={channelToDelete.openModal} onHide={closeModal}>
        <Form onSubmit={handleSubmitDeleteGroup}>
          <Modal.Header closeButton>
            <Modal.Title>
              Delete Conversation with {channelToDelete.name}?
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={closeModal}>
              No
            </Button>
            <Button variant="outline-danger" type="submit">
              Delete
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default DeleteChannel;
