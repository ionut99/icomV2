import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { getUserDetails } from "../../services/user";

import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";

import { monthNames } from "../../helpers/FileIcons";

function Folder({ folder }) {
  const ref = useRef();
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  //
  const userDetails = user.surname + " " + user.name;

  const [authName, setauthName] = useState("");
  const [optionButton, setOptionButton] = useState(false);

  const CreateFolderDate = new Date(Date.parse(folder.createdTime));

  useEffect(() => {
    let isMounted = true;
    if (folder.userId == null) {
      return;
    }
    getUserDetails(folder.userId)
      .then((result) => {
        if (isMounted) {
          setauthName(
            result.data["userDetails"].name +
              " " +
              result.data["userDetails"].surname
          );
        }
      })
      .catch((err) => {
        console.log("Error Set Folder Author Name");
      });
    return () => {
      isMounted = false;
    };
  }, [folder.userId]);

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

  return (
    <div className="f-component" ref={ref}>
      <Button
        to={{
          pathname: `/storage/folder/${folder.folderId}`,
          state: { folder: folder },
        }}
        variant={
          folder.userId === user.userId ? "outline-dark" : "outline-primary"
        }
        className="folder-button"
        as={Link}
      >
        <div className="folder-details">
          <FontAwesomeIcon
            icon={faFolder}
            className="folder-icon"
            style={{
              color: " #F8D775",
            }}
          />
          <div className="folder-name">
            <p>{`  ${folder.name
              .replace(userDetails, "")
              .replace(" # ", " ")}`}</p>
          </div>
          <div className="folder-date">
            <p>{` ${
              monthNames[CreateFolderDate.getMonth()] +
              " " +
              CreateFolderDate.getDate() +
              " " +
              CreateFolderDate.getHours() +
              ":" +
              CreateFolderDate.getMinutes() +
              ":" +
              CreateFolderDate.getSeconds()
            }`}</p>
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

export default Folder;
