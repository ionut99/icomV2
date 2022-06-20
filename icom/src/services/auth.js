import axios from "axios";
// import https, { Agent } from "https";
// import { httpsAgent } from "../helpers/agent";

// import pavel_cert from "../cert/pavel_cert.pem";
// import pavel_key from "../cert/pavel_key.pem";
// import server_cert from "../cert/server_cert.pem";

// export const agent = new https.Agent({
//   cert: fs.readFileSync(certFile),
//   key: fs.readFileSync(keyFile),
//   cert: pavel_cert,
//   key: pavel_key,
//   ca: server_cert,
//   rejectUnauthorized: false,
// });


//

axios.defaults.withCredentials = true;


//
// axios.proxy.protocol = "https";
// axios.https.Agent = new https.Agent({
//   // cert: fs.readFileSync(certFile),
//   // key: fs.readFileSync(keyFile),
//   // cert: pavel_cert,
//   // key: pavel_key,
//   // ca: server_cert,
//   keepAlive: true,
//   rejectUnauthorized: false,
// });

const { REACT_APP_API_URL } = process.env;

// set token to the axios
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// verify refresh token to generate new access token if refresh token is present
export const verifyTokenService = async () => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/users/verifyToken`);
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// user login API to validate the credential
export const userLoginService = async (email, password) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/users/signin`, {
      email,
      password,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// manage user logout
export const userLogoutService = async () => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/users/logout`);
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// get profile picture
export const getAvatarPictureService = async (userId, roomId) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/document/profile`,
      {
        userId,
        roomId,
      },
      { responseType: "blob" }
    );

    return response;
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// get all rooms open
export const getActiveRoomsService = async (userId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/active`, {
      userId,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};
