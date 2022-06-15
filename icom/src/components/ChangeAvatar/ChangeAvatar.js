import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";

import {
  updateProfilePicture,
  updateGroupPicture,
} from "../../asyncActions/fileAsyncActions";

import { getAvatarPictureAsync } from "../../asyncActions/authAsyncActions";
import { Spinner } from "react-bootstrap";
//
import * as ImIcons from "react-icons/im";

import "./change.css";

function ChangeAvatar(props) {
  const dispatch = useDispatch();

  const { userId, roomId, group } = props;
  //
  const [open, setOpen] = useState(false);
  //
  const [loaded, setLoaded] = useState(false);
  //
  const [profilePicture, setProfilePicture] = useState({
    file: undefined,
    filepreview: undefined,
  });

  //
  const [invalidImage, setinvalidImage] = useState(undefined);
  //
  let reader = new FileReader();

  //
  function openModal() {
    getAvatarPictureAsync(userId, roomId).then((result) => {
      if (result !== undefined) {
        setProfilePicture({
          file: undefined,
          filepreview: result,
        });
        setLoaded(true);
      }
    });
    setOpen(true);
  }

  //
  function closeModal() {
    //
    setOpen(false);
    setLoaded(false);
    setinvalidImage(undefined);
    setProfilePicture({
      file: undefined,
      filepreview: undefined,
    });
  }

  const handleChangePicture = (event) => {
    setinvalidImage(undefined);
    const imageFile = event.target.files[0];
    const imageFilname = event.target.files[0].name;
    if (!imageFile) {
      setinvalidImage("Please select image.");
      return false;
    }

    if (!imageFile.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|gif)$/)) {
      setinvalidImage("Please select valid image [JPG,JPEG,PNG]");
      return false;
    }
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        //Resize image
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 300;
        var MAX_HEIGHT = 300;
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        ctx.canvas.toBlob(
          (blob) => {
            const file = new File([blob], imageFilname, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            setProfilePicture({
              file: file,
              filepreview: URL.createObjectURL(imageFile),
            });
          },
          "image/jpeg",
          1
        );
        setinvalidImage(undefined);
      };
      img.onerror = () => {
        setinvalidImage("Invalid image content.");
        return false;
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (!group) dispatch(updateProfilePicture(userId, profilePicture.file));
    else if (roomId !== null) {
      //
      dispatch(updateGroupPicture(roomId, userId, profilePicture.file));
    }
    closeModal();
  }

  return (
    <>
      <div
        className="dropdown-instrument"
        style={{
          display: !group ? "none" : "flex",
        }}
        onClick={openModal}
      >
        <ImIcons.ImFilePicture size={17} />
        <p>Change Image</p>
      </div>
      <Button
        style={{ display: group ? "none" : "block" }}
        className="user-menu-button"
        variant="btn btn-outline-primary btn-sm"
        onClick={openModal}
      >
        Change Avatar
      </Button>
      <Modal show={open} onHide={closeModal} controlid="modalAvatar">
        <Modal.Header closeButton>
          <Modal.Title>Change profile picture?</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="profile_content">
              <div className="image_preview">
                {loaded ? (
                  <img src={profilePicture.filepreview} alt="Avatar jmecher" />
                ) : (
                  <Spinner animation="border" />
                )}
              </div>
              <div className="warning">
                <p>{invalidImage}</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={closeModal}>
              Close
            </Button>
            <Button
              variant="success"
              type="submit"
              style={{
                display: profilePicture.file !== undefined ? "flex" : "none",
              }}
            >
              Save Changes
            </Button>

            <Form.Group controlId="formPicture">
              <Form.Label variant="outline-light">
                <div
                  className="custom-file-upload"
                  style={{
                    display:
                      profilePicture.file === undefined ? "flex" : "none",
                  }}
                >
                  Choose new profile
                </div>
                <Form.Control type="file" onChange={handleChangePicture} />
              </Form.Label>
            </Form.Group>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default ChangeAvatar;
