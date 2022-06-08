var fs = require("fs");

const {
  GetUserDetailsData,
  GetRoomDetails,
  GetParticipantFromPrivateConversation,
} = require("../services/User");

// returns a promise which resolves true if file exists:
function checkFileExists(filepath) {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.constants.F_OK, (error) => {
      resolve(!error);
    });
  });
}

async function extractProfilePicturePath(userId, roomId) {
  try {
    if (userId === null || userId === undefined) {
      return "users/default/defaultAvatar.png";
    }
    if (roomId === null) {
      const userAvatar = await GetUserDetailsData(userId)
        .then(function (result) {
          if (result.length > 0) return result[0].avatar;
          else return undefined;
        })
        .catch((err) => {
          throw err;
        });

      if (userAvatar === undefined || userAvatar === null) {
        return "users/default/defaultAvatar.png";
      }
      return userAvatar;
    } else if (roomId !== null) {
      const roomDetails = await GetRoomDetails(roomId)
        .then(function (result) {
          if (result.length > 0) return result[0];
          else return undefined;
        })
        .catch((err) => {
          throw err;
        });

      if (roomDetails.private > 0) {
        const part2 = await GetParticipantFromPrivateConversation(
          roomId,
          userId
        )
          .then(function (result) {
            if (result.length > 0) return result[0];
            else return undefined;
          })
          .catch((err) => {
            throw err;
          });
        const userDetails2 = await GetUserDetailsData(part2.userId)
          .then(function (result) {
            if (result.length > 0) return result[0];
            else return undefined;
          })
          .catch((err) => {
            throw err;
          });

        if (userDetails2.avatar === null)
          return "users/default/defaultAvatar.png";
        return userDetails2.avatar;
      } else {
        if (roomDetails.avatar === null)
          return "users/default/defaultGroupAvatar.png";
        return roomDetails.avatar;
      }
    }
    return "users/default/defaultGroupAvatar.png";
  } catch (error) {
    console.error(error);
  }
}

// returns profile picture path
// if roomId != null extract from room table
function jsonStringParse(dataBaseResponse) {
  if (dataBaseResponse === null) return "";
  const result = JSON.parse(JSON.stringify(dataBaseResponse));
  return result[0];
}

module.exports = {
  checkFileExists,
  extractProfilePicturePath,
  jsonStringParse,
};
