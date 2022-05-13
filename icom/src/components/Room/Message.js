import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { monthNames } from "../../pages/Storage/FileIcons";

import Avatar from "../Search/Avatar";
import { getUserDetails } from "../../services/user";

function Message({ RoomMessages }) {
  const [senderDetails, SetsenderDetails] = useState({
    Surname: "",
    Name: "",
    Email: "",
    IsAdmin: 0,
    Avatar: "",
  });
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  const CreateMessageDate = new Date(Date.parse(RoomMessages.createdTime));

  useEffect(() => {
    if (RoomMessages.senderID == null || RoomMessages.senderID === undefined)
      return;
    let isMounted = true;
    return getUserDetails(RoomMessages.senderID)
      .then((result) => {
        if (isMounted && result.status === 200) {
          SetsenderDetails(result.data["userDetails"][0]);
        }
        return () => {
          isMounted = false;
        };
      })
      .catch(() => {
        console.log("Error fetch details about message senderId!");
      });
  }, [RoomMessages.senderID]);

  return (
    <>
      <div className="user_picture">
        <Avatar userId={RoomMessages.senderID} roomId={null} />
      </div>
      <div className="message_body">
        <div className="message_author">
          {RoomMessages.senderID === user.userId ? (
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
            senderDetails.Surname + " " + senderDetails.Name
          )}
        </div>
        <div className="message_text">
          <p>{RoomMessages.Body}</p>
        </div>
      </div>
    </>
  );
}

export default Message;
