import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import socketIOClient from "socket.io-client";

import { verifyTokenAsync } from "../../asyncActions/authAsyncActions";
import { setAuthToken } from "../../services/auth";
import "./textEditor.css";

import "quill/dist/quill.snow.css";
import * as Quill from "quill";

import Navbar from "../../components/Navbar/Navbar";
import SaveButton from "./SaveButton";

import { v4 as uuidv4 } from "uuid";

import { getDocumentContentById } from "../../services/file";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const SEND_DOCUMENT_CHANGES = "SEND_DOCUMENT_CHANGES";
const RECEIVE_DOCUMENT_CHANGES = "RECEIVE_DOCUMENT_CHANGES";
const { REACT_APP_API_URL } = process.env;

//

function TextEditor() {
  const { folderId, fileId } = useParams();
  const socketRef = useRef();
  const dispatch = useDispatch();

  const [quill, setQuill] = useState();

  const authObj = useSelector((state) => state.auth);
  const { user, expiredAt, token } = authObj;

  useEffect(() => {
    console.log(fileId);
    if (fileId === null || fileId === undefined) return;
    socketRef.current = socketIOClient(REACT_APP_API_URL, {
      query: { fileId },
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [fileId]);

  //

  useEffect(() => {
    if (quill == null || socketRef.current == null || fileId == null) return;
    console.log("loading content:");
    // loading document!
    return getDocumentContentById(fileId, user.userId)
      .then((result) => {
        console.log("Contentul paginii este:");
        console.log(result.data["ContentFile"]);
        quill.setContents(result.data["ContentFile"]);
        quill.enable();
      })
      .catch(() => {
        console.log("Error fetch Document Content!");
      });
  }, [quill, fileId]);

  //

  //

  // RECEIVE document changes useEffect()
  useEffect(() => {
    if (quill == null || socketRef.current == null) return;

    const handler = (delta) => {
      if (delta.senderID !== user.userId) {
        quill.updateContents(delta.body);
      }
    };
    socketRef.current.on(RECEIVE_DOCUMENT_CHANGES, handler);

    return () => {
      socketRef.current.off(RECEIVE_DOCUMENT_CHANGES, handler);
    };
  }, [quill, user.userId]);

  //

  //

  // send document changes useEffect()
  useEffect(() => {
    if (quill == null || socketRef.current == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      var dataToSend = {
        body: delta,
        senderID: user.userId,
        fileID: fileId,
        change_ID: uuidv4(),
      };
      socketRef.current.emit(SEND_DOCUMENT_CHANGES, dataToSend);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill, fileId, user.userId]);

  //

  // quill
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText(" Loading...");
    setQuill(q);
  }, []);

  //

  // set timer to renew token
  useEffect(() => {
    setAuthToken(token);
    const verifyTokenTimer = setTimeout(() => {
      dispatch(verifyTokenAsync(true));
    }, moment(expiredAt).diff() - 10 * 1000);
    return () => {
      clearTimeout(verifyTokenTimer);
    };
  }, [expiredAt, token, dispatch]);

  return (
    <div className="page">
      <Navbar />
      <div className="edit-window">
        <div className="edit-box" ref={wrapperRef}></div>
        <SaveButton />
      </div>
    </div>
  );
}

export default TextEditor;
