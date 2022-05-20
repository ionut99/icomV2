import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Peer from "simple-peer";
import styled from "styled-components";
import socketIOClient from "socket.io-client";

const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 90%;
  margin: auto;
  flex-wrap: wrap;
`;

const StyledVideo = styled.video`
  height: 40%;
  width: 50%;
`;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const { REACT_APP_API_URL } = process.env;

const VideoRoom = (props) => {
  const [peers, setPeers] = useState([]);
  const [usersInRoom, setusersInRoom] = useState([]);

  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const channelID = props.match.params.roomId;

  const authObj = useSelector((state) => state.auth);
  const { user, expiredAt, token } = authObj;

  // initializare socket
  useEffect(() => {
    if (channelID === null || channelID === undefined) return;
    socketRef.current = socketIOClient(REACT_APP_API_URL, {
      query: { channelID },
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [channelID]);
  // initializare socket

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;

        // buna, eu sunt nou in grup si vreau sa intru in conferinta
        const newUserDetails = {
          roomID: channelID,
          callerPersonalID: user.userId,
          callerSockerID: socketRef.current.id,
        };

        // asa ca voi da join room si voi trimite datele mele personale
        socketRef.current.emit("join room", newUserDetails);
        // dupa care ma astept sa primesc raspuns de la ceilalti

        socketRef.current.on("all users", (existUserList) => {
          const peers = [];
          existUserList.forEach((existUser) => {
            const peer = createPeer(
              existUser.callerSockerID,
              socketRef.current.id,
              stream
            );
            peersRef.current.push({
              peerID: existUser.callerSockerID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });
  }, [channelID]);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
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
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <Container>
      <StyledVideo muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}
    </Container>
  );
};

export default VideoRoom;
