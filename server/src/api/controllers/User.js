const { handleResponse } = require("../helpers/utils");

const {
  generateOfuscatedPassword,
  generateRandomSalt,
  sortRoomAfterSearchText,
  sortPersonstAfterSearchText,
  AddLastMessage,
} = require("../helpers/user_utils");

const {
  GetAllUsersDataBase,
  GetUserRoomsList,
  GetUserDetailsData,
} = require("../services/User");
//
const { EditUserAccountDataBase } = require("../services/User");
const { GetUserByID } = require("../services/Auth");

const date = require("date-and-time");
//

//
async function getNewUserChatList(req, res) {
  try {
    const search_box_text = req.body.search_box_text;
    const userId = req.body.userId;

    if (userId === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var search_results = await GetAllUsersDataBase(userId)
      .then(function (result) {
        return result.map((x) => {
          const user = { ...x };
          return {
            UserName: user.Surname + " " + user.Name,
            userId: user.userId,
          };
        });
      })
      .catch((err) =>
        setImmediate(() => {
          throw err;
        })
      );
    search_results = search_results.filter(function (user) {
      return user.UserName.toLowerCase().includes(
        search_box_text.toLowerCase()
      );
    });

    var userRoomList = [];
    userRoomList = await GetUserRoomsList(userId)
      .then(function (result) {
        return result.filter(function (room) {
          return room.RoomName.toLowerCase().includes(
            search_box_text.toLowerCase()
          );
        });
      })
      .catch((err) =>
        setImmediate(() => {
          throw err;
        })
      );

    var userDetails = await GetUserByID(userId)
      .then(function (result) {
        return result;
      })
      .catch((err) =>
        setImmediate(() => {
          throw err;
        })
      );
    var userName = userDetails[0].Surname + " " + userDetails[0].Name;

    const Roomlist = userRoomList.map((x) => {
      const room = { ...x };

      room.RoomName = room.RoomName.replace(userName, "");
      room.RoomName = room.RoomName.replace("#", "");
      return room;
    });

    for (let j = 0; j < Roomlist.length; j++) {
      for (let i = 0; i < search_results.length; i++) {
        if (Roomlist[j].RoomName.indexOf(search_results[i].UserName) != -1) {
          search_results.splice(i, 1);
          continue;
        }
      }
    }

    // sort result
    search_results = sortPersonstAfterSearchText(
      search_results,
      search_box_text
    );

    return handleResponse(req, res, 200, { search_results });
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 412, " Failed to fetch list with users! ");
  }
}

// return list with room search
async function GetRoomSearchList(req, res) {
  try {
    const search_box_text = req.body.search_box_text;
    const userId = req.body.userId;

    if (userId === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var userRoomList = await GetUserRoomsList(userId)
      .then(function (result) {
        return result.filter(function (room) {
          return room.RoomName.toLowerCase().includes(
            search_box_text.toLowerCase()
          );
        });
      })
      .catch((err) =>
        setImmediate(() => {
          throw err;
        })
      );

    userRoomList = await AddLastMessage(userRoomList);

    var userDetails = await GetUserByID(userId);
    var userName = userDetails[0].Surname + " " + userDetails[0].Name;

    var search_results = userRoomList.map((x) => {
      const room = { ...x };
      if (room.Type === 0) return room;
      if (room.Type === 1) {
        room.RoomName = room.RoomName.replace(userName, "");
        room.RoomName = room.RoomName.replace("#", "");
      }
      return room;
    });

    search_results = sortRoomAfterSearchText(search_results, search_box_text);

    return handleResponse(req, res, 200, { search_results });
  } catch (error) {
    console.error(error);
    return handleResponse(
      req,
      res,
      412,
      " Failed to fetch list with conversations! "
    );
  }
}

//

async function GetUserDetails(req, res) {
  try {
    const userId = req.body.userId;

    if (userId === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    const userDetails = await GetUserDetailsData(userId);
    if (userDetails === "FAILED") {
      console.log("FAILED - get user Details ");
      return handleResponse(req, res, 412, " DataBase Error ");
    }

    // TO DO:
    // must remove password and salt!!!!!!!!!!!!!
    return handleResponse(req, res, 200, { userDetails });
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 412, " Failed to fetch user details! ");
  }
}

// edit User Account Data
async function EditUserAccountAsync(req, res) {
  try {
    const userSurname = req.body.userSurname;
    const userName = req.body.userName;
    const email = req.body.email;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const userId = req.body.userId;

    const userDetails = await GetUserDetailsData(userId)
      .then(function (result) {
        return result;
      })
      .catch((err) =>
        setImmediate(() => {
          throw err;
        })
      );

    if (userDetails.length === 0) {
      return handleResponse(req, res, 200, { EditUserAccount: "FAILED" });
    }

    const ofuscatedPassword = generateOfuscatedPassword(
      currentPassword,
      userDetails[0].Salt
    );

    if (userDetails[0].Password !== ofuscatedPassword) {
      return handleResponse(req, res, 200, {
        EditUserAccount: "FAILED",
        Message: "Wrong Password",
      });
    }

    // generate new password
    const newsalt = generateRandomSalt(64);
    const newServerPassword = generateOfuscatedPassword(newPassword, newsalt);

    const result = await EditUserAccountDataBase(
      userSurname,
      userName,
      email,
      newServerPassword,
      newsalt,
      userId
    )
      .then(function (result) {
        return result;
      })
      .catch((err) =>
        setImmediate(() => {
          throw err;
        })
      );

    return handleResponse(req, res, 200, { EditUserAccount: "SUCCESS" });
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 200, { EditUserAccount: "FAILED" });
  }
}

module.exports = {
  getNewUserChatList,
  GetRoomSearchList,
  GetUserDetails,
  EditUserAccountAsync,
};
