import { USER_UPDATE_CHAT } from "../actions/actionTypes";

const ChannelState = {
  channelID: null,
};

const chatRedu = (state = ChannelState, action) => {
  switch (action.type) {
    // update room ID - started
    case USER_UPDATE_CHAT:
      const { channelID } = action.payload;
      return {
        ...state,
        channelID,
      };

    default:
      return state;
  }
};

export default chatRedu;
