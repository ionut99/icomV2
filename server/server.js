require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var http = require('http');

const {
  refreshTokens, COOKIE_OPTIONS, generateToken, generateRefreshToken,
  getCleanUser, verifyToken, clearTokens, handleResponse,
} = require('./utils');

const { GetAllUsers, GetUserFromDataBase, GetUserByID, } = require('./database.js');


userData ={
  userId: "",
  password: "",
  surname: "",
  name: "",
  email: "",
  isAdmin: false
}

const app = express();
const SERVER_PORT = process.env.PORT || 5000;
const SOCKET_PORT = 4000;

// To Verify cors-origin !!!
const server_socket_chat = http.createServer(app);
const io = require("socket.io")(server_socket_chat, {
  cors: {
    origin: '*',
  },
});

// To Verify cors-origin !!!
// enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // url of the frontend application
  credentials: true // set credentials true for secure httpOnly cookie
}));


// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// use cookie parser for secure httpOnly cookie
app.use(cookieParser(process.env.COOKIE_SECRET));

// middleware that checks if JWT token exists and verifies it if it does exist.
// In all private routes, this helps to know if the request is authenticated or not.
const authMiddleware = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['authorization'];
  if (!token) return handleResponse(req, res, 401);

  token = token.replace('Bearer ', '');

  // get xsrf token from the header
  const xsrfToken = req.headers['x-xsrf-token'];
  if (!xsrfToken) {
    return handleResponse(req, res, 403);
  }

  // verify xsrf token
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  if (!refreshToken || !(refreshToken in refreshTokens) || refreshTokens[refreshToken] !== xsrfToken) {
    return handleResponse(req, res, 401);
  }

  // verify token with secret key and xsrf token
  verifyToken(token, xsrfToken, (err, payload) => {
    if (err)
      return handleResponse(req, res, 401);
    else {
      req.user = payload; //set the user to req so other routes can use it
      next();
    }
  });
}

// validate user credentials
app.post('/users/signin',async function (req, res) {
  const user = req.body.email;
  const pwd = req.body.password;

  // return 400 status if email/password is not exist
  if (!user || !pwd) {
    return handleResponse(req, res, 400, null, "Email and Password required.");
  }

  try{
    const userData_copy = await GetUserFromDataBase(user, pwd);

    if (!userData_copy[0]) {
      return handleResponse(req, res, 401, null, "Email or Password is Wrong.");
    }

    userData.userId = userData_copy[0].userId;
    userData.surname = userData_copy[0].Surname;
    userData.name = userData_copy[0].Name;
    userData.email = userData_copy[0].Email;
    userData.password = userData_copy[0].Password;
    userData.isAdmin = userData_copy[0].IsAdmin;

    console.log(userData);

    // return 401 status if the credential is not matched
    if (!userData) {
      return handleResponse(req, res, 401, null, "email or Password is Wrong.");
    }

    // get basic user details
    const userObj = getCleanUser(userData);

    // generate access token
    const tokenObj = generateToken(userData);

    // generate refresh token
    const refreshToken = generateRefreshToken(userObj.userId);

    // refresh token list to manage the xsrf token
    refreshTokens[refreshToken] = tokenObj.xsrfToken;

    // set cookies
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.cookie('XSRF-TOKEN', tokenObj.xsrfToken);

    return handleResponse(req, res, 200, {
      user: userObj,
      token: tokenObj.token,
      expiredAt: tokenObj.expiredAt
    });
  } catch(e) {
    console.log(e);
  }
});


// handle user logout
app.post('/users/logout', (req, res) => {
  clearTokens(req, res);
  return handleResponse(req, res, 204);
});


// verify the token and return new tokens if it's valid
app.post('/verifyToken',function (req, res) {

  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  if (!refreshToken) {
    return handleResponse(req, res, 204);
  }

  // verify xsrf token
  const xsrfToken = req.headers['x-xsrf-token'];
  if (!xsrfToken || !(refreshToken in refreshTokens) || refreshTokens[refreshToken] !== xsrfToken) {
    console.log("nu corespunde !!!!!");
    return handleResponse(req, res, 401);
  }

  // verify refresh token
  verifyToken(refreshToken, '',async (err, payload) => {
    if (err) {
      return handleResponse(req, res, 401);
    }
    else {
      const userData_copy = await GetUserByID(payload.userId);

      if (!userData_copy[0]) {
        return handleResponse(req, res, 401, null, "Email or Password is Wrong.");
      }

      userData.userId = userData_copy[0].userId;
      userData.surname = userData_copy[0].Surname;
      userData.name = userData_copy[0].Name;
      userData.email = userData_copy[0].Email;
      userData.password = userData_copy[0].Password;
      userData.isAdmin = userData_copy[0].IsAdmin;

      console.log(userData);
      if (!userData) {
        return handleResponse(req, res, 401);
      }

      // get basic user details
      const userObj = getCleanUser(userData);

      // generate access token
      const tokenObj = generateToken(userData);

      // refresh token list to manage the xsrf token
      refreshTokens[refreshToken] = tokenObj.xsrfToken;
      res.cookie('XSRF-TOKEN', tokenObj.xsrfToken);

      // return the token along with user details
      return handleResponse(req, res, 200, {
        user: userObj,
        token: tokenObj.token,
        expiredAt: tokenObj.expiredAt
      });
    }
  });

});


// get list of the users
app.get('/users/getList', authMiddleware,async (req, res) => {
  const userList = await GetAllUsers();
  const list = userList.map(x => {
    const user = { ...x };
    delete user.password;
    return user;
  });
  return handleResponse(req, res, 200, { list });
});


// search - section input 
app.post('/users/search',async function (req, res) {
  const search_box_text = req.body.search_box_text;
  console.log("Textul pentru cautare este:");
  console.log(search_box_text);

});

// Start server for chat
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

io.on("connection", (socket) => {

  console.log("Salut - aici avem partea de socket pentru chat");
  // Join a conversation
  const { roomId } = socket.handshake.query;
  console.log("New connection established: ", roomId);
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    console.log("New message was sent:  ")
    console.log(data);
    console.log("On channel: " + roomId);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(roomId);
  });
});

app.listen(SERVER_PORT, () => {
  console.log('Server started on: ' + SERVER_PORT);
});

server_socket_chat.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO Listening on port ${SOCKET_PORT}`);
});
