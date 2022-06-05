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
  deleteUser,
  getUser,
  getUsersInRoom,
  getAllUsers,
} = require("./api/controllers/Socket");

const { InsertNewMessage } = require("./api/controllers/Message");

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
        roomID: user.roomID,
        users: getUsersInRoom(user.roomID, user.id, user.type), //except the one who enter
      });
    }

    if (type === "edit") {
      io.to(user.roomID).emit("all users", {
        roomID: user.roomID,
        users: getAllUsers(user.roomID, user.type),
      });
    }

    callback();
  });

  // Listen for new messages
  socket.on("send chat message", (request) => {
    io.to(request.roomID).emit("receive chat message", request);

    // save message
    const mes_res = InsertNewMessage(request);

    if (mes_res === null) {
      console.log("Error save message !");

      socket.emit("error insert message", { request });
    } else {
      console.log(
        "MESSAGE: " +
          request.messageBody +
          " by " +
          request.senderName +
          " on " +
          request.roomID
      );
    }

    //
  });

  //listening for typing
  socket.on("typing chat message", (request) => {
    // verificare
    io.to(request.roomID).emit("user typing", request);
    //
  });

  // Listen for new document changes
  socket.on("send doc edit", (delta) => {
    const user = getUser(socket.id);
    socket.broadcast.to(user.roomID).emit("receive doc edit", delta);
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

  //
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    const deleted = deleteUser(socket.id);
    if (deleted) {
      if (user.type === "video" || user.type === "edit")
        socket.broadcast.emit("user left", socket.id);
    }
  });
});
