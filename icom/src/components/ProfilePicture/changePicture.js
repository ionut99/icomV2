import React from "react";

import "./changePicture.css";

export default function ChangePicture(props) {
  const { confirmDialog, setConfirmDialog } = props;
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
          <div className="upload-box"></div>
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
