import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as BsIcons from "react-icons/bs";
import * as MdIcons from "react-icons/md";
import * as CgIcons from "react-icons/cg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Avatar from "../Avatar/Avatar";

import classNames from "classnames";
import { handleReturnHumanDateFormat } from "../../helpers/FileIcons";
import { handleReturnFileIcon } from "../../helpers/FileIcons";

import { getPicturePreview } from "../../asyncActions/fileAsyncActions";

import "./room.css";

//
function Message(props) {
  const ref = useRef();
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  //
  const { message } = props;
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
    const getPicture = async (fileId, userId) => {
      const avatarSrc = await getPicturePreview(fileId, userId);
      if (avatarSrc === "failed" || avatarSrc === "default") return undefined;
      else return avatarSrc;
    };

    getPicture(message.fileId, user.userId).then((result) => {
      if (isMounted) setPictureSrc(result);
    });

    // setLoaded(true);
    return () => {
      isMounted = false;
    };
  }, [message]);

  return (
    <div
      className={classNames("one_message", {
        me: message.senderID === user.userId,
      })}
      ref={ref}
    >
      <div
        className="user_picture"
        style={{
          display: message.senderID !== user.userId ? "flex" : "none",
        }}
      >
        <Avatar userId={message.senderID} roomId={null} />
      </div>
      <div className="message_body">
        <div className="message_author">
          {message.senderID === user.userId
            ? handleReturnHumanDateFormat(message.createdTime)
            : message.senderName}
        </div>
        <div className="message_content">
          {/* <img src={pictureSrc} alt="message picture" /> */}
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
                color: "#0969da",
              }}
            />
          </div>
          <p>{message.Body}</p>
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
