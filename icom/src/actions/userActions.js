import { USER_UPDATE_CHAT } from "./actionTypes";


// de vazut partea asta cu {channelID} de ce nu a functionat cu {}
export const updateChannelID = ( channelID ) => {
  console.log("salut din userActions.js channel ID este " + channelID);
  return {
    type: USER_UPDATE_CHAT,
    payload: {
      channelID,
    },
  };
};
