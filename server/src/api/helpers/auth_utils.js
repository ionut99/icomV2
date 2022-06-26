const jwt = require("jsonwebtoken");
const moment = require("moment");
const randtoken = require("rand-token");
const ms = require("ms");

const NODE_ENV = "development";
const JWT_SECRET =
  "OU9KE61vTKV6VKSSX23imuxmZIsE9Xq2ibBkQi7gazcPSZ8x/ezgOUy5vLxTp6HyhUaUBsxiRETppskfbQB5yL1gPlEpBznfiGNsB9RVoUqGFcWTwTCI50xRqBTvIiRZOWrVDQZXhG9mIRwjiKo7/zhA0NUnUV0UazGK5qKQhbzlU0EVqKuA93ZdUcizFeS8K6mi138XGyV/ltXZxFc2VsVURrCn5q7WgfnEuvODC7PqXBzfhWPklRI9bq7V+o1or3EU54ykGkUYrTv998ZxJ0yBr9LG5/OlqnizYjogu9tSIT1sOr6miH8X1s34RqlA/MYGM4Te5bB5va5nd4cCA==";
//

const ACCESS_TOKEN_LIFE = "100m";
const REFRESH_TOKEN_LIFE = "30d";
//
const dev = NODE_ENV !== "production";

// refresh token list to manage the xsrf token
const refreshTokens = {};

// cookie options to create refresh token
const COOKIE_OPTIONS = {
  // domain: "localhost",
  httpOnly: true,
  secure: !dev,
  signed: true,
};

// generate tokens and return it
function generateToken(user) {
  //1. Don't use password and other sensitive fields
  //2. Use the information that are useful in other parts
  if (!user) return null;

  const userData = {
    userId: user.userId,
    name: user.name,
    surname: user.surname,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  // generat xsrf token and use it to generate access token
  const xsrfToken = randtoken.generate(24);

  // create private key by combining JWT secret and xsrf token
  const privateKey = JWT_SECRET + xsrfToken;

  // generate access token and expiry date
  const token = jwt.sign(userData, privateKey, {
    expiresIn: ACCESS_TOKEN_LIFE,
  });

  // expiry time of the access token
  const expiredAt = moment().add(ms(ACCESS_TOKEN_LIFE), "ms").valueOf();

  return {
    token,
    expiredAt,
    xsrfToken,
  };
}

// generate refresh token
function generateRefreshToken(userId) {
  if (!userId) return null;

  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_LIFE,
  });
}

// verify access token and refresh token
function verifyToken(token, xsrfToken = "", cb) {
  const privateKey = JWT_SECRET + xsrfToken;
  jwt.verify(token, privateKey, cb);
}

// return basic user details
function getCleanUser(user) {
  if (!user) return null;

  return {
    userId: user.userId,
    name: user.name,
    surname: user.surname,
    email: user.email,
    isAdmin: user.isAdmin,
  };
}

// handle the API response
function handleResponse(req, res, statusCode, data, message) {
  let isError = false;
  let errorMessage = message;
  switch (statusCode) {
    case 204:
      return res.sendStatus(204);
    case 400:
      isError = true;
      break;
    case 401:
      isError = true;
      errorMessage = message || "Invalid user.";
      clearTokens(req, res);
      break;
    case 403:
      isError = true;
      errorMessage = message || "Access to this resource is denied.";
      clearTokens(req, res);
      break;
    default:
      break;
  }
  const resObj = data || {};
  if (isError) {
    resObj.error = true;
    resObj.message = errorMessage;
  }
  return res.status(statusCode).json(resObj);
}

// clear tokens from cookie
function clearTokens(req, res) {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  delete refreshTokens[refreshToken];
  res.clearCookie("XSRF-TOKEN");
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
}

module.exports = {
  refreshTokens,
  COOKIE_OPTIONS,
  generateToken,
  generateRefreshToken,
  verifyToken,
  getCleanUser,
  handleResponse,
  clearTokens,
};
