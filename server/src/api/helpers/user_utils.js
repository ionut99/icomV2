const date = require("date-and-time");
var sha512 = require("js-sha512");
const {
  GetRoomMessagesData,
  GetNumberOfParticipantsOfRoom,
} = require("../services/Room");

const Characters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-=+";

function generateRandomSalt(length) {
  let salt = "";
  for (let i = 0; i < length; i++) {
    salt += Characters.charAt(Math.floor(Math.random() * Characters.length));
  }
  return salt;
}

function generateOfuscatedPassword(plainText, salt) {
  const pepper = "VSNDJNCOSDICIODNCSNVSFOokewjre8j9ewjc9w!@#($)#";
  const salt_length = 64;

  let hash = sha512(salt + plainText + pepper);
  for (let i = 0; i < 100; i++) {
    hash = sha512(hash);
  }

  return hash;
}

function sortPersonstAfterSearchText(list, keyword) {
  return list
    .filter((prof) => {
      // Filter results by doing case insensitive match on name here
      return prof.userName.toLowerCase().includes(keyword.toLowerCase());
    })
    .sort((a, b) => {
      // Sort results by matching name with keyword position in name
      if (
        a.userName.toLowerCase().indexOf(keyword.toLowerCase()) >
        b.userName.toLowerCase().indexOf(keyword.toLowerCase())
      ) {
        return 1;
      } else if (
        a.userName.toLowerCase().indexOf(keyword.toLowerCase()) <
        b.userName.toLowerCase().indexOf(keyword.toLowerCase())
      ) {
        return -1;
      } else {
        if (a.userName > b.userName) return 1;
        else return -1;
      }
    });
}

function sortRoomAfterSearchText(list, keyword) {
  return list
    .filter((prof) => {
      // Filter results by doing case insensitive match on name here
      return prof.roomName.toLowerCase().includes(keyword.toLowerCase());
    })
    .sort((a, b) => {
      // Sort results by matching name with keyword position in name
      if (
        a.roomName.toLowerCase().indexOf(keyword.toLowerCase()) >
        b.roomName.toLowerCase().indexOf(keyword.toLowerCase())
      ) {
        return 1;
      } else if (
        a.roomName.toLowerCase().indexOf(keyword.toLowerCase()) <
        b.roomName.toLowerCase().indexOf(keyword.toLowerCase())
      ) {
        return -1;
      } else {
        if (a.roomName > b.roomName) return 1;
        else return -1;
      }
    });
}

function sortRoomAfterType(list) {
  return list
    .sort((a, b) => {
      if (a.Name > b.Name) {
        return 1;
      } else if (a.Name < b.Name) {
        return -1;
      } else {
        if (a.Name > b.Name) return 1;
        else return -1;
      }
    })
    .sort((a, b) => {
      if (a.Private > b.Private) {
        return 1;
      } else if (a.Private < b.Private) {
        return -1;
      } else {
        if (a.Private > b.Private) return 1;
        else return -1;
      }
    });
}

async function AddLastMessage(RoomList) {
  try {
    var room_result = [];
    for (let i = 0; i < RoomList.length; i++) {
      const timevar = date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS");
      const roomMessage = await GetRoomMessagesData(
        RoomList[i].roomId,
        timevar,
        "top",
        1
      )
        .then(function (result) {
          if (result.length === 0) return "";
          return result[0];
        })
        .catch((err) => {
          throw err;
        });

      room_result.push({
        roomId: RoomList[i].roomId,
        roomName: RoomList[i].roomName,
        type: RoomList[i].type,
        lastMessage: roomMessage.body,
        lastMessageTime: roomMessage.createdTime,
      });
    }

    return room_result;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function AddNumberOfParticipants(RoomList) {
  try {
    var room_result = [];
    for (let i = 0; i < RoomList.length; i++) {
      const partNumber = await GetNumberOfParticipantsOfRoom(RoomList[i].ID)
        .then(function (result) {
          return result.length;
        })
        .catch((err) =>
          setImmediate(() => {
            throw err;
          })
        );

      room_result.push({
        RoomID: RoomList[i].ID,
        Name: RoomList[i].Name,
        Type: RoomList[i].Private,
        Part: partNumber,
      });
    }

    return room_result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = {
  generateRandomSalt,
  generateOfuscatedPassword,
  sortPersonstAfterSearchText,
  sortRoomAfterSearchText,
  AddLastMessage,
  sortRoomAfterType,
  AddNumberOfParticipants,
};
