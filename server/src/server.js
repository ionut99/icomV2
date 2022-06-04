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

const {
  addUserInRoom,
  removeUserFromList,
  deleteUser,
  getUser,
  getUsersInRoom,
} = require("./api/controllers/Socket");

const { InsertNewMessage } = require("./api/controllers/Message");

const { GetRoomDetailsData } = require("./api/services/Room");

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
const { use } = require("./api/routes/room");

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
const SEND_DOCUMENT_CHANGES = "SEND_DOCUMENT_CHANGES";
const RECEIVE_DOCUMENT_CHANGES = "RECEIVE_DOCUMENT_CHANGES";

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

//

io.on("connection", (socket) => {
  const { fileID } = socket.handshake.query;

  socket.on("join room", async (request, callback) => {
    const userID = request.userID;
    const roomID = request.roomID;
    const type = request.type;

    const { error, user } = await addUserInRoom({
      id: socket.id,
      userID,
      roomID,
      type,
    });
    if (error) return callback(error);

    socket.join(user.roomID);

    if (type === "video") {
      socket.emit("all users", {
        //varianta cu emit trimite doar la respectivul
        roomID: user.roomID,
        users: getUsersInRoom(user.roomID, user.id, user.type),
      });
    }
    callback();
  });

  // Listen for new messages
  socket.on("send chat message", (message) => {
    io.to(message.roomID).emit("receive chat message", message);

    // save message
    const mes_res = InsertNewMessage(message);

    if (mes_res === null) {
      console.log("Error save message !");

      socket.emit("error insert message", { message });
    } else {
      console.log(
        "MESSAGE: " +
          message.messageBody +
          " by " +
          message.senderName +
          " on " +
          message.roomID
      );
    }

    //
  });

  //

  // Listen for new document changes
  socket.on(SEND_DOCUMENT_CHANGES, (delta) => {
    socket.broadcast.to(fileID).emit(RECEIVE_DOCUMENT_CHANGES, delta);
    console.log(delta);
  });

  //

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
    const user = getUser(socket.id);
    const deleted = deleteUser(socket.id);
    if (deleted) {
      if (user.type === "video") socket.broadcast.emit("user left", socket.id);
    }
  });
});
