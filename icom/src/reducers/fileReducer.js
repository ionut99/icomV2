import {
  UPDATE_FILE_DELTA,
  UPDATE_DOCUMENT_DATA,
} from "../actions/actionTypes";

const FileState = {
  delta: [],
  senderID: null,
  documentData: "un document default din file reducer :)",
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

    // update document data -- LOADING..
    case UPDATE_DOCUMENT_DATA:
      const { documentData } = action.payload;
      return {
        ...state,
        documentData,
      };
    default:
      return state;
  }
};

export default fileRedu;
