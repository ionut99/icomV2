const {
  GetSearchUsersList,
  GetAllUsersDataBase,
  GetUserRoomsList,
} = require("../services/User");

const { handleResponse } = require("../helpers/utils");

// List for search bar from chat window
async function GetUserSearchList(req, res) {
  const search_box_text = req.body.search_box_text;
  const userId = req.body.userId;

  var userSeachList = [];

  userSeachList = await GetSearchUsersList(search_box_text, userId);

  const list = userSeachList.map((x) => {
    const user = { ...x };
    delete user.Password;
    return user;
  });

  // if (list.length === 0) {
  //   console.log("Empty list!");
  //   return handleResponse(req, res, 400);
  // }
  return handleResponse(req, res, 200, { list });
}

// List for search bar from chat window
async function GetRoomSearchList(req, res) {
  const search_box_text = req.body.search_box_text;
  const userId = req.body.userId;

  var userRoomList = [];

  userRoomList = await GetUserRoomsList(search_box_text, userId);

  const list = userRoomList.map((x) => {
    const user = { ...x };
    delete user.Password;
    return user;
  });

  // if (list.length === 0) {
  //   console.log("Empty list!");
  //   return handleResponse(req, res, 400);
  // }
  return handleResponse(req, res, 200, { list });
}

// list with all users
async function GetUsers(req, res) {
  const userList = await GetAllUsersDataBase();
  const list = userList.map((x) => {
    const user = { ...x };
    delete user.Password;
    return user;
  });
  return handleResponse(req, res, 200, { list });
}

module.exports = {
  GetUserSearchList,
  GetRoomSearchList,
  GetUsers,
};
