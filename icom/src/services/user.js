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

//admin search person for management
export const getUserAdminList = async (search_box_text, userId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/users/search`, {
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

// get all rooms open
export const getActiveRoomsService = async (userId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/active`, {
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
export const getChannelDetailsService = async (ChannelID, userId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/details`, {
      ChannelID,
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
  ChannelID,
  lastTime,
  position
) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/messages`, {
      ChannelID,
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
  RoomName,
  Private,
  userSearchListID,
  userID,
  uuidRoom
) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/newroom`, {
      RoomName,
      Private,
      userSearchListID,
      userID,
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
export const getParticipantsListService = async (roomID) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/participants`, {
      roomID,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// delete room from database

export const deleteRoomService = async (roomID) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/deleteroom`, {
      roomID,
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
  NewGroupName,
  Type,
  userID,
  uuidRoom
) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/newgroup`, {
      NewGroupName,
      Type,
      userID,
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
  userSurname,
  userName,
  email,
  currentPassword,
  newPassword,
  userId
) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/users/edit`, {
      userSurname,
      userName,
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
