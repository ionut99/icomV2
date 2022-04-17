import React from "react";
import { Container } from "react-bootstrap";
import AddFolderButton from "./AddFolderButton";
import Navbar from "../../components/Navbar/Navbar";
import Folder from "./Folder";
import { useParams } from "react-router-dom";

import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

import { useFolder } from "../../reducers/folderReducer";

function Storage() {
  const { folderId } = useParams();
  const { folder, childFolders } = useFolder(folderId);
  //console.log(folder);

  return (
    <>
      <Navbar />
      <Container fluid>
        <AddFolderButton currentFolder={folder} />
        {/* {folder && <Folder folder={folder}></Folder>} */}
        {childFolders.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFolders.map((childFolder, index) => (
              <div
                // key={folder.folderID}
                key={index}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <Folder folder={childFolder} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}

export default Storage;
