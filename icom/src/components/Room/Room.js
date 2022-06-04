import React, { useState, useEffect, useRef, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import * as BsIcons from "react-icons/bs";
import * as IoIcons2 from "react-icons/io5";
import * as AiIcons from "react-icons/ai";

import Avatar from "../Avatar/Avatar";

import SendMessage from "./SendMessage";
import { Spinner } from "react-bootstrap";
import { getMessageListTime } from "../../asyncActions/userAsyncActions";

import {
  InsertNewMessageLocal,
  UpdateLastMessage,
} from "../../actions/userActions";

import date from "date-and-time";
import "./room.css";
import Message from "./Message";

import { SocketContext } from "../../context/socket";

function Room(props) {
  const { receiveNewMessage, setReceiveNewMessage } = props;
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const listInnerRef = useRef();

  //
  const socketRef = useRef(null);
  socketRef.current = useContext(SocketContext);
  //

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelID, currentChannelName, channelFolderId, RoomMessages } =
    chatObj;

  const [loaded, setLoaded] = useState(false);
  //
  const [lastMessageTime, setLastMessageTime] = useState({
    time: date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS"),
    pos: "top",
  });

  const getMessages = async () => {
    dispatch(
      getMessageListTime(channelID, lastMessageTime.time, lastMessageTime.pos)
    );
  };

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      if (scrollTop === 0) {
        if (RoomMessages.length > 0) {
          setLastMessageTime({
            time: RoomMessages[0].createdTime,
            pos: "top",
          });
        } else {
          setLastMessageTime({
            time: date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS"),
            pos: "top",
          });
        }
      }
      if (scrollTop + clientHeight === scrollHeight) {
        if (RoomMessages.length > 0) {
          setLastMessageTime({
            time: RoomMessages[RoomMessages.length - 1].createdTime,
            pos: "bottom",
          });
        } else {
          setLastMessageTime({
            time: date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS"),
            pos: "bottom",
          });
        }
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
    getMessages();
    setLoaded(true);
  }, [lastMessageTime, channelID]);
  //

  //
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    return () => {
      setReceiveNewMessage(false);
    };
  }, [receiveNewMessage]);

  //
  // receive message from socket and insert in local messages list
  useEffect(() => {
    if (channelID === null) return;
    if (socketRef.current === null) return;

    socketRef.current.on("receive chat message", (message) => {
      if (message.roomID != null) {
        dispatch(UpdateLastMessage(message.messageBody, message.roomID));
        if (message.roomID === channelID) {
          dispatch(InsertNewMessageLocal(message));
          setReceiveNewMessage(true);
        }
      }
    });
    return () => {
      socketRef.current.off("receive chat message");
    };
  }, [channelID]);
  // receive message
  //

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
        <SendMessage />
      </div>
    </>
  );
}

export default Room;
