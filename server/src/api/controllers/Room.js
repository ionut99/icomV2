var uui = require("uuid");

const { AddNewMemberInGroupData } = require("../services/User");

const {
  InsertNewRoomData,
  InsertParticipantData,
  DeleteAllMessageFromRoom,
  DeleteAllParticipantsFromRoom,
  DeleteRoomData,
  GetPartListData,
} = require("../services/Room");

const {
  InsertFolderUserRelationDataBase,
  InsertNewFolderDataBase,
  DeleteFolderUserRelation,
  DeleteRoomFolderAndUserRelation,
  // DeleteFolder,
} = require("../services/Folders");

const { GetRoomMessagesData, GetRoomFolderID } = require("../services/Room");

const { GetAllUsersDataBase } = require("../services/User");

const { handleResponse } = require("../helpers/utils");
const { GetParticipantByID, GetUserByID } = require("../services/Auth");
const { is } = require("express/lib/request");

// --------------------- // -----------------------

// create new conversation (private group) - folders functions was updated
async function CreateNewRoom(req, res) {
  try {
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

    var partResult = await InsertParticipantData(uuidRoom, userSearchListID);
    if (partResult === "FAILED")
      return handleResponse(req, res, 412, " DataBase Error ");
    partResult = await InsertParticipantData(uuidRoom, userID);
    if (partResult === "FAILED")
      return handleResponse(req, res, 412, " DataBase Error ");

    // folder Creation
    const folderId = uui.v4();
    const path = [];
    const createdAt = new Date();
    const parentID = "root";

    var folderResult = await InsertNewFolderDataBase(
      folderId,
      RoomName,
      parentID,
      userID,
      path,
      createdAt
    );
    if (folderResult === "FAILED") {
      console.log("Error storage folder configuration!");
      return handleResponse(req, res, 412, " DataBase Error ");
    }

    // add folder relation for user whicj initiate conversation
    folderResult = await InsertFolderUserRelationDataBase(
      folderId,
      null,
      uuidRoom
    );
    if (folderResult === "FAILED") {
      console.log("Error storage folder configuration!");
      return handleResponse(req, res, 412, " DataBase Error ");
    }

    return handleResponse(req, res, 200, {
      CreateNewPrivateConversation: "SUCCES",
    });
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 412, " Failed to create new room! ");
  }
}

// --------------------- // -----------------------

// delete group or private conversation (room)
async function DeleteRoom(req, res) {
  try {
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

    // delete room folder
    // var res_deleteFolder = await DeleteFolder(roomID);
    // if (res_deleteFolder === "FAILED") {
    //   console.log("FAILED to delete room Relation!");
    //   return handleResponse(req, res, 412, " DataBase Error ");
    // }

    // // delete room folder - User Relation
    // var res_deleteFolderRelation = await DeleteFolderUserRelation(roomID);
    // if (res_deleteFolderRelation === "FAILED") {
    //   console.log("FAILED to delete room folder!");
    //   return handleResponse(req, res, 412, " DataBase Error ");
    // }

    // delete folder and relation
    var res_del_room_folder = await DeleteRoomFolderAndUserRelation(roomID);
    if (res_del_room_folder === "FAILED") {
      console.log("FAILED to delete room Relation and FolderRoom!");
      return handleResponse(req, res, 412, " DataBase Error ");
    }

    // delete subfolders??

    var res_deleteroom = await DeleteRoomData(roomID);
    if (res_deleteroom === "FAILED") {
      return handleResponse(req, res, 412, " DataBase Error ");
    }

    return handleResponse(req, res, 200, { DeleteRoom: "SUCCESS" });
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 412, " Failed to delete room ");
  }
}

// Create a new room (group) - folders functions was updated
async function CreateNewRoom_Group(req, res) {
  try {
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
    var roomResult = await InsertNewRoomData(NewGroupName, Type, uuidRoom)
      .then(function (result) {
        return result;
      })
      .catch((err) =>
        setImmediate(() => {
          throw err;
        })
      );

    // adaugare participant la camera creata mai sus
    if (userID !== null) {
      var partResult = await InsertParticipantData(uuidRoom, userID)
        .then(function (result) {
          return result;
        })
        .catch((err) =>
          setImmediate(() => {
            throw err;
          })
        );
    }

    // folder Creation for new group
    const folderId = uui.v4();
    const path = [];
    const createdAt = new Date();
    const parentID = "root";

    var create_folder_res = await InsertNewFolderDataBase(
      folderId,
      NewGroupName,
      parentID,
      userID,
      path,
      createdAt
    )
      .then(function (result) {
        return result;
      })
      .catch((err) =>
        setImmediate(() => {
          throw err;
        })
      );

    // add folder relation for user whicj initiate conversation
    var folderResult = await InsertFolderUserRelationDataBase(
      folderId,
      null,
      uuidRoom
    );
    if (folderResult === "FAILED") {
      console.log("Error storage folder configuration!");
      return handleResponse(req, res, 412, " DataBase Error ");
    }

    return handleResponse(req, res, 200, "New Group Created successful");
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 412, " Failed to delete group room! ");
  }
}

