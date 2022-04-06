import React from "react";
import "./confirmDialog.css";

import UploadAvatar from "./UploadAvatar";

export default function ConfirmDialog(props) {
  const {
    confirmDialog,
    setConfirmDialog,
    discard,
    setDiscard,
    confirmAction,
  } = props;

  // Negative
  const handleClose = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    setDiscard(false);
  };

  // Positive
  const handleConfirmation = () => {
    confirmAction();
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
          <UploadAvatar
            open={confirmDialog.uploadPicture}
            discard={discard}
            setDiscard={setDiscard}
            handleClose={handleClose}
            setConfirmDialog={setConfirmDialog}
            confirmDialog={confirmDialog}
          />
        </div>
        <div className="dialogAction">
          <div
            className="choose"
            style={{
              display: !confirmDialog.uploadPicture ? "block" : "none",
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
                confirmDialog.uploadPicture && !discard ? "block" : "none",
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
