const document = require("./api/routes/file");
const folder = require("./api/routes/folder");
const authCA = require("./api/routes/auth");
const room = require("./api/routes/room");
const user = require("./api/routes/user");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
//
// const https = require("https");
// const fs = require("fs");
// const path = require("path");
//
const app = express();

//

// const options = {
//   key: fs.readFileSync(path.join(__dirname, "./certs/private.key")),
//   cert: fs.readFileSync(path.join(__dirname, "./certs/certificate.crt")),
// };
//

const {
  addUserInRoom,
  deleteUser,
  getUser,
  getUsersInRoom,
  getUserColor,
} = require("./api/controllers/Socket");

const { InsertNewMessage } = require("./api/controllers/Message");

//
const COOKIE_SECRET =
  "wPbZcy0jtgyYxQWb0Fn7Fi4lL7GwvqlyRCpDbF2Jp69BVVxgKT8mU3hD/IKC0W1p+zO7CNxjQm7tbeEg0rRJTn5wm757h5iwEIvRHFzp0/nBYmEeqO/i0xKcRZsB92PaqW2nZB6C+nV+SH58qxQkzJQEa8wI+opDm2N9h6xd9uAH2Qeiq94SmBUJo7K13licDaUGCFiuT+o0plqLzpnV9YbhDhPpSxSusn5W25xAjfnJsTHi/LD908A9Gm8ldMe85ny71tw+oBaEjnJgFvdtX0VzoP4LWejFqS1TiL0M/yaeGea5doL9ZWTyiR6RMakMRSBX2sjqdiXf02g==";
//
const CLIENT_URL = "http://localhost:3000";
const SERVER_PORT = 5000;

//
// To Verify cors-origin !!!
// enable CORS
app.use(
  cors({
    origin: CLIENT_URL, // url of the frontend application
    credentials: true, // set credentials true for secure httpOnly cookie
  })
);

const { Server } = require("socket.io");

//
// parse application/json
app.use(bodyParser.json({ limit: "50mb" }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// use cookie parser for secure httpOnly cookie
app.use(cookieParser(COOKIE_SECRET));

app.use("/users", user);

app.use("/room", room);

app.use("/document", document);

app.use("/folder", folder);

// pentru certificate
app.use("/auth", authCA);

//
// listens on https
// const HTTPS_SERVER = https.createServer(options, app);

// HTTPS_SERVER.listen(SERVER_PORT, () => {
//   console.log(`HTTPS Server started on port ${SERVER_PORT}`);
// });

const httpServer = app.listen(SERVER_PORT, () => {
  console.log(`Server started on port ${SERVER_PORT}`);
});

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
  },
});

//

io.on("connection", (socket) => {
  socket.on("join room", async (request, callback) => {
    const userId = request.userId;
    const roomId = request.roomId;
    const type = request.type;

    const { error, user } = await addUserInRoom({
      id: socket.id,
      userId,
      roomId,
      type,
    });
    //
    if (error) {
      console.log("refuse user to join in room..");
      return callback(error);
    }
    //
    socket.join(user.roomId);

    if (type === "video") {
      socket.emit("all users", {
        roomId: user.roomId,
        users: getUsersInRoom(user.roomId, user.id, user.type),
      });
    }

    if (type === "edit") {
      socket.emit("all users edit", {
        roomId: user.roomId,
        users: getUsersInRoom(user.roomId, user.id, user.type),
        color: getUserColor(user.roomId, user.userId, user.type),
      });
      //
      socket.broadcast.to(user.roomId).emit("user joined edit", user);
    }
    callback();
  });

  // Listen for new messages
  socket.on("send chat message", (message) => {
    //
    const user = getUser(socket.id);
    if (user === undefined) return;
    //
    io.to(message.roomId).emit("receive chat message", message);
    // save message
    const mes_res = InsertNewMessage(message);

    if (mes_res === null) {
      console.log("Error save message !");

      socket.emit("error insert message", { message });
    } else {
      console.log(
        "MESSAGE: " +
          message.body +
          " by " +
          message.senderName +
          " on " +
          message.roomId
      );
    }

    //
  });

  //listening for typing
  socket.on("typing chat message", (request) => {
    const user = getUser(socket.id);
    if (user === undefined) return;
    //
    io.to(request.roomId).emit("user typing", request);
    //
  });

  // Document Actions

  // Listen for new document changes
  socket.on("send doc edit", (delta) => {
    const user = getUser(socket.id);
    if (user === undefined) return;
    //
    socket.broadcast.to(user.roomId).emit("receive doc edit", delta);
  });

  //

  // Listen for new document changes
  socket.on("send doc pointer", (delta) => {
    const user = getUser(socket.id);
    if (user === undefined) return;
    //
    socket.broadcast.to(user.roomId).emit("receive doc pointer", delta);
  });

  //

  // Listen for new document changes
  socket.on("send doc presence", (delta) => {
    const user = getUser(socket.id);
    if (user === undefined) return;
    //
    socket.broadcast.to(user.roomId).emit("receive doc presence", delta);
  });
  //

  //

  //
  //
  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerId: payload.callerId,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerId).emit("receiving returned signal", {
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
