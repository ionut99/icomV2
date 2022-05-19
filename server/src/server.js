const room = require("./api/routes/room");
const user = require("./api/routes/user");
const document = require("./api/routes/file");
const folder = require("./api/routes/folder");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// To Verify cors-origin !!!
// enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL, // url of the frontend application
    credentials: true, // set credentials true for secure httpOnly cookie
  })
);

// To Verify cors-origin !!!
// const server_chat = require("http").Server(app);
const { Server } = require("socket.io");

// const io = require("socket.io")(server_chat, {
//   cors: {
//     origin: process.env.CLIENT_URL,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

//
//
// app.use("/peerjs", peerServer);
//
// parse application/json
app.use(bodyParser.json({ limit: "50mb" }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// use cookie parser for secure httpOnly cookie
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/users", user);

app.use("/room", room);

app.use("/document", document);

app.use("/folder", folder);

const httpServer = app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server started on port ${process.env.SERVER_PORT}`);
});

// Start server for chat
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SEND_DOCUMENT_CHANGES = "SEND_DOCUMENT_CHANGES";
const RECEIVE_DOCUMENT_CHANGES = "RECEIVE_DOCUMENT_CHANGES";

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // Join a conversation
  const { channelID } = socket.handshake.query;
  const { fileId } = socket.handshake.query;
  //console.log("incercare roomID: " + roomID);
  //console.log("New connection established for chat part: ", roomID);
  socket.join(channelID);
  socket.join(fileId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(channelID).emit(NEW_CHAT_MESSAGE_EVENT, data);
    console.log("New message was sent:  ");
    console.log(data);
    console.log("On channel: " + channelID);
  });

  // Listen for new document changes
  socket.on(SEND_DOCUMENT_CHANGES, (delta) => {
    io.in(fileId).emit(RECEIVE_DOCUMENT_CHANGES, delta);
    console.log(delta);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(channelID);
  });
});

// server_chat.listen(process.env.SERVER_PORT, () => {
//   console.log(`Server started on port ${process.env.SERVER_PORT}`);
// });
