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

// get list of the users
export const getUserListService = async () => {
  try {
    return await axios.get(`${REACT_APP_API_URL}/users/getList`);
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

// get messages list from a room
export const getRoomMessages = async (ChannelID) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/messages`, {
      ChannelID,
    });
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
    return await axios.post(`${REACT_APP_API_URL}/room/newmessage`, {
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
export const AddNewMemberInRoomDataBase = async (RoomID, userSearchListID) => {
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

export const DeleteRoomDataBase = async (roomID) => {
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

export const CreateNewGroupDataBase = async (
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

// get document data
export const GetDocumentFileData = async (FileName, FilePath) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/document/getdocument`, {
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

// update user picture
export const UpdateProfilePictureData = async (userID, NewPicture) => {
  const formdata = new FormData();
  formdata.append("avatar", NewPicture);
  formdata.append("userID", userID);
  try {
    return await axios.post(
      `${REACT_APP_API_URL}/users/updatePicture`,
      formdata,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// uploading File for Storing
export const UploadNewStoringFile = async (
  fileName,
  filePath,
  folderId,
  userId,
  createdAt,
  FILE
) => {
  const formdata = new FormData();
  formdata.append("storedfile", FILE);
  formdata.append("fileName", fileName);
  formdata.append("filePath", filePath);
  formdata.append("folderId", folderId);
  formdata.append("userId", userId);
  formdata.append("createdAt", createdAt);
  try {
    return await axios.post(
      `${REACT_APP_API_URL}/document/newStoragefile`,
      formdata,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};
