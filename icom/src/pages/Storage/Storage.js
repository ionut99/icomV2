import React from "react";
import { Container } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useFolder } from "../../reducers/folderReducer";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import AddFolderButton from "./AddFolderButton";
import AddFileButton from "./AddFileButton";
import Navbar from "../../components/Navbar/Navbar";

import SubFolder from "./SubFolder";
import Folder from "./Folder";
import File from "./File";

import "./storage.css";
import filedetailsicon from "../../images/filedetailsicon.svg";
import { ROOT_FOLDER } from "../../reducers/folderReducer";

function Storage() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders, childFiles } = useFolder(
    folderId,
    state.folder
  );

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
            <SubFolder currentFolder={ROOT_FOLDER} />
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

            <div className="folder-list">
              {childFolders.length > 0 &&
                childFolders.map((childFolder, index) => (
                  <div
                    // key={folder.folderID}
                    key={index}
                    className="folder-element"
                  >
                    <Folder folder={childFolder} />
                  </div>
                ))}
              {childFiles.length > 0 &&
                childFiles.map((childFile, index) => (
                  <div
                    // key={folder.folderID}
                    key={index}
                    className="file-element"
                  >
                    <File file={childFile} />
                  </div>
                ))}
            </div>

            {/* {childFolders.length > 0 && childFiles.length > 0 && <hr />}
            {childFiles.length > 0 && (
              <div className="file-list">
                {childFiles.map((childFile, index) => (
                  <div
                    // key={folder.folderID}
                    key={index}
                    className="file-element"
                  >
                    <File file={childFile} />
                  </div>
                ))}
              </div>
            )} */}
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
