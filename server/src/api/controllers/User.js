var uui = require("uuid");
const {
  GetSearchUsersList,
  GetAllUsersDataBase,
  GetUserRoomsList,
  GetRoomMessagesData,
  InsertNewMessageData,
  InsertNewRoomData,
  InsertParticipantData,
  DeleteAllMessageFromRoom,
  DeleteAllParticipantsFromRoom,
  DeleteRoomData,
} = require("../services/User");

const { handleResponse } = require("../helpers/utils");
const { GetUserByID } = require("../services/Auth");

// List for search bar from chat window
async function GetUserSearchList(req, res) {
  const search_box_text = req.body.search_box_text;
  const userId = req.body.userId;

  if (userId === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

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

  if (userId === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

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

  if (roomID === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  var messageRoomList = await GetRoomMessagesData(roomID);
  return handleResponse(req, res, 200, { messageRoomList });
}

async function InsertNewMessage(req, res) {
  // de completat serviciu de insert mesaj
  const senderID = req.body.senderID;
  const roomID = req.body.roomID;
  const messageBody = req.body.messageBody;
  const ID_message = req.body.ID_message;

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
    messageBody
  );

  return handleResponse(req, res, 200, { result });
}

async function CreateNewRoom(req, res) {
  // de completat serviciu de insert mesaj
  const RoomName = req.body.RoomName;
  const Private = req.body.Private;
  const userSearchListID = req.body.userSearchListID;
  const userID = req.body.userID;
  const uuidRoom = req.body.uuidRoom;

  if (
    RoomName === "" ||
    Private === null ||
    userSearchListID === null ||
    userID === null
  ) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  // adaugare camera noua in tabela
  var roomResult = await InsertNewRoomData(RoomName, Private, uuidRoom);

  // adaugare participant la camera creata mai sus
  var participantResult = await InsertParticipantData(
    uuidRoom,
    userSearchListID,
    userID
  );

  // console.log("Rezultat din functia de adaugare a mesajului !");
  // console.log(result);

  return handleResponse(req, res, 200, { participantResult });
}

async function DeleteRoom(req, res) {
  const roomID = req.body.roomID;

  console.log("camera care urmeaza sa se stearga este: ");
  console.log(roomID);

  if (roomID === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  var res_deletemes = await DeleteAllMessageFromRoom(roomID);
  var res_deletepart = await DeleteAllParticipantsFromRoom(roomID);
  var res_deleteroom = await DeleteRoomData(roomID);

  return handleResponse(req, res, 200, { res_deleteroom });
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
  CreateNewRoom,
  DeleteRoom,
};
