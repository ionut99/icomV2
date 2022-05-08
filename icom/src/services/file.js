import axios from "axios";

const { REACT_APP_API_URL } = process.env;

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
