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
export const getSearchPersonService = async (search_box_text, userId) => {
  try {
    return await axios.post(`${API_URL}/users/search`, { search_box_text, userId });
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
    return await axios.post(`${API_URL}/room/search`, { search_box_text, userId });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};
