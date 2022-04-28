import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

function Folder({ folder }) {
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  return (
    <Button
      to={{
        pathname: `/storage/folder/${folder.folderId}`,
        state: { folder: folder },
      }}
      variant={
        folder.userID === user.userId ? "outline-dark" : "outline-primary"
      }
      className="text-truncate w-100"
      as={Link}
    >
      <FontAwesomeIcon icon={faFolder} className="mr-5" />
      {`  ${folder.Name}`}
    </Button>
  );
}

export default Folder;
