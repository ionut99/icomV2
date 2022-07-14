import { combineReducers } from "redux";
import auth from "./authReducer";
import chatRedu from "./chatReducer";
import folderRedu from "./folderReducer";


// to combine all reducers together

const appReducer = combineReducers({
  auth,
  chatRedu,
  folderRedu,
});

export default appReducer;

