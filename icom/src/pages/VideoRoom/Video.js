import React, { useEffect, useRef } from "react";

import styled from "styled-components";

const StyledVideo = styled.video`
  height: 300px;
`;

export default function Video(props) {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
}
