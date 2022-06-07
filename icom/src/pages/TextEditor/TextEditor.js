import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  // useContext,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Spinner } from "react-bootstrap";

import { verifyTokenAsync } from "../../asyncActions/authAsyncActions";
import { setAuthToken } from "../../services/auth";
//
import "quill/dist/quill.snow.css";
import "./textEditor.css";

import Avatar from "../../components/Avatar/Avatar";
import Navbar from "../../components/Navbar/Navbar";
import SaveButton from "./SaveButton";
import * as Quill from "quill";

import { v4 as uuidv4 } from "uuid";
import { getDocumentContentById } from "../../services/file";

// import { SocketContext } from "../../context/socket";

import { TOOLBAR_OPTIONS } from "../../helpers/editText";

//
const { REACT_APP_API_URL } = process.env;
//

function TextEditor() {
  const { folderId, fileId } = useParams();
  const fileID = fileId;
  //
  const socketRef = useRef(null);
  // socketRef.current = useContext(SocketContext);
  //
  const dispatch = useDispatch();

  const [quill, setQuill] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loadList, setLoadList] = useState(false);

  const authObj = useSelector((state) => state.auth);
  const { user, expiredAt, token } = authObj;

  useEffect(() => {
    if (fileID === null || fileID === undefined) return;
    socketRef.current = socketIOClient(REACT_APP_API_URL);

    return () => {
      socketRef.current.disconnect();
    };
  }, [fileID]);

  //

  useEffect(() => {
    if (fileID === null || fileID === undefined) return;
    if (socketRef.current === null) return;
    const request = {
      userID: user.userId,
      roomID: fileID,
      type: "edit",
    };
    //
    socketRef.current.emit("join room", request, (error) => {
      if (error) {
        alert(error);
      }
    });

    socketRef.current.on("all users", (roomDetails) => {
      if (roomDetails.roomID !== fileID) return;
      setOnlineUsers(roomDetails.users);
      setLoadList(true);
    });

    socketRef.current.on("user left", (socketID) => {
      setOnlineUsers((onlineUsers) =>
        onlineUsers.filter((online) => online.id !== socketID)
      );
      setLoadList(true);
    });
  }, []);

  //

  useEffect(() => {
    if (quill == null || socketRef.current == null || fileID == null) return;
    return getDocumentContentById(fileID, user.userId)
      .then((result) => {
        quill.setContents(result.data["ContentFile"]);
        quill.enable();
      })
      .catch(() => {
        console.log("Error fetch Document Content!");
      });
  }, [quill, fileID, user.userId]);

  //

  // RECEIVE document changes useEffect()
  useEffect(() => {
    if (quill == null || socketRef.current == null) return;

    const handler = (delta) => {
      if (delta.senderID !== user.userId) {
        quill.updateContents(delta.body);
      }
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

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      var dataToSend = {
        body: delta,
        senderID: user.userId,
        fileID: fileID,
        change_ID: uuidv4(),
      };
      socketRef.current.emit("send doc edit", dataToSend);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill, fileID, user.userId]);

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
        <div className="details-bar">
          <div className="users-box">
            {loadList ? (
              onlineUsers.map((userOnline, index) => {
                return (
                  <div
                    className="user-profile"
                    key={index}
                    style={{
                      display:
                        userOnline.userID !== user.userId ? "block" : "none",
                    }}
                  >
                    <div
                      className="picture-profile"
                      style={{ borderColor: userOnline.color }}
                    >
                      {userOnline.userID && (
                        <Avatar userId={userOnline.userID} roomId={null} />
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
