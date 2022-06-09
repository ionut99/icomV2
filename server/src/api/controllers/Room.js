var uui = require("uuid");

const {
  AddNewMemberInGroupData,
  GetUserRoomsList,
} = require("../services/User");
const { GetUserByID } = require("../services/Auth");
const {
  InsertNewRoomData,
  InsertParticipantData,
  DeleteAllMessageFromRoom,
  DeleteAllParticipantsFromRoom,
  DeleteRoomData,
  GetPartListData,
  GetRoomDetailsData,
} = require("../services/Room");

const {
  InsertFolderUserRelationDataBase,
  InsertNewFolderDataBase,
  DeleteFolderUserRelation,
  DeleteRoomFolderAndUserRelation,
  // DeleteFolder,
} = require("../services/Folders");

const { GetRoomMessagesData, GetRoomFolderID } = require("../services/Room");

const { handleResponse } = require("../helpers/utils");
const { GetParticipantByID } = require("../services/Auth");
const { GetAllUsersDataBase } = require("../services/User");
const { CompleteMessageList } = require("../helpers/message_utils");

// --------------------- // -----------------------

// create new conversation (private group) - folders functions was updated
async function CreateNewRoom(req, res) {
  try {
    const roomName = req.body.roomName;
    const type = req.body.type;
    const userSearchListId = req.body.userSearchListId;
    const userId = req.body.userId;
    const uuidRoom = req.body.uuidRoom;

    if (
      roomName === "" ||
      type === null ||
      userSearchListId === null ||
      userId === null
    ) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    const roomResult = await InsertNewRoomData(roomName, type, uuidRoom)
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });

    if (roomResult === undefined) {
      return handleResponse(req, res, 412, " DataBase Error ");
    }

    var partResult = await InsertParticipantData(uuidRoom, userSearchListId)
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });

    if (partResult === undefined)
      return handleResponse(req, res, 412, " DataBase Error ");
    //
    partResult = await InsertParticipantData(uuidRoom, userId)
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });
    if (partResult === undefined)
      return handleResponse(req, res, 412, " DataBase Error ");

    // folder Creation
    const path = [];
    const folderId = uui.v4();
    const createdAt = new Date();
    const parentId = "root";

    var folderResult = await InsertNewFolderDataBase(
      folderId,
      roomName,
      parentId,
      userId,
      path,
      createdAt
    )
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });
    if (folderResult === undefined) {
      return handleResponse(req, res, 412, " DataBase Error ");
    }

    // new folder
    folderResult = await InsertFolderUserRelationDataBase(
      folderId,
      null,
      uuidRoom
    )
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });
    if (folderResult === undefined) {
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

// delete group or private conversation (room)
async function DeleteRoom(req, res) {
  try {
    const roomId = req.body.roomId;

    if (roomId === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var res_deletemes = await DeleteAllMessageFromRoom(roomId)
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });

    if (res_deletemes === undefined) {
      return handleResponse(req, res, 412, " Delete messages Error ");
    }

    var res_deletepart = await DeleteAllParticipantsFromRoom(roomId)
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });
    if (res_deletepart === undefined) {
      return handleResponse(req, res, 412, " Delete participants Error ");
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
    var res_del_room_folder = await DeleteRoomFolderAndUserRelation(roomId)
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });
    if (res_del_room_folder === undefined) {
      return handleResponse(req, res, 412, " Delete Room Elements Error ");
    }

    // delete subfolders??

    var res_deleteroom = await DeleteRoomData(roomId)
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });
    if (res_deleteroom === undefined) {
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
    const newGroupName = req.body.newGroupName;
    const type = req.body.type;
    const userId = req.body.userId;
    const uuidRoom = req.body.uuidRoom;

    if (
      newGroupName === "" ||
      type === null ||
      userId === null ||
      uuidRoom === null
    ) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    // adaugare camera noua in tabela
    var roomResult = await InsertNewRoomData(newGroupName, type, uuidRoom)
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });

    // adaugare participant la camera creata mai sus
    if (userId !== null) {
      var partResult = await InsertParticipantData(uuidRoom, userId)
        .then(function (result) {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    }

    // folder Creation for new group
    const path = [];
    const folderId = uui.v4();
    const createdAt = new Date();
    const parentId = "root";

    var create_folder_res = await InsertNewFolderDataBase(
      folderId,
      newGroupName,
      parentId,
      userId,
      path,
      createdAt
    )
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });

    // add folder relation for user whicj initiate conversation
    var folderResult = await InsertFolderUserRelationDataBase(
      folderId,
      null,
      uuidRoom
    )
      .then(function (result) {
        if (result.length > 0) return result[0];
        else return undefined;
      })
      .catch((err) => {
        throw err;
      });
    if (folderResult === undefined) {
      return handleResponse(req, res, 412, " Error storage folder ");
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
    const roomId = req.body.roomId;
    const userSearchListID = req.body.userSearchListID;

    if (roomId === "" || userSearchListID === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var participantDetails = await GetParticipantByID(userSearchListID, roomId)
      .then(function (result) {
        if (result.length > 0) return result;
        else return undefined;
      })
      .catch((err) => {
        throw err;
      });

    if (participantDetails !== undefined) {
      var result = await AddNewMemberInGroupData(roomId, userSearchListID)
        .then(function (result) {
          if (result.length > 0) return result;
        })
        .catch((err) => {
          throw err;
        });
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
    const roomId = req.body.roomId;

    if (roomId === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    const participantsRoomList = await GetPartListData(roomId)
      .then(function (result) {
        return result.map((x) => {
          const user = { ...x };
          return {
            userName: user.Surname + " " + user.Name,
            email: user.Email,
            userId: user.userId,
            IsAdmin: user.IsAdmin,
            IsOnline: user.IsOnline,
            LastOnline: user.LastOnline,
          };
        });
      })
      .catch((err) => {
        throw err;
      });

    return handleResponse(req, res, 200, { participantsRoomList });
  } catch (error) {
    console.log(error);
    return handleResponse(req, res, 412, " Failed to fetch participants list ");
  }
}

async function GetNOTPartList(req, res) {
  try {
    const roomId = req.body.roomId;
    const userId = req.body.userId;

    if (roomId === null || userId === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    // participants
    const participantsRoomList = await GetPartListData(roomId)
      .then(function (result) {
        return result.map((x) => {
          const user = { ...x };
          return {
            userName: user.surname + " " + user.name,
            userId: user.userId,
          };
        });
      })
      .catch((err) => {
        throw err;
      });

    // all users
    var NOTparticipantsRoomList = await GetAllUsersDataBase(userId)
      .then(function (result) {
        return result.map((x) => {
          const user = { ...x };
          return {
            userName: user.surname + " " + user.name,
            userId: user.userId,
          };
        });
      })
      .catch((err) => {
        throw err;
      });

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

async function GetRoomFolder(req, res) {
  try {
    const roomId = req.body.roomId;
    const userId = req.body.userId;

    if (roomId === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }
    //
    var room_folder = await GetRoomFolderID(roomId)
      .then(function (result) {
        if (result.length > 0) return result[0];
        else return undefined;
      })
      .catch((err) => {
        throw err;
      });

    var roomName = await GetRoomDetailsData(roomId)
      .then(function (result) {
        if (result.length > 0) return result[0].name;
        else return undefined;
      })
      .catch((err) => {
        throw err;
      });

    var userName = await GetUserByID(userId)
      .then(function (result) {
        if (result.length > 0) return result[0].surname + " " + result[0].name;
        else return undefined;
      })
      .catch((err) => {
        throw err;
      });

    roomName = roomName.replace(userName, "");
    roomName = roomName.replace("#", "");

    return handleResponse(req, res, 200, {
      folderId: room_folder.folderId,
      roomName: roomName,
    });
  } catch (err) {
    console.error(err);
    return handleResponse(req, res, 412, " Failed to fetch room folderID ");
  }
}

// return messages from a room
async function GetMessageListInTime(req, res) {
  try {
    const roomId = req.body.channelId;
    const messageTime = req.body.lastTime;
    const messagesPosition = req.body.position;

    if (roomId === null || messageTime === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var messageRoomList = await GetRoomMessagesData(
      roomId,
      messageTime,
      messagesPosition,
      15
    )
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });

    var newMessageList = await CompleteMessageList(messageRoomList);

    return handleResponse(req, res, 200, {
      messageRoomList: newMessageList,
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

// return all active connections
async function GetActiveRoomConnections(req, res) {
  try {
    const userId = req.body.userId;

    if (userId === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    const activeRoomConnections = await GetUserRoomsList(userId)
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });

    return handleResponse(req, res, 200, { activeRoomConnections });
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

// check if user can connect to a room
const roomIsFull = async (roomId, userId, usersAlreadyPresent) => {
  try {
    //
    const activeRoomConnections = await GetUserRoomsList(userId)
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });

    const index = activeRoomConnections.findIndex(
      (room) => room.roomId === roomId
    );
    if (index === -1) return true;

    // extrage detalii camera
    const roomType = await GetRoomDetailsData(roomId)
      .then(function (result) {
        if (result.length > 0) return result[0].private;
        else return 1;
      })
      .catch((err) => {
        throw err;
      });

    if (roomType > 0 && usersAlreadyPresent > 1) {
      return true;
    }

    return false;
    //
  } catch (err) {
    console.error(err);
    return true;
  }
};

module.exports = {
  CreateNewRoom,
  DeleteRoom,
  CreateNewRoom_Group,
  AddNewMemberInGroup,
  GetPartList,
  GetNOTPartList,
  GetMessageListInTime,
  GetRoomFolder,
  GetActiveRoomConnections,
  roomIsFull,
};
