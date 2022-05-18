import React from "react";
import { useParams } from "react-router-dom";

function VideoRoom() {
  const { roomId } = useParams();
  //
  console.log("Bun venit in camera:");
  console.log(roomId);
  //
  return <div>VideoRoom</div>;
}

export default VideoRoom;
