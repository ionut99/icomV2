import React from "react";
import { Container } from "react-bootstrap";
import AddFolderButton from "./AddFolderButton";
import Navbar from "../../components/Navbar/Navbar";

import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

import { useFolder } from "../../reducers/folderReducer";

function Storage() {
  const { folder } = useFolder();

  return (
    <>
      <Navbar />
      <Container fluid>
        <AddFolderButton currentFolder={folder} />
      </Container>
    </>
  );
}

export default Storage;
