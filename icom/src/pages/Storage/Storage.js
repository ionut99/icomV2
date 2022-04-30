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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./storage.css";
import filedetailsicon from "../../images/filedetailsicon.svg";
import SubFolder from "./SubFolder";
import { ROOT_FOLDER } from "../../reducers/folderReducer";
function Storage() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders } = useFolder(folderId, state.folder);
  //console.log(folder);

  return (
    <div className="storage-content">
      <Navbar />
      <Container fluid className="containerforSize">
        <div className="f-nav-bar">
          <FolderBreadcrumbs currentFolder={folder} />
          <AddFileButton currentFolder={folder} />
          <AddFolderButton currentFolder={folder} />
        </div>
        {/* {folder && <Folder folder={folder}></Folder>} */}
        <div className="content-drive">
          <div className="folder-tree">
            <SubFolder folder={ROOT_FOLDER} />
          </div>
          <div className="content-folder-list">
            <table>
              <tbody>
                <tr className="details-bar">
                  <th className="type-column">
                    <p>Type</p>
                  </th>
                  <th className="name-column">
                    <p>Name</p>
                  </th>
                  <th className="name-column">
                    <p>Modified</p>
                  </th>
                  <th className="name-column">
                    <p>Modified By</p>
                  </th>
                  <th className="name-column">
                    <p>Options</p>
                  </th>
                </tr>
              </tbody>
            </table>

            {childFolders.length > 0 && (
              <div className="folder-list">
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
          </div>
          <div
            className={true ? "file__details empty__details" : "file__details"}
          >
            <div className="file__details--inner">
              <span>
                <img src={filedetailsicon} alt="filedetailsicon" />
              </span>
              <p>Select a file or folder to view it’s details</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Storage;
