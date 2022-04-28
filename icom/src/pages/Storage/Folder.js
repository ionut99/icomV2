import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

import { getUserDetails } from "../../services/user";
import { result } from "lodash";

function Folder({ folder }) {
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;



  var authSurname = "mam2";

  const [authName, setauthName] = useState("mam");

  useEffect(() => {
    if (folder.userID == null) {
      return;
    }
    getUserDetails(folder.userID)
      .then((result) => {
        // console.log("datele despre user sunt: ");
        // console.log(result);
        setauthName(result.data["userDetails"][0].Name);
        // authSurname = result.data["userDetails"][0].Surname;
        // console.log(authName);
        // console.log(authSurname);
      })
      .catch(() => {
        console.log("Error when try to retriev data about user");
      });
  }, [folder.userID]);

  return (
    <Button
      to={{
        pathname: `/storage/folder/${folder.folderId}`,
        state: { folder: folder },
      }}
      variant={
        folder.userID === user.userId ? "outline-dark" : "outline-primary"
      }
      className="folder-button"
      as={Link}
    >
      <div className="folder-details">
        <FontAwesomeIcon icon={faFolder} className="folder-icon" />
        <div className="folder-name">{`  ${folder.Name}`}</div>
        <div className="folder-date">{` ${folder.createdTime}`}</div>
        <div className="folder-author">{` ${authName}`}</div>
      </div>
    </Button>
  );
}

export default Folder;
