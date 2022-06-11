import React, { useState, useEffect, useRef } from "react";
//
import socketIOClient from "socket.io-client";
//
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
//
import { TOOLBAR_OPTIONS } from "../../helpers/editText";
import QuillCursors from "quill-cursors";
import * as Quill from "quill";
import cloneDeep from "lodash/cloneDeep";
import "quill/dist/quill.snow.css";

import Avatar from "../../components/Avatar/Avatar";
import Navbar from "../../components/Navbar/Navbar";
import SaveButton from "./SaveButton";
import AppUsers from "./AppUsers";

import { getDocumentContentById } from "../../services/file";
import { v4 as uuidv4 } from "uuid";

//
import { connectSocketToChannel } from "../../services/socket";
//
import "./textEditor.css";

const { REACT_APP_API_URL } = process.env;

//

function TextEditor() {
  Quill.register("modules/cursors", QuillCursors, true);

  const dispatch = useDispatch();
  const { folderId, fileId } = useParams();

  //

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  //

  const socketRef = useRef(null);
  //
  const editorRef = useRef(null);
  //
  const mousePointerRef = useRef(null);
  const editorCursorRef = useRef(null);
  //
  const [presences, setPresences] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  //
  const colorRef = useRef(null);

  // users handler
  const setUsers = (usersList) => {
    setOnlineUsers(usersList);
  };

  const addUser = (newUser) => {
    setOnlineUsers((onlineUsers) => [...onlineUsers, newUser]);
  };

  const removeUser = (socketId) => {
    setOnlineUsers((onlineUsers) =>
      onlineUsers.filter((online) => online.id !== socketId)
    );
  };
  //

  //
  const saveDocumentState = () => {
    if (editorRef.current == null) return;
    //
    const delta = editorRef.current.getContents();
    const deltaLength = editorRef.current.getLength();

    console.log(delta);
    console.log(deltaLength);
  };

  //
  const getUsersPresence = (id, data) => {
    if (!data) {
      // if data is empty, then delete this presence, because the user is offline
      setPresences((prev) => {
        const newState = cloneDeep(prev);
        delete newState[id];

        if (editorRef.current) {
          const cursors = editorRef.current.getModule("cursors");
          cursors.removeCursor(id);
        }
        return newState;
      });
    } else if (data.userName && data.userId) {
      setPresences((prev) => {
        const newState = cloneDeep(prev);
        newState[id] = {
          id,
          ...data,
        };

        newState[id].color = data.color;
        //
        if (editorRef.current) {
          const cursors = editorRef.current.getModule("cursors");
          if (data.editorCursor) {
            cursors.createCursor(id, data.userName, data.color);
            cursors.moveCursor(id, data.editorCursor);
            cursors.toggleFlag(id, true);
          } else {
            cursors.removeCursor(id);
          }
        }
        return newState;
      });
    }
  };

  //create socket...
  useEffect(() => {
    if (fileId === null || fileId === undefined) return;
    socketRef.current = socketIOClient(REACT_APP_API_URL);

    return () => {
      socketRef.current.disconnect();
    };
  }, [fileId]);

  //join room..
  useEffect(() => {
    //
    if (socketRef.current == null) return;
    //
    socketRef.current.emit(
      "join room",
      {
        userId: user.userId,
        roomId: fileId,
        type: "edit",
      },
      (error) => {
        if (error) {
          // alert(error);
          console.log(error);
        }
      }
    );
    //
    socketRef.current.on("all users edit", (data) => {
      if (data.roomId !== fileId) return;
      colorRef.current = data.color;
      setUsers(data.users);
    });

    socketRef.current.on("user joined edit", (newUser) => {
      if (newUser.roomId !== fileId) return;
      addUser(newUser);
    });
    //
    socketRef.current.on("user left", (socketId) => {
      removeUser(socketId);
    });
    //
  }, []);

  //manage users activity
  useEffect(() => {
    //
    if (socketRef.current == null) return;
    let itMounted = true;

    socketRef.current.on("receive doc edit", (data) => {
      if (itMounted && data.userId !== user.userId) {
        editorRef.current.updateContents(data.body);
      }
      //
    });
    //
    socketRef.current.on("receive doc presence", (data) => {
      if (itMounted && data.fileId !== fileId) return;
      getUsersPresence(socketRef.current.id, data);
    });

    //
    socketRef.current.on("receive doc pointer", (data) => {
      if (itMounted && data.fileId !== fileId) return;
      getUsersPresence(socketRef.current.id, data);
    });
    //
    return () => {
      itMounted = false;
    };
    //
  }, []);

  // init edit box
  useEffect(() => {
    if (editorRef.current == null) {
      const editor = new Quill("#editor-container", {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
          history: {
            delay: 1000,
            maxStack: 500,
          },
          cursors: {
            transformOnTextChange: true,
          },
        },
      });
      editorRef.current = editor;
    }
  }, []);

  // init quill
  useEffect(() => {
    //
    if (editorRef == null) return;
    //
    editorRef.current.on("text-change", (delta, oldDelta, source) => {
      if (source !== "user") return;
      delta.type = "rich-text";
      if (socketRef.current) {
        const request = {
          body: delta,
          fileId: fileId,
          userId: user.userId,
        };
        //
        socketRef.current.emit("send doc edit", request);
      }
    });

    //

    editorRef.current.on(
      "selection-change",
      function (range, oldRange, source) {
        editorCursorRef.current = range;
        if (socketRef.current) {
          //
          const request = {
            fileId: fileId,
            userId: user.userId,
            userName: user.name,
            color: colorRef.current,
            editorCursor: range,
            mousePointer: mousePointerRef.current,
          };
          //
          socketRef.current.emit("send doc pointer", request);
        }
      }
    );
  }, [editorRef]);

  //
  useEffect(() => {
    //
    const container = document.querySelector("#editor-container");
    const handler = (e) => {
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      // calculate relative position of the mouse in the container
      var left = e.clientX - containerRect.left;
      var top = e.clientY - containerRect.top;
      const value = {
        left,
        top,
      };
      mousePointerRef.current = value;
      if (socketRef.current) {
        //
        const request = {
          fileId: fileId,
          userId: user.userId,
          userName: user.name,
          color: colorRef.current,
          mousePointer: value,
          editorCursor: editorCursorRef.current,
        };
        //
        socketRef.current.emit("send doc presence", request);
      }
    };

    window.addEventListener("mousemove", handler);
    return () => {
      window.removeEventListener("mousemove", handler);
    };
  }, [editorRef]);
  //

  return (
    <div className="page">
      <Navbar />
      <div className="edit-window">
        <div className="details-bar">
          <div className="users-box">
            {true ? (
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
                      // style={{ borderColor: }}
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
          <SaveButton
            saveDocumentState={saveDocumentState}
            fileId={fileId}
            folderId={folderId}
          />
        </div>
        <div className="edit-box" id="editor-container"></div>
        <AppUsers presences={presences} />
      </div>
    </div>
  );
}

export default TextEditor;
