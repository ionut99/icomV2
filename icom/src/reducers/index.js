import { combineReducers } from 'redux';
import auth from './authReducer';
import chatRedu from './chatReducer';
// to combine all reducers together
const appReducer = combineReducers({
  auth, 
  chatRedu
});

export default appReducer;