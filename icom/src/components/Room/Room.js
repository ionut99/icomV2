import React, { useState, useEffect, useRef, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

import * as BsIcons from "react-icons/bs";
import * as IoIcons2 from "react-icons/io5";
import * as AiIcons from "react-icons/ai";
//
import { getMessageListTime } from "../../asyncActions/userAsyncActions";
//
import {
  InsertNewMessageLocal,
  UpdateLastMessage,
} from "../../actions/userActions";
//
import Avatar from "../Avatar/Avatar";
import SendMessage from "./SendMessage";
import Message from "./Message";

import date from "date-and-time";
import "./room.css";

import { SocketContext } from "../../context/socket";

function Room(props) {
  const { receiveNewMessage, setReceiveNewMessage } = props;
  const dispatch = useDispatch();
  //
  const messagesEndRef = useRef(null);
  const listInnerRef = useRef();
  //
  const socketRef = useRef(null);
  socketRef.current = useContext(SocketContext);
  //
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const chatObj = useSelector((state) => state.chatRedu);
  const { channelId, currentChannelName, channelFolderId, roomMessages } =
    chatObj;

  const [userTyping, setUserTyping] = useState({
    userName: undefined,
    userId: undefined,
  });
  const [loaded, setLoaded] = useState(false);
  //
  const [lastMessageTime, setLastMessageTime] = useState({
    time: date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS"),
    pos: "top",
  });

  const getMessages = async () => {
    dispatch(
      getMessageListTime(channelId, lastMessageTime.time, lastMessageTime.pos)
    );
  };

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      if (scrollTop === 0) {
        if (roomMessages.length > 0) {
          setLastMessageTime({
            time: roomMessages[0].createdTime,
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
        if (roomMessages.length > 0) {
          setLastMessageTime({
            time: roomMessages[roomMessages.length - 1].createdTime,
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
    if (channelId === null) return;
    var timevar = date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS");
    setLastMessageTime({
      time: timevar,
      pos: "top",
    });
  }, [channelId]);

  //
  useEffect(async () => {
    if (channelId === null || lastMessageTime.time === null) return;
    getMessages();
    setLoaded(true);
  }, [lastMessageTime, channelId]);
  //

  //
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    return () => {
      setReceiveNewMessage(false);
    };
  }, [receiveNewMessage]);

  // receive message from socket and insert in local messages list
  useEffect(() => {
    if (channelId === null) return;
    if (socketRef.current === null) return;

    socketRef.current.on("receive chat message", (message) => {
      console.log("am primit un mesaj");
      if (message.roomId !== null) {
        dispatch(UpdateLastMessage(message.body, message.roomId));
        if (message.roomId === channelId) {
          dispatch(InsertNewMessageLocal(message));
          setReceiveNewMessage(true);
        }
      }
    });
    return () => {
      socketRef.current.off("receive chat message");
    };
  }, [channelId]);
  // receive message

  // receive typing event
  useEffect(() => {
    if (channelId === null) return;
    if (socketRef.current === null) return;

    socketRef.current.on("user typing", (request) => {
      if (request.roomId === channelId) {
        setUserTyping({
          userName: request.userName,
          userId: request.userId,
        });
      }
    });
    return () => {
      // socketRef.current.off("user typing");
    };
  }, [channelId]);

  //

  useEffect(() => {
    if (channelId === null) return;
    if (userTyping.userId === undefined) return;
    const timeoutID = setTimeout(() => {
      setUserTyping({
        userName: undefined,
        userId: undefined,
      });
    }, 1000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [userTyping]);

  return (
    <>
      {loaded ? (
        <div
          className="right-section"
          style={{ display: channelId ? "block" : "none" }}
          onLoad={() => setLoaded(true)}
        >
          <div className="conversation-details">
            <div className="user_picture">
              <Avatar userId={user.userId} roomId={channelId} />
            </div>
            <div className="room-name">
              <p>{currentChannelName}</p>
              <div
                className="is-typing"
                style={{
                  display:
                    userTyping.userId && userTyping.userId !== user.userId
                      ? "block"
                      : "none",
                }}
              >
                <p>{userTyping.userName} is typing ...</p>
              </div>
            </div>
            <div className="room-instrument">
              <Link to={`/storage/folder/${channelFolderId}`}>
                {<AiIcons.AiOutlineFile />}
              </Link>
            </div>
            <div className="room-instrument">
              <Link to={`/roomcall/${channelId}`}>
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
                roomMessages.map((message, index) => {
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
      ) : (
        <div
          className="right-section-empty"
          style={{ display: channelId ? "flex" : "none" }}
        >
          <Spinner animation="border" />
        </div>
      )}
    </>
  );
}

export default Room;
