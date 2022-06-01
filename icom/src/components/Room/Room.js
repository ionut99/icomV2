import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import * as BsIcons from "react-icons/bs";
import * as IoIcons2 from "react-icons/io5";
import * as AiIcons from "react-icons/ai";

import Avatar from "../Search/Avatar";

import SendMessage from "./SendMessage";
import { Spinner } from "react-bootstrap";
import { getMessageListTime } from "../../asyncActions/userAsyncActions";
import date from "date-and-time";
import "./room.css";
import Message from "./Message";

function Room() {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const listInnerRef = useRef();

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID, currentChannelName, channelFolderId, RoomMessages } =
    chatObj;
  //

  //
  const [receiveNewMessage, setReceiveNewMessage] = useState(false);
  //
  const [loaded, setLoaded] = useState(false);
  var timevar = date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS");
  //
  const [lastMessageTime, setLastMessageTime] = useState({
    time: timevar,
    pos: "top",
  });

  // fetch messages function
  const getMessages = async () => {
    // setLoaded(false);
    dispatch(
      getMessageListTime(channelID, lastMessageTime.time, lastMessageTime.pos)
    );
    setLoaded(true);
  };
  //

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      if (scrollTop === 0) {
        // console.log("reached top");
        setLastMessageTime({
          time: RoomMessages[0].createdTime,
          pos: "top",
        });
      }
      if (scrollTop + clientHeight === scrollHeight) {
        // console.log("reached bottom");
        setLastMessageTime({
          time: RoomMessages[RoomMessages.length - 1].createdTime,
          pos: "bottom",
        });
      }
    }
  };

  // set current time for messages
  useEffect(() => {
    if (channelID === null) return;
    var timevar = date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS");
    setLastMessageTime({
      time: timevar,
      pos: "top",
    });
  }, [channelID]);

  //
  useEffect(async () => {
    if (channelID === null || lastMessageTime.time === null) return;
    let isMounted = true;
    if (isMounted) {
      // setLoaded(false);
      // await timeout(500);
      getMessages();
    }
    return () => {
      isMounted = false;
    };
  }, [lastMessageTime, channelID]);
  //

  //
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setReceiveNewMessage(false);
  }, [receiveNewMessage]);

  return (
    <>
      <div
        className="right-section-empty"
        style={{ display: channelID ? "none" : "block" }}
      ></div>
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
            {loaded ? (
              RoomMessages.map((message, index) => {
                return <Message message={message} key={index} />;
              })
            ) : (
              <Spinner animation="border" />
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <SendMessage setReceiveNewMessage={setReceiveNewMessage} />
      </div>
    </>
  );
}

export default Room;