// add a new member in a room (group) - without folder functions (use sql tables)
async function AddNewMemberInGroup(req, res) {
  try {
    const roomID = req.body.RoomID;
    const userSearchListID = req.body.userSearchListID;

    if (roomID === "" || userSearchListID === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var participantDetails = await GetParticipantByID(userSearchListID, roomID)
      .then(function (result) {
        return result;
      })
      .catch((err) =>
        setImmediate(() => {
          throw err;
        })
      );

    if (!participantDetails.length) {
      var result = await AddNewMemberInGroupData(roomID, userSearchListID)
        .then(function (result) {
          return result;
        })
        .catch((err) =>
          setImmediate(() => {
            throw err;
          })
        );
      if (result.length > 0)
        return handleResponse(req, res, 200, { AddParticipant: "SUCCES" });
    } else {
      return handleResponse(req, res, 200, "User is Already a member");
    }
  } catch (error) {
    console.error(error);
    return handleResponse(
      req,
      res,
      412,
      " Failed to add new member in group room "
    );
  }
}

// return participants from a room (group)
async function GetPartList(req, res) {
  try {
    const roomID = req.body.roomID;

    if (roomID === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    const participantsRoomList = await GetPartListData(roomID)
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

    return handleResponse(req, res, 200, { participantsRoomList });
  } catch (error) {
    console.log(error);
    return handleResponse(req, res, 412, " Failed to fetch participants list ");
  }
}

async function GetNOTPartList(req, res) {
  try {
    const RoomID = req.body.RoomID;
    const userId = req.body.userId;

    if (RoomID === null || userId === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    // participants
    const participantsRoomList = await GetPartListData(RoomID)
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

    // all users
    var NOTparticipantsRoomList = await GetAllUsersDataBase(userId)
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

    NOTparticipantsRoomList = NOTparticipantsRoomList.filter(function (item) {
      for (var p in participantsRoomList) {
        if (
          participantsRoomList[p].userId == undefined ||
          participantsRoomList[p].userId === item.userId ||
          item.userId == undefined
        )
          return false;
      }
      return true;
    });

    return handleResponse(req, res, 200, { NOTparticipantsRoomList });
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 412, " Failed to fetch list with users! ");
  }
}

// return messages from a room
async function GetRoomMessages(req, res) {
  try {
    const roomID = req.body.ChannelID;

    if (roomID === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var messageRoomList = await GetRoomMessagesData(roomID)
      .then(function (result) {
        return result;
      })
      .catch((err) =>
        setImmediate(() => {
          throw err;
        })
      );

    var newMessageList = [];
    for (message in messageRoomList) {
      const userDetails = await GetUserByID(messageRoomList[message].senderID)
        .then(function (result) {
          return result;
        })
        .catch((err) =>
          setImmediate(() => {
            throw err;
          })
        );

      newMessageList.push({
        messageID: messageRoomList[message].ID_message,
        RoomID: messageRoomList[message].RoomID,
        senderID: messageRoomList[message].senderID,
        Body: messageRoomList[message].Body,
        createdTime: messageRoomList[message].createdTime,
        UserName: userDetails[0].Surname + " " + userDetails[0].Name,
      });
    }

    var res_roomId = await GetRoomFolderID(roomID)
      .then(function (result) {
        return result;
      })
      .catch((err) =>
        setImmediate(() => {
          throw err;
        })
      );

    const roomId_folder = JSON.parse(JSON.stringify(res_roomId));
    return handleResponse(req, res, 200, {
      messageRoomList: newMessageList,
      folderId: roomId_folder[0].folderId,
    });
  } catch (err) {
    console.error(err);
    return handleResponse(
      req,
      res,
      412,
      " Failed to fetch list with messages "
    );
  }
}

module.exports = {
  CreateNewRoom,
  DeleteRoom,
  CreateNewRoom_Group,
  AddNewMemberInGroup,
  GetPartList,
  GetNOTPartList,
  GetRoomMessages,
};
