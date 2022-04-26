import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

function Folder({ folder }) {
  return (
    <Button
      to={{
        pathname: `/folder/${folder.folderId}`,
        state: { folder: folder },
      }}
      variant="outline-dark"
      className="text-truncate w-100"
      as={Link}
    >
      <FontAwesomeIcon icon={faFolder} className="mr-5" />
      {`  ${folder.Name}`}
    </Button>
  );
}

export default Folder;
