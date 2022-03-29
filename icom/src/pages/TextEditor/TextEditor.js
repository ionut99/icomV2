import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import * as Quill from "quill";
import "quill/dist/quill.snow.css";
import "./textEditor.css";

import Navbar from "../../components/Navbar/Navbar";
import { setAuthToken } from "../../services/auth";
import Comunication from "../../services/comunication";
import { verifyTokenAsync } from "../../asyncActions/authAsyncActions";

import UserAvatar from "../../images/userAvatar.png";

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
  // lista test pentru ultimele schimbari realizate
  var changeList = [];
  for (let i = 0; i < 20; i++) {
    changeList.push({
      Type: "delete",
      Author: "Mihai",
      Time: "21:44 29Mar2022",
    });
  }

  // lista test pentru userii online

  var onlineUserList = [];
  for (let i = 0; i < 30; i++) {
    onlineUserList.push({
      ProfilePicture: "pozaBuletin",
      Nume: "Marian",
    });
  }
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
    const verifyTokenTimer = setTimeout(() => {
      dispatch(verifyTokenAsync(true));
    }, moment(expiredAt).diff() - 10 * 1000);
    return () => {
      clearTimeout(verifyTokenTimer);
    };
  }, [expiredAt, token, dispatch]);

  return (
    <div className="container-page">
      <Navbar className="navbar" />
      <div className="edit-window">
        <div className="edit-box" ref={wrapperRef}></div>
        <div className="changes-list">
          {changeList.map((changeList, index) => {
            return (
              <div className="one-change" key={index}>
                <div className="change-time">
                  <p>{changeList.Time}</p>
                </div>
                <div className="change-author">
                  <p>{changeList.Author}</p>
                </div>
                <div className="change-type">
                  <p>{changeList.Type}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="online-user-list">
          <p>Online Users:</p>
          <div className="users-box">
            {onlineUserList.map((onlineUserList, index) => {
              return (
                <div className="user-profile" key={index}>
                  <div className="picture-profile">
                    <img
                      src={UserAvatar}
                      alt="userAvatar jmecher"
                      // onClick={showdropdownMenu}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextEditor;
