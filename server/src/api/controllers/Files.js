const multer = require("multer");
const path = require("path");
var fs = require("fs");
// const dayjs = require("dayjs");
var uui = require("uuid");

const {
  UpdateAvatarPathData,
  GetUserDetailsData,
  GetRoomDetails,
  GetPrivateRoomOtherUserDetails,
} = require("../services/User");
const { handleResponse } = require("../helpers/utils");
const {
  InsertNewFileDataBase,
  InsertNewFileRelationDataBase,
} = require("../services/Files");
const { dir } = require("console");

const defaultAvatarPicure = path.join(
  __dirname,
  "../../../",
  "users/images/avatar/default.png"
);

const storageAvatar = multer.diskStorage({
  destination: path.join(__dirname, "../../../users/images/", "avatar"),
  filename: function (req, file, cb) {
    // null as first argument means no error
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const storageFile = multer.diskStorage({
  destination: path.join(__dirname, "../../../users/tempDir/"),
  filename: function (req, file, cb) {
    // null as first argument means no error
    cb(null, file.originalname);
  },
});

async function UpdateProfilePicture(req, res) {
  try {
    let upload = multer({ storage: storageAvatar }).single("avatar");
    upload(req, res, async (err) => {
      if (!req.file) {
        return handleResponse(
          req,
          res,
          413,
          "Please select an image to upload"
        );
      } else if (err instanceof multer.MulterError) {
        return handleResponse(req, res, 415, "Multer Error");
      } else if (err) {
        return handleResponse(
          req,
          res,
          413,
          "Please select an image to upload"
        );
      }
      const userID = req.body.userID;
      //must to delete old avatar photo befor upload next one

      const userDetails = await GetUserDetailsData(userID);
      const results = JSON.parse(JSON.stringify(userDetails));
      // console.log("Detalii despre useri:");
      // console.log(results);
      const currentAvatarPath = results[0].Avatar;

      if (
        currentAvatarPath !== null &&
        currentAvatarPath !== defaultAvatarPicure
      ) {
        fs.unlinkSync(currentAvatarPath, function (err) {
          if (err) throw err;
          // if no error, file has been deleted successfully
          console.log("File deleted!");
        });
      }

      // pathToStore = req.file.path.replace(/\\/g, "\\\\");
      var pathToStore = path.join("users/images/avatar/", req.file.filename);
      pathToStore = pathToStore.replace(/\\/g, "\\\\");
      // console.log(pathToStore);

      const result = await UpdateAvatarPathData(userID, pathToStore);
      if (result === "FAILED") {
        return handleResponse(req, res, 412, " DataBase Error ");
      }

      return handleResponse(req, res, 200, { UpdateProfilePicture: "SUCCESS" });
    });
  } catch (err) {
    //console.log(err);
    return handleResponse(req, res, 190, { UpdateProfilePicture: "FAILED" });
  }
}

// returns a promise which resolves true if file exists:
function checkFileExists(filepath) {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.constants.F_OK, (error) => {
      resolve(!error);
    });
  });
}

