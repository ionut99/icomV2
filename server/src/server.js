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

const JOIN_VIDEO_CALL = "JOIN_VIDEO_CALL";
const VIDEO_CALL_FULL = "VIDEO_CALL_FULL";
const VIDEO_CALL_USERS_LIST = "VIDEO_CALL_USERS_LIST";

const SENDING_SIGNAL = "SENDING_SIGNAL";
const USER_JOINED = "USER_JOINED";

const RETURNING_SIGNAL = "RETURNING_SIGNAL";
const RECEIVING_RETURNING_SIGNAL = "RECEIVING_RETURNING_SIGNAL";

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const users_in_call = {};
const socketToRoom = {};

io.on("connection", (socket) => {
  // Join a conversation
  const { channelID } = socket.handshake.query;
  const { fileID } = socket.handshake.query;
  const { videoChannelID } = socket.handshake.query;

  socket.join(channelID);
  socket.join(fileID);
  socket.join(videoChannelID);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(channelID).emit(NEW_CHAT_MESSAGE_EVENT, data);
    console.log("New message was sent:  ");
    console.log(data);
    console.log("On channel: " + channelID);
  });

  // Listen for new document changes
  socket.on(SEND_DOCUMENT_CHANGES, (delta) => {
    io.in(fileID).emit(RECEIVE_DOCUMENT_CHANGES, delta);
    console.log(delta);
  });

  // listen for new video room
  socket.on("join room", (roomID) => {
    if (users_in_call[roomID]) {
      const length = users_in_call[roomID].length;
      if (length === 4) {
        socket.emit("room full");
        return;
      }
      users_in_call[roomID].push(socket.id);
    } else {
      users_in_call[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users_in_call[roomID].filter(
      (id) => id !== socket.id
    );

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users_in_call[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users_in_call[roomID] = room;
      console.log("socket disconnected " + socket.id);
      socket.broadcast.emit("user left", socket.id);
    }
  });
});
