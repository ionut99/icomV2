const path = require("path");
var fs = require("fs");
//
var crypto = require("crypto");
//
var date = require("date-and-time");
//
// const { encryptString } = require("./security");
//
const ALGORITHM_KEY_SIZE = 32;
const PBKDF2_NAME = "sha256";
const PBKDF2_ITERATIONS = 32767;
//
const {
  GetUserDetailsData,
  GetRoomDetails,
  GetParticipantFromPrivateConversation,
} = require("../services/User");

const {
  InsertNewFileDataBase,
  InsertNewFileRelationDataBase,
} = require("../services/Files");

//
const { GetFolderDetailsService } = require("../services/Folders");

//

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
      return "default/defaultAvatar.png";
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
        return "default/defaultAvatar.png";
      }
      return userAvatar;
      //
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

        if (userDetails2.avatar === null) return "default/defaultAvatar.png";
        return userDetails2.avatar;
      } else {
        if (roomDetails.avatar === null)
          return "default/defaultGroupAvatar.png";
        return roomDetails.avatar;
      }
    }
    return "default/defaultGroupAvatar.png";
  } catch (error) {
    console.error(error);
  }
}

const CreateFileUserRelation = async (folderId, fileId, userId) => {
  //
  try {
    if (folderId === "root") {
      return InsertNewFileRelationDataBase(fileId, userId, null)
        .then(function (result) {
          return result.affectedRows;
        })
        .catch((err) => {
          throw err;
        });
    } else {
      const parentId = await GetFolderDetailsService(folderId)
        .then(function (result) {
          if (result.length > 0) return result[0];
          else return undefined;
        })
        .catch((err) => {
          throw err;
        });

      if (parentId === undefined) return 0;
      //
      if (parentId.roomIdBeneficiary !== null) {
        //
        return InsertNewFileRelationDataBase(
          fileId,
          userId,
          parentId.roomIdBeneficiary
        )
          .then(function (result) {
            return result.affectedRows;
          })
          .catch((err) => {
            throw err;
          });
      } else {
        //
        return InsertNewFileRelationDataBase(fileId, userId, null)
          .then(function (result) {
            return result.affectedRows;
          })
          .catch((err) => {
            throw err;
          });
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const saveFileConfiguration = async (
  userId,
  fileName,
  fileId,
  fileType,
  fileSize,
  folderId
) => {
  try {
    const oldPath = path.join(__dirname, "../../../users/tempDir/", fileName);
    const newPath = path.join(__dirname, "../../../users/", userId);

    try {
      if (!(await checkFileExists(newPath))) {
        console.log("Nu exista folderr...");
        fs.mkdir(newPath, { recursive: true }, async function (err) {
          if (err) throw err;
          console.log("Directory created successfully!");
        });
      } else {
        console.log("File with same name already exist...");
      }
    } catch (err) {
      throw err;
    }

    //
    const createdTime = date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS");
    const numericTime = Date.now();

    let iv = crypto.randomBytes(16).toString("ascii");
    //
    let secretKey = crypto.pbkdf2Sync(
      Buffer.from(fileId, "utf8"),
      iv,
      PBKDF2_ITERATIONS,
      ALGORITHM_KEY_SIZE,
      PBKDF2_NAME
    );
    //
    try {
      //

      var cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
      var input = fs.createReadStream(oldPath);
      var output = fs.createWriteStream(
        newPath + "/" + numericTime + " " + fileName
      );

      input.pipe(cipher).pipe(output);

      output.on("finish", function () {
        // console.log("Successfully encrypted file!");
        // delete file
        fs.unlink(oldPath, (err) => {
          if (err) {
            throw err;
          }
        });
      });
      //
    } catch (err) {
      throw err;
    }

    var pathToStore = path.join(userId + "/", numericTime + " " + fileName);
    pathToStore = pathToStore.replace(/\\/g, "\\\\");

    //
    var res_service = await InsertNewFileDataBase(
      fileId,
      fileType,
      fileName,
      folderId,
      createdTime,
      userId,
      fileSize,
      pathToStore,
      iv
    )
      .then(function (result) {
        return result.affectedRows;
      })
      .catch((err) => {
        throw err;
      });

    if (res_service !== 1) return res_service;

    return await CreateFileUserRelation(folderId, fileId, userId);
    //
    //
  } catch (error) {
    console.error(error);
  }
};

//
//read custom text file
async function readCustomFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return false;
  }
}

//write custom text file ...(before write check if file already is in system)
async function writeCustomFile(filePath, fileName, writedata) {
  try {
    try {
      if (!(await checkFileExists(filePath))) {
        fs.mkdir(filePath, { recursive: true }, async function (err) {
          if (err) throw err;
          console.log("Directory created successfully!");
        });
      }
    } catch (err) {
      throw err;
    }

    //
    try {
      await fs.promises.writeFile(
        filePath + "/" + fileName,
        JSON.stringify(writedata, null, 4),
        "utf8"
      );
    } catch (err) {
      throw err;
    }
    return true;
  } catch (err) {
    //
    console.error(err);
    return false;
  }
}

module.exports = {
  checkFileExists,
  extractProfilePicturePath,
  saveFileConfiguration,
  readCustomFile,
  writeCustomFile,
  CreateFileUserRelation,
};
