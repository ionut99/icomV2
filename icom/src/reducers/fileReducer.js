import { UPDATE_FILE_DELTA } from "../actions/actionTypes";

const FileState = {
  delta: [],
  senderID: null,
};

const fileRedu = (state = FileState, action) => {
  switch (action.type) {
    // update chat room ID
    case UPDATE_FILE_DELTA:
      const { delta, senderID } = action.payload;
      return {
        ...state,
        delta,
        senderID,
      };

    default:
      return state;
  }
};

export default fileRedu;
