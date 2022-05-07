import axios from "axios";

const { REACT_APP_API_URL } = process.env;

// insert new folder in database
export const AddNewFolderInDataBase = async (name, parentId, userId, path) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/folder/newfolder`, {
      name,
      parentId,
      userId,
      path,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// get list of the users
export const getFolderByID = async (folderId, userId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/folder/getfolder`, {
      folderId,
      userId,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// get Child Folder List
export const getChildFolders = async (parentId, userId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/folder/getchilds`, {
      parentId,
      userId,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};
