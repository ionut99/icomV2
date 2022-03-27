import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import * as Quill from "quill";
import "quill/dist/quill.snow.css";
import "./textEditor.css";

import Navbar from "../../components/Navbar";
import { setAuthToken } from "../../services/auth";
import Comunication from "../../services/comunication";
import { verifyTokenAsync } from "../../asyncActions/authAsyncActions";
// import { GetDocumentFileData } from "../../services/user";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

function TextEditor() {
  const dispatch = useDispatch();
  const [quill, setQuill] = useState();
  // const [documentData, setdocumentData] = useState("");

  const authObj = useSelector((state) => state.auth);
  const { user, expiredAt, token } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID } = chatObj;

  const fileObj = useSelector((state) => state.fileRedu);
  const { delta, senderID } = fileObj;

  const { sendDocumentChanges } = Comunication(channelID, user.userId);

  // get file data
  // const getDocumentContent = async (FileName, FilePath) => {
  //   const result = await GetDocumentFileData(FileName, FilePath);

  //   //console.log(result.data);
  //   setdocumentData(result.data);

  //   quill.setContents(result.data);
  //   quill.enable();
  // };

  // useEffect(() => {
  //   console.log("aducem documentul de pe server...");
  //   getDocumentContent("AnyFileName", "any/path/file");

  //   console.log("Am adus data:");
  //   console.log(documentData);
  //   if (documentData !== "") {
  //     console.log("haida");
  //     quill.setContents(documentData);
  //     quill.enable();
  //   }
  // }, [quill]);

  useEffect(() => {
    if (quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      sendDocumentChanges(delta);
    };
    quill.on("text-change", handler);

    if (user.userId !== senderID) {
      quill.updateContents(delta);
    }

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill, delta]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    // q.disable();
    // q.setText("Loading...");
    setQuill(q);
  }, []);

  // set timer to renew token
  useEffect(() => {
    setAuthToken(token);
    console.log("Am reinnoit token ul ");
    const verifyTokenTimer = setTimeout(() => {
      dispatch(verifyTokenAsync(true));
    }, moment(expiredAt).diff() - 10 * 1000);
    return () => {
      clearTimeout(verifyTokenTimer);
    };
  }, [expiredAt, token, dispatch]);

  return (
    <div className="edit-box">
      <Navbar className="navbar" />
      <div className="container" ref={wrapperRef}></div>
    </div>
  );
}

export default TextEditor;
