import { combineReducers } from "redux";
import auth from "./authReducer";
import chatRedu from "./chatReducer";
import fileRedu from "./fileReducer";

// to combine all reducers together
const appReducer = combineReducers({
  auth,
  chatRedu,
  fileRedu,
});

export default appReducer;
