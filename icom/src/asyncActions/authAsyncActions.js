import {
  verifyTokenStarted,
  verifyUserSuccess,
  verifyTokenEnd,
  userLoginStarted,
  userLoginFailure,
  userLogout,
  // updateUserAvatar,
} from "../actions/authActions";
import {
  verifyTokenService,
  userLoginService,
  userLogoutService,
  getAvatarPictureService,
} from "../services/auth";

// handle verify token
export const verifyTokenAsync =
  (silentAuth = false) =>
  async (dispatch) => {
    dispatch(verifyTokenStarted(silentAuth));

    const result = await verifyTokenService();

    if (result.error) {
      dispatch(verifyTokenEnd());
      if (result.response && [401, 403].includes(result.response.status))
        dispatch(userLogout());
      return;
    }

    if (result.status === 204) dispatch(verifyTokenEnd());
    else dispatch(verifyUserSuccess(result.data));
  };

// handle user login
export const userLoginAsync = (email, password) => async (dispatch) => {
  dispatch(userLoginStarted());

  const result = await userLoginService(email, password);

  if (result.error) {
    dispatch(userLoginFailure(result.response.data.message));
    return;
  }

  dispatch(verifyUserSuccess(result.data));
};

// handle get Avatar Picture
export const getAvatarPictureAsync = async (ID, atuhUser, ISroom) => {
  if (ISroom !== undefined) {
    const resultBlob = await getAvatarPictureService(ID, atuhUser, ISroom);
    return new Promise((resolve) => {
      if (
        resultBlob.error === true ||
        ISroom === undefined ||
        ID === undefined ||
        atuhUser === undefined
      ) {
        return resolve("FAILED");
      }
      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(resultBlob.data);
      fileReaderInstance.onload = () => {
        const base64data = fileReaderInstance.result;
        // dispatch(updateUserAvatar(base64data));
        return resolve(base64data);
      };
    });
  }
};

// handle user logout
export const userLogoutAsync = () => (dispatch) => {
  dispatch(userLogout());
  userLogoutService();
};
