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
  AddNewMemberInGroupData,
  GetPartListData,
  UpdateAvatarPathData,
} = require("../services/User");

const { WriteFileToDisc } = require("../services/Documents");

const { handleResponse } = require("../helpers/utils");
const { GetUserByID, GetParticipantByID } = require("../services/Auth");

// return list with all users
async function GetUserSearchList(req, res) {
  const search_box_text = req.body.search_box_text;
  const userId = req.body.userId;

  if (userId === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  if (search_box_text === "Z2V0QGxsVXNlcnM=") {
    var list = await GetAllUsersDataBase();
    return handleResponse(req, res, 200, { list });
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
  return handleResponse(req, res, 200, { list });
}

// return messages from a room
async function GetRoomMessages(req, res) {
  const roomID = req.body.ChannelID;

  if (roomID === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  var messageRoomList = await GetRoomMessagesData(roomID);
  return handleResponse(req, res, 200, { messageRoomList });
}

// insert new message in a room
async function InsertNewMessage(req, res) {
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
  if (result === "FAILED") {
    console.log("Error storage message!");
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  return handleResponse(req, res, 200, { InserNewMessage: "SUCCES" });
}

// creata a new grup
async function CreateNewRoom(req, res) {
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

  const roomResult = await InsertNewRoomData(RoomName, Private, uuidRoom);

  if (roomResult === "FAILED") {
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  if (userSearchListID !== null && userID !== null) {
    var partResult = await InsertParticipantData(uuidRoom, userSearchListID);
    if (partResult === "FAILED")
      return handleResponse(req, res, 412, " DataBase Error ");
    partResult = await InsertParticipantData(uuidRoom, userID);
    if (partResult === "FAILED")
      return handleResponse(req, res, 412, " DataBase Error ");
  }

  return handleResponse(req, res, 200, {
    CreateNewPrivateConversation: "SUCCES",
  });
}

// delete group or private conversation (room)
async function DeleteRoom(req, res) {
  const roomID = req.body.roomID;

  if (roomID === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  var res_deletemes = await DeleteAllMessageFromRoom(roomID);
  if (res_deletemes === "FAILED") {
    console.log("FAILED to delete messages from room!");
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  var res_deletepart = await DeleteAllParticipantsFromRoom(roomID);
  if (res_deletepart === "FAILED") {
    console.log("FAILED to delete participants from room!");
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  var res_deleteroom = await DeleteRoomData(roomID);
  if (res_deleteroom === "FAILED") {
    console.log("FAILED to delete room!");
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  return handleResponse(req, res, 200, { DeleteRoom: "SUCCESS" });
}

// Create a new room (group)
async function CreateNewRoom_Group(req, res) {
  const NewGroupName = req.body.NewGroupName;
  const Type = req.body.Type;
  const userID = req.body.userID;
  const uuidRoom = req.body.uuidRoom;

  if (
    NewGroupName === "" ||
    Type === null ||
    userID === null ||
    uuidRoom === null
  ) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  // adaugare camera noua in tabela
  var roomResult = await InsertNewRoomData(NewGroupName, Type, uuidRoom);
  if (roomResult === "FAILED") {
    console.log("FAILED - insert new room! ");
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  // adaugare participant la camera creata mai sus
  if (userID !== null) {
    var partResult = await InsertParticipantData(uuidRoom, userID);
    if (partResult === "FAILED") {
      console.log("FAILED - inser new participant in room! ");
      return handleResponse(req, res, 412, " DataBase Error ");
    }
  }

  return handleResponse(req, res, 200, "New Group Created successful");
}

// add a new member in a room (group)
async function AddNewMemberInGroup(req, res) {
  const roomID = req.body.RoomID;
  const userSearchListID = req.body.userSearchListID;

  if (roomID === "" || userSearchListID === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  var participantDetails = await GetParticipantByID(userSearchListID, roomID);

  if (participantDetails === "FAILED") {
    console.log("FAILED - get participant! ");
    return handleResponse(req, res, 412, " DataBase Error ");
  } else if (!participantDetails.length) {
    var result = await AddNewMemberInGroupData(roomID, userSearchListID);
    if (result === "FAILED") {
      console.log("FAILED - add participant to group! ");
      return handleResponse(req, res, 412, " DataBase Error ");
    }
    return handleResponse(req, res, 200, { AddParticipant: "SUCCES" });
  } else {
    return handleResponse(req, res, 200, "User is Already a member");
  }
}

// return participants from a room (group)
async function GetPartList(req, res) {
  const roomID = req.body.roomID;

  if (roomID === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  var participantsRoomList = await GetPartListData(roomID);
  if (participantsRoomList === "FAILED") {
    console.log("FAILED - get participants list! ");
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  return handleResponse(req, res, 200, { participantsRoomList });
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

async function UpdateProfilePicture(req, res) {
  const userID = req.body.userID;
  const NewPicture = req.body.NewPicture;

  const path = "./users/" + userID + "/images/avatar/";
  const fileName = "profile.bin";

  if (userID === null || NewPicture === "" || NewPicture === undefined) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  const WriteFileResult = await WriteFileToDisc(path, fileName, NewPicture);

  if (WriteFileResult === "FAILED") {
    console.log("FAILED - Write File To Disc");
    return handleResponse(req, res, 413, " Write File Error ");
  }
  //update database avatar's path
  const result = UpdateAvatarPathData(userID, path + fileName);
  if (result === "FAILED") {
    console.log("FAILED - update user avatar path!");
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  return handleResponse(req, res, 200, { UpdateProfilePicture: "SUCCESS" });
}

module.exports = {
  GetUserSearchList,
  GetRoomSearchList,
  GetUsers,
  GetRoomMessages,
  InsertNewMessage,
  CreateNewRoom,
  DeleteRoom,
  CreateNewRoom_Group,
  AddNewMemberInGroup,
  GetPartList,
  UpdateProfilePicture,
};
