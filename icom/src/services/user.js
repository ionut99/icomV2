import axios from "axios";

const API_URL = "http://localhost:5000";

// get list of the users
export const getUserListService = async () => {
  try {
    return await axios.get(`${API_URL}/users/getList`);
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// user Search Person API to return Persons Names
export const getSearchPersonService = async (search_box_text, userId) => {
  try {
    return await axios.post(`${API_URL}/users/search`, {
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

// Room Search Person API to return Room Names -> channels that is open
export const getSearchRoomService = async (search_box_text, userId) => {
  try {
    return await axios.post(`${API_URL}/room/search`, {
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
export const getRoomMessages = async (ChannelID) => {
  try {
    return await axios.post(`${API_URL}/room/messages`, { ChannelID });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// insert new message that was sent in table
export const InsertNewMessageDataBase = async (
  ID_message,
  senderID,
  roomID,
  messageBody
) => {
  try {
    return await axios.post(`${API_URL}/room/newmessage`, {
      ID_message,
      senderID,
      roomID,
      messageBody,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// insert new room in database
export const CreateNewRoomDataBase = async (
  RoomName,
  Private,
  userSearchListID,
  userID,
  uuidRoom
) => {
  try {
    return await axios.post(`${API_URL}/room/newroom`, {
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
export const AddNewMemberInRoomDataBase = async (RoomID, userSearchListID) => {
  try {
    return await axios.post(`${API_URL}/room/newmember`, {
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
    return await axios.post(`${API_URL}/room/participants`, {
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

export const DeleteRoomDataBase = async (roomID) => {
  try {
    return await axios.post(`${API_URL}/room/deleteroom`, {
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

export const CreateNewGroupDataBase = async (
  NewGroupName,
  Type,
  userID,
  uuidRoom
) => {
  try {
    return await axios.post(`${API_URL}/room/newgroup`, {
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

// get document data
export const GetDocumentFileData = async (FileName, FilePath) => {
  try {
    return await axios.post(`${API_URL}/document/getdocument`, {
      FileName,
      FilePath,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};
