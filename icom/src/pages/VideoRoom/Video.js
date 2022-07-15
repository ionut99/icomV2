import React, { useEffect, useRef } from "react";

import styled from "styled-components";
import Avatar from "../../components/Avatar/Avatar";

const StyledVideo = styled.video`
  height: 300px;
`;

export default function Video(props) {
  const ref = useRef();

  const { peerId, userToStop } = props;

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <div>
      <StyledVideo
        playsInline
        autoPlay
        ref={ref}
        style={{
          display:
            peerId !== userToStop.socketId || userToStop.camera
              ? "block"
              : "none",
        }}
      />
      <div
        className="image_prev"
        style={{
          display:
            peerId === userToStop.socketId && !userToStop.camera
              ? "flex"
              : "none",
        }}
      >
        <div className="userprofile">
          <Avatar userId={userToStop.userId} roomId={null} />
        </div>
      </div>
      <div className="user-name">
        <p>{userToStop.userId}</p>
      </div>
    </div>
  );
}
