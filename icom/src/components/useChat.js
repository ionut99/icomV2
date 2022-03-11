import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
// var CryptoJs = require("crypto-js");

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = "http://localhost:4000";

// const newMsg = {
//   userID: null,
//   RoomID: null,
//   Message_body: "",
// };

const useChat = (roomID, userID, AuthorName) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomID },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      //var secret = CryptoJs.SHA256(roomId);
      //var bytes = CryptoJs.AES.decrypt(message, secret.toString().substring(0,18));
      //var decryptedData = JSON.parse(bytes.toString(CryptoJs.enc.Utf8));

      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomID]);

  const sendMessage = (messageBody) => {
    var dataToSend = {
      body: messageBody,
      senderId: socketRef.current.id,
      userID: userID,
      roomId: roomID,
      AuthorName: AuthorName
    };
    //var secret = CryptoJs.SHA256(roomId);
    //var cipherText = CryptoJs.AES.encrypt(JSON.stringify(dataToSend),secret.toString().substring(0,18)).toString();
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, dataToSend);
  };

  return { messages, sendMessage };
};

export default useChat;
