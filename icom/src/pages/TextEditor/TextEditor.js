import React, { useState, useEffect, useRef, useContext } from "react";
//
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";

import "quill/dist/quill.snow.css";
import "./textEditor.css";

import Avatar from "../../components/Avatar/Avatar";
import Navbar from "../../components/Navbar/Navbar";
import cloneDeep from "lodash/cloneDeep";
import SaveButton from "./SaveButton";
import * as Quill from "quill";
import AppUsers from "./AppUsers";

import { getDocumentContentById } from "../../services/file";
import { v4 as uuidv4 } from "uuid";

import { TOOLBAR_OPTIONS } from "../../helpers/editText";
import QuillCursors from "quill-cursors";

//
import { SocketContext } from "../../context/socket";
import { connectSocketToChannel } from "../../services/socket";
//
import { connectEditRoom, disconnectEditRoom } from "../../actions/authActions";
//

//
const colors = [
  "blue",
  "green",
  "brown",
  "chartreuse",
  "blueviolet",
  "burlywood",
  "red",
  "chocolate",
  "coral",
  "crimson",
  "cyan",
  "darkgreen",
  "DarkKhaki",
  "DarkMagenta",
  "DarkOliveGreen",
  "DarkOrange",
  "DarkOrchid",
  "DarkRed",
  "DarkSalmon",
  "DeepPink",
  "DeepSkyBlue",
  "FireBrick",
  "GoldenRod",
  "GreenYellow",
];

const getUserColor = (index) => colors[index % colors.length];

function TextEditor() {
  Quill.register("modules/cursors", QuillCursors, true);

  const dispatch = useDispatch();
  const { folderId, fileId } = useParams();

  //

  const authObj = useSelector((state) => state.auth);
  const { user, editConnected } = authObj;
  //

  const socketRef = useRef(null);
  socketRef.current = useContext(SocketContext);
  //
  const editorRef = useRef(null);
  //
  const mousePointerRef = useRef(null);
  const editorCursorRef = useRef(null);
  //

  const [presences, setPresences] = useState({});
  //
  const [onlineUsers, setOnlineUsers] = useState([]);
  const usersRef = useRef(Array(0));

  // users handler
  const setUsers = (usersList) => {
    setOnlineUsers(usersList);
    usersRef.current = usersList;
  };

  const addUser = (newUser) => {
    setOnlineUsers((onlineUsers) => [...onlineUsers, newUser]);
    usersRef.current.push(newUser);
  };

  const removeUser = (socketId) => {
    setOnlineUsers((onlineUsers) =>
      onlineUsers.filter((online) => online.id !== socketId)
    );
    usersRef.current = usersRef.current.filter(
      (online) => online.id !== socketId
    );
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

        const index = Object.keys(newState).findIndex((item) => item === id);
        const Ucolor = getUserColor(index);
        newState[id].color = Ucolor;
        //
        if (editorRef.current) {
          const cursors = editorRef.current.getModule("cursors");
          if (data.editorCursor) {
            cursors.createCursor(id, data.userName, Ucolor);
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

  //connect
  useEffect(() => {
    //
    if (socketRef.current == null) return;

    const request = {
      userId: user.userId,
      roomId: fileId,
      type: "edit",
    };
    //
    if (!editConnected) connectSocketToChannel(request);
    //
    return () => {
      dispatch(connectEditRoom());
    };
    //
  }, []);

  //manage users join
  useEffect(() => {
    //
    if (socketRef.current == null) return;
    //

    socketRef.current.on("all users edit", (roomDetails) => {
      if (roomDetails.roomId !== fileId) return;
      setUsers(roomDetails.users);
    });

    socketRef.current.on("user joined edit", (newUser) => {
      if (newUser.roomId !== fileId) return;
      addUser(newUser);
    });
    //
    socketRef.current.on("user left", (socketId) => {
      removeUser(socketId);
    });
  }, []);

  //menage users activity
  useEffect(() => {
    //
    if (socketRef.current == null) return;

    socketRef.current.on("receive doc edit", (data) => {
      if (data.userId !== user.userId) {
        editorRef.current.updateContents(data.body);
      }
      //
    });

    //
    socketRef.current.on("receive doc presence", (data) => {
      if (data.fileId !== fileId) return;
      getUsersPresence(socketRef.current.id, data);
    });

    //
    socketRef.current.on("receive doc pointer", (data) => {
      if (data.fileId !== fileId) return;
      getUsersPresence(socketRef.current.id, data);
    });
    //

    //
  }, []);

  // init edit box
  useEffect(() => {
    if (editorRef.current == null) {
      const editor = new Quill("#editor-container", {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
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
        <div className="edit-box" id="editor-container"></div>
        <AppUsers presences={presences} />
      </div>
    </div>
  );
}

export default TextEditor;
