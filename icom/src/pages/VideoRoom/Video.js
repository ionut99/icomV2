import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import Avatar from "../../components/Avatar/Avatar";

import { getUserDetails } from "../../services/user";
//
import { faMicrophoneAltSlash } from "@fortawesome/free-solid-svg-icons";
//
const StyledVideo = styled.video`
  height: 300px;
`;

export default function Video(props) {
  const ref = useRef();
  //
  const [userName, setUserName] = useState("Username");
  //
  const { peerId, stopCamera, stopMicrophone, peerUserId } = props;
  //
  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  useEffect(() => {
    if (peerUserId === null) return;
    //
    let isMounted = true;

    getUserDetails(peerUserId).then((result) => {
      if (isMounted) {
        if (result !== undefined) {
          setUserName(
            result.data["userDetails"].name +
              " " +
              result.data["userDetails"].surname
          );
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [peerUserId]);

  return (
    <div>
      <StyledVideo
        playsInline
        autoPlay
        ref={ref}
        style={{
          display:
            peerId !== stopCamera.socketId || stopCamera.camera
              ? "block"
              : "none",
        }}
      />
      <div
        className="image_prev"
        style={{
          display:
            peerId === stopCamera.socketId && !stopCamera.camera
              ? "flex"
              : "none",
        }}
      >
        <div className="userprofile">
          <Avatar userId={peerUserId} roomId={null} />
        </div>
      </div>
      <div className="user-name">
        <p>{userName}</p>
        <FontAwesomeIcon
          icon={faMicrophoneAltSlash}
          size="lg"
          style={{
            display:
              peerId === stopMicrophone.socketId && stopMicrophone.microphone
                ? "none"
                : "block",
          }}
        />
      </div>
    </div>
  );
}
