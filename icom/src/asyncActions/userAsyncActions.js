import { userLogout, verifyTokenEnd } from "./../actions/authActions";
import { getSearchRoomService, getSearchPersonService } from "../services/user";

import { setRoomList, setPersonSearchList } from "./../actions/userActions";

// handle RoomList Search
export const userResetRoomListAsync =
  (search_box_content, userId) => async (dispatch) => {
    console.log("salut din userResetListRoom");
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
    console.log("salut din async pentru conversatii");
    console.log(Roomresult.data["list"]);
    dispatch(setRoomList(Roomresult.data["list"]));
  };

// handle Person Search
export const userSearchPersonListAsync =
  (search_box_content, userId) => async (dispatch) => {
    console.log("salut din userSearchPersonList");
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
    console.log("salut din async pentru conversatii");
    console.log(Personresult.data["list"]);
    if (search_box_content !== "") {
      dispatch(setPersonSearchList(Personresult.data["list"]));
    } else {
      dispatch(setPersonSearchList([]));
    }
  };
