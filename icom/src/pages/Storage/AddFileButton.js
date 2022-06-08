import React from "react";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useDispatch, useSelector } from "react-redux";

import { UploadFileForStoring } from "../../asyncActions/fileAsyncActions";
import { v4 as uuidv4 } from "uuid";

import date from "date-and-time";

export default function AddFileButton({ currentFolder }) {
  const dispatch = useDispatch();
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  function handleUpload(e) {
    // const formData = new FormData();
    const file = e.target.files[0];
    if (currentFolder == null || file == null) return;
    const createdTime = date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS");

    dispatch(
      UploadFileForStoring(
        currentFolder.folderId,
        user.userId,
        createdTime,
        uuidv4(),
        file
      )
    );
  }
  return (
    <div className="drive-button">
      <label className="btn btn-outline-success">
        <div className="button-icon">
          <FontAwesomeIcon icon={faFileUpload} className="w-100 h-100" />
        </div>
        <input
          type="file"
          onChange={handleUpload}
          style={{ opacity: 0, position: "absolute", left: "-9999px" }}
        />
      </label>
    </div>
  );
}
