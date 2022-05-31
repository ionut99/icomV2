import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import * as BsIcons from "react-icons/bs";
import * as IoIcons2 from "react-icons/io5";
import * as AiIcons from "react-icons/ai";

import Avatar from "../Search/Avatar";

import SendMessage from "./SendMessage";
import classNames from "classnames";
import { Spinner } from "react-bootstrap";
import { monthNames } from "../../pages/Storage/FileIcons";
import "./room.css";
import { getMessageListTime } from "../../asyncActions/userAsyncActions";
import { updateMessageChannelList } from "../../actions/userActions";
import date from "date-and-time";

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
  const [receiveNewMessage, setReceiveNewMessage] = useState(false);
  //
  const [loaded, setLoaded] = useState(false);
  var timevar = date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS");
  //
  const [lastMessageTime, setLastMessageTime] = useState({
    time: timevar,
    pos: "top",
  });

  // const timeout = (delay) => {
  //   return new Promise((res) => setTimeout(res, delay));
  // };
  //

  // fetch messages function
  const getMessages = async () => {
    // setLoaded(false);
    const messageslist = await getMessageListTime(
      channelID,
      lastMessageTime.time,
      lastMessageTime.pos
    );
    dispatch(updateMessageChannelList(messageslist, lastMessageTime.pos));
    setLoaded(true);
  };
  //

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      if (scrollTop === 0) {
        console.log("reached top");
        setLastMessageTime({
          time: RoomMessages[0].createdTime,
          pos: "top",
        });
      }
      if (scrollTop + clientHeight === scrollHeight) {
        console.log("reached bottom");
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
                          message.senderName
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
            <div ref={messagesEndRef} />
          </div>
        </div>
        <SendMessage setReceiveNewMessage={setReceiveNewMessage} />
      </div>
    </>
  );
}

export default Room;
