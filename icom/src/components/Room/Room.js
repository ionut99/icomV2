import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import * as BsIcons from "react-icons/bs";
import * as IoIcons2 from "react-icons/io5";
import * as AiIcons from "react-icons/ai";

import Avatar from "../Search/Avatar";

import SendMessage from "./SendMessage";
import ReactScrollableFeed from "react-scrollable-feed";
import classNames from "classnames";
import { Spinner } from "react-bootstrap";
import { monthNames } from "../../pages/Storage/FileIcons";

import "./room.css";

function Room() {
  const listInnerRef = useRef();
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID, currentChannelName, RoomMessages, channelFolderId } =
    chatObj;

  const [loaded, setLoaded] = useState(false);

  const updateIsAtBottomState = (result) => {
    console.log("dam scroll:");
    console.log(result.scrollTop);
  };

  const handleScroll = (e) => {
    console.log("se misca");
    let element = e.target;
    if (element.scrollTop === 0) {
      console.log("am ajuns din nou sus!");
    }
  };

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      // if (scrollTop + clientHeight === scrollHeight) {
      //   console.log("reached bottom");
      // }
      if (scrollTop === 0) {
        console.log("reached top");
      }
    }
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
          <div className="messages" ref={listInnerRef} onScroll={onScroll}>
            {/* <ReactScrollableFeed
              forceScroll={true}
              onScroll={(isAtBottom) => updateIsAtBottomState(isAtBottom)}
            > */}
            {loaded ? (
              RoomMessages.map((message, index) => {
                const CreateMessageDate = new Date(
                  Date.parse(message.createdTime)
                );
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
            {/* </ReactScrollableFeed> */}
          </div>
        </div>
        <SendMessage />
      </div>
    </>
  );
}

export default Room;
