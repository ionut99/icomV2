import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import socketIOClient from "socket.io-client";
// var CryptoJs = require("crypto-js");
import { InsertNewMessage } from "../asyncActions/userAsyncActions";
import { InsertNewMessageLocal, UpdateDeltaFile } from "../actions/userActions";

import { v4 as uuidv4 } from "uuid";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const NEW_EVENT_DOCUMENT = "newEventDocument";

const SOCKET_SERVER_URL = "http://localhost:4000";

const Comunication = (roomID, userID) => {
  const dispatch = useDispatch();
  var uuidMessage = uuidv4(); // pentru coduri unice
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomID },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      //var secret = CryptoJs.SHA256(roomId);
      //var bytes = CryptoJs.AES.decrypt(message, secret.toString().substring(0,18));
      //var decryptedData = JSON.parse(bytes.toString(CryptoJs.enc.Utf8));

      if (message.roomID != null) {
        dispatch(
          InsertNewMessageLocal(
            message.ID_message,
            message.roomID,
            message.senderID,
            message.body
          )
        );
      }
    });

    socketRef.current.on(NEW_EVENT_DOCUMENT, (newDocChange) => {
      if (newDocChange.roomID != null) {
        console.log("ce am primit");
        console.log(newDocChange);
        if (newDocChange.roomID != null) {
          dispatch(UpdateDeltaFile(newDocChange.body, newDocChange.senderID));
        }
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomID]);

  const sendMessage = (messageBody) => {
    var dataToSend = {
      //senderSocketId: socketRef.current.id,
      body: messageBody,
      senderID: userID,
      roomID: roomID,
      ID_message: uuidMessage,
    };

    dispatch(InsertNewMessage(uuidMessage, userID, roomID, messageBody));
    //var secret = CryptoJs.SHA256(roomId);
    //var cipherText = CryptoJs.AES.encrypt(JSON.stringify(dataToSend),secret.toString().substring(0,18)).toString();
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, dataToSend);
  };

  const sendDocumentChanges = (changeDocument) => {
    //console.log(changeDocument);
    var dataToSend = {
      body: changeDocument,
      senderID: userID,
      roomID: roomID,
      change_ID: uuidv4(),
    };
    socketRef.current.emit(NEW_EVENT_DOCUMENT, dataToSend);
  };
  return { sendMessage, sendDocumentChanges };
};

export default Comunication;