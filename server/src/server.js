const room = require("./api/routes/room");
const user = require("./api/routes/user");
const document = require("./api/routes/file");
const folder = require("./api/routes/folder");
const authCA = require("./api/routes/auth");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const https = require("https");
const fs = require("fs");
const path = require("path");
const app = express();

//
// const opts = {
//   key: fs.readFileSync(path.join(__dirname, "server_key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "server_cert.pem")),
//   requestCert: true,
//   rejectUnauthorized: false, // so we can do own error handling
//   ca: [fs.readFileSync(path.join(__dirname, "server_cert.pem"))],
// };
//

const {
  addUserInRoom,
  deleteUser,
  getUser,
  getUsersInRoom,
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

// app.use(
//   cors({
//     origin: "*", // url of the frontend application
//     // credentials: true, // set credentials true for secure httpOnly cookie
//   })
// );

const { Server } = require("socket.io");
const { use } = require("./api/routes/room");

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

// pentru certificate
app.use("/auth", authCA);

//
// listens on https
// const HTTPS_SERVER = https.createServer(opts, app);

// HTTPS_SERVER.listen(process.env.SERVER_PORT, () => {
//   console.log(`HTTPS Server started on port ${process.env.SERVER_PORT}`);
// });
//

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
      console.log("failed:");
      return callback(error);
    }
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

  //

  // edit text
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
