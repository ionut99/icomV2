import React, { useState } from "react";

import "./confirmDialog.css";

export default function ConfirmDialog(props) {
  const {
    confirmDialog,
    setConfirmDialog,
    fileChangeHandler,
    resizedImage,
  } = props;

  const handleUploadFile = (event) => {
    fileChangeHandler(event.target.files[0]);
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
              <img alt="Resize Img" src={resizedImage} />
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
            <div className="typography-subtitle">Save new profile picture?</div>
          </div>
        </div>
        <div className="dialogAction">
          <input
            className="mybutton"
            type="button"
            style={{ height: "40px", width: "90px" }}
            value="No"
            onClick={() =>
              setConfirmDialog({ ...confirmDialog, isOpen: false })
            }
          />
          <input
            className="mybutton-yes"
            type="button"
            style={{ height: "40px", width: "90px" }}
            value="Yes"
            onClick={confirmDialog.onConfirm}
          />
        </div>
      </div>
    </div>
  );
}
