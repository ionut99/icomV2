const {
  refreshTokens,
  verifyToken,
  handleResponse,
} = require("../helpers/auth_utils");

// verify jwt
const authMiddleware = function (req, res, next) {
  //
  var token = req.headers["authorization"];
  if (!token) {
    return handleResponse(req, res, 401);
  }

  token = token.replace("Bearer ", "");

  const xsrfToken = req.headers["x-xsrf-token"];
  if (!xsrfToken) {
    return handleResponse(req, res, 403);
  }

  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  if (
    !refreshToken ||
    !(refreshToken in refreshTokens) ||
    refreshTokens[refreshToken] !== xsrfToken
  ) {
    return handleResponse(req, res, 401);
  }

  verifyToken(token, xsrfToken, (err, payload) => {
    if (err) {
      console.log("Eroare verificare token...");
      return handleResponse(req, res, 401);
    } else {
      req.user = payload;
      next();
    }
  });
};

module.exports = {
  authMiddleware,
};
