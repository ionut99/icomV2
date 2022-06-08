import React from "react";
import socketIOClient from "socket.io-client";
const { REACT_APP_API_URL } = process.env;
//
export const socket = socketIOClient(REACT_APP_API_URL);
//
export const SocketContext = React.createContext();
