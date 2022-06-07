import axios from "axios";

const { REACT_APP_API_URL } = process.env;

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

//admin get teams names
export const getGroupsNames = async (adminId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/room/groups`, {
      adminId,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};
