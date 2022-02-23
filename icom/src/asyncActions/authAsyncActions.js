import {
  verifyTokenStarted, verifyUserSuccess, verifyTokenEnd,
  userLoginStarted, userLoginFailure, userLogout, userSearchPersonStarted, userSearchPersonFailure
} from "../actions/authActions";
import { verifyTokenService, userLoginService, userLogoutService, userSearchPersonService } from '../services/auth';

// handle verify token
export const verifyTokenAsync = (silentAuth = false) => async dispatch => {
  dispatch(verifyTokenStarted(silentAuth));

  const result = await verifyTokenService();

  if (result.error) {
    dispatch(verifyTokenEnd());
    if (result.response && [401, 403].includes(result.response.status))
      dispatch(userLogout());
    return;
  }

  if (result.status === 204)
    dispatch(verifyTokenEnd());
  else
    dispatch(verifyUserSuccess(result.data));
}

// handle user login
export const userLoginAsync = (email, password) => async dispatch => {
  dispatch(userLoginStarted());

  const result = await userLoginService(email, password);

  if (result.error) {
    dispatch(userLoginFailure(result.response.data.message));
    return;
  }

  dispatch(verifyUserSuccess(result.data));
}

// handle user logout
export const userLogoutAsync = () => dispatch => {
  dispatch(userLogout());
  userLogoutService();
}

// handle user Search Persons
export const userSearchPersonAsync = (search_box_text) => async dispatch => {
  dispatch(userSearchPersonStarted());

  const result = await userSearchPersonService(search_box_text);

  if (result.error) {
    dispatch(userSearchPersonFailure(result.response.data.message));
    return;
  }
  //dispatch(verifyUserSuccess(result.data));
}