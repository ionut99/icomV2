import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import styled from "styled-components";
import Peer from "simple-peer";

//

import {
  faClock,
  faMicrophone,
  faMicrophoneAltSlash,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";

import { Button } from "react-bootstrap";
import socketIOClient from "socket.io-client";
import Video from "./Video";
import "./videoroom.css";

import Avatar from "../../components/Avatar/Avatar";

const { REACT_APP_API_URL } = process.env;

const StyledVideo = styled.video`
  height: 300px;
`;

const configuration = {
  // Using From https://www.metered.ca/tools/openrelay/
  iceServers: [
    {
      urls: "stun:openrelay.metered.ca:80",
    },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
};

//
const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

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
          } else {
            track.enabled = true;
          }
          setVideoInput(!videoInput);
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
      .getUserMedia({ video: videoInput, audio: false })
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
          roomData.users.forEach((user) => {
            const peer = createPeer(
              user.id,
              socketRef.current.id,
              userVideo.current.srcObject
            );
            const peerObj = {
              peerId: user.id,
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

  function createPeer(userToSignal, callerId, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      config: configuration,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
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
      config: configuration,
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

  function destroyAllPeers() {
    for (let i = 0; i < peersRef.current.length; i++) {
      peersRef.current[i].peer.destroy();
    }
    peersRef.current = [];
    setPeers([]);
  }

  const handleLeaveConference = () => {
    console.log("leave video room ...");
    if (userVideo.current.srcObject !== null) {
      userVideo.current.srcObject.getTracks().map(function (val) {
        val.stop();
      });
    }
  };

  const handleMuteUser = () => {
    console.log("set user on mute");
    userVideo.current.srcObject.getTracks().forEach(function (track) {
      console.log(track);
      if (track.readyState === "live") {
        if (track.enabled === true) {
          // track.enabled = false;
        } else {
          // track.enabled = true;
        }
        // setVideoInput(!videoInput);
        setmicrophone(!microphone);
      }
    });
  };

  return (
    <div className="video-page">
      <div className="buttons-bar">
        <div className="time">
          <div className="icon">
            <FontAwesomeIcon icon={faClock} size="lg" />
          </div>
          20:12
        </div>
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
          <div className="user-video">
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
              <Avatar userId={user.userId} roomId={null} />
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
