import {
  verifyTokenStarted,
  verifyUserSuccess,
  verifyTokenEnd,
  userLoginStarted,
  userLoginFailure,
  userLogout,
} from "../actions/authActions";
import {
  verifyTokenService,
  userLoginService,
  userLogoutService,
  getAvatarPictureService,
  getActiveRoomsService,
} from "../services/auth";

import { disconnectSocket, connectSocket } from "../actions/authActions";
import {
  removeSocketConnection,
  establishSocketConnection,
} from "../services/socket";

import { connectSocketToChannel } from "../services/socket";

export const verifyTokenAsync =
  (silentAuth = false) =>
  async (dispatch) => {
    dispatch(verifyTokenStarted(silentAuth));

    const result = await verifyTokenService();

    if (result.error) {
      dispatch(verifyTokenEnd());
      if (result.response && [401, 403].includes(result.response.status)) {
        dispatch(userLogout());
      }
      return;
    }

    if (result.status === 204) dispatch(verifyTokenEnd());
    else {
      // connect chat channels
      dispatch(verifyUserSuccess(result.data));
      // connect chat channels
      dispatch(connectChatChannels(result.data["user"].userId, false));
    }
  };

// handle user login
export const userLoginAsync = (email, password) => async (dispatch) => {
  dispatch(userLoginStarted());

  const userData = await userLoginService(email, password);

  if (userData.error) {
    dispatch(userLoginFailure(userData.response.data.message));
    return;
  }

  // connect chat channels
  establishSocketConnection();
  dispatch(connectChatChannels(userData.data["user"].userId, false));
  // connect chat channels

  dispatch(verifyUserSuccess(userData.data));
};

export const connectChatChannels = (userId, connected) => async (dispatch) => {
  //
  if (!connected) {
    const chatChannels = await getActiveRoomsService(userId).then((result) => {
      if (result.status === 200) return result.data["activeRoomConnections"];
      else return undefined;
    });

    if (chatChannels !== undefined) {
      for (let i = 0; i < chatChannels.length; i++) {
        if (
          chatChannels[i].roomId === undefined ||
          chatChannels[i].roomId === ""
        )
          continue;
        const request = {
          userId: userId,
          roomId: chatChannels[i].roomId,
          type: "chat",
        };
        //
        connectSocketToChannel(request);
        //
      }
    }
    dispatch(connectSocket());
  }
};

// handle get Avatar Picture
export const getAvatarPictureAsync = async (userId, roomId) => {
  if (userId === undefined) return;
  const resultBlob = await getAvatarPictureService(userId, roomId);
  //
  return new Promise((resolve) => {
    if (resultBlob.error === true || resultBlob.status === 422) {
      return undefined;
    }
    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(resultBlob.data);
    fileReaderInstance.onload = () => {
      const base64data = fileReaderInstance.result;
      return resolve(base64data);
    };
  });
};

// handle user logout
export const userLogoutAsync = () => (dispatch) => {
  //
  dispatch(disconnectSocket());
  removeSocketConnection();
  //
  dispatch(userLogout());
  userLogoutService();
};
