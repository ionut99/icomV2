var uui = require("uuid");
const { handleResponse } = require("../helpers/utils");
const { is } = require("express/lib/request");

const {
  GetSearchUsersList,
  GetAllUsersDataBase,
  GetUserRoomsList,
  InsertNewMessageData,
  GetUserDetailsData,
} = require("../services/User");

const { GetRoomMessagesData, GetRoomFolderID } = require("../services/Room");

// const { InsertNewFolderDataBase } = require("../services/Folders");

const { InsertNewUserAccountData } = require("../services/User");
const { GetUserByID } = require("../services/Auth");

// return list with all users
async function GetUserSearchList(req, res) {
  const search_box_text = req.body.search_box_text;
  const userId = req.body.userId;

  if (userId === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  const list = await GetSearchUsersList(search_box_text, userId);

  var userRoomList = [];

  userRoomList = await GetUserRoomsList(search_box_text, userId);
  var userDetails = await GetUserByID(userId);

  var userName = userDetails[0].Surname + " " + userDetails[0].Name;

  const Roomlist = userRoomList.map((x) => {
    const room = { ...x };

    room.RoomName = room.RoomName.replace(userName, "");
    room.RoomName = room.RoomName.replace("#", "");
    return room;
  });

  for (let j = 0; j < Roomlist.length; j++) {
    for (let i = 0; i < list.length; i++) {
      if (Roomlist[j].RoomName.indexOf(list[i].UserName) != -1) {
        list.splice(i, 1);
        continue;
      }
    }
  }

  let keyword = search_box_text;

  let search_results = list
    .filter((prof) => {
      // Filter results by doing case insensitive match on name here
      return prof.UserName.toLowerCase().includes(keyword.toLowerCase());
    })
    .sort((a, b) => {
      // Sort results by matching name with keyword position in name
      if (
        a.UserName.toLowerCase().indexOf(keyword.toLowerCase()) >
        b.UserName.toLowerCase().indexOf(keyword.toLowerCase())
      ) {
        return 1;
      } else if (
        a.UserName.toLowerCase().indexOf(keyword.toLowerCase()) <
        b.UserName.toLowerCase().indexOf(keyword.toLowerCase())
      ) {
        return -1;
      } else {
        if (a.UserName > b.UserName) return 1;
        else return -1;
      }
    });

  return handleResponse(req, res, 200, { search_results });
}

// return list with room search
async function GetRoomSearchList(req, res) {
  const search_box_text = req.body.search_box_text;
  const userId = req.body.userId;

  if (userId === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  var userRoomList = [];
  userRoomList = await GetUserRoomsList(search_box_text, userId);
  var userDetails = await GetUserByID(userId);

  var userName = userDetails[0].Surname + " " + userDetails[0].Name;

  const list = userRoomList.map((x) => {
    const room = { ...x };
    if (room.Type === 0) return room;
    if (room.Type === 1) {
      room.RoomName = room.RoomName.replace(userName, "");
      room.RoomName = room.RoomName.replace("#", "");
    }
    return room;
  });

  let keyword = search_box_text;

  let search_results = list
    .filter((prof) => {
      // Filter results by doing case insensitive match on name here
      return prof.RoomName.toLowerCase().includes(keyword.toLowerCase());
    })
    .sort((a, b) => {
      // Sort results by matching name with keyword position in name
      if (
        a.RoomName.toLowerCase().indexOf(keyword.toLowerCase()) >
        b.RoomName.toLowerCase().indexOf(keyword.toLowerCase())
      ) {
        return 1;
      } else if (
        a.RoomName.toLowerCase().indexOf(keyword.toLowerCase()) <
        b.RoomName.toLowerCase().indexOf(keyword.toLowerCase())
      ) {
        return -1;
      } else {
        if (a.RoomName > b.RoomName) return 1;
        else return -1;
      }
    });

  return handleResponse(req, res, 200, { search_results });
}

// return messages from a room
async function GetRoomMessages(req, res) {
  const roomID = req.body.ChannelID;

  if (roomID === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  var messageRoomList = await GetRoomMessagesData(roomID);

  if (messageRoomList === "FAILED") {
    console.log("Error get room messages!");
    return handleResponse(req, res, 412, " DataBase Error ");
  }
  // id pentru folderul grupului !!!

  var res_roomId = await GetRoomFolderID(roomID);
  if (res_roomId === "FAILED") {
    console.log("Error get room folder Id!");
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  return handleResponse(req, res, 200, {
    messageRoomList: messageRoomList,
    folderId: res_roomId,
  });

  // need to sort messages
}

// insert new message in a room
async function InsertNewMessage(req, res) {
  const senderID = req.body.senderID;
  const roomID = req.body.roomID;
  const messageBody = req.body.messageBody;
  const ID_message = req.body.ID_message;
  const createdTime = new Date();

  if (
    roomID === null ||
    senderID === null ||
    messageBody === "" ||
    messageBody === " " ||
    ID_message === ""
  ) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  var result = await InsertNewMessageData(
    ID_message,
    senderID,
    roomID,
    messageBody,
    createdTime
  );
  if (result === "FAILED") {
    console.log("Error storage message!");
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  return handleResponse(req, res, 200, { InserNewMessage: "SUCCES" });
}

// list with all userss
async function GetUsers(req, res) {
  const userList = await GetAllUsersDataBase();
  const list = userList.map((x) => {
    const user = { ...x };
    delete user.Password;
    return user;
  });
  return handleResponse(req, res, 200, { list });
}

async function GetUserDetails(req, res) {
  const userId = req.body.userId;

  if (userId === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  const userDetails = await GetUserDetailsData(userId);
  if (userDetails === "FAILED") {
    console.log("FAILED - get user Details ");
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  return handleResponse(req, res, 200, { userDetails });
}

// insert new User Account
async function InserNewUserAccount(req, res) {
  const userSurname = req.body.userSurname;
  const userName = req.body.userName;
  const email = req.body.email;
  const isAdmin = req.body.isAdmin;

  const userId = uui.v4();
  const password = "parola";

  console.log("User role:");
  console.log(isAdmin);

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
    password,
    isAdminInt
  );

  if (res_add_user === "FAILED") {
    console.log("FAILED - Add New User Account ");
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  // const rootFolderId = uui.v4();
  // const RootFolderName = "My Drive" + " # " + userName + " " + userSurname;
  // const path = [];
  // const createdAt = new Date();

  // create root folder
  // const res_add_root_folder = await InsertNewFolderDataBase(
  //   rootFolderId,
  //   RootFolderName,
  //   null,
  //   userId,
  //   path,
  //   createdAt
  // );

  // if (res_add_root_folder === "FAILED") {
  //   console.log("Error storage folder configuration!");
  //   return handleResponse(req, res, 412, " DataBase Error ");
  // }

  return handleResponse(req, res, 200, { AddNewUserAccount: "SUCCESS" });
}

module.exports = {
  GetUserSearchList,
  GetRoomSearchList,
  GetUsers,
  GetRoomMessages,
  InsertNewMessage,
  GetUserDetails,
  InserNewUserAccount,
};
