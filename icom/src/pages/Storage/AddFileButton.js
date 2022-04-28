import React, { useState } from "react";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useDispatch, useSelector } from "react-redux";

import { ROOT_FOLDER } from "../../reducers/folderReducer";
import { UploadFileForStoring } from "../../asyncActions/fileAsyncActions";

export default function AddFileButton({ currentFolder }) {
  //   const [selectedFile, setSelectedFile] = useState();

  const dispatch = useDispatch();
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  function handleUpload(e) {
    // const formData = new FormData();
    const file = e.target.files[0];

    if (currentFolder == null || file == null) return;

    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.name}`
        : `${currentFolder.path.join("/")}/${currentFolder.Name}/${file.name}`;

    console.log(filePath);

    // 1. incarca fisierul !
    // 2. retine in baza de date datele despre fisier

    const fileName = file.name;
    const time = new Date().toLocaleString();
    dispatch(
      UploadFileForStoring(
        fileName,
        filePath,
        currentFolder.folderId,
        user.userId,
        time,
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
