import { useSelector } from "react-redux";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import { v4 as uuidv4 } from "uuid";
function CreateDocButton() {
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID } = chatObj;

  const folderObj = useSelector((state) => state.folderRedu);
  const { folder, childFolders, childFiles } = folderObj;

  return (
    <div className="drive-button">
      <Link to={`/newdocument/${folder.folderId}/${uuidv4()}`}>
        <Button variant="primary">Create New</Button>
      </Link>
    </div>
  );
}

export default CreateDocButton;