// handle Upload New File
async function UploadNewStoredFile(req, res) {
  try {
    let upload = multer({ storage: storageFile }).single("storedfile");

    upload(req, res, async (err) => {
      if (!req.file) {
        console.log(req.file);
        return handleResponse(
          req,
          res,
          413,
          "Please select a real file to upload"
        );
      } else if (err instanceof multer.MulterError) {
        return handleResponse(req, res, 415, "Multer Error");
      } else if (err) {
        return handleResponse(req, res, 413, "Error when try to upload a file");
      }

      const fileId = uui.v4();
      const fileName = req.body.fileName;
      const folderId = req.body.folderId;
      const userId = req.body.userId;
      const createdTime = req.body.createdTime;

      const oldPath = path.join(__dirname, "../../../users/tempDir/", fileName);
      const newPath = path.join(__dirname, "../../../users/", userId);

      try {
        if (!(await checkFileExists(newPath))) {
          console.log("Nu exista folderr...");
          fs.mkdir(newPath, { recursive: true }, (err) => {
            if (err) {
              return console.error(err);
            }
            console.log("Directory created successfully!");
          });
        }
      } catch (err) {
        console.error(err);
      }

      fs.rename(oldPath, newPath + "/" + fileName, async function (err) {
        if (err) {
          throw err;
        } else {
          console.log("Successfully storage the file!");

          //Store File details in database
          const result = await InsertNewFileDataBase(
            fileId,
            fileName,
            folderId,
            createdTime,
            userId
          );

          if (result === "FAILED") {
            console.log("Error storage folder configuration!");
            return handleResponse(req, res, 412, " DataBase Error ");
          }

          const res_relation = await InsertNewFileRelationDataBase(
            fileId,
            userId,
            null
          );

          if (res_relation === "FAILED") {
            console.log("Error storage folder configuration!");
            return handleResponse(req, res, 412, " DataBase Error ");
          }

          return handleResponse(req, res, 190, { StorageFile: "SUCCESS" });
        }
      });
    });
  } catch (err) {
    return handleResponse(req, res, 190, { StorageFile: "FAILED" });
  }
}

async function GetProfilePicture(req, res) {
  try {
    const ID = req.body.ID;
    const atuhUser = req.body.atuhUser;
    const ISroom = req.body.ISroom;

    if (
      ID === null ||
      ID === undefined ||
      ISroom === undefined ||
      ISroom === null ||
      atuhUser === undefined ||
      atuhUser === null
    ) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var currentAvatarPath = "";

    if (!ISroom) {
      const userDetails = await GetUserDetailsData(ID);
      if (userDetails === "FAILED") {
        throw new Error("  Err Get User Details  ");
      }
      const results = JSON.parse(JSON.stringify(userDetails));
      if (results[0].Avatar != undefined) {
        currentAvatarPath = results[0].Avatar;
      }
    } else {
      // TO DO - find user from Room OR... if is public room we display

      const roomDetails = await GetRoomDetails(ID);
      if (roomDetails === "FAILED") {
        throw new Error("  Err Get Room Details  ");
      }
      const results = JSON.parse(JSON.stringify(roomDetails));
      if (results[0].Private > 0) {
        const theOtherUser = await GetPrivateRoomOtherUserDetails(ID, atuhUser);
        if (theOtherUser === "FAILED") {
          throw new Error("  Err Other User Details  ");
        }
        const theOtherUserJson = JSON.parse(JSON.stringify(theOtherUser));

        const userDetails = await GetUserDetailsData(
          theOtherUserJson[0].UserID
        );
        if (userDetails === "FAILED") {
          throw new Error("  Err Get User Details  ");
        }

        const results = JSON.parse(JSON.stringify(userDetails));
        if (results[0].Avatar != undefined) {
          currentAvatarPath = results[0].Avatar;
        }
      } else {
        // to do pentru grupuri...
      }
    }

    if (currentAvatarPath === "") {
      currentAvatarPath = defaultAvatarPicure;
    } else {
      currentAvatarPath = path.join(__dirname, "../../../", currentAvatarPath);
    }

    var options = {
      //root: path.join(__dirname, "public"),
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
      },
    };

    if (currentAvatarPath !== null && currentAvatarPath !== "") {
      // console.log("calea este: ");
      // console.log(currentAvatarPath);

      res.sendFile(currentAvatarPath, options, function (error) {
        if (error) {
          // throw new Error("  Err send File  ");
          //return handleResponse(req, res, 410, " Err send File ");
          console.error(error);
          return handleResponse(req, res, 410, "  Err send File  ");
        }
      });
    } else {
      // throw new Error(" EmptyAvatar ");
      //return handleResponse(req, res, 513, "EmptyAvatar");
      console.error(" Empty Avatar ");
      return handleResponse(req, res, 410, "  Err send File  ");
    }
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 410, "  Err send File  ");
  }
}

module.exports = {
  UpdateProfilePicture,
  GetProfilePicture,
  UploadNewStoredFile,
};
