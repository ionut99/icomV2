const { GetUserFromDataBase, GetUserByID } = require("../services/Auth");

const {
  refreshTokens,
  COOKIE_OPTIONS,
  generateToken,
  generateRefreshToken,
  getCleanUser,
  verifyToken,
  clearTokens,
  handleResponse,
} = require("../helpers/auth_utils");

const { generateOfuscatedPassword } = require("../helpers/user_utils");

// validate user credentials
async function SignInUser(req, res) {
  try {
    const user = req.body.email;
    const pwd = req.body.password;

    // return 400 status if email/password is not exist
    if (!user || !pwd) {
      return handleResponse(
        req,
        res,
        400,
        null,
        "Email and Password required."
      );
    }

    const userData = await GetUserFromDataBase(user)
      .then(function (result) {
        if (result.length > 0) return result[0];
        else return undefined;
      })
      .catch((err) => {
        throw err;
      });
    //
    if (userData === undefined) {
      return handleResponse(req, res, 401, null, "Email or Password is Wrong.");
    }

    const userSalt = userData.salt;
    const ofuscatedPassword = generateOfuscatedPassword(pwd, userSalt);
    if (ofuscatedPassword !== userData.password) {
      return handleResponse(req, res, 401, null, "Email or Password is Wrong.");
    }

    // get basic user details
    const userObj = getCleanUser(userData);

    // generate access token
    const tokenObj = generateToken(userData);
    // console.log("tokenObj ul este : " + tokenObj);

    // generate refresh token
    const refreshToken = generateRefreshToken(userObj.userId);

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
  } catch (error) {
    console.log(error);
    return handleResponse(req, res, 401, null, "Log in Failed.");
  }
}

function LogOutUser(req, res) {
  clearTokens(req, res);
  return handleResponse(req, res, 204);
}

function VerifyToken(req, res) {
  try {
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
      //
      console.log(" cookies doesn t match ... ");
      //
      return handleResponse(req, res, 401);
    }

    // verify refresh token
    verifyToken(refreshToken, "", async (err, payload) => {
      if (err) {
        return handleResponse(req, res, 401);
      } else {
        const userData = await GetUserByID(payload.userId)
          .then(function (result) {
            if (result.length > 0) return result[0];
            else return undefined;
          })
          .catch((err) => {
            throw err;
          });

        if (userData === undefined) {
          return handleResponse(
            req,
            res,
            401,
            null,
            "Email or Password is Wrong."
          );
        }

        // get basic user details
        const userObj = getCleanUser(userData);

        // generate access token
        const tokenObj = generateToken(userData);

        // refresh token list to manage the xsrf token
        refreshTokens[refreshToken] = tokenObj.xsrfToken;
        res.cookie("XSRF-TOKEN", tokenObj.xsrfToken);
        //
        //
        console.log("token verificat pentru ", userData.email);
        //
        return handleResponse(req, res, 200, {
          user: userObj,
          token: tokenObj.token,
          expiredAt: tokenObj.expiredAt,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 401, null, "Email or Password is Wrong.");
  }
}

module.exports = {
  SignInUser,
  LogOutUser,
  VerifyToken,
};
