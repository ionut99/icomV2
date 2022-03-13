const AuthRouter = require("./api/routes/Auth");
const UserRouter = require("./api/routes/User");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
var http = require("http");
require("dotenv").config();

const app = express();

const SERVER_PORT = process.env.PORT || 5000;
const SOCKET_PORT = 4000;

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
    origin: "http://localhost:3000", // url of the frontend application
    credentials: true, // set credentials true for secure httpOnly cookie
  })
);

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// use cookie parser for secure httpOnly cookie
app.use(cookieParser(process.env.COOKIE_SECRET));

// validate user credentials
app.post("/users/signin", AuthRouter);

// handle user logout
app.post("/users/logout", AuthRouter);

// verify the token and return new tokens if it's valid
app.post("/verifyToken", AuthRouter);

// search - section input
app.post("/users/search", UserRouter);

// room - search - section input
app.post("/room/search", UserRouter);

app.get("/users/getList", UserRouter);

// Start server for chat
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

io.on("connection", (socket) => {
  // Join a conversation
  const { roomID } = socket.handshake.query;
  //console.log("incercare roomID: " + roomID);
  //console.log("New connection established for chat part: ", roomID);
  socket.join(roomID);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomID).emit(NEW_CHAT_MESSAGE_EVENT, data);
    console.log("New message was sent:  ");
    console.log(data);
    console.log("On channel: " + roomID);
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
