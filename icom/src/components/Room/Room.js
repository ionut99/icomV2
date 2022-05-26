import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import * as BsIcons from "react-icons/bs";
import * as IoIcons2 from "react-icons/io5";
import * as AiIcons from "react-icons/ai";

import Avatar from "../Search/Avatar";

import SendMessage from "./SendMessage";
import ReactScrollableFeed from "react-scrollable-feed";
import classNames from "classnames";
import { monthNames } from "../../pages/Storage/FileIcons";
import { Spinner } from "react-bootstrap";

import "./room.css";

function Room() {
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID, currentChannelName, RoomMessages, channelFolderId } =
    chatObj;

  console.log(RoomMessages);

  const [date, setDate] = useState();
  const [loaded, setLoaded] = useState(false);

  const tranformDate = (sendTime) => {
    setDate(new Date(Date.parse(sendTime)));
  };

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <div
        className="right-section-empty"
        style={{ display: channelID ? "none" : "block" }}
      >
        {/* <p>Choose a channel or create a new one</p> */}
      </div>
      <div
        className="right-section"
        style={{ display: channelID ? "block" : "none" }}
      >
        <div className="conversation-details">
          <div className="user_picture">
            <Avatar userId={user.userId} roomId={channelID} />
          </div>
          <div className="room-name">
            <p>{currentChannelName}</p>
          </div>
          <div className="room-instrument">
            <Link to={`/storage/folder/${channelFolderId}`}>
              {<AiIcons.AiOutlineFile />}
            </Link>
          </div>
          <div className="room-instrument">
            <Link to={`/roomcall/${channelID}`}>
              <BsIcons.BsCameraVideo />
            </Link>
          </div>
          <div className="room-instrument">
            <IoIcons2.IoCallOutline />
          </div>
        </div>
        <div className="test-scrollbar">
          <div className="messages">
            <ReactScrollableFeed>
              {loaded ? (
                RoomMessages.map((message, index) => {
                  return (
                    <div
                      key={message.messageID}
                      className={classNames("one_message", {
                        me: message.senderID === user.userId,
                      })}
                    >
                      {/* <Message RoomMessages={RoomMessages} /> */}
                      <div className="user_picture">
                        <Avatar userId={message.senderID} roomId={null} />
                      </div>
                      <div className="message_body">
                        <div className="message_author">
                          {message.senderID === user.userId ? (
                            <>lala</>
                          ) : (
                            message.UserName
                          )}
                        </div>
                        <div className="message_text">
                          <p>{message.Body}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <Spinner animation="border" />
              )}
            </ReactScrollableFeed>
          </div>
        </div>
        <SendMessage />
      </div>
    </>
  );
}

export default Room;
