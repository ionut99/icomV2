import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as MdIcons from "react-icons/md";
import * as CgIcons from "react-icons/cg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getPicturePreview } from "../../asyncActions/fileAsyncActions";
import { handleReturnHumanDateFormat } from "../../helpers/FileIcons";
import { handleReturnFileIcon } from "../../helpers/FileIcons";

import { DownloadFileFromServer } from "../../asyncActions/fileAsyncActions";

import Avatar from "../Avatar/Avatar";
import classNames from "classnames";
import "./room.css";

//
function Message(props) {
  const ref = useRef();
  const dispatch = useDispatch();
  //
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  //
  const { message } = props;

  // console.log("Corpul mesajului este:");
  // console.log(message);
  //
  const [messageDetails, setmMssageDetails] = useState(false);
  //
  const [pictureSrc, setPictureSrc] = useState(undefined);
  //
  useEffect(() => {
    let isMounted = true;
    const checkIfClickedOutside = (e) => {
      if (
        isMounted &&
        messageDetails &&
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setmMssageDetails(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      isMounted = false;
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [messageDetails]);

  // return preview of image
  useEffect(() => {
    if (message.fileId === undefined) return;
    //
    if (
      message.type !== "image/jpeg" &&
      message.type !== "image/png" &&
      message.type !== "image/gif"
    )
      return;
    //
    let isMounted = true;

    getPicturePreview(message.fileId, user.userId).then((result) => {
      if (isMounted) {
        if (pictureSrc !== "failed") setPictureSrc(result);
      }
    });

    // setLoaded(true);
    return () => {
      isMounted = false;
    };
  }, [message]);

  //
  const handleDownloadFile = (fileId, fileName, userId) => {
    if (message.type !== "text" && message.fileId !== undefined)
      dispatch(DownloadFileFromServer(fileId, fileName, userId));
    else return;
  };

  return (
    <div
      className={classNames("one_message", {
        me: message.senderId === user.userId,
      })}
      ref={ref}
    >
      <div
        className="user_picture"
        style={{
          display: message.senderId !== user.userId ? "flex" : "none",
        }}
      >
        <Avatar userId={message.senderId} roomId={null} />
      </div>
      <div className="message_cassete">
        <div className="message_author">
          {message.senderId === user.userId
            ? handleReturnHumanDateFormat(message.createdTime)
            : message.senderName}
        </div>
        <div className="message_content">
          <div
            className="message_picture"
            style={{
              display: pictureSrc !== undefined ? "flex" : "none",
            }}
          >
            <img src={pictureSrc} alt="message picture" />
          </div>
          <div className="message_body">
            <div
              className="message_icon"
              style={{
                display: message.type !== "text" ? "block" : "none",
              }}
            >
              <FontAwesomeIcon
                icon={handleReturnFileIcon(message.type)}
                className="icon"
                style={{
                  display:
                    message.type !== "image/jpeg" &&
                    message.type !== "image/png" &&
                    message.type !== "image/gif"
                      ? "block"
                      : "none",
                  color: "#0969da",
                }}
              />
            </div>

            <div
              className={classNames("text", {
                link: message.type !== "text" && message.fileId !== undefined,
              })}
              onClick={() => {
                handleDownloadFile(message.fileId, message.body, user.userId);
              }}
            >
              <p>{message.body}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="message_options">
        <div className="details_button">
          <MdIcons.MdExpandMore
            onClick={() => {
              setmMssageDetails(!messageDetails);
            }}
            sx={{ fontSize: 25, color: "#dadde0" }}
            className="button"
          ></MdIcons.MdExpandMore>

          <div
            className="m-dropdown-content"
            style={{ display: messageDetails ? "block" : "none" }}
          >
            <div className="dropdown-instrument" onClick={() => {}}>
              <BsIcons.BsReplyFill size={20} />
              <p>Reply</p>
            </div>
            <div className="dropdown-instrument" onClick={() => {}}>
              <CgIcons.CgDetailsMore size={20} />
              <p>Details</p>
            </div>
            <div
              className="dropdown-instrument"
              onClick={() =>
                handleDownloadFile(message.fileId, message.body, user.userId)
              }
              style={{
                display:
                  message.type !== "text" && message.fileId !== undefined
                    ? "flex"
                    : "none",
              }}
            >
              <AiIcons.AiOutlineCloudDownload size={20} />
              <p>Download</p>
            </div>
            <div className="dropdown-instrument" onClick={() => {}}>
              <MdIcons.MdDeleteOutline size={20} />
              <p>Delete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
