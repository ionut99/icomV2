import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import styled from "styled-components";
import Peer from "simple-peer";

//

import {
  faMicrophone,
  faMicrophoneAltSlash,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";

import { Button } from "react-bootstrap";
import socketIOClient from "socket.io-client";
import Video from "./Video";
import "./videoroom.css";
//
import { iceConfig } from "./Config";

import Avatar from "../../components/Avatar/Avatar";
import Timer from "./Timer";

const { REACT_APP_API_URL } = process.env;

const StyledVideo = styled.video`
  height: 300px;
  transform: rotateY(180deg);
`;

//
// const videoConstraints = {
//   height: window.innerHeight / 2,
//   width: window.innerWidth / 2,
// };

const VideoRoom = (props) => {
  //
  const socketRef = useRef();
  //
  const userVideo = useRef();
  //
  const peersRef = useRef(Array(0));
  const roomId = props.match.params.roomId;
  //
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  //
  const [stopCamera, setStopCamera] = useState({
    userId: undefined,
    socketId: undefined,
    camera: false,
  });
  //
  const [stopMicrophone, setStopMicrophone] = useState({
    userId: undefined,
    socketId: undefined,
    microphone: false,
  });
  //
  const [microphone, setmicrophone] = useState(true);
  //
  const [videoInput, setVideoInput] = useState(true);
  //
  const [peers, setPeers] = useState([]);

  //
  const request = {
    userId: user.userId,
    roomId: roomId,
    type: "video",
  };

  //

  const handleStopVideoStream = () => {
    if (userVideo.current.srcObject !== null) {
      userVideo.current.srcObject.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "video") {
          if (track.enabled === true) {
            track.enabled = false;
            socketRef.current.emit("user stop camera", request);
          } else {
            track.enabled = true;
            socketRef.current.emit("user start camera", request);
          }
          setVideoInput(!videoInput);
        }
      });
    }
  };
  //
  const handleLeaveConference = () => {
    console.log("leave video room ...");
    if (userVideo.current.srcObject !== null) {
      userVideo.current.srcObject.getTracks().map(function (val) {
        val.stop();
      });
    }
  };

  const handleMuteUser = () => {
    //
    if (microphone) {
      setmicrophone(false);
      userVideo.current.srcObject.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "audio") {
          track.enabled = false;
          socketRef.current.emit("user stop microphone", request);
        }
      });
    } else {
      setmicrophone(true);
      userVideo.current.srcObject.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "audio") {
          track.enabled = true;
          socketRef.current.emit("user start microphone", request);
        }
      });
    }
  };

  //
  useEffect(() => {
    if (roomId === null || roomId === undefined) return;
    socketRef.current = socketIOClient(REACT_APP_API_URL);

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  //

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: videoInput, audio: microphone })
      .then((stream) => {
        if (stream != null) {
          userVideo.current.srcObject = stream;
        }
        socketRef.current.emit("join room", request, (error) => {
          if (error) {
            alert(error);
          }
        });
        socketRef.current.on("all users", (roomData) => {
          roomData.users.forEach((userElement) => {
            const peer = createPeer(
              user.userId,
              userElement.id,
              socketRef.current.id,
              userVideo.current.srcObject
            );
            const peerObj = {
              userId: userElement.userId,
              peerId: userElement.id,
              peer,
            };
            peersRef.current.push(peerObj);
            setPeers((users) => [...users, peerObj]);
          });
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(
            payload.signal,
            payload.callerId,
            userVideo.current.srcObject
          );
          const peerObj = {
            userId: payload.callerUserId,
            peerId: payload.callerId,
            peer,
          };
          peersRef.current.push(peerObj);
          setPeers((users) => [...users, peerObj]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerId === payload.id);
          item.peer.signal(payload.signal);
        });

        socketRef.current.on("user left", (socket_id) => {
          console.log("removing peer " + socket_id);
          removePeer(socket_id);
        });

        socketRef.current.on("user stop camera", (payload) => {
          setStopCamera({
            userId: payload.userId,
            socketId: payload.socketId,
            camera: false,
          });
        });

        socketRef.current.on("user start camera", (payload) => {
          setStopCamera({
            userId: payload.userId,
            socketId: payload.socketId,
            camera: true,
          });
        });

        //
        socketRef.current.on("user stop microphone", (payload) => {
          setStopMicrophone({
            userId: payload.userId,
            socketId: payload.socketId,
            microphone: false,
          });
        });

        socketRef.current.on("user start microphone", (payload) => {
          setStopMicrophone({
            userId: payload.userId,
            socketId: payload.socketId,
            microphone: true,
          });
        });
        //

        socketRef.current.on("disconnect", () => {
          console.log("GOT DISCONNECTED");
          destroyAllPeers();
        });
      });

    return () => {
      // socketRef.current.off("all users");
    };
  }, [roomId]);

  //

  function createPeer(userId, userToSignal, callerId, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      config: iceConfig,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userId,
        userToSignal,
        callerId,
        signal,
      });
    });

    return peer;
  }

  //

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
      config: iceConfig,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerId });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  //

  function removePeer(socket_id) {
    const item = peersRef.current.find((p) => p.peerId === socket_id);
    if (item) {
      item.peer.destroy();
    }

    peersRef.current = peersRef.current.filter((p) => p.peerId !== socket_id);
    setPeers((peers) => peers.filter((peer) => peer.peerId !== socket_id));
  }

  //

  function destroyAllPeers() {
    for (let i = 0; i < peersRef.current.length; i++) {
      peersRef.current[i].peer.destroy();
    }
    peersRef.current = [];
    setPeers([]);
  }
  //
  return (
    <div className="video-page">
      <div className="buttons-bar">
        <Timer />
        <div className="buttons">
          <Button
            className="video-button"
            onClick={() => {
              handleStopVideoStream();
            }}
          >
            <FontAwesomeIcon
              icon={faVideo}
              size="lg"
              style={{
                display: !videoInput ? "none" : "block",
              }}
            />
            <FontAwesomeIcon
              icon={faVideoSlash}
              size="lg"
              style={{
                display: videoInput ? "none" : "block",
              }}
            />
          </Button>
          <Button
            className="microphone-button"
            onClick={() => {
              handleMuteUser();
            }}
          >
            <FontAwesomeIcon
              icon={faMicrophone}
              size="lg"
              style={{
                display: !microphone ? "none" : "block",
              }}
            />
            <FontAwesomeIcon
              icon={faMicrophoneAltSlash}
              size="lg"
              style={{
                display: microphone ? "none" : "block",
              }}
            />
          </Button>
          <Link to={`/chat`}>
            <Button
              className="leave-button"
              variant="danger"
              onClick={() => {
                handleLeaveConference();
              }}
            >
              Leave
            </Button>
          </Link>
        </div>
      </div>
      <div className="video-content">
        <div className="video-wrapper">
          <div className="current-user-video">
            <StyledVideo
              muted
              ref={userVideo}
              autoPlay
              playsInline
              style={{
                display: videoInput ? "block" : "none",
              }}
            />
            <div
              className="image_prev"
              style={{
                display: !videoInput ? "flex" : "none",
              }}
            >
              <div className="userprofile">
                <Avatar userId={user.userId} roomId={null} />
              </div>
            </div>
          </div>
          {peers.map((peer) => {
            return (
              <div className="user-video" key={peer.peerId}>
                <Video
                  width="400"
                  height="300"
                  key={peer.peerId}
                  peer={peer.peer}
                  peerId={peer.peerId}
                  peerUserId={peer.userId}
                  stopCamera={stopCamera}
                  stopMicrophone={stopMicrophone}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoRoom;
