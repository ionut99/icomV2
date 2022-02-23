import axios from "axios";

const API_URL = 'http://localhost:5000';

// get list of the users
export const getUserListService = async () => {
  try {
    return await axios.get(`${API_URL}/users/getList`);
  } catch (err) {
    return {
      error: true,
      response: err.response
    };
  }
}

// user Search Person API to return Persons Names
export const getSearchPersonService = async (search_box_text) => {
  try {
    return await axios.post(`${API_URL}/users/search`, { search_box_text });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};
