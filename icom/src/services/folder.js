import axios from "axios";

const { REACT_APP_API_URL } = process.env;

// insert new member in a group in database
export const AddNewFolderInDataBase = async (
  name,
  parentId,
  userId,
  path,
  createdAt
) => {
  try {
    console.log(name);
    console.log(parentId);
    console.log(userId);
    console.log(path);
    console.log(createdAt);

    return await axios.post(`${REACT_APP_API_URL}/folder/newfolder`, {
      name,
      parentId,
      userId,
      path,
      createdAt,
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
  console.log("cauta ");
  console.log(folderId);
  console.log(userId);
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