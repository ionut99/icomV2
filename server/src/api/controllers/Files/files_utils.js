var fs = require("fs");

const {
  GetUserDetailsData,
  GetRoomDetails,
  GetParticipantFromPrivateConversation,
} = require("../../services/User");

// returns a promise which resolves true if file exists:
function checkFileExists(filepath) {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.constants.F_OK, (error) => {
      resolve(!error);
    });
  });
}

async function extractProfilePicturePath(userId, roomId) {
  if (userId === null) {
    return "";
  }
  if (roomId === null) {
    const userDetails = await GetUserDetailsData(userId);
    if (userDetails === "FAILED") {
      return "";
    }
    const result_userDetails = jsonStringParse(userDetails);
    if (result_userDetails.Avatar === null) {
      return "";
    }
    return result_userDetails.Avatar;
  } else if (roomId !== null) {
    const roomDetails = await GetRoomDetails(roomId);
    if (roomDetails === "FAILED") {
      return "";
    }
    const result_roomDetails = jsonStringParse(roomDetails);
    if (result_roomDetails.Private > 0) {
      const part2 = await GetParticipantFromPrivateConversation(roomId, userId);
      const part2_result = jsonStringParse(part2);
      const userDetails2 = await GetUserDetailsData(part2_result.userId);
      if (userDetails2 === "FAILED") {
        return "";
      }
      const result_userDetails2 = jsonStringParse(userDetails2);
      if (result_userDetails2.Avatar === null) return "";
      return result_userDetails2.Avatar;
    } else {
      if (result_roomDetails.Avatar === null) return "";
      return result_roomDetails.Avatar;
    }
  }

  return "";
}

// returns profile picture path
// if roomId != null extract from room table
function jsonStringParse(dataBaseResponse) {
  if (dataBaseResponse === null) return "";
  const result = JSON.parse(JSON.stringify(dataBaseResponse));
  return result[0];
}

// function deleteOldFileIfExist(pathTofile){
// const currentAvatarPath = results[0].Avatar;

//     if (
//       currentAvatarPath !== null &&
//       currentAvatarPath !== defaultAvatarPicure
//     ) {
//       fs.unlinkSync(currentAvatarPath, function (err) {
//         if (err) throw err;
//         // if no error, file has been deleted successfully
//         console.log("File deleted!");
//       });
//     }

// pathToStore = req.file.path.replace(/\\/g, "\\\\");
// }

module.exports = {
  checkFileExists,
  extractProfilePicturePath,
  jsonStringParse,
};
