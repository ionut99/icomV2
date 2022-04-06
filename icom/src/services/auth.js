import axios from "axios";
axios.defaults.withCredentials = true;
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
export const getAvatarPictureService = async (userID) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/document/geprofilepicture`,
      {
        userID,
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
