import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as BsIcons from "react-icons/bs";
import * as MdIcons from "react-icons/md";
import * as CgIcons from "react-icons/cg";

import Avatar from "../Search/Avatar";

import classNames from "classnames";
import { monthNames } from "../../pages/Storage/FileIcons";
import "./room.css";

//
function Message(props) {
  const ref = useRef();
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  //
  const { message } = props;
  const CreateMessageDate = new Date(Date.parse(message.createdTime));

  //

  const [messageDetails, setmMssageDetails] = useState(false);

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
          {message.senderID === user.userId ? (
            <>{` ${
              monthNames[CreateMessageDate.getMonth()] +
              " " +
              CreateMessageDate.getDate() +
              " " +
              CreateMessageDate.getHours() +
              ":" +
              CreateMessageDate.getMinutes() +
              ":" +
              CreateMessageDate.getSeconds()
            }`}</>
          ) : (
            message.senderName
          )}
        </div>
        <div className="message_text">
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
