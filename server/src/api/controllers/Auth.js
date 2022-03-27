const { GetUserFromDataBase, GetUserByID } = require("../services/Auth");

const {
  userData,
  refreshTokens,
  COOKIE_OPTIONS,
  generateToken,
  generateRefreshToken,
  getCleanUser,
  verifyToken,
  clearTokens,
  handleResponse,
} = require("../helpers/utils");

// validate user credentials
async function SignInUser(req, res) {
  const user = req.body.email;
  const pwd = req.body.password;

  // return 400 status if email/password is not exist
  if (!user || !pwd) {
    return handleResponse(req, res, 400, null, "Email and Password required.");
  }

  try {
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

    //console.log(userData);

    // return 401 status if the credential is not matched
    if (!userData) {
      return handleResponse(req, res, 401, null, "Email or Password is Wrong.");
    }

    // get basic user details
    const userObj = getCleanUser(userData);

    // generate access token
    const tokenObj = generateToken(userData);
    console.log("tokenObj ul este : " + tokenObj);

    // generate refresh token
    const refreshToken = generateRefreshToken(userObj.userId);
    console.log("refreshToken ul este : " + refreshToken);

    // refresh token list to manage the xsrf token
    refreshTokens[refreshToken] = tokenObj.xsrfToken;

    // set cookies
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.cookie("XSRF-TOKEN", tokenObj.xsrfToken);

    console.log("User log in: " + userData.surname + " " + userData.name);

    return handleResponse(req, res, 200, {
      user: userObj,
      token: tokenObj.token,
      expiredAt: tokenObj.expiredAt,
    });
  } catch (e) {
    console.log(e);
  }
}

function LogOutUser(req, res) {
  clearTokens(req, res);
  return handleResponse(req, res, 204);
}

function VerifyToken(req, res) {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  if (!refreshToken) {
    return handleResponse(req, res, 204);
  }

  // verify xsrf token
  const xsrfToken = req.headers["x-xsrf-token"];
  if (
    !xsrfToken ||
    !(refreshToken in refreshTokens) ||
    refreshTokens[refreshToken] !== xsrfToken
  ) {
    console.log("Unauthorized access!!!!");
    return handleResponse(req, res, 401);
  }

  // verify refresh token
  verifyToken(refreshToken, "", async (err, payload) => {
    if (err) {
      return handleResponse(req, res, 401);
    } else {
      const userData_copy = await GetUserByID(payload.userId);

      if (!userData_copy[0]) {
        return handleResponse(
          req,
          res,
          401,
          null,
          "Email or Password is Wrong."
        );
      }

      userData.userId = userData_copy[0].userId;
      userData.surname = userData_copy[0].Surname;
      userData.name = userData_copy[0].Name;
      userData.email = userData_copy[0].Email;
      userData.password = userData_copy[0].Password;
      userData.isAdmin = userData_copy[0].IsAdmin;

      if (!userData) {
        return handleResponse(req, res, 401);
      }

      // get basic user details
      const userObj = getCleanUser(userData);

      // generate access token
      const tokenObj = generateToken(userData);

      // refresh token list to manage the xsrf token
      refreshTokens[refreshToken] = tokenObj.xsrfToken;
      res.cookie("XSRF-TOKEN", tokenObj.xsrfToken);

      // return the token along with user details
      return handleResponse(req, res, 200, {
        user: userObj,
        token: tokenObj.token,
        expiredAt: tokenObj.expiredAt,
      });
    }
  });
}

module.exports = {
  SignInUser,
  LogOutUser,
  VerifyToken,
};
