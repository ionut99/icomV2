import { faFile } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { getUserDetails } from "../../services/user";

import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function File({ file }) {
  const ref = useRef();
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const [authName, setauthName] = useState("");
  const [optionButton, setOptionButton] = useState(false);

  const CreateFileDate = new Date(Date.parse(file.createdTime));
  const finalFileDate =
    monthNames[CreateFileDate.getMonth()] +
    " " +
    CreateFileDate.getDate() +
    " " +
    CreateFileDate.getHours() +
    ":" +
    CreateFileDate.getMinutes() +
    ":" +
    CreateFileDate.getSeconds();

  useEffect(() => {
    let isMounted = true;
    if (file.userId == null) {
      return;
    }
    getUserDetails(file.userId)
      .then((result) => {
        if (isMounted) {
          setauthName(
            result.data["userDetails"][0].Name +
              " " +
              result.data["userDetails"][0].Surname
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

  return (
    <div className="f-component" ref={ref}>
      <Button
        // to={{
        //   pathname: `/storage/folder/${folder.folderId}`,
        //   state: { folder: folder },
        // }}
        variant={
          file.userId === user.userId ? "outline-success" : "outline-primary"
        }
        className="folder-button"
        // as={Link}
      >
        <div className="folder-details">
          <FontAwesomeIcon icon={faFile} className="folder-icon" />
          <div className="folder-name">
            <p>{`  ${file.fileName}`}</p>
          </div>
          <div className="folder-date">
            <p>{` ${finalFileDate}`}</p>
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
            <div className="dropdown-instrument" onClick={() => {}}>
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
