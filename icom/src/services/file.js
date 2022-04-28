import axios from "axios";

const { REACT_APP_API_URL } = process.env;

// insert new member in a group in database
export const AddNewFileInDataBase = async (
  fileName,
  filePath,
  folderId,
  userId,
  createdAt
) => {
  try {
    console.log(fileName);
    console.log(filePath);
    console.log(folderId);
    console.log(userId);
    console.log(createdAt);

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
