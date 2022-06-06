import { UPDATE_FILE_DELTA, UPDATE_DOCUMENT_DATA } from "./actionTypes";

// file DATA document update -- LOADING...
export const GetFileDocument = (documentData) => {
  return {
    type: UPDATE_DOCUMENT_DATA,
    payload: { documentData },
  };
};

// file DELTA document update
export const UpdateDeltaFile = (delta, senderID) => {
  return {
    type: UPDATE_FILE_DELTA,
    payload: { delta, senderID },
  };
};
