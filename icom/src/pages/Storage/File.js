import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
//
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
//
import { getUserDetails } from "../../services/user";
import { handleReturnFileIcon } from "../../helpers/FileIcons";
//
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";

import { DownloadFileFromServer } from "../../asyncActions/fileAsyncActions";
import { handleReturnHumanDateFormat } from "../../helpers/FileIcons";

//

function File({ file }) {
  //
  const dispatch = useDispatch();
  let history = useHistory();

  //
  const ref = useRef();
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const [authName, setauthName] = useState("");
  const [optionButton, setOptionButton] = useState(false);

  const CreateFileDate = handleReturnHumanDateFormat(file.createdTime);
  //

  const handleClickFile = (folderId, fileId, type) => {
    if (type == "text/plain")
      history.push("/newdocument/" + folderId + "/" + fileId);
  };

  useEffect(() => {
    let isMounted = true;
    if (file.userId == null) {
      return;
    }
    getUserDetails(file.userId)
      .then((result) => {
        if (isMounted) {
          setauthName(
            result.data["userDetails"].name +
              " " +
              result.data["userDetails"].surname
          );
        }
      })
      .catch(() => {
        console.log("Error when try to retriev data about user");
      });
    return () => {
      isMounted = false;
    };
  }, [file.userId]);

  useEffect(() => {
    let isMounted = true;
    const checkIfClickedOutside = (e) => {
      if (
        isMounted &&
        optionButton &&
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setOptionButton(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      isMounted = false;
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [optionButton]);

  const handleDownloadFile = (fileId, fileName, userId) => {
    dispatch(DownloadFileFromServer(fileId, fileName, userId));
  };

  return (
    <div className="f-component" ref={ref}>
      <Button
        variant={
          file.userId === user.userId ? "outline-success" : "outline-primary"
        }
        className="folder-button"
        onClick={() => handleClickFile(file.folderId, file.fileId, file.type)}
      >
        <div className="folder-details">
          <FontAwesomeIcon
            icon={handleReturnFileIcon(file.type)}
            className="folder-icon"
          />
          <div className="folder-name">
            <p>{`  ${file.fileName}`}</p>
          </div>
          <div className="folder-date">
            <p>{` ${CreateFileDate}`}</p>
          </div>
          <div className="folder-author">{` ${authName}`}</div>
        </div>
      </Button>
      <div
        className="more_folder_options"
        onClick={() => {
          setOptionButton(!optionButton);
        }}
      >
        <div className="folder-dropdown-button">
          <MoreHorizIcon
            sx={{ fontSize: 30, color: "#dadde0" }}
            className="MoreHorizIcon"
          ></MoreHorizIcon>

          <div
            className="f-dropdown-content"
            style={{ display: optionButton ? "block" : "none" }}
          >
            <div
              className="dropdown-instrument"
              onClick={() =>
                handleDownloadFile(file.fileId, file.fileName, user.userId)
              }
            >
              <AiIcons.AiOutlineCloudDownload size={20} />
              <p>Download</p>
            </div>
            <div className="dropdown-instrument" onClick={() => {}}>
              <MdIcons.MdDeleteOutline size={20} />
              <p>Delete</p>
            </div>
            <div className="dropdown-instrument" onClick={() => {}}>
              <AiIcons.AiOutlinePushpin size={20} />
              <p>Pin to top</p>
            </div>
            <div className="dropdown-instrument" onClick={() => {}}>
              <MdIcons.MdDriveFileRenameOutline size={20} />
              <p>Rename</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default File;
