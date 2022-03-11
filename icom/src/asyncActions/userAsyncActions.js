import { userLogout, verifyTokenEnd } from "./../actions/authActions";
import { getSearchRoomService, getSearchPersonService } from "../services/user";

import {
  setRoomList,
  setPersonSearchList,
  setNewRoomID,
} from "./../actions/userActions";

// handle RoomList Search
export const userResetRoomListAsync =
  (search_box_content, userId) => async (dispatch) => {
    const Roomresult = await getSearchRoomService(search_box_content, userId);

    if (Roomresult.error) {
      dispatch(verifyTokenEnd());
      if (
        Roomresult.response &&
        [401, 403].includes(Roomresult.response.status)
      )
        dispatch(userLogout());
      return;
    }

    dispatch(setRoomList(Roomresult.data["list"]));

    if (search_box_content === "") {
      dispatch(setNewRoomID(Roomresult.data["list"].length + 1));
    }
  };

// handle Person Search
export const userSearchPersonListAsync =
  (search_box_content, userId) => async (dispatch) => {
    const Personresult = await getSearchPersonService(
      search_box_content,
      userId
    );

    if (Personresult.error) {
      dispatch(verifyTokenEnd());
      if (
        Personresult.response &&
        [401, 403].includes(Personresult.response.status)
      )
        dispatch(userLogout());
      return;
    }
    if (search_box_content !== "") {
      dispatch(setPersonSearchList(Personresult.data["list"]));
    } else {
      dispatch(setPersonSearchList([]));
    }
  };
