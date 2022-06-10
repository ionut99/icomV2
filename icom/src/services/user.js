import axios from "axios";

const { REACT_APP_API_URL } = process.env;

// get user Details
export const getUserDetails = async (userId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/users/details`, {
      userId,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// user search person to start new conversation
export const newChatPersonService = async (search_box_text, userId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/users/newchat`, {
      search_box_text,
      userId,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

export const getPersonToAddInGroup = async (RoomID, userId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/users/toadd`, {
      RoomID,
      userId,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// Room Search Person API to return Room Names -> channels that is open
export const getSearchRoomService = async (search_box_text, userId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/search`, {
      search_box_text,
      userId,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// get messages list from a room
export const getChannelDetailsService = async (roomId, userId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/details`, {
      roomId,
      userId,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// get messages list from a room
export const getRoomMessagesWithTime = async (
  channelId,
  lastTime,
  position
) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/messages`, {
      channelId,
      lastTime,
      position,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// insert new room in database
export const createNewRoomService = async (
  roomName,
  type,
  userSearchListId,
  userId,
  uuidRoom
) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/newroom`, {
      roomName,
      type,
      userSearchListId,
      userId,
      uuidRoom,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// insert new member in a group in database
export const addNewMemberInRoomService = async (RoomID, userSearchListID) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/newmember`, {
      RoomID,
      userSearchListID,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// get list of participants from a room
export const getParticipantsListService = async (roomId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/participants`, {
      roomId,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// delete room from database

export const deleteRoomService = async (roomId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/deleteroom`, {
      roomId,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// create new group in database

export const createNewGroupService = async (
  newGroupName,
  type,
  userId,
  uuidRoom
) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/newgroup`, {
      newGroupName,
      type,
      userId,
      uuidRoom,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

export const addUserAccountService = async (
  userSurname,
  userName,
  email,
  isAdmin
) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/users/newuser`, {
      userSurname,
      userName,
      email,
      isAdmin,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

export const editUserAccountService = async (
  surname,
  name,
  email,
  currentPassword,
  newPassword,
  userId
) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/users/edit`, {
      surname,
      name,
      email,
      currentPassword,
      newPassword,
      userId,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};
