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
  GetNOTPartListData,
  GetUserDetailsData,
} = require("../services/User");

const { handleResponse } = require("../helpers/utils");
const { GetUserByID, GetParticipantByID } = require("../services/Auth");
const { is } = require("express/lib/request");

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

async function GetNOTPartList(req, res) {
  const roomID = req.body.roomID;
  const userId = req.body.userId;

  if (roomID === null || userId === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  const NOTparticipantsRoomList = await GetNOTPartListData(roomID, userId);
  if (NOTparticipantsRoomList === "FAILED") {
    console.log("FAILED - get NOT participants list! ");
    return handleResponse(req, res, 412, " DataBase Error ");
  }

  return handleResponse(req, res, 200, { NOTparticipantsRoomList });
}

module.exports = {
  CreateNewRoom,
  DeleteRoom,
  CreateNewRoom_Group,
  AddNewMemberInGroup,
  GetPartList,
  GetNOTPartList,
};
