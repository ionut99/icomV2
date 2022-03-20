import React, { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";

import * as Quill from "quill";
import "quill/dist/quill.snow.css";
import "./textEditor.css";

import Navbar from "../../components/Navbar";

import Comunication from "../../services/comunication";

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
  const [quill, setQuill] = useState();

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID } = chatObj;

  const fileObj = useSelector((state) => state.fileRedu);
  const { delta, senderID } = fileObj;

  const { sendDocumentChanges } = Comunication(channelID, user.userId);

  useEffect(() => {
    if (quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      sendDocumentChanges(delta);
    };
    quill.on("text-change", handler);

    if (user.userId != senderID) {
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
    setQuill(q);
  }, []);

  return (
    <div className="edit-box">
      <Navbar className="navbar" />
      <div className="container" ref={wrapperRef}></div>
    </div>
  );
}

export default TextEditor;
