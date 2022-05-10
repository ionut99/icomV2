const room = require("./api/routes/room");
const user = require("./api/routes/user");
const document = require("./api/routes/file");
const folder = require("./api/routes/folder");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
var http = require("http");
const { use } = require("express/lib/application");
require("dotenv").config();

const app = express();

const SERVER_PORT = process.env.SERVER_PORT;
const SOCKET_PORT = process.env.SOCKET_PORT;

// To Verify cors-origin !!!
const server_socket_chat = http.createServer(app);
const io = require("socket.io")(server_socket_chat, {
  cors: {
    origin: "*",
  },
});

// To Verify cors-origin !!!
// enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL, // url of the frontend application
    credentials: true, // set credentials true for secure httpOnly cookie
  })
);

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

// Start server for chat
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SEND_DOCUMENT_CHANGES = "SEND_DOCUMENT_CHANGES";
const RECEIVE_DOCUMENT_CHANGES = "RECEIVE_DOCUMENT_CHANGES";

io.on("connection", (socket) => {
  // Join a conversation
  const { roomID } = socket.handshake.query;
  const { fileId } = socket.handshake.query;
  //console.log("incercare roomID: " + roomID);
  //console.log("New connection established for chat part: ", roomID);
  socket.join(roomID);
  socket.join(fileId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomID).emit(NEW_CHAT_MESSAGE_EVENT, data);
    console.log("New message was sent:  ");
    console.log(data);
    console.log("On channel: " + roomID);
  });

  // Listen for new document changes
  socket.on(SEND_DOCUMENT_CHANGES, (delta) => {
    io.in(fileId).emit(RECEIVE_DOCUMENT_CHANGES, delta);
    console.log(delta);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(roomID);
  });
});

app.listen(SERVER_PORT, () => {
  console.log("Server started on: " + SERVER_PORT);
});

server_socket_chat.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO Listening on port ${SOCKET_PORT}`);
});
