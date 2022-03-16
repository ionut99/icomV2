const {
  GetSearchUsersList,
  GetAllUsersDataBase,
  GetUserRoomsList,
  GetRoomMessagesData,
  InsertNewMessageData,
} = require("../services/User");

const { handleResponse } = require("../helpers/utils");
const { GetUserByID } = require("../services/Auth");

// List for search bar from chat window
async function GetUserSearchList(req, res) {
  const search_box_text = req.body.search_box_text;
  const userId = req.body.userId;

  var list = await GetSearchUsersList(search_box_text, userId);

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

  return handleResponse(req, res, 200, { list });
}

// List for search bar from chat window
async function GetRoomSearchList(req, res) {
  const search_box_text = req.body.search_box_text;
  const userId = req.body.userId;

  var userRoomList = [];

  userRoomList = await GetUserRoomsList(search_box_text, userId);
  var userDetails = await GetUserByID(userId);

  var userName = userDetails[0].Surname + " " + userDetails[0].Name;

  const list = userRoomList.map((x) => {
    const room = { ...x };

    room.RoomName = room.RoomName.replace(userName, "");
    room.RoomName = room.RoomName.replace("#", "");
    return room;
  });
  // console.log(list);
  return handleResponse(req, res, 200, { list });
}

async function GetRoomMessages(req, res) {
  const roomID = req.body.ChannelID;

  var messageRoomList = await GetRoomMessagesData(roomID);
  return handleResponse(req, res, 200, { messageRoomList });
}

async function InsertNewMessage(req, res) {
  // de completat serviciu de insert mesaj
  const senderID = req.body.senderID;
  const roomID = req.body.roomID;
  const messageBody = req.body.messageBody;
  const ID_message = req.body.ID_message;

  var result = await InsertNewMessageData(
    ID_message,
    senderID,
    roomID,
    messageBody
  );

  // console.log("Rezultat din functia de adaugare a mesajului !");
  // console.log(result);

  return handleResponse(req, res, 200, { result });
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
  GetRoomMessages,
  InsertNewMessage,
};
