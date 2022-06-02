import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Peer from "simple-peer";
import styled from "styled-components";
import socketIOClient from "socket.io-client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faMicrophone,
  faMicrophoneAltSlash,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";

import { Button } from "react-bootstrap";
import "./videoroom.css";

const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 90%;
  margin: auto;
  flex-wrap: wrap;
`;

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

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

// const videoConstraints = {
//   height: window.innerHeight / 2,
//   width: window.innerWidth / 2,
// };

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const { REACT_APP_API_URL } = process.env;

const VideoRoom = (props) => {
  const [microphone, setmicrophone] = useState(true);
  //
  const [videoInput, setVideoInput] = useState(true);
  //
  const [peers, setPeers] = useState([]);
  const [usersInRoom, setusersInRoom] = useState([]);

  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomId;

  const authObj = useSelector((state) => state.auth);
  const { user, expiredAt, token } = authObj;

  // initializare socket
  useEffect(() => {
    if (roomID === null || roomID === undefined) return;
    socketRef.current = socketIOClient(REACT_APP_API_URL, {
      query: { roomID },
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomID]);
  // initializare socket

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        const dataSend = {
          userID: user.userId,
          roomID: roomID,
        };
        socketRef.current.emit("join video room", dataSend, (error) => {
          if (error) {
            alert(error);
          }
        });
        socketRef.current.on("all users", (roomData) => {
          console.log("Primim detaliile despre camera:");
          console.log(roomData.users);
          roomData.users.forEach((user) => {
            // console.log(user.id);
            const peer = createPeer(user.id, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: user.id,
              peer,
            });
            const peerObj = {
              peerID: user.id,
              peer,
            };
            setPeers((users) => [...users, peerObj]);
          });
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          const peerObj = {
            peerID: payload.callerID,
            peer,
          };

          setPeers((users) => [...users, peerObj]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
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
  }, [roomID]);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      config: configuration,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
      config: configuration,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  function removePeer(socket_id) {
    const peerObj = peersRef.current.find((p) => p.peerID === socket_id);
    if (peerObj) {
      peerObj.peer.destroy();
    }

    peersRef.current = peersRef.current.filter((p) => p.peerID !== socket_id);
    setPeers((peers) => peers.filter((peer) => peer.peerID !== socket_id));
  }

  function destroyAllPeers() {
    for (let i = 0; i < peersRef.current.length; i++) {
      peersRef.current[i].peer.destroy();
    }
    peersRef.current = [];
    setPeers([]);
  }

  const handleLeaveConference = () => {
    console.log("Utilizatorul vrea sa iasa din conferinta!");
  };

  const handleMuteUser = () => {
    console.log("set user on mute");
    setmicrophone(!microphone);
  };

  const handleStopVideoStream = () => {
    console.log("set user camera on/off");
    setVideoInput(!videoInput);
  };

  return (
    // <Container>
    //   <StyledVideo muted ref={userVideo} autoPlay playsInline />
    //   {peers.map((peer, index) => {
    //     return <Video key={index} peer={peer} />;
    //   })}
    // </Container>
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
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
          </div>
          {peers.map((peer) => {
            return (
              <div className="user-video" key={peer.peerID}>
                <Video
                  width="400"
                  height="300"
                  key={peer.peerID}
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
