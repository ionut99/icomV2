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
import moment from "moment";
import { getMessageListTime } from "../../asyncActions/userAsyncActions";

// import dateFormat, { masks } from "dateformat";
import date from "date-and-time";

function Room() {
  const listInnerRef = useRef();
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID, currentChannelName, channelFolderId } = chatObj;

  const [loaded, setLoaded] = useState(false);
  // set actual time
  var timevar = date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS");
  //
  const [lastMessageTime, setLastMessageTime] = useState(timevar);
  const [meesageList, setMessageList] = useState([]);

  const onScroll = () => {
    // if (listInnerRef.current) {
    //   const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
    //   // if (scrollTop + clientHeight === scrollHeight) {
    //   //   console.log("reached bottom");
    //   // }
    //   if (scrollTop === 0) {
    //     console.log("reached top");
    //     console.log(meesageList[0]);
    //     setLastMessageTime(meesageList[0].createdTime);
    //   }
    //   if (scrollTop + clientHeight === scrollHeight) {
    //     console.log("reached bottom");
    //     console.log(meesageList[meesageList.length - 1]);
    //     setLastMessageTime(meesageList[meesageList.length - 1].createdTime);
    //   }
    // }
  };

  useEffect(() => {
    if (channelID === null) return;
    var timevar = date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS");
    setLastMessageTime(timevar);
    setMessageList([]);
  }, [channelID]);

  const getMessages = async () => {
    const messages = await getMessageListTime(channelID, lastMessageTime);
    console.log(messages);
    setLoaded(true);
    setMessageList(messages);
  };

  useEffect(() => {
    if (channelID === null || lastMessageTime === null) return;
    let isMounted = true;
    getMessages();
    return () => {
      isMounted = false;
    };
  }, [lastMessageTime, channelID]);

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
              meesageList.map((message, index) => {
                const CreateMessageDate = new Date(
                  Date.parse(message.createdTime)
                );
                return (
                  <div
                    key={index}
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
