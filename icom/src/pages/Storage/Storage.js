import React from "react";
import { Container } from "react-bootstrap";
import AddFolderButton from "./AddFolderButton";
import AddFileButton from "./AddFileButton";

import Navbar from "../../components/Navbar/Navbar";
import Folder from "./Folder";
import { useParams, useLocation } from "react-router-dom";

import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

import { useFolder } from "../../reducers/folderReducer";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import "./storage.css";

function Storage() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders } = useFolder(folderId, state.folder);
  //console.log(folder);

  return (
    <div className="storage-content">
      <Navbar />
      <Container fluid className="containerforSize">
        <div className="d-flex align-items-center">
          <FolderBreadcrumbs currentFolder={folder} />
          <AddFileButton currentFolder={folder} />
          <AddFolderButton currentFolder={folder} />
        </div>
        {/* {folder && <Folder folder={folder}></Folder>} */}
        {childFolders.length > 0 && (
          <div className="content-folder">
            {childFolders.map((childFolder, index) => (
              <div
                // key={folder.folderID}
                key={index}
                className="folder-element"
              >
                <Folder folder={childFolder} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default Storage;
