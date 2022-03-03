const { GetSearchUsersList, GetAllUsersDataBase, GetUserRoomsList } = require("../services/User");

const { handleResponse } = require("../helpers/utils");


// List for search bar from chat window
async function GetUserSearchList(req, res) {
  const search_box_text = req.body.search_box_text;
  const userId = req.body.userId;

  console.log("Loook in database after :");
  console.log(search_box_text); //GetSearchUsersList

  console.log("UserId este:");
  console.log(userId);
  var userSeachList = [];

  if(search_box_text!=""){
    userSeachList = await GetSearchUsersList(search_box_text, userId);
  } else{
    userSeachList = await GetUserRoomsList(userId);
  }

  const list = userSeachList.map((x) => {
    const user = { ...x };
    delete user.Password;
    return user;
  });
  console.log("Result of search User is: ");
  console.log(list);
  if (list.length === 0) {
    console.log("Empty list!");
    return handleResponse(req, res, 400);
  }
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
  GetUsers,
};
