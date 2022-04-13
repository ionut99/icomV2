import React from "react";
import { Container } from "react-bootstrap";
import AddFolderButton from "./AddFolderButton";
import Navbar from "../../components/Navbar/Navbar";

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';


function Storage() {
  return (
    <>
      <Navbar />
      <Container fluid>
        <AddFolderButton />
      </Container>
    </>
  );
}

export default Storage;
