import { combineReducers } from "redux";
import auth from "./authReducer";
import chatRedu from "./chatReducer";
import fileRedu from "./fileReducer";
import folderRedu from "./folderReducer";
// to combine all reducers together


const appReducer = combineReducers({
  auth,
  chatRedu,
  fileRedu,
  folderRedu,
});

export default appReducer;
