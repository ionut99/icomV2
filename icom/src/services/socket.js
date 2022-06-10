//
//
import { socket } from "../context/socket";

export const connectSocketToChannel = (request) => {
  try {
    socket.emit("join room", request, (error) => {
      if (error) {
        // alert(error);
        console.log(error);
      }
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

export const establishSocketConnection = () => {
  try {
    socket.connect();
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

export const removeSocketConnection = () => {
  try {
    socket.disconnect();
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};
