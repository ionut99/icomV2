import axios from "axios";

const { REACT_APP_API_URL } = process.env;

// insert new file in database
export const AddNewFileInDataBase = async (
  fileName,
  filePath,
  folderId,
  userId,
  createdAt
) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/file/newfile`, {
      fileName,
      filePath,
      folderId,
      userId,
      createdAt,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// get File List from folder
export const getFileList = async (folderId, userId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/folder/getfiles`, {
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
