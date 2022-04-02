import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserAvatarPreview } from "../../actions/authActions";
import "./confirmDialog.css";

import SendPicture from "../../services/sendPicture";

export default function ConfirmDialog(props) {
  const dispatch = useDispatch();

  const { confirmDialog, setConfirmDialog, discard, setDiscard } = props;

  const authObj = useSelector((state) => state.auth);
  const { userAvatar, userAvatarPreview } = authObj;

  const { SelectPicture, UpdateAvatar, SaveAvatarPicture } = SendPicture();

  const handleUploadFile = (event) => {
    SelectPicture(event.target.files[0]);
    setDiscard(true);
  };

  const handleClose = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    setDiscard(false);
  };

  const handleConfirmation = () => {
    if (confirmDialog.uploadPicture) {
      SaveAvatarPicture(userAvatarPreview);
      setDiscard(false);
    }

    setConfirmDialog({
      ...confirmDialog,
      uploadPicture: false,
      isOpen: false,
    });
  };
  return (
    <div
      className="background"
      style={{ display: confirmDialog.isOpen ? "block" : "none" }}
    >
      <div
        className="dialog-component"
        style={{ display: confirmDialog.isOpen ? "block" : "none" }}
      >
        <div className="dialogContent">
          <div className="typography-title">{confirmDialog.title}</div>
          <div className="typography-subtitle">{confirmDialog.subTitle}</div>
          <div
            className="upload-box"
            style={{ display: confirmDialog.uploadPicture ? "block" : "none" }}
          >
            <div className="image-preview">
              <img alt="Resize Img" src={userAvatarPreview} />
            </div>
            <div className="upload-action">
              <label className="custom-file-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadFile}
                />
                Choose new profile
              </label>
            </div>
            <div
              style={{
                display:
                  discard && confirmDialog.uploadPicture ? "block" : "none",
              }}
              className="typography-subtitle"
            >
              Save new profile picture?
            </div>
          </div>
        </div>
        <div className="dialogAction">
          <div
            className="choose"
            style={{
              display:
                discard || !confirmDialog.uploadPicture ? "block" : "none",
            }}
          >
            <input
              className="mybutton-close"
              type="button"
              value="No"
              onClick={handleClose}
            />
            <input
              className="mybutton-yes"
              type="button"
              value="Yes"
              onClick={handleConfirmation}
            />
          </div>

          <input
            style={{
              display:
                !discard && confirmDialog.uploadPicture ? "block" : "none",
            }}
            className="mybutton-close"
            type="button"
            value="Close"
            onClick={handleClose}
          />
        </div>
      </div>
    </div>
  );
}
