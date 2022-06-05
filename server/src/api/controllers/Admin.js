const { handleResponse } = require("../helpers/utils");

//
const {
  generateOfuscatedPassword,
  generateRandomSalt,
  sortPersonstAfterSearchText,
} = require("../helpers/user_utils");

const {
  InsertNewUserAccountData,
  GetAllUsersDataBase,
} = require("../services/User");

async function adminGetUserList(req, res) {
  try {
    const search_box_text = req.body.search_box_text;
    const userId = req.body.userId;

    if (userId === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var list = await GetAllUsersDataBase(userId)
      .then(function (result) {
        return result.map((x) => {
          const user = { ...x };
          return {
            UserName: user.Surname + " " + user.Name,
            email: user.Email,
            userId: user.userId,
            IsAdmin: user.IsAdmin,
            IsOnline: user.IsOnline,
            LastOnline: user.LastOnline,
          };
        });
      })
      .catch((err) =>
        setImmediate(() => {
          throw err;
        })
      );
    list = list.filter(function (user) {
      return user.UserName.toLowerCase().includes(
        search_box_text.toLowerCase()
      );
    });

    let admin_user_list = sortPersonstAfterSearchText(list, search_box_text);

    return handleResponse(req, res, 200, { admin_user_list });
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 412, " Failed to fetch admin user list! ");
  }
}

// insert new User Account
async function InserNewUserAccount(req, res) {
  try {
    const userSurname = req.body.userSurname;
    const userName = req.body.userName;
    const email = req.body.email;
    const isAdmin = req.body.isAdmin;

    const userId = uui.v4();
    const newsalt = generateRandomSalt(64);
    const ofuscatedPassword = generateOfuscatedPassword("parola", newsalt);

    if (
      userSurname === null ||
      userSurname === undefined ||
      userName === null ||
      userName === undefined ||
      email === null ||
      email === undefined ||
      isAdmin === null ||
      isAdmin === undefined
    ) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var isAdminInt = 0;
    if (isAdmin) isAdminInt = 1;

    const res_add_user = await InsertNewUserAccountData(
      userId,
      userSurname,
      userName,
      email,
      ofuscatedPassword,
      newsalt,
      isAdminInt
    );

    if (res_add_user === "FAILED") {
      console.log("FAILED - Add New User Account ");
      return handleResponse(req, res, 412, " DataBase Error ");
    }

    return handleResponse(req, res, 200, { AddNewUserAccount: "SUCCESS" });
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 412, " Failed to add new user account! ");
  }
}

module.exports = {
  InserNewUserAccount,
  adminGetUserList,
};
