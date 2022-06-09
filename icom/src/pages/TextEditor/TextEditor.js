import React, { useCallback, useState, useEffect, useRef } from "react";
//
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";

import "quill/dist/quill.snow.css";
import "./textEditor.css";

import Avatar from "../../components/Avatar/Avatar";
import Navbar from "../../components/Navbar/Navbar";
import SaveButton from "./SaveButton";
import * as Quill from "quill";

import { getDocumentContentById } from "../../services/file";
import { v4 as uuidv4 } from "uuid";

import { TOOLBAR_OPTIONS } from "../../helpers/editText";
import QuillCursors from "quill-cursors";

//
const { REACT_APP_API_URL } = process.env;
//

function TextEditor() {
  Quill.register("modules/cursors", QuillCursors);

  const { folderId, fileId } = useParams();
  //
  const socketRef = useRef(null);
  //

  const [quill, setQuill] = useState();
  //
  const [onlineUsers, setOnlineUsers] = useState([]);
  //
  const [loadList, setLoadList] = useState(false);

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  useEffect(() => {
    if (fileId === null || fileId === undefined) return;
    socketRef.current = socketIOClient(REACT_APP_API_URL);

    return () => {
      socketRef.current.disconnect();
    };
  }, [fileId]);

  //

  useEffect(() => {
    //
    if (fileId === null || fileId === undefined) return;
    if (socketRef.current === null) return;
    const request = {
      userId: user.userId,
      roomId: fileId,
      type: "edit",
    };
    //
    socketRef.current.emit("join room", request, (error) => {
      if (error) {
        alert(error);
      }
    });

    socketRef.current.on("all users edit", (roomDetails) => {
      if (roomDetails.roomId !== fileId) return;
      setOnlineUsers(roomDetails.users);
      setLoadList(true);
    });

    socketRef.current.on("user joined edit", (newUser) => {
      if (newUser.roomId !== fileId) return;

      setOnlineUsers((onlineUsers) => [...onlineUsers, newUser]);
      console.log(onlineUsers);
      setLoadList(true);
    });

    socketRef.current.on("user left", (socketId) => {
      setOnlineUsers((onlineUsers) =>
        onlineUsers.filter((online) => online.id !== socketId)
      );
      setLoadList(true);
    });
  }, []);

  useEffect(() => {
    if (quill == null || socketRef.current == null || fileId == null) return;
    return getDocumentContentById(fileId, user.userId)
      .then((result) => {
        quill.setContents(result.data["ContentFile"]);
        quill.enable();
      })
      .catch(() => {
        console.log("Error fetch Document Content!");
      });
  }, [quill, fileId, user.userId]);

  //

  // receive changes
  useEffect(() => {
    if (quill == null || socketRef.current == null) return;

    const handler = (delta) => {
      if (delta.senderId !== user.userId) {
        quill.updateContents(delta.body);
      }
      //
    };

    socketRef.current.on("receive doc edit", handler);

    return () => {
      socketRef.current.off("receive doc edit", handler);
    };
  }, [quill, user.userId]);
  //

  // send document changes useEffect()
  useEffect(() => {
    if (quill == null || socketRef.current == null) return;

    quill.on("text-change", (delta, oldDelta, source) => {
      if (source !== "user") return;
      var dataToSend = {
        body: delta,
        senderId: user.userId,
        fileId: fileId,
        change_ID: uuidv4(),
      };
      socketRef.current.emit("send doc edit", dataToSend);
    });

    return () => {
      quill.off("text-change");
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
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        cursors: {
          hideDelayMs: 5000,
          hideSpeedMs: 0,
          selectionChangeSource: null,
          transformOnTextChange: true,
        },
      },
    });
    q.disable();
    q.setText(" Loading...");

    //
    setQuill(q);
  }, []);

  return (
    <div className="page">
      <Navbar />
      <div className="edit-window">
        <div className="details-bar">
          <div className="users-box">
            {loadList ? (
              onlineUsers.map((userOnline, index) => {
                return (
                  <div
                    title="user-online"
                    className="user-profile"
                    key={index}
                    style={{
                      display:
                        userOnline.userId !== user.userId ? "block" : "none",
                    }}
                  >
                    <div
                      className="picture-profile"
                      style={{ borderColor: userOnline.color }}
                    >
                      {userOnline.userId && (
                        <Avatar userId={userOnline.userId} roomId={null} />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <Spinner animation="border" />
            )}
          </div>
          <SaveButton />
        </div>
        <div className="edit-box" ref={wrapperRef}></div>
      </div>
    </div>
  );
}

export default TextEditor;
